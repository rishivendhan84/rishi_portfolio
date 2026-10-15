// Hybrid retrieval over the bundled index: BM25 keyword scores and vector
// cosine similarity, merged with Reciprocal Rank Fusion, then a relevance gate
// that lets the bot say "I don't have that" instead of guessing.

// Starting values, tuned against eval/questions.jsonl. Not universal constants.
export const CONFIG = {
  candidates: 20, // per retriever, before fusion
  k: 5, // chunks handed to the model
  rrfK: 60,
  // Hybrid gate, tuned on the 2026-10-15 eval. Cosine alone does not separate
  // on-topic from off-topic ("Does he know MCP?" 0.344 vs "weather in Mumbai"
  // 0.345), but off-topic questions share no vocabulary with the corpus. So a
  // question passes on a strong semantic match, or a moderate one backed by at
  // least one keyword hit, or a strong keyword match on its own.
  strongCosine: 0.4,
  minCosine: 0.3,
  minBm25Support: 1.0,
  bm25Override: 8.0,
  // BM25-only gate. Keyword scores of answerable and unanswerable questions
  // overlap ("Kubernetes" 3.89 vs "MCP" 3.89), so this mode is a baseline only.
  minBm25: 4.0,
  bm25: { k1: 1.2, b: 0.75 },
};

const STOPWORDS = new Set(
  ('a an and are as at be been but by can could did do does for from had has have he her his how i if in ' +
    'into is it its me my of on or our she so than that the their them then there these they this to was ' +
    'we were what when where which who why will with would you your about tell any all also just more ' +
    'rishi rishis vendhan does did has')
    .split(' '),
);

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/['’]s\b/g, '')
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map((t) => (t.length > 4 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t));
}

export class Bm25 {
  constructor(docs, { k1, b } = CONFIG.bm25) {
    this.k1 = k1;
    this.b = b;
    this.tfs = docs.map((d) => {
      const tf = new Map();
      for (const t of tokenize(d)) tf.set(t, (tf.get(t) || 0) + 1);
      return tf;
    });
    this.lens = this.tfs.map((tf) => [...tf.values()].reduce((a, n) => a + n, 0));
    this.avgdl = this.lens.reduce((a, n) => a + n, 0) / (docs.length || 1);
    this.df = new Map();
    for (const tf of this.tfs) for (const t of tf.keys()) this.df.set(t, (this.df.get(t) || 0) + 1);
    this.n = docs.length;
  }

  idf(t) {
    const df = this.df.get(t) || 0;
    return Math.log(1 + (this.n - df + 0.5) / (df + 0.5));
  }

  scores(query) {
    const terms = [...new Set(tokenize(query))];
    return this.tfs.map((tf, i) => {
      let s = 0;
      for (const t of terms) {
        const f = tf.get(t);
        if (!f) continue;
        const norm = f + this.k1 * (1 - this.b + (this.b * this.lens[i]) / this.avgdl);
        s += this.idf(t) * ((f * (this.k1 + 1)) / norm);
      }
      return s;
    });
  }
}

export function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

// Indices sorted by score, descending, keeping only positive scores.
function ranked(scores, limit) {
  return scores
    .map((s, i) => [i, s])
    .filter(([, s]) => s > 0)
    .sort((x, y) => y[1] - x[1])
    .slice(0, limit)
    .map(([i]) => i);
}

export function rrf(lists, k = CONFIG.rrfK) {
  const fused = new Map();
  for (const list of lists) {
    list.forEach((idx, rank) => fused.set(idx, (fused.get(idx) || 0) + 1 / (k + rank + 1)));
  }
  return [...fused.entries()].sort((x, y) => y[1] - x[1]);
}

// embedQuery: async (text) => normalized vector. Omit it for BM25-only mode.
export function createRetriever(index, { embedQuery, config = CONFIG } = {}) {
  const chunks = index.chunks;
  const bm25 = new Bm25(chunks.map((c) => c.text), config.bm25);
  const hasVectors = Boolean(embedQuery) && chunks.every((c) => Array.isArray(c.embedding));
  const mode = hasVectors ? 'hybrid' : 'bm25';

  return {
    mode,
    async retrieve(query, { k = config.k } = {}) {
      const bmScores = bm25.scores(query);
      const lists = [ranked(bmScores, config.candidates)];
      let cosines = null;
      if (hasVectors) {
        const qv = await embedQuery(query);
        cosines = chunks.map((c) => dot(qv, c.embedding));
        lists.push(ranked(cosines, config.candidates));
      }
      const results = rrf(lists, config.rrfK)
        .slice(0, k)
        .map(([i, fused]) => ({
          id: chunks[i].id,
          chunk: chunks[i],
          fused,
          bm25: bmScores[i],
          cosine: cosines ? cosines[i] : null,
        }));

      const topBm25 = Math.max(0, ...bmScores);
      const topCosine = cosines ? Math.max(...cosines) : null;
      const passed = hasVectors
        ? topCosine >= config.strongCosine ||
          (topCosine >= config.minCosine && topBm25 >= config.minBm25Support) ||
          topBm25 >= config.bm25Override
        : topBm25 >= config.minBm25;
      return { mode, results: passed ? results : [], candidates: results, gate: { passed, topBm25, topCosine } };
    },
  };
}
