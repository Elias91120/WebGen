// Test of the duel relay (relay.mjs), with Node 22's built-in WebSocket client.
//   node test-relay.mjs                  starts server.mjs locally on a free port, tests it, stops it
//   node test-relay.mjs wss://www.3geeks.fr/17-octobre/fichiers/relais   tests the relay in production
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

let url = process.argv[2];
let srv = null;
if (!url) {
  const port = 3990 + Math.floor(Math.random() * 8);
  srv = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'server.mjs'), `--port=${port}`, `--data=${mkdtempSync(join(tmpdir(), 'relay-'))}`], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 700));
  url = `ws://127.0.0.1:${port}/17-octobre/fichiers/relais`;
}

let fails = 0;
const check = (ok, what) => { console.log((ok ? '[OK] ' : '[FAIL] ') + what); if (!ok) fails++; };

/** A client: opens, keeps every message, waits for the next one of an op. */
function client() {
  const ws = new WebSocket(url);
  const inbox = [];
  const waiters = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    const w = waiters.findIndex((x) => x.op === m.op);
    if (w >= 0) waiters.splice(w, 1)[0].resolve(m);
    else inbox.push(m);
  };
  const opened = new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  return {
    ws,
    opened,
    send: (m) => ws.send(JSON.stringify(m)),
    next: (op, ms = 4000) => {
      const i = inbox.findIndex((m) => m.op === op);
      if (i >= 0) return Promise.resolve(inbox.splice(i, 1)[0]);
      return new Promise((resolve) => {
        const w = { op, resolve };
        waiters.push(w);
        setTimeout(() => { const k = waiters.indexOf(w); if (k >= 0) { waiters.splice(k, 1); resolve(null); } }, ms);
      });
    },
  };
}

try {
  const a = client();
  const b = client();
  const c = client();
  await Promise.all([a.opened, b.opened, c.opened]);
  check(true, `connected to ${url}`);
  a.send({ op: 'create', side: 1, params: { seed: 271828, places: 4, ambiance: 'jour', duel: true }, version: '9.9.9' });
  const created = await a.next('created');
  check(created && /^[A-HJ-NP-Z]{4}$/.test(created.code), `room created: ${created && created.code}`);
  b.send({ op: 'join', code: 'ZZZZ', version: '9.9.9' });
  check((await b.next('error'))?.msg.includes('aucune partie'), 'unknown code refused');
  b.send({ op: 'join', code: created.code, version: '1.0.0' });
  check((await b.next('error'))?.msg.includes('même version'), 'other version refused');
  b.send({ op: 'join', code: created.code.toLowerCase(), version: '9.9.9' });
  const [sa, sb] = await Promise.all([a.next('start'), b.next('start')]);
  check(sa && sb && sa.seed === sb.seed && sa.seed > 0, `both start with the same seed (${sa && sa.seed})`);
  check(sa && sb && sa.side === 1 && sb.side === 0 && sb.params.places === 4, 'host plays CRS, guest the protesters, same params');
  a.send({ op: 'm', d: { t: 6, s: 1, c: [['hold', 3]] } });
  b.send({ op: 'm', d: { t: 6, s: 0, c: [] } });
  const [ma, mb] = await Promise.all([a.next('m'), b.next('m')]);
  check(mb && mb.d.c[0][0] === 'hold' && ma && ma.d.s === 0, 'orders forwarded both ways, unchanged');
  const t0 = Date.now();
  for (let k = 0; k < 120; k++) a.send({ op: 'm', d: { t: 7 + k, s: 1, c: [] } });
  let got = 0;
  while (got < 120 && (await b.next('m', 3000))) got++;
  check(got === 120, `120 ticks relayed in order (${Date.now() - t0} ms)`);
  c.send({ op: 'join', code: created.code, version: '9.9.9' });
  check((await c.next('error'))?.msg.includes('deux joueurs'), 'a third player is refused');
  a.send({ op: 'leave' });
  check((await b.next('left')) !== null, 'the host leaves: the guest is told');
  for (const x of [a, b, c]) x.ws.close();
} catch (e) {
  check(false, `error: ${e.message || e}`);
} finally {
  if (srv) srv.kill();
}
console.log(fails ? `FAILED (${fails})` : 'ALL OK');
setTimeout(() => process.exit(fails ? 1 : 0), 100);
