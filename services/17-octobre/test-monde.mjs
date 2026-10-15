// Test of the Manif mode's shared world (monde.mjs) and leaderboard (classement.mjs), with Node's built-in WebSocket.
//   node test-monde.mjs                  starts server.mjs locally on a free port (3 players at most), tests it, stops it
//   node test-monde.mjs https://www.3geeks.fr/17-octobre/fichiers    the same against production (no capacity test)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

let base = process.argv[2];
let srv = null;
if (!base) {
  const port = 3980 + Math.floor(Math.random() * 8);
  srv = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'server.mjs'), `--port=${port}`, `--data=${mkdtempSync(join(tmpdir(), 'monde-'))}`],
    { stdio: 'ignore', env: { ...process.env, MONDE_MAX: '3' } });
  await new Promise((r) => setTimeout(r, 700));
  base = `http://127.0.0.1:${port}/17-octobre/fichiers`;
}
const wsUrl = base.replace(/^http/, 'ws') + '/monde';

let fails = 0;
const check = (ok, what) => { console.log((ok ? '[OK] ' : '[FAIL] ') + what); if (!ok) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** A player: opens, keeps every message (text and voice), waits for the next one of an op. */
function player() {
  const ws = new WebSocket(wsUrl);
  ws.binaryType = 'arraybuffer';
  const inbox = [];
  const voices = [];
  const waiters = [];
  ws.onmessage = (e) => {
    if (typeof e.data !== 'string') return voices.push(Buffer.from(e.data));
    const m = JSON.parse(e.data);
    const w = waiters.findIndex((x) => x.op === m.op && (!x.when || x.when(m)));
    if (w >= 0) waiters.splice(w, 1)[0].resolve(m);
    else inbox.push(m);
  };
  const opened = new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  const closed = new Promise((resolve) => { ws.onclose = resolve; });
  return {
    ws, opened, closed, inbox, voices,
    send: (m) => ws.send(JSON.stringify(m)),
    next: (op, when = null, ms = 3000) => {
      const i = inbox.findIndex((m) => m.op === op && (!when || when(m)));
      if (i >= 0) return Promise.resolve(inbox.splice(i, 1)[0]);
      return new Promise((resolve) => {
        const w = { op, when, resolve };
        waiters.push(w);
        setTimeout(() => { const k = waiters.indexOf(w); if (k >= 0) { waiters.splice(k, 1); resolve(null); } }, ms);
      });
    },
  };
}

async function postScore(body) {
  const r = await fetch(`${base}/classement`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { status: r.status, body: await r.json() };
}

try {
  // --- the world ---
  const a = player();
  const b = player();
  await Promise.all([a.opened, b.opened]);
  check(true, `connected to ${wsUrl}`);
  a.send({ op: 'hello', name: 'Pute du 93', perso: 'jojo', version: '9.9.9', voice: true });
  check((await a.next('error'))?.msg.includes('pseudo'), 'an insulting name is refused');
  await a.closed;
  const a2 = player();
  await a2.opened;
  a2.send({ op: 'hello', name: 'Monique', perso: 'mimi', version: '9.9.9', voice: true });
  const wa = await a2.next('welcome');
  check(wa && wa.id > 0, `"Monique" is welcome (id ${wa && wa.id})`);
  b.send({ op: 'hello', name: 'Gégé_75', perso: 'gege', version: '9.9.9', voice: true });
  const wb = await b.next('welcome');
  check(wb && wb.id > 0 && wb.count === 2, `a second player (${wb && wb.count} online)`);
  a2.send({ op: 'p', x: -160, y: 0, z: 18, f: 3.1, a: 1, lv: 4 });
  b.send({ op: 'p', x: -150, y: 0, z: 18, f: 0, a: 0, lv: 7 });
  const inA = await a2.next('in');
  check(inA && inA.id === wb.id && inA.name === 'Gégé_75' && inA.perso === 'gege', 'each sees the other come into view (name, character)');
  const sA = await a2.next('s', (m) => m.p.some((e) => e[0] === wb.id));
  check(sA && sA.p.find((e) => e[0] === wb.id)[1] === -150, 'positions arrive 10 times a second');
  // voice: 10 m apart, both with voice on: B hears A
  const frame = Buffer.concat([Buffer.from([0, 1]), randomBytes(160)]);
  a2.ws.send(frame);
  await sleep(250);
  const got = b.voices.find((v) => v.readUInt16BE(0) === wa.id);
  check(got && got.length === frame.length + 2 && got.subarray(2).equals(frame), 'voice reaches a player 10 m away, tagged with who speaks');
  // far away: out of earshot, then out of view
  b.send({ op: 'p', x: -110, y: 0, z: 18, f: 0, a: 0, lv: 7 });
  await sleep(250);
  b.voices.length = 0;
  a2.ws.send(frame);
  await sleep(250);
  check(b.voices.length === 0, 'not heard 50 m away (voice range 30 m)');
  b.send({ op: 'p', x: 100, y: 0, z: 18, f: 0, a: 0, lv: 7 });
  check((await a2.next('out', (m) => m.id === wb.id)) !== null, 'gone out of view 260 m away');
  // voice off: nothing sent, nothing heard
  b.send({ op: 'p', x: -150, y: 0, z: 18, f: 0, a: 0, lv: 7 });
  await a2.next('in', (m) => m.id === wb.id);
  b.send({ op: 'voice', on: false });
  await sleep(150);
  b.voices.length = 0;
  a2.ws.send(frame);
  await sleep(250);
  check(b.voices.length === 0, 'a player with voice off hears nobody');
  // capacity (local server: 3 at most)
  if (srv) {
    const c = player();
    const d = player();
    await Promise.all([c.opened, d.opened]);
    c.send({ op: 'hello', name: 'Karim', perso: 'karim', version: '9.9.9' });
    check((await c.next('welcome')) !== null, 'a third player');
    d.send({ op: 'hello', name: 'Nadia', perso: 'nadia', version: '9.9.9' });
    check((await d.next('error'))?.msg.includes('plein'), 'a fourth is told the server is full');
    c.ws.close();
  }
  b.ws.close();
  check((await a2.next('out', (m) => m.id === wb.id)) !== null, 'a player who leaves goes out of view');
  a2.ws.close();

  // --- the leaderboard ---
  const tok = randomBytes(16).toString('hex');
  const tok2 = randomBytes(16).toString('hex');
  const run = { nom: 'Testeur', jeton: tok, perso: 'karim', niveau: 20, temps: 400, crs: 900, victoire: false, version: '9.9.9' };
  let r = await postScore(run);
  check(r.status === 200 && r.body.ok && r.body.score === 900 + 50 * 20 + 2 * 400, `a score is computed by the server (${r.body.score})`);
  r = await postScore({ ...run, crs: 100 });
  check(r.body.ok && r.body.record === false && r.body.meilleur === 2700, 'a lower score keeps the best one');
  r = await postScore({ ...run, jeton: tok2 });
  check(r.status === 409 && r.body.msg.includes('déjà pris'), 'a name belongs to the first player who used it');
  r = await postScore({ ...run, jeton: tok2, nom: 'Autre', niveau: 150, temps: 60 });
  check(r.status === 400 && r.body.msg.includes('tient pas debout'), 'an impossible manif is refused');
  r = await postScore({ ...run, jeton: tok2, nom: 'Gagnant', niveau: 40, temps: 720, crs: 3000, victoire: true });
  check(r.body.ok && r.body.rang === 1 && r.body.score === 3000 + 2000 + 1440 + 5000, 'a victory counts 5 000 and goes first');
  const board = await (await fetch(`${base}/classement`)).json();
  check(board.top.length >= 2 && board.top[0].nom === 'Gagnant' && board.top[1].nom === 'Testeur' && !('jeton' in board.top[0]),
    `the public top (${board.joueurs} players, no tokens)`);
} catch (e) {
  check(false, `error: ${e.message || e}`);
} finally {
  if (srv) srv.kill();
}
console.log(fails ? `FAILED (${fails})` : 'ALL OK');
setTimeout(() => process.exit(fails ? 1 : 0), 100);
