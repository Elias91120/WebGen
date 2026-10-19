// Test of the leaderboard (classement.mjs): the limits of a Manif run, and the runs added by hand (ajouts.json).
//   node test-classement.mjs     starts server.mjs locally twice on a free port (a temp data dir, a temp ajouts file),
//                                tests it, stops it
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const data = mkdtempSync(join(tmpdir(), 'classement-'));
const ajouts = join(data, 'ajouts.json');
writeFileSync(ajouts, JSON.stringify({
  manif: [{ nom: 'Testajout', perso: 'mimi', niveau: 130, temps: 3000, crs: 93966, victoire: true, mondes: 4, date: '2026-10-16' }],
}));
const port = 3980 + Math.floor(Math.random() * 8);
const base = `http://127.0.0.1:${port}/17-octobre/fichiers/classement`;

let fails = 0;
const check = (ok, what) => { console.log((ok ? '[OK] ' : '[FAIL] ') + what); if (!ok) fails++; };
const token = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');

async function start() {
  const srv = spawn(process.execPath, [join(here, 'server.mjs'), `--port=${port}`, `--data=${data}`],
    { stdio: 'ignore', env: { ...process.env, AJOUTS_FILE: ajouts } });
  for (let k = 0; k < 40; k++) {
    try { await fetch(base); return srv; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  throw new Error('le serveur ne démarre pas');
}
const post = async (body) => {
  const r = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { code: r.status, ...(await r.json()) };
};
const board = async () => (await fetch(base)).json();
const manif = (nom, jeton, f) => post({ nom, jeton, perso: 'jojo', version: '0.10.0', ...f });

let srv = await start();
try {
  // the score added by hand is there, checked and scored like a posted run
  let b = await board();
  const a = b.top.find((p) => p.nom === 'Testajout');
  check(a && a.score === 93966 + 50 * 130 + 2 * 1800 + 5000 + 3000 * 3 && a.mondes === 4 && a.perso === 'mimi',
    `le score ajouté à la main est au classement (${a ? a.score : 'absent'})`);

  // a long real run, over the old 80 000 CRS limit, is accepted
  let r = await manif('Longuepartie', token(), { niveau: 130, temps: 2400, crs: 93966, victoire: true, mondes: 4 });
  check(r.ok && r.score === 93966 + 6500 + 3600 + 5000 + 9000, `une partie de 93 966 CRS au monde 4 passe (${r.ok ? r.score : r.msg})`);
  r = await manif('Troplongue', token(), { niveau: 300, temps: 6 * 3600, crs: 1500000, victoire: true, mondes: 9 });
  check(r.ok, `une partie de six heures passe (${r.ok ? r.score : r.msg})`);

  // jalon 44: the Élysée taken (the 5th world, the real end) is worth 20 000 more; claimed before the 5th world, refused
  r = await manif('Roidesos', token(), { niveau: 90, temps: 2700, crs: 60000, victoire: true, mondes: 5, elysee: true });
  check(r.ok && r.score === 60000 + 4500 + 3600 + 5000 + 12000 + 20000, `l'Élysée pris vaut 20 000 de plus (${r.ok ? r.score : r.msg})`);
  r = await manif('Fauxroi', token(), { niveau: 60, temps: 1500, crs: 20000, victoire: true, mondes: 3, elysee: true });
  check(!r.ok && r.code === 400, "l'Élysée annoncé au monde 3 est refusé");

  // what the game can't produce is refused
  r = await manif('Tricheur', token(), { niveau: 40, temps: 600, crs: 1000000, victoire: true });
  check(!r.ok && r.code === 400, 'un million de CRS en dix minutes est refusé');
  r = await manif('Tricheur2', token(), { niveau: 150, temps: 300, crs: 1000, victoire: false });
  check(!r.ok && r.code === 400, 'le niveau 150 en cinq minutes est refusé');

  // the real player takes the name over, and keeps the better run
  const marion = token();
  r = await manif('Testajout', marion, { niveau: 20, temps: 400, crs: 900, victoire: false });
  check(r.ok && r.meilleur === a.score && r.record === false, `la vraie joueuse reprend son nom et garde sa meilleure partie (${r.ok ? r.meilleur : r.msg})`);
  b = await board();
  check(b.top.filter((p) => p.nom === 'Testajout').length === 1, 'le nom n’apparaît qu’une fois');
  r = await manif('Testajout', token(), { niveau: 20, temps: 400, crs: 900, victoire: false });
  check(!r.ok && r.code === 409, 'un autre joueur ne peut plus prendre ce nom');
  r = await manif('Testajout', marion, { niveau: 140, temps: 3600, crs: 120000, victoire: true, mondes: 5 });
  check(r.ok && r.record === true, 'sa partie suivante, meilleure, remplace le score ajouté');
} finally {
  srv.kill();
}

// after a restart, the added run doesn't come back next to the real player
await new Promise((r) => setTimeout(r, 300));
srv = await start();
try {
  const b = await board();
  check(b.top.filter((p) => p.nom === 'Testajout').length === 1, 'au redémarrage, le score ajouté ne revient pas en double');
} finally {
  srv.kill();
}

console.log(fails ? `${fails} échec(s)` : 'Tout passe.');
process.exit(fails ? 1 : 0);
