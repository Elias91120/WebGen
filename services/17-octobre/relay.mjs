// 17 OCTOBRE — the online duel relay (jalon 6.2), served by the file server on /17-octobre/fichiers/relais.
//
// The game runs in lockstep: both PCs simulate the same match and only exchange the players' orders. The relay
// never looks inside a match: it pairs two players with a 4-letter room code, then forwards each player's messages
// to the other, unchanged. No port to open on anyone's box: both players connect out to www.3geeks.fr (WebSocket,
// through Cloudflare and Traefik).
//
// Protocol (JSON text frames):
//   → {"op":"create","side":0|1,"params":{...},"version":"0.7.2"}  ← {"op":"created","code":"KZPT"}
//   → {"op":"join","code":"KZPT","version":"0.7.2"}                ← both: {"op":"start","seed":N,"params":{...},"side":0|1}
//   → {"op":"m","d":{...}}   (a lockstep message)                   ← the other player gets it as is
//   → {"op":"leave"}  or the connection drops                       ← the other player: {"op":"left"}
//   ← {"op":"error","msg":"..."}  (unknown code, room full, other version, too many rooms...)
//
// A minimal WebSocket server (RFC 6455: handshake, masked client frames, text/close/ping/pong, fragments): no
// dependency. Limits: 64 KB per message, 600 messages per second per connection (a match sends ~70), 300 rooms, a
// waiting room expires after 15 min, a silent connection after 60 s (the server pings every 20 s).

import { createHash, randomInt } from 'node:crypto';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // (no I or O: they read like 1 and 0)
const MAX_MESSAGE = 64 * 1024;
const MAX_RATE = 600; // messages per second
const MAX_ROOMS = 300;
const ROOM_TTL = 15 * 60 * 1000;
const PING_EVERY = 20 * 1000;
const SILENT_MAX = 60 * 1000;

const rooms = new Map(); // code -> {host, guest, side, params, version, created}
const conns = new Set();

export const relayStats = () => ({ rooms: rooms.size, connections: conns.size });

class Conn {
  constructor(socket) {
    this.socket = socket;
    this.buf = Buffer.alloc(0);
    this.frag = [];
    this.fragOp = 0;
    this.room = null;
    this.alive = Date.now();
    this.rateT = 0;
    this.rateN = 0;
    this.closed = false;
    socket.setNoDelay(true);
    socket.on('data', (d) => this.onData(d));
    socket.on('close', () => this.onClose());
    socket.on('error', () => this.onClose());
    conns.add(this);
  }

  onData(d) {
    this.alive = Date.now();
    this.buf = this.buf.length ? Buffer.concat([this.buf, d]) : d;
    while (this.buf.length >= 2) {
      const b0 = this.buf[0];
      const b1 = this.buf[1];
      const fin = (b0 & 0x80) !== 0;
      const op = b0 & 0x0f;
      let len = b1 & 0x7f;
      let off = 2;
      if (len === 126) {
        if (this.buf.length < 4) return;
        len = this.buf.readUInt16BE(2);
        off = 4;
      } else if (len === 127) {
        if (this.buf.length < 10) return;
        len = Number(this.buf.readBigUInt64BE(2));
        off = 10;
      }
      if (len > MAX_MESSAGE) return this.close(1009);
      const masked = (b1 & 0x80) !== 0;
      if (!masked) return this.close(1002); // clients must mask
      if (this.buf.length < off + 4 + len) return;
      const mask = this.buf.subarray(off, off + 4);
      const payload = Buffer.from(this.buf.subarray(off + 4, off + 4 + len));
      for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
      this.buf = this.buf.subarray(off + 4 + len);
      if (op === 0x8) return this.close(1000);
      if (op === 0x9) { this.frame(0xa, payload); continue; }
      if (op === 0xa) continue;
      if (op === 0x1 || op === 0x2) { this.fragOp = op; this.frag = [payload]; }
      else if (op === 0x0) this.frag.push(payload);
      else return this.close(1003);
      if (!fin) {
        if (this.frag.reduce((n, p) => n + p.length, 0) > MAX_MESSAGE) return this.close(1009);
        continue;
      }
      const msg = Buffer.concat(this.frag);
      this.frag = [];
      if (this.fragOp === 0x1) this.onText(msg);
    }
  }

  onText(raw) {
    const now = Date.now();
    if (now - this.rateT > 1000) { this.rateT = now; this.rateN = 0; }
    if (++this.rateN > MAX_RATE) return this.close(1008);
    let m;
    try {
      m = JSON.parse(raw.toString('utf8'));
    } catch {
      return;
    }
    if (!m || typeof m !== 'object') return;
    switch (m.op) {
      case 'm': {
        const r = this.room && rooms.get(this.room);
        const other = r && (r.host === this ? r.guest : r.host);
        if (other) other.frame(0x1, raw); // forwarded as is: the relay never reads a match
        return;
      }
      case 'create': return this.create(m);
      case 'join': return this.join(m);
      case 'leave': return this.leave();
      default: return;
    }
  }

  create(m) {
    if (this.room) this.leave();
    if (rooms.size >= MAX_ROOMS) return this.send({ op: 'error', msg: 'Le serveur est plein, réessaie dans un moment.' });
    let code;
    do {
      code = Array.from({ length: 4 }, () => LETTERS[randomInt(LETTERS.length)]).join('');
    } while (rooms.has(code));
    const side = Number(m.side) === 1 ? 1 : 0;
    const params = m.params && typeof m.params === 'object' ? m.params : {};
    rooms.set(code, { host: this, guest: null, side, params, version: String(m.version || ''), created: Date.now() });
    this.room = code;
    this.send({ op: 'created', code });
  }

  join(m) {
    if (this.room) this.leave();
    const code = String(m.code || '').trim().toUpperCase();
    const r = rooms.get(code);
    if (!r) return this.send({ op: 'error', msg: 'Ce code ne correspond à aucune partie.' });
    if (r.guest) return this.send({ op: 'error', msg: 'Cette partie a déjà ses deux joueurs.' });
    if (r.version !== String(m.version || '')) {
      return this.send({ op: 'error', msg: `Vous n'avez pas la même version du jeu (${r.version} et ${m.version || '?'}) : mettez-vous à jour.` });
    }
    r.guest = this;
    this.room = code;
    const seed = randomInt(1, 2147483647);
    r.host.send({ op: 'start', seed, params: r.params, side: r.side, code });
    this.send({ op: 'start', seed, params: r.params, side: 1 - r.side, code });
  }

  leave() {
    const code = this.room;
    this.room = null;
    const r = code && rooms.get(code);
    if (!r) return;
    const other = r.host === this ? r.guest : r.host;
    rooms.delete(code);
    if (other) {
      other.room = null;
      other.send({ op: 'left' });
    }
  }

  send(obj) {
    this.frame(0x1, Buffer.from(JSON.stringify(obj)));
  }

  frame(op, payload) {
    if (this.closed) return;
    const n = payload.length;
    let head;
    if (n < 126) head = Buffer.from([0x80 | op, n]);
    else if (n < 65536) {
      head = Buffer.alloc(4);
      head[0] = 0x80 | op;
      head[1] = 126;
      head.writeUInt16BE(n, 2);
    } else {
      head = Buffer.alloc(10);
      head[0] = 0x80 | op;
      head[1] = 127;
      head.writeBigUInt64BE(BigInt(n), 2);
    }
    this.socket.write(Buffer.concat([head, payload]));
  }

  close(code) {
    if (this.closed) return;
    const p = Buffer.alloc(2);
    p.writeUInt16BE(code, 0);
    this.frame(0x8, p);
    this.closed = true;
    this.socket.end();
    this.onClose();
  }

  onClose() {
    this.closed = true;
    this.leave();
    conns.delete(this);
  }
}

/** Attaches the relay to an http server: WebSocket upgrades on <prefix>/relais (or /relais). */
export function attachRelay(server, prefix) {
  server.on('upgrade', (req, socket) => {
    const path = new URL(req.url || '/', 'http://local').pathname;
    const key = req.headers['sec-websocket-key'];
    if ((path !== '/relais' && path !== `${prefix}/relais`) || !key || String(req.headers.upgrade || '').toLowerCase() !== 'websocket') {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      return;
    }
    const accept = createHash('sha1').update(key + GUID).digest('base64');
    socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
    new Conn(socket);
  });
  const timer = setInterval(() => {
    const now = Date.now();
    for (const c of conns) {
      if (now - c.alive > SILENT_MAX) c.close(1001);
      else c.frame(0x9, Buffer.alloc(0));
    }
    for (const [code, r] of rooms) {
      if (!r.guest && now - r.created > ROOM_TTL) {
        rooms.delete(code);
        r.host.room = null;
        r.host.send({ op: 'error', msg: 'Personne n’est venu : la partie a expiré.' });
      }
    }
  }, PING_EVERY);
  timer.unref();
}
