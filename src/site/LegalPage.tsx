/**
 * The legal pages (/mentions-legales, /confidentialite, /cgv): one text each, with its own URL,
 * so they can be linked from a quote, an invoice or a tender answer. Texts live in i18n.ts (legal).
 */
import React from 'react';

import { LEGAL_LINKS } from './legalLinks';
import { PageIntro } from './sections';
import type { PageContext } from './SiteLayout';

type LegalPageId = (typeof LEGAL_LINKS)[number]['page'];

export const LegalContent: React.FC<PageContext & { page: LegalPageId }> = ({ t, lang, page }) => {
  const current = LEGAL_LINKS.find((link) => link.page === page)!;
  const intro = t.site.pages[page];
  const sections = t.legal.content[current.tab];

  return (
    <>
      <PageIntro path={intro.path} title={intro.h1} sub={intro.sub} />
      <section className="relative pb-20 pt-10 md:pb-28 md:pt-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-16">
          <nav aria-label={lang === 'fr' ? 'Autres pages légales' : 'Other legal pages'} className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {LEGAL_LINKS.map((link) => {
                const active = link.page === page;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active ? 'bg-white/[0.06] text-white' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {t.legal.tabs[link.tab]}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <article className="max-w-3xl space-y-9 text-base leading-relaxed text-slate-300">
            {t.legal.prevails && <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">{t.legal.prevails}</p>}
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-semibold text-white">{section.title}</h2>
                <p className="mt-3 whitespace-pre-line">{section.text}</p>
              </section>
            ))}
            <p className="border-t border-white/[0.07] pt-6 text-sm text-slate-400">{t.legal.updated}</p>
          </article>
        </div>
      </section>
    </>
  );
};

export default LegalContent;
