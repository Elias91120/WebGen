// Geeko à la place du zéro, sur la page 404 (statique, sans React). Sans lui, le vrai « 0 » reste affiché.
import { createGeeko } from './geeko';

const start = (host: HTMLElement) => {
  let timer = 0;
  // Comme ailleurs sur le site : il bouge 8 s, se fige, et repart au survol.
  const wake = () => {
    delete host.dataset.frozen;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { host.dataset.frozen = ''; }, 8000);
  };
  const geeko = createGeeko(document, {
    variant: 'aie',
    size: parseFloat(getComputedStyle(host).fontSize) / 75,
    stage: false,
    reduceMotion: false,
    say: () => null,
    onChange: wake,
  });
  host.appendChild(geeko.element);
  host.addEventListener('pointerenter', wake);
  document.documentElement.classList.add('has-geeko');
};

const host = document.getElementById('geeko');
if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Après le chargement complet : tant que la feuille des polices arrive, Safari n'applique pas les styles
  // qui la suivent, et la taille lue ici (celle du grand 404) serait fausse.
  if (document.readyState === 'complete') start(host);
  else window.addEventListener('load', () => start(host), { once: true });
}
