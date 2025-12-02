
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* W - Bold White */}
      <path 
        d="M10 25 L30 80 L50 25 L70 80 L90 25" 
        stroke="white" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' }}
      />

      {/* G - Bold Purple (#818cf8 is indigo-400) */}
      <path 
        d="M110 35 C 110 35 100 20 85 20 C 65 20 55 40 55 55 C 55 75 70 85 85 85 H 110 V 55 H 85" 
        stroke="#818cf8" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.5))' }}
      />
    </svg>
  );
}
