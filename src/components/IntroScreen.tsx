
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import Logo, { Mark } from './Logo';

interface IntroScreenProps {
  onComplete: (lang: 'en' | 'fr') => void;
}

const BOOT_LINES: { text: string; tone?: 'ok' | 'info' | 'cyan' | 'lime' }[] = [
  { text: 'Preparing your experience', tone: 'cyan' },
  { text: 'Loading projects and case studies', tone: 'ok' },
  { text: 'Optimizing for your screen', tone: 'ok' },
  { text: 'Ready', tone: 'lime' },
];

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(2);
  const [bootIdx, setBootIdx] = useState(0);

  useEffect(() => {
    if (phase !== 0) return;
    if (bootIdx >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase(1), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBootIdx((i) => i + 1), 180);
    return () => clearTimeout(t);
  }, [bootIdx, phase]);

  useEffect(() => {
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 650);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const toneClass = (tone?: string) =>
    tone === 'cyan' ? 'text-cyan-300'
    : tone === 'lime' ? 'text-lime-300'
    : tone === 'ok' ? 'text-slate-400'
    : 'text-slate-300';

  return (
    <div className="fixed inset-0 z-[100] bg-[#08090d] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.09),_rgba(8,9,13,1)_62%)] will-change-transform pointer-events-none" />
      <div className="absolute inset-0 grid-dust opacity-15 pointer-events-none" />

      {/* Boot */}
      <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-500 ${phase === 0 ? 'opacity-100' : 'opacity-0 -translate-y-[60%] pointer-events-none'}`}>
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-[#0d1117]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="px-4 py-2 border-b border-white/5 text-[11px] text-cyan-300/80 uppercase tracking-wide">
              3geeks
            </div>
            <div className="p-5 text-sm space-y-1">
              {BOOT_LINES.slice(0, bootIdx).map((line, i) => (
                <div key={i} className={toneClass(line.tone)}>{line.text}</div>
              ))}
              {bootIdx < BOOT_LINES.length && (
                <div className="inline-block w-2 h-4 bg-lime-300 align-middle animate-[caret-blink_0.9s_steps(2,end)_infinite]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grand marqueur : uniquement phase 1 (transition), pas en phase langue pour éviter doublon avec le wordmark */}
      {phase === 1 && (
        <div className="relative flex items-center justify-center transition-all duration-700 ease-out scale-100 opacity-100">
          <div className="absolute inset-0 border border-cyan-400/30 rounded-3xl animate-[pulse-ring_3s_linear_infinite]" />
          <div className="absolute inset-0 border border-lime-300/30 rounded-3xl animate-[pulse-ring_3s_linear_infinite_1s]" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#0d1117] border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
            <Mark className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20" />
          </div>
          <style>{`
           @keyframes pulse-ring {
             0% { transform: scale(0.85); opacity: 0.55; }
             100% { transform: scale(1.6); opacity: 0; }
           }
         `}</style>
        </div>
      )}

      {/* Langue : logo complet + boutons, centré, marges latérales fixes */}
      <div
        className={`relative z-10 flex w-full max-w-[min(100%,22rem)] sm:max-w-md flex-col items-center px-6 py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] ${
          phase >= 2 ? '' : 'hidden'
        }`}
      >
        <div className="mb-6 w-full max-w-xs sm:max-w-sm flex justify-center px-1 min-w-0">
          <Logo variant="wordmark" spaced large className="justify-center text-white" />
        </div>

        <p className="mb-5 text-center text-slate-400 text-xs sm:text-sm tracking-wide uppercase">
          Select language · Choisir la langue
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => onComplete('fr')}
            aria-label="Français"
            className="w-full sm:flex-1 sm:min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:border-cyan-400/50 hover:bg-white/10 sm:text-center"
          >
            <span className="font-semibold text-slate-100">FR</span>
            <span className="mt-0.5 block text-sm text-slate-500">Français</span>
          </button>
          <button
            type="button"
            onClick={() => onComplete('en')}
            aria-label="English"
            className="w-full sm:flex-1 sm:min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:border-lime-300/50 hover:bg-white/10 sm:text-center"
          >
            <span className="font-semibold text-slate-100">EN</span>
            <span className="mt-0.5 block text-sm text-slate-500">English</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onComplete('fr')}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Passer / Skip
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
