import { Shield, X } from 'lucide-react';
import React, { useState } from 'react';

interface LegalModalsProps {
  translations: any;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'legal';
}

const LegalModals: React.FC<LegalModalsProps> = ({ translations, isOpen, onClose, initialTab = 'legal' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'legal'>(initialTab);

  if (!isOpen) return null;

  const tabClass = (tab: typeof activeTab) =>
    `flex-1 py-3 sm:py-4 text-sm font-semibold transition-colors border-b-2 ${
      activeTab === tab
        ? 'border-cyan-400 text-cyan-300 bg-white/5'
        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-[#08090d]/85 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-[#0d1117] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300">

        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-[#0d1117]/60">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-300" />
            {translations.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-white/10 bg-[#161b22]/60">
          <button onClick={() => setActiveTab('legal')} className={tabClass('legal')}>
            {translations.tabs.legal}
          </button>
          <button onClick={() => setActiveTab('privacy')} className={tabClass('privacy')}>
            {translations.tabs.privacy}
          </button>
          <button onClick={() => setActiveTab('terms')} className={tabClass('terms')}>
            {translations.tabs.terms}
          </button>
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed space-y-6">

          {activeTab === 'legal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-white mb-4">{translations.tabs.legal}</h3>
              {translations.content.legal.map((section: any, idx: number) => (
                <section key={idx}>
                  <h4 className="text-cyan-300 font-bold mb-2">{section.title}</h4>
                  <p className="whitespace-pre-line">{section.text}</p>
                </section>
              ))}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-white mb-4">{translations.tabs.privacy}</h3>
              {translations.content.privacy.map((section: any, idx: number) => (
                <section key={idx}>
                  <h4 className="text-cyan-300 font-bold mb-2">{section.title}</h4>
                  <p className="whitespace-pre-line">{section.text}</p>
                </section>
              ))}
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-white mb-4">{translations.tabs.terms}</h3>
              {translations.content.terms.map((section: any, idx: number) => (
                <section key={idx}>
                  <h4 className="text-cyan-300 font-bold mb-2">{section.title}</h4>
                  <p className="whitespace-pre-line">{section.text}</p>
                </section>
              ))}
            </div>
          )}

        </div>

        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0d1117]/95 flex justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg transition-colors shadow-[0_0_18px_rgba(34,211,238,0.3)]"
          >
            {translations.close}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalModals;
