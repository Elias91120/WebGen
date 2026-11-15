/**
 * Geeko en vedette sur la page Geeks Code. Ici il est le sujet de la page, pas du décor comme ailleurs sur le site
 * (components/Geeko.tsx, qui se fige après 8 s) : il vit tant qu'il est à l'écran et s'en va dès qu'il en sort.
 * Sa taille vient du CSS (--gk-u, une unité de son dessin) : elle suit la largeur de l'écran sans JavaScript.
 * Avec « réduire les animations », son portrait fixe le remplace, sauf si la personne demande à le voir bouger.
 */
import React, { useEffect, useReducer, useRef } from 'react';

import { GEEKO_PORTRAIT } from '../components/Geeko';
import type { GeekoEgg, GeekoHandle, GeekoInfo, GeekoIntensity, GeekoPalette } from '../geeko/geeko';
import type { Lang } from '../i18n';

// Le moteur est écrit pour l'équipe (il tutoie) : seule la pancarte garde un texte, comme ailleurs sur le site.
const SIGN: Record<Lang, string> = { fr: 'VOTRE OK ?', en: 'YOUR OK?' };
// Ces surprises-là ne rendent pas la main toutes seules.
const STAYS: GeekoEgg[] = ['nuit', 'vendredi', 'pizza'];

interface GeekoStageProps {
  lang: Lang;
  /** Une variante de la bibliothèque du moteur (LIBRARY). */
  variant: string;
  /** Son décor (serveurs, tableau, globe…) : sa place fait alors 116 × 88 unités au lieu de 80 × 72. */
  decor?: boolean;
  palette?: GeekoPalette;
  intensity?: GeekoIntensity;
  /** Une surprise à jouer ; changer `at` la rejoue. */
  egg?: { name: GeekoEgg; at: number };
  /** À changer pour rejouer la variante demandée, même si c'est déjà elle (après une surprise). */
  again?: number;
  /** Ses secrets au clic et au clavier. */
  secrets?: boolean;
  /** Bouge même avec « réduire les animations » : la personne l'a demandé. */
  force?: boolean;
  className?: string;
  onInfo?: (info: GeekoInfo) => void;
  onLive?: (live: boolean) => void;
}

const GeekoStage: React.FC<GeekoStageProps> = ({
  lang,
  variant,
  decor = false,
  palette = 'normal',
  intensity = 'normal',
  egg,
  again = 0,
  secrets = false,
  force = false,
  className = '',
  onInfo,
  onLive,
}) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const handle = useRef<GeekoHandle | null>(null);
  const latest = useRef({ variant, palette, intensity, onInfo, onLive });
  latest.current = { variant, palette, intensity, onInfo, onLive };
  // La variante que le moteur tient, et s'il est resté sur une surprise.
  const pinned = useRef(variant);
  const stuck = useRef(false);
  const [round, restart] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || (!force && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;

    let visible = false;
    let over = false;
    const unit = () => host.getBoundingClientRect().width / (decor ? 116 : 80);
    const leave = () => {
      if (!handle.current) return;
      handle.current.dispose();
      handle.current = null;
      delete host.dataset.live;
      latest.current.onLive?.(false);
    };
    const arrive = async () => {
      let engine: typeof import('../geeko/geeko');
      try {
        engine = await import('../geeko/geeko');
      } catch {
        return; // sans lui, la page reste entière
      }
      // Tant que les feuilles de style arrivent, Safari n'applique pas celles qui suivent : une taille lue trop tôt serait fausse.
      if (document.readyState !== 'complete') await new Promise((done) => window.addEventListener('load', done, { once: true }));
      if (over || !visible || handle.current) return;
      const want = latest.current;
      const geeko = engine.createGeeko(document, {
        variant: want.variant,
        size: unit(),
        stage: decor,
        eggs: secrets,
        reduceMotion: false,
        palette: want.palette,
        intensity: want.intensity,
        say: (text) => (text === 'TON OK ?' ? SIGN[lang] : null),
        onChange: (info) => latest.current.onInfo?.(info),
      });
      handle.current = geeko;
      pinned.current = want.variant;
      stuck.current = false;
      host.appendChild(geeko.element);
      host.dataset.live = '';
      want.onLive?.(true);
    };

    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) void arrive();
        else leave();
      },
      { rootMargin: '120px' },
    );
    seen.observe(host);

    // Sa place change de taille avec l'écran (c'est le CSS qui décide) : il suit.
    let size = unit();
    const resized = new ResizeObserver(() => {
      const next = unit();
      if (handle.current && Math.abs(next - size) > 0.01) handle.current.setSize(next);
      size = next;
    });
    resized.observe(host);

    return () => {
      over = true;
      seen.disconnect();
      resized.disconnect();
      leave();
    };
  }, [lang, decor, secrets, force, round]);

  // Une autre variante ou un autre rythme : le moteur enchaîne avec ses transitions (il sort son PC, le range…).
  useEffect(() => {
    const geeko = handle.current;
    if (!geeko) return;
    // Resté sur une surprise, le moteur ne sait pas rejouer la variante qu'il tient déjà : on repart de zéro.
    if (stuck.current && variant === pinned.current) {
      restart();
      return;
    }
    stuck.current = false;
    const info = geeko.info;
    if (info && info.intensity !== intensity) geeko.setActivity(info.activity, intensity);
    geeko.setVariant(variant);
    pinned.current = variant;
  }, [variant, intensity, again]);

  const eggAt = egg?.at;
  useEffect(() => {
    if (!egg || !handle.current) return;
    handle.current.egg(egg.name);
    stuck.current = STAYS.includes(egg.name);
    // (seul `at` compte : le même nom se rejoue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eggAt]);

  useEffect(() => {
    handle.current?.setPalette(palette);
  }, [palette]);

  return (
    <span ref={hostRef} className={`gc-geeko ${className}`} data-decor={decor ? '' : undefined} aria-hidden="true">
      <img src={GEEKO_PORTRAIT} alt="" width={84} height={68} loading="lazy" decoding="async" className="gc-geeko-still" />
    </span>
  );
};

export default GeekoStage;
