/**
 * « Derrière la coche » : ce que traverse une demande entre son envoi et sa coche. La même fiche passe de poste en
 * poste (étudier, écrire, relire, corriger, vérifier), un agent différent à chaque poste, et chaque poste montre le
 * nombre d'agents qui l'ont tenu sur le vrai projet. À la fin, c'est un pointeur humain qui coche la case.
 * Dessous : les trois chiffres du projet (125 agents, 49 aveux, 22 validations), puis le film.
 * Comme la démo : ça joue tant que c'est à l'écran ; un clic sur un poste s'y arrête ; avec « réduire les
 * animations », rien ne tourne seul et tout est montré à la fin.
 */
import { Check, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import type { Lang } from '../i18n';
import { CHAIN, CHAIN_COUNTS } from './copy';
import GeekoStage from './GeekoStage';
import { EASE } from './IdeMock';

/** Les postes, puis la coche humaine, puis la fin. */
const STAGES = [3600, 3600, 3400, 4200, 3800, 3000, 3200];
const HUMAN = 5, DONE = 6;
/** Chaque agent : une animation du vrai moteur qui dit son métier, et sa teinte (jamais le même deux fois). */
const CAST = [
  { variant: 'livre', hue: 0 },
  { variant: 'deux-doigts', hue: 52 },
  { variant: 'loupe', hue: 118 },
  { variant: 'casque', hue: 205 },
  { variant: 'ronde', hue: 292 },
];
const TOTAL = CHAIN_COUNTS.stations.reduce((sum, n) => sum + n, 0);
const CODE = [[34, 58], [18, 46, 28], [18, 37, 50], [24, 33], [14]];
const BAR_COLORS = ['#0aefbb', '#94a3b8', '#c3fb05', '#94a3b8', '#fcc200', '#b9a7ff'];

/**
 * Un nombre qui compte de 0 jusqu'à sa valeur quand `run` passe à vrai. Le reste du temps (prérendu compris), il
 * affiche sa vraie valeur.
 */
function useCount(target: number, run: boolean, instant: boolean, ms = 900): number {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (instant || !run) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setValue(Math.round(target * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run, instant, ms]);
  return value;
}

const Tick: React.FC<{ on: boolean; size?: string; label?: React.ReactNode }> = ({ on, size = 'h-6 w-6', label }) => (
  <span
    className={`relative flex ${size} shrink-0 items-center justify-center rounded-[0.4rem] border-2 transition-colors duration-300 ${on ? 'border-brand-mint bg-brand-mint text-ink' : 'border-white/20 text-slate-500'}`}
  >
    <AnimatePresence initial={false}>
      {on ? (
        <motion.span key="on" initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 18 }}>
          <Check className="h-3.5 w-3.5" strokeWidth={3.4} />
        </motion.span>
      ) : (
        label && <span className="font-mono text-[0.65rem] font-semibold">{label}</span>
      )}
    </AnimatePresence>
  </span>
);

/** La fiche : ce que chaque poste y laisse reste affiché pour les suivants. */
const Fiche: React.FC<{ lang: Lang; stage: number; still: boolean }> = ({ lang, stage, still }) => {
  const t = CHAIN[lang];
  const at = (i: number, delay = 0) => ({
    initial: still ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: EASE, delay: still ? 0 : delay + i * 0.14 },
  });
  const fixed = stage > 3;
  const ticked = stage >= HUMAN;
  return (
    <div className={`gc-fiche relative rounded-xl border p-4 transition-[border-color,box-shadow] duration-500 sm:p-5 ${ticked ? 'border-brand-mint/70 shadow-[0_0_50px_-18px_#0aefbb]' : 'border-white/10'}`}>
      <p className="font-mono text-[0.7rem] text-brand-lime">{t.request}</p>
      <div className="mt-2.5 flex items-center gap-3">
        <span className="relative">
          <Tick on={ticked} size="h-7 w-7" />
          {ticked && !still && <motion.span className="pointer-events-none absolute inset-0 rounded-full border-2 border-brand-mint" initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 3.4, opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} aria-hidden="true" />}
        </span>
        <span className={`font-display text-base font-semibold transition-colors duration-500 sm:text-lg ${ticked ? 'text-brand-mint' : 'text-white'}`}>{t.condition}</span>
        <AnimatePresence>
          {ticked && (
            <motion.span initial={still ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 20, delay: still ? 0 : 0.25 }} className="ml-auto rounded-full bg-brand-mint px-2.5 py-0.5 font-display text-xs font-semibold text-ink">
              {t.approved}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="my-4 h-px bg-white/[0.07]" />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Étudier : les notes */}
        <ul className="space-y-1.5 font-mono text-[0.72rem] leading-snug text-slate-300">
          {t.notes.map((note, i) => (
            <motion.li key={note} className="whitespace-pre" {...at(i, 0.5)}>
              {note}
            </motion.li>
          ))}
        </ul>

        {/* Écrire : le code ; relire : la ligne visée ; corriger : la ligne du test */}
        <div className={`relative min-h-[8.25rem] rounded-lg border p-3 transition-colors duration-500 ${stage >= 1 ? 'border-white/10 bg-black/30' : 'border-dashed border-white/10'}`}>
          <p className="font-mono text-[0.68rem] text-slate-400">{stage >= 1 ? 'refus.ts' : '…'}</p>
          {stage >= 1 && (
            <div className="mt-2 space-y-[0.45rem]">
              {[...CODE, ...(stage >= 3 ? [[18, 40, 22]] : [])].map((line, i) => (
                <div key={i} className="flex gap-1.5">
                  {line.map((w, j) => (
                    <motion.span
                      key={j}
                      className="block h-[0.45rem] rounded-full"
                      style={{ width: `${w}%`, background: i === CODE.length ? (j === 1 ? '#0aefbb' : '#c3fb05') : BAR_COLORS[(i + j * 2) % BAR_COLORS.length], opacity: 0.85, transformOrigin: 'left' }}
                      initial={still ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.35, ease: EASE, delay: still ? 0 : (i === CODE.length ? 0.6 : 0.3 + i * 0.32) + j * 0.08 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          {stage >= 2 && (
            <motion.span
              className={`pointer-events-none absolute inset-x-1.5 top-[3.05rem] h-[1.05rem] rounded-md border-2 transition-colors duration-500 ${fixed ? 'border-brand-mint/50' : 'border-[#ff5a5f]'}`}
              style={{ transformOrigin: 'left' }}
              initial={still ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45, ease: EASE, delay: still ? 0 : 0.7 }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Relire puis corriger : la remarque, le test qui échoue, puis qui passe ; vérifier : les trois conditions */}
      <div className="mt-4 flex min-h-[1.9rem] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {stage >= 4 && (
            <>
              {[0, 1, 2].map((i) => (
                <Verified key={i} i={i} still={still || stage > 4} />
              ))}
              <motion.span className="ml-1 font-mono text-[0.68rem] text-brand-mint" initial={still || stage > 4 ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: still || stage > 4 ? 0 : 2.3 }}>
                {t.inApp}
              </motion.span>
            </>
          )}
        </div>
        {stage >= 2 && <Verdict lang={lang} stage={stage} still={still} />}
      </div>
    </div>
  );
};

/** Une condition vérifiée au poste 5 : elle se coche un peu après la précédente. */
const Verified: React.FC<{ i: number; still: boolean }> = ({ i, still }) => {
  const [on, setOn] = useState(still);
  useEffect(() => {
    if (still) {
      setOn(true);
      return;
    }
    setOn(false);
    const id = window.setTimeout(() => setOn(true), 900 + i * 450);
    return () => window.clearTimeout(id);
  }, [i, still]);
  return <Tick on={on} size="h-[1.35rem] w-[1.35rem]" label={i + 1} />;
};

/** La remarque de la relecture ; au poste 4, le test échoue, puis passe. */
const Verdict: React.FC<{ lang: Lang; stage: number; still: boolean }> = ({ lang, stage, still }) => {
  const t = CHAIN[lang];
  const [phase, setPhase] = useState<'remark' | 'failing' | 'passing'>(stage > 3 || (still && stage >= 3) ? 'passing' : 'remark');
  useEffect(() => {
    if (stage < 3) {
      setPhase('remark');
      return;
    }
    if (stage > 3 || still) {
      setPhase('passing');
      return;
    }
    setPhase('remark');
    const a = window.setTimeout(() => setPhase('failing'), 900);
    const b = window.setTimeout(() => setPhase('passing'), 2500);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [stage, still]);
  const text = phase === 'passing' ? t.passing : phase === 'failing' ? t.failing : t.remark;
  const good = phase === 'passing';
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={phase}
        initial={still ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 480, damping: 24, delay: phase === 'remark' && stage === 2 && !still ? 0.9 : 0 }}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[0.68rem] ${good ? 'border-brand-mint/70 text-brand-mint' : 'border-[#ff5a5f] text-[#ff7a7e]'}`}
      >
        {good ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="font-bold">{phase === 'failing' ? '✗' : '!'}</span>}
        {text}
      </motion.span>
    </AnimatePresence>
  );
};

/** Le pointeur de la personne : il vient d'en bas à droite et clique sur la case. */
const Pointer: React.FC = () => (
  <motion.svg
    viewBox="0 0 26 32"
    // La pointe de la flèche se pose au milieu de la case de la fiche (son padding : p-4, puis p-5 dès sm).
    className="pointer-events-none absolute left-[1.75rem] top-[3.15rem] z-20 h-8 w-7 origin-top-left drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)] sm:left-[2rem] sm:top-[3.4rem]"
    initial={{ x: 320, y: 260, opacity: 0 }}
    animate={{ x: [320, 0, 0], y: [260, 0, 0], opacity: [0, 1, 1], scale: [1, 1, 0.82] }}
    transition={{ duration: 1.3, times: [0, 0.8, 1], ease: EASE }}
    aria-hidden="true"
  >
    <path d="M2 2 L2 26 L8.5 20 L13 30 L17.5 28 L13 18.5 L22 18.5 Z" fill="#fff" stroke="#06130f" strokeWidth={1.8} strokeLinejoin="round" />
  </motion.svg>
);

const Chain: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = CHAIN[lang];
  const ref = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const statsInView = useInView(statsRef, { amount: 0.4, once: true });
  const reduce = !!useReducedMotion();
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(true);
  // La coche humaine ne se joue qu'une fois par passage : la fiche cochée reste à l'écran pendant la fin.
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    if (reduce) {
      setRunning(false);
      setStage(DONE);
    }
  }, [reduce]);
  const playing = !reduce && inView && running;
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStage((s) => (s + 1) % STAGES.length), STAGES[stage]);
    return () => window.clearTimeout(id);
  }, [playing, stage]);
  // Au poste humain, la case se coche quand le pointeur arrive.
  useEffect(() => {
    if (stage !== HUMAN || reduce) {
      setTicking(stage > HUMAN || reduce);
      return;
    }
    setTicking(false);
    const id = window.setTimeout(() => setTicking(true), 1250);
    return () => window.clearTimeout(id);
  }, [stage, reduce]);

  const pick = (wanted: number) => {
    setRunning(false);
    setStage(wanted);
  };
  const station = Math.min(stage, 4);
  const agentShown = stage < HUMAN;
  const count = useCount(CHAIN_COUNTS.stations[station], inView && agentShown, reduce, 800);
  const ficheStage = stage === HUMAN && !ticking ? 4.5 : stage;

  const total = useCount(TOTAL, statsInView, reduce, 1400);
  const unchecked = useCount(CHAIN_COUNTS.unchecked, statsInView, reduce, 1200);
  const approvals = useCount(CHAIN_COUNTS.approvals, statsInView, reduce, 1000);

  return (
    <div>
      <div ref={ref} className="grid items-start gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-14">
        {/* Les postes (grand écran) */}
        <ol className="hidden space-y-1 lg:block">
          {[...t.stations, { name: t.human, done: '', line: '' }].map((item, i) => {
            const active = i === Math.min(stage, HUMAN);
            const done = i < stage;
            return (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-current={active ? 'step' : undefined}
                  className={`relative w-full overflow-hidden rounded-xl px-4 py-3 text-left transition-colors ${active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                >
                  <span className="flex items-start gap-4">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-xs font-semibold transition-all duration-500 ${
                        active ? 'border-brand-mint bg-brand-mint/15 text-brand-mint' : done ? 'border-transparent bg-brand-gradient text-ink' : 'border-white/15 text-slate-500'
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i < 5 ? String(i + 1).padStart(2, '0') : '✓'}
                    </span>
                    <span className="min-w-0 flex-1 pt-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={`block font-display text-base font-semibold transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>{item.name}</span>
                        {i < 5 && <span className={`font-mono text-xs transition-colors ${done || active ? 'text-brand-mint' : 'text-slate-600'}`}>{CHAIN_COUNTS.stations[i]}</span>}
                      </span>
                      {item.line && (
                        <span className={`grid transition-all duration-500 ${active ? 'mt-1.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <span className="overflow-hidden text-sm leading-relaxed text-slate-400">{item.line}</span>
                        </span>
                      )}
                    </span>
                  </span>
                  {active && playing && (
                    <span className="absolute inset-x-4 bottom-0 h-px bg-white/[0.06]" aria-hidden="true">
                      <motion.span key={stage} className="absolute inset-y-0 left-0 bg-brand-gradient" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: STAGES[stage] / 1000, ease: 'linear' }} />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        {/* Le poste : la chaîne en haut, l'agent et son chiffre, la fiche */}
        <div className="gc-chain relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c11] p-4 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.75)] sm:p-6">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(10,239,187,0.12),transparent)]" aria-hidden="true" />

          {/* La chaîne : cinq maillons, la demande avance de l'un à l'autre */}
          <div className="relative flex items-center" aria-hidden="true">
            {CAST.map((agent, i) => {
              const done = i < stage, here = i === stage;
              return (
                <React.Fragment key={agent.variant}>
                  <span
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[0.68rem] font-semibold transition-all duration-500 ${
                      here ? 'border-brand-mint bg-brand-mint/15 text-brand-mint' : done ? 'border-transparent bg-brand-gradient text-ink' : 'border-white/15 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                    {here && !reduce && <span className="absolute inset-0 animate-ping rounded-full border border-brand-mint/50" />}
                  </span>
                  {i < CAST.length - 1 && (
                    <span className="relative mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.span className="absolute inset-y-0 left-0 bg-brand-gradient" initial={false} animate={{ width: done ? '100%' : '0%' }} transition={{ duration: 0.6, ease: EASE }} />
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* L'agent du poste et ce que le vrai projet en dit ; puis la personne */}
          <div className="relative mt-5 flex min-h-[7.5rem] items-end gap-4 sm:gap-6">
            <div className="relative h-[6.75rem] w-[7.5rem] shrink-0">
              <AnimatePresence mode="popLayout" initial={false}>
                {agentShown ? (
                  <motion.div
                    key={stage}
                    className="absolute bottom-0 left-0"
                    style={{ filter: `hue-rotate(${CAST[station].hue}deg)` }}
                    initial={reduce ? false : { x: 70, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -70, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <GeekoStage lang={lang} variant={CAST[station].variant} className="gc-chain-geeko" />
                  </motion.div>
                ) : (
                  <motion.div key="human" className="absolute bottom-0 left-0" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                    <GeekoStage lang={lang} variant={stage === DONE ? 'confettis' : 'pancarte'} className="gc-chain-geeko" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="min-w-0 pb-1">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={agentShown ? station : 'human'} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
                  {agentShown ? (
                    <>
                      <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-slate-500">
                        {String(station + 1).padStart(2, '0')} · {t.stations[station].name}
                      </p>
                      <p className="mt-1 flex items-baseline gap-2.5">
                        <span className="bg-brand-gradient bg-clip-text font-display text-5xl font-semibold tabular-nums text-transparent sm:text-6xl">{count}</span>
                        <span className="text-sm leading-snug text-slate-300 sm:text-base">
                          {t.onProject}
                          <br />
                          <span className="text-slate-500">{t.stations[station].done}</span>
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                      {t.humanLead}
                      <br />
                      <span className="bg-brand-gradient bg-clip-text text-transparent">{t.humanWho}</span>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {!reduce && (
              <button
                type="button"
                onClick={() => setRunning(!running)}
                aria-label={running ? t.pause : t.play}
                title={running ? t.pause : t.play}
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-brand-mint/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint"
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* Téléphone et tablette : ce que fait le poste, en une phrase */}
          {agentShown && <p className="mt-3 text-sm leading-relaxed text-slate-400 lg:hidden">{t.stations[station].line}</p>}

          <div className="relative mt-5">
            <Fiche lang={lang} stage={ficheStage} still={reduce} />
            {stage === HUMAN && !reduce && <Pointer key={`p-${stage}`} />}
          </div>
        </div>
      </div>

      {/* Les chiffres du projet */}
      <div ref={statsRef} className="mt-14 grid gap-4 md:grid-cols-3">
        <Stat value={total} label={`${t.total.value} ${t.total.label}`} sub={t.total.sub}>
          <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-white/5">
            {CHAIN_COUNTS.stations.map((n, i) => (
              <motion.span
                key={i}
                className="h-full"
                style={{ background: '#c3fb05', filter: `hue-rotate(${CAST[i].hue}deg)` }}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: statsInView || reduce ? `${(n / TOTAL) * 100}%` : 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 * i }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[0.62rem] text-slate-500">
            {t.stations.map((s, i) => (
              <span key={s.name}>{CHAIN_COUNTS.stations[i]}</span>
            ))}
          </div>
        </Stat>
        <Stat value={unchecked} label={t.unchecked.label} sub={t.unchecked.sub}>
          <ul className="mt-5 space-y-1.5">
            {t.unchecked.lines.map((line, i) => (
              <motion.li
                key={line}
                className="border-l-2 border-[#fcc200] bg-[#fcc200]/[0.07] px-2.5 py-1 font-mono text-[0.68rem] text-[#fcc200]"
                initial={reduce ? false : { opacity: 0, x: -10 }}
                animate={statsInView || reduce ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay: 0.4 + i * 0.2 }}
              >
                {line}
              </motion.li>
            ))}
          </ul>
        </Stat>
        <Stat value={approvals} label={t.approvals.label} sub={t.approvals.sub}>
          <div className="mt-5 flex flex-wrap gap-1.5" aria-hidden="true">
            {Array.from({ length: CHAIN_COUNTS.approvals }, (_, i) => (
              <motion.span
                key={i}
                className="flex h-4 w-4 items-center justify-center rounded-[0.3rem] bg-brand-mint text-ink"
                initial={reduce ? false : { scale: 0 }}
                animate={statsInView || reduce ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.3 + i * 0.04 }}
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
              </motion.span>
            ))}
          </div>
        </Stat>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">{t.source}</p>

      {/* Le film */}
      <div className="mt-14 grid items-center gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-14">
        <div>
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{t.film.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{t.film.sub}</p>
          <p className="mt-3 text-xs text-slate-500">{t.film.note}</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_100px_-40px_rgba(0,0,0,0.75),0_0_80px_-50px_#0aefbb]">
          <video className="block aspect-video w-full" controls preload="none" playsInline poster="/images/realisations/derriere-la-coche.jpg" aria-label={t.film.title}>
            <source src="/videos/geeks-code-derriere-la-coche.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ value: number; label: string; sub: string; children?: React.ReactNode }> = ({ value, label, sub, children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
    <p className="bg-brand-gradient bg-clip-text font-display text-5xl font-semibold tabular-nums text-transparent">{value}</p>
    <p className="mt-1 font-display text-base font-semibold text-white">{label}</p>
    <p className="mt-2 text-sm leading-relaxed text-slate-400">{sub}</p>
    {children}
  </div>
);

export default Chain;
