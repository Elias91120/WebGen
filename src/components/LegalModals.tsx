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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-500" />
            {translations.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-slate-800/50">
          <button
            onClick={() => setActiveTab('legal')}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'legal' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {translations.tabs.legal}
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'privacy' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {translations.tabs.privacy}
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'terms' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {translations.tabs.terms}
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed space-y-6">

          {activeTab === 'legal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-white mb-4">{translations.tabs.legal}</h3>
              {translations.content.legal.map((section: any, idx: number) => (
                <section key={idx}>
                  <h4 className="text-white font-bold mb-2">{section.title}</h4>
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
                  <h4 className="text-white font-bold mb-2">{section.title}</h4>
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
                  <h4 className="text-white font-bold mb-2">{section.title}</h4>
                  <p className="whitespace-pre-line">{section.text}</p>
                </section>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-white/10"
          >
            {translations.close}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalModals;
