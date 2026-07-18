import { ArrowUpRight, Leaf, Sparkle } from '@phosphor-icons/react';
import Reveal from '../motion/Reveal';
import type { Translations } from '../../i18n/translations';

interface OpenSourceStripProps {
  t: Translations;
}

export default function OpenSourceStrip({ t }: OpenSourceStripProps) {
  const items = [
    { data: t.openSource.p2, icon: Sparkle, accent: true },
    { data: t.openSource.p1, icon: Leaf, accent: false },
  ];

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 max-w-xl md:mb-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {t.openSource.title}
          </h2>
          <p className="mt-2 text-sm text-slate-400 md:text-base">{t.openSource.subtitle}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map(({ data, icon: Icon, accent }, i) => (
            <Reveal key={data.title} delay={i * 0.05}>
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-start gap-4 rounded-2xl border p-5 transition-colors md:p-6 ${
                  accent
                    ? 'border-emerald-400/20 bg-emerald-400/[0.05] hover:border-emerald-400/35'
                    : 'border-white/8 bg-[#0d1117]/70 hover:border-white/15'
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                    accent
                      ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-300'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  <Icon className="h-6 w-6" weight="duotone" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{data.title}</h3>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {data.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{data.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 group-hover:text-cyan-200">
                    {data.btn}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" weight="bold" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
