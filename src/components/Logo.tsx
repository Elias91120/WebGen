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
  className?: string;
}

/** Wordmark is ~4.3:1 — height drives visible size once PNG padding is trimmed. */
function wordmarkClass(compact: boolean, large: boolean): string {
  if (large) return 'h-20 sm:h-24 md:h-28 lg:h-32 w-auto';
  if (compact) return 'h-11 sm:h-12 md:h-14 w-auto';
  return 'h-12 sm:h-14 md:h-16 w-auto';
}

function markClass(compact: boolean, large: boolean): string {
  if (large) return 'h-24 sm:h-28 md:h-32 lg:h-36';
  if (compact) return 'h-12 sm:h-14 md:h-16';
  return 'h-14 sm:h-16 md:h-20';
}

function Mark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      className={`block w-auto object-contain ${className}`}
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
  className = '',
}: LogoProps) {
  const wordmarkSize = wordmarkClass(compact, large);

  if (variant === 'mark') {
    return <Mark className={className || markClass(compact, large)} />;
  }

  return (
    <span
      className={`inline-flex items-center min-w-0 max-w-full ${className}`}
      aria-label="3geeks, trois fondateurs"
    >
      <img
        src="/logo-wordmark.png"
        alt="3geeks"
        className={`block max-w-full object-contain ${wordmarkSize}`}
        draggable={false}
      />
    </span>
  );
});

export default Logo;
export { Mark };
