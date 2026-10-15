// Vercel Function: POST /api/chat (Web-standard signature, Node.js runtime).
// The index is read from data/index.json, bundled via vercel.json includeFiles.

import { createDefaultHandler } from '../lib/load.js';

const handle = createDefaultHandler();

export function POST(request) {
  return handle(request);
}

export function OPTIONS(request) {
  return handle(request);
}
