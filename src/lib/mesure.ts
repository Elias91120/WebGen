// La mesure d'audience du site, anonyme et sans cookie (Elias, 18/10 : « savoir s'il y a de l'activité sur notre site,
// quelle page ils consultent, au bout de combien de temps ils partent, à quel endroit sur la page quand ils sont partis »).
// Deux messages par page : la vue (la page, d'où l'on vient, mobile ou bureau), puis, au départ, le temps passé, jusqu'où
// l'on est descendu et la section qu'on regardait. Un identifiant de visite tiré au hasard, gardé le temps de l'onglet
// (sessionStorage) : jamais de nom, jamais de cookie. Rien n'est envoyé si le navigateur demande « ne pas me suivre ».
// Le serveur : services/17-octobre/mesure.mjs ; le tableau de bord le lit.

const URL_MESURE = 'https://www.3geeks.fr/17-octobre/fichiers/evenement';

function envoyer(e: Record<string, unknown>): void {
  try {
    const corps = JSON.stringify(e);
    // (text/plain : une requête simple, sans prévol ; sendBeacon part même quand la page se ferme)
    if (navigator.sendBeacon && navigator.sendBeacon(URL_MESURE, new Blob([corps], { type: 'text/plain' }))) return;
    void fetch(URL_MESURE, { method: 'POST', body: corps, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  } catch {
    // (la mesure ne casse jamais la page)
  }
}

function idVisite(): string {
  try {
    const deja = sessionStorage.getItem('3g-visite');
    if (deja) return deja;
    const id = `v-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    sessionStorage.setItem('3g-visite', id);
    return id;
  } catch {
    return `v-${Math.random().toString(36).slice(2, 14)}`;
  }
}

export function demarrerMesure(): void {
  if (typeof window === 'undefined' || navigator.doNotTrack === '1' || /^(localhost|127\.)/.test(location.hostname)) return;
  const vid = idVisite();
  const p = location.pathname;
  const t0 = performance.now();
  let scrollMax = 0;
  let section = '';
  let provenance = '';
  try {
    const r = document.referrer ? new URL(document.referrer).hostname : '';
    provenance = r && r !== location.hostname ? r : '';
  } catch {
    provenance = '';
  }
  envoyer({ t: 'page', p, vid, r: provenance, w: window.innerWidth < 768 ? 'mobile' : 'bureau' });

  const mesurer = () => {
    const h = document.documentElement;
    const course = h.scrollHeight - window.innerHeight;
    scrollMax = Math.max(scrollMax, course > 0 ? Math.round((100 * window.scrollY) / course) : 100);
    // (la section au milieu de l'écran : celle qu'on regarde)
    const milieu = window.innerHeight / 2;
    for (const s of Array.from(document.querySelectorAll<HTMLElement>('section[id], [data-section]'))) {
      const r = s.getBoundingClientRect();
      if (r.top <= milieu && r.bottom >= milieu) {
        section = s.id || s.dataset.section || '';
        break;
      }
    }
  };
  let attente = false;
  window.addEventListener('scroll', () => {
    if (attente) return;
    attente = true;
    requestAnimationFrame(() => {
      attente = false;
      mesurer();
    });
  }, { passive: true });

  let parti = false;
  const partir = () => {
    if (parti) return;
    parti = true;
    mesurer();
    envoyer({ t: 'quitte', p, vid, d: Math.round((performance.now() - t0) / 1000), sc: scrollMax, se: section });
  };
  window.addEventListener('pagehide', partir);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') partir();
  });
}
