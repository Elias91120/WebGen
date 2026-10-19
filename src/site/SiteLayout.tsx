/**
 * Shared frame of the studio pages (/, /offres, /realisations, /equipe, /17-octobre): header with the page
 * links, footer, assistant, booking calendar and legal notices. The /ia page has its own frame.
 * Each page passes its id; the layout handles the language, the page title and anchors.
 */
import { ArrowRight, Globe, Menu, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import AiAgentWidget from '../components/AiAgentWidget';
import BookingModal from '../components/BookingModal';
import Logo from '../components/Logo';
import SpaceSwitch from '../components/SpaceSwitch';
import { FOUNDERS, LinkedInIcon } from '../components/TeamSection';
import { Lang, translations } from '../i18n';
import { openBooking } from '../lib/booking';
import { detectLang, initialLang, persistLang } from '../lib/lang';
import { LEGAL_LINKS } from './legalLinks';

export type PageId = 'home' | 'offers' | 'work' | 'team' | 'game' | 'legalNotice' | 'privacy' | 'terms';
export type Copy = (typeof translations)['fr'];

export interface PageContext {
  lang: Lang;
  t: Copy;
  /** Opens the free-call calendar; `source` shows in Calendly (utm_content). */
  book: (source: string) => void;
}

// The /ia side is reached through the SpaceSwitch next to the logo, not a page link.
type NavKey = 'offers' | 'work' | 'team';
const NAV: Array<{ key: NavKey; href: string; page: PageId }> = [
  { key: 'offers', href: '/offres', page: 'offers' },
  { key: 'work', href: '/realisations', page: 'work' },
  { key: 'team', href: '/equipe', page: 'team' },
];

interface SiteLayoutProps {
  page: PageId;
  children: (ctx: PageContext) => React.ReactNode;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ page, children }) => {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = translations[lang] as Copy;
  const fr = lang === 'fr';

  // Once the French prerendered HTML is hydrated, switch to the visitor's language (no-op otherwise).
  useEffect(() => {
    const detected = detectLang();
    setLang((current) => (current === detected ? current : detected));
  }, []);

  // Title and description follow the language (the HTML ships the French ones).
  useEffect(() => {
    persistLang(lang);
    const meta = page === 'home' ? t.meta : t.site.pages[page];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [lang, page, t]);

  // Links like /offres#methode: the section only exists once React has rendered.
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

  const book = (source: string) => {
    setIsMenuOpen(false);
    openBooking(source);
  };
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'fr' : 'en'));
  const nav = t.site.nav;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink font-sans text-slate-100">
      {/* Skip link (RGAA 12.7): first thing the keyboard reaches, visible only when focused. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-mint focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {fr ? 'Aller au contenu' : 'Skip to content'}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen || page !== 'home'
            ? 'border-b border-white/[0.07] bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-20">
          <div className="flex min-w-0 items-center gap-3 xl:gap-5">
            <a href="/" className="flex min-w-0 shrink-0 items-center" aria-label={`3geeks · ${nav.home}`}>
              <Logo variant="wordmark" compact glow={false} />
            </a>
            <SpaceSwitch active="web" lang={lang} className="hidden min-[360px]:inline-flex" />
          </div>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((link) => {
              const active = link.page === page || (page === 'game' && link.page === 'work'); // (the game lives in the work)
              return (
                <a
                  key={link.key}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative text-sm font-medium transition-colors ${active ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  {nav[link.key]}
                  {active && <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-brand-gradient" aria-hidden="true" />}
                </a>
              );
            })}
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
            <button type="button" data-booking="nav" onClick={() => book('nav')} className="btn btn-primary !py-3">
              {nav.cta}
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
            <SpaceSwitch active="web" lang={lang} variant="menu" className="mb-3" />
            <div className="flex flex-col">
              {[{ key: 'home' as const, href: '/', page: 'home' as PageId }, ...NAV].map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  aria-current={link.page === page ? 'page' : undefined}
                  className={`flex items-center justify-between border-b border-white/5 py-4 text-left text-base font-medium ${
                    link.page === page ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {nav[link.key]}
                    {link.page === page && <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" aria-hidden="true" />}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleLang}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-300 sm:hidden"
            >
              <Globe className="h-4 w-4 text-brand-mint" /> {fr ? 'English version' : 'Version française'}
            </button>
            <button type="button" data-booking="menu" onClick={() => book('menu')} className="btn btn-primary mt-6 w-full">
              {nav.cta}
            </button>
          </div>
        )}
      </header>

      <main id="contenu" tabIndex={-1} className="outline-none">{children({ lang, t, book })}</main>

      <footer className="border-t border-white/[0.07] bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[minmax(0,2fr)_1fr_1fr]">
          <div>
            <Logo variant="wordmark" compact glow={false} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">{t.footer.blurb}</p>
            <p className="mt-5 text-sm font-medium text-brand-lime">{t.footer.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t.site.footer.pages}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { label: nav.home, href: '/' },
                { label: nav.offers, href: '/offres' },
                { label: nav.method, href: '/offres#methode' },
                { label: nav.work, href: '/realisations' },
                { label: nav.team, href: '/equipe' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-300 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/ia" className="inline-flex items-center gap-1.5 font-medium text-brand-mint transition-colors hover:text-white">
                  <Sparkles className="h-3.5 w-3.5" /> {nav.ai}
                </a>
              </li>
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
                  <a
                    href={FOUNDERS[key].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
                  >
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
            <nav aria-label={t.legal.title} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={link.page === page ? 'page' : undefined}
                  className="transition-colors hover:text-white"
                >
                  {t.legal.tabs[link.tab]}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>

      <AiAgentWidget lang={lang} />
      <BookingModal lang={lang} />
    </div>
  );
};

export default SiteLayout;
