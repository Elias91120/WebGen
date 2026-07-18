import Reveal from '../motion/Reveal';
import type { Translations } from '../../i18n/translations';

interface TestimonialsProps {
  t: Translations;
}

export default function Testimonials({ t }: TestimonialsProps) {
  return (
    <section id="temoignages" className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
            {t.reviews.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {t.reviews.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.05}>
              <blockquote className="surface-card flex h-full flex-col p-6 md:p-7">
                <p className="flex-1 text-sm leading-relaxed text-slate-300 md:text-base">
                  “{item.quote}”
                </p>
                <footer className="mt-5 border-t border-white/8 pt-4">
                  <cite className="not-italic text-sm font-semibold text-white">{item.name}</cite>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500">{item.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
