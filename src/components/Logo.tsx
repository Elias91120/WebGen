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
  /** Kept for API compatibility — spacing is baked into the wordmark PNG. */
  spaced?: boolean;
  /** Taille réduite (barre de navigation, footers denses). */
  compact?: boolean;
  /** Taille plus grande (écran d’intro, héros). */
  large?: boolean;
  /** Halo lumineux lime/turquoise derrière le logo (désactivé sur fond clair). */
  glow?: boolean;
  className?: string;
}

/** Intrinsic ratios of the PNG assets — width/height attributes avoid layout shift. */
const WORDMARK = { src: '/logo-wordmark.png', width: 1000, height: 244 };
const MARK = { src: '/logo-mark.png', width: 480, height: 422 };

/** Wordmark is ~4.1:1 — height drives visible size. */
function wordmarkClass(compact: boolean, large: boolean): string {
  if (large) return 'h-16 sm:h-20 md:h-24 lg:h-28 w-auto';
  if (compact) return 'h-9 sm:h-10 md:h-12 w-auto';
  return 'h-10 sm:h-12 md:h-14 w-auto';
}

function markClass(compact: boolean, large: boolean): string {
  if (large) return 'h-20 sm:h-24 md:h-28';
  if (compact) return 'h-9 sm:h-10 md:h-12';
  return 'h-11 sm:h-12 md:h-14';
}

/** The « 3 » ribbon on its own (intro animation, project cards, favicons in UI). */
export function Mark({ className = '', glow = false }: { className?: string; glow?: boolean }) {
  // Height-only sizing needs w-auto; if the caller sets a width, let it win.
  const hasWidth = /(^|\s)(?:[a-z]+:)*w-/.test(className);
  return (
    <img
      src={MARK.src}
      width={MARK.width}
      height={MARK.height}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={`block ${hasWidth ? '' : 'w-auto'} object-contain select-none ${glow ? 'logo-glow' : ''} ${className}`}
      draggable={false}
    />
  );
}

const Logo = memo(function Logo({
  variant = 'mark',
  spaced: _spaced = false,
  withCursor: _withCursor = false,
  withTagline: _withTagline = false,
  compact = false,
  large = false,
  glow = true,
  className = '',
}: LogoProps) {
  if (variant === 'mark') {
    return <Mark glow={glow} className={className || markClass(compact, large)} />;
  }

  return (
    <span
      className={`inline-flex items-center min-w-0 max-w-full ${className}`}
      aria-label="3geeks"
    >
      <img
        src={WORDMARK.src}
        width={WORDMARK.width}
        height={WORDMARK.height}
        alt="3geeks"
        decoding="async"
        fetchPriority={large ? 'high' : undefined}
        className={`block max-w-full object-contain select-none ${glow ? 'logo-glow' : ''} ${wordmarkClass(compact, large)}`}
        draggable={false}
      />
    </span>
  );
});

export default Logo;
