// 17 OCTOBRE — the shared world of the Manif mode (served by the file server on /17-octobre/fichiers/monde).
//
// Everyone online plays their own manif (their own horde, simulated on their own PC) in the same Paris: the server
// only tells each player where the others are, and carries the proximity voice chat. Light on the Mac Mini: at most
// MAX_PLAYERS at once, positions sent 10 times a second and only to the players within VIEW m, voice (already
// compressed by the game) only to the players within VOICE m who turned theirs on. Nothing is stored.
//
// Protocol (JSON text frames, binary frames for the voice):
//   → {"op":"hello","name":"Elias","perso":"jojo","version":"0.1.0","voice":true}
//   ← {"op":"welcome","id":7,"count":12,"view":120,"voice":30}   or {"op":"error","msg":"..."}, then the server closes
//   → {"op":"p","x":-160.2,"y":0,"z":18.4,"f":3.14,"a":1,"lv":12}   where I am: facing, animation (0 still, 1 run,
//                                                                  2 slide, 3 in the air), level ; 20 a second at most
//   ← {"op":"s","p":[[id,x,y,z,f,a],...]}       every 100 ms: the others within VIEW m (the 40 nearest at most)
//   ← {"op":"in","id":7,"name":"Elias","perso":"jojo","lv":12,"voice":true}   someone comes into view
//   ← {"op":"out","id":7}                       someone leaves the view, or the server
//   ← {"op":"n","count":12}                     how many players are online (every 5 s)
//   → {"op":"voice","on":false}                 the microphone on or off (off: you neither send nor get voices)
//   → binary [seq u16 BE][payload]               a voice frame (20 ms of speech, the game's codec)
//   ← binary [from u16 BE][seq u16 BE][payload]  the voice of someone within VOICE m
//
// Names are checked (noms.mjs). Limits: 4 KB per message, 40 text messages and 60 voice frames per second per player,
// a silent connection is closed after 60 s (the server pings every 20 s), even one that never said hello.

import { cleanName } from './noms.mjs';
import { WsConn, handshake } from './ws.mjs';

const MAX_PLAYERS = Number(process.env.MONDE_MAX || 100);
const VIEW = 120; // m : the others you see
const VOICE = 30; // m : the others you hear
const MAX_SEEN = 40;
const TICK_MS = 100;
const COUNT_EVERY = 50; // ticks (5 s)
const MAX_MESSAGE = 4096;
const MAX_TEXT = 40; // per second
const MAX_VOICE = 60; // per second
const PING_EVERY = 20 * 1000;
const SILENT_MAX = 60 * 1000;
const PERSOS = new Set(['jojo', 'gege', 'mimi', 'karim', 'nadia']);

const players = new Map(); // id -> Player (those who said hello)
const conns = new Set(); // every open connection
let nextId = 1;
let ticks = 0;

export const mondeStats = () => ({
  connections: conns.size,
  players: players.size,
  voices: [...players.values()].filter((p) => p.voice).length,
});

class Player extends WsConn {
  constructor(socket) {
    super(socket, MAX_MESSAGE);
    this.id = 0;
    this.name = '';
    this.perso = 'jojo';
    this.voice = false;
    this.placed = false;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.f = 0;
    this.a = 0;
    this.lv = 1;
    this.seen = new Set(); // ids this player has been told about ("in")
    this.near = []; // the players within VIEW, nearest first (from the last tick)
    this.rateT = 0;
    this.textN = 0;
    this.voiceN = 0;
    conns.add(this);
  }

  /** Counts a message; false (and the connection closed) past the limit. */
  rate(voice) {
    const now = Date.now();
    if (now - this.rateT > 1000) { this.rateT = now; this.textN = 0; this.voiceN = 0; }
    if (voice) return ++this.voiceN <= MAX_VOICE; // (too many voice frames: dropped, not closed)
    if (++this.textN > MAX_TEXT) { this.close(1008); return false; }
    return true;
  }

  onText(raw) {
    if (!this.rate(false)) return;
    let m;
    try {
      m = JSON.parse(raw.toString('utf8'));
    } catch {
      return;
    }
    if (!m || typeof m !== 'object') return;
    if (m.op === 'hello') return this.hello(m);
    if (!this.id) return;
    if (m.op === 'p') return this.move(m);
    if (m.op === 'voice') { this.voice = m.on === true; return; }
  }

  hello(m) {
    if (this.id) return;
    const name = cleanName(m.name);
    if (!name) return this.refuse('Ce pseudo ne passe pas : 2 à 16 lettres ou chiffres, et rien d’insultant.');
    if (players.size >= MAX_PLAYERS) return this.refuse(`Le serveur est plein (${MAX_PLAYERS} joueurs). Réessaie dans un moment.`);
    this.id = nextId;
    nextId = nextId >= 65000 ? 1 : nextId + 1;
    while (players.has(this.id)) this.id += 1;
    this.name = name;
    this.perso = PERSOS.has(m.perso) ? m.perso : 'jojo';
    this.voice = m.voice === true;
    players.set(this.id, this);
    this.send({ op: 'welcome', id: this.id, count: players.size, view: VIEW, voice: VOICE });
  }

  refuse(msg) {
    this.send({ op: 'error', msg });
    this.close(1000);
  }

  move(m) {
    const num = (v, lo, hi) => (Number.isFinite(Number(v)) ? Math.min(hi, Math.max(lo, Number(v))) : lo);
    this.x = num(m.x, -1000, 1000);
    this.y = num(m.y, -50, 100);
    this.z = num(m.z, -1000, 1000);
    this.f = num(m.f, -10, 10);
    this.a = Math.round(num(m.a, 0, 3));
    this.lv = Math.round(num(m.lv, 1, 999));
    this.placed = true;
  }

  onBinary(buf) {
    if (!this.id || !this.voice || !this.placed || buf.length < 3 || !this.rate(true)) return;
    const out = Buffer.alloc(buf.length + 2);
    out.writeUInt16BE(this.id, 0);
    buf.copy(out, 2);
    for (const q of this.near) {
      if (q.voice && !q.closed && (q.x - this.x) ** 2 + (q.z - this.z) ** 2 <= VOICE * VOICE) q.sendBinary(out);
    }
  }

  onClosed() {
    conns.delete(this);
    if (!this.id || players.get(this.id) !== this) return;
    players.delete(this.id);
    for (const q of players.values()) {
      if (q.seen.delete(this.id)) q.send({ op: 'out', id: this.id });
    }
  }
}

/** One round of the world, every 100 ms: each player gets the others within view (who comes in, who goes out). */
function tick() {
  ticks += 1;
  const all = [...players.values()].filter((p) => p.placed && !p.closed);
  for (const p of all) {
    const near = [];
    for (const q of all) {
      if (q === p) continue;
      const d2 = (q.x - p.x) ** 2 + (q.z - p.z) ** 2;
      if (d2 <= VIEW * VIEW) near.push([d2, q]);
    }
    near.sort((a, b) => a[0] - b[0]);
    p.near = near.slice(0, MAX_SEEN).map((e) => e[1]);
    const ids = new Set(p.near.map((q) => q.id));
    for (const id of p.seen) {
      if (!ids.has(id)) {
        p.seen.delete(id);
        p.send({ op: 'out', id });
      }
    }
    for (const q of p.near) {
      if (!p.seen.has(q.id)) {
        p.seen.add(q.id);
        p.send({ op: 'in', id: q.id, name: q.name, perso: q.perso, lv: q.lv, voice: q.voice });
      }
    }
    if (p.near.length) {
      const r = (v) => Math.round(v * 100) / 100;
      p.send({ op: 's', p: p.near.map((q) => [q.id, r(q.x), r(q.y), r(q.z), r(q.f), q.a]) });
    }
    if (ticks % COUNT_EVERY === 0) p.send({ op: 'n', count: players.size });
  }
}

/** A WebSocket upgrade on <prefix>/monde (the server routes it here): a player of the Manif mode, online. */
export function mondeUpgrade(req, socket) {
  if (handshake(req, socket)) new Player(socket);
}

/** The world's clock (10 rounds a second), and its rounds every 20 s: pings, silent connections closed. */
export function startMonde() {
  setInterval(tick, TICK_MS).unref();
  setInterval(() => {
    const now = Date.now();
    for (const p of conns) {
      if (now - p.alive > SILENT_MAX) p.close(1001);
      else p.frame(0x9, Buffer.alloc(0));
    }
  }, PING_EVERY).unref();
}
