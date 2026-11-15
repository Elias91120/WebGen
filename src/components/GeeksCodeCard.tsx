/**
 * La carte de Geeks Code sur /realisations : une petite fenêtre de l'éditeur. À gauche, le projet ; à droite, le
 * contrat d'un jalon (trois conditions qui se cochent quand la carte arrive à l'écran) et Geeko au travail, qui
 * fait la fête à la troisième coche. Toute la carte mène à l'étude de cas (/realisations/geeks-code).
 * Avec « réduire les animations », les coches sont déjà posées et le portrait de Geeko remplace Geeko.
 */
import { ArrowRight, Check } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import Geeko, { GEEKO_PORTRAIT, sizeFrom } from './Geeko';
import { Mark } from './Logo';
import type { ProjectItem } from './ProjectsShowcase';

const COPY = {
  fr: {
    fresh: 'Nouveau',
    doneWhen: 'Fini quand',
    conditions: ['L’IA travaille sur un plan', 'On voit ce qu’elle fait', 'Un humain valide'],
    running: 'Jalon en cours',
    done: 'Jalon validé',
    cta: 'Découvrir Geeks Code et Geeko',
  },
  en: {
    fresh: 'New',
    doneWhen: 'Done when',
    conditions: ['AI works from a plan', 'You see what it does', 'A human approves'],
    running: 'Milestone in progress',
    done: 'Milestone approved',
    cta: 'Discover Geeks Code and Geeko',
  },
} as const;

// Les coches se posent une à une une fois la carte à l'écran (ms).
const TICK_AT = [900, 2000, 3300];

const GeeksCodeCard: React.FC<{ project: ProjectItem; lang: 'en' | 'fr' }> = ({ project, lang }) => {
  const t = COPY[lang];
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [ticks, setTicks] = useState(0);
  const done = ticks >= t.conditions.length;

  useEffect(() => {
    if (reduce) {
      setTicks(TICK_AT.length);
      return;
    }
    if (!inView) return;
    const timers = TICK_AT.map((at, i) => window.setTimeout(() => setTicks(i + 1), at));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [inView, reduce]);

  return (
    <a
      ref={ref}
      id={project.id}
      href={project.page}
      className="group block scroll-mt-24 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0a0c11] shadow-[0_0_90px_-60px_rgba(10,239,187,0.9)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-mint/40 hover:shadow-[0_30px_90px_-45px_rgba(10,239,187,0.55)]"
    >
      {/* La barre de titre de la fenêtre */}
      <div className="flex h-10 items-center gap-3 border-b border-white/[0.07] bg-ink/60 px-4 text-xs">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <Mark className="h-4" />
        <span className="font-semibold text-slate-100">{project.title[lang]}</span>
        <span className="flex-1" />
        <span className="rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">{t.fresh}</span>
      </div>

      <div className="grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Le projet */}
        <div className="flex flex-col p-6 md:p-8">
          <p className="text-xs font-medium text-brand-mint/90">{project.badge[lang]}</p>
          <h3 className="mt-1.5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            <span className="text-gradient">{project.title[lang]}</span>
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description[lang]}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags[lang].map((tag) => (
              <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-mint transition-colors group-hover:text-white">
            {t.cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>

        {/* Le contrat du jalon, et Geeko */}
        <div className="relative flex flex-col border-t border-white/[0.07] bg-[radial-gradient(ellipse_80%_70%_at_80%_100%,rgba(10,239,187,0.13),transparent_70%)] p-6 md:border-l md:border-t-0 md:p-8">
          <p className="text-[11px] font-semibold text-slate-500">{t.doneWhen}</p>
          <ul className="mt-3 space-y-3">
            {t.conditions.map((condition, i) => {
              const on = i < ticks;
              return (
                <li key={condition} className={`flex items-center gap-3 text-sm font-medium transition-colors duration-500 ${on ? 'text-white' : 'text-slate-500'}`}>
                  <motion.span
                    initial={false}
                    animate={on && !reduce ? { scale: [0.5, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.42, ease: [0.175, 0.885, 0.32, 1.275] }}
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] ${on ? 'bg-brand-gradient text-ink' : 'border-[1.5px] border-white/25 text-transparent'}`}
                  >
                    <Check className="h-3 w-3" strokeWidth={4} />
                  </motion.span>
                  {condition}
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-1 items-end justify-between gap-4">
            <span
              className={`mb-1 inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-500 ${
                done ? 'border-brand-mint/50 bg-brand-mint/10 text-brand-mint' : 'border-white/10 bg-white/[0.03] text-slate-400'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-brand-mint' : 'bg-slate-500'}`} />
              {done ? t.done : t.running}
            </span>
            <span className="relative block shrink-0">
              <Geeko lang={lang} variant={done ? 'confettis' : 'deux-doigts'} size={sizeFrom(768, 1.75, 1.4)} eggs={false} className="relative" />
              <img src={GEEKO_PORTRAIT} alt="" width={84} height={68} loading="lazy" decoding="async" className="hidden w-24 motion-reduce:block" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default GeeksCodeCard;
