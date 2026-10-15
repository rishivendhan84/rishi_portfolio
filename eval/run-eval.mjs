// Retrieval eval over eval/questions.jsonl.
//
//   npm run eval            uses vectors if the index has them and OPENAI_API_KEY is set
//   npm run eval -- --bm25  force the keyword-only baseline
//
// Metrics:
//   hit@k     answerable + declined: an expected chunk is in the top k
//   MRR       mean reciprocal rank of the first expected chunk
//   gate      answerable + declined should pass the relevance gate,
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
let hits = 0, hitN = 0, rr = 0, gateOk = 0, gateN = 0, skippedPhase3 = 0;
const missingSources = [];

for (const r of rows) {
  if (r.type === 'adversarial') { skippedPhase3++; continue; }
  const missing = r.expect.filter((id) => !known.has(id));
  if (missing.length) { missingSources.push(`${r.id}: ${missing.join(', ')}`); continue; }

  const { results, candidates, gate } = await retriever.retrieve(r.q);
  const shouldPass = r.type !== 'unanswerable';
  gateN++;
  if (gate.passed === shouldPass) gateOk++;

  let rank = null;
  if (shouldPass) {
    hitN++;
    const pos = candidates.findIndex((c) => r.expect.includes(c.id));
    if (pos >= 0) { hits++; rank = pos + 1; rr += 1 / rank; }
  }
  const top = candidates[0];
  const mark = (shouldPass ? rank && gate.passed : !gate.passed) ? 'ok' : 'MISS';
  lines.push(
    `| ${r.id} | ${r.type} | ${r.q} | ${rank ?? '-'} | ${gate.passed ? 'pass' : 'stop'} | ` +
      `${gate.topBm25.toFixed(2)} | ${gate.topCosine == null ? '-' : gate.topCosine.toFixed(3)} | ` +
      `${top ? top.id : '-'} | ${mark} |`,
  );
}

const hitAtK = hits / (hitN || 1);
const mrr = rr / (hitN || 1);
const gateAcc = gateOk / (gateN || 1);
const pct = (x) => `${(x * 100).toFixed(0)}%`;

const report = `# Retrieval eval

- Run: ${new Date().toISOString()}
- Mode: **${retriever.mode}**${retriever.mode === 'bm25' ? ' (keyword baseline, no embeddings)' : ''}
- Index: ${index.meta.chunks} chunks, built ${index.meta.built_at}${index.meta.complete ? '' : `, DRAFT (skipped ${index.meta.skipped.join(', ')})`}
- Config: top ${CONFIG.k}, ${CONFIG.candidates} candidates per retriever, RRF k=${CONFIG.rrfK}, gate ${retriever.mode === 'hybrid' ? `minCosine=${CONFIG.minCosine}, bm25Override=${CONFIG.bm25Override}` : `minBm25=${CONFIG.minBm25}`}

| Metric | Result | Target |
|---|---|---|
| hit@${CONFIG.k} (answerable + declined, n=${hitN}) | ${pct(hitAtK)} (${hits}/${hitN}) | ${pct(TARGETS.hitAtK)} |
| MRR | ${mrr.toFixed(3)} | |
| Relevance gate correct (n=${gateN}) | ${pct(gateAcc)} (${gateOk}/${gateN}) | ${pct(TARGETS.gate)} |
| Adversarial (answer-level) | ${skippedPhase3} rows, run in phase 3 | |
${missingSources.length ? `\nRows skipped because their source is not in this index: ${missingSources.join('; ')}\n` : ''}
| id | type | question | rank | gate | top BM25 | top cosine | top chunk | |
|---|---|---|---|---|---|---|---|---|
${lines.join('\n')}
`;

await writeFile(`${ROOT}eval/results.md`, report);
console.log(
  `${retriever.mode}: hit@${CONFIG.k} ${pct(hitAtK)} (${hits}/${hitN}), MRR ${mrr.toFixed(3)}, ` +
    `gate ${pct(gateAcc)} (${gateOk}/${gateN}). Details in eval/results.md`,
);
if (args.has('--strict') && (hitAtK < TARGETS.hitAtK || gateAcc < TARGETS.gate)) process.exit(1);
