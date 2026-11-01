/**
 * Geeko, la mascotte, posé dans une page. C'est du décor : ignoré par les lecteurs d'écran et absent avec
 * « réduire les animations ». Son moteur (src/geeko/geeko.ts) ne se charge que lorsqu'il arrive à l'écran.
 * Il bouge 8 s puis se fige (au repos, il ne coûte presque rien), repart au survol et quand il revient à l'écran,
 * et un seul bouge à la fois. Le placement est en CSS (index.css), en unités de son dessin : --gk-u.
 */
import React, { useEffect, useRef } from 'react';

import type { GeekoHandle } from '../geeko/geeko';
import type { Lang } from '../i18n';

export const GEEKO_PORTRAIT = '/images/geeko/portrait.svg';

const MOVES_MS = 8000;

// Le moteur est écrit pour l'équipe : ses bulles sont en français, tutoient et sont illisibles à ces tailles.
// Sur le site, seule la pancarte garde un texte dans le dessin ; les autres passent par une bulle HTML.
const SIGN: Record<Lang, string> = { fr: 'UN APPEL ?', en: 'A CALL?' };
const EGG_BUBBLE: Record<string, Record<Lang, string>> = {
  chatouille: { fr: 'Hihi, ça chatouille !', en: 'Hehe, that tickles!' },
  tourne: { fr: 'Ça tourne…', en: 'So dizzy…' },
  legende: { fr: 'Mode légende', en: 'Legend mode' },
};

// Celui qui bouge en ce moment : le suivant le fige.
let freezeCurrent: (() => void) | null = null;

/** Une taille selon la largeur de l'écran. */
export const sizeFrom = (minWidth: number, large: number, small: number) => () =>
  window.matchMedia(`(min-width: ${minWidth}px)`).matches ? large : small;

interface GeekoProps {
  lang: Lang;
  /** Une variante du moteur (LIBRARY) : changer de valeur change de scène, avec ses transitions. */
  variant: string;
  /** 1 = 80 × 72 px. Une fonction lit la taille au montage. */
  size: number | ((host: HTMLElement) => number);
  className?: string;
  /** Attend avant d'arriver (ms), pour laisser passer l'animation du titre. */
  delay?: number;
  /** Bulle dite à l'arrivée. */
  bubble?: string;
  eggs?: boolean;
  /** Ne vient pas si son corps sortirait de l'écran à droite (titre qui remplit sa ligne). */
  onlyIfFits?: boolean;
}

const Geeko: React.FC<GeekoProps> = ({ lang, variant, size, className = '', delay = 0, bubble, eggs = true, onlyIfFits = false }) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const handle = useRef<GeekoHandle | null>(null);
  const latest = useRef({ variant, size });
  latest.current = { variant, size };

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let visible = false;
    let waited = delay === 0;
    let moveTimer = 0;
    let delayTimer = 0;

    const say = (text: string | undefined) => {
      delete host.dataset.say;
      // (retirée puis remise d'une image à l'autre : la bulle rejoue son apparition)
      if (text) window.requestAnimationFrame(() => { host.dataset.say = text; });
    };
    const freeze = () => { host.dataset.frozen = ''; };
    const wake = () => {
      if (!handle.current) return;
      delete host.dataset.frozen;
      if (freezeCurrent !== freeze) freezeCurrent?.();
      freezeCurrent = freeze;
      window.clearTimeout(moveTimer);
      moveTimer = window.setTimeout(freeze, MOVES_MS);
    };
    const hide = () => {
      window.clearTimeout(moveTimer);
      handle.current?.dispose();
      handle.current = null;
      if (freezeCurrent === freeze) freezeCurrent = null;
    };
    const show = async () => {
      let engine: typeof import('../geeko/geeko');
      try {
        engine = await import('../geeko/geeko');
      } catch {
        return; // du décor : sans lui, la page reste entière
      }
      if (!visible || handle.current) return;
      const wanted = latest.current.size;
      const px = typeof wanted === 'function' ? wanted(host) : wanted;
      host.style.setProperty('--gk-u', `${px}px`);
      if (onlyIfFits && host.getBoundingClientRect().left + 64 * px > document.documentElement.clientWidth - 4) return;
      handle.current = engine.createGeeko(document, {
        variant: latest.current.variant,
        size: px,
        stage: false,
        eggs,
        reduceMotion: false,
        say: (text) => (text === 'TON OK ?' ? SIGN[lang] : null),
        onChange: (info) => {
          wake();
          if (info.egg && EGG_BUBBLE[info.egg]) say(EGG_BUBBLE[info.egg][lang]);
        },
      });
      host.appendChild(handle.current.element);
      wake();
      say(bubble);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        window.clearTimeout(delayTimer);
        if (!visible) {
          hide();
        } else if (waited) {
          void show();
        } else {
          delayTimer = window.setTimeout(() => { waited = true; void show(); }, delay);
        }
      },
      { rootMargin: '80px' },
    );
    observer.observe(host);
    host.addEventListener('pointerenter', wake);
    return () => {
      visible = false;
      observer.disconnect();
      host.removeEventListener('pointerenter', wake);
      window.clearTimeout(delayTimer);
      hide();
      delete host.dataset.say;
    };
  }, [lang, delay, bubble, eggs, onlyIfFits]);

  useEffect(() => {
    handle.current?.setVariant(variant);
  }, [variant]);

  return <span ref={hostRef} className={`geeko ${className}`} aria-hidden="true" />;
};

export default Geeko;
