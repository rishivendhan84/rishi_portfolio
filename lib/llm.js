// OpenAI chat completions over plain fetch: a streaming generator for the bot
// and a one-shot call for the eval judge.

export const CHAT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const URL = 'https://api.openai.com/v1/chat/completions';

export class UpstreamError extends Error {
  constructor(status) {
    super(`Chat request failed with HTTP ${status}`);
    this.status = status;
  }
}

function request(body, { apiKey, signal }) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  return fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
    signal,
  });
}

// Yields { type: 'token', text } and, at the end, { type: 'usage', usage }.
export async function* streamChat(
  messages,
  { apiKey = process.env.OPENAI_API_KEY, model = CHAT_MODEL, maxTokens = 400, signal } = {},
) {
  const res = await request(
    {
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0, // factual bot: least variation between runs
      stream: true,
      stream_options: { include_usage: true },
    },
    { apiKey, signal },
  );
  // Never forward the upstream body: it can echo request details.
  if (!res.ok) throw new UpstreamError(res.status);

  const decoder = new TextDecoder();
  let buf = '';
  for await (const part of res.body) {
    buf += decoder.decode(part, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      const json = JSON.parse(data);
      const text = json.choices?.[0]?.delta?.content;
      if (text) yield { type: 'token', text };
      if (json.usage) yield { type: 'usage', usage: json.usage };
    }
  }
}

export async function complete(messages, { apiKey = process.env.OPENAI_API_KEY, model = CHAT_MODEL, json = false } = {}) {
  const res = await request(
    { model, messages, temperature: 0, ...(json ? { response_format: { type: 'json_object' } } : {}) },
    { apiKey },
  );
  if (!res.ok) throw new UpstreamError(res.status);
  const body = await res.json();
  return body.choices[0].message.content;
}
