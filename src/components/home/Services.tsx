import { CheckCircle, ShieldCheck } from '@phosphor-icons/react';
import Reveal from '../motion/Reveal';
import type { ServiceType } from '../../types';
import type { Translations } from '../../i18n/translations';

interface ServicesProps {
  t: Translations;
  onSelect: (service: ServiceType) => void;
}

export default function Services({ t, onSelect }: ServicesProps) {
  return (
    <section id="services" className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
            {t.services.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal>
            <article className="surface-card flex h-full flex-col p-6 md:p-8">
              <span className="w-fit rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {t.services.s1.badge}
              </span>
              <h3 className="mt-4 text-xl font-bold text-white md:text-2xl">{t.services.s1.title}</h3>
              <div className="mt-3">
                <div className="font-display text-3xl font-bold text-white">{t.services.s1.price}</div>
                <div className="font-mono text-xs text-slate-500">{t.services.s1.subPrice}</div>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.services.s1.features.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" weight="fill" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onSelect('starter')}
                className="btn-secondary mt-8 w-full"
              >
                {t.services.s1.btn}
              </button>
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <article className="flex h-full flex-col rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.06] p-6 md:p-8">
              <span className="w-fit rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-200">
                {t.services.s2.badge}
              </span>
              <h3 className="mt-4 text-xl font-bold text-white md:text-2xl">{t.services.s2.title}</h3>
              <div className="mt-3">
                <div className="font-display text-3xl font-bold text-cyan-300">{t.services.s2.price}</div>
                <div className="font-mono text-xs text-slate-400">{t.services.s2.subPrice}</div>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.services.s2.features.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" weight="fill" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onSelect('custom')}
                className="btn-primary mt-8 w-full"
              >
                {t.services.s2.btn}
              </button>
            </article>
          </Reveal>
        </div>

        <Reveal className="mt-6" delay={0.08}>
          <button
            type="button"
            onClick={() => onSelect('maintenance_only')}
            className="surface-card flex w-full flex-col items-start gap-4 p-5 text-left transition-colors hover:border-cyan-400/25 sm:flex-row sm:items-center sm:justify-between md:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                <ShieldCheck className="h-5 w-5" weight="duotone" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{t.services.maintenanceTitle}</h4>
                <p className="mt-0.5 text-sm text-slate-400">
                  {t.services.maintenanceDesc}{' '}
                  <span className="font-mono font-semibold text-lime-300">{t.services.maintenancePrice}</span>
                </p>
              </div>
            </div>
          </button>
        </Reveal>

        <Reveal className="mt-4 text-center" delay={0.1}>
          <button
            type="button"
            onClick={() => onSelect('redesign')}
            className="text-sm text-slate-500 transition-colors hover:text-cyan-300"
          >
            {t.services.redesignNote}{' '}
            <span className="underline underline-offset-4">{t.services.redesignCta}</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
