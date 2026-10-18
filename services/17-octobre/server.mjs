// 17 OCTOBRE — the game's file server (www.3geeks.fr/17-octobre/fichiers), on the Mac Mini.
//
// Serves the beta download of the game (a Windows .zip; free since 14/10, an access code only if DOWNLOAD_CODE is set), plus a public
// version.json that the game reads to say "a new version is out". New builds are uploaded from Elias's PC
// with tools/publish.ps1 (game repo), authenticated by a token. It also hosts the online duel relay (relay.mjs), the shared
// world of the Manif mode (monde.mjs: everyone online in the same Paris, proximity voice chat) and its leaderboard
// (classement.mjs).
//
//   GET  /health                        {"status":"ok"}
//   GET  /version.json                  current version, date, size, release notes (public)
//   GET  /verifier?code=XXXX            {"ok": true|false} (rate limited per visitor)
//   GET  /telecharger[?code=XXXX]       the zip (attachment) ; with DOWNLOAD_CODE set, a wrong code goes back to the page
//   GET  /telechargements               {"total": N} downloads so far, every version (public)
//   GET  /telechargements/direct        the same total, live (Server-Sent Events: on connect, then on each download)
//   GET  /actus/actus_<version>.<ext>   a version's video, its "what's new" (mp4 for the page, ogv for the game ; byte ranges)
//   PUT  /upload/<name>                 Authorization: Bearer <UPLOAD_TOKEN> — stores a file in DATA_DIR
//   PUT  /upload/<name>?offset=X&total=T  the same, in pieces under Cloudflare's 100 MB body limit (the zip since 0.11.0)
//   GET  /stats                         Authorization: Bearer <UPLOAD_TOKEN> — download counts, relay rooms, live viewers,
//                                       players online, leaderboard size
//   GET|POST|DELETE /classement         the leaderboards (classement.mjs): the Manif mode by default, the Campagne
//                                       mode's casseurs with ?mode=campagne (GET) or {"mode":"campagne"} (POST)
//   WS   /relais                        the online duel relay (relay.mjs)
//   WS   /monde                         the Manif mode's shared world (monde.mjs)
//
// Paths work with or without the /17-octobre/fichiers prefix (Traefik may or may not strip it).
// Env: UPLOAD_TOKEN, DOWNLOAD_CODE (comma-separated list allowed), DATA_DIR (default /data), PORT (default 3000),
// MONDE_MAX (players in the shared world at once, default 100).
// Arguments --port=N and --data=DIR override PORT and DATA_DIR (local tests).
// No dependencies: node:http and node:fs only.

import { createReadStream, createWriteStream, promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { timingSafeEqual } from 'node:crypto';

import { boardStats, classement, loadBoard } from './classement.mjs';
import { mondeStats, mondeUpgrade, startMonde } from './monde.mjs';
import { relayStats, relayUpgrade, startRelay } from './relay.mjs';

const arg = (name) => (process.argv.find((a) => a.startsWith(`--${name}=`)) || '').split('=').slice(1).join('=');
const PORT = Number(arg('port') || process.env.PORT || 3000);
const DATA = arg('data') || process.env.DATA_DIR || '/data';
const TOKEN = process.env.UPLOAD_TOKEN || '';
const CODES = (process.env.DOWNLOAD_CODE || '').split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
const PREFIX = '/17-octobre/fichiers';
const PAGE = 'https://www.3geeks.fr/17-octobre';
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/;
const MAX_UPLOAD = 1024 * 1024 * 1024; // 1 GB
const ATTEMPTS = 20; // wrong codes per visitor per window
const WINDOW_MS = 10 * 60 * 1000;
const MAX_WATCHERS = 2000; // open live counters
const KEEPALIVE_MS = 25 * 1000; // a comment on each live counter, well under Cloudflare's 100 s idle cut

const attempts = new Map(); // ip -> {n, until}
const watchers = new Set(); // open /telechargements/direct responses
let stats = {}; // file -> downloads, read once at start (loadStats), saved on each download
let saving = Promise.resolve();

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

/** Checks an access code (none configured: the download is free); false once a visitor made too many wrong guesses. */
function codeOk(req, code) {
  if (CODES.length === 0) return true;
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

async function loadStats() {
  try {
    stats = JSON.parse(await fs.readFile(join(DATA, 'stats.json'), 'utf8')) || {};
  } catch {
    stats = {};
  }
}

const totalDownloads = () => Object.values(stats).reduce((n, v) => n + (Number(v) || 0), 0);

/** Counts a download, tells every live counter, and saves (one write at a time, through a temp file: never half a file). */
function bumpStat(file) {
  stats[file] = (stats[file] || 0) + 1;
  const event = `data: ${totalDownloads()}\n\n`;
  for (const w of watchers) w.write(event);
  const path = join(DATA, 'stats.json');
  saving = saving
    .then(async () => {
      await fs.writeFile(`${path}.part`, JSON.stringify(stats, null, 2));
      await fs.rename(`${path}.part`, path);
    })
    .catch((e) => console.error('stats not saved:', e.message));
}

/** The live counter: an event stream that sends the total now, then again after each download. */
function watch(req, res) {
  if (watchers.size >= MAX_WATCHERS) return send(res, 503, { error: 'busy' });
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*',
  });
  res.write(`retry: 10000\ndata: ${totalDownloads()}\n\n`);
  watchers.add(res);
  res.on('close', () => watchers.delete(res));
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
  bumpStat(v.file);
}

const ACTUS_RE = /^actus_[A-Za-z0-9._-]{1,80}\.(mp4|ogv|webm|jpg|png)$/;
const ACTUS_TYPES = { mp4: 'video/mp4', ogv: 'video/ogg', webm: 'video/webm', jpg: 'image/jpeg', png: 'image/png' };

/**
 * A version's video (its "what's new"), uploaded with the build by tools/publish.ps1 as actus_<version>.<ext>: the
 * page plays the .mp4, the game's update notice downloads the .ogv. Byte ranges are honoured (a browser seeks with
 * them, and Safari will not play a video without them); cached a day, the name changes with each version.
 */
async function actus(req, res, name) {
  if (!ACTUS_RE.test(name)) return send(res, 404, { error: 'not found' });
  const path = join(DATA, name);
  let st;
  try {
    st = await fs.stat(path);
  } catch {
    return send(res, 404, { error: 'not found' });
  }
  const headers = {
    'Content-Type': ACTUS_TYPES[name.split('.').pop()],
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400',
    'Access-Control-Allow-Origin': '*',
  };
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ''));
  if (m && (m[1] !== '' || m[2] !== '')) {
    let start = m[1] === '' ? Math.max(0, st.size - Number(m[2])) : Number(m[1]);
    let end = m[1] !== '' && m[2] !== '' ? Math.min(Number(m[2]), st.size - 1) : st.size - 1;
    if (start >= st.size || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${st.size}`, ...headers });
      return res.end();
    }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    return createReadStream(path, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, 'Content-Length': st.size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(path).pipe(res);
}

/**
 * An upload in pieces (?offset=X&total=T): Cloudflare refuses any request body over 100 MB, and the game's zip is bigger
 * since 0.11.0. Each piece is appended to `.<name>.part` at its offset (offset 0 starts over; a piece that does not land
 * where the file ends gets 409 with the size already received, so the sender can resume); the last piece renames the
 * whole file into place, so a half-sent build is never served.
 */
async function uploadPiece(req, res, name, offset, total) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(total) || offset < 0 || total <= 0 || total > MAX_UPLOAD || offset >= total) {
    return send(res, 400, { error: 'bad offset/total' });
  }
  await fs.mkdir(DATA, { recursive: true });
  const tmp = join(DATA, `.${name}.part`);
  let have = 0;
  if (offset > 0) {
    try {
      have = (await fs.stat(tmp)).size;
    } catch {
      have = 0;
    }
    if (have !== offset) {
      req.resume();
      return send(res, 409, { error: 'offset mismatch', received: have });
    }
  }
  const out = createWriteStream(tmp, { flags: offset === 0 ? 'w' : 'a' });
  let received = 0;
  req.on('data', (chunk) => {
    received += chunk.length;
    if (offset + received > total) req.destroy();
  });
  req.pipe(out);
  out.on('finish', async () => {
    const now = offset + received;
    if (now === total) {
      await fs.rename(tmp, join(DATA, name));
      return send(res, 200, { ok: true, name, size: now, done: true });
    }
    send(res, 200, { ok: true, name, received: now, done: false });
  });
  out.on('error', () => send(res, 500, { error: 'write failed' }));
}

async function upload(req, res, name, url) {
  if (!authorized(req)) return send(res, 401, { error: 'unauthorized' });
  if (!NAME_RE.test(name)) return send(res, 400, { error: 'bad name' });
  if (url && url.searchParams.has('offset')) {
    return uploadPiece(req, res, name, Number(url.searchParams.get('offset')), Number(url.searchParams.get('total')));
  }
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
    if (req.method === 'GET' && path === '/telechargements') {
      return send(res, 200, { total: totalDownloads() }, 'application/json; charset=utf-8', { 'Access-Control-Allow-Origin': '*' });
    }
    if (req.method === 'GET' && path === '/telechargements/direct') return watch(req, res);
    if ((req.method === 'GET' || req.method === 'HEAD') && path.startsWith('/actus/')) return await actus(req, res, decodeURIComponent(path.slice(7)));
    if (req.method === 'PUT' && path.startsWith('/upload/')) return await upload(req, res, decodeURIComponent(path.slice(8)), url);
    if (req.method === 'GET' && path === '/stats') {
      if (!authorized(req)) return send(res, 401, { error: 'unauthorized' });
      return send(res, 200, { ...stats, relay: relayStats(), watchers: watchers.size, monde: mondeStats(), classement: boardStats() });
    }
    if (await classement(req, res, url, path, { send, visitor, authorized })) return;
    send(res, 404, { error: 'not found' });
  } catch (e) {
    send(res, 500, { error: 'server error' });
  }
});

// the WebSockets: the duel relay and the Manif world (anything else is refused)
server.on('upgrade', (req, socket) => {
  let path = new URL(req.url || '/', 'http://local').pathname;
  if (path.startsWith(PREFIX)) path = path.slice(PREFIX.length) || '/';
  if (path === '/relais') return relayUpgrade(req, socket);
  if (path === '/monde') return mondeUpgrade(req, socket);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
startRelay();
startMonde();

setInterval(() => {
  for (const w of watchers) w.write(': ping\n\n');
}, KEEPALIVE_MS).unref();

await loadStats();
await loadBoard(DATA);
server.listen(PORT, () => {
  console.log(`17 OCTOBRE file server on :${PORT}, data in ${DATA}, ${totalDownloads()} download(s), ${CODES.length} access code(s)${TOKEN ? '' : ', NO upload token set'}`);
});
