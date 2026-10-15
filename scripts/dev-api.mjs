// Local stand-in for the Vercel Function: serves POST /api/chat on :8788 by
// adapting Node's http request to the same Web-standard handler.
//
//   npm run dev:api        then   npm run dev   (Vite proxies /api here)

import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { createDefaultHandler } from '../lib/load.js';

const PORT = Number(process.env.API_PORT || 8788);
const handle = createDefaultHandler();

createServer(async (req, res) => {
  if (!req.url.startsWith('/api/chat')) {
    res.writeHead(404).end();
    return;
  }
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  if (!headers.has('x-forwarded-for')) headers.set('x-forwarded-for', req.socket.remoteAddress || 'local');
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS';
  const request = new Request(`http://localhost:${PORT}${req.url}`, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: 'half',
    signal: abort.signal,
  });
  const response = await handle(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (response.body) for await (const chunk of response.body) res.write(chunk);
  res.end();
}).listen(PORT, () => console.log(`chat API on http://localhost:${PORT}/api/chat`));
