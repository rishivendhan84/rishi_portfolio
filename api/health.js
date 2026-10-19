// GET /api/health: deployment self-check. Booleans and counts only, never
// values or variable names.

import { loadIndex } from '../lib/load.js';

export function GET() {
  let index = null;
  try {
    index = loadIndex().meta;
  } catch {
    // reported below as index: null
  }
  const body = {
    env: process.env.VERCEL_ENV || 'local',
    openaiKeyPresent: Boolean(process.env.OPENAI_API_KEY),
    rateLimiter: process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? 'upstash' : 'memory',
    index: index && { complete: index.complete, chunks: index.chunks, built_at: index.built_at },
  };
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
