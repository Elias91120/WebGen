/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ArrowRight, Calendar, Check, Loader2, ShieldCheck, X } from 'lucide-react';
import React, { useEffect, useId, useState } from 'react';
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
  const titleId = useId();
  const toggleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setHasMaintenance(selectedService === 'maintenance_only');
    setFormData({ name: '', email: '', company: '', date: '', message: '' });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, selectedService, onClose]);

  if (!isOpen) return null;

  const b = translations.booking;
  const services = translations.services;

  const getServiceDetails = () => {
    switch (selectedService) {
      case 'starter':
        return { name: services.s1.title, basePrice: 300, isQuote: false };
      case 'custom':
        return { name: services.s2.title, basePrice: 0, isQuote: true };
      case 'redesign':
        return { name: services.s3.title, basePrice: 0, isQuote: true };
      case 'maintenance_only':
        return { name: services.maintenanceTitle, basePrice: 0, isQuote: true };
      default:
        return { name: 'General Inquiry', basePrice: 0, isQuote: true };
    }
  };

  const details = getServiceDetails();
  const showOfferCard = selectedService !== 'maintenance_only';
  const benefits: string[] = services.maintenanceBenefits || [];

  const getTotalDisplay = () => {
    if (selectedService === 'maintenance_only') {
      return services.maintenancePrice;
    }
    if (details.isQuote) {
      return hasMaintenance
        ? `${b.quote} + ${services.maintenancePrice}`
        : b.quote;
    }
    return hasMaintenance
      ? `€${details.basePrice} + ${services.maintenancePrice}`
      : `€${details.basePrice}`;
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
    }, 800);
  };

  const toggleMaintenance = () => {
    if (selectedService === 'maintenance_only') return;
    setHasMaintenance((prev) => !prev);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-[#08090d]/90"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-[#0d1117] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 md:px-6 md:py-5 border-b border-white/8 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg md:text-xl font-display font-bold text-white leading-snug">
              {b.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {b.stepOf.replace('{step}', String(step))}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors flex-shrink-0"
            aria-label="close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5 md:px-6 md:py-6 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-4">
              {showOfferCard && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                      {b.selectedOffer}
                    </p>
                    <p className="text-base md:text-lg font-semibold text-white mt-0.5 truncate">
                      {details.name}
                    </p>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-cyan-300 flex-shrink-0">
                    {details.isQuote ? b.quote : `€${details.basePrice}`}
                  </p>
                </div>
              )}

              {/* Option Sérénité */}
              <div
                className={`rounded-xl border transition-colors ${
                  hasMaintenance
                    ? 'border-lime-400/50 bg-lime-400/[0.08]'
                    : 'border-white/12 bg-white/[0.02] hover:border-lime-400/35'
                }`}
              >
                <button
                  type="button"
                  id={toggleId}
                  onClick={toggleMaintenance}
                  className="w-full text-left px-4 py-4 md:px-5 md:py-5"
                  aria-pressed={hasMaintenance}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                        hasMaintenance
                          ? 'bg-lime-400 text-slate-950'
                          : 'bg-lime-400/15 text-lime-300'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base md:text-lg font-bold text-white">
                          {services.maintenanceTitle}
                        </h3>
                        <span className="rounded-md bg-lime-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lime-300">
                          {services.maintenanceHighlight}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                        {services.maintenanceDesc}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
                      <span className="text-sm font-bold text-lime-300 whitespace-nowrap">
                        +{services.maintenancePrice}
                      </span>
                      <span
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          hasMaintenance ? 'bg-lime-400' : 'bg-white/15'
                        }`}
                        aria-hidden="true"
                      >
                        <span
                          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            hasMaintenance ? 'translate-x-[22px]' : 'translate-x-0.5'
                          }`}
                        />
                      </span>
                    </div>
                  </div>
                </button>

                {benefits.length > 0 && (
                  <ul className="border-t border-white/8 px-4 pb-4 pt-3 md:px-5 space-y-2">
                    {benefits.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className={`w-4 h-4 flex-shrink-0 ${hasMaintenance ? 'text-lime-300' : 'text-slate-500'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    {b.estimatedTotal}
                  </p>
                  <p className="text-xl font-bold text-white mt-0.5">{getTotalDisplay()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors"
                >
                  {b.continue}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {b.name}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400"
                    placeholder={b.namePlaceholder}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {b.email}
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400"
                    placeholder={b.emailPlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {b.company}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400"
                  placeholder={b.companyPlaceholder}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {b.preferredDate}
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400 appearance-none"
                  />
                  <Calendar className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
                <p className="text-xs text-slate-500">{b.dateHint}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {b.details}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400"
                  placeholder={b.detailsPlaceholder}
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  ← {b.back}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors disabled:opacity-70"
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
