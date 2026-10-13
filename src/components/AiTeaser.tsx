/**
 * Main page → AI page bridge: the conveyor from /ia, a short pitch and one chip per
 * department. Each chip opens /ia on the process explorer with that department selected.
 */
import { ArrowRight, ArrowUpRight, Calculator, ChartColumn, Headset, TrendingUp, Truck, Users } from 'lucide-react';
import React from 'react';

import AiConveyor from '../ia/AiConveyor';
import { aiCopy } from '../ia/copy';
import type { Lang } from '../i18n';
import Reveal from './Reveal';

const CHIP_ICONS = [Calculator, Truck, Headset, TrendingUp, Users, ChartColumn];

interface AiTeaserProps {
  lang: Lang;
  copy: { path: string; title: string; subtitle: string; chipsLabel: string; chips: string[]; cta: string };
}

const AiTeaser: React.FC<AiTeaserProps> = ({ lang, copy }) => (
  <section id="ia" className="relative overflow-hidden border-y border-white/5 bg-surface/60 py-20 md:py-28">
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_85%_50%,rgba(10,239,187,0.10),transparent_70%)]"
      aria-hidden="true"
    />
    <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
      <Reveal>
        <span className="eyebrow">{copy.path}</span>
        <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{copy.title}</h2>
        <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{copy.subtitle}</p>

        <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.chipsLabel}</p>
        <ul className="flex flex-wrap gap-2">
          {copy.chips.map((chip, i) => {
            const Icon = CHIP_ICONS[i];
            return (
              <li key={chip}>
                <a
                  href={`/ia?service=${i}#vos-process`}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-200 transition-all hover:-translate-y-0.5 hover:border-brand-mint/50 hover:bg-brand-mint/10 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-brand-mint" />
                  {chip}
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-brand-mint" />
                </a>
              </li>
            );
          })}
        </ul>

        <a href="/ia" className="btn btn-primary mt-8">
          {copy.cta} <ArrowRight className="h-4 w-4" />
        </a>
      </Reveal>

      <Reveal delay={120}>
        <a href="/ia" aria-label={copy.cta} className="block transition-transform duration-300 hover:-translate-y-1">
          <AiConveyor diagram={aiCopy[lang].hero.diagram} />
        </a>
      </Reveal>
    </div>
  </section>
);

export default AiTeaser;
