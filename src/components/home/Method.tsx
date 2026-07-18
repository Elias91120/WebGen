import Reveal from '../motion/Reveal';
import type { Translations } from '../../i18n/translations';

interface MethodProps {
  t: Translations;
}

export default function Method({ t }: MethodProps) {
  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
            {t.method.title}
          </h2>
          <p className="mt-3 text-base text-slate-400 md:text-lg">{t.method.subtitle}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {t.method.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="relative border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white md:text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400 md:text-base">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
