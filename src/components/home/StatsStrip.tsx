import Reveal from '../motion/Reveal';
import type { Translations } from '../../i18n/translations';

interface StatsStripProps {
  t: Translations;
}

export default function StatsStrip({ t }: StatsStripProps) {
  const items = [
    { n: '03', l: t.stats.founders },
    { n: '03', l: t.stats.projects },
    { n: '24h', l: t.stats.response },
    { n: 'FR', l: t.stats.french },
  ];

  return (
    <section className="relative z-10 pb-8 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {items.map((s) => (
              <div
                key={s.l}
                className="surface-card px-4 py-4 text-center md:py-5"
              >
                <div className="font-display text-2xl font-bold tracking-tight text-cyan-300 md:text-3xl">
                  {s.n}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 md:text-[11px]">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
