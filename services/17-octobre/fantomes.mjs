// 17 OCTOBRE — les fantômes de la Manif (jalon 170 ; Elias, 26/10 : « on les voit en transparent… leur pseudo au-dessus…
// un univers parallèle où tu vois tout le monde qui sont dans la même map et dans la même game que toi, mais qui fait sa
// game solo… le nom de ta ville au-dessus de ton blase »).
//
// Not live (the shared online Paris crashed the Mac Mini on 18/10): each finished Manif posts once its path through the
// first world (Paris, République), one point a second; a new run fetches once the latest paths and replays them, in
// transparency, with their name and city.
//
//   POST /fantomes  {nom, jeton, ville, perso, pts: [x0, y0, z0, x1, y1, z1, …] (decimetres, one point a second), version}
//                    → {ok}
//   GET  /fantomes?ville=lyon   {"fantomes": [{id, nom, ville, perso, pts}]}  (20 at most: the player's city first, then
//                                the most recent; id: the first 12 hex of the hashed token, so the game skips its own)
// Stored: DATA_DIR/fantomes.json, the latest run of each player, 400 players at most.
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

import { VILLES } from './ligue.mjs';
import { cleanName } from './noms.mjs';

const TOKEN_RE = /^[0-9a-f]{32}$/;
const PERSOS = new Set(['jojo', 'gege', 'mimi', 'karim', 'nadia', 'droven']);
const MAX_PTS = 600;          // (10 minutes : le premier monde en dure 5)
const MAX_CORPS = 24 * 1024;
const GARDER = 400;
const SERVIS = 20;
const POSTS = 12;             // (par visiteur et par 10 minutes)

let DATA = '/data';
let fantomes = {};            // hash -> {id, nom, ville, perso, pts, date}
let saving = Promise.resolve();
const posts = new Map();

const hash = (token) => createHash('sha256').update(token).digest('hex').slice(0, 32);

export async function chargerFantomes(dir) {
  DATA = dir;
  try {
    fantomes = JSON.parse(await fs.readFile(join(DATA, 'fantomes.json'), 'utf8')) || {};
  } catch {
    fantomes = {};
  }
}

function sauver() {
  const data = JSON.stringify(fantomes);
  saving = saving
    .then(async () => {
      await fs.mkdir(DATA, { recursive: true });
      await fs.writeFile(join(DATA, 'fantomes.json.part'), data);
      await fs.rename(join(DATA, 'fantomes.json.part'), join(DATA, 'fantomes.json'));
    })
    .catch((e) => console.error('fantomes not saved:', e.message));
}

/** The path, checked: whole decimetres, pairs, inside the map, no faster than the game allows (15 m/s on average). */
export function trajet(pts) {
  if (!Array.isArray(pts) || pts.length < 30 || pts.length > 3 * MAX_PTS || pts.length % 3) return null;
  if (!pts.every((v) => Number.isInteger(v) && Math.abs(v) <= 40000)) return null;
  for (let k = 3; k < pts.length; k += 3) {
    if (Math.hypot(pts[k] - pts[k - 3], pts[k + 2] - pts[k - 1]) > 400) return null; // (40 m en une seconde : un saut de carte)
  }
  return pts;
}

function tropDe(visiteur) {
  const now = Date.now();
  const a = posts.get(visiteur);
  const cur = a && a.until > now ? a : { n: 0, until: now + 600_000 };
  cur.n += 1;
  posts.set(visiteur, cur);
  return cur.n > POSTS;
}

export function servir(ville) {
  const tous = Object.values(fantomes).sort((a, b) => b.date.localeCompare(a.date));
  const v = Object.hasOwn(VILLES, ville) ? ville : '';
  const choisis = [...tous.filter((f) => v && f.ville === v), ...tous.filter((f) => !v || f.ville !== v)].slice(0, SERVIS);
  return { fantomes: choisis.map(({ id, nom, ville: vi, perso, pts }) => ({ id, nom, ville: vi, perso, pts })) };
}

export async function routesFantomes(req, res, url, path, ctx) {
  if (path !== '/fantomes') return false;
  const cors = { 'Access-Control-Allow-Origin': '*' };
  if (req.method === 'GET') {
    ctx.send(res, 200, servir(String(url.searchParams.get('ville') || '')), 'application/json; charset=utf-8', cors);
    return true;
  }
  if (req.method !== 'POST') {
    ctx.send(res, 405, { error: 'method not allowed' });
    return true;
  }
  if (tropDe(ctx.visitor(req))) {
    ctx.send(res, 429, { ok: false });
    return true;
  }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_CORPS) {
      ctx.send(res, 413, { ok: false });
      return true;
    }
  }
  let m = null;
  try { m = JSON.parse(raw); } catch { m = null; }
  const nom = cleanName(m && m.nom);
  const pts = m && trajet(m.pts);
  if (!nom || !TOKEN_RE.test(String(m.jeton || '')) || !pts) {
    ctx.send(res, 400, { ok: false });
    return true;
  }
  const h = hash(m.jeton);
  fantomes[h] = {
    id: h.slice(0, 12), nom, ville: Object.hasOwn(VILLES, String(m.ville || '')) ? String(m.ville) : '',
    perso: PERSOS.has(m.perso) ? m.perso : 'jojo', pts, date: new Date().toISOString(),
  };
  const garder = Object.entries(fantomes).sort((a, b) => b[1].date.localeCompare(a[1].date)).slice(0, GARDER);
  fantomes = Object.fromEntries(garder);
  sauver();
  ctx.send(res, 200, { ok: true }, 'application/json; charset=utf-8', cors);
  return true;
}
