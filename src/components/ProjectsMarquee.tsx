import React from 'react';

import jelloulLogo from '../assets/images/logos/jellouli.png';
import expressDivorceLogo from '../assets/images/logos/express-divorce.png';
import twoLogo from '../assets/images/logos/two.jpg';
import aurenzaLogo from '../assets/images/logos/aurenza.png';
import callKitchenLogo from '../assets/images/logos/callkitchen.jpg';

// Banderole du haut de page (Noam, 21/10/2026) : le nom et le logo des projets en ligne, qui défilent.
// Projets publics seulement. `wordmark` : le logo écrit déjà le nom, pas d'étiquette à côté.
const LOGOS: Array<{ name: string; src: string; wordmark?: boolean; light?: boolean }> = [
  { name: 'Cabinet Dr Amel Elloumi Jellouli', src: jelloulLogo, wordmark: true },
  { name: 'Express Divorce USA', src: expressDivorceLogo },
  { name: 'Two', src: twoLogo },
  { name: 'Aurenza Capital', src: aurenzaLogo },
  { name: 'CallKitchen', src: callKitchenLogo, light: true },
];

const Group: React.FC<{ hidden?: boolean }> = ({ hidden = false }) => (
  <ul className={`logo-marquee-group ${hidden ? 'logo-marquee-dup' : ''}`} aria-hidden={hidden || undefined}>
    {[...LOGOS, ...LOGOS].map((logo, i) => (
      <li key={`${logo.name}-${i}`} className="flex shrink-0 items-center gap-2.5">
        <span
          className={`flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 ${
            logo.wordmark ? 'w-28 bg-white px-1.5' : logo.light ? 'w-10 bg-white p-1' : 'w-10 bg-white/[0.06]'
          }`}
        >
          <img src={logo.src} alt={logo.wordmark && !hidden ? logo.name : ''} className="max-h-full max-w-full object-contain" />
        </span>
        {!logo.wordmark && <span className="whitespace-nowrap font-display text-sm font-medium text-slate-300">{logo.name}</span>}
      </li>
    ))}
  </ul>
);

const ProjectsMarquee: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => (
  <section className="flex w-full flex-col items-center gap-4" aria-label={lang === 'fr' ? 'Projets en ligne' : 'Live projects'}>
    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
      {lang === 'fr' ? 'Déjà en ligne' : 'Already live'}
    </span>
    <div className="logo-marquee w-full">
      <div className="logo-marquee-track">
        <Group />
        <Group hidden />
      </div>
    </div>
  </section>
);

export default ProjectsMarquee;
