// 17 OCTOBRE — the Manif mode's leaderboard (served by the file server on /17-octobre/fichiers/classement).
//
//   GET    /classement               {"top":[{rang,nom,perso,score,niveau,temps,crs,victoire,date}],"joueurs":N}   (public)
//   POST   /classement               {"nom","jeton","perso","niveau","temps","crs","victoire","version"}
//                                      → {"ok":true,"score":S,"rang":R,"joueurs":N,"meilleur":B,"record":true|false}
//                                      or {"ok":false,"msg":"..."} (name taken, refused, too many tries...)
//   DELETE /classement?nom=X          Authorization: Bearer <UPLOAD_TOKEN> — removes a name (moderation)
//
// A player is a secret token kept by the game (no account, no password, no e-mail); the first token to use a name owns
// it (case and accents ignored). Only each player's best manif is kept. The score is computed here from the facts,
// never taken from the game:
//   score = CRS dispersés + 50 × niveau + 2 × secondes tenues (20 min au plus) + 5 000 si Monsieur le Préfet est vaincu
// Facts that can't happen in a manif are refused (a cheap guard, not an anti-cheat). Tokens are stored hashed.
// Stored in DATA_DIR/classement.json, written through a temp file, one write at a time.

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

import { cleanName } from './noms.mjs';

const TOKEN_RE = /^[0-9a-f]{32}$/;
const PERSOS = new Set(['jojo', 'gege', 'mimi', 'karim', 'nadia']);
const TOP = 50;
const POSTS = 20; // per visitor per window
const WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY = 2048;

let board = { joueurs: {} }; // hash(token) -> {nom, cle, perso, score, niveau, temps, crs, victoire, date, parties}
let path = '';
let saving = Promise.resolve();
const posts = new Map(); // visitor -> {n, until}

export const scoreOf = (f) => f.crs + 50 * f.niveau + 2 * Math.min(f.temps, 1200) + (f.victoire ? 5000 : 0);

const hash = (token) => createHash('sha256').update(token).digest('hex').slice(0, 32);
const keyOf = (name) => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export async function loadBoard(dir) {
  path = join(dir, 'classement.json');
  try {
    board = JSON.parse(await fs.readFile(path, 'utf8'));
    if (!board || typeof board.joueurs !== 'object') board = { joueurs: {} };
  } catch {
    board = { joueurs: {} };
  }
}

export const boardStats = () => ({ joueurs: Object.keys(board.joueurs).length });

function save() {
  saving = saving
    .then(async () => {
      await fs.mkdir(join(path, '..'), { recursive: true });
      await fs.writeFile(`${path}.part`, JSON.stringify(board));
      await fs.rename(`${path}.part`, path);
    })
    .catch((e) => console.error('classement not saved:', e.message));
}

function ranked() {
  return Object.values(board.joueurs).sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
}

function top() {
  return {
    top: ranked().slice(0, TOP).map((p, k) => ({
      rang: k + 1, nom: p.nom, perso: p.perso, score: p.score, niveau: p.niveau, temps: p.temps, crs: p.crs,
      victoire: p.victoire, date: p.date.slice(0, 10),
    })),
    joueurs: Object.keys(board.joueurs).length,
  };
}

/** The facts of a manif, checked; a message if they can't be. */
function facts(m) {
  const int = (v) => (Number.isInteger(v) ? v : NaN);
  const f = { niveau: int(m.niveau), temps: int(m.temps), crs: int(m.crs), victoire: m.victoire === true };
  if (!(f.niveau >= 1 && f.niveau <= 200 && f.temps >= 0 && f.temps <= 3600 && f.crs >= 0 && f.crs <= 50000)) return null;
  if (f.crs > 40 * f.temps + 50 || f.niveau > 12 + f.temps / 6) return null; // (plus vite que le jeu ne le permet)
  if (f.victoire && (f.temps < 600 || f.niveau < 10)) return null; // (le Préfet n'arrive qu'à 10 min)
  return f;
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
  const nom = cleanName(m && m.nom);
  if (!nom) return ctx.send(res, 400, { ok: false, msg: 'Ce pseudo ne passe pas : 2 à 16 lettres ou chiffres, et rien d’insultant.' });
  if (!TOKEN_RE.test(String(m.jeton || ''))) return ctx.send(res, 400, { ok: false, msg: 'jeton invalide' });
  const f = facts(m);
  if (!f) return ctx.send(res, 400, { ok: false, msg: 'Cette manif ne tient pas debout : score refusé.' });
  const id = hash(m.jeton);
  const cle = keyOf(nom);
  const owner = Object.entries(board.joueurs).find(([k, p]) => p.cle === cle && k !== id);
  if (owner) return ctx.send(res, 409, { ok: false, msg: `Le pseudo « ${nom} » est déjà pris : choisis-en un autre.` });
  const score = scoreOf(f);
  const old = board.joueurs[id];
  const record = !old || score > old.score;
  const parties = (old ? old.parties : 0) + 1;
  if (record) {
    board.joueurs[id] = {
      nom, cle, perso: PERSOS.has(m.perso) ? m.perso : 'jojo', score, ...f, date: new Date().toISOString(), parties,
    };
  } else {
    old.nom = nom; // (on peut changer de pseudo ; le meilleur score reste)
    old.cle = cle;
    old.parties = parties;
  }
  save();
  const list = ranked();
  const rang = list.findIndex((p) => p === board.joueurs[id]) + 1;
  ctx.send(res, 200, { ok: true, score, rang, joueurs: list.length, meilleur: board.joueurs[id].score, record });
}

function remove(req, res, url, ctx) {
  if (!ctx.authorized(req)) return ctx.send(res, 401, { error: 'unauthorized' });
  const cle = keyOf(String(url.searchParams.get('nom') || ''));
  const before = Object.keys(board.joueurs).length;
  for (const [k, p] of Object.entries(board.joueurs)) if (p.cle === cle) delete board.joueurs[k];
  save();
  ctx.send(res, 200, { ok: true, removed: before - Object.keys(board.joueurs).length });
}

/** The leaderboard's routes; false if `path` isn't one of them. ctx: {send, visitor, authorized}. */
export async function classement(req, res, url, path, ctx) {
  if (path !== '/classement') return false;
  if (req.method === 'GET') ctx.send(res, 200, top(), 'application/json; charset=utf-8', { 'Access-Control-Allow-Origin': '*' });
  else if (req.method === 'POST') await post(req, res, ctx);
  else if (req.method === 'DELETE') remove(req, res, url, ctx);
  else ctx.send(res, 405, { error: 'method not allowed' });
  return true;
}
