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

function heightClass(compact: boolean, large: boolean): string {
  if (large) return 'h-10 sm:h-12 md:h-16';
  if (compact) return 'h-6 sm:h-7 md:h-8';
  return 'h-7 sm:h-8 md:h-9';
}

function Mark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      className={`w-auto object-contain ${className}`}
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
  const h = heightClass(compact, large);

  if (variant === 'mark') {
    const markH = large
      ? 'h-16 sm:h-20 md:h-24'
      : compact
        ? 'h-8 sm:h-9 md:h-10'
        : 'h-10 sm:h-11 md:h-12';
    return <Mark className={className || markH} />;
  }

  return (
    <span
      className={`inline-flex items-center min-w-0 max-w-full ${className}`}
      aria-label="3geeks, trois fondateurs"
    >
      <img
        src="/logo-wordmark.png"
        alt="3geeks"
        className={`w-auto max-w-full object-contain ${h}`}
        draggable={false}
      />
    </span>
  );
});

export default Logo;
export { Mark };
