// Le tableau de bord de 17 OCTOBRE (Elias, 18/10) : la fonction Vercel qui rassemble les chiffres. Le mot de passe du
// tableau (MOT_DE_PASSE) est vérifié ici ; le jeton du serveur du jeu (JETON : STATS_TOKEN, celui qui ne fait que lire ;
// jamais le jeton d'envoi des versions) ne quitte pas Vercel : le navigateur ne voit que les chiffres. Les sources : le
// serveur du jeu sur le Mac Mini (www.3geeks.fr/17-octobre/fichiers) : /stats/tableau (la mesure anonyme des jeux et du
// site), /stats (les téléchargements par version, les duels des Actes en cours, la page du jeu ouverte en ce moment),
// /classement (les deux modes), /version.json.
import { timingSafeEqual } from 'node:crypto';

const BASE = 'https://www.3geeks.fr/17-octobre/fichiers';

function memes(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

async function lire(chemin, entetes = {}) {
  try {
    const r = await fetch(BASE + chemin, { headers: entetes, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return { erreur: `HTTP ${r.status}` };
    return await r.json();
  } catch (e) {
    return { erreur: String(e && e.message ? e.message : e) };
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const attendu = process.env.MOT_DE_PASSE || '';
  const donne = String(req.headers['x-mot-de-passe'] || '');
  if (attendu.length < 8 || !memes(donne, attendu)) {
    await new Promise((r) => setTimeout(r, 400)); // (deviner le mot de passe : lentement)
    res.status(401).json({ erreur: 'mot de passe' });
    return;
  }
  const lecture = { Authorization: `Bearer ${process.env.JETON || ''}` };
  const [tableau, serveur, manif, campagne, actes, version] = await Promise.all([
    lire('/stats/tableau', lecture),
    lire('/stats', lecture),
    lire('/classement'),
    lire('/classement?mode=campagne'),
    lire('/classement?mode=actes'),
    lire('/version.json'),
  ]);
  res.status(200).json({
    tableau,
    serveur,
    classement: { manif, campagne, actes },
    version: version && version.version ? { version: version.version, date: version.date, titre: version.titre } : null,
    lu: new Date().toISOString(),
  });
}
