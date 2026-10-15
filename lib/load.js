// Shared wiring for api/chat.js, the local dev server and the answer eval.

import { readFileSync } from 'node:fs';
import { createRetriever } from './retrieve.js';
import { embedTexts } from './embed.js';
import { createRateLimiter } from './ratelimit.js';
import { createChatHandler } from './chat.js';

export function loadIndex() {
  return JSON.parse(readFileSync(new URL('../data/index.json', import.meta.url), 'utf8'));
}

export function createDefaultHandler(overrides = {}) {
  const index = overrides.index || loadIndex();
  const retriever = createRetriever(index, { embedQuery: async (q) => (await embedTexts([q]))[0] });
  return createChatHandler({ index, retriever, limiter: createRateLimiter(), ...overrides });
}
