import { Cookie, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('webgen_cookie_consent');
    if (!consent) {
      // Small delay to not annoy immediately
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('webgen_cookie_consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('webgen_cookie_consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[60] animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0">
             <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2">We use cookies</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              We use cookies to enhance your browsing experience and analyze our traffic.
              By clicking "Accept", you consent to our use of cookies.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
