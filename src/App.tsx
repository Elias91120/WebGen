
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  Send,
  ShieldCheck,
  Smartphone,
  Star,
  Store,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState, Suspense, lazy } from 'react';
import AiAgentWidget from './components/AiAgentWidget';
import CookieConsent from './components/CookieConsent';
import HeroVideo from './components/HeroVideo';
import LegalModals from './components/LegalModals';
import Logo from './components/Logo';
import ProjectsShowcase, { PROJECTS_DATA } from './components/ProjectsShowcase';
import Reveal from './components/Reveal';
import SectionLines from './components/SectionLines';
import SkillsRadar from './components/SkillsRadar';
import { Lang, translations } from './i18n';
import { getSupabase } from './services/supabaseClient';
import { ClientRequest, ServiceType } from './types';

// Lazy-loaded components for performance optimization
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const BookingModal = lazy(() => import('./components/BookingModal'));

const LANG_STORAGE_KEY = '3geeks-lang';

/** Langue mémorisée, sinon celle du navigateur (français par défaut pour la France). */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* stockage indisponible */
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }
  return 'fr';
}

const NAV_LINKS: Array<{ id: string; key: 'services' | 'method' | 'projects' | 'expertise' | 'reviews' }> = [
  { id: 'services', key: 'services' },
  { id: 'methode', key: 'method' },
  { id: 'projets', key: 'projects' },
  { id: 'skills', key: 'expertise' },
  { id: 'temoignages', key: 'reviews' },
];

const WHATSAPP_URL = 'https://wa.me/33671618119';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-brand-mint/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-brand-mint/10';
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [lang, setLang] = useState<Lang>(detectLang);
  const [scrolled, setScrolled] = useState(false);

  // Booking & Admin State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  // GDPR State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'legal'>('legal');

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const openLegal = (tab: 'privacy' | 'terms' | 'legal') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const t = translations[lang];
  const fr = lang === 'fr';

  useEffect(() => {
    if (adminOpen) fetchRequests();
  }, [adminOpen]);

  const fetchRequests = async () => {
    const supabase = await getSupabase();
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedRequests: ClientRequest[] = data.map(item => ({
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
          preferredDate: item.preferred_date
        }));
        setRequests(mappedRequests);
      }
    } catch (error) {
      // Silenced: backend may be offline. Public site still works.
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
      service_name: formData.get('service') as string || 'General Inquiry',
      has_maintenance: false,
      total_estimate: 'Contact Form',
      client_name: formData.get('name') as string,
      client_email: formData.get('email') as string,
      client_company: formData.get('type') as string,
      message: formData.get('message') as string,
      preferred_date: null
    };

    const supabase = await getSupabase();
    if (!supabase) {
      // Backend offline: still confirm to the user instead of failing silently.
      setFormStatus('success');
      return;
    }

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([newRequest]);

      if (error) throw error;

      fetchRequests();
      setFormStatus('success');
    } catch (error) {
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
      preferred_date: data.preferredDate
    };

    const supabase = await getSupabase();
    if (!supabase) {
      setBookingModalOpen(false);
      setFormStatus('success');
      scrollToSection('contact');
      return;
    }

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([newRequest]);

      if (error) throw error;

      fetchRequests();
      setBookingModalOpen(false);
      setFormStatus('success');
      scrollToSection('contact');
    } catch (error) {
      alert('Une erreur est survenue. Merci d’écrire à contact@3geeks.fr ou via WhatsApp.');
    }
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleAdminStatusUpdate = async (id: string, status: ClientRequest['status']) => {
    const supabase = await getSupabase();
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('client_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
    } catch (error) {
      // silenced
    }
  };

  const handleAdminDelete = async (id: string) => {
    const supabase = await getSupabase();
    if (!supabase) return;
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const { error } = await supabase
        .from('client_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRequests(requests.filter(req => req.id !== id));
    } catch (error) {
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

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'fr' : 'en'));

  const clientNames = PROJECTS_DATA.filter((p) => p.category === 'client').map((p) => p.title);

  const plans: Array<{ id: ServiceType; data: typeof t.services.s1; tag: string; featured: boolean }> = [
    { id: 'starter', data: t.services.s1, tag: fr ? 'Site vitrine' : 'Business website', featured: false },
    { id: 'custom', data: t.services.s2, tag: fr ? 'Projet sur mesure' : 'Custom project', featured: true },
    { id: 'redesign', data: t.services.s3, tag: fr ? 'Refonte complète' : 'Complete redesign', featured: false },
  ];

  const whyCards = [
    { icon: Smartphone, title: t.whyUs.card1.title, desc: t.whyUs.card1.desc },
    { icon: ShieldCheck, title: t.whyUs.card2.title, desc: t.whyUs.card2.desc },
    { icon: Store, title: t.whyUs.card3.title, desc: t.whyUs.card3.desc },
    { icon: Users, title: t.whyUs.card4.title, desc: t.whyUs.card4.desc },
  ];

  const reviews = [
    { text: t.reviews.r1, name: 'Adrien', meta: 'CallKitchen · Express Divorce USA', initial: 'A' },
    { text: t.reviews.r2, name: 'Henry F.', meta: 'Two App', initial: 'H' },
    { text: t.reviews.r3, name: 'Pierre V.', meta: 'Concept Store', initial: 'P' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink font-sans text-slate-100">
      {/* ------------------------------------------------------------ */}
      {/* NAVIGATION                                                    */}
      {/* ------------------------------------------------------------ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen
            ? 'border-b border-white/[0.07] bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-20">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex min-w-0 shrink-0 items-center"
            aria-label="3geeks"
          >
            <Logo variant="wordmark" compact glow={false} />
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {t.nav[link.key]}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-white/25 hover:text-white"
              aria-label={fr ? 'Switch to English' : 'Passer en français'}
            >
              <Globe className="h-3.5 w-3.5 text-brand-mint" /> {lang.toUpperCase()}
            </button>
            <button type="button" onClick={() => scrollToSection('contact')} className="btn btn-primary !py-3">
              {t.nav.cta}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleLang}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300"
              aria-label={fr ? 'Switch to English' : 'Passer en français'}
            >
              {lang.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg border border-white/10 p-2 text-white"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-white/[0.07] bg-ink px-5 pb-6 pt-4 lg:hidden">
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center justify-between border-b border-white/5 py-4 text-left text-base font-medium text-slate-100"
                >
                  {t.nav[link.key]}
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => scrollToSection('contact')} className="btn btn-primary mt-6 w-full">
              {t.nav.cta}
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost mt-3 w-full"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        )}
      </header>

      <main>
        {/* ------------------------------------------------------------ */}
        {/* HERO                                                          */}
        {/* ------------------------------------------------------------ */}
        <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
          <HeroVideo lang={lang} />

          {/* Lisibilité du texte : voile sombre à gauche, fondu vers la page en bas */}
          <div
            className="pointer-events-none absolute inset-0 bg-ink/60 lg:bg-[linear-gradient(90deg,#08090d_0%,rgba(8,9,13,0.85)_30%,rgba(8,9,13,0.25)_60%,transparent_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-10 pt-32 sm:px-8 md:pt-36">
            <div className="max-w-2xl lg:max-w-[33rem]">
              <div
                className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-3 pr-4 text-xs font-medium text-slate-200 backdrop-blur"
                style={{ ['--rise-delay' as string]: '100ms' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-mint opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-mint" />
                </span>
                {t.hero.badge}
              </div>

              <h1
                className="hero-rise mt-6 font-display text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(8,9,13,0.8)] sm:text-6xl lg:text-[2.9rem] xl:text-[3.25rem]"
                style={{ ['--rise-delay' as string]: '220ms' }}
              >
                {t.hero.titleStart}{' '}
                <span className="text-gradient">{t.hero.titleEnd}</span>
              </h1>

              <p
                className="hero-rise mt-7 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg"
                style={{ ['--rise-delay' as string]: '360ms' }}
              >
                {t.hero.comment}
              </p>

              <div
                className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row"
                style={{ ['--rise-delay' as string]: '480ms' }}
              >
                <button type="button" onClick={() => scrollToSection('contact')} className="btn btn-primary">
                  {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => scrollToSection('services')} className="btn btn-ghost">
                  {t.hero.ctaSecondary}
                </button>
              </div>
            </div>
          </div>

          {/* Bandeau de confiance */}
          <div className="relative z-10 border-t border-white/[0.08] bg-ink/40 backdrop-blur-md">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:px-8 md:grid-cols-4">
              {t.hero.trust.map((item) => (
                <div key={item.k} className="flex items-baseline gap-3">
                  <span className="font-display text-2xl font-semibold text-white md:text-3xl">{item.k}</span>
                  <span className="text-xs leading-snug text-slate-400 md:text-sm">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* PREUVE : projets déjà en ligne                               */}
        {/* ------------------------------------------------------------ */}
        <section className="border-b border-white/5 py-8" aria-label={fr ? 'Projets en ligne' : 'Live projects'}>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-10 gap-y-3 px-5 sm:px-8 md:flex-row">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {fr ? 'Déjà en ligne' : 'Already live'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:justify-start">
              {clientNames.map((name) => (
                <span key={name} className="font-display text-base font-medium text-slate-400">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* OFFRES                                                        */}
        {/* ------------------------------------------------------------ */}
        <section id="services" className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
              <span className="eyebrow">{t.services.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.services.title}</h2>
              <p className="mt-5 text-base text-slate-400 md:text-lg">{t.services.subtitle}</p>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
              {plans.map((plan, i) => (
                <Reveal key={plan.id} delay={i * 100} className={plan.featured ? 'md:-my-4' : ''}>
                  <div
                    className={`${plan.featured ? 'card-featured shadow-[0_30px_80px_-30px_rgba(10,239,187,0.35)]' : 'card'} flex h-full flex-col p-7 md:p-8`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-300">{plan.tag}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                          plan.featured
                            ? 'bg-brand-lime/15 text-brand-lime'
                            : 'bg-white/[0.06] text-slate-400'
                        }`}
                      >
                        {plan.data.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-2xl font-semibold text-white">{plan.data.title}</h3>
                    <div className="mt-4">
                      <div
                        className={`font-display text-4xl font-semibold tracking-tight ${plan.featured ? 'text-gradient' : 'text-white'}`}
                      >
                        {plan.data.price}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">{plan.data.subPrice}</div>
                    </div>

                    <div className="my-7 h-px bg-white/[0.08]" />

                    <ul className="mb-8 flex-1 space-y-3.5">
                      {plan.data.features.map((item) => (
                        <li key={item.text} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          {item.text}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleServiceSelect(plan.id)}
                      className={`btn w-full ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {plan.data.btn}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Option Sérénité */}
            <Reveal className="mt-14 md:mt-20">
              <button
                type="button"
                onClick={() => handleServiceSelect('maintenance_only')}
                className="card group flex w-full flex-col items-start gap-6 p-6 text-left md:flex-row md:items-center md:justify-between md:p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-lime/10 text-brand-lime ring-1 ring-brand-lime/25">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-semibold text-white">{t.services.maintenanceTitle}</h3>
                      <span className="rounded-full bg-brand-lime/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-lime">
                        {t.services.maintenanceHighlight}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">{t.services.maintenanceDesc}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                      {t.services.maintenanceBenefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                          <Check className="h-4 w-4 text-brand-mint" strokeWidth={3} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex w-full shrink-0 items-center justify-between gap-6 md:w-auto md:flex-col md:items-end md:gap-2">
                  <span className="font-display text-3xl font-semibold text-white">{t.services.maintenancePrice}</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-mint transition-all group-hover:gap-3">
                    {t.services.maintenanceCta} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* MÉTHODE                                                       */}
        {/* ------------------------------------------------------------ */}
        <section id="methode" className="relative overflow-hidden border-y border-white/5 bg-surface/60 py-20 md:py-28">
          <SectionLines variant="a" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-14 max-w-2xl md:mb-20">
              <span className="eyebrow">{t.stack.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.stack.title}</h2>
              <p className="mt-5 text-base text-slate-400 md:text-lg">{t.stack.subtitle}</p>
            </Reveal>

            <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-6">
              <div
                className="absolute left-[1.35rem] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-lime/60 via-brand-mint/30 to-transparent md:hidden"
                aria-hidden="true"
              />
              <div
                className="absolute left-0 right-0 top-[1.35rem] hidden h-px bg-gradient-to-r from-brand-lime/60 via-brand-mint/40 to-transparent md:block"
                aria-hidden="true"
              />
              {t.stack.steps.map((step, i) => (
                <Reveal as="li" key={step.t} delay={i * 90} className="relative pl-16 md:pl-0">
                  <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-brand-mint/40 bg-ink font-display text-sm font-semibold text-brand-mint shadow-[0_0_24px_-4px_rgba(10,239,187,0.5)] md:relative">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white md:mt-6">{step.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* POURQUOI 3GEEKS                                               */}
        {/* ------------------------------------------------------------ */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">{t.whyUs.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.whyUs.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{t.whyUs.subtitle}</p>
              <button type="button" onClick={() => scrollToSection('contact')} className="btn btn-primary mt-8">
                {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </button>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {whyCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <Reveal key={card.title} delay={i * 90}>
                    <div className="card h-full p-7">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-white">{card.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">{card.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* RÉALISATIONS                                                  */}
        {/* ------------------------------------------------------------ */}
        <ProjectsShowcase lang={lang} onContact={() => scrollToSection('contact')} />

        {/* ------------------------------------------------------------ */}
        {/* EXPERTISE                                                     */}
        {/* ------------------------------------------------------------ */}
        <SkillsRadar lang={lang} />

        {/* ------------------------------------------------------------ */}
        {/* AVIS                                                          */}
        {/* ------------------------------------------------------------ */}
        <section id="temoignages" className="relative border-t border-white/5 bg-surface/60 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-12 max-w-2xl md:mb-16">
              <span className="eyebrow">{t.reviews.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.reviews.title}</h2>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {reviews.map((review, i) => (
                <Reveal key={review.name} delay={i * 90}>
                  <figure className="card flex h-full flex-col p-7">
                    <div className="flex gap-1 text-brand-lime" aria-label="5/5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-5 flex-1 text-base leading-relaxed text-slate-200">
                      “{review.text}”
                    </blockquote>
                    <figcaption className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-mint/10 font-display text-sm font-semibold text-brand-mint ring-1 ring-brand-mint/30">
                        {review.initial}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">{review.name}</span>
                        <span className="block text-xs text-slate-500">{review.meta}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* CONTACT                                                       */}
        {/* ------------------------------------------------------------ */}
        <section id="contact" className="relative overflow-hidden py-20 md:py-28">
          <SectionLines variant="c" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <Reveal>
              <span className="eyebrow">{t.contact.path}</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{t.contact.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{t.contact.subtitle}</p>

              <div className="mt-10 space-y-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex items-center gap-4 p-5 hover:bg-surface-2"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366] ring-1 ring-[#25D366]/30">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white">WhatsApp</span>
                    <span className="block text-sm text-slate-400">{t.contact.direct.subtitle}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </a>
                <a
                  href="mailto:contact@3geeks.fr"
                  className="card group flex items-center gap-4 p-5 hover:bg-surface-2"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white">contact@3geeks.fr</span>
                    <span className="block text-sm text-slate-400">{fr ? 'Réponse sous 24h' : 'Reply within 24h'}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card-featured p-6 md:p-10">
                {formStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint ring-1 ring-brand-mint/30">
                      <Check className="h-8 w-8" strokeWidth={2.5} />
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-white">{t.contact.successTitle}</h3>
                    <p className="mt-2 max-w-xs text-slate-400">{t.contact.successDesc}</p>
                    <p className="mt-6 rounded-xl border border-brand-mint/25 bg-brand-mint/[0.06] px-4 py-3 text-sm text-brand-mint">
                      {t.contact.successTip}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="c-name" className={labelClass}>{t.contact.form.name}</label>
                        <input id="c-name" name="name" required type="text" placeholder={t.booking.namePlaceholder} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="c-email" className={labelClass}>{t.contact.form.email}</label>
                        <input id="c-email" name="email" required type="email" placeholder={t.booking.emailPlaceholder} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="c-type" className={labelClass}>{t.contact.form.type}</label>
                        <div className="relative">
                          <select id="c-type" name="type" className={`${inputClass} cursor-pointer appearance-none pr-10`}>
                            {t.contact.form.types.map((type) => (
                              <option key={type} className="bg-surface text-white" value={type}>{type}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="c-service" className={labelClass}>{t.contact.form.serviceInterest}</label>
                        <div className="relative">
                          <select id="c-service" name="service" className={`${inputClass} cursor-pointer appearance-none pr-10`}>
                            {t.contact.form.serviceOptions.map((opt) => (
                              <option key={opt} className="bg-surface text-white" value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="c-message" className={labelClass}>{t.contact.form.message}</label>
                      <textarea
                        id="c-message"
                        name="message"
                        required
                        rows={5}
                        placeholder={fr ? 'Parlez-nous de votre projet, de vos objectifs et de votre échéance…' : 'Tell us about your project, goals and deadline…'}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="btn btn-primary w-full !py-4 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                          {t.contact.form.sending}
                        </>
                      ) : (
                        <>
                          {t.contact.form.btn} <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-500">
                      {fr ? 'Réponse sous 24h · Sans engagement' : 'Reply within 24h · No commitment'}
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <AiAgentWidget lang={lang} onNavigateSection={scrollToSection} />

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

      {/* ------------------------------------------------------------ */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------ */}
      <footer className="border-t border-white/[0.07] bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[minmax(0,2fr)_1fr_1fr]">
          <div>
            <Logo variant="wordmark" compact glow={false} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">{t.footer.blurb}</p>
            <p className="mt-5 text-sm font-medium text-brand-lime">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {fr ? 'Navigation' : 'Navigate'}
            </h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {t.nav[link.key]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href="mailto:contact@3geeks.fr" className="text-slate-300 transition-colors hover:text-white">
                  contact@3geeks.fr
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  +33 6 71 61 81 19
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 pb-24 text-xs text-slate-500 sm:px-8 md:flex-row md:pb-6 md:pr-64">
            <span>© {new Date().getFullYear()} 3geeks. {t.footer.rights}</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button type="button" onClick={() => openLegal('legal')} className="transition-colors hover:text-white">{t.legal.tabs.legal}</button>
              <button type="button" onClick={() => openLegal('privacy')} className="transition-colors hover:text-white">{t.legal.tabs.privacy}</button>
              <button type="button" onClick={() => openLegal('terms')} className="transition-colors hover:text-white">{t.legal.tabs.terms}</button>
              <button
                type="button"
                onClick={() => setAdminOpen(true)}
                className="text-slate-700 transition-colors hover:text-slate-500"
                title="Admin"
                aria-label="Admin"
              >
                <Lock className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
