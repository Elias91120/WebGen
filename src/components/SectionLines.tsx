import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

// three.js (~460 Ko) n'est téléchargé que lorsqu'une section qui l'utilise approche de l'écran.
const FloatingLines = lazy(() => import('./FloatingLines'));

interface SectionLinesProps {
  /** Variante de tracé pour ne pas répéter exactement le même fond d'une section à l'autre. */
  variant?: 'a' | 'b' | 'c';
  className?: string;
}

const VARIANTS = {
  a: { top: { x: 0, y: 1.0, rotate: 0 }, middle: { x: 0, y: 0, rotate: 0 }, bottom: { x: 0, y: -1.0, rotate: 0 } },
  b: { top: { x: 1.5, y: 0.8, rotate: -0.4 }, middle: { x: 0, y: 0, rotate: 0.3 }, bottom: { x: -1.5, y: -0.8, rotate: -0.3 } },
  c: { top: { x: -1, y: 0.9, rotate: 0.5 }, middle: { x: 1, y: 0, rotate: -0.2 }, bottom: { x: 0, y: -1.1, rotate: 0.4 } },
} as const;

const BRAND_GRADIENT = ['#0aefbb', '#c3fb05', '#0aefbb'];
// Constantes : FloatingLines réinitialise WebGL si ces tableaux changent d'identité.
const LINES_DESKTOP = [3, 5, 3];
const DISTANCE_DESKTOP = [4, 5, 4];
const LINES_COMPACT = [3, 4, 3];
const DISTANCE_COMPACT = [4, 5, 4];

/**
 * Fond de lignes animées, aux couleurs de la marque, pour habiller une section.
 * - Grand écran : couvre toute la section, réagit à la souris.
 * - Mobile/tablette : simple bandeau en haut de section, sans interaction.
 * - Jamais avec « réduire les animations ».
 */
const SectionLines: React.FC<SectionLinesProps> = ({ variant = 'a', className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setEnabled(!reduce.matches);
      setCompact(!wide.matches);
    };
    sync();
    wide.addEventListener?.('change', sync);
    reduce.addEventListener?.('change', sync);
    return () => {
      wide.removeEventListener?.('change', sync);
      reduce.removeEventListener?.('change', sync);
    };
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  const v = VARIANTS[variant];

  return (
    <div
      ref={ref}
      className={`section-lines pointer-events-none absolute inset-x-0 top-0 h-[640px] overflow-hidden lg:inset-0 lg:h-auto ${className}`}
      aria-hidden="true"
    >
      {enabled && near && (
        <Suspense fallback={null}>
          <FloatingLines
            key={compact ? 'compact' : 'full'}
            linesGradient={BRAND_GRADIENT}
            topWavePosition={v.top}
            middleWavePosition={v.middle}
            bottomWavePosition={v.bottom}
            lineCount={compact ? LINES_COMPACT : LINES_DESKTOP}
            lineDistance={compact ? DISTANCE_COMPACT : DISTANCE_DESKTOP}
            animationSpeed={compact ? 0.85 : 0.5}
            interactive={!compact}
            parallax={!compact}
            bendStrength={0.5}
            parallaxStrength={0.1}
          />
        </Suspense>
      )}
    </div>
  );
};

export default SectionLines;
