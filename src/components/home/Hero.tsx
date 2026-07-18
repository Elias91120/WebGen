import { ArrowRight } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import Logo from '../Logo';
import WorkStage from './WorkStage';
import { easeOut } from '../../lib/motion';
import type { Translations } from '../../i18n/translations';

interface HeroProps {
  t: Translations;
  onContact: () => void;
  onProjects: () => void;
}

export default function Hero({ t, onContact, onProjects }: HeroProps) {
  const reduce = useReducedMotion();

  const item = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: easeOut },
        };

  return (
    <section className="relative flex min-h-[100dvh] items-center pt-20 md:pt-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-16">
        <div className="flex flex-col items-start lg:col-span-5">
          <motion.div {...item(0.05)} className="mb-5 md:mb-6">
            <Logo variant="wordmark" large className="!h-14 sm:!h-16 md:!h-20" />
          </motion.div>

          <motion.h1
            {...item(0.12)}
            className="font-display text-[1.75rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.08]"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            {...item(0.2)}
            className="mt-4 max-w-[36ch] text-base leading-relaxed text-slate-400 md:text-lg"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div {...item(0.28)} className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button type="button" onClick={onContact} className="btn-primary w-full sm:w-auto">
              {t.hero.ctaPrimary}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10">
                <ArrowRight className="h-4 w-4" weight="bold" />
              </span>
            </button>
            <button type="button" onClick={onProjects} className="btn-secondary w-full sm:w-auto">
              {t.hero.ctaSecondary}
            </button>
          </motion.div>
        </div>

        <div className="flex justify-center lg:col-span-7 lg:justify-end">
          <WorkStage t={t} />
        </div>
      </div>
    </section>
  );
}
