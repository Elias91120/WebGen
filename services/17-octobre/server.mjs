// 17 OCTOBRE — the game's file server (www.3geeks.fr/17-octobre/fichiers), on the Mac Mini.
//
// Serves the private beta download of the game (a Windows .zip) behind an access code, plus a public
// version.json that the game reads to say "a new version is out". New builds are uploaded from Elias's PC
// with tools/publish.ps1 (game repo), authenticated by a token. Later it will also host the online duel relay.
//
//   GET  /health                        {"status":"ok"}
//   GET  /version.json                  current version, date, size, release notes (public)
//   GET  /verifier?code=XXXX            {"ok": true|false} (rate limited per visitor)
//   GET  /telecharger?code=XXXX         the zip (attachment), or back to the page with ?code=faux
//   PUT  /upload/<name>                 Authorization: Bearer <UPLOAD_TOKEN> — stores a file in DATA_DIR
//   GET  /stats                         Authorization: Bearer <UPLOAD_TOKEN> — download counts
//
// Paths work with or without the /17-octobre/fichiers prefix (Traefik may or may not strip it).
// Env: UPLOAD_TOKEN, DOWNLOAD_CODE (comma-separated list allowed), DATA_DIR (default /data), PORT (default 3000).
// No dependencies: node:http and node:fs only.

import { createReadStream, createWriteStream, promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.PORT || 3000);
const DATA = process.env.DATA_DIR || '/data';
const TOKEN = process.env.UPLOAD_TOKEN || '';
const CODES = (process.env.DOWNLOAD_CODE || '').split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
const PREFIX = '/17-octobre/fichiers';
const PAGE = 'https://www.3geeks.fr/17-octobre';
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/;
const MAX_UPLOAD = 1024 * 1024 * 1024; // 1 GB
const ATTEMPTS = 20; // wrong codes per visitor per window
const WINDOW_MS = 10 * 60 * 1000;

const attempts = new Map(); // ip -> {n, until}

function visitor(req) {
  return String(req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?').split(',')[0].trim();
}

function same(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function authorized(req) {
  const h = String(req.headers.authorization || '');
  return TOKEN.length >= 16 && h.startsWith('Bearer ') && same(h.slice(7), TOKEN);
}

/** Checks an access code; false once a visitor made too many wrong guesses. */
function codeOk(req, code) {
  const ip = visitor(req);
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.until > now && a.n >= ATTEMPTS) return false;
  const c = String(code || '').trim().toUpperCase();
  const ok = c !== '' && CODES.some((k) => same(k, c));
  if (!ok) {
    const cur = a && a.until > now ? a : { n: 0, until: now + WINDOW_MS };
    cur.n += 1;
    attempts.set(ip, cur);
  }
  return ok;
}

function send(res, status, body, type = 'application/json; charset=utf-8', extra = {}) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', ...extra });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

async function readVersion() {
  try {
    return JSON.parse(await fs.readFile(join(DATA, 'version.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function bumpStat(file) {
  const path = join(DATA, 'stats.json');
  let stats = {};
  try {
    stats = JSON.parse(await fs.readFile(path, 'utf8'));
  } catch {
    stats = {};
  }
  stats[file] = (stats[file] || 0) + 1;
  await fs.writeFile(path, JSON.stringify(stats, null, 2));
}

async function download(req, res, url) {
  if (!codeOk(req, url.searchParams.get('code'))) {
    res.writeHead(302, { Location: `${PAGE}?code=faux#telecharger`, 'Cache-Control': 'no-store' });
    return res.end();
  }
  const v = await readVersion();
  if (!v || !NAME_RE.test(String(v.file || ''))) return send(res, 503, { error: 'no build yet' });
  const path = join(DATA, v.file);
  let st;
  try {
    st = await fs.stat(path);
  } catch {
    return send(res, 503, { error: 'build missing' });
  }
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Length': st.size,
    'Content-Disposition': `attachment; filename="${v.file}"`,
    'Cache-Control': 'no-store',
  });
  createReadStream(path).pipe(res);
  bumpStat(v.file).catch(() => {});
}

async function upload(req, res, name) {
  if (!authorized(req)) return send(res, 401, { error: 'unauthorized' });
  if (!NAME_RE.test(name)) return send(res, 400, { error: 'bad name' });
  const size = Number(req.headers['content-length'] || 0);
  if (size > MAX_UPLOAD) return send(res, 413, { error: 'too large' });
  await fs.mkdir(DATA, { recursive: true });
  const tmp = join(DATA, `.${name}.part`);
  const out = createWriteStream(tmp);
  let received = 0;
  req.on('data', (chunk) => {
    received += chunk.length;
    if (received > MAX_UPLOAD) req.destroy();
  });
  req.pipe(out);
  out.on('finish', async () => {
    await fs.rename(tmp, join(DATA, name));
    send(res, 200, { ok: true, name, size: received });
  });
  out.on('error', () => send(res, 500, { error: 'write failed' }));
  req.on('error', () => fs.rm(tmp, { force: true }).catch(() => {}));
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://local');
    let path = url.pathname;
    if (path.startsWith(PREFIX)) path = path.slice(PREFIX.length) || '/';
    if (req.method === 'GET' && path === '/health') return send(res, 200, { status: 'ok' });
    if (req.method === 'GET' && path === '/version.json') {
      const v = await readVersion();
      return v ? send(res, 200, v, 'application/json; charset=utf-8', { 'Access-Control-Allow-Origin': '*' }) : send(res, 404, { error: 'no build yet' });
    }
    if (req.method === 'GET' && path === '/verifier') return send(res, 200, { ok: codeOk(req, url.searchParams.get('code')) });
    if (req.method === 'GET' && path === '/telecharger') return await download(req, res, url);
    if (req.method === 'PUT' && path.startsWith('/upload/')) return await upload(req, res, decodeURIComponent(path.slice(8)));
    if (req.method === 'GET' && path === '/stats') {
      if (!authorized(req)) return send(res, 401, { error: 'unauthorized' });
      try {
        return send(res, 200, JSON.parse(await fs.readFile(join(DATA, 'stats.json'), 'utf8')));
      } catch {
        return send(res, 200, {});
      }
    }
    send(res, 404, { error: 'not found' });
  } catch (e) {
    send(res, 500, { error: 'server error' });
  }
});

server.listen(PORT, () => {
  console.log(`17 OCTOBRE file server on :${PORT}, data in ${DATA}, ${CODES.length} access code(s)${TOKEN ? '' : ', NO upload token set'}`);
});
