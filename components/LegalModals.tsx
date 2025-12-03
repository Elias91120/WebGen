import { Shield, X } from 'lucide-react';
import React, { useState } from 'react';

interface LegalModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'legal';
}

const LegalModals: React.FC<LegalModalsProps> = ({ isOpen, onClose, initialTab = 'legal' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'legal'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-500" />
            Legal Information
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
            Mentions Légales
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'privacy' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Politique de Confidentialité
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'terms' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            CGV
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed space-y-6">

          {activeTab === 'legal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-white mb-4">Mentions Légales</h3>

              <section>
                <h4 className="text-white font-bold mb-2">1. Éditeur du site</h4>
                <p>Le site WebGen est édité par l'équipe WebGen.</p>
                <p>Email : contact@webgen.com</p>
                <p>Téléphone : +33 6 71 61 81 19</p>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">2. Hébergement</h4>
                <p>Le site est hébergé par Vercel Inc.</p>
                <p>Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">3. Propriété Intellectuelle</h4>
                <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>
              </section>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-white mb-4">Politique de Confidentialité</h3>

              <section>
                <h4 className="text-white font-bold mb-2">1. Collecte des données</h4>
                <p>Nous collectons les informations suivantes via notre formulaire de contact :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Nom et Prénom</li>
                  <li>Adresse email</li>
                  <li>Nom de l'entreprise</li>
                  <li>Détails du projet</li>
                </ul>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">2. Utilisation des données</h4>
                <p>Ces données sont utilisées uniquement pour :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Répondre à vos demandes de contact</li>
                  <li>Établir des devis</li>
                  <li>Vous contacter dans le cadre de la relation commerciale</li>
                </ul>
                <p className="mt-2">Vos données ne sont jamais vendues à des tiers.</p>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">3. Vos droits</h4>
                <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à contact@webgen.com.</p>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">4. Cookies</h4>
                <p>Ce site utilise des cookies essentiels au fonctionnement et des cookies d'analyse pour améliorer votre expérience. Vous pouvez gérer vos préférences via la bannière de consentement.</p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-white mb-4">Conditions Générales de Vente (CGV)</h3>

              <section>
                <h4 className="text-white font-bold mb-2">1. Objet</h4>
                <p>Les présentes conditions régissent les ventes de prestations de services de développement web par WebGen.</p>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">2. Prix</h4>
                <p>Les prix de nos services sont indiqués en euros. WebGen se réserve le droit de modifier ses prix à tout moment, mais le service sera facturé sur la base du tarif en vigueur au moment de la validation du devis.</p>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">3. Paiement</h4>
                <p>Le paiement est exigible à la signature du devis (acompte) et à la livraison du projet (solde).</p>
              </section>

              <section>
                <h4 className="text-white font-bold mb-2">4. Livraison</h4>
                <p>Les délais de livraison sont donnés à titre indicatif et peuvent varier selon la complexité du projet et la réactivité du client.</p>
              </section>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-white/10"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalModals;
