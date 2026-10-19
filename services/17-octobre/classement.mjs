// 17 OCTOBRE — the leaderboards (served by the file server on /17-octobre/fichiers/classement).
// Two boards: the Manif mode (default) and the Campagne mode ("les casseurs de Paname", since 0.10.0).
//
//   GET    /classement                {"top":[{rang,nom,perso,score,niveau,temps,crs,victoire,mondes,date}],"joueurs":N}
//   GET    /classement?mode=campagne  {"mode":"campagne","top":[{rang,nom,perso,score,coups,serie,duree,fin,plus_gros,date}],"joueurs":N}
//   POST   /classement                {"nom","jeton","perso","niveau","temps","crs","victoire","mondes","version"}          (manif)
//                                     {"mode":"campagne","nom","jeton","perso","bordel","coups","serie","duree","fin","plus_gros","version"}
//                                      → {"ok":true,"mode","score":S,"rang":R,"joueurs":N,"meilleur":B,"record":true|false}
//                                      or {"ok":false,"msg":"..."} (name taken, refused, too many tries...)
//   DELETE /classement?nom=X[&mode=campagne]   Authorization: Bearer <UPLOAD_TOKEN> — removes a name (moderation)
//
// Les Actes (20/10, Elias: « un scoreboard comme sur Megabonk : les meilleurs en CRS, en manifestant, les plus actifs
// récemment, les duels en ligne ») keep no best run: each finished match counts.
//   GET  /classement?mode=actes   {"mode":"actes","crs":[{rang,nom,victoires,parties}],"manifestants":[...],
//                                  "actifs":[{rang,nom,parties,derniere}],"duels":[{nom,cote,victoire,duree,date}],
//                                  "semaine":{"parties":N,"joueurs":M},"joueurs":N}
//   POST /classement              {"mode":"actes","nom","jeton","cote":"crs"|"manifestants",
//                                  "jeu":"escarmouche"|"acte"|"note"|"defi"|"duel"|"formation","victoire":bool,"duree":s,"version"}
//                                  → {"ok":true,"mode":"actes","victoires":V,"parties":P,"rang":R (in its side's ranking)}
//
// A player is a secret token kept by the game (no account, no password, no e-mail); the first token to use a name owns
// it on that board (case and accents ignored). Only each player's best run is kept. The Manif score is computed here
// from the facts, never taken from the game:
//   score = CRS dispersés + 50 × niveau + 2 × secondes tenues (30 min au plus) + 5 000 si Monsieur le Préfet est vaincu
//           + 3 000 par monde de plus atteint par le RER
// The Campagne score is the BORDEL total the game counted, bounded by what a soirée can produce (a cheap guard, not an
// anti-cheat, like the Manif's). Tokens are stored hashed.
// Stored in DATA_DIR/classement.json (manif) and DATA_DIR/casseurs.json (campagne), written through a temp file, one
// write at a time.
//
// Runs added by hand: ajouts.json next to this file (AJOUTS_FILE overrides it), {"manif": [{nom, perso, niveau, temps,
// crs, victoire, mondes, date, note}], "campagne": [...]}: a real run the server once refused (16/10: a Manif of 93 966
// CRS, over the old 80 000 limit), vouched for by Elias. Each one enters its board at start, checked like a posted run,
// if nobody holds the name yet; the first real player who then posts with that name takes it over and keeps the better
// of the two runs (the board remembers the taken names: `pris`).

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cleanName } from './noms.mjs';

const TOKEN_RE = /^[0-9a-f]{32}$/;
const MODES = { manif: 'classement.json', campagne: 'casseurs.json', actes: 'actes.json' };
const AJOUTS = process.env.AJOUTS_FILE || join(dirname(fileURLToPath(import.meta.url)), 'ajouts.json');
const PERSOS = {
  manif: new Set(['jojo', 'gege', 'mimi', 'karim', 'nadia']),
  campagne: new Set(['elias', 'noam', 'eden']),
  actes: new Set([]),
};
const DEFAULT_PERSO = { manif: 'jojo', campagne: 'elias', actes: '' };
const COTES = new Set(['crs', 'manifestants']);
const JEUX_ACTES = new Set(['escarmouche', 'acte', 'note', 'defi', 'duel', 'formation']);
const SEMAINE_MS = 7 * 24 * 3600 * 1000;
const TOP_ACTES = 10;
const FINS = new Set(['interpellé', 'aube', 'quitté']);
const TOP = 50;
const POSTS = 20; // per visitor per window
const WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY = 2048;

const boards = { manif: { joueurs: {} }, campagne: { joueurs: {} }, actes: { joueurs: {}, duels: [] } }; // mode -> {joueurs: hash(token) -> player}
const paths = {};
let saving = Promise.resolve();
const posts = new Map(); // visitor -> {n, until}

const modeOf = (v) => (v === 'campagne' || v === 'actes' ? v : 'manif');

// (0.9.0: the run goes on after the Prefect — RER to the next world — so each extra world reached is worth 3000;
// jalon 44: the 5th world, the Élysée castle, is terminal — taking it, the real end of the game, is worth 20 000 more)
export const ELYSEE_BONUS = 20000;
export const scoreOf = (f) =>
  f.crs + 50 * f.niveau + 2 * Math.min(f.temps, 1800) + (f.victoire ? 5000 : 0) + 3000 * Math.max(0, (f.mondes || 1) - 1)
  + (f.elysee ? ELYSEE_BONUS : 0);

const hash = (token) => createHash('sha256').update(token).digest('hex').slice(0, 32);
const keyOf = (name) => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export async function loadBoard(dir) {
  for (const [mode, file] of Object.entries(MODES)) {
    paths[mode] = join(dir, file);
    try {
      const b = JSON.parse(await fs.readFile(paths[mode], 'utf8'));
      boards[mode] = b && typeof b.joueurs === 'object' ? b : { joueurs: {} };
    } catch {
      boards[mode] = { joueurs: {} };
    }
    if (mode === 'actes' && !Array.isArray(boards.actes.duels)) boards.actes.duels = [];
  }
  await loadAjouts();
}

/** The runs added by hand (see the top of this file): each one enters its board if its name is free. */
async function loadAjouts() {
  let a;
  try {
    a = JSON.parse(await fs.readFile(AJOUTS, 'utf8'));
  } catch {
    return;
  }
  for (const mode of ['manif', 'campagne']) {
    const board = boards[mode];
    for (const r of Array.isArray(a && a[mode]) ? a[mode] : []) {
      const nom = cleanName(r && r.nom);
      const f = nom && (mode === 'campagne' ? factsCampagne(r) : factsManif(r));
      if (!f) {
        console.error(`classement (${mode}): ajout refusé`, JSON.stringify(r));
        continue;
      }
      const cle = keyOf(nom);
      if ((board.pris || []).includes(cle) || Object.values(board.joueurs).some((p) => p.cle === cle)) continue;
      const { score, ...facts } = f;
      const date = new Date(r.date || Date.now());
      board.joueurs[`ajout:${cle}`] = {
        nom, cle, perso: PERSOS[mode].has(r.perso) ? r.perso : DEFAULT_PERSO[mode], score, ...facts,
        date: (Number.isNaN(date.getTime()) ? new Date() : date).toISOString(), parties: 1, ajout: true,
      };
      console.log(`classement (${mode}): ajouté à la main : ${nom}, ${score}`);
    }
  }
}

export const boardStats = () => ({
  joueurs: Object.keys(boards.manif.joueurs).length,
  casseurs: Object.keys(boards.campagne.joueurs).length,
  actes: Object.keys(boards.actes.joueurs).length,
});

function save(mode) {
  const path = paths[mode];
  const data = JSON.stringify(boards[mode]);
  saving = saving
    .then(async () => {
      await fs.mkdir(join(path, '..'), { recursive: true });
      await fs.writeFile(`${path}.part`, data);
      await fs.rename(`${path}.part`, path);
    })
    .catch((e) => console.error(`classement (${mode}) not saved:`, e.message));
}

function ranked(mode) {
  return Object.values(boards[mode].joueurs).sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
}

function top(mode) {
  if (mode === 'actes') return topActes();
  const list = ranked(mode).slice(0, TOP);
  const joueurs = Object.keys(boards[mode].joueurs).length;
  if (mode === 'campagne') {
    return {
      mode,
      top: list.map((p, k) => ({
        rang: k + 1, nom: p.nom, perso: p.perso, score: p.score, coups: p.coups, serie: p.serie, duree: p.duree,
        fin: p.fin, plus_gros: p.plus_gros, date: p.date.slice(0, 10),
      })),
      joueurs,
    };
  }
  return {
    top: list.map((p, k) => ({
      rang: k + 1, nom: p.nom, perso: p.perso, score: p.score, niveau: p.niveau, temps: p.temps, crs: p.crs,
      victoire: p.victoire, mondes: p.mondes || 1, elysee: p.elysee === true, date: p.date.slice(0, 10),
    })),
    joueurs,
  };
}

const int = (v) => (Number.isInteger(v) ? v : NaN);

/**
 * The facts of a manif, checked; null if they can't be. (16/10: no more fixed cap on the CRS, 80 000 refused a real run
 * of 93 966 in the 4th world: after each Prefect the swarms double every minute, up to the horde's 390 at once; a run
 * is bounded by its pace instead, 100 CRS a second on average at most, and may last 6 hours.)
 */
function factsManif(m) {
  const f = {
    niveau: int(m.niveau), temps: int(m.temps), crs: int(m.crs), victoire: m.victoire === true,
    mondes: m.mondes === undefined ? 1 : int(m.mondes), elysee: m.elysee === true,
  };
  if (!(f.niveau >= 1 && f.niveau <= 999 && f.temps >= 0 && f.temps <= 21600 && f.crs >= 0)) return null;
  if (!(f.mondes >= 1 && f.mondes <= 12)) return null;
  if (f.crs > 100 * f.temps + 50 || f.niveau > 12 + f.temps / 6) return null; // (plus vite que le jeu ne le permet)
  if (f.victoire && (f.temps < 600 || f.niveau < 10)) return null; // (le Préfet n'arrive qu'à 10 min)
  if (f.mondes > 1 && (!f.victoire || f.temps < 600 + 130 * (f.mondes - 1))) return null; // (un monde de plus = un Préfet, puis 2 min de RER)
  if (f.elysee && (f.mondes < 5 || !f.victoire)) return null; // (l'Élysée n'est que le 5e monde, après quatre Préfets)
  return { ...f, score: scoreOf(f) };
}

/** The facts of a soirée of the Campagne, checked; null if a soirée can't produce them. */
function factsCampagne(m) {
  const f = {
    bordel: int(m.bordel), coups: int(m.coups), serie: int(m.serie), duree: int(m.duree),
    fin: String(m.fin || '').slice(0, 24),
  };
  if (!(f.bordel >= 0 && f.bordel <= 500000 && f.coups >= 0 && f.coups <= 5000 && f.serie >= 0 && f.serie <= 60)) return null;
  if (!(f.duree >= 10 && f.duree <= 4000)) return null; // (une soirée : 51 min au plus, 21 h 30 → 6 h)
  if (f.bordel > 400 * f.duree + 2000 || f.coups > 4 * f.duree + 20) return null; // (plus vite que le jeu ne le permet)
  if (!FINS.has(f.fin)) f.fin = 'interpellé';
  const pg = m.plus_gros && typeof m.plus_gros === 'object' ? m.plus_gros : {};
  const points = int(pg.points);
  f.plus_gros = { quoi: String(pg.quoi || '').slice(0, 40), points: points >= 0 && points <= f.bordel ? points : 0 };
  return { ...f, score: f.bordel };
}

/** Les Actes : les meilleurs de chaque camp (aux victoires), les plus actifs de la semaine, les derniers duels. */
function topActes() {
  const b = boards.actes;
  const all = Object.values(b.joueurs);
  const depuis = Date.now() - SEMAINE_MS;
  const camp = (cote) => all.filter((p) => p[cote] && p[cote].v > 0)
    .sort((x, y) => y[cote].v - x[cote].v || x[cote].p - y[cote].p || x.date.localeCompare(y.date))
    .slice(0, TOP_ACTES)
    .map((p, k) => ({ rang: k + 1, nom: p.nom, victoires: p[cote].v, parties: p[cote].p }));
  const semaine = all.map((p) => ({ p, n: (p.recentes || []).filter((d) => Date.parse(d) >= depuis).length }))
    .filter((x) => x.n > 0);
  return {
    mode: 'actes',
    crs: camp('crs'),
    manifestants: camp('manifestants'),
    actifs: semaine.sort((x, y) => y.n - x.n || y.p.derniere.localeCompare(x.p.derniere)).slice(0, TOP_ACTES)
      .map((x, k) => ({ rang: k + 1, nom: x.p.nom, parties: x.n, derniere: x.p.derniere.slice(0, 10) })),
    duels: (b.duels || []).slice(0, TOP_ACTES),
    semaine: { parties: semaine.reduce((s, x) => s + x.n, 0), joueurs: semaine.length },
    joueurs: all.length,
  };
}

/** The facts of a match of Les Actes, checked; null if they can't be. */
function factsActes(m) {
  const f = { cote: String(m.cote || ''), jeu: String(m.jeu || ''), victoire: m.victoire === true, duree: int(m.duree) };
  if (!COTES.has(f.cote) || !JEUX_ACTES.has(f.jeu)) return null;
  if (!(f.duree >= 20 && f.duree <= 4 * 3600)) return null; // (moins de 20 s : pas une partie)
  return f;
}

async function postActes(m, nom, res, ctx) {
  const f = factsActes(m);
  if (!f) return ctx.send(res, 400, { ok: false, msg: 'Cette partie ne tient pas debout : refusée.' });
  const b = boards.actes;
  const id = hash(m.jeton);
  const cle = keyOf(nom);
  const owner = Object.entries(b.joueurs).find(([k, p]) => p.cle === cle && k !== id);
  if (owner) return ctx.send(res, 409, { ok: false, msg: `Le pseudo « ${nom} » est déjà pris : choisis-en un autre.` });
  const now = new Date().toISOString();
  const p = b.joueurs[id] || { crs: { p: 0, v: 0 }, manifestants: { p: 0, v: 0 }, duel: { p: 0, v: 0 }, recentes: [], parties: 0, date: now };
  p.nom = nom;
  p.cle = cle;
  p[f.cote].p += 1;
  if (f.victoire) p[f.cote].v += 1;
  if (f.jeu === 'duel') {
    p.duel.p += 1;
    if (f.victoire) p.duel.v += 1;
    b.duels = [{ nom, cote: f.cote, victoire: f.victoire, duree: f.duree, date: now.slice(0, 16).replace('T', ' ') }, ...(b.duels || [])].slice(0, 30);
  }
  p.parties += 1;
  p.derniere = now;
  p.recentes = [now, ...(p.recentes || [])].slice(0, 60);
  b.joueurs[id] = p;
  save('actes');
  const rang = topActes()[f.cote].findIndex((x) => x.nom === nom) + 1;
  ctx.send(res, 200, { ok: true, mode: 'actes', victoires: p[f.cote].v, parties: p[f.cote].p, rang });
}

function tooMany(visitor) {
  const now = Date.now();
  const a = posts.get(visitor);
  const cur = a && a.until > now ? a : { n: 0, until: now + WINDOW_MS };
  cur.n += 1;
  posts.set(visitor, cur);
  return cur.n > POSTS;
}

async function post(req, res, ctx) {
  if (tooMany(ctx.visitor(req))) return ctx.send(res, 429, { ok: false, msg: 'Trop de scores envoyés : réessaie dans quelques minutes.' });
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) return ctx.send(res, 413, { ok: false, msg: 'trop long' });
  }
  let m;
  try {
    m = JSON.parse(raw);
  } catch {
    return ctx.send(res, 400, { ok: false, msg: 'illisible' });
  }
  const mode = modeOf(m && m.mode);
  const nom = cleanName(m && m.nom);
  if (!nom) return ctx.send(res, 400, { ok: false, msg: 'Ce pseudo ne passe pas : 2 à 16 lettres ou chiffres, et rien d’insultant.' });
  if (!TOKEN_RE.test(String(m.jeton || ''))) return ctx.send(res, 400, { ok: false, msg: 'jeton invalide' });
  if (mode === 'actes') return postActes(m, nom, res, ctx);
  const f = mode === 'campagne' ? factsCampagne(m) : factsManif(m);
  if (!f) {
    return ctx.send(res, 400, {
      ok: false, msg: mode === 'campagne' ? 'Cette soirée ne tient pas debout : score refusé.' : 'Cette manif ne tient pas debout : score refusé.',
    });
  }
  const board = boards[mode];
  const id = hash(m.jeton);
  const cle = keyOf(nom);
  const owner = Object.entries(board.joueurs).find(([k, p]) => p.cle === cle && k !== id);
  if (owner && !owner[1].ajout) return ctx.send(res, 409, { ok: false, msg: `Le pseudo « ${nom} » est déjà pris : choisis-en un autre.` });
  if (owner) {
    // (un score ajouté à la main : le vrai joueur reprend le nom, et la meilleure des deux parties)
    const [k, p] = owner;
    delete board.joueurs[k];
    board.pris = [...new Set([...(board.pris || []), cle])];
    const mine = board.joueurs[id];
    if (!mine || p.score > mine.score) {
      const { ajout, ...run } = p;
      board.joueurs[id] = { ...run, parties: (mine ? mine.parties : 0) + (run.parties || 1) };
    }
  }
  const { score, ...facts } = f;
  const old = board.joueurs[id];
  const record = !old || score > old.score;
  const parties = (old ? old.parties : 0) + 1;
  if (record) {
    board.joueurs[id] = {
      nom, cle, perso: PERSOS[mode].has(m.perso) ? m.perso : DEFAULT_PERSO[mode], score, ...facts,
      date: new Date().toISOString(), parties,
    };
  } else {
    old.nom = nom; // (on peut changer de pseudo ; le meilleur score reste)
    old.cle = cle;
    old.parties = parties;
  }
  save(mode);
  const list = ranked(mode);
  const rang = list.findIndex((p) => p === board.joueurs[id]) + 1;
  ctx.send(res, 200, { ok: true, mode, score, rang, joueurs: list.length, meilleur: board.joueurs[id].score, record });
}

function remove(req, res, url, ctx) {
  if (!ctx.authorized(req)) return ctx.send(res, 401, { error: 'unauthorized' });
  const mode = modeOf(url.searchParams.get('mode'));
  const board = boards[mode];
  const cle = keyOf(String(url.searchParams.get('nom') || ''));
  const before = Object.keys(board.joueurs).length;
  for (const [k, p] of Object.entries(board.joueurs)) if (p.cle === cle) delete board.joueurs[k];
  save(mode);
  ctx.send(res, 200, { ok: true, mode, removed: before - Object.keys(board.joueurs).length });
}

/** The leaderboard's routes; false if `path` isn't one of them. ctx: {send, visitor, authorized}. */
export async function classement(req, res, url, path, ctx) {
  if (path !== '/classement') return false;
  if (req.method === 'GET') {
    ctx.send(res, 200, top(modeOf(url.searchParams.get('mode'))), 'application/json; charset=utf-8', { 'Access-Control-Allow-Origin': '*' });
  } else if (req.method === 'POST') await post(req, res, ctx);
  else if (req.method === 'DELETE') remove(req, res, url, ctx);
  else ctx.send(res, 405, { error: 'method not allowed' });
  return true;
}
