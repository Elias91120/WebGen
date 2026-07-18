/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Lock } from '@phosphor-icons/react';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import CookieConsent from './components/CookieConsent';
import Contact from './components/home/Contact';
import Hero from './components/home/Hero';
import Method from './components/home/Method';
import OpenSourceStrip from './components/home/OpenSourceStrip';
import Projects from './components/home/Projects';
import Services from './components/home/Services';
import StatsStrip from './components/home/StatsStrip';
import Team from './components/home/Team';
import Testimonials from './components/home/Testimonials';
import WhyUs from './components/home/WhyUs';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import PageBackground from './components/layout/PageBackground';
import LegalModals from './components/LegalModals';
import { Lang, translations } from './i18n/translations';
import { supabase } from './services/supabaseClient';
import { ClientRequest, ServiceType } from './types';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const BookingModal = lazy(() => import('./components/BookingModal'));

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'fr';
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [lang, setLang] = useState<Lang>(detectLang);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'legal'>('legal');

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const openLegal = (tab: 'privacy' | 'terms' | 'legal') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const fetchRequests = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedRequests: ClientRequest[] = data.map((item) => ({
          id: item.id,
          date: item.date,
          status: item.status,
          serviceId: item.service_id as ServiceType,
          serviceName: item.service_name,
          hasMaintenance: item.has_maintenance,
          totalEstimate: item.total_estimate,
          clientName: item.client_name,
          clientEmail: item.client_email,
          clientCompany: item.client_company,
          message: item.message,
          preferredDate: item.preferred_date,
        }));
        setRequests(mappedRequests);
      }
    } catch {
      // Backend may be offline.
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const newRequest = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'new',
      service_id: null,
      service_name: (formData.get('service') as string) || 'General Inquiry',
      has_maintenance: false,
      total_estimate: 'Contact Form',
      client_name: formData.get('name') as string,
      client_email: formData.get('email') as string,
      client_company: formData.get('type') as string,
      message: formData.get('message') as string,
      preferred_date: null,
    };

    if (!supabase) {
      setFormStatus('success');
      return;
    }

    try {
      const { error } = await supabase.from('client_requests').insert([newRequest]);
      if (error) throw error;
      fetchRequests();
      setFormStatus('success');
    } catch {
      alert('Une erreur est survenue. Merci d’écrire à contact@3geeks.fr ou via WhatsApp.');
      setFormStatus('idle');
    }
  };

  const handleBookingSubmit = async (data: Omit<ClientRequest, 'id' | 'date' | 'status'>) => {
    const newRequest = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'new',
      service_id: data.serviceId,
      service_name: data.serviceName,
      has_maintenance: data.hasMaintenance,
      total_estimate: data.totalEstimate,
      client_name: data.clientName,
      client_email: data.clientEmail,
      client_company: data.clientCompany,
      message: data.message,
      preferred_date: data.preferredDate,
    };

    if (!supabase) {
      setBookingModalOpen(false);
      setFormStatus('success');
      scrollToSection('contact');
      return;
    }

    try {
      const { error } = await supabase.from('client_requests').insert([newRequest]);
      if (error) throw error;
      fetchRequests();
      setBookingModalOpen(false);
      setFormStatus('success');
      scrollToSection('contact');
    } catch {
      alert('Une erreur est survenue. Merci d’écrire à contact@3geeks.fr ou via WhatsApp.');
    }
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleAdminStatusUpdate = async (id: string, status: ClientRequest['status']) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('client_requests').update({ status }).eq('id', id);
      if (error) throw error;
      setRequests(requests.map((req) => (req.id === id ? { ...req, status } : req)));
    } catch {
      // silenced
    }
  };

  const handleAdminDelete = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const { error } = await supabase.from('client_requests').delete().eq('id', id);
      if (error) throw error;
      setRequests(requests.filter((req) => req.id !== id));
    } catch {
      // silenced
    }
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#08090d] font-sans text-[#e8edf2]">
      <PageBackground />

      <Navbar
        t={t}
        lang={lang}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((v) => !v)}
        onToggleLang={toggleLang}
        onScrollTo={scrollToSection}
      />

      <main className="relative z-10">
        <Hero
          t={t}
          onContact={() => scrollToSection('contact')}
          onProjects={() => scrollToSection('projets')}
        />
        <StatsStrip t={t} />
        <Projects t={t} />
        <Method t={t} />
        <WhyUs t={t} />
        <OpenSourceStrip t={t} />
        <Services t={t} onSelect={handleServiceSelect} />
        <Team t={t} />
        <Testimonials t={t} />
        <Contact t={t} formStatus={formStatus} onSubmit={handleSubmit} />

        <div className="fixed bottom-3 left-3 right-3 z-40 pb-[env(safe-area-inset-bottom)] md:hidden">
          <button type="button" onClick={() => scrollToSection('contact')} className="btn-primary w-full !rounded-xl">
            {t.nav.cta}
          </button>
        </div>

        <Suspense fallback={null}>
          <BookingModal
            isOpen={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            selectedService={selectedService}
            onSubmit={handleBookingSubmit}
            translations={t}
          />
        </Suspense>

        <Suspense fallback={null}>
          {adminOpen && (
            <AdminDashboard
              requests={requests}
              onUpdateStatus={handleAdminStatusUpdate}
              onDelete={handleAdminDelete}
              onClose={() => setAdminOpen(false)}
            />
          )}
        </Suspense>

        <CookieConsent
          translations={t.cookie}
          onAccept={() => undefined}
          onDecline={() => undefined}
        />

        <LegalModals
          translations={t.legal}
          isOpen={legalModalOpen}
          onClose={() => setLegalModalOpen(false)}
          initialTab={legalTab}
        />
      </main>

      <Footer t={t} onOpenLegal={openLegal} />

      <button
        type="button"
        onClick={() => setAdminOpen(true)}
        className="fixed bottom-3 right-3 z-30 p-2 text-slate-700 transition-colors hover:text-slate-500"
        title="Admin"
        aria-label="Admin"
      >
        <Lock className="h-3.5 w-3.5" weight="bold" />
      </button>
    </div>
  );
};

export default App;
