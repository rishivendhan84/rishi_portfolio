// GET /api/health: deployment self-check. Reports presence only, never values.

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
    // Names only, to catch a misspelled or mis-scoped variable.
    openaiVarNames: Object.keys(process.env).filter((k) => /openai/i.test(k)),
    index: index && { complete: index.complete, chunks: index.chunks, built_at: index.built_at },
  };
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
