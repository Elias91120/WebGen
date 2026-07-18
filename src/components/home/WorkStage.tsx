import { ArrowUpRight } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import callKitchenImg from '../../assets/images/CallKitchen.jpeg';
import { easeOut } from '../../lib/motion';
import type { Translations } from '../../i18n/translations';

interface WorkStageProps {
  t: Translations;
}

export default function WorkStage({ t }: WorkStageProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="double-bezel w-full max-w-lg lg:max-w-none"
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.28, ease: easeOut }}
    >
      <div className="double-bezel-inner">
        <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-2.5">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-cyan-400/50" />
          </div>
          <motion.span
            className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/80"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            {t.hero.workTag}
          </motion.span>
        </div>

        <div className="relative aspect-[16/11] overflow-hidden bg-brand-raised">
          <img
            src={callKitchenImg}
            alt={t.hero.workTitle}
            width={640}
            height={440}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090d]/95 via-[#08090d]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <p className="text-lg font-semibold tracking-tight text-white md:text-xl">{t.hero.workTitle}</p>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-300">{t.hero.workDesc}</p>
            <a
              href={t.hero.workLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
            >
              {t.hero.workCta}
              <ArrowUpRight className="h-4 w-4" weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
