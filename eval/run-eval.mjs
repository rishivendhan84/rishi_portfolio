// Retrieval eval over eval/questions.jsonl.
//
//   npm run eval            uses vectors if the index has them and OPENAI_API_KEY is set
//   npm run eval -- --bm25  force the keyword-only baseline
//
// Metrics:
//   hit@k     answerable, declined, absent: an expected chunk is in the top k
//   MRR       mean reciprocal rank of the first expected chunk
//   gate      answerable, declined, absent should pass the relevance gate,
//             unanswerable should be stopped by it
// Adversarial rows test the answer, not retrieval: they run in phase 3.
// Writes eval/results.md; --strict exits 1 below the targets.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRetriever, CONFIG } from '../lib/retrieve.js';
import { embedTexts } from '../lib/embed.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TARGETS = { hitAtK: 0.9, gate: 1.0 };

const args = new Set(process.argv.slice(2));
const index = JSON.parse(await readFile(`${ROOT}data/index.json`, 'utf8'));
const rows = (await readFile(`${ROOT}eval/questions.jsonl`, 'utf8'))
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));

const canEmbed = !args.has('--bm25') && index.meta.embedding && process.env.OPENAI_API_KEY;
const retriever = createRetriever(index, {
  embedQuery: canEmbed ? async (q) => (await embedTexts([q]))[0] : undefined,
});

const known = new Set(index.chunks.map((c) => c.id));
const lines = [];
const missingSources = [];
let skippedPhase3 = 0;
// Questions written after the gate was tuned are scored separately, so the
// tuned numbers cannot hide overfitting.
const stats = { tuned: newStats(), heldout: newStats() };
function newStats() {
  return { hits: 0, hitN: 0, rr: 0, gateOk: 0, gateN: 0 };
}

for (const r of rows) {
  if (r.type === 'adversarial') { skippedPhase3++; continue; }
  const missing = r.expect.filter((id) => !known.has(id));
  if (missing.length) { missingSources.push(`${r.id}: ${missing.join(', ')}`); continue; }

  const st = stats[r.heldout ? 'heldout' : 'tuned'];
  const { candidates, gate } = await retriever.retrieve(r.q);
  // "absent" = asks about a skill he does not list: retrieval should reach his
  // skills so the model can say it is not listed (checked in phase 3).
  const shouldPass = r.type !== 'unanswerable';
  st.gateN++;
  if (gate.passed === shouldPass) st.gateOk++;

  let rank = null;
  if (shouldPass) {
    st.hitN++;
    const matches = (id) => r.expect.includes(id) || (r.expectPrefix && id.startsWith(r.expectPrefix));
    const pos = candidates.findIndex((c) => matches(c.id));
    if (pos >= 0) { st.hits++; rank = pos + 1; st.rr += 1 / rank; }
  }
  const top = candidates[0];
  const mark = (shouldPass ? rank && gate.passed : !gate.passed) ? 'ok' : 'MISS';
  lines.push(
    `| ${r.id}${r.heldout ? '*' : ''} | ${r.type} | ${r.q} | ${rank ?? '-'} | ${gate.passed ? 'pass' : 'stop'} | ` +
      `${gate.topBm25.toFixed(2)} | ${gate.topCosine == null ? '-' : gate.topCosine.toFixed(3)} | ` +
      `${top ? top.id : '-'} | ${mark} |`,
  );
}

const pct = (x) => `${(x * 100).toFixed(0)}%`;
const summarize = (st) => ({
  hitAtK: st.hits / (st.hitN || 1),
  mrr: st.rr / (st.hitN || 1),
  gate: st.gateOk / (st.gateN || 1),
  ...st,
});
const T = summarize(stats.tuned);
const H = summarize(stats.heldout);
const gateCfg =
  retriever.mode === 'hybrid'
    ? `strongCosine=${CONFIG.strongCosine}, minCosine=${CONFIG.minCosine} with BM25>=${CONFIG.minBm25Support}, bm25Override=${CONFIG.bm25Override}`
    : `minBm25=${CONFIG.minBm25}`;
const row = (name, x) =>
  `| ${name} | ${pct(x.hitAtK)} (${x.hits}/${x.hitN}) | ${x.mrr.toFixed(3)} | ${pct(x.gate)} (${x.gateOk}/${x.gateN}) |`;

const report = `# Retrieval eval

- Run: ${new Date().toISOString()}
- Mode: **${retriever.mode}**${retriever.mode === 'bm25' ? ' (keyword baseline, no embeddings)' : ''}
- Index: ${index.meta.chunks} chunks, built ${index.meta.built_at}${index.meta.complete ? '' : `, DRAFT (skipped ${index.meta.skipped.join(', ')})`}
- Config: top ${CONFIG.k}, ${CONFIG.candidates} candidates per retriever, RRF k=${CONFIG.rrfK}, gate ${gateCfg}

| Set | hit@${CONFIG.k} | MRR | Relevance gate correct |
|---|---|---|---|
${row('Tuned on', T)}
${H.gateN ? row('Held out (written after tuning) *', H) : ''}

Targets: hit@${CONFIG.k} ${pct(TARGETS.hitAtK)}, gate ${pct(TARGETS.gate)}. Adversarial rows (${skippedPhase3}) test answers, not retrieval, and run in phase 3.
${missingSources.length ? `\nRows skipped because their source is not in this index: ${missingSources.join('; ')}\n` : ''}
| id | type | question | rank | gate | top BM25 | top cosine | top chunk | |
|---|---|---|---|---|---|---|---|---|
${lines.join('\n')}
`;

await writeFile(`${ROOT}eval/results.md`, report);
const line = (n, x) => `${n}: hit@${CONFIG.k} ${pct(x.hitAtK)} (${x.hits}/${x.hitN}), MRR ${x.mrr.toFixed(3)}, gate ${pct(x.gate)} (${x.gateOk}/${x.gateN})`;
console.log(`${retriever.mode} | ${line('tuned', T)}${H.gateN ? ` | ${line('held-out', H)}` : ''}. Details in eval/results.md`);
const all = summarize(Object.fromEntries(Object.keys(T).filter((k) => k in stats.tuned).map((k) => [k, stats.tuned[k] + stats.heldout[k]])));
if (args.has('--strict') && (all.hitAtK < TARGETS.hitAtK || all.gate < TARGETS.gate)) process.exit(1);
