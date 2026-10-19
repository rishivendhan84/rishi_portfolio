import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunkMarkdown, parseFrontmatter, MAX_CHARS } from '../lib/chunk.js';
import { tokenize, Bm25, rrf, createRetriever } from '../lib/retrieve.js';
import { normalize } from '../lib/embed.js';

const DOC = `---\r\ntitle: Demo\r\nsource: https://example.test/demo\r\n---\r\n\r\n# Demo\r\n\r\n## Stack\r\n\r\nFastAPI and pgvector.\r\n\r\n## Testing\r\n\r\n33 tests.\r\n`;

test('frontmatter parses with CRLF line endings', () => {
  const { meta, body } = parseFrontmatter(DOC);
  assert.equal(meta.title, 'Demo');
  assert.equal(meta.source, 'https://example.test/demo');
  assert.ok(body.startsWith('\n# Demo'));
});

test('one chunk per H2, with title and heading prefixed', () => {
  const chunks = chunkMarkdown(DOC, 'projects/demo');
  assert.deepEqual(chunks.map((c) => c.id), ['projects/demo#stack', 'projects/demo#testing']);
  assert.equal(chunks[0].text, 'Demo > Stack\nFastAPI and pgvector.');
  assert.equal(chunks[0].url, 'https://example.test/demo');
});

test('long sections split under the size limit with suffixed ids', () => {
  const para = 'word '.repeat(150).trim(); // ~750 chars
  const md = `---\ntitle: Long\n---\n## Big\n\n${[para, para, para, para].join('\n\n')}\n`;
  const chunks = chunkMarkdown(md, 'long');
  assert.ok(chunks.length >= 2);
  assert.equal(chunks[1].id, 'long#big-2');
  for (const c of chunks) assert.ok(c.text.length <= MAX_CHARS + 100);
});

test('tokenizer drops stopwords, possessives and plural s', () => {
  assert.deepEqual(tokenize("What are Rishi's agents built with?"), ['agent', 'built']);
  assert.deepEqual(tokenize('gpt-4o-mini and C++'), ['gpt', '4o', 'mini', 'c++']);
});

test('BM25 ranks the document with the rare term first', () => {
  const bm = new Bm25(['react node postgres', 'langgraph agent state machine', 'react dashboards']);
  const s = bm.scores('langgraph');
  assert.ok(s[1] > 0);
  assert.equal(s[0], 0);
  assert.equal(s[2], 0);
});

test('RRF rewards agreement between lists', () => {
  const fused = rrf([[0, 1, 2], [1, 0, 3]]);
  assert.ok([0, 1].includes(fused[0][0]));
  assert.ok(fused.find(([i]) => i === 3)[1] < fused[0][1]);
});

test('gate stops a query with no lexical or semantic match', async () => {
  const index = { chunks: chunkMarkdown(DOC, 'projects/demo') };
  const r = createRetriever(index);
  assert.equal(r.mode, 'bm25');
  const miss = await r.retrieve('favorite movie');
  assert.equal(miss.gate.passed, false);
  assert.deepEqual(miss.results, []);
});

test('hybrid mode uses cosine for the gate', async () => {
  const chunks = chunkMarkdown(DOC, 'projects/demo');
  chunks[0].embedding = normalize([1, 0]);
  chunks[1].embedding = normalize([0, 1]);
  const r = createRetriever({ chunks }, { embedQuery: async () => normalize([0.1, 1]) });
  assert.equal(r.mode, 'hybrid');
  const out = await r.retrieve('how was it tested');
  assert.equal(out.gate.passed, true);
  assert.equal(out.results[0].id, 'projects/demo#testing');
});
