// 17 OCTOBRE — the anonymous audience measurement (served by the file server on /17-octobre/fichiers/evenement and
// /stats/tableau). Elias, 18/10: « un dashboard… joueurs connectés, joueurs qui ont joué cette semaine, les meilleurs
// scores, sur tous les jeux… savoir lequel marche… et l'activité sur notre site : quelle page, au bout de combien de temps
// ils partent, à quel endroit de la page ». Light by design (the shared online world crashed the Mac Mini): a game sends a
// handful of events per session (launch, a mode starts, a mode ends, a heartbeat every 5 minutes), a web page two (the view,
// then how long and how far down when the visitor leaves).
//
//   POST /evenement        a text/plain JSON body (a simple request: no CORS preflight), one event:
//                          games: {t: "lancement"|"debut"|"fin"|"battement", j: "hub"|"actes"|"manif"|"campagne",
//                                  v: version, id: a random install id, d: seconds, s: score, r: result, o: os}
//                          site:  {t: "page"|"quitte", p: path, vid: a random visit id, r: referrer host, d: seconds,
//                                  sc: max scroll %, se: the section on screen when leaving, w: "mobile"|"bureau"}
//   GET  /stats/tableau    Authorization: Bearer <UPLOAD_TOKEN> — the dashboard's numbers (now, the last 30 days)
//
// Anonymous: the install and visit ids are random strings made by the game and the page, never a name; IP addresses only
// feed the rate limit, in memory, never stored; no cookie. Stored: DATA_DIR/mesure.json (one entry per day, 60 days),
// written at most once a minute through a temp file.
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const JEUX = ['hub', 'actes', 'manif', 'campagne'];
const TYPES_JEU = ['lancement', 'debut', 'fin', 'battement'];
const TYPES_SITE = ['page', 'quitte'];
const ID_RE = /^[A-Za-z0-9-]{8,48}$/;
const GARDER_JOURS = 60;
const ACTIF_MS = 6 * 60 * 1000; // a heartbeat every 5 minutes: seen in the last 6, still playing
const LIMITE = 90; // events per visitor per minute (a game sends one every 5 minutes; a page two)
const MAX_CORPS = 2048;

let DATA = '/data';
let jours = {}; // date -> day (sets in memory, arrays on disk)
const actifs = new Map(); // install id -> {j, v, at}
const debits = new Map(); // ip -> {n, until}
let sale = false;

const jourDe = (ms) => new Date(ms).toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' }); // YYYY-MM-DD, Paris

function jourVide() {
  return {
    jeux: { lancements: 0, ids: new Set(), versions: {}, modes: {} },
    site: { vues: 0, visites: new Set(), pages: {}, sorties: {}, referents: {}, appareils: {} },
  };
}

function jour(date) {
  if (!jours[date]) jours[date] = jourVide();
  return jours[date];
}

function mode(j, nom) {
  if (!j.jeux.modes[nom]) j.jeux.modes[nom] = { parties: 0, fins: 0, duree: 0, ids: new Set(), meilleur: 0, victoires: 0, battements: 0 };
  return j.jeux.modes[nom];
}

const texte = (v, n = 64) => String(v ?? '').slice(0, n);
const nombre = (v, max) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));
const ajoute = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };

/** One event, checked and counted; false if refused. */
export function compter(e, ms = Date.now()) {
  if (!e || typeof e !== 'object') return false;
  const t = texte(e.t, 16);
  const j = jour(jourDe(ms));
  if (TYPES_JEU.includes(t)) {
    const id = texte(e.id, 48);
    const jeu = texte(e.j, 16);
    if (!ID_RE.test(id) || !JEUX.includes(jeu)) return false;
    const v = texte(e.v, 16).replace(/[^0-9.]/g, '') || '?';
    j.jeux.ids.add(id);
    (j.jeux.versions[v] ||= new Set()).add(id);
    if (t === 'lancement') j.jeux.lancements += 1;
    if (jeu !== 'hub') {
      const m = mode(j, jeu);
      m.ids.add(id);
      if (t === 'debut') m.parties += 1;
      // (le temps de jeu, même des parties jamais finies, celles qu'on quitte en fermant le jeu : ≈ 5 min par battement)
      if (t === 'battement') m.battements = (m.battements || 0) + 1;
      if (t === 'fin') {
        m.fins += 1;
        m.duree += nombre(e.d, 6 * 3600);
        m.meilleur = Math.max(m.meilleur, nombre(e.s, 1e9));
        if (texte(e.r, 16) === 'victoire') m.victoires += 1;
      }
    }
    if (t === 'fin' || (t === 'lancement' && jeu === 'hub')) actifs.delete(id);
    if (t === 'debut' || t === 'battement') actifs.set(id, { j: jeu, v, at: ms });
    sale = true;
    return true;
  }
  if (TYPES_SITE.includes(t)) {
    const vid = texte(e.vid, 48);
    if (!ID_RE.test(vid)) return false;
    const brut = (texte(e.p, 80).split('?')[0].split('#')[0] || '/').replace(/[^A-Za-z0-9/_.-]/g, '') || '/';
    const p = brut.length > 1 ? brut.replace(/\/+$/, '') || '/' : brut; // (« /17-octobre/ » et « /17-octobre » : une page)
    const page = (j.site.pages[p] ||= { vues: 0, duree: 0, scroll: 0, quittes: 0 });
    if (t === 'page') {
      j.site.vues += 1;
      page.vues += 1;
      j.site.visites.add(vid);
      const r = texte(e.r, 64).replace(/[^A-Za-z0-9.-]/g, '');
      ajoute(j.site.referents, r || 'direct');
      ajoute(j.site.appareils, texte(e.w, 8) === 'mobile' ? 'mobile' : 'bureau');
    } else {
      page.quittes += 1;
      page.duree += nombre(e.d, 3 * 3600);
      page.scroll += nombre(e.sc, 100);
      // (hors de toute section : le haut de la page, l'accueil sans identifiant, ou le pied de page tout en bas)
      const se = texte(e.se, 40).replace(/[^A-Za-z0-9_-]/g, '') || (nombre(e.sc, 100) >= 90 ? 'bas' : 'haut');
      ajoute(j.site.sorties, `${p}#${se}`);
    }
    sale = true;
    return true;
  }
  return false;
}

/** The rate limit, per visitor (in memory only). */
function permis(ip, ms) {
  const d = debits.get(ip);
  if (!d || d.until < ms) {
    debits.set(ip, { n: 1, until: ms + 60_000 });
    return true;
  }
  d.n += 1;
  return d.n <= LIMITE;
}

const enTableau = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v instanceof Set ? [...v] : v)));

function enSets(j) {
  const d = jourVide();
  const jx = j.jeux || {};
  d.jeux.lancements = jx.lancements || 0;
  d.jeux.ids = new Set(jx.ids || []);
  for (const [v, ids] of Object.entries(jx.versions || {})) d.jeux.versions[v] = new Set(ids);
  for (const [n, m] of Object.entries(jx.modes || {})) d.jeux.modes[n] = { ...m, ids: new Set(m.ids || []) };
  const s = j.site || {};
  Object.assign(d.site, { vues: s.vues || 0, pages: s.pages || {}, sorties: s.sorties || {}, referents: s.referents || {},
    appareils: s.appareils || {} });
  d.site.visites = new Set(s.visites || []);
  return d;
}

export async function chargerMesure(dir) {
  DATA = dir;
  try {
    const brut = JSON.parse(await fs.readFile(join(DATA, 'mesure.json'), 'utf8')) || {};
    jours = Object.fromEntries(Object.entries(brut).map(([k, v]) => [k, enSets(v)]));
  } catch {
    jours = {};
  }
}

async function sauver() {
  if (!sale) return;
  sale = false;
  const garder = Object.keys(jours).sort().slice(-GARDER_JOURS);
  jours = Object.fromEntries(garder.map((k) => [k, jours[k]]));
  const tmp = join(DATA, '.mesure.json.part');
  await fs.mkdir(DATA, { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(enTableau(jours)));
  await fs.rename(tmp, join(DATA, 'mesure.json'));
}

export function demarrerMesure() {
  setInterval(() => { sauver().catch((e) => console.error('mesure not saved:', e.message)); }, 60_000).unref();
  setInterval(() => { // (the rate limits and the stale players, forgotten)
    const ms = Date.now();
    for (const [ip, d] of debits) if (d.until < ms) debits.delete(ip);
    for (const [id, a] of actifs) if (ms - a.at > ACTIF_MS) actifs.delete(id);
  }, 60_000).unref();
}

/** The dashboard's numbers: now (players in game, by game), each of the last 30 days, the last 7 and 30 days together. */
export function tableau(ms = Date.now()) {
  const maintenant = { connectes: 0, par_jeu: {}, versions: {} };
  for (const a of actifs.values()) {
    if (ms - a.at > ACTIF_MS) continue;
    maintenant.connectes += 1;
    ajoute(maintenant.par_jeu, a.j);
    ajoute(maintenant.versions, a.v);
  }
  const dates = [];
  for (let k = 29; k >= 0; k -= 1) dates.push(jourDe(ms - k * 86_400_000));
  const parJour = dates.map((date) => {
    const j = jours[date] || jourVide();
    const modes = {};
    for (const [n, m] of Object.entries(j.jeux.modes)) {
      modes[n] = { parties: m.parties, fins: m.fins, joueurs: m.ids.size, duree_moyenne: m.fins ? Math.round(m.duree / m.fins) : 0,
        meilleur: m.meilleur, victoires: m.victoires, battements: m.battements || 0 };
    }
    const pages = {};
    for (const [p, pg] of Object.entries(j.site.pages)) {
      pages[p] = { vues: pg.vues, quittes: pg.quittes, duree_moyenne: pg.quittes ? Math.round(pg.duree / pg.quittes) : 0,
        scroll_moyen: pg.quittes ? Math.round(pg.scroll / pg.quittes) : 0 };
    }
    return { date, lancements: j.jeux.lancements, joueurs: j.jeux.ids.size, modes,
      site: { vues: j.site.vues, visiteurs: j.site.visites.size, pages, sorties: j.site.sorties, referents: j.site.referents,
        appareils: j.site.appareils } };
  });
  // (plusieurs jours ensemble : les joueurs distincts, par jeu, par version ; les visiteurs distincts)
  const taille = (o) => Object.fromEntries(Object.entries(o).map(([k, s]) => [k, s.size]));
  const ensemble = (liste) => {
    const e = { joueurs: new Set(), par_jeu: {}, versions: {}, visiteurs: new Set() };
    for (const date of liste) {
      const j = jours[date];
      if (!j) continue;
      for (const id of j.jeux.ids) e.joueurs.add(id);
      for (const [n, m] of Object.entries(j.jeux.modes)) {
        const s = (e.par_jeu[n] ||= new Set());
        for (const id of m.ids) s.add(id);
      }
      for (const [v, ids] of Object.entries(j.jeux.versions)) {
        const s = (e.versions[v] ||= new Set());
        for (const id of ids) s.add(id);
      }
      for (const vid of j.site.visites) e.visiteurs.add(vid);
    }
    return { joueurs: e.joueurs.size, par_jeu: taille(e.par_jeu), versions: taille(e.versions), visiteurs: e.visiteurs.size };
  };
  return {
    genere: new Date(ms).toISOString(),
    maintenant,
    semaine: ensemble(dates.slice(-7)),
    mois: ensemble(dates),
    jours: parJour,
  };
}

/** The routes; true if the request was one of them. */
export async function mesure(req, res, url, path, ctx) {
  if (path === '/evenement' && req.method === 'POST') {
    const ms = Date.now();
    if (!permis(ctx.visitor(req), ms)) { ctx.send(res, 429, { ok: false }, 'application/json; charset=utf-8', { 'Access-Control-Allow-Origin': '*' }); return true; }
    let corps = '';
    for await (const morceau of req) {
      corps += morceau;
      if (corps.length > MAX_CORPS) break;
    }
    let e = null;
    try { e = JSON.parse(corps); } catch { e = null; }
    const ok = corps.length <= MAX_CORPS && compter(e, ms);
    ctx.send(res, ok ? 200 : 400, { ok }, 'application/json; charset=utf-8', { 'Access-Control-Allow-Origin': '*' });
    return true;
  }
  if (path === '/evenement' && req.method === 'OPTIONS') {
    ctx.send(res, 204, '', 'text/plain', { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' });
    return true;
  }
  if (path === '/stats/tableau' && req.method === 'GET') {
    if (!ctx.authorized(req)) { ctx.send(res, 401, { error: 'unauthorized' }); return true; }
    ctx.send(res, 200, tableau());
    return true;
  }
  return false;
}
