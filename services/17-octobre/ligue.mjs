// 17 OCTOBRE — la Ligue des Villes (jalon 169 ; Elias, 26/10 : « quand tu mets ton pseudonyme, ça demande aussi tu viens
// de quelle ville en France, selon toutes les villes modélisées… à 20h tel event commence dans telle ville… quelle ville
// va avoir le plus de joueurs qui ont comptabilisé des scores… ce sera aux joueurs de faire le boulot »).
//
// Each finished Manif posted to /classement with a « ville » adds its score (computed by classement.mjs from the facts) to
// that city: all time, and, while an event runs, to the event's board. Nothing is sent continuously (the shared online
// Paris crashed the Mac Mini on 18/10): one post per run, as before.
//
//   GET /classement?mode=villes  {"mode":"villes","villes":[{rang,ville,nom,total,joueurs,parties}],
//                                 "event":{id,titre,ville,debut,fin,en_cours,classement:[...]}|null,   (running, or next)
//                                 "champion":{ville,nom,event,date}|null, "liste":[{ville,nom}]}
//
// Events: DATA_DIR/events.json (written by hand, or by the moderation route below), [{id, titre, ville, debut, fin}], ISO
// dates. An event over is closed once: its winner (the highest total) becomes the champion until the next one ends.
//   POST /ligue/event   Authorization: Bearer <UPLOAD_TOKEN>  {titre, ville, debut, fin} — adds an event
// Stored: DATA_DIR/villes.json {villes: {cle: {total, parties, joueurs: [ids]}}, events: {id: {cle: {...}}}, resultats: [...]}.
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

// les villes modélisées dans la Manif (Paris, les villes du tour, la banlieue en bonus) : la clé, le nom affiché
export const VILLES = {
  paris: 'Paris', lyon: 'Lyon', marseille: 'Marseille', lille: 'Lille', toulouse: 'Toulouse', bordeaux: 'Bordeaux',
  nantes: 'Nantes', rennes: 'Rennes', nice: 'Nice', grenoble: 'Grenoble', clermont: 'Clermont-Ferrand',
  saint_etienne: 'Saint-Étienne', tours: 'Tours', angers: 'Angers', caen: 'Caen', brest: 'Brest', amiens: 'Amiens',
  toulon: 'Toulon', sevran: 'Sevran', massy: 'Massy',
};

let DATA = '/data';
let etat = { villes: {}, events: {}, resultats: [] };
let events = [];
let saving = Promise.resolve();

const vide = () => ({ total: 0, parties: 0, joueurs: [] });

export async function chargerLigue(dir) {
  DATA = dir;
  try {
    const e = JSON.parse(await fs.readFile(join(DATA, 'villes.json'), 'utf8'));
    etat = { villes: e.villes || {}, events: e.events || {}, resultats: e.resultats || [] };
  } catch {
    etat = { villes: {}, events: {}, resultats: [] };
  }
  await lireEvents();
}

async function lireEvents() {
  try {
    const l = JSON.parse(await fs.readFile(join(DATA, 'events.json'), 'utf8'));
    events = (Array.isArray(l) ? l : []).filter((e) => e && e.id && Date.parse(e.debut) < Date.parse(e.fin));
  } catch {
    events = [];
  }
}

function sauver() {
  const data = JSON.stringify(etat);
  saving = saving
    .then(async () => {
      await fs.mkdir(DATA, { recursive: true });
      await fs.writeFile(join(DATA, 'villes.json.part'), data);
      await fs.rename(join(DATA, 'villes.json.part'), join(DATA, 'villes.json'));
    })
    .catch((e) => console.error('ligue not saved:', e.message));
}

const enCours = (ms) => events.find((e) => Date.parse(e.debut) <= ms && ms < Date.parse(e.fin)) || null;

function ajouter(table, cle, id, score) {
  const v = (table[cle] ||= vide());
  v.total += score;
  v.parties += 1;
  if (!v.joueurs.includes(id)) v.joueurs.push(id);
}

/** A finished run (its score already checked by classement.mjs) counted for its city; false if no valid city. */
export function compterVille(ville, id, score, ms = Date.now()) {
  const cle = String(ville || '');
  if (!Object.hasOwn(VILLES, cle) || !(score > 0)) return false;
  fermer(ms);
  ajouter(etat.villes, cle, id, score);
  const ev = enCours(ms);
  if (ev) ajouter((etat.events[ev.id] ||= {}), cle, id, score);
  sauver();
  return true;
}

const classer = (table) => Object.entries(table || {})
  .map(([cle, v]) => ({ ville: cle, nom: VILLES[cle] || cle, total: v.total, joueurs: v.joueurs.length, parties: v.parties }))
  .sort((a, b) => b.total - a.total || b.joueurs - a.joueurs)
  .map((v, k) => ({ rang: k + 1, ...v }));

/** The events over and not yet closed: their winner becomes the champion. */
function fermer(ms) {
  for (const ev of events) {
    if (Date.parse(ev.fin) > ms || etat.resultats.some((r) => r.event === ev.id)) continue;
    const top = classer(etat.events[ev.id])[0];
    etat.resultats.push({ event: ev.id, titre: ev.titre || '', ville: top ? top.ville : '', nom: top ? top.nom : '',
      total: top ? top.total : 0, date: ev.fin });
    sauver();
  }
}

export function ligue(ms = Date.now()) {
  fermer(ms);
  const ev = enCours(ms) || events.filter((e) => Date.parse(e.debut) > ms).sort((a, b) => a.debut.localeCompare(b.debut))[0] || null;
  const gagnes = etat.resultats.filter((r) => r.ville);
  const dernier = gagnes.sort((a, b) => b.date.localeCompare(a.date))[0] || null;
  return {
    mode: 'villes',
    villes: classer(etat.villes),
    event: ev ? {
      id: ev.id, titre: ev.titre || '', ville: ev.ville || '', nom: VILLES[ev.ville] || '', debut: ev.debut, fin: ev.fin,
      en_cours: Date.parse(ev.debut) <= ms, classement: classer(etat.events[ev.id]).slice(0, 10),
    } : null,
    champion: dernier ? { ville: dernier.ville, nom: dernier.nom, event: dernier.titre, date: dernier.date } : null,
    liste: Object.entries(VILLES).map(([ville, nom]) => ({ ville, nom })),
  };
}

/** The city of the last event's winner (the badge next to its players' names), or ''. */
export function villeChampionne(ms = Date.now()) {
  const c = ligue(ms).champion;
  return c ? c.ville : '';
}

/** Adds an event (moderation route). */
export async function ajouterEvent(e) {
  const debut = new Date(e && e.debut);
  const fin = new Date(e && e.fin);
  if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime()) || fin <= debut) return null;
  const ev = { id: `ev${debut.getTime().toString(36)}`, titre: String(e.titre || '').slice(0, 60),
    ville: Object.hasOwn(VILLES, e.ville) ? e.ville : '', debut: debut.toISOString(), fin: fin.toISOString() };
  events = [...events.filter((x) => x.id !== ev.id), ev];
  await fs.mkdir(DATA, { recursive: true });
  await fs.writeFile(join(DATA, 'events.json'), JSON.stringify(events, null, 1));
  return ev;
}

export const ligueStats = () => ({ villes: Object.keys(etat.villes).length, events: events.length });
