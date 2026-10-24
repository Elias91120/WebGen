import React from 'react';

import jelloulLogo from '../assets/images/logos/jellouli.png';
import expressDivorceLogo from '../assets/images/logos/express-divorce.png';
import twoLogo from '../assets/images/logos/two.jpg';
import aurenzaLogo from '../assets/images/logos/aurenza.png';
import callKitchenLogo from '../assets/images/logos/callkitchen.jpg';

// Public projects only, in the same order as the showcase.
// `wordmark`: the logo already spells the name, so no text label next to it.
const LOGOS: Array<{ name: string; src: string; wordmark?: boolean; light?: boolean }> = [
  { name: 'Cabinet Dr Amel Elloumi Jellouli', src: jelloulLogo, wordmark: true },
  { name: 'Express Divorce USA', src: expressDivorceLogo },
  { name: 'Two', src: twoLogo },
  { name: 'Aurenza Capital', src: aurenzaLogo },
  { name: 'CallKitchen', src: callKitchenLogo, light: true },
];

const ClientLogos: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => (
  <section className="border-b border-white/5 py-8" aria-label={lang === 'fr' ? 'Projets en ligne' : 'Live projects'}>
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {lang === 'fr' ? 'Déjà en ligne' : 'Already live'}
      </span>
      <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
        {LOGOS.map((logo) => (
          <li key={logo.name} className="flex items-center gap-2.5">
            <span
              className={`flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 ${
                logo.wordmark ? 'w-28 bg-white px-1.5' : logo.light ? 'w-10 bg-white p-1' : 'w-10 bg-white/[0.06]'
              }`}
            >
              <img src={logo.src} alt={logo.wordmark ? logo.name : ''} loading="lazy" className="max-h-full max-w-full object-contain" />
            </span>
            {!logo.wordmark && <span className="font-display text-sm font-medium text-slate-300">{logo.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ClientLogos;
