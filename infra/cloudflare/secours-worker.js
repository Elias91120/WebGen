// La bascule de secours de 3geeks.fr (Elias, 18/10 : « un deploy Vercel de secours, pour quand Coolify affiche bad
// gateway ; fais une redirection directe »).
//
// Un Worker Cloudflare devant 3geeks.fr et www.3geeks.fr : chaque requête va d'abord au Mac Mini (Traefik, par le
// tunnel), comme aujourd'hui. Si le Mac Mini ne répond pas (502, 503, 504, les erreurs 52x de Cloudflare, 530 quand le
// tunnel est coupé, ou rien au bout de 8 s), le visiteur est renvoyé tout de suite vers la même page du site de secours
// (https://3geeks-secours.vercel.app, publié par scripts/secours.ps1), qui porte un bandeau « site de secours ».
// Dès que le Mac Mini répond de nouveau, plus rien n'est renvoyé : il n'y a rien à rebasculer.
//
// Jamais renvoyés (le secours ne les a pas, et le jeu doit voir la vraie erreur) : les fichiers du jeu, son
// version.json, les classements, le monde en ligne et le relais (/17-octobre/fichiers/...), l'assistant (/api/...),
// et tout ce qui n'est pas une lecture (POST...).
//
// L'installer : scripts/bascule-secours.bat (wrangler : la connexion à Cloudflare, puis le déploiement avec les routes
// de wrangler.toml), ou à la main dans le tableau de bord Cloudflare : Workers & Pages → Créer → coller ce fichier →
// Paramètres → Domaines et routes → les routes « 3geeks.fr/* » et « www.3geeks.fr/* » (zone 3geeks.fr).

const SECOURS = "https://3geeks-secours.vercel.app";
const PANNE = new Set([502, 503, 504, 520, 521, 522, 523, 524, 525, 526, 527, 530]);
const JAMAIS = [/^\/17-octobre\/fichiers(\/|$)/, /^\/api(\/|$)/];
const DELAI_MS = 8000;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const lecture = request.method === "GET" || request.method === "HEAD";
    if (!lecture || JAMAIS.some((r) => r.test(url.pathname)) || request.headers.get("Upgrade")) {
      return fetch(request);
    }
    let reponse;
    try {
      reponse = await avecDelai(fetch(request), DELAI_MS);
    } catch (_) {
      return versSecours(url);
    }
    return PANNE.has(reponse.status) ? versSecours(url) : reponse;
  },
};

function avecDelai(promesse, ms) {
  let minuteur;
  const delai = new Promise((_, rejeter) => {
    minuteur = setTimeout(() => rejeter(new Error("délai dépassé")), ms);
  });
  return Promise.race([promesse, delai]).finally(() => clearTimeout(minuteur));
}

function versSecours(url) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: SECOURS + url.pathname + url.search,
      "Cache-Control": "no-store",
    },
  });
}
