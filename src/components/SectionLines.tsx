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

/**
 * Fond de lignes animées, aux couleurs de la marque, pour habiller une section.
 * Grand écran uniquement, jamais avec « réduire les animations ».
 */
const SectionLines: React.FC<SectionLinesProps> = ({ variant = 'a', className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(wide.matches && !reduce.matches);
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
      className={`section-lines pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {enabled && near && (
        <Suspense fallback={null}>
          <FloatingLines
            linesGradient={BRAND_GRADIENT}
            topWavePosition={v.top}
            middleWavePosition={v.middle}
            bottomWavePosition={v.bottom}
            lineCount={[3, 5, 3]}
            lineDistance={[4, 5, 4]}
            animationSpeed={0.5}
            interactive
            bendStrength={0.5}
            parallaxStrength={0.1}
          />
        </Suspense>
      )}
    </div>
  );
};

export default SectionLines;
