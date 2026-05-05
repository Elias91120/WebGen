/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { memo } from 'react';

type LogoVariant = 'mark' | 'wordmark' | 'full';

interface LogoProps {
  variant?: LogoVariant;
  withCursor?: boolean;
  withTagline?: boolean;
  className?: string;
}

/**
 * 3geeks brand logo.
 *
 * Concept: a `{3}` mark — accolades JS/CSS + the digit 3 (the trio of founders).
 * The mark is rendered as crisp SVG paths so it stays sharp at favicon sizes,
 * while the wordmark uses HTML text in JetBrains Mono for typographic precision.
 */
function Mark({ className = '', glow = true }: { className?: string; glow?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="threegeeks-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="55%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        {glow && (
          <filter id="threegeeks-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g
        stroke="url(#threegeeks-grad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={glow ? 'url(#threegeeks-glow)' : undefined}
      >
        <path d="M 32 14 C 22 14, 22 32, 22 38 C 22 44, 22 47, 12 50 C 22 53, 22 56, 22 62 C 22 68, 22 86, 32 86" />
        <path d="M 50 24 H 78 L 60 50 H 65 C 80 50, 80 86, 60 86 C 48 86, 44 78, 44 72" />
        <path d="M 88 14 C 98 14, 98 32, 98 38 C 98 44, 98 47, 108 50 C 98 53, 98 56, 98 62 C 98 68, 98 86, 88 86" />
      </g>
    </svg>
  );
}

const Logo = memo(function Logo({
  variant = 'mark',
  withCursor = false,
  withTagline = false,
  className = '',
}: LogoProps) {
  if (variant === 'mark') {
    return <Mark className={className || 'w-10 h-10'} />;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="3geeks">
      <Mark className="w-8 h-8 md:w-9 md:h-9 shrink-0" />
      <span className="font-mono font-bold leading-none tracking-tight text-white text-xl md:text-2xl">
        <span className="bg-gradient-to-r from-cyan-300 via-lime-300 to-cyan-300 bg-clip-text text-transparent">
          3
        </span>
        geeks
        {withCursor && (
          <span
            className="inline-block w-[0.55ch] h-[0.9em] ml-[2px] -mb-[2px] bg-lime-300 align-middle animate-[caret-blink_1s_steps(2,end)_infinite]"
            aria-hidden="true"
          />
        )}
      </span>
      {variant === 'full' && withTagline && (
        <span className="hidden md:inline text-xs text-slate-400 ml-2">
          digital studio
        </span>
      )}
    </span>
  );
});

export default Logo;
export { Mark };
