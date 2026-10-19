// Build data/index.json from knowledge/*.md.
//
//   npm run ingest                      chunk + embed (needs OPENAI_API_KEY in .env.local)
//   npm run ingest -- --no-embed        chunk only: a BM25-only index for offline work
//   npm run ingest -- --skip-unconfirmed  leave out files still carrying [CONFIRM
//
// Files whose name starts with "_" are notes, never ingested. A file with an
// unresolved [CONFIRM marker stops the build unless --skip-unconfirmed is
// passed; the index then records complete: false and must not ship.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chunkMarkdown, CONFIRM_MARKER } from '../lib/chunk.js';
import { embedTexts, EMBED_MODEL, EMBED_DIMENSIONS } from '../lib/embed.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const KNOWLEDGE = join(ROOT, 'knowledge');
const OUT = join(ROOT, 'data', 'index.json');

const args = new Set(process.argv.slice(2));
const noEmbed = args.has('--no-embed');
const skipUnconfirmed = args.has('--skip-unconfirmed');

async function listMarkdown(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('_')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listMarkdown(p)));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out.sort();
}

const files = await listMarkdown(KNOWLEDGE);
const chunks = [];
const skipped = [];
for (const f of files) {
  const docPath = relative(KNOWLEDGE, f).split(sep).join('/').replace(/\.md$/, '');
  const raw = await readFile(f, 'utf8');
  if (raw.includes(CONFIRM_MARKER)) {
    if (!skipUnconfirmed) {
      console.error(`Refusing to build: ${docPath}.md still has an unresolved ${CONFIRM_MARKER} marker.`);
      console.error('Resolve it, or pass --skip-unconfirmed for a draft index that must not ship.');
      process.exit(1);
    }
    skipped.push(`${docPath}.md`);
    continue;
  }
  chunks.push(...chunkMarkdown(raw, docPath));
}

const ids = new Set();
for (const c of chunks) {
  if (ids.has(c.id)) throw new Error(`Duplicate chunk id ${c.id}: rename a heading`);
  ids.add(c.id);
}

if (!noEmbed) {
  const vectors = await embedTexts(chunks.map((c) => c.text));
  // 5 decimals is far below the noise floor of the similarity scores.
  chunks.forEach((c, i) => (c.embedding = vectors[i].map((x) => Math.round(x * 1e5) / 1e5)));
}

const index = {
  meta: {
    built_at: new Date().toISOString(),
    embedding: noEmbed ? null : { model: EMBED_MODEL, dimensions: EMBED_DIMENSIONS },
    complete: skipped.length === 0,
    skipped,
    files: files.length,
    chunks: chunks.length,
  },
  chunks,
};

await mkdir(join(ROOT, 'data'), { recursive: true });
await writeFile(OUT, JSON.stringify(index));
console.log(
  `Wrote ${chunks.length} chunks from ${files.length - skipped.length} files to data/index.json` +
    ` (${noEmbed ? 'BM25 only, no embeddings' : `${EMBED_MODEL}, ${EMBED_DIMENSIONS}d`})` +
    (skipped.length ? `. DRAFT: skipped ${skipped.join(', ')}` : ''),
);
