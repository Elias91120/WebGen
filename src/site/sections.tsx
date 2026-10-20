/**
 * Sections of the studio pages. Home keeps only the short ones (hero, what we do, how it works,
 * a few projects, contact); the details live on /offres, /realisations and /equipe.
 */
import {
  ArrowRight,
  ArrowUpRight,
  BadgeEuro,
  CalendarCheck,
  Check,
  Globe,
  KeyRound,
  Mail,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Timer,
  Users,
} from 'lucide-react';
import React from 'react';

import BuildTimeline from '../components/BuildTimeline';
import { HeroVideoCard } from '../components/HeroVideo';
import { PROJECTS_DATA } from '../components/ProjectsShowcase';
import Reveal from '../components/Reveal';
import SectionLines from '../components/SectionLines';
import { FOUNDERS, LinkedInIcon } from '../components/TeamSection';
import type { PageContext } from './SiteLayout';

type Props = PageContext;

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/** Top of a sub-page: the page's h1, under the fixed header. */
export const PageIntro: React.FC<{ path: string; title: string; sub: string }> = ({ path, title, sub }) => (
  <section className="relative overflow-hidden border-b border-white/5 pb-12 pt-28 md:pb-16 md:pt-40">
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_85%_0%,rgba(10,239,187,0.12),transparent_70%)]"
      aria-hidden="true"
    />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <span className="eyebrow hero-rise" style={{ ['--rise-delay' as string]: '60ms' }}>{path}</span>
      <h1
        className="hero-rise section-title mt-4 max-w-3xl text-[2.1rem] sm:text-5xl md:text-6xl"
        style={{ ['--rise-delay' as string]: '140ms' }}
      >
        {title}
      </h1>
      <p className="hero-rise mt-5 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg" style={{ ['--rise-delay' as string]: '240ms' }}>
        {sub}
      </p>
    </div>
  </section>
);

/** Section heading (eyebrow, h2, optional subtitle). */
const Heading: React.FC<{ path: string; title: string; sub?: string; center?: boolean; className?: string }> = ({ path, title, sub, center, className = '' }) => (
  <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
    <span className="eyebrow">{path}</span>
    <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{title}</h2>
    {sub && <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{sub}</p>}
  </Reveal>
);

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export const Hero: React.FC<Props> = ({ lang, t, book }) => (
  <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_90%_8%,rgba(10,239,187,0.16),transparent_70%),radial-gradient(ellipse_70%_40%_at_0%_95%,rgba(195,251,5,0.08),transparent_70%)] lg:bg-[radial-gradient(ellipse_45%_60%_at_75%_45%,rgba(10,239,187,0.14),transparent_70%),radial-gradient(ellipse_40%_40%_at_10%_90%,rgba(195,251,5,0.06),transparent_70%)]"
      aria-hidden="true"
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />
    <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" aria-hidden="true" />

    <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 content-center items-center gap-10 px-5 pb-10 pt-24 sm:px-8 sm:pt-32 md:pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
      <div className="max-w-2xl">
        <div
          className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-3 pr-4 text-xs font-medium text-slate-200 backdrop-blur"
          style={{ ['--rise-delay' as string]: '100ms' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-mint opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-mint" />
          </span>
          {t.hero.badge}
        </div>

        <h1
          className="hero-rise mt-6 font-display text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(8,9,13,0.8)] sm:text-6xl lg:text-[2.9rem] xl:text-[3.25rem]"
          style={{ ['--rise-delay' as string]: '220ms' }}
        >
          {t.hero.titleStart} <span className="text-gradient">{t.hero.titleEnd}</span>
        </h1>

        <p className="hero-rise mt-7 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg lg:text-slate-300" style={{ ['--rise-delay' as string]: '360ms' }}>
          {t.hero.comment}
        </p>

        <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ ['--rise-delay' as string]: '480ms' }}>
          <button type="button" data-booking="hero" onClick={() => book('hero')} className="btn btn-primary">
            {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
          </button>
          <a href="#ce-quon-fait" className="btn btn-ghost">
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>

      <div className="hero-rise" style={{ ['--rise-delay' as string]: '600ms' }}>
        <HeroVideoCard lang={lang} />
      </div>
    </div>

    <div className="relative z-10 border-t border-white/[0.08] bg-ink/40 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:px-8 lg:grid-cols-4">
        {t.hero.trust.map((item) => (
          <div key={item.v} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="shrink-0 whitespace-nowrap font-display text-2xl font-semibold text-white md:text-3xl">
              {item.k.replace('{projects}', String(PROJECTS_DATA.length))}
            </span>
            <span className="text-xs leading-snug text-slate-400 md:text-sm">{item.v}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WHAT_ICONS = [Globe, Smartphone, Sparkles];
const WHAT_LINKS = ['/offres', '/offres#services', '/ia'];

export const WhatWeDo: React.FC<Props> = ({ t }) => {
  const c = t.site.whatWeDo;
  return (
    <section id="ce-quon-fait" className="relative scroll-mt-16 py-14 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading path={c.path} title={c.title} className="mb-8 md:mb-14" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {c.items.map((item, i) => {
            const Icon = WHAT_ICONS[i];
            const ai = i === 2;
            return (
              <Reveal key={item.title} delay={i * 90}>
                <a
                  href={WHAT_LINKS[i]}
                  className={`${ai ? 'card-featured shadow-[0_30px_80px_-35px_rgba(0,0,0,0.6)]' : 'card hover:bg-surface-2'} group flex h-full flex-col p-5 transition-transform duration-300 hover:-translate-y-1 md:p-7`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ai ? 'bg-brand-lime/15 text-brand-lime' : 'bg-white/[0.06] text-slate-300'}`}>
                      {item.meta}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-white md:mt-6">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-mint transition-all group-hover:gap-3 md:mt-6">
                    {item.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HOW_ICONS = [CalendarCheck, Timer, BadgeEuro];

export const HowItWorks: React.FC<Props> = ({ t, book }) => {
  const c = t.site.howItWorks;
  return (
    <section className="relative border-y border-white/5 bg-surface/60 py-14 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading path={c.path} title={c.title} className="mb-8 md:mb-14" />
        <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
          <div
            className="absolute left-0 right-0 top-[2.85rem] hidden h-px bg-gradient-to-r from-brand-lime/50 via-brand-mint/40 to-transparent md:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-gradient-to-b from-brand-lime/60 via-brand-mint/30 to-transparent md:hidden"
            aria-hidden="true"
          />
          {c.steps.map((step, i) => {
            const Icon = HOW_ICONS[i];
            return (
              <Reveal as="li" key={step.t} delay={i * 110} className="relative">
                <div className="flex h-full gap-4 md:block md:rounded-[1.25rem] md:border md:border-white/[0.08] md:bg-surface md:p-7">
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-brand-mint/40 bg-ink font-display text-sm font-semibold text-brand-mint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Icon className="hidden h-5 w-5 text-slate-500 md:block" />
                  </div>
                  <div className="pt-2 md:pt-0">
                    <h3 className="font-display text-lg font-semibold text-white md:mt-5">{step.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400 md:mt-2">{step.d}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
        <Reveal className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button type="button" data-booking="how-it-works" onClick={() => book('how-it-works')} className="btn btn-primary">
            {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
          </button>
          <a href="/offres#methode" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
            {c.more} <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
};

const FEATURED = ['jellouli', 'express-divorce', 'two-app'] as const;
// The Jellouli card opens the before/after at the top of the work page.
const FEATURED_ANCHOR: Record<string, string> = { jellouli: 'avant-apres' };

export const FeaturedWork: React.FC<Props> = ({ lang, t }) => {
  const c = t.site.featured;
  const projects = FEATURED.map((id) => PROJECTS_DATA.find((p) => p.id === id)!).filter(Boolean);
  return (
    <section className="relative py-14 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <Heading path={c.path} title={c.title} />
          <Reveal>
            <a href="/realisations" className="inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand-mint transition-colors hover:text-white">
              {c.more} <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="w-[82%] shrink-0 snap-start md:w-auto">
              <a href={`/realisations#${FEATURED_ANCHOR[p.id] ?? p.id}`} className="card group block h-full overflow-hidden hover:bg-surface-2">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.07] bg-ink">
                  {p.cover && (
                    <img
                      src={p.cover}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-xs font-medium text-brand-mint/90">{p.badge[lang]}</p>
                  <h3 className="mt-2 flex items-center justify-between gap-3 font-display text-lg font-semibold text-white">
                    {p.title[lang]}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-brand-mint" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.items[p.id]}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Offers page                                                         */
/* ------------------------------------------------------------------ */

const COMMITMENT_ICONS = [Timer, BadgeEuro, KeyRound, CalendarCheck];

export const Commitments: React.FC<Props> = ({ t }) => (
  <section className="relative border-y border-white/5 bg-surface/60 py-16 md:py-24" aria-labelledby="engagements-title">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal className="mb-10 max-w-2xl md:mb-14">
        <span className="eyebrow">{t.commitments.path}</span>
        <h2 id="engagements-title" className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.commitments.title}</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.commitments.items.map((item, i) => {
          const Icon = COMMITMENT_ICONS[i];
          return (
            <Reveal key={item.title} delay={i * 80}>
              <div className={`${i === 0 ? 'card-featured shadow-[0_30px_80px_-35px_rgba(0,0,0,0.6)]' : 'card'} flex h-full flex-col p-6 md:p-7`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`font-display text-2xl font-semibold tracking-tight ${i === 0 ? 'text-gradient' : 'text-white'}`}>{item.k}</span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export const OffersSection: React.FC<Props> = ({ t, lang, book }) => {
  const fr = lang === 'fr';
  const plans = [
    { id: 'starter', data: t.services.s1, tag: fr ? 'Site vitrine' : 'Business website', featured: false },
    { id: 'custom', data: t.services.s2, tag: fr ? 'Projet sur mesure' : 'Custom project', featured: true },
    { id: 'redesign', data: t.services.s3, tag: fr ? 'Refonte complète' : 'Complete redesign', featured: false },
  ];
  return (
    <section id="services" className="relative scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 100} className={plan.featured ? 'md:-my-4' : ''}>
              <div className={`${plan.featured ? 'card-featured shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]' : 'card'} flex h-full flex-col p-7 md:p-8`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">{plan.tag}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                      plan.featured ? 'bg-brand-lime/15 text-brand-lime' : 'bg-white/[0.06] text-slate-400'
                    }`}
                  >
                    {plan.data.badge}
                  </span>
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold text-white">{plan.data.title}</h2>
                <div className="mt-4">
                  <div className={`font-display text-4xl font-semibold tracking-tight ${plan.featured ? 'text-gradient' : 'text-white'}`}>{plan.data.price}</div>
                  <div className="mt-1 text-sm text-slate-500">{plan.data.subPrice}</div>
                </div>
                <div className="my-7 h-px bg-white/[0.08]" />
                <ul className="mb-8 flex-1 space-y-3.5">
                  {plan.data.features.map((item) => (
                    <li key={item.text} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-booking={`offer-${plan.id}`}
                  onClick={() => book(`offer-${plan.id}`)}
                  className={`btn w-full ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {plan.data.btn}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Peace-of-mind option */}
        <Reveal className="mt-14 md:mt-20">
          <button
            type="button"
            data-booking="offer-maintenance"
            onClick={() => book('offer-maintenance')}
            className="card group flex w-full flex-col items-start gap-6 p-6 text-left md:flex-row md:items-center md:justify-between md:p-8"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-lime/10 text-brand-lime ring-1 ring-brand-lime/25">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl font-semibold text-white">{t.services.maintenanceTitle}</h3>
                  <span className="rounded-full bg-brand-lime/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-lime">
                    {t.services.maintenanceHighlight}
                  </span>
                </div>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">{t.services.maintenanceDesc}</p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {t.services.maintenanceBenefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-brand-mint" strokeWidth={3} /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center justify-between gap-6 md:w-auto md:flex-col md:items-end md:gap-2">
              <span className="font-display text-3xl font-semibold text-white">{t.services.maintenancePrice}</span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-mint transition-all group-hover:gap-3">
                {t.services.maintenanceCta} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export const MethodSection: React.FC<Props> = ({ t }) => (
  <section id="methode" className="relative scroll-mt-16 overflow-hidden py-20 md:py-28">
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <Heading path={t.stack.path} title={t.stack.title} sub={t.stack.subtitle} className="mb-10 md:mb-14" />
      <Reveal>
        <BuildTimeline steps={t.stack.steps} mock={t.stack.mock} />
      </Reveal>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Work page                                                           */
/* ------------------------------------------------------------------ */

export const Reviews: React.FC<Props> = ({ t }) => {
  const reviews = [
    { text: t.reviews.r1, name: 'Adrien', meta: 'CallKitchen · Express Divorce USA', initial: 'A' },
    { text: t.reviews.r2, name: 'Henry F.', meta: 'Two App', initial: 'H' },
    { text: t.reviews.r3, name: 'Pierre V.', meta: 'Concept Store', initial: 'P' },
  ];
  return (
    <section id="avis" className="relative border-t border-white/5 bg-surface/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading path={t.reviews.path} title={t.reviews.title} className="mb-12 md:mb-16" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 90}>
              <figure className="card flex h-full flex-col p-7">
                <div className="flex gap-1 text-brand-lime" aria-label="5/5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-slate-200">“{review.text}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-mint/10 font-display text-sm font-semibold text-brand-mint ring-1 ring-brand-mint/30">
                    {review.initial}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{review.name}</span>
                    <span className="block text-xs text-slate-500">{review.meta}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Team page                                                           */
/* ------------------------------------------------------------------ */

const WHY_ICONS = [Smartphone, ShieldCheck, Store, Users];

export const WhyUs: React.FC<Props> = ({ t, book }) => {
  const cards = [t.whyUs.card1, t.whyUs.card2, t.whyUs.card3, t.whyUs.card4];
  return (
    <section className="relative border-t border-white/5 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow">{t.whyUs.path}</span>
          <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.whyUs.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{t.whyUs.subtitle}</p>
          <button type="button" data-booking="why-us" onClick={() => book('why-us')} className="btn btn-primary mt-8">
            {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {cards.map((card, i) => {
            const Icon = WHY_ICONS[i];
            return (
              <Reveal key={card.title} delay={i * 90}>
                <div className="card h-full p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{card.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Every page: contact                                                 */
/* ------------------------------------------------------------------ */

export const ContactSection: React.FC<Props> = ({ t, book }) => (
  <section id="contact" className="relative overflow-hidden border-t border-white/5 py-14 md:py-28">
    <SectionLines variant="c" />
    <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
      <Reveal>
        <span className="eyebrow">{t.contact.path}</span>
        <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.contact.title}</h2>
        <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{t.contact.subtitle}</p>
      </Reveal>

      <Reveal delay={120}>
        <div className="card-featured p-6 md:p-10">
          <button
            type="button"
            data-booking="contact"
            onClick={() => book('contact')}
            className="group flex w-full items-center gap-4 rounded-[1.25rem] bg-brand-gradient p-5 text-left text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink/10 ring-1 ring-ink/15">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold">{t.contact.book}</span>
              <span className="block text-sm text-ink/75">{t.contact.bookDesc}</span>
            </span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          <a href="mailto:contact@3geeks.fr" className="card group mt-4 flex items-center gap-4 p-5 hover:bg-surface-2">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
              <Mail className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold text-white">contact@3geeks.fr</span>
              <span className="block text-sm text-slate-400">{t.contact.email}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
          </a>

          <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t.contact.linkedin}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(['elias', 'noam'] as const).map((key) => {
              const founder = FOUNDERS[key];
              return (
                <a key={key} href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="card group flex items-center gap-3 p-4 hover:bg-surface-2">
                  <img src={founder.image} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/15" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">{founder.name}</span>
                    <span className="block text-xs leading-snug text-slate-500">{t.team.founders[key].role}</span>
                  </span>
                  <LinkedInIcon className="h-5 w-5 text-sky-400" />
                </a>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
