
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { TrendingUp, Globe } from 'lucide-react';
import Logo from './Logo';

interface IntroScreenProps {
  onComplete: (lang: 'en' | 'fr') => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); 

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 1200); 
    const timer2 = setTimeout(() => setPhase(2), 4000); 
    const timer3 = setTimeout(() => setPhase(3), 5500); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-display text-white">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black"></div>
      
      <div className="relative flex items-center justify-center">
        
        {/* Central Icon Animation */}
        <div className={`relative transition-all duration-1000 ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
           {/* Rings */}
           <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-[pulse-ring_3s_linear_infinite]"></div>
           <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-[pulse-ring_3s_linear_infinite_1s]"></div>
           
           {/* Logo Container - Dark background to make the White W and Purple G pop */}
           <div className="relative w-32 h-32 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 animate-[float_4s_ease-in-out_infinite]">
              <Logo className="w-20 h-20" />
           </div>

           {/* Floating badges */}
           <div className={`absolute -right-12 top-0 bg-slate-800/90 border border-white/10 p-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-700 delay-500 ${phase >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-200">Online</span>
           </div>

           <div className={`absolute -left-12 bottom-0 bg-slate-800/90 border border-white/10 p-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-700 delay-700 ${phase >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-200">+150% Traffic</span>
           </div>
        </div>
      </div>

      {/* PHASE 3: UI REVEAL */}
      <div className={`absolute bottom-20 flex flex-col items-center transition-all duration-1000 px-6 ${phase === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
         <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight text-center drop-shadow-lg">
            Web<span className="text-indigo-500">Gen</span>
         </h1>
         
         <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <p className="text-slate-300 text-sm md:text-base tracking-widest uppercase">Select Language / Choisir la langue</p>
         </div>
         
         <div className="flex flex-col sm:flex-row gap-4">
             <button 
                onClick={() => onComplete('en')}
                className="group relative px-8 py-3 bg-white/5 border border-white/10 hover:border-indigo-500 rounded-xl shadow-lg hover:bg-white/10 transition-all backdrop-blur-sm"
             >
                <div className="flex items-center gap-3">
                    <span className="text-xl">🇬🇧</span>
                    <span className="text-slate-200 group-hover:text-white font-bold tracking-wide transition-colors">English</span>
                </div>
             </button>

             <button 
                onClick={() => onComplete('fr')}
                className="group relative px-8 py-3 bg-white/5 border border-white/10 hover:border-indigo-500 rounded-xl shadow-lg hover:bg-white/10 transition-all backdrop-blur-sm"
             >
                <div className="flex items-center gap-3">
                    <span className="text-xl">🇫🇷</span>
                    <span className="text-slate-200 group-hover:text-white font-bold tracking-wide transition-colors">Français</span>
                </div>
             </button>
         </div>
      </div>

    </div>
  );
};

export default IntroScreen;
