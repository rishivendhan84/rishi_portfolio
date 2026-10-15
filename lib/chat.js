// The chat endpoint as a Web-standard handler: Request in, streamed Response out.
// api/chat.js wires the real dependencies; tests and the eval inject fakes.
//
// Response: text/event-stream with events
//   meta   { mode, gate, sources: [{ n, id, title, heading, url, fused, bm25, cosine }] }
//   token  { t }   answer text, in order
//   done   {}
//   error  { message }

import { buildMessages, NO_MATCH_MESSAGE, CONTACT_EMAIL } from './prompt.js';
import { streamChat } from './llm.js';

export const CAPS = {
  maxBodyBytes: 8 * 1024,
  maxQuestionChars: 500,
  maxHistoryMessages: 6, // 3 exchanges
  maxHistoryChars: 1000, // per message
};

const DEFAULT_ORIGINS = [
  'https://rishi-portfolio-orcin.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];
// Vercel preview deployments of this project.
const PREVIEW_ORIGIN = /^https:\/\/rishi-portfolio-[a-z0-9-]+-rishivendhan84s-projects\.vercel\.app$/;

export function originAllowed(origin, allowed = DEFAULT_ORIGINS) {
  if (!origin) return true; // non-browser clients; CORS is not an auth layer, the rate limit is
  return allowed.includes(origin) || PREVIEW_ORIGIN.test(origin);
}

export function validate(body) {
  if (!body || typeof body !== 'object') return { error: 'Body must be a JSON object.' };
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question) return { error: 'Ask a question.' };
  if (question.length > CAPS.maxQuestionChars)
    return { error: `Questions are limited to ${CAPS.maxQuestionChars} characters.` };
  const raw = Array.isArray(body.history) ? body.history : [];
  const history = [];
  for (const m of raw.slice(-CAPS.maxHistoryMessages)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string')
      return { error: 'History entries need a role of user or assistant and text content.' };
    history.push({ role: m.role, content: m.content.slice(0, CAPS.maxHistoryChars) });
  }
  return { question, history };
}

export function clientKey(request) {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd && fwd.split(',')[0].trim()) || request.headers.get('x-real-ip') || 'unknown';
}

function corsHeaders(origin) {
  return origin
    ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
    : {};
}

function json(status, body, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  });
}

const sse = (event, data) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

export function createChatHandler({
  index,
  retriever,
  limiter,
  llm = streamChat,
  apiKey = process.env.OPENAI_API_KEY,
  production = process.env.VERCEL_ENV === 'production',
  allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()) : DEFAULT_ORIGINS,
  log = (entry) => console.log(JSON.stringify(entry)),
}) {
  return async function handle(request) {
    const started = Date.now();
    const origin = request.headers.get('origin');
    if (!originAllowed(origin, allowedOrigins)) return json(403, { error: 'Origin not allowed.' });
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Max-Age': '600' } });
    if (request.method !== 'POST') return json(405, { error: 'Use POST.' }, { ...cors, Allow: 'POST, OPTIONS' });

    // A draft index (unresolved [CONFIRM files) never answers in production.
    if (production && !index.meta.complete) return json(503, { error: 'The assistant is not published yet.' }, cors);
    if (!apiKey) return json(503, { error: `The assistant is offline. Email Rishi at ${CONTACT_EMAIL}.` }, cors);

    const raw = await request.text();
    if (raw.length > CAPS.maxBodyBytes) return json(413, { error: 'Request too large.' }, cors);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { error: 'Body must be JSON.' }, cors);
    }
    const v = validate(body);
    if (v.error) return json(400, { error: v.error }, cors);

    // Before any paid call: retrieval embeds the question.
    const rl = await limiter.check(clientKey(request));
    if (!rl.ok) {
      log({ event: 'chat', status: 429, limit: rl.limit });
      return json(
        429,
        { error: `Too many questions for now. Try again in ${rl.retryAfter} seconds, or email Rishi at ${CONTACT_EMAIL}.` },
        { ...cors, 'Retry-After': String(rl.retryAfter) },
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event, data) => controller.enqueue(encoder.encode(sse(event, data)));
        let usage = null;
        let gatePassed = false;
        let status = 200;
        try {
          const { mode, results, gate } = await retriever.retrieve(v.question);
          gatePassed = gate.passed;
          send('meta', {
            mode,
            gate,
            sources: results.map((r, i) => ({
              n: i + 1,
              id: r.id,
              title: r.chunk.title,
              heading: r.chunk.heading,
              url: r.chunk.url,
              fused: r.fused,
              bm25: r.bm25,
              cosine: r.cosine,
            })),
          });
          if (!gate.passed) {
            // Nothing relevant: answer without a model call.
            send('token', { t: NO_MATCH_MESSAGE });
          } else {
            for await (const ev of llm(buildMessages(v.question, v.history, results), { apiKey, signal: request.signal })) {
              if (ev.type === 'token') send('token', { t: ev.text });
              else if (ev.type === 'usage') usage = ev.usage;
            }
          }
          send('done', {});
        } catch (err) {
          status = 502;
          send('error', { message: `Something went wrong on my side. Email Rishi at ${CONTACT_EMAIL}.` });
          log({ event: 'chat_error', error: err.message });
        } finally {
          // Counts only: no question text, no IP.
          log({
            event: 'chat',
            status,
            gate: gatePassed,
            prompt_tokens: usage?.prompt_tokens ?? 0,
            completion_tokens: usage?.completion_tokens ?? 0,
            ms: Date.now() - started,
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        ...cors,
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  };
}

// Parse an SSE body into { meta, text, error }. Used by tests and the eval.
export async function readChatStream(response) {
  const raw = await response.text();
  const out = { meta: null, text: '', error: null, done: false };
  for (const block of raw.split('\n\n')) {
    const ev = block.match(/^event: (\w+)\ndata: (.*)$/s);
    if (!ev) continue;
    const data = JSON.parse(ev[2]);
    if (ev[1] === 'meta') out.meta = data;
    else if (ev[1] === 'token') out.text += data.t;
    else if (ev[1] === 'error') out.error = data.message;
    else if (ev[1] === 'done') out.done = true;
  }
  return out;
}
