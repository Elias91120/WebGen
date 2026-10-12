// Assistant API, run next to nginx in the production container (see Dockerfile).
// nginx proxies /api/chat here; this process holds the 3geeks API key.
import http from 'node:http';

import { createChatHandler } from './chat.mjs';

const port = Number(process.env.CHAT_PORT || 8787);
const apiKey = process.env.THREEGEEKS_API_KEY || '';
const handleChat = createChatHandler({
  apiKey,
  baseUrl: process.env.THREEGEEKS_API_BASE_URL || undefined,
  model: process.env.THREEGEEKS_MODEL || undefined,
});

http
  .createServer((req, res) => {
    const path = (req.url || '').split('?')[0];
    if (path === '/api/chat' || path === '/api/chat/warm') return handleChat(req, res);
    if (path === '/api/chat/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, configured: Boolean(apiKey) }));
    }
    res.writeHead(404).end();
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`assistant api on 127.0.0.1:${port} (key ${apiKey ? 'set' : 'MISSING'})`);
  });
