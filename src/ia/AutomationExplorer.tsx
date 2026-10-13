/**
 * "What could we automate for you?": the visitor picks a department and sees, for each task,
 * how far AI can take it (automatic / you approve / AI assists) on an animated 3-segment meter.
 * Followed by an honest list of what we don't automate.
 */
import {
  ArrowRight,
  Ban,
  Calculator,
  ChartColumn,
  Headset,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import type { AiCopy, AutomationLevel } from './copy';

const DEPT_ICONS = [Calculator, Truck, Headset, TrendingUp, Users, ChartColumn];
const LEVEL_SEGMENTS: Record<AutomationLevel, number> = { auto: 3, validate: 2, assist: 1 };
const LEVEL_STYLE: Record<AutomationLevel, { text: string; fill: string; icon: React.ElementType }> = {
  auto: { text: 'text-brand-lime', fill: 'bg-brand-lime', icon: Zap },
  validate: { text: 'text-brand-mint', fill: 'bg-brand-mint', icon: UserCheck },
  assist: { text: 'text-sky-300', fill: 'bg-sky-300', icon: Users },
};
const EASE = [0.22, 1, 0.36, 1] as const;

const Meter: React.FC<{ level: AutomationLevel; delay: number; animate: boolean; small?: boolean }> = ({ level, delay, animate, small }) => {
  const filled = LEVEL_SEGMENTS[level];
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`relative overflow-hidden rounded-full bg-white/[0.08] ${small ? 'h-1.5 w-5 sm:w-6' : 'h-2 w-7 sm:w-9'}`}>
          {i < filled && (
            <motion.span
              className={`absolute inset-0 rounded-full ${LEVEL_STYLE[level].fill}`}
              initial={animate ? { scaleX: 0 } : false}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.35, delay: delay + i * 0.12, ease: EASE }}
            />
          )}
        </span>
      ))}
    </span>
  );
};

const AutomationExplorer: React.FC<{ copy: AiCopy['explorer']; onBook: () => void }> = ({ copy, onBook }) => {
  // /ia?service=2#vos-process opens on that department (links from the main page).
  const [dept, setDept] = useState(() => {
    const wanted = Number(new URLSearchParams(window.location.search).get('service'));
    return Number.isInteger(wanted) && wanted >= 0 && wanted < copy.departments.length ? wanted : 0;
  });
  const reduce = useReducedMotion();
  const animate = !reduce;
  const current = copy.departments[dept];
  const tabsRef = useRef<HTMLDivElement>(null);

  // Phones: the tab bar scrolls sideways, so keep the selected department in view
  // (horizontally only, the page itself must not jump).
  useEffect(() => {
    const bar = tabsRef.current;
    const tab = bar?.children[dept] as HTMLElement | undefined;
    if (!bar || !tab || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: animate ? 'smooth' : 'auto' });
  }, [dept, animate]);

  return (
    <div>
      {/* Legend */}
      <ul className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
        {(Object.keys(copy.levels) as AutomationLevel[]).map((level) => {
          const Icon = LEVEL_STYLE[level].icon;
          return (
            <li key={level} className="flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-4">
              <Meter level={level} delay={0} animate={false} small />
              <span className="min-w-0 sm:order-first sm:flex sm:flex-1 sm:items-center sm:gap-3">
                <Icon className={`hidden h-4 w-4 shrink-0 sm:block ${LEVEL_STYLE[level].text}`} />
                <span className="min-w-0">
                  <span className={`block text-xs font-semibold sm:text-sm ${LEVEL_STYLE[level].text}`}>{copy.levels[level].label}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-400 sm:text-xs">{copy.levels[level].desc}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        {/* Departments */}
        <div ref={tabsRef} className="ia-scroll-fade -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:[mask-image:none]" role="tablist">
          {copy.departments.map((d, i) => {
            const Icon = DEPT_ICONS[i];
            const selected = i === dept;
            return (
              <button
                key={d.name}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setDept(i)}
                className={`relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors lg:py-3.5 ${
                  selected ? 'text-white' : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="dept-highlight"
                    className="absolute inset-0 rounded-xl border border-brand-mint/40 bg-brand-mint/[0.08]"
                    transition={{ duration: animate ? 0.35 : 0, ease: EASE }}
                    aria-hidden="true"
                  />
                )}
                <Icon className={`relative h-4 w-4 shrink-0 ${selected ? 'text-brand-mint' : ''}`} />
                <span className="relative whitespace-nowrap">{d.name}</span>
                <ArrowRight className={`relative ml-auto hidden h-4 w-4 transition-opacity lg:block ${selected ? 'opacity-100 text-brand-mint' : 'opacity-0'}`} />
              </button>
            );
          })}
        </div>

        {/* Processes of the selected department */}
        <div className="card min-h-[22rem] p-2 sm:p-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={dept}
              initial={animate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-white/[0.06]"
            >
              {current.processes.map((p, i) => {
                const style = LEVEL_STYLE[p.level];
                const Icon = style.icon;
                return (
                  <motion.li
                    key={p.name}
                    initial={animate ? { opacity: 0, x: 16 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
                    className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-4 sm:py-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-white">{p.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{p.gain}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 sm:w-48 sm:flex-col sm:items-end sm:gap-2">
                      <Meter level={p.level} delay={0.15 + i * 0.08} animate={animate} />
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${style.text}`}>
                        <Icon className="h-3.5 w-3.5" /> {copy.levels[p.level].label}
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
          <div className="border-t border-white/[0.06] px-3 py-4 sm:px-4">
            <button type="button" data-booking="ia-explorer" onClick={onBook} className="btn btn-primary w-full sm:w-auto">
              {copy.cta} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Honest limits */}
      <div className="mt-10 rounded-[1.25rem] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300 ring-1 ring-white/10">
            <Ban className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold text-white">{copy.limits.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{copy.limits.subtitle}</p>
          </div>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.limits.items.map((item) => (
            <li key={item.t} className="border-l-2 border-white/10 pl-4">
              <p className="text-sm font-semibold text-white">{item.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AutomationExplorer;
