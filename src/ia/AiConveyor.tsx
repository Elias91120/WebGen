/**
 * Hero motion piece: raw items (an invoice email, a photo of a delivery note, a customer message…)
 * travel on three lanes, cross the AI scan line and come out as finished tasks.
 *
 * The transformation is exact at the line without any JS: the same moving track is drawn twice,
 * raw faces in a pane clipped to the left half, finished faces in a pane clipped to the right half,
 * both driven by the same CSS animation. One layout serves phones and desktops.
 */
import {
  Camera,
  CircleCheck,
  FileSpreadsheet,
  Mail,
  MessageSquare,
  Phone,
  ShoppingCart,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import type { AiCopy } from './copy';

const RAW_ICONS = [Mail, Camera, MessageSquare, FileSpreadsheet, Phone, ShoppingCart];
const DURATION = 10.5; // seconds for one item to cross the whole card
const LANES = 3;

type Diagram = AiCopy['hero']['diagram'];

const RawFace: React.FC<{ item: Diagram['items'][number]; index: number }> = ({ item, index }) => {
  const Icon = RAW_ICONS[index % RAW_ICONS.length];
  return (
    <div className="flex h-full items-center gap-2 rounded-xl border border-white/10 bg-surface-2 px-3 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.9)] [transform:rotate(-1.5deg)]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 bg-white/[0.05] text-brand-lime">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-semibold text-slate-200 sm:text-[13px]">{item.raw}</span>
        <span className="mt-0.5 block truncate font-mono text-[10px] text-slate-500 sm:text-[11px]">{item.rawSub}</span>
      </span>
    </div>
  );
};

const DoneFace: React.FC<{ item: Diagram['items'][number] }> = ({ item }) => {
  const warn = item.tone === 'warn';
  const Icon = warn ? TriangleAlert : CircleCheck;
  return (
    <div
      className={`flex h-full items-center gap-2 rounded-xl border px-3 ${
        warn ? 'border-amber-300/40 bg-[#1b1708]' : 'border-brand-mint/40 bg-[#0b1a16]'
      } shadow-[0_10px_34px_-16px_rgba(10,239,187,0.55)]`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${warn ? 'bg-amber-300/15 text-amber-300' : 'bg-brand-mint/15 text-brand-mint'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-semibold text-white sm:text-[13px]">{item.done}</span>
        <span className={`mt-0.5 block truncate text-[10px] sm:text-[11px] ${warn ? 'text-amber-200/70' : 'text-brand-mint/80'}`}>{item.doneSub}</span>
      </span>
    </div>
  );
};

/** One of the two clipped copies of the moving track. */
const Track: React.FC<{ items: Diagram['items']; side: 'raw' | 'done'; animate: boolean }> = ({ items, side, animate }) => (
  <div className={`absolute inset-y-0 w-1/2 overflow-hidden ${side === 'raw' ? 'left-0' : 'right-0'}`}>
    <div className={`absolute inset-y-0 w-[200%] ${side === 'raw' ? 'left-0' : '-left-full'}`}>
      {items.map((item, i) => {
        const lane = i % LANES;
        const style: React.CSSProperties = {
          top: `calc(${lane} * (var(--lane-h) + var(--lane-gap)))`,
          height: 'var(--lane-h)',
          width: 'var(--card-w)',
        };
        if (animate) {
          style.animationDelay = `${-(i * DURATION) / items.length}s`;
          style.animationDuration = `${DURATION}s`;
        } else {
          // Static frame: three raw items waiting on the left, three finished on the right.
          style.left = i < LANES ? 'calc(25% - var(--card-w) / 2)' : 'calc(75% - var(--card-w) / 2)';
        }
        return (
          <div key={i} className={`absolute ${animate ? 'ia-travel' : ''}`} style={style} aria-hidden={side === 'raw' ? undefined : true}>
            {side === 'raw' ? <RawFace item={item} index={i} /> : <DoneFace item={item} />}
          </div>
        );
      })}
    </div>
  </div>
);

const AiConveyor: React.FC<{ diagram: Diagram }> = ({ diagram }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const animate = !reduce;
  const [step, setStep] = useState(0);

  // "Reads → Understands → Acts" in the AI badge, only while visible.
  useEffect(() => {
    if (!animate || !inView) return;
    const id = window.setInterval(() => setStep((s) => s + 1), 1400);
    return () => window.clearInterval(id);
  }, [animate, inView]);

  return (
    <div
      ref={ref}
      className={`card-featured overflow-hidden px-3 pb-4 pt-4 shadow-[0_40px_100px_-40px_rgba(10,239,187,0.45)] sm:px-5 sm:pb-5 ${inView ? '' : 'ia-paused'}`}
    >
      {/* Header: what comes in · the AI · what gets done (labels move under the conveyor on phones) */}
      <div className="flex items-center justify-center gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 sm:block">{diagram.inLabel}</span>
        <div className="relative flex items-center gap-2 justify-self-center rounded-full bg-brand-gradient py-1.5 pl-2.5 pr-3 text-ink shadow-[0_0_30px_-4px_rgba(10,239,187,0.8)]">
          <Sparkles className={`h-4 w-4 ${animate ? 'ia-spin-slow' : ''}`} />
          <span className="font-display text-xs font-semibold sm:text-sm">{diagram.core}</span>
          <span className="h-3.5 w-px bg-ink/25" aria-hidden="true" />
          <span className="relative h-4 w-[4.6rem] overflow-hidden sm:w-[5.4rem]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={step}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 font-mono text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-ink/75 sm:text-[11px]"
              >
                {diagram.coreSteps[step % diagram.coreSteps.length]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <span className="hidden text-right font-mono text-[11px] uppercase tracking-[0.16em] text-brand-mint/80 sm:block">{diagram.outLabel}</span>
      </div>

      {/* Conveyor */}
      <div
        className="ia-conveyor relative mt-4 [--card-w:60%] [--lane-gap:0.55rem] [--lane-h:3.4rem] sm:[--card-w:41%] sm:[--lane-h:4.1rem] sm:[--lane-gap:0.7rem]"
        style={{ height: `calc(${LANES} * var(--lane-h) + ${LANES - 1} * var(--lane-gap))` }}
      >
        {/* lane guides */}
        {Array.from({ length: LANES }, (_, lane) => (
          <span
            key={lane}
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
            style={{ top: `calc(${lane} * (var(--lane-h) + var(--lane-gap)) + var(--lane-h) / 2)` }}
            aria-hidden="true"
          />
        ))}

        <Track items={diagram.items} side="raw" animate={animate} />
        <Track items={diagram.items} side="done" animate={animate} />

        {/* The AI scan line */}
        <div className="pointer-events-none absolute -inset-y-2 left-1/2 w-10 -translate-x-1/2" aria-hidden="true">
          <span className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-brand-mint/15 blur-md" />
          <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-brand-lime via-brand-mint to-brand-lime shadow-[0_0_16px_2px_rgba(10,239,187,0.7)]" />
          {animate && <span className="ia-beam-spark absolute left-1/2 h-10 w-[3px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(195,251,5,0.8)]" />}
        </div>
      </div>

      <div className="mt-3 flex justify-between px-1 font-mono text-[10px] uppercase tracking-[0.14em] sm:hidden">
        <span className="text-slate-500">← {diagram.inLabel}</span>
        <span className="text-brand-mint/80">{diagram.outLabel} →</span>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400 sm:mt-4 sm:text-[13px]">{diagram.caption}</p>
    </div>
  );
};

export default AiConveyor;
