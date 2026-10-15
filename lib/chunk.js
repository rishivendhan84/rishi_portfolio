// Markdown -> retrieval chunks. One chunk per H2 section; long sections are
// packed paragraph by paragraph with a one-paragraph overlap.

export const MAX_CHARS = 1600; // ~400 tokens
export const OVERLAP_CHARS = 240; // carry the last paragraph forward if it is short

// Ingest refuses files carrying this marker unless told to skip them.
export const CONFIRM_MARKER = '[CONFIRM';

export function parseFrontmatter(raw) {
  const text = raw.replace(/\r\n/g, '\n');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: text.slice(m[0].length) };
}

export function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function packParagraphs(body) {
  const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const parts = [];
  let cur = [];
  let len = 0;
  for (const p of paras) {
    if (len + p.length > MAX_CHARS && cur.length) {
      parts.push(cur.join('\n\n'));
      const last = cur[cur.length - 1];
      cur = last.length <= OVERLAP_CHARS ? [last] : [];
      len = cur.reduce((n, x) => n + x.length, 0);
    }
    cur.push(p);
    len += p.length;
  }
  if (cur.length) parts.push(cur.join('\n\n'));
  return parts;
}

// docPath is relative to knowledge/ without the extension, e.g. "projects/vitalens".
export function chunkMarkdown(raw, docPath) {
  const { meta, body } = parseFrontmatter(raw);
  const title = meta.title || docPath;
  const url = meta.source || '';
  const sections = [];
  let heading = null;
  let lines = [];
  const flush = () => {
    const text = lines.join('\n').trim();
    if (text) sections.push({ heading: heading || title, text });
  };
  for (const line of body.split('\n')) {
    if (/^#\s/.test(line)) continue; // the H1 restates the title
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      flush();
      heading = h2[1].trim();
      lines = [];
    } else {
      lines.push(line);
    }
  }
  flush();

  const chunks = [];
  for (const s of sections) {
    const base = `${docPath}#${slugify(s.heading)}`;
    packParagraphs(s.text).forEach((part, i) => {
      chunks.push({
        id: i === 0 ? base : `${base}-${i + 1}`,
        file: `${docPath}.md`,
        title,
        heading: s.heading,
        url,
        // The title and heading travel with the text, so a chunk about
        // "pgvector" still knows which project it belongs to.
        text: `${title} > ${s.heading}\n${part}`,
      });
    });
  }
  return chunks;
}
