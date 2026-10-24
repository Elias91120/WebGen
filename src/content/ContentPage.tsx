/**
 * A content page (src/content/pages.ts) in the site's own design: breadcrumb, intro, sections, related
 * pages and the free-call block. Same cards, headings and booking as the rest of the site.
 */
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Mail } from 'lucide-react';
import React from 'react';

import Reveal from '../components/Reveal';
import type { Lang } from '../i18n';
import SiteLayout from '../site/SiteLayout';
import { CONTENT_PAGES, ContentPage, ContentSection } from './pages';

const UI = {
  fr: {
    home: 'Accueil',
    breadcrumb: 'Fil d’Ariane',
    book: 'Réserver un audit gratuit',
    back: 'Voir tous nos services IA',
    open: 'Voir',
    related: 'À lire aussi',
    contactTitle: 'Parlons de votre cas.',
    contactSub: 'En 30 minutes, on regarde vos outils et vos demandes, et on vous dit ce qui est automatisable. Devis gratuit, rien à payer d’avance.',
    email: 'Ou écrivez-nous :',
  },
  en: {
    home: 'Home',
    breadcrumb: 'Breadcrumb',
    book: 'Book a free audit',
    back: 'See all our AI services',
    open: 'See it',
    related: 'Read also',
    contactTitle: 'Let’s talk about your case.',
    contactSub: 'In 30 minutes, we look at your tools and requests, and tell you what can be automated. Free quote, nothing to pay upfront.',
    email: 'Or write to us:',
  },
} as const;

const SectionHeading: React.FC<{ path: string; title: string; sub?: string }> = ({ path, title, sub }) => (
  <Reveal className="max-w-2xl">
    <span className="eyebrow">{path}</span>
    <h2 className="section-title mt-4 text-3xl sm:text-4xl">{title}</h2>
    {sub && <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{sub}</p>}
  </Reveal>
);

const CheckDot: React.FC = () => (
  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
    <Check className="h-3 w-3" strokeWidth={3} />
  </span>
);

const Section: React.FC<{ section: ContentSection; lang: Lang; index: number }> = ({ section, lang, index }) => {
  const ui = UI[lang];
  const shaded = index % 2 === 1;
  return (
    <section className={`relative py-16 md:py-24 ${shaded ? 'border-y border-white/5 bg-surface/60' : ''}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading path={section.path[lang]} title={section.title[lang]} sub={'sub' in section ? section.sub?.[lang] : undefined} />

        {section.type === 'points' && (
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {section.items[lang].map((item, i) => (
              <Reveal key={item.t} delay={(i % 2) * 80}>
                <article className="card flex h-full flex-col p-7">
                  <h3 className="font-display text-xl font-semibold leading-snug text-white">{item.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{item.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {section.type === 'steps' && (
          <ol className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {section.items[lang].map((step, i) => (
              <Reveal key={step.t} delay={i * 80} as="li">
                <div className="card flex h-full flex-col p-6">
                  <span className="font-display text-sm font-semibold text-brand-mint">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white">{step.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        )}

        {section.type === 'proof' && (
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {section.items.map((item, i) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold text-brand-mint">{item.name}</span>
                    {item.link && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-white">
                        {ui.open} <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-white">{item.title[lang]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.d[lang]}</p>
                </>
              );
              return (
                <Reveal key={item.name} delay={(i % 2) * 80}>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="card group flex h-full flex-col p-7 hover:-translate-y-1 hover:bg-surface-2">
                      {inner}
                    </a>
                  ) : (
                    <article className="card flex h-full flex-col p-7">{inner}</article>
                  )}
                </Reveal>
              );
            })}
          </div>
        )}

        {section.type === 'checks' && (
          <Reveal className="mt-10 max-w-3xl">
            <ul className="space-y-4">
              {section.items[lang].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300 md:text-base">
                  <CheckDot />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
};

const ContentPageView: React.FC<{ page: ContentPage }> = ({ page }) => (
  <SiteLayout page="content" space={page.space} meta={page.meta}>
    {({ lang, book }) => {
      const ui = UI[lang];
      const related = page.related.map((path) => CONTENT_PAGES.find((p) => p.path === path)).filter((p): p is ContentPage => Boolean(p));
      const homeHref = page.space === 'ai' ? '/ia' : '/';
      return (
        <>
          <section className="relative overflow-hidden border-b border-white/5 pb-14 pt-28 md:pb-20 md:pt-40">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_85%_0%,rgba(10,239,187,0.12),transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
              <nav aria-label={ui.breadcrumb} className="hero-rise text-xs text-slate-400" style={{ ['--rise-delay' as string]: '40ms' }}>
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <a href="/" className="transition-colors hover:text-white">{ui.home}</a>
                  </li>
                  {page.parent.href !== '/' && (
                    <>
                      <ChevronRight className="h-3 w-3 text-slate-600" aria-hidden="true" />
                      <li>
                        <a href={page.parent.href} className="transition-colors hover:text-white">{page.parent.label[lang]}</a>
                      </li>
                    </>
                  )}
                  <ChevronRight className="h-3 w-3 text-slate-600" aria-hidden="true" />
                  <li aria-current="page" className="text-slate-200">{page.eyebrow[lang]}</li>
                </ol>
              </nav>
              <span className="eyebrow hero-rise mt-8 inline-flex" style={{ ['--rise-delay' as string]: '80ms' }}>{page.eyebrow[lang]}</span>
              <h1 className="section-title mt-4 max-w-4xl text-[2.1rem] sm:text-5xl md:text-6xl">{page.h1[lang]}</h1>
              <p className="hero-rise mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg" style={{ ['--rise-delay' as string]: '200ms' }}>
                {page.intro[lang]}
              </p>
              <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ ['--rise-delay' as string]: '300ms' }}>
                <button type="button" data-booking={page.bookingSource} onClick={() => book(page.bookingSource)} className="btn btn-primary">
                  {ui.book} <ArrowRight className="h-4 w-4" />
                </button>
                <a href={homeHref} className="btn btn-ghost">{ui.back}</a>
              </div>
            </div>
          </section>

          {page.sections.map((section, i) => (
            <Section key={`${section.type}-${i}`} section={section} lang={lang} index={i} />
          ))}

          {related.length > 0 && (
            <section className="relative py-16 md:py-20">
              <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <h2 className="font-display text-xl font-semibold text-white">{ui.related}</h2>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {related.map((other) => (
                    <a key={other.path} href={other.path} className="card group flex items-center justify-between gap-4 p-5 hover:bg-surface-2">
                      <span>
                        <span className="block text-xs font-medium text-brand-mint/90">{other.eyebrow[lang]}</span>
                        <span className="mt-1 block text-sm font-semibold text-white">{other.h1[lang]}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="relative overflow-hidden border-t border-white/5 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal className="card-featured relative flex flex-col gap-6 overflow-hidden p-7 md:flex-row md:items-center md:justify-between md:p-10">
                <div className="max-w-2xl">
                  <h2 className="font-display text-2xl font-semibold text-white md:text-4xl">{ui.contactTitle}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{ui.contactSub}</p>
                  {/* The address stays alone in its link: Cloudflare's e-mail obfuscation rewrites it in the HTML and
                      restores it with a script, which only gives back the same markup (no hydration error) that way. */}
                  <p className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm text-slate-400">
                    <Mail className="h-4 w-4 text-brand-mint" aria-hidden="true" />
                    <span>{ui.email}</span>
                    <a href="mailto:contact@3geeks.fr" className="text-slate-300 transition-colors hover:text-white">contact@3geeks.fr</a>
                  </p>
                </div>
                <button type="button" data-booking={`${page.bookingSource}-bas`} onClick={() => book(`${page.bookingSource}-bas`)} className="btn btn-primary shrink-0">
                  {ui.book} <ArrowRight className="h-4 w-4" />
                </button>
              </Reveal>
            </div>
          </section>
        </>
      );
    }}
  </SiteLayout>
);

export default ContentPageView;
