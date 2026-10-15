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
// The WebSocket itself is ws.mjs (shared with the Manif world). Limits: 64 KB per message, 600 messages per second
// per connection (a match sends ~70), 300 rooms, a waiting room expires after 15 min, a silent connection after 60 s
// (the server pings every 20 s).

import { randomInt } from 'node:crypto';

import { WsConn, handshake } from './ws.mjs';

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

class Conn extends WsConn {
  constructor(socket) {
    super(socket, MAX_MESSAGE);
    this.room = null;
    this.rateT = 0;
    this.rateN = 0;
    conns.add(this);
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

  onClosed() {
    this.leave();
    conns.delete(this);
  }
}

/** A WebSocket upgrade on <prefix>/relais (the server routes it here): a player of the duel. */
export function relayUpgrade(req, socket) {
  if (handshake(req, socket)) new Conn(socket);
}

/** The relay's rounds, every 20 s: a ping to each connection, silent ones closed, waiting rooms expired. */
export function startRelay() {
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