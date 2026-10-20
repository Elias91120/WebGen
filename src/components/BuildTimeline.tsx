/**
 * "Process" section as a motion piece: the five steps play in turn while a browser window
 * builds the site — the brief, a wireframe, the finished design with a connected form,
 * the go-live (lock, "Live" badge, a quote request arriving) and the improvements.
 * Plays while visible; a click on a step stops the autoplay there. Reduced motion: static.
 */
import { Check, ChartColumn, CircleCheck, Globe, Inbox, Lock, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

const STEP_MS = 3400;
const EASE = [0.22, 1, 0.36, 1] as const;

interface Mock {
  url: string;
  draft: string;
  live: string;
  briefTitle: string;
  brief: string[];
  form: string;
  toast: string;
  toastSub: string;
  improve: string;
}

interface BuildTimelineProps {
  steps: Array<{ t: string; d: string }>;
  mock: Mock;
}

/** A layout block: dashed outline in the wireframe, filled once built. */
const Block: React.FC<{ built: boolean; fill: string; className?: string; children?: React.ReactNode }> = ({ built, fill, className = '', children }) => (
  <div
    className={`rounded-md transition-all duration-700 ease-out ${
      built ? `border border-transparent ${fill}` : 'border border-dashed border-white/25 bg-transparent'
    } ${className}`}
  >
    {children}
  </div>
);

const BrowserMock: React.FC<{ stage: number; mock: Mock }> = ({ stage, mock }) => {
  const live = stage >= 3;
  const built = stage >= 2;
  const showPage = stage >= 1;

  return (
    <div className="card-featured overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] bg-ink/60 px-3 py-2.5 sm:px-4">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] text-slate-400 sm:text-xs">
          {live ? <Lock className="h-3 w-3 shrink-0 text-brand-mint" /> : <Globe className="h-3 w-3 shrink-0" />}
          <span className={`truncate transition-colors duration-500 ${live ? 'text-slate-200' : ''}`}>{mock.url}</span>
        </span>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-500 sm:text-[11px] ${
            live ? 'bg-brand-mint/15 text-brand-mint' : 'bg-white/[0.06] text-slate-500'
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-mint opacity-70" />}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? 'bg-brand-mint' : 'bg-slate-500'}`} />
          </span>
          {live ? mock.live : mock.draft}
        </span>
      </div>

      {/* Page */}
      <div className="relative overflow-hidden bg-[#0b0d12] p-4 sm:p-6">
        <div className={`transition-all duration-700 ${showPage ? 'opacity-100' : 'opacity-0 blur-sm'}`} aria-hidden="true">
          {/* nav */}
          <div className="flex items-center gap-3">
            <Block built={built} fill="bg-brand-gradient" className="h-3 w-12 sm:w-14" />
            <span className="flex-1" />
            {[0, 1, 2].map((i) => (
              <Block key={i} built={built} fill="bg-white/20" className="hidden h-2 w-8 sm:block" />
            ))}
            <Block built={built} fill="bg-white/90" className="h-5 w-14" />
          </div>
          {/* hero */}
          <div className="mt-5 space-y-2 sm:mt-7">
            <Block built={built} fill="bg-white" className="h-3.5 w-4/5 sm:h-4" />
            <Block built={built} fill="bg-brand-gradient" className="h-3.5 w-3/5 sm:h-4" />
            <Block built={built} fill="bg-white/25" className="!mt-3.5 h-2 w-2/3" />
            <Block built={built} fill="bg-white/25" className="h-2 w-1/2" />
          </div>
          <div className="relative mt-4 inline-block">
            <Block built={built} fill="bg-brand-gradient shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]" className="h-7 w-24 sm:w-28" />
            <AnimatePresence>
              {stage === 2 && (
                <motion.span
                  initial={{ opacity: 0, x: -8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: 0.6, ease: EASE }}
                  className="absolute left-full top-1/2 ml-3 inline-flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-brand-mint/40 bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-brand-mint shadow-lg sm:text-xs"
                >
                  <CircleCheck className="h-3.5 w-3.5" /> {mock.form}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {/* cards */}
          <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
            {[0, 1, 2].map((i) => (
              <Block key={i} built={built} fill="bg-white/[0.05] border-white/10" className="flex h-14 flex-col justify-center gap-1.5 px-2 sm:h-16 sm:px-3">
                <span className={`h-4 w-4 rounded-full transition-colors duration-700 ${built ? 'bg-brand-mint/30' : 'border border-dashed border-white/25'}`} />
                <span className={`h-1.5 w-4/5 rounded transition-colors duration-700 ${built ? 'bg-white/30' : 'bg-white/10'}`} />
              </Block>
            ))}
          </div>
          {/* contact form (larger screens) */}
          <div className="mt-5 hidden grid-cols-[2fr_3fr] items-center gap-4 sm:grid">
            <div className="space-y-2">
              <Block built={built} fill="bg-white/80" className="h-3 w-3/4" />
              <Block built={built} fill="bg-white/20" className="h-2 w-full" />
              <Block built={built} fill="bg-white/20" className="h-2 w-2/3" />
            </div>
            <Block built={built} fill="bg-white/[0.04] border-white/10" className="space-y-2 p-3">
              <div className="grid grid-cols-2 gap-2">
                <span className={`h-6 rounded transition-colors duration-700 ${built ? 'bg-white/[0.07]' : 'border border-dashed border-white/20'}`} />
                <span className={`h-6 rounded transition-colors duration-700 ${built ? 'bg-white/[0.07]' : 'border border-dashed border-white/20'}`} />
              </div>
              <span className={`block h-6 rounded transition-colors duration-700 ${built ? 'bg-white/[0.07]' : 'border border-dashed border-white/20'}`} />
              <span className={`ml-auto block h-6 w-20 rounded transition-all duration-700 ${built ? 'bg-brand-gradient' : 'border border-dashed border-white/25'}`} />
            </Block>
          </div>
        </div>

        {/* Overlays per step */}
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="brief"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xs rounded-xl border border-white/10 bg-surface-2 p-4 shadow-2xl">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-mint">
                  <Sparkles className="h-3.5 w-3.5" /> {mock.briefTitle}
                </p>
                <ul className="mt-3 space-y-2">
                  {mock.brief.map((line, i) => (
                    <motion.li
                      key={line}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.45, ease: EASE }}
                      className="flex items-start gap-2 text-[13px] text-slate-200"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-lime" strokeWidth={3} /> {line}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
          {stage === 3 && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              className="absolute right-3 top-3 flex max-w-[78%] items-center gap-2.5 rounded-xl border border-white/10 bg-surface-2/95 p-2.5 shadow-2xl backdrop-blur sm:right-4 sm:top-4 sm:p-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-ink">
                <Inbox className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-white sm:text-[13px]">{mock.toast}</span>
                <span className="block truncate text-[10px] text-slate-400 sm:text-[11px]">{mock.toastSub}</span>
              </span>
            </motion.div>
          )}
          {stage === 4 && (
            <motion.div
              key="improve"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute bottom-3 right-3 w-[58%] rounded-xl border border-white/10 bg-surface-2/95 p-3 shadow-2xl backdrop-blur sm:bottom-4 sm:right-4 sm:w-[46%]"
            >
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 sm:text-xs">
                <ChartColumn className="h-3.5 w-3.5 text-brand-mint" /> {mock.improve}
              </p>
              <div className="mt-2.5 flex h-12 items-end gap-1.5 sm:h-14" aria-hidden="true">
                {[30, 38, 34, 52, 61, 74, 88].map((h, i) => (
                  <motion.span
                    key={i}
                    className={`flex-1 rounded-t ${i >= 4 ? 'bg-brand-gradient' : 'bg-white/15'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.09, ease: EASE }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const BuildTimeline: React.FC<BuildTimelineProps> = ({ steps, mock }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const playing = autoplay && !reduce && inView;

  // Reduced motion: show the site live, no autoplay.
  useEffect(() => {
    if (reduce) {
      setAutoplay(false);
      setStage(3);
    }
  }, [reduce]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStage((s) => (s + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, stage, steps.length]);

  const pick = (i: number) => {
    setAutoplay(false);
    setStage(i);
  };

  return (
    <div ref={ref} className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      {/* Steps (desktop list) */}
      <ol className="hidden space-y-1 lg:block">
        {steps.map((step, i) => {
          const active = i === stage;
          const done = i < stage;
          return (
            <li key={step.t}>
              <button
                type="button"
                onClick={() => pick(i)}
                aria-current={active ? 'step' : undefined}
                className={`relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-left transition-colors ${active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
              >
                <span className="flex items-start gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-xs font-semibold transition-all duration-500 ${
                      active
                        ? 'border-brand-mint bg-brand-mint/15 text-brand-mint'
                        : done
                          ? 'border-transparent bg-brand-gradient text-ink'
                          : 'border-white/15 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 pt-1">
                    <span className={`block font-display text-base font-semibold transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>{step.t}</span>
                    <span
                      className={`grid transition-all duration-500 ${active ? 'mt-1.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <span className="overflow-hidden text-sm leading-relaxed text-slate-400">{step.d}</span>
                    </span>
                  </span>
                </span>
                {active && (
                  <span className="absolute inset-x-4 bottom-0 h-px bg-white/[0.06]" aria-hidden="true">
                    <motion.span
                      key={`${stage}-${playing}`}
                      className="absolute inset-y-0 left-0 bg-brand-gradient"
                      initial={{ width: playing ? '0%' : '100%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: playing ? STEP_MS / 1000 : 0, ease: 'linear' }}
                    />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div>
        <BrowserMock stage={stage} mock={mock} />

        {/* Steps (phones and tablets): progress rail + the current step */}
        <div className="mt-5 lg:hidden">
          <div className="flex items-center">
            {steps.map((step, i) => {
              const active = i === stage;
              const done = i < stage;
              return (
                <React.Fragment key={step.t}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-label={step.t}
                    aria-current={active ? 'step' : undefined}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500 ${
                      active
                        ? 'border-brand-mint bg-brand-mint/15 text-brand-mint'
                        : done
                          ? 'border-transparent bg-brand-gradient text-ink'
                          : 'border-white/15 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </button>
                  {i < steps.length - 1 && (
                    <span className="relative mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                      <motion.span
                        className="absolute inset-y-0 left-0 bg-brand-gradient"
                        initial={false}
                        animate={{ width: done ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="relative mt-4 min-h-[5.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="font-display text-lg font-semibold text-white">
                  <span className="mr-2 font-mono text-sm text-brand-mint">{String(stage + 1).padStart(2, '0')}</span>
                  {steps[stage].t}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{steps[stage].d}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildTimeline;
