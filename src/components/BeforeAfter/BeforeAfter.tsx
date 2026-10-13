/**
 * Before/after slider for the Jellouli practice: a reconstruction of a dated hand-made site
 * (clearly labelled as such) against the real site we delivered. When it scrolls into view, a
 * light line sweeps from "before" to "after", then the handle can be dragged (mouse, touch,
 * keyboard). Desktop compares desktop screens; phones compare phone screens, where the old site
 * shows as a shrunk, non-responsive page, as such sites really did.
 */
import { ArrowRight, ArrowUpRight, Check, ChevronsLeftRight, Lock } from 'lucide-react';
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import type { AnimationPlaybackControls } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import afterDesktop from '../../assets/images/projects/jellouli.jpg';
import afterMobile from '../../assets/images/projects/jellouli-mobile.jpg';
import OldJelloulSite from './OldJelloulSite';

const DESIGN_WIDTH = 1200;
const LIVE_URL = 'https://www.amel-jellouli-elloumi.com/';

const COPY = {
  fr: {
    path: 'Avant / après',
    title: 'D’un site daté à un site qui inspire confiance.',
    speed: 'Refait en 24 h',
    text: 'Cabinet du Dr Jellouli, dermatologue à Tunis. À gauche, la reconstitution d’un site fait main il y a dix ans ; à droite, le site que nous avons livré. Faites glisser pour comparer.',
    changes: ['Bilingue français / arabe', '15 cas cliniques documentés', 'Visite vidéo du cabinet', 'Rendez-vous en un clic', 'Pensé d’abord pour mobile'],
    caseStudy: 'Voir l’étude de cas',
    live: 'Voir le site en ligne',
    before: 'Avant · reconstitution',
    after: 'Après · en ligne',
    handle: 'Comparer avant et après',
    note: 'L’« avant » est une reconstitution d’un site daté, à titre d’illustration.',
  },
  en: {
    path: 'Before / after',
    title: 'From a dated website to one that builds trust.',
    speed: 'Rebuilt in 24 h',
    text: 'Dr Jellouli’s dermatology practice in Tunis. On the left, a reconstruction of a hand-made site from ten years ago; on the right, the site we delivered. Drag to compare.',
    changes: ['Bilingual French / Arabic', '15 documented clinical cases', 'Video tour of the practice', 'One-tap booking', 'Designed mobile-first'],
    caseStudy: 'Read the case study',
    live: 'See the live site',
    before: 'Before · reconstruction',
    after: 'After · live',
    handle: 'Compare before and after',
    note: 'The “before” is a reconstruction of a dated website, for illustration.',
  },
};

/** Draws the old site at its design width and scales it to the frame. */
// Phones showed fixed-width sites at a ~980 px viewport: crop the grey margins around the 960 px page.
const PHONE_VIEWPORT = 980;
const PHONE_FRAME_MAX = 500;

const ScaledOldSite: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 0.5, shift: 0 });
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const phone = node.clientWidth < PHONE_FRAME_MAX;
      const visible = phone ? PHONE_VIEWPORT : DESIGN_WIDTH;
      setView({ scale: node.clientWidth / visible, shift: phone ? -(DESIGN_WIDTH - PHONE_VIEWPORT) / 2 : 0 });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#d9d9d9]" aria-hidden="true">
      <div style={{ width: DESIGN_WIDTH, transform: `scale(${view.scale}) translateX(${view.shift}px)`, transformOrigin: 'top left' }}>
        <OldJelloulSite lang={lang} />
      </div>
    </div>
  );
};

const Slider: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const copy = COPY[lang];
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const pos = useMotionValue(reduce ? 50 : 100); // % of the width showing "before"
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(pos, (v) => `${v}%`);
  const beforeLabel = useTransform(pos, [4, 18], [0, 1]);
  const afterLabel = useTransform(pos, [82, 96], [1, 0]);
  const [value, setValue] = useState(Math.round(pos.get()));
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const dragging = useRef(false);
  const touched = useRef(false);

  useMotionValueEvent(pos, 'change', (v) => setValue(Math.round(v)));

  // Intro: the "upgrade" sweeps across the whole site, then the handle settles in the middle.
  useEffect(() => {
    if (!inView || reduce || touched.current) return;
    let cancelled = false;
    controls.current = animate(pos, 0, { duration: 2.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] });
    controls.current.then(() => {
      if (cancelled || touched.current) return;
      controls.current = animate(pos, 50, { duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] });
    });
    return () => {
      cancelled = true;
      controls.current?.stop();
    };
  }, [inView, reduce, pos]);

  const takeOver = () => {
    touched.current = true;
    controls.current?.stop();
  };

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    pos.set(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    takeOver();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const stopDrag = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    let next: number | null = null;
    if (e.key === 'ArrowLeft') next = pos.get() - step;
    if (e.key === 'ArrowRight') next = pos.get() + step;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = 100;
    if (next === null) return;
    e.preventDefault();
    takeOver();
    pos.set(Math.min(100, Math.max(0, next)));
  };

  return (
    <div>
      {/* Browser bar (desktop) */}
      <div className="hidden items-center gap-3 rounded-t-2xl border border-b-0 border-white/10 bg-surface-2 px-4 py-2.5 sm:flex">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-slate-300">
          <Lock className="h-3 w-3 shrink-0 text-brand-mint" />
          <span className="truncate">amel-jellouli-elloumi.com</span>
        </span>
      </div>

      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        className="relative mx-auto aspect-[468/797] w-full max-w-[22rem] cursor-ew-resize select-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink shadow-[0_40px_100px_-40px_rgba(10,239,187,0.45)] [touch-action:pan-y] sm:aspect-[1200/750] sm:max-w-none sm:rounded-b-2xl sm:rounded-t-none"
      >
        {/* After: the real site */}
        <picture>
          <source media="(min-width: 640px)" srcSet={afterDesktop} />
          <img src={afterMobile} alt={copy.after} draggable={false} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
        </picture>

        {/* Before: the reconstruction, revealed left of the handle */}
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <ScaledOldSite lang={lang} />
        </motion.div>

        {/* Labels */}
        <motion.span style={{ opacity: beforeLabel }} className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-200 backdrop-blur sm:text-[11px]">
          {copy.before}
        </motion.span>
        <motion.span style={{ opacity: afterLabel }} className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-brand-mint/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink sm:text-[11px]">
          {copy.after}
        </motion.span>

        {/* Handle */}
        <motion.div style={{ left }} className="absolute inset-y-0 w-0">
          <span className="pointer-events-none absolute inset-y-0 -left-4 w-8 bg-brand-mint/20 blur-md" aria-hidden="true" />
          <span className="pointer-events-none absolute inset-y-0 -left-px w-[2px] bg-gradient-to-b from-brand-lime via-brand-mint to-brand-lime shadow-[0_0_14px_2px_rgba(10,239,187,0.75)]" aria-hidden="true" />
          <button
            type="button"
            role="slider"
            aria-label={copy.handle}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            onKeyDown={onKeyDown}
            className="absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient text-ink shadow-[0_0_30px_-4px_rgba(10,239,187,0.9)] outline-none ring-4 ring-ink/40 focus-visible:ring-white"
          >
            <ChevronsLeftRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

const BeforeAfter: React.FC<{ lang: 'fr' | 'en'; onOpenCase?: () => void }> = ({ lang, onOpenCase }) => {
  const copy = COPY[lang];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
      <div>
        <span className="eyebrow">{copy.path}</span>
        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-white md:text-4xl">{copy.title}</h3>
        <span className="mt-4 inline-flex items-center rounded-full bg-brand-lime/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-lime">
          {copy.speed}
        </span>
        <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">{copy.text}</p>
        <ul className="mt-6 space-y-2.5">
          {copy.changes.map((c) => (
            <li key={c} className="flex items-start gap-3 text-sm text-slate-200">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          {onOpenCase && (
            <button type="button" onClick={onOpenCase} className="btn btn-primary">
              {copy.caseStudy} <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
            {copy.live} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="order-first lg:order-none">
        <Slider lang={lang} />
        <p className="mt-3 text-center text-xs text-slate-500">{copy.note}</p>
      </div>
    </div>
  );
};

export default BeforeAfter;
