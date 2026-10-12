import { Shield, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type LegalTab = 'privacy' | 'terms' | 'legal';

interface LegalModalsProps {
  translations: any;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

const LegalModals: React.FC<LegalModalsProps> = ({ translations, isOpen, onClose, initialTab = 'legal' }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // The modal stays mounted, so open it on the tab the footer link asked for.
  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabClass = (tab: LegalTab) =>
    `flex-1 py-3 sm:py-4 text-sm font-semibold transition-colors border-b-2 ${
      activeTab === tab
        ? 'border-brand-mint text-brand-mint bg-white/5'
        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  const sections: Array<{ title: string; text: string }> = translations.content[activeTab];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-ink/85 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
    >
      <div
        className="w-full max-w-4xl bg-surface border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center">
          <h2 id="legal-title" className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-mint" />
            {translations.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label={translations.close}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-white/10 bg-surface-2">
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

        <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed">
          <div key={activeTab} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-xl font-bold text-white mb-4">{translations.tabs[activeTab]}</h3>
            {sections.map((section) => (
              <section key={section.title}>
                <h4 className="text-brand-mint font-bold mb-2">{section.title}</h4>
                <p className="whitespace-pre-line">{section.text}</p>
              </section>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="btn btn-primary">
            {translations.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModals;
