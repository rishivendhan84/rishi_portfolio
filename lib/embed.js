// OpenAI embeddings over plain fetch (no SDK). Vectors are L2-normalized so
// cosine similarity is a dot product at query time.

export const EMBED_MODEL = process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small';
// text-embedding-3 models accept a reduced size; 512 keeps the bundled index small.
export const EMBED_DIMENSIONS = Number(process.env.OPENAI_EMBED_DIMENSIONS || 512);

const URL = 'https://api.openai.com/v1/embeddings';
const BATCH = 96;

export function normalize(v) {
  const n = Math.hypot(...v) || 1;
  return v.map((x) => x / n);
}

async function post(body, apiKey, attempt = 0) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (res.ok) return res.json();
  const retryable = res.status === 429 || res.status >= 500;
  if (retryable && attempt < 3) {
    await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    return post(body, apiKey, attempt + 1);
  }
  // Never echo the response body: it can contain request details.
  throw new Error(`Embeddings request failed with HTTP ${res.status}`);
}

export async function embedTexts(texts, { apiKey = process.env.OPENAI_API_KEY } = {}) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  const out = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const json = await post(
      { model: EMBED_MODEL, dimensions: EMBED_DIMENSIONS, input: texts.slice(i, i + BATCH) },
      apiKey,
    );
    for (const d of json.data.sort((a, b) => a.index - b.index)) out.push(normalize(d.embedding));
  }
  return out;
}
