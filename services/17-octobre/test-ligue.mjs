// Test of the Ligue des Villes (ligue.mjs, jalon 169): the cities' totals, an event running, an event over (its champion),
// the moderation route.   node test-ligue.mjs   (starts server.mjs on a free port with a temp data dir, tests it, stops it)
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const data = mkdtempSync(join(tmpdir(), 'ligue-'));
const now = Date.now();
const iso = (ms) => new Date(ms).toISOString();
writeFileSync(join(data, 'events.json'), JSON.stringify([
  { id: 'passe', titre: 'Le test d’avant', ville: 'lyon', debut: iso(now - 7200e3), fin: iso(now + 4000) },
  { id: 'maintenant', titre: 'Dimanche 20 h', ville: 'paris', debut: iso(now - 600e3), fin: iso(now + 3600e3) },
]));
const port = 3990 + Math.floor(Math.random() * 8);
const base = `http://127.0.0.1:${port}/17-octobre/fichiers`;
const TOKEN = 'jeton-de-test-0123456789abcdef';

let fails = 0;
const check = (ok, what) => { console.log((ok ? '[OK] ' : '[FAIL] ') + what); if (!ok) fails++; };
const token = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');

const srv = spawn(process.execPath, [join(here, 'server.mjs'), `--port=${port}`, `--data=${data}`],
  { stdio: 'ignore', env: { ...process.env, UPLOAD_TOKEN: TOKEN } });
for (let k = 0; k < 40; k++) {
  try { await fetch(base + '/classement'); break; } catch { await new Promise((r) => setTimeout(r, 100)); }
}
const manif = async (nom, jeton, ville, crs) => {
  const r = await fetch(base + '/classement', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, jeton, perso: 'jojo', niveau: 5, temps: 200, crs, victoire: false, mondes: 1, ville }) });
  return { code: r.status, ...(await r.json()) };
};
const villes = async () => (await fetch(base + '/classement?mode=villes')).json();
try {
  const a = token(), b = token(), c = token();
  const r1 = await manif('Lyonnais1', a, 'lyon', 300);
  check(r1.ok && r1.score === 950, `une manif de Lyon compte (${r1.score})`);
  await manif('Lyonnais1', a, 'lyon', 100);   // (une deuxième manif, moins bonne : elle compte aussi pour la ville)
  await manif('Parigot', b, 'paris', 500);
  const r4 = await manif('SansVille', c, 'atlantide', 500);
  check(r4.ok, 'une ville inconnue : la manif passe au classement, sans ville');
  let v = await villes();
  const lyon = v.villes.find((x) => x.ville === 'lyon');
  check(lyon && lyon.total === 950 + 750 && lyon.joueurs === 1 && lyon.parties === 2, `Lyon : deux manifs additionnées, un joueur (${JSON.stringify(lyon)})`);
  check(v.villes[0].ville === 'lyon' && v.villes.length === 2, 'Lyon en tête, l’Atlantide nulle part');
  check(v.event && v.event.id === 'passe' && v.event.en_cours, 'l’event en cours est annoncé');
  check(v.liste.length === 20 && v.liste.some((x) => x.ville === 'saint_etienne'), 'la liste des villes modélisées');
  const top = await (await fetch(base + '/classement')).json();
  check(top.top.find((x) => x.nom === 'Parigot').ville === 'paris', 'la ville du joueur au classement des joueurs');
  // l'event d'avant se termine : son gagnant devient champion
  await new Promise((r) => setTimeout(r, 4500));
  v = await villes();
  check(v.champion && v.champion.ville === 'lyon', `Lyon championne de l’event fini (${JSON.stringify(v.champion)})`);
  check(v.event && v.event.id === 'maintenant', 'l’event suivant prend la place');
  await manif('Parigot', b, 'paris', 2000);
  v = await villes();
  check(v.event.classement[0].ville === 'paris', 'le classement de l’event ne compte que ses manifs');
  // la route de modération
  const refus = await fetch(base + '/ligue/event', { method: 'POST', body: '{}' });
  check(refus.status === 401, 'poser un event sans jeton : refusé');
  const ok = await fetch(base + '/ligue/event', { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ titre: 'Nancy', ville: 'paris', debut: iso(now + 86400e3), fin: iso(now + 90000e3) }) });
  check(ok.status === 200, 'poser un event avec le jeton');
} finally {
  srv.kill();
}
console.log(fails ? `${fails} échec(s)` : 'tout passe');
process.exit(fails ? 1 : 0);
