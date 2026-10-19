/**
 * 3geeks.fr/ia — AI & automation for companies that already have a website and software.
 * Shares the design system, booking flow, assistant and legal notices of the main site.
 */
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Blocks,
  Bot,
  CalendarCheck,
  Check,
  FileText,
  Globe,
  GraduationCap,
  Headset,
  KeyRound,
  Lock,
  Mail,
  Menu,
  Plug,
  Smartphone,
  Truck,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import AiAgentWidget from '../components/AiAgentWidget';
import BookingModal from '../components/BookingModal';
import Logo from '../components/Logo';
import Reveal from '../components/Reveal';
import SectionLines from '../components/SectionLines';
import SpaceSwitch from '../components/SpaceSwitch';
import { FOUNDERS, LinkedInIcon } from '../components/TeamSection';
import { LEGAL_LINKS } from '../site/legalLinks';
import { Lang, translations } from '../i18n';
import { openBooking } from '../lib/booking';
import { detectLang, initialLang, persistLang } from '../lib/lang';
import AutomationExplorer from './AutomationExplorer';
import { aiCopy } from './copy';
import AiConveyor from './AiConveyor';
import ProcessDemo from './ProcessDemo';

// `wide`: only shown in the desktop bar from 2xl up (the SpaceSwitch takes their room on smaller screens).
const NAV_LINKS: Array<{ id: string; key: 'demo' | 'explorer' | 'services' | 'proof' | 'method'; wide?: boolean }> = [
  { id: 'demo', key: 'demo' },
  { id: 'vos-process', key: 'explorer', wide: true },
  { id: 'services', key: 'services' },
  { id: 'realisations', key: 'proof' },
  { id: 'methode', key: 'method', wide: true },
];

const SERVICE_ICONS = [Plug, Truck, Headset, FileText, Smartphone, GraduationCap];
const WHY_ICONS = [Lock, Blocks, KeyRound, Award];

const AiPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(initialLang);
  const [scrolled, setScrolled] = useState(false);

  const t = aiCopy[lang];
  const legal = translations[lang].legal;
  const fr = lang === 'fr';

  // Once the French prerendered HTML is hydrated, switch to the visitor's language (no-op otherwise).
  useEffect(() => {
    const detected = detectLang();
    setLang((current) => (current === detected ? current : detected));
  }, []);

  useEffect(() => {
    persistLang(lang);
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [lang, t.meta.title, t.meta.description]);

  // Links like /ia#vos-process: the section only exists once React has rendered, so scroll here.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Every call-to-action books the free audit call on Calendly (source = button, for Calendly stats).
  const book = (source: string) => {
    setIsMenuOpen(false);
    openBooking(`ia-${source}`);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'fr' : 'en'));

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink font-sans text-slate-100">
      {/* Skip link (RGAA 12.7): first thing the keyboard reaches, visible only when focused. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-mint focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {fr ? 'Aller au contenu' : 'Skip to content'}
      </a>
      {/* ------------------------------------------------------------ */}
      {/* NAVIGATION                                                    */}
      {/* ------------------------------------------------------------ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? 'border-b border-white/[0.07] bg-ink/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-20">
          <div className="flex min-w-0 items-center gap-3 xl:gap-5">
            <a href="/ia" className="flex min-w-0 shrink-0 items-center" aria-label="3geeks">
              <Logo variant="wordmark" compact glow={false} />
            </a>
            <SpaceSwitch active="ai" lang={lang} className="hidden min-[360px]:inline-flex" />
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium text-slate-300 transition-colors hover:text-white ${link.wide ? 'hidden 2xl:inline' : ''}`}
              >
                {t.nav[link.key]}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-white/25 hover:text-white"
              aria-label={fr ? 'Switch to English' : 'Passer en français'}
              lang={fr ? 'en' : 'fr'}
            >
              <Globe className="h-3.5 w-3.5 text-brand-mint" /> {lang.toUpperCase()}
            </button>
            <button type="button" data-booking="ia-nav" onClick={() => book('nav')} className="btn btn-primary !py-3">
              {t.nav.cta}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleLang}
              className="hidden h-10 items-center rounded-full border border-white/10 px-3.5 text-xs font-semibold text-slate-300 sm:flex"
              aria-label={fr ? 'Switch to English' : 'Passer en français'}
              lang={fr ? 'en' : 'fr'}
            >
              {lang.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg border border-white/10 p-2 text-white"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/[0.07] bg-ink px-5 pb-6 pt-4 md:h-[calc(100svh-5rem)] lg:hidden">
            <SpaceSwitch active="ai" lang={lang} variant="menu" className="mb-3" />
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center justify-between border-b border-white/5 py-4 text-left text-base font-medium text-slate-100"
                >
                  {t.nav[link.key]}
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleLang}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-300 sm:hidden"
            >
              <Globe className="h-4 w-4 text-brand-mint" /> {fr ? 'English version' : 'Version française'}
            </button>
            <button type="button" data-booking="ia-menu" onClick={() => book('menu')} className="btn btn-primary mt-6 w-full">
              {t.nav.cta}
            </button>
          </div>
        )}
      </header>

      <main id="contenu" tabIndex={-1} className="outline-none">
        {/* ------------------------------------------------------------ */}
        {/* HERO                                                          */}
        {/* ------------------------------------------------------------ */}
        <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_90%_8%,rgba(10,239,187,0.16),transparent_70%),radial-gradient(ellipse_70%_40%_at_0%_95%,rgba(195,251,5,0.08),transparent_70%)] lg:bg-[radial-gradient(ellipse_45%_60%_at_75%_45%,rgba(10,239,187,0.14),transparent_70%),radial-gradient(ellipse_40%_40%_at_10%_90%,rgba(195,251,5,0.06),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 grid-dust opacity-60" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 content-center items-center gap-12 px-5 pb-10 pt-24 sm:px-8 sm:pt-32 md:pt-36 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
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
                className="hero-rise mt-6 font-display text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[2.9rem] xl:text-[3.25rem]"
                style={{ ['--rise-delay' as string]: '220ms' }}
              >
                {t.hero.titleStart} <span className="text-gradient">{t.hero.titleEnd}</span>
              </h1>

              <p className="hero-rise mt-7 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg" style={{ ['--rise-delay' as string]: '360ms' }}>
                {t.hero.comment}
              </p>

              <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ ['--rise-delay' as string]: '480ms' }}>
                <button type="button" data-booking="ia-hero" onClick={() => book('hero')} className="btn btn-primary">
                  {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => scrollToSection('demo')} className="btn btn-ghost">
                  {t.hero.ctaSecondary}
                </button>
              </div>
            </div>

            {/* Motion piece: raw items cross the AI line and come out as finished tasks */}
            <div className="hero-rise" style={{ ['--rise-delay' as string]: '600ms' }}>
              <AiConveyor diagram={t.hero.diagram} />
            </div>
          </div>

          <div className="relative z-10 border-t border-white/[0.08] bg-ink/40 backdrop-blur-md">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:px-8 md:grid-cols-4">
              {t.hero.trust.map((item) => (
                <div key={item.v} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="shrink-0 whitespace-nowrap font-display text-2xl font-semibold text-white md:text-3xl">{item.k}</span>
                  <span className="text-xs leading-snug text-slate-400 md:text-sm">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* DÉMO : un process qui s'automatise                           */}
        {/* ------------------------------------------------------------ */}
        <section id="demo" className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-10 max-w-2xl md:mb-12">
              <span className="eyebrow">{t.demo.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.demo.title}</h2>
              <p className="mt-5 text-base text-slate-400 md:text-lg">{t.demo.subtitle}</p>
            </Reveal>
            <ProcessDemo copy={t.demo} />
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* VOS PROCESS : quoi automatiser, par service                  */}
        {/* ------------------------------------------------------------ */}
        <section id="vos-process" className="relative overflow-hidden border-y border-white/5 bg-surface/60 py-20 md:py-28">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-10 max-w-2xl md:mb-12">
              <span className="eyebrow">{t.explorer.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.explorer.title}</h2>
              <p className="mt-5 text-base text-slate-400 md:text-lg">{t.explorer.subtitle}</p>
            </Reveal>
            <AutomationExplorer copy={t.explorer} onBook={() => book('explorer')} />
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* SERVICES                                                      */}
        {/* ------------------------------------------------------------ */}
        <section id="services" className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
              <span className="eyebrow">{t.services.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.services.title}</h2>
              <p className="mt-5 text-base text-slate-400 md:text-lg">{t.services.subtitle}</p>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {t.services.items.map((item, i) => {
                const Icon = SERVICE_ICONS[i];
                const featured = i < 2;
                return (
                  <Reveal key={item.title} delay={i * 80}>
                    <article className={`${featured ? 'card-featured shadow-[0_30px_80px_-35px_rgba(10,239,187,0.4)]' : 'card'} flex h-full flex-col p-7`}>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                      <ul className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-5">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>


        {/* ------------------------------------------------------------ */}
        {/* RÉALISATIONS                                                  */}
        {/* ------------------------------------------------------------ */}
        <section id="realisations" className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-12 max-w-2xl md:mb-16">
              <span className="eyebrow">{t.proof.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.proof.title}</h2>
              <p className="mt-5 text-base text-slate-400 md:text-lg">{t.proof.subtitle}</p>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {t.proof.items.map((item, i) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-brand-mint">{item.name}</span>
                      {item.isPrivate ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          <Lock className="h-3 w-3" /> {t.proof.privateTag}
                        </span>
                      ) : item.link ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-white">
                          {t.proof.open} <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <Bot className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-white">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-300">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </>
                );
                return (
                  <Reveal key={item.name} delay={i * 80}>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="card group flex h-full flex-col p-6 hover:bg-surface-2 md:p-7">
                        {inner}
                      </a>
                    ) : (
                      <article className="card flex h-full flex-col p-6 md:p-7">{inner}</article>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* MÉTHODE                                                       */}
        {/* ------------------------------------------------------------ */}
        <section id="methode" className="relative overflow-hidden border-y border-white/5 bg-surface/60 py-20 md:py-28">
          <SectionLines variant="b" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-14 max-w-2xl md:mb-20">
              <span className="eyebrow">{t.method.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.method.title}</h2>
              <p className="mt-5 text-base text-slate-400 md:text-lg">{t.method.subtitle}</p>
            </Reveal>

            <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
              <div className="absolute left-[1.35rem] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-lime/60 via-brand-mint/30 to-transparent md:hidden" aria-hidden="true" />
              <div className="absolute left-0 right-0 top-[1.35rem] hidden h-px bg-gradient-to-r from-brand-lime/60 via-brand-mint/40 to-transparent md:block" aria-hidden="true" />
              {t.method.steps.map((step, i) => (
                <Reveal as="li" key={step.t} delay={i * 90} className="relative pl-16 md:pl-0">
                  <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-brand-mint/40 bg-ink font-display text-sm font-semibold text-brand-mint shadow-[0_0_24px_-4px_rgba(10,239,187,0.5)] md:relative">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white md:mt-6">{step.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* POURQUOI 3GEEKS                                               */}
        {/* ------------------------------------------------------------ */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">{t.why.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.why.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{t.why.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {(['elias', 'noam'] as const).map((key) => (
                  <a
                    key={key}
                    href={FOUNDERS[key].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card group flex items-center gap-3 py-2 pl-2 pr-4 hover:bg-surface-2"
                  >
                    <img src={FOUNDERS[key].image} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover ring-1 ring-white/15" />
                    <span className="text-sm font-semibold text-white">{FOUNDERS[key].name}</span>
                    <LinkedInIcon className="h-4 w-4 text-sky-400" />
                  </a>
                ))}
              </div>
              <button type="button" data-booking="ia-why" onClick={() => book('why')} className="btn btn-primary mt-8">
                {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </button>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {t.why.cards.map((card, i) => {
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

        {/* ------------------------------------------------------------ */}
        {/* CONTACT                                                       */}
        {/* ------------------------------------------------------------ */}
        <section id="contact" className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
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
                  data-booking="ia-contact"
                  onClick={() => book('contact')}
                  className="group flex w-full items-center gap-4 rounded-[1.25rem] bg-brand-gradient p-5 text-left text-ink shadow-[0_20px_50px_-20px_rgba(10,239,187,0.7)] transition-transform hover:-translate-y-0.5"
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
                          <span className="block text-xs leading-snug text-slate-500">{translations[lang].team.founders[key].role}</span>
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

        <AiAgentWidget lang={lang} greeting={t.assistant.greeting} suggestions={t.assistant.suggestions} />
        <BookingModal lang={lang} />
      </main>

      {/* ------------------------------------------------------------ */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------ */}
      <footer className="border-t border-white/[0.07] bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[minmax(0,2fr)_1fr_1fr]">
          <div>
            <Logo variant="wordmark" compact glow={false} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">{t.footer.blurb}</p>
            <a href="/offres" className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-brand-mint transition-colors hover:text-white">
              {t.footer.webSite} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <p className="mt-5 text-sm font-medium text-brand-lime">{t.footer.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t.footer.navigate}</p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button type="button" onClick={() => scrollToSection(link.id)} className="text-sm text-slate-300 transition-colors hover:text-white">
                    {t.nav[link.key]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Contact</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href="mailto:contact@3geeks.fr" className="text-slate-300 transition-colors hover:text-white">
                  contact@3geeks.fr
                </a>
              </li>
              {(['elias', 'noam'] as const).map((key) => (
                <li key={key}>
                  <a href={FOUNDERS[key].linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white">
                    <LinkedInIcon className="h-3.5 w-3.5 text-slate-500" /> {FOUNDERS[key].name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 pb-24 text-xs text-slate-500 sm:px-8 md:flex-row md:pb-6 md:pr-64">
            <span>© {new Date().getFullYear()} 3geeks. {t.footer.rights}</span>
            <nav aria-label={legal.title} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="transition-colors hover:text-white">
                  {legal.tabs[link.tab]}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AiPage;
