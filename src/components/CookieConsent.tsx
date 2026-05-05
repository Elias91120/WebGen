import { Cookie, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CookieConsentProps {
  translations: any;
  onAccept: () => void;
  onDecline: () => void;
}

const STORAGE_KEY = '3geeks_cookie_consent';

const CookieConsent: React.FC<CookieConsentProps> = ({ translations, onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[60] animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-lime-300 to-cyan-400"></div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-400/10 rounded-xl text-cyan-300 flex-shrink-0 border border-cyan-400/20">
             <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2 font-mono">{translations.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {translations.desc}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-sm font-mono font-bold rounded-lg transition-colors shadow-[0_0_18px_rgba(34,211,238,0.35)]"
              >
                {translations.accept}
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-mono font-bold rounded-lg transition-colors"
              >
                {translations.decline}
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-500 hover:text-white transition-colors"
            aria-label="close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
