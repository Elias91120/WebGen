import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import jelloulCover from '../assets/images/projects/jellouli.jpg';
import expressDivorceCover from '../assets/images/projects/express-divorce.jpg';
import aurenzaCover from '../assets/images/projects/aurenza.jpg';

/**
 * Essai (21/10/2026) : deux remplaçants de la vidéo du haut de page, sur l'avis de Noam
 * (« ça fait plus pub que landing page »). Affichés seulement avec ?hero=vitrine ou ?hero=offre.
 */
export type HeroShowcaseVariant = 'vitrine' | 'offre';

interface Props {
  lang: 'fr' | 'en';
  variant: HeroShowcaseVariant;
}

const SITES = [
  {
    src: jelloulCover,
    domain: 'amel-jellouli-elloumi.com',
    alt: { fr: 'Site du cabinet de dermatologie du Dr Jellouli, à Tunis', en: "Dr Jellouli's dermatology practice website, Tunis" },
  },
  {
    src: expressDivorceCover,
    domain: 'expressdivorceusa.co',
    alt: { fr: 'Plateforme Express Divorce USA', en: 'Express Divorce USA platform' },
  },
  {
    src: aurenzaCover,
    domain: 'Aurenza Capital',
    alt: { fr: 'Site du courtier Aurenza Capital', en: 'Aurenza Capital broker website' },
  },
] as const;

const BrowserFrame: React.FC<{ src: string; domain: string; alt: string; className?: string }> = ({
  src,
  domain,
  alt,
  className = '',
}) => (
  <figure
    className={`overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)] ${className}`}
  >
    <div className="flex items-center gap-3 border-b border-white/10 bg-surface-2 px-3 py-2">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </span>
      <span className="truncate rounded-md bg-ink/70 px-2 py-0.5 text-[11px] text-slate-400">{domain}</span>
    </div>
    <img
      src={src}
      alt={alt}
      width={1200}
      height={750}
      decoding="async"
      className="block aspect-[16/10] w-full object-cover object-top"
    />
  </figure>
);

/** Option A : trois vrais sites livrés, en fenêtres de navigateur superposées. */
const Vitrine: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const [main, second, third] = SITES;
  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative pb-6 sm:pb-16 lg:pr-6">
        <BrowserFrame src={main.src} domain={main.domain} alt={main.alt[lang]} className="relative z-20 sm:w-[84%]" />
        <BrowserFrame
          src={second.src}
          domain={second.domain}
          alt={second.alt[lang]}
          className="absolute -top-10 right-0 z-10 hidden w-[48%] sm:block"
        />
        <BrowserFrame
          src={third.src}
          domain={third.domain}
          alt={third.alt[lang]}
          className="absolute -bottom-2 -left-4 z-30 hidden w-[44%] sm:block"
        />
      </div>
      <p className="mt-4 text-center text-xs text-slate-400 sm:mt-6 lg:text-left">
        {lang === 'fr'
          ? 'Des sites livrés par 3geeks : un cabinet médical, une plateforme juridique, un conseil en patrimoine.'
          : 'Sites delivered by 3geeks: a medical practice, a legal platform, a wealth advisory firm.'}
      </p>
    </div>
  );
};

/** Option B : l'offre d'entrée, claire, avec des miniatures de sites livrés. */
const Offre: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const fr = lang === 'fr';
  const points = fr
    ? [
        'Petites demandes livrées en 24 à 48 h',
        "Rien à payer avant d'être satisfait",
        'Le code et le nom de domaine sont à vous',
        'Devis gratuit après un appel de 30 min',
      ]
    : [
        'Small requests delivered in 24 to 48 h',
        'Nothing to pay until you are satisfied',
        'You own the code and the domain name',
        'Free quote after a 30-minute call',
      ];
  return (
    <div className="card-featured mx-auto w-full max-w-xl p-6 sm:p-8 lg:max-w-none">
      <p className="eyebrow">Site Starter</p>
      <p className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
        {fr ? 'dès 300 €' : 'from €300'}
      </p>
      <p className="mt-2 text-sm text-slate-400 sm:text-base">
        {fr ? 'Un site professionnel, pensé pour recevoir des demandes.' : 'A professional website, built to bring you enquiries.'}
      </p>
      <ul className="mt-6 grid gap-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm text-slate-200 sm:text-base">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="text-xs text-slate-400">{fr ? 'Quelques sites livrés' : 'A few sites we delivered'}</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {SITES.map((s) => (
            <img
              key={s.domain}
              src={s.src}
              alt={s.alt[lang]}
              width={1200}
              height={750}
              decoding="async"
              className="aspect-[16/10] w-full rounded-lg border border-white/10 object-cover object-top"
            />
          ))}
        </div>
      </div>
      <a href={fr ? '/offres' : '/offres'} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-mint hover:underline">
        {fr ? 'Voir les offres' : 'See our offers'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
};

export const HeroShowcase: React.FC<Props> = ({ lang, variant }) =>
  variant === 'vitrine' ? <Vitrine lang={lang} /> : <Offre lang={lang} />;

/** Lit ?hero=vitrine ou ?hero=offre dans l'adresse (aperçu uniquement). */
export function readHeroPreview(): HeroShowcaseVariant | null {
  if (typeof window === 'undefined') return null;
  const v = new URLSearchParams(window.location.search).get('hero');
  return v === 'vitrine' || v === 'offre' ? v : null;
}
