/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ArrowRight, Calendar, Check, Loader2, ShieldCheck, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ClientRequest, ServiceType } from '../types';


interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: ServiceType;
  onSubmit: (request: Omit<ClientRequest, 'id' | 'date' | 'status'>) => void;
  translations: any;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  onSubmit,
  translations
}) => {
  const [hasMaintenance, setHasMaintenance] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setHasMaintenance(selectedService === 'maintenance_only');
      setFormData({ name: '', email: '', company: '', date: '', message: '' });
    }
  }, [isOpen, selectedService]);

  if (!isOpen) return null;

  const b = translations.booking;
  const services = translations.services;

  const getServiceDetails = () => {
    switch(selectedService) {
      case 'starter': return { name: services.s1.title, basePrice: 300, isQuote: false };
      case 'custom': return { name: services.s2.title, basePrice: 0, isQuote: true };
      case 'redesign': return { name: services.s3.title, basePrice: 0, isQuote: true };
      case 'maintenance_only': return { name: services.maintenanceTitle, basePrice: 0, isQuote: true };
      default: return { name: "General Inquiry", basePrice: 0, isQuote: true };
    }
  };

  const details = getServiceDetails();
  const showOfferCard = selectedService !== 'maintenance_only';

  const getTotalDisplay = () => {
    if (selectedService === 'maintenance_only') {
      return services.maintenancePrice;
    }

    let text = details.isQuote ? b.quote : `€${details.basePrice}`;
    if (hasMaintenance) {
      text += ` + ${services.maintenancePrice}`;
    }
    return text;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        serviceId: selectedService,
        serviceName: details.name,
        hasMaintenance: selectedService === 'maintenance_only' ? true : hasMaintenance,
        totalEstimate: getTotalDisplay(),
        clientName: formData.name,
        clientEmail: formData.email,
        clientCompany: formData.company,
        message: formData.message,
        preferredDate: formData.date
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 sm:pt-16">
      <div
        className="absolute inset-0 bg-[#08090d]/88 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-3xl bg-[#0d1117]/97 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-300">

        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-white/5 flex justify-between items-start gap-4 bg-white/[0.03]">
          <div className="min-w-0">
             <h2 className="text-xl md:text-2xl font-display font-bold text-white flex items-start gap-2.5 leading-snug">
               <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-cyan-300 mt-0.5 flex-shrink-0" />
               <span>{translations.contact.title}</span>
             </h2>
             <p className="text-sm md:text-base text-slate-400 mt-1.5 ml-8">
               {b.stepOf.replace('{step}', String(step))}
             </p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white flex-shrink-0" aria-label="close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 md:px-8 md:py-7 overflow-y-auto custom-scrollbar">

          {step === 1 ? (
            <div className="space-y-5 md:space-y-6">
              {showOfferCard && (
                <div className="bg-cyan-500/[0.08] border border-cyan-400/35 rounded-2xl p-5 md:p-6 flex justify-between items-center gap-4">
                   <div>
                      <span className="text-[11px] md:text-xs font-bold text-cyan-300 uppercase tracking-wider">{b.selectedOffer}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mt-1">{details.name}</h3>
                   </div>
                   <div className="text-right flex-shrink-0">
                      <span className="block text-2xl md:text-3xl font-bold text-white font-mono">
                        {details.isQuote ? b.quote : `€${details.basePrice}`}
                      </span>
                   </div>
                </div>
              )}

              {/* Option Sérénité — upsell mis en valeur */}
              <button
                type="button"
                className={`w-full text-left border rounded-2xl p-5 md:p-6 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  hasMaintenance
                    ? 'bg-lime-400/[0.12] border-lime-400/55 shadow-[0_0_36px_-8px_rgba(163,230,53,0.45)]'
                    : 'bg-gradient-to-br from-lime-400/[0.08] via-[#0d1117]/80 to-cyan-400/[0.06] border-lime-400/30 hover:border-lime-400/50 hover:shadow-[0_0_28px_-10px_rgba(163,230,53,0.3)]'
                }`}
                onClick={() => {
                  if (selectedService === 'maintenance_only') return;
                  setHasMaintenance(!hasMaintenance);
                }}
              >
                 <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(163,230,53,0.14),transparent_50%)]" />
                 <div className="flex items-start gap-4 md:gap-5 relative z-10">
                    <div className={`p-3.5 md:p-4 rounded-xl transition-colors flex-shrink-0 ${hasMaintenance ? 'bg-lime-400 text-slate-950' : 'bg-lime-400/15 text-lime-300 border border-lime-400/35'}`}>
                       <ShieldCheck className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h4 className="font-bold text-lg md:text-xl text-white">{services.maintenanceTitle}</h4>
                          <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/35">
                            {services.maintenanceHighlight}
                          </span>
                       </div>
                       <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                         {services.maintenanceDesc}{' '}
                         <span className="text-lime-300 font-bold font-mono">{services.maintenancePrice}</span>.
                       </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                       <span className={`font-bold font-mono text-base md:text-lg ${hasMaintenance ? 'text-lime-300' : 'text-slate-200'}`}>
                         +{services.maintenancePrice}
                       </span>
                       <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${hasMaintenance ? 'border-lime-400 bg-lime-400 text-slate-950' : 'border-slate-500 bg-transparent'}`}>
                          {hasMaintenance && <Check className="w-4 h-4" />}
                       </div>
                    </div>
                 </div>
              </button>

              <div className="pt-4 md:pt-5 border-t border-white/10 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4">
                 <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{b.estimatedTotal}</span>
                    <div className="text-2xl md:text-3xl font-bold text-white font-mono mt-0.5">{getTotalDisplay()}</div>
                 </div>
                 <button
                   onClick={() => setStep(2)}
                   className="px-7 py-3.5 md:px-8 md:py-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-semibold text-sm md:text-base transition-colors flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(34,211,238,0.4)]"
                 >
                   {b.continue} <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">{b.name}</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 md:py-3.5 bg-[#0d1117]/70 border border-white/10 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all text-sm md:text-base"
                      placeholder={b.namePlaceholder}
                    />
                 </div>
                 <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">{b.email}</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 md:py-3.5 bg-[#0d1117]/70 border border-white/10 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all text-sm md:text-base"
                      placeholder={b.emailPlaceholder}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">{b.company}</label>
                 <input
                   type="text"
                   value={formData.company}
                   onChange={(e) => setFormData({...formData, company: e.target.value})}
                   className="w-full px-4 py-3 md:py-3.5 bg-[#0d1117]/70 border border-white/10 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all text-sm md:text-base"
                   placeholder={b.companyPlaceholder}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">{b.preferredDate}</label>
                 <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 md:py-3.5 bg-[#0d1117]/70 border border-white/10 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all appearance-none text-sm md:text-base"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
                 <p className="text-xs text-slate-500">{b.dateHint}</p>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">{b.details}</label>
                 <textarea
                   rows={3}
                   value={formData.message}
                   onChange={(e) => setFormData({...formData, message: e.target.value})}
                   className="w-full px-4 py-3 bg-[#0d1117]/70 border border-white/10 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all resize-none text-sm md:text-base"
                   placeholder={b.detailsPlaceholder}
                 ></textarea>
              </div>

              <div className="pt-4 sticky bottom-0 bg-[#0d1117]/95 border-t border-white/10 -mx-6 md:-mx-8 px-6 md:px-8 pb-1 flex justify-between items-center gap-3">
                 <button
                   type="button"
                   onClick={() => setStep(1)}
                   className="text-slate-400 hover:text-white transition-colors text-sm md:text-base"
                 >
                   ← {b.back}
                 </button>
                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="px-8 py-3.5 md:px-10 md:py-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-semibold shadow-[0_0_24px_rgba(34,211,238,0.4)] hover:shadow-[0_0_36px_rgba(34,211,238,0.6)] transition-all transform hover:scale-[1.02] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
                 >
                   {isSubmitting ? (
                     <>
                       <Loader2 className="w-4 h-4 animate-spin" />
                       {b.processing}
                     </>
                   ) : (
                     b.confirm
                   )}
                 </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
