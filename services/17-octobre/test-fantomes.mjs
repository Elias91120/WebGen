// Test of the ghosts (fantomes.mjs, jalon 170): a path posted and served back, its city first, the bad paths refused.
//   node test-fantomes.mjs   (starts server.mjs on a free port with a temp data dir, tests it, stops it)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const data = mkdtempSync(join(tmpdir(), 'fantomes-'));
const port = 4000 + Math.floor(Math.random() * 8);
const base = `http://127.0.0.1:${port}/17-octobre/fichiers/fantomes`;
let fails = 0;
const check = (ok, what) => { console.log((ok ? '[OK] ' : '[FAIL] ') + what); if (!ok) fails++; };
const token = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');
const srv = spawn(process.execPath, [join(here, 'server.mjs'), `--port=${port}`, `--data=${data}`], { stdio: 'ignore' });
for (let k = 0; k < 40; k++) { try { await fetch(base); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }
const chemin = (n, x0) => Array.from({ length: n }, (_, k) => [x0 + 30 * k, 0, -50 + 5 * k]).flat();
const envoyer = async (body) => (await fetch(base, { method: 'POST', body: JSON.stringify(body) })).status;
try {
  check(await envoyer({ nom: 'Marseillais', jeton: token(), ville: 'marseille', perso: 'mimi', pts: chemin(60, 0) }) === 200, 'un trajet de Marseille');
  check(await envoyer({ nom: 'Lyonnais', jeton: token(), ville: 'lyon', perso: 'karim', pts: chemin(40, 100) }) === 200, 'un trajet de Lyon');
  check(await envoyer({ nom: 'Court', jeton: token(), ville: 'lyon', pts: [1, 2, 3, 4] }) === 400, 'un trajet trop court : refusé');
  const saute = chemin(30, 0);
  saute[21] = 9000;
  check(await envoyer({ nom: 'Teleporte', jeton: token(), ville: 'lyon', pts: saute }) === 400, 'un saut de 900 m en une seconde : refusé');
  check(await envoyer({ nom: 'Sansjeton', jeton: 'x', pts: chemin(30, 0) }) === 400, 'sans jeton : refusé');
  const l = (await (await fetch(`${base}?ville=marseille`)).json()).fantomes;
  check(l.length === 2 && l[0].ville === 'marseille' && l[0].nom === 'Marseillais' && l[0].pts.length === 180, 'servis, sa ville d’abord');
  check(l.every((f) => /^[0-9a-f]{12}$/.test(f.id) && !('jeton' in f)), 'un identifiant court, jamais le jeton');
} finally {
  srv.kill();
}
console.log(fails ? `${fails} échec(s)` : 'tout passe');
process.exit(fails ? 1 : 0);
