
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

  // Boot lines reveal one-by-one (phase 0 -> 1)
  useEffect(() => {
    if (phase !== 0) return;
    if (bootIdx >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase(1), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBootIdx((i) => i + 1), 180);
    return () => clearTimeout(t);
  }, [bootIdx, phase]);

  // Logo reveal (phase 1) -> language picker (phase 2)
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
    <div className="fixed inset-0 z-[100] bg-[#08090d] flex flex-col items-center justify-center overflow-hidden text-white">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.09),_rgba(8,9,13,1)_62%)] will-change-transform"></div>
      <div className="absolute inset-0 grid-dust opacity-15 pointer-events-none"></div>

      {/* Intro status card (skipped on regular visits for a faster first impression) */}
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
                <div className="inline-block w-2 h-4 bg-lime-300 align-middle animate-[caret-blink_0.9s_steps(2,end)_infinite]"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logo reveal (phase 1+) */}
      <div className={`relative flex items-center justify-center transition-all duration-700 ease-out ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
         {/* Pulsing rings */}
         <div className="absolute inset-0 border border-cyan-400/30 rounded-3xl animate-[pulse-ring_3s_linear_infinite]"></div>
         <div className="absolute inset-0 border border-lime-300/30 rounded-3xl animate-[pulse-ring_3s_linear_infinite_1s]"></div>

         <div className="relative w-32 h-32 bg-[#0d1117] border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
            <Mark className="w-20 h-20" />
         </div>
         <style>{`
           @keyframes pulse-ring {
             0% { transform: scale(0.85); opacity: 0.55; }
             100% { transform: scale(1.6); opacity: 0; }
           }
         `}</style>
      </div>

      {/* Wordmark + language picker (phase 2) */}
      <div className={`absolute bottom-16 md:bottom-20 flex flex-col items-center transition-all duration-700 px-6 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
         <div className="mb-8">
           <Logo variant="wordmark" className="text-3xl md:text-4xl" />
         </div>

         <div className="flex flex-col items-center gap-3 mb-6 text-center">
            <p className="text-slate-400 text-xs md:text-sm tracking-widest uppercase">Select language · Choisir la langue</p>
         </div>

         <div className="flex flex-col sm:flex-row gap-4">
             <button
                onClick={() => onComplete('fr')}
               className="group relative px-7 py-3 bg-white/5 border border-white/10 hover:border-cyan-400/60 rounded-xl shadow-lg hover:bg-white/10 transition-all backdrop-blur-sm"
             >
                <div className="flex items-center gap-3">
                    <span className="text-slate-200 group-hover:text-white font-bold transition-colors">FR</span>
                    <span className="text-slate-500 text-xs">Francais</span>
                </div>
             </button>

             <button
                onClick={() => onComplete('en')}
               className="group relative px-7 py-3 bg-white/5 border border-white/10 hover:border-lime-300/60 rounded-xl shadow-lg hover:bg-white/10 transition-all backdrop-blur-sm"
             >
                <div className="flex items-center gap-3">
                    <span className="text-slate-200 group-hover:text-white font-bold transition-colors">EN</span>
                    <span className="text-slate-500 text-xs">English</span>
                </div>
             </button>
         </div>

         <button
           onClick={() => onComplete('fr')}
           className="mt-4 text-xs text-slate-400 hover:text-white transition-colors"
         >
           Passer / Skip
         </button>
      </div>

    </div>
  );
};

export default IntroScreen;
