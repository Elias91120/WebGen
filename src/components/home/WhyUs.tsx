import { ChatCircle, HardDrives, Sparkle } from '@phosphor-icons/react';
import Reveal from '../motion/Reveal';
import type { Translations } from '../../i18n/translations';

interface WhyUsProps {
  t: Translations;
}

const icons = [Sparkle, HardDrives, ChatCircle];

export default function WhyUs({ t }: WhyUsProps) {
  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
            {t.whyUs.title}
          </h2>
          <p className="mt-3 text-base text-slate-400 md:text-lg">{t.whyUs.subtitle}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {t.whyUs.cards.map((card, i) => {
            const Icon = icons[i] ?? Sparkle;
            const featured = i === 1;
            return (
              <Reveal key={card.title} delay={i * 0.05}>
                <article
                  className={`h-full rounded-2xl border p-6 md:p-7 ${
                    featured
                      ? 'border-cyan-400/25 bg-cyan-400/[0.06]'
                      : 'border-white/8 bg-[#0d1117]/70'
                  }`}
                >
                  <div
                    className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${
                      featured
                        ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.desc}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
