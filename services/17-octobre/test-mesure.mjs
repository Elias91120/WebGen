// Test of the audience measurement (mesure.mjs): game and site events in, the dashboard's numbers out.
//   node test-mesure.mjs     starts server.mjs locally on a free port (a temp data dir), tests it, stops it
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = 39000 + Math.floor(Math.random() * 900);
const TOKEN = 'test-token-0123456789abcdef';
const LECTURE = 'test-lecture-0123456789abcdef'; // STATS_TOKEN: lit les chiffres, n'envoie rien
const srv = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'server.mjs'), `--port=${port}`,
  `--data=${mkdtempSync(join(tmpdir(), 'mesure-'))}`], { env: { ...process.env, UPLOAD_TOKEN: TOKEN, STATS_TOKEN: LECTURE },
  stdio: 'ignore' });
const base = `http://127.0.0.1:${port}/17-octobre/fichiers`;
let fails = 0;
const check = (ok, what) => { console.log(`[${ok ? 'OK' : 'ÉCHEC'}] ${what}`); if (!ok) fails += 1; };
const post = (e) => fetch(`${base}/evenement`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(e) });
await new Promise((r) => setTimeout(r, 800));
try {
  const a = 'joueur-aaaaaaaa', b = 'joueur-bbbbbbbb';
  check((await post({ t: 'lancement', j: 'hub', v: '0.13.0', id: a })).ok, 'un lancement passe');
  await post({ t: 'debut', j: 'campagne', v: '0.13.0', id: a });
  await post({ t: 'debut', j: 'manif', v: '0.12.0', id: b });
  await post({ t: 'battement', j: 'manif', v: '0.12.0', id: b });
  await post({ t: 'fin', j: 'campagne', v: '0.13.0', id: a, d: 600, s: 12345, r: 'victoire' });
  check(!(await post({ t: 'debut', j: 'tetris', v: '1', id: a })).ok, 'un jeu inconnu est refusé');
  check(!(await post({ t: 'debut', j: 'manif', v: '1', id: 'x' })).ok, 'un identifiant trop court est refusé');
  check(!(await fetch(`${base}/evenement`, { method: 'POST', body: 'pas du json' })).ok, 'un corps illisible est refusé');
  await post({ t: 'page', p: '/17-octobre', vid: 'visite-11111111', r: 'www.google.com', w: 'mobile' });
  await post({ t: 'quitte', p: '/17-octobre', vid: 'visite-11111111', d: 42, sc: 70, se: 'telecharger' });
  await post({ t: 'page', p: '/17-octobre/', vid: 'visite-22222222', w: 'bureau' });
  await post({ t: 'quitte', p: '/17-octobre/', vid: 'visite-22222222', d: 4, sc: 0, se: '' });
  check((await fetch(`${base}/stats/tableau`)).status === 401, 'le tableau sans le jeton : refusé');
  const t = await (await fetch(`${base}/stats/tableau`, { headers: { Authorization: `Bearer ${TOKEN}` } })).json();
  const auj = t.jours[t.jours.length - 1];
  check(t.maintenant.connectes === 1 && t.maintenant.par_jeu.manif === 1, `un joueur en jeu, dans la Manif (${JSON.stringify(t.maintenant)})`);
  check(auj.modes.manif && auj.modes.manif.battements === 1 && auj.modes.manif.parties === 1, 'le battement de la Manif compté (le temps de jeu)');
  check(t.semaine.joueurs === 2 && t.semaine.par_jeu.campagne === 1 && t.semaine.versions['0.13.0'] === 1,
    `deux joueurs cette semaine, un dans la Campagne, un en 0.13.0 (${JSON.stringify(t.semaine)})`);
  const c = auj.modes.campagne || {};
  check(c.parties === 1 && c.fins === 1 && c.duree_moyenne === 600 && c.meilleur === 12345 && c.victoires === 1, 'la partie de Campagne comptée');
  const pg = auj.site.pages['/17-octobre'] || {};
  check(auj.site.vues === 2 && pg.vues === 2 && pg.quittes === 2 && pg.duree_moyenne === 23 && pg.scroll_moyen === 35
    && auj.site.sorties['/17-octobre#telecharger'] === 1 && auj.site.sorties['/17-octobre#haut'] === 1
    && auj.site.referents['www.google.com'] === 1 && auj.site.referents.direct === 1,
    `les visites du site comptées, « /17-octobre/ » et « /17-octobre » ensemble (durée, défilement, sortie, provenance : ${JSON.stringify(auj.site)})`);
  check(t.mois && t.mois.joueurs === 2 && t.mois.visiteurs === 2, `le mois ensemble (${JSON.stringify(t.mois)})`);
  // (le jeton de lecture du tableau sur Vercel : il lit les chiffres, il ne peut rien envoyer)
  const lu = await fetch(`${base}/stats/tableau`, { headers: { Authorization: `Bearer ${LECTURE}` } });
  const st = await fetch(`${base}/stats`, { headers: { Authorization: `Bearer ${LECTURE}` } });
  const envoi = await fetch(`${base}/upload/version.json`, { method: 'PUT', headers: { Authorization: `Bearer ${LECTURE}` }, body: '{}' });
  check(lu.status === 200 && st.status === 200 && envoi.status === 401,
    `le jeton de lecture lit le tableau et /stats, mais ne peut rien envoyer (${lu.status}, ${st.status}, ${envoi.status})`);
  // (la limite : un visiteur qui inonde est coupé)
  let refus = 0;
  for (let k = 0; k < 100; k += 1) if ((await post({ t: 'battement', j: 'manif', v: '0.12.0', id: b })).status === 429) refus += 1;
  check(refus > 0, `un visiteur qui inonde est limité (${refus} refus)`);
} finally {
  srv.kill();
}
console.log(fails ? `${fails} échec(s)` : 'Tout passe.');
process.exit(fails ? 1 : 0);
