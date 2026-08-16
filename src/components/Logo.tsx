import React, { memo } from 'react';

type LogoVariant = 'mark' | 'wordmark' | 'full';

interface LogoProps {
  variant?: LogoVariant;
  compact?: boolean;
  large?: boolean;
  spaced?: boolean;
  className?: string;
}

/**
 * Razor-sharp SVG Vector Mark for 3geeks.
 * Smooth gradient cyan-to-lime '3' symbol.
 */
export const Mark: React.FC<{ className?: string }> = ({ className = 'h-10 w-auto' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`block shrink-0 ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="markGradient3g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a3e635" />
        <stop offset="50%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
      <filter id="markGlow3g" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#22d3ee" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Stylized ribbon '3' */}
    <path
      d="M20 22 C35 14, 75 14, 80 28 C85 40, 55 48, 42 48 C60 48, 86 54, 82 74 C77 92, 30 90, 18 80"
      stroke="url(#markGradient3g)"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#markGlow3g)"
    />
  </svg>
);

const Logo = memo(function Logo({
  variant = 'wordmark',
  compact = false,
  large = false,
  className = '',
}: LogoProps) {
  const markSize = large ? 'h-12 w-12 sm:h-16 sm:w-16' : compact ? 'h-7 w-7 sm:h-8 sm:w-8' : 'h-9 w-9 sm:h-10 sm:w-10';
  const textSize = large ? 'text-3xl sm:text-5xl' : compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl';

  if (variant === 'mark') {
    return <Mark className={`${markSize} ${className}`} />;
  }

  return (
    <span className={`inline-flex items-center gap-2.5 font-display font-black tracking-tight select-none ${className}`}>
      <Mark className={markSize} />
      <span className={`bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 ${textSize} leading-none`}>
        3geeks
      </span>
    </span>
  );
});

export default Logo;
