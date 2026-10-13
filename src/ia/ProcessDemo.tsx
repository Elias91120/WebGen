/**
 * Animated walkthrough of one automated process: something arrives (email, photo, message,
 * schedule), the AI reads it, the extracted fields appear, each step of the pipeline lights up,
 * then the before/after result shows. Plays while visible, then moves to the next scenario
 * until the visitor picks one. With reduced motion, every scenario is shown completed.
 */
import {
  Camera,
  Check,
  CircleCheck,
  Clock,
  Database,
  FileSpreadsheet,
  Mail,
  MessageSquare,
  Paperclip,
  RotateCcw,
  ScanLine,
  TriangleAlert,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import type { AiCopy, DemoScenario } from './copy';

const TICK_MS = 1150;
const HOLD_TICKS = 4; // pause on the result before the next scenario
const TAB_ICONS = [Mail, Camera, MessageSquare, Clock];
const EASE = [0.22, 1, 0.36, 1] as const;

/** The incoming item, drawn like the real thing (email, photo of a paper, chat, schedule). */
const Trigger: React.FC<{ trigger: DemoScenario['trigger']; scanning: boolean }> = ({ trigger, scanning }) => {
  const body = (() => {
    switch (trigger.kind) {
      case 'email':
        return (
          <>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="h-3.5 w-3.5 text-brand-lime" />
              <span className="truncate">{trigger.line1}</span>
            </div>
            <p className="mt-2 font-display text-sm font-semibold text-white">{trigger.line2}</p>
            <div className="mt-3 hidden space-y-1.5 sm:block" aria-hidden="true">
              <div className="h-1.5 w-11/12 rounded bg-white/10" />
              <div className="h-1.5 w-8/12 rounded bg-white/10" />
            </div>
            {trigger.attachment && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs text-slate-200">
                <Paperclip className="h-3.5 w-3.5 text-brand-mint" /> {trigger.attachment}
              </div>
            )}
          </>
        );
      case 'photo':
        return (
          <>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Camera className="h-3.5 w-3.5 text-brand-lime" /> {trigger.line1}
            </div>
            {/* A slightly tilted sheet of paper */}
            <div className="mx-auto mt-3 w-[85%] -rotate-2 rounded-md bg-slate-100 p-3 shadow-lg" aria-hidden="true">
              <p className="font-mono text-[10px] font-semibold text-slate-700">{trigger.line2}</p>
              <div className="mt-2 space-y-1">
                {[90, 70, 80, 60].map((wd, i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <div className="h-1.5 rounded bg-slate-300" style={{ width: `${wd}%` }} />
                    <div className="h-1.5 w-4 rounded bg-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'message':
        return (
          <>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MessageSquare className="h-3.5 w-3.5 text-brand-lime" /> {trigger.line1}
            </div>
            <div className="mt-3 max-w-[90%] rounded-2xl rounded-tl-sm bg-white/[0.07] px-3.5 py-2.5 text-sm text-slate-100">{trigger.line2}</div>
          </>
        );
      case 'schedule':
        return (
          <>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5 text-brand-lime" /> {trigger.line1}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[Database, Database, FileSpreadsheet].map((Icon, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs text-slate-200">
                  <Icon className="h-3.5 w-3.5 text-brand-mint" /> {trigger.line2.split(' · ')[i]}
                </span>
              ))}
            </div>
          </>
        );
    }
  })();

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink/70 p-4">
      {body}
      {scanning && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-brand-mint/25 to-transparent"
          initial={{ top: '-30%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

/** Phones: the pipeline as a horizontal progress rail with the running step spelled out below. */
const MobileStepper: React.FC<{ steps: string[]; active: number; finished: boolean }> = ({ steps, active, finished }) => {
  const current = finished ? steps.length - 1 : Math.max(0, active);
  return (
    <div className="rounded-xl border border-white/10 bg-ink/50 p-4 lg:hidden">
      <div className="flex items-center">
        {steps.map((s, i) => {
          const done = i < active || finished;
          const running = i === active && !finished;
          return (
            <React.Fragment key={s}>
              <span
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-500 ${
                  done
                    ? 'border-transparent bg-brand-gradient text-ink'
                    : running
                      ? 'border-brand-mint bg-brand-mint/15 text-brand-mint shadow-[0_0_18px_-2px_rgba(10,239,187,0.8)]'
                      : 'border-white/15 text-slate-500'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                {running && <span className="absolute inset-0 animate-ping rounded-full border border-brand-mint/60" aria-hidden="true" />}
              </span>
              {i < steps.length - 1 && (
                <span className="relative mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-brand-gradient"
                    initial={false}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="relative mt-3 h-10 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={current}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-x-0 text-sm font-semibold leading-snug text-white"
          >
            <span className="mr-1.5 font-mono text-xs text-brand-mint">{String(current + 1).padStart(2, '0')}</span>
            {steps[current]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProcessDemo: React.FC<{ copy: AiCopy['demo'] }> = ({ copy }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const scenario = copy.scenarios[index];
  const lastStage = scenario.steps.length + 1; // 0 = arrival, 1..n = steps, n+1 = result
  const stage = reduce ? lastStage : Math.min(tick, lastStage);
  const active = stage - 1; // index of the running step
  const showResult = stage >= lastStage;
  const visibleFields = reduce ? scenario.fields.length : active >= 1 ? Math.min(scenario.fields.length, active * 2) : 0;
  const checked = reduce || active >= 2;

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduce, inView]);

  // After the hold on the result: next scenario (autoplay) or stop there.
  useEffect(() => {
    if (tick < lastStage + HOLD_TICKS || !autoplay) return;
    setIndex((i) => (i + 1) % copy.scenarios.length);
    setTick(0);
  }, [tick, lastStage, autoplay, copy.scenarios.length]);

  const pick = (i: number) => {
    setAutoplay(false);
    setIndex(i);
    setTick(0);
  };

  const progress = reduce ? 1 : Math.min(1, tick / (lastStage + (autoplay ? HOLD_TICKS : 0)));

  return (
    <div ref={ref}>
      {/* Scenario tabs, with a progress fill on the playing one */}
      <div className="ia-scroll-fade -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
        {copy.scenarios.map((s, i) => {
          const Icon = TAB_ICONS[i];
          const selected = i === index;
          return (
            <button
              key={s.tab}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => pick(i)}
              className={`relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                selected ? 'border-brand-mint/50 bg-brand-mint/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              {selected && (
                <span
                  className="absolute inset-y-0 left-0 bg-brand-mint/15 transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progress * 100}%` }}
                  aria-hidden="true"
                />
              )}
              <Icon className={`relative h-4 w-4 ${selected ? 'text-brand-mint' : ''}`} />
              <span className="relative">{s.tab}</span>
            </button>
          );
        })}
      </div>

      <div className="card-featured mt-5 p-4 sm:p-6 md:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{copy.badge}</span>
          {!reduce && (
            <button
              type="button"
              onClick={() => setTick(0)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {copy.replay}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10"
          >
            {/* Left: what comes in, and what the AI understood */}
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.incoming}</p>
                <Trigger trigger={scenario.trigger} scanning={!reduce && active === 1} />
              </div>

              <MobileStepper steps={scenario.steps} active={active} finished={showResult} />

              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <ScanLine className="h-3.5 w-3.5 text-brand-mint" /> {copy.extracted}
                </p>
                <dl className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/10 bg-ink/50">
                  {scenario.fields.map((f, i) => {
                    const shown = i < visibleFields;
                    return (
                      <div key={f.k} className="flex min-h-[2.75rem] items-center justify-between gap-3 px-4 py-2.5 text-sm">
                        <dt className="text-slate-500">{f.k}</dt>
                        <dd className="text-right">
                          {shown ? (
                            <motion.span
                              initial={{ opacity: 0, x: 8, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                              transition={{ duration: 0.4, delay: (i % 2) * 0.25, ease: EASE }}
                              className={`inline-flex items-center gap-1.5 font-medium ${
                                checked && f.status === 'warn' ? 'text-amber-300' : checked && f.status === 'ok' ? 'text-brand-mint' : 'text-white'
                              }`}
                            >
                              {checked && f.status === 'ok' && <CircleCheck className="h-4 w-4" />}
                              {checked && f.status === 'warn' && <TriangleAlert className="h-4 w-4" />}
                              {f.v}
                            </motion.span>
                          ) : (
                            <span className="inline-block h-2 w-20 animate-pulse rounded bg-white/[0.07]" aria-hidden="true" />
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>

            {/* Right: the pipeline lighting up, then the result */}
            <div>
              <p className="mb-2 hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 lg:block">{copy.pipeline}</p>
              <ol className="relative hidden lg:block">
                {scenario.steps.map((label, i) => {
                  const done = i < active || showResult;
                  const running = i === active && !showResult;
                  const last = i === scenario.steps.length - 1;
                  return (
                    <li key={label} className="relative flex gap-4 pb-5 last:pb-0">
                      {!last && (
                        <span className="absolute left-[1.05rem] top-9 h-[calc(100%-2.25rem)] w-px bg-white/10" aria-hidden="true">
                          <motion.span
                            className="absolute inset-x-0 top-0 bg-brand-gradient"
                            initial={false}
                            animate={{ height: done ? '100%' : '0%' }}
                            transition={{ duration: 0.6, ease: EASE }}
                          />
                        </span>
                      )}
                      <span
                        className={`relative flex h-[2.1rem] w-[2.1rem] shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500 ${
                          done
                            ? 'border-transparent bg-brand-gradient text-ink'
                            : running
                              ? 'border-brand-mint bg-brand-mint/15 text-brand-mint shadow-[0_0_24px_-2px_rgba(10,239,187,0.7)]'
                              : 'border-white/15 bg-ink text-slate-500'
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                        {running && <span className="absolute inset-0 animate-ping rounded-full border border-brand-mint/60" aria-hidden="true" />}
                      </span>
                      <span
                        className={`pt-1.5 text-sm leading-snug transition-colors duration-500 md:text-[15px] ${
                          done || running ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="min-h-[9.5rem] lg:mt-6">
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="rounded-xl border border-brand-mint/30 bg-brand-mint/[0.07] p-4"
                    >
                      <p className="flex items-start gap-2.5 text-sm font-semibold text-white md:text-base">
                        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" /> {scenario.result}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-white/[0.07] bg-ink/40 px-3 py-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{copy.before}</p>
                          <p className="mt-1 text-sm text-slate-400 line-through decoration-slate-600">{scenario.before}</p>
                        </div>
                        <div className="rounded-lg border border-brand-mint/30 bg-ink/40 px-3 py-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-mint">{copy.after}</p>
                          <p className="mt-1 text-sm font-semibold text-white">{scenario.after}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessDemo;
