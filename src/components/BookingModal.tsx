
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
      setHasMaintenance(false);
      setFormData({ name: '', email: '', company: '', date: '', message: '' });
    }
  }, [isOpen, selectedService]);

  if (!isOpen) return null;

  const getServiceDetails = () => {
    switch(selectedService) {
      case 'starter': return { name: translations.services.s1.title, basePrice: 300, isQuote: false };
      case 'custom': return { name: translations.services.s2.title, basePrice: 0, isQuote: true };
      case 'redesign': return { name: translations.services.s3.title, basePrice: 0, isQuote: true };
      default: return { name: "General Inquiry", basePrice: 0, isQuote: true };
    }
  };

  const details = getServiceDetails();

  const getTotalDisplay = () => {
    let text = "";
    if (details.isQuote) {
      text = "Custom Quote";
    } else {
      text = `€${details.basePrice}`;
    }

    if (hasMaintenance) {
      text += " + €50/mo";
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
        hasMaintenance,
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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-2 sm:p-4 sm:pt-20">
      <div
        className="absolute inset-0 bg-[#08090d]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-[#0d1117]/95 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">

        <div className="p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
             <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-cyan-300" />
               {translations.contact.title}
             </h2>
             <p className="text-sm text-slate-400">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 md:p-4 overflow-y-auto custom-scrollbar">

          {step === 1 ? (
            <div className="space-y-4">
              {/* Selected Service Card */}
              <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4 flex justify-between items-center">
                 <div>
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Selected offer</span>
                    <h3 className="text-lg font-bold text-white">{details.name}</h3>
                 </div>
                 <div className="text-right">
                    <span className="block text-xl font-bold text-white">{details.isQuote ? "Quote" : `€${details.basePrice}`}</span>
                 </div>
              </div>

              {/* Maintenance Upsell */}
              <div
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group ${hasMaintenance ? 'bg-lime-400/10 border-lime-400/50' : 'bg-[#0d1117]/70 border-white/10 hover:border-white/25'}`}
                onClick={() => setHasMaintenance(!hasMaintenance)}
              >
                 <div className="flex items-start gap-4 relative z-10">
                    <div className={`p-3 rounded-lg transition-colors ${hasMaintenance ? 'bg-lime-400 text-slate-950' : 'bg-[#161b22] text-slate-400'}`}>
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <h4 className={`font-bold text-lg ${hasMaintenance ? 'text-white' : 'text-slate-200'}`}>{translations.services.maintenanceTitle}</h4>
                          <span className={`font-bold ${hasMaintenance ? 'text-lime-300' : 'text-slate-400'}`}>+€50/mo</span>
                       </div>
                       <p className="text-sm text-slate-400 leading-relaxed">{translations.services.maintenanceDesc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${hasMaintenance ? 'border-lime-400 bg-lime-400 text-slate-950' : 'border-slate-600'}`}>
                       {hasMaintenance && <Check className="w-4 h-4" />}
                    </div>
                 </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                 <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Estimated total</span>
                    <div className="text-2xl font-bold text-white">{getTotalDisplay()}</div>
                 </div>
                 <button
                   onClick={() => setStep(2)}
                   className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-[0_0_24px_rgba(34,211,238,0.4)]"
                 >
                   Continue <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 md:py-3 bg-[#0d1117]/70 border border-white/10 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all text-sm"
                      placeholder="John Doe"
                    />
                 </div>
                 <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 md:py-3 bg-[#0d1117]/70 border border-white/10 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all text-sm"
                      placeholder="john@company.com"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">company / project</label>
                 <input
                   type="text"
                   value={formData.company}
                   onChange={(e) => setFormData({...formData, company: e.target.value})}
                   className="w-full px-3 py-2 md:py-3 bg-[#0d1117]/70 border border-white/10 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all text-sm"
                   placeholder="My Awesome Shop"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">preferred date (optional)</label>
                 <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 md:py-3 bg-[#0d1117]/70 border border-white/10 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all appearance-none text-sm"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
                 <p className="text-xs text-slate-500">Leave blank to schedule later</p>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">additional details</label>
                 <textarea
                   rows={2}
                   value={formData.message}
                   onChange={(e) => setFormData({...formData, message: e.target.value})}
                   className="w-full px-4 py-3 bg-[#0d1117]/70 border border-white/10 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white transition-all resize-none text-sm"
                   placeholder="Anything else we should know?"
                 ></textarea>
              </div>

              <div className="pt-3 sticky bottom-0 bg-[#0d1117]/95 border-t border-white/10 -mx-3 md:-mx-4 px-3 md:px-4 pb-2 flex justify-between items-center">
                 <button
                   type="button"
                   onClick={() => setStep(1)}
                   className="text-slate-400 hover:text-white transition-colors"
                 >
                   ← back
                 </button>
                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-semibold shadow-[0_0_24px_rgba(34,211,238,0.4)] hover:shadow-[0_0_36px_rgba(34,211,238,0.6)] transition-all transform hover:scale-[1.02] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {isSubmitting ? (
                     <>
                       <Loader2 className="w-4 h-4 animate-spin" />
                       processing...
                     </>
                   ) : (
                     "Confirm"
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
