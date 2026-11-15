/**
 * La démonstration : une demande suivie de la phrase tapée jusqu'au jalon validé, en cinq étapes. La fenêtre joue
 * une suite de « temps » (BEATS) tant qu'elle est à l'écran ; cliquer une étape la rejoue et s'arrête à sa fin.
 * Avec « réduire les animations », rien ne tourne seul : chaque étape montre son dernier temps.
 * Les étapes ont la même allure que celles de la méthode sur /offres (components/BuildTimeline.tsx).
 */
import { Check, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import type { Lang } from '../i18n';
import { DEMO } from './copy';
import IdeMock, { EASE, type Scene } from './IdeMock';

type Beat = Scene & { step: number; ms: number };

const BEATS: Beat[] = [
  // 1. On décrit ce qu'on veut
  { step: 0, ms: 1100, view: 'editor', ticks: 0, prompt: 'empty', said: 0, geeko: 'coucou' },
  { step: 0, ms: 2100, view: 'editor', ticks: 0, prompt: 'typing', said: 0, geeko: 'coucou' },
  { step: 0, ms: 1500, view: 'editor', ticks: 0, prompt: 'sent', said: 0, geeko: 'menton' },
  // 2. L'IA travaille, Geeko le montre : première coche quand les tests passent
  { step: 1, ms: 1500, view: 'editor', ticks: 0, prompt: 'sent', said: 1, busy: true, geeko: 'menton' },
  { step: 1, ms: 1700, view: 'editor', ticks: 0, prompt: 'sent', said: 2, busy: true, geeko: 'livre' },
  { step: 1, ms: 3100, view: 'editor', ticks: 0, prompt: 'sent', said: 3, busy: true, code: 'typing', geeko: 'deux-doigts' },
  { step: 1, ms: 1900, view: 'editor', ticks: 1, prompt: 'sent', said: 4, code: 'there', tested: true, geeko: 'deux-doigts' },
  // 3. Une équipe d'agents prend le relais : deuxième coche quand le reçu part
  { step: 2, ms: 2600, view: 'room', ticks: 1, prompt: 'sent', said: 5, busy: true, tested: true, geeko: 'explique' },
  { step: 2, ms: 2000, view: 'room', ticks: 1, prompt: 'sent', said: 5, busy: true, tested: true, later: true, geeko: 'explique' },
  { step: 2, ms: 2000, view: 'room', ticks: 2, prompt: 'sent', said: 6, tested: true, later: true, mail: true, geeko: 'explique' },
  // 4. On vérifie : la troisième coche et la validation sont posées à la main
  { step: 3, ms: 1500, view: 'plan', ticks: 2, prompt: 'sent', said: 7, tested: true, geeko: 'pancarte' },
  { step: 3, ms: 800, view: 'plan', ticks: 2, prompt: 'sent', said: 7, tested: true, pointer: 'box', geeko: 'pancarte' },
  { step: 3, ms: 1100, view: 'plan', ticks: 3, prompt: 'sent', said: 7, tested: true, pointer: 'box', click: true, geeko: 'pancarte' },
  { step: 3, ms: 800, view: 'plan', ticks: 3, prompt: 'sent', said: 7, tested: true, pointer: 'button', geeko: 'pancarte' },
  { step: 3, ms: 700, view: 'plan', ticks: 3, prompt: 'sent', said: 7, tested: true, pointer: 'button', click: true, geeko: 'pancarte' },
  // 5. Jalon validé
  { step: 4, ms: 5200, view: 'done', ticks: 3, prompt: 'sent', said: 8, tested: true, geeko: 'confettis' },
];
const STEPS = BEATS.map((beat) => beat.step);
const stepMs = (step: number) => BEATS.reduce((sum, beat) => sum + (beat.step === step ? beat.ms : 0), 0);
/** Durée déjà jouée dans son étape quand ce temps commence. */
const msBefore = (index: number) => BEATS.slice(STEPS.indexOf(STEPS[index]), index).reduce((sum, beat) => sum + beat.ms, 0);

/** La phrase qui s'écrit lettre à lettre dans la zone de saisie. */
function useTyped(text: string, on: boolean, ms: number): string {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!on) {
      setCount(0);
      return;
    }
    const id = window.setInterval(() => setCount((n) => Math.min(text.length, n + 1)), ms / (text.length + 5));
    return () => window.clearInterval(id);
  }, [on, text, ms]);
  return text.slice(0, count);
}

const Demo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = DEMO[lang];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(0);
  // 'loop' : tout s'enchaîne ; 'step' : on va au bout de l'étape choisie ; 'off' : à l'arrêt.
  const [mode, setMode] = useState<'loop' | 'step' | 'off'>('loop');

  const scene = BEATS[beat];
  const step = scene.step;
  const endsStep = STEPS.lastIndexOf(step) === beat;
  const playing = !reduce && inView && (mode === 'loop' || (mode === 'step' && !endsStep));
  const typed = useTyped(t.prompt, scene.prompt === 'typing', scene.ms);

  // Animations réduites : la fin de l'histoire, à l'arrêt.
  useEffect(() => {
    if (reduce) {
      setMode('off');
      setBeat(BEATS.length - 1);
    }
  }, [reduce]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setBeat((b) => (b + 1) % BEATS.length), scene.ms);
    return () => window.clearTimeout(id);
  }, [playing, beat, scene.ms]);

  const pick = (wanted: number) => {
    setMode(reduce ? 'off' : 'step');
    setBeat(reduce ? STEPS.lastIndexOf(wanted) : STEPS.indexOf(wanted));
  };
  const toggle = () => setMode(mode === 'loop' ? 'off' : 'loop');
  const running = mode === 'loop';

  // La barre de l'étape avance d'un temps à l'autre.
  const total = stepMs(step);
  const from = (msBefore(beat) / total) * 100;
  const to = ((msBefore(beat) + scene.ms) / total) * 100;

  return (
    <div ref={ref} className="grid items-center gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-14">
      {/* Les étapes (grand écran) */}
      <ol className="hidden space-y-1 lg:block">
        {t.steps.map((item, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <li key={item.t}>
              <button
                type="button"
                onClick={() => pick(i)}
                aria-current={active ? 'step' : undefined}
                className={`relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-left transition-colors ${active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
              >
                <span className="flex items-start gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-xs font-semibold transition-all duration-500 ${
                      active ? 'border-brand-mint bg-brand-mint/15 text-brand-mint' : done ? 'border-transparent bg-brand-gradient text-ink' : 'border-white/15 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 pt-1">
                    <span className={`block font-display text-base font-semibold transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>{item.t}</span>
                    <span className={`grid transition-all duration-500 ${active ? 'mt-1.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <span className="overflow-hidden text-sm leading-relaxed text-slate-400">{item.d}</span>
                    </span>
                  </span>
                </span>
                {active && (
                  <span className="absolute inset-x-4 bottom-0 h-px bg-white/[0.06]" aria-hidden="true">
                    <motion.span
                      key={step}
                      className="absolute inset-y-0 left-0 bg-brand-gradient"
                      initial={{ width: `${from}%` }}
                      animate={{ width: `${playing ? to : from}%` }}
                      transition={{ duration: playing ? scene.ms / 1000 : 0, ease: 'linear' }}
                    />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="min-w-0">
        <IdeMock lang={lang} scene={scene} typed={typed} />

        <div className="mt-3 flex items-start justify-between gap-4">
          <p className="text-xs leading-relaxed text-slate-500">{t.note}</p>
          {!reduce && (
            <button
              type="button"
              onClick={toggle}
              aria-label={running ? t.pause : t.play}
              title={running ? t.pause : t.play}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-brand-mint/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Les étapes (téléphone et tablette) : un rail, et l'étape en cours */}
        <div className="mt-5 lg:hidden">
          <div className="flex items-center">
            {t.steps.map((item, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <React.Fragment key={item.t}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-label={item.t}
                    aria-current={active ? 'step' : undefined}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500 ${
                      active ? 'border-brand-mint bg-brand-mint/15 text-brand-mint' : done ? 'border-transparent bg-brand-gradient text-ink' : 'border-white/15 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </button>
                  {i < t.steps.length - 1 && (
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
          <div className="relative mt-4 min-h-[6.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="font-display text-lg font-semibold text-white">
                  <span className="mr-2 font-mono text-sm text-brand-mint">{String(step + 1).padStart(2, '0')}</span>
                  {t.steps[step].t}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t.steps[step].d}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
