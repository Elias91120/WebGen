
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Code2,
  Database,
  Globe,
  Layers,
  Lock,
  Menu,
  RefreshCw,
  Rocket,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Users,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useState, Suspense, lazy } from 'react';
import BlurText from './components/BlurText';
import CookieConsent from './components/CookieConsent';
import GradientText from './components/GradientText';
import IntroScreen from './components/IntroScreen';
import LegalModals from './components/LegalModals';
import Logo from './components/Logo';
import SplitText from './components/SplitText';
import TextType from './components/TextType';
import { supabase } from './services/supabaseClient';
import { ClientRequest, ServiceType } from './types';

// Lazy-loaded components for performance optimization
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const BookingModal = lazy(() => import('./components/BookingModal'));
const FloatingLines = lazy(() => import('./components/FloatingLines'));

// Team Photos
import eliasImg from './assets/images/Elias.jpeg';
import noamImg from './assets/images/Noam.jpeg';
import charlesImg from './assets/images/Charles.jpeg';
import callKitchenImg from './assets/images/CallKitchen.jpeg';
import divorceImg from './assets/images/divorce.png';

type Lang = 'en' | 'fr';

const translations = {
  en: {
    nav: {
      services: "The Lab",
      team: "Founders",
      reviews: "Trust",
      cta: "Let's Talk",
    },
    hero: {
      badge: "Engineering x Design • React Experts",
      titleStart: "Simple solutions to",
      titleEnd: "skyrocket your business.",
      subtitle: "We are WebGen. A team of three young engineers & creatives bringing high-end tech to local businesses. Fast, animated, and built to perform.",
      ctaPrimary: "Launch Project",
    },
    projects: {
      badge: "Our Work",
      title: "Recent Projects",
      subtitle: "See how we merge smart technology with beautiful UI.",
      p1: {
        title: "Express Divorce USA",
        desc: "A technology platform designed to transform the U.S. divorce procedure into a smooth, purely digital experience. It automatically generates all legal documents for uncontested cases, saving users time and significant legal fees.",
        link: "https://www.expressdivorceusa.co",
        btn: "View Project"
      },
      p2: {
        title: "CallKitchen",
        desc: "An AI-powered phone reception agent specifically for restaurants. It uses advanced, natural-sounding voice AI to take orders, handle complex menus, and manage bookings 24/7 so the kitchen never misses a call during a rush.",
        link: "https://call-kitchen-landing.vercel.app",
        btn: "View Landing Page"
      },
      p3: {
        title: "Two",
        desc: "An all-in-one iOS app designed as a private digital cocoon for couples. It centralizes real-time location tracking, shared calendars, joint finances, secure document storage, and fun mini-games into one elegant interface.",
        link: "https://apps.apple.com/fr/app/two/id6758867716",
        btn: "App Store"
      }
    },
    whyUs: {
      title: "Our DNA",
      subtitle: "We combine data science rigor with creative freedom.",
      card1: {
        title: "React Native Feel",
        desc: "We don't just build websites; we build experiences. Elias ensures your site feels like a premium app with fluid animations and instant interactions."
      },
      card2: {
        title: "Data-Driven Engineering",
        desc: "With our background in Data & AI, we structure your information logically. Noam ensures the backend is as solid as a bank vault."
      },
      card3: {
        title: "Local Business Focus",
        desc: "We apply big-tech standards to your restaurant, shop, or agency. Why should only startups have cool websites?"
      },
      card4: {
        title: "Human Connection",
        desc: "No robots on the phone. Charles is your dedicated partner, translating your vision into our code. We are real people building for real people."
      },
    },
    services: {
      badge: "Solutions",
      title: "The Code in Action",
      maintenanceTitle: "Peace of Mind Option",
      maintenanceDesc: "Add 24/7 monitoring, security updates, and content tweaks to any plan for just",
      maintenancePrice: "€50/month",
      s1: {
        title: "The React Starter",
        price: "€300",
        subPrice: "One-off payment",
        badge: "Entry Point",
        btn: "Start Now",
        features: ['Full React Single Page', 'Ultra-Fast Loading', 'Modern UI/UX Design', 'Contact Form Integration', 'Mobile Optimized']
      },
      s2: {
        title: "Full Stack Custom",
        price: "Custom Quote",
        subPrice: "Based on complexity",
        badge: "Best Seller",
        btn: "Contact Us",
        features: ['Interactive Booking Systems', 'E-commerce & Payments', 'User Accounts & Data', 'Custom Admin Dashboard', 'Advanced API Integration']
      },
      s3: {
        title: "The Glow Up (Redesign)",
        price: "Custom Quote",
        subPrice: "Audit & Overhaul",
        badge: "Upgrade",
        btn: "Auditing Request",
        features: ['Complete Visual Overhaul', 'Code Performance Audit', 'Migration to React', 'SEO Preservation', 'Modern Animations']
      }
    },
    team: {
      badge: "The Trio",
      title: "Meet the Founders",
      subtitle: "Friends, Engineers, and Creators. We merge our skills to build the web of tomorrow.",
      roles: {
        elias: "Creative Tech Lead",
        eliasDesc: "The React Enthusiast. Elias lives for UI/UX and smooth animations. He creates the 'wow' effect that makes your customers stay.",
        noam: "Backend & Data Lead",
        noamDesc: "The Architect. Specializing in Data & Robustness, he builds the solid logic and secure systems behind the beautiful interface.",
        charles: "Head of Growth",
        charlesDesc: "The Bridge. Charles connects the human needs of your business with our technical solutions. He ensures we solve your actual problems."
      }
    },
    reviews: {
      title: "They trust the process",
      r1: "\"I didn't know a website could feel this fast. The animations are subtle but make a huge difference. Great job guys.\"",
      r2: "\"Finally, a team that speaks my language. Charles understood my business constraints immediately.\"",
      r3: "\"The booking system Noam built is rock solid. It changed how I manage my appointments completely.\""
    },
    contact: {
      title: "Ready to upgrade?",
      subtitle: "Tell us about your project. We analyze, we design, we code.",
      successTitle: "Received!",
      successDesc: "The WebGen team will be in touch shortly.",
      successTip: "Check the option on the right to chat directly with Charles if it's urgent!",
      form: {
        name: "Full Name",
        email: "Email",
        type: "Business Type",
        serviceInterest: "Solution Interest",
        message: "Message & Project Details",
        btn: "Send Request",
        sending: "Sending...",
        types: ["Restaurant / Bar", "Retail / Shop", "Service / Craftsman", "Health / Medical", "Other"],
        serviceOptions: ["React Starter (€300)", "Full Stack Custom", "The Glow Up (Redesign)", "Maintenance Only", "Other / Not Sure"]
      },
      direct: {
        title: "Or contact Charles directly",
        subtitle: "Skip the form. Chat via WhatsApp.",
        phone: "+33 6 71 61 81 19"
      }
    },
    footer: {
      rights: "All rights reserved.",
      links: ["Legal", "Privacy", "Terms"]
    },
    cookie: {
      title: "We use cookies",
      desc: "We use cookies to enhance your browsing experience and analyze our traffic. By clicking 'Accept', you consent to our use of cookies.",
      accept: "Accept",
      decline: "Decline"
    },
    legal: {
      title: "Legal Information",
      tabs: {
        legal: "Legal Notice",
        privacy: "Privacy Policy",
        terms: "T&Cs"
      },
      content: {
        legal: [
          {
            title: "1. Website Editor",
            text: "The WebGen website is edited by the WebGen team.\nEmail: contact@webgen.com\nPhone: +33 6 71 61 81 19"
          },
          {
            title: "2. Hosting",
            text: "The website is hosted by Vercel Inc.\nAddress: 340 S Lemon Ave #4133 Walnut, CA 91789, USA"
          },
          {
            title: "3. Intellectual Property",
            text: "This entire site is subject to French and international legislation on copyright and intellectual property. All reproduction rights are reserved."
          }
        ],
        privacy: [
          {
            title: "1. Data Collection",
            text: "We collect the following information via our contact form:\n- First and Last Name\n- Email address\n- Company name\n- Project details"
          },
          {
            title: "2. Data Usage",
            text: "This data is used solely to:\n- Respond to your contact requests\n- Establish quotes\n- Contact you regarding commercial relations\n\nYour data is never sold to third parties."
          },
          {
            title: "3. Your Rights",
            text: "In accordance with the GDPR, you have the right to access, rectify, and delete your data. To exercise this right, contact us at contact@webgen.com."
          },
          {
            title: "4. Cookies",
            text: "This site uses essential cookies for operation and analytics cookies to improve your experience. You can manage your preferences via the consent banner."
          }
        ],
        terms: [
          {
            title: "1. Purpose",
            text: "These conditions govern the sales of web development services by WebGen."
          },
          {
            title: "2. Price",
            text: "The prices of our services are indicated in euros. WebGen reserves the right to modify its prices at any time, but the service will be billed based on the rate in effect at the time the quote is validated."
          },
          {
            title: "3. Payment",
            text: "Payment is due upon signing the quote (deposit) and upon delivery of the project (balance)."
          },
          {
            title: "4. Delivery",
            text: "Delivery times are given as an indication and may vary depending on the complexity of the project and the responsiveness of the client."
          }
        ]
      },
      close: "Close"
    }
  },
  fr: {
    nav: {
      services: "Le Lab",
      team: "Fondateurs",
      reviews: "Confiance",
      cta: "On Discute ?",
    },
    hero: {
      badge: "Ingénierie x Design • Experts React",
      titleStart: "Des solutions simples",
      titleEnd: "pour faire décoller votre commerce.",
      subtitle: "Nous sommes WebGen. Une équipe de trois jeunes ingénieurs & créatifs. Nous apportons la tech de pointe aux commerces locaux. Rapide, animé, performant.",
      ctaPrimary: "Lancer le Projet",
    },
    projects: {
      badge: "Nos Réalisations",
      title: "Projets Récents",
      subtitle: "Voici comment nous allions technologies intelligentes et interfaces sublimes.",
      p1: {
        title: "Express Divorce USA",
        desc: "Plateforme technologique conçue pour transformer la procédure de divorce (amialbe) aux États-Unis en une expérience 100% numérique, abordable et fluide. Génération automatique de documents juridiques sans frais d'avocats traditionnels.",
        link: "https://www.expressdivorceusa.co",
        btn: "Voir le Projet"
      },
      p2: {
        title: "CallKitchen",
        desc: "Agent d'accueil téléphonique automatisé par IA pour les restaurants. Avec une voix naturelle, il gère les commandes complexes et les réservations 24/7 pour que le staff ne rate plus jamais d'appels pendant le rush.",
        link: "https://call-kitchen-landing.vercel.app",
        btn: "Voir la Landing Page"
      },
      p3: {
        title: "Two",
        desc: "Cocon numérique iOS tout-en-un dédié aux couples. Centralise la communication, les agendas partagés, la gestion des dépenses communes (Tricount), et des mini-jeux (CinéMatch) dans une interface élégante et privée.",
        link: "https://apps.apple.com/fr/app/two/id6758867716",
        btn: "App Store"
      }
    },
    whyUs: {
      title: "Notre ADN",
      subtitle: "Nous allions la rigueur de la Data Science à la liberté créative.",
      card1: {
        title: "Sensation React Native",
        desc: "On ne fait pas juste des sites, on crée des expériences. Elias s'assure que votre site soit vivant, avec des animations fluides (GSAP/Framer) et un design UI impeccable."
      },
      card2: {
        title: "Ingénierie & Data",
        desc: "Issus du monde de la Data & IA, nous structurons votre information avec logique. Noam garantit un back-end solide comme un roc."
      },
      card3: {
        title: "Focus Commerce Local",
        desc: "Pourquoi seules les startups auraient des sites cools ? Nous appliquons les standards de la tech à votre restaurant, boutique ou cabinet."
      },
      card4: {
        title: "Connexion Humaine",
        desc: "Pas de robots au téléphone. Charles est votre partenaire dédié. Il traduit vos besoins terrain en solutions techniques concrètes."
      }
    },
    services: {
      badge: "Solutions",
      title: "Le Code en Action",
      maintenanceTitle: "Option Sérénité",
      maintenanceDesc: "Ajoutez maintenance, mises à jour sécu et petits edits à n'importe quelle offre pour",
      maintenancePrice: "50€/mois",
      s1: {
        title: "Pack React Starter",
        price: "300€",
        subPrice: "Paiement unique",
        badge: "Essentiel",
        btn: "Démarrer",
        features: ['Site One-Page Full React', 'Chargement Instantané', 'Design UI/UX Moderne', 'Intégration Contact', 'Optimisé Mobile']
      },
      s2: {
        title: "Full Stack Custom",
        price: "Sur Devis",
        subPrice: "Selon complexité",
        badge: "Meilleure Vente",
        btn: "Nous Contacter",
        features: ['Systèmes de Réservation', 'E-commerce & Paiements', 'Gestion Utilisateurs & Data', 'Dashboard Admin Sur Mesure', 'Intégrations API Complexes']
      },
      s3: {
        title: "Le Glow Up (Refonte)",
        price: "Sur Devis",
        subPrice: "Audit & Mise à niveau",
        badge: "Upgrade",
        btn: "Demander un Audit",
        features: ['Refonte Visuelle Totale', 'Audit Performance Code', 'Migration vers React', 'Conservation SEO', 'Modernisation UX']
      },
    },
    team: {
      badge: "Le Trio",
      title: "Les Fondateurs",
      subtitle: "Amis, Ingénieurs et Créateurs. Nous fusionnons nos compétences pour bâtir le web de demain.",
      roles: {
        elias: "Lead Tech Créatif",
        eliasDesc: "Le Virtuose React. Elias vit pour l'UI/UX et les animations. C'est lui qui crée l'effet 'Wow' qui retient vos clients sur le site.",
        noam: "Lead Backend & Data",
        noamDesc: "L'Architecte. Spécialiste Data & Robustesse, il construit la logique solide et les systèmes sécurisés derrière la belle interface.",
        charles: "Responsable Croissance",
        charlesDesc: "Le Pont. Charles connecte l'humain à la tech. Il s'assure que nos lignes de code résolvent vos vrais problèmes business."
      }
    },
    reviews: {
      title: "Ils valident l'approche",
      r1: "\"Je ne savais pas qu'un site pouvait être aussi fluide. Les animations sont subtiles mais font toute la différence.\"",
      r2: "\"Enfin une équipe qui parle ma langue. Charles a tout de suite compris mes contraintes de commerçant.\"",
      r3: "\"Le système de réservation que Noam a mis en place est hyper robuste. Ça a changé ma gestion au quotidien.\""
    },
    contact: {
      title: "Prêt pour l'upgrade ?",
      subtitle: "Parlez-nous de votre projet. On analyse, on design, on code.",
      successTitle: "Bien reçu !",
      successDesc: "L'équipe WebGen vous recontacte très vite.",
      successTip: "Regardez l'option à droite pour discuter directement avec Charles si c'est urgent !",
      form: {
        name: "Nom Complet",
        email: "Email",
        type: "Type de Business",
        serviceInterest: "Solution Envisagée",
        message: "Message & Détails du Projet",
        btn: "Envoyer la demande",
        sending: "Envoi...",
        types: ["Restauration / Bar", "Commerce / Boutique", "Artisan / Service", "Santé / Médical", "Autre"],
        serviceOptions: ["Pack React Starter (300€)", "Full Stack Custom", "Le Glow Up (Refonte)", "Maintenance Seule", "Autre / Je ne sais pas"]
      },
      direct: {
        title: "Ou contactez Charles directement",
        subtitle: "Réponse rapide garantie.",
        phone: "+33 6 71 61 81 19"
      }
    },
    footer: {
      rights: "Tous droits réservés.",
      links: ["Mentions Légales", "Confidentialité", "CGV"]
    },
    cookie: {
      title: "Nous utilisons des cookies",
      desc: "Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser notre trafic. En cliquant sur \"Accepter\", vous consentez à notre utilisation des cookies.",
      accept: "Accepter",
      decline: "Refuser"
    },
    legal: {
      title: "Informations Légales",
      tabs: {
        legal: "Mentions Légales",
        privacy: "Politique de Confidentialité",
        terms: "CGV"
      },
      content: {
        legal: [
          {
            title: "1. Éditeur du site",
            text: "Le site WebGen est édité par l'équipe WebGen.\nEmail : contact@webgen.com\nTéléphone : +33 6 71 61 81 19"
          },
          {
            title: "2. Hébergement",
            text: "Le site est hébergé par Vercel Inc.\nAdresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA"
          },
          {
            title: "3. Propriété Intellectuelle",
            text: "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés."
          }
        ],
        privacy: [
          {
            title: "1. Collecte des données",
            text: "Nous collectons les informations suivantes via notre formulaire de contact :\n- Nom et Prénom\n- Adresse email\n- Nom de l'entreprise\n- Détails du projet"
          },
          {
            title: "2. Utilisation des données",
            text: "Ces données sont utilisées uniquement pour :\n- Répondre à vos demandes de contact\n- Établir des devis\n- Vous contacter dans le cadre de la relation commerciale\n\nVos données ne sont jamais vendues à des tiers."
          },
          {
            title: "3. Vos droits",
            text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à contact@webgen.com."
          },
          {
            title: "4. Cookies",
            text: "Ce site utilise des cookies essentiels au fonctionnement et des cookies d'analyse pour améliorer votre expérience. Vous pouvez gérer vos préférences via la bannière de consentment."
          }
        ],
        terms: [
          {
            title: "1. Objet",
            text: "Les présentes conditions régissent les ventes de prestations de services de développement web par WebGen."
          },
          {
            title: "2. Prix",
            text: "Les prix de nos services sont indiqués en euros. WebGen se réserve le droit de modifier ses prix à tout moment, mais le service sera facturé sur la base du tarif en vigueur au moment de la validation du devis."
          },
          {
            title: "3. Paiement",
            text: "Le paiement est exigible à la signature du devis (acompte) et à la livraison du projet (solde)."
          },
          {
            title: "4. Livraison",
            text: "Les délais de livraison sont donnés à titre indicatif et peuvent varier selon la complexité du projet et la réactivité du client."
          }
        ]
      },
      close: "Fermer"
    }
  }
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [lang, setLang] = useState<Lang>('en');

  // Booking & Admin State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  // GDPR State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'legal'>('legal');

  const openLegal = (tab: 'privacy' | 'terms' | 'legal') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const t = translations[lang];

  // Load requests from Supabase on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
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
      console.error('Error fetching requests:', error);
    }
  };

  // Handle Contact Form Submit (Simple contact from bottom section)
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

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([newRequest]);

      if (error) throw error;

      // Refresh list
      fetchRequests();
      setFormStatus('success');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
      setFormStatus('idle');
    }
  };

  // Handle Booking Submit (From Modal)
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

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([newRequest]);

      if (error) throw error;

      // Refresh list
      fetchRequests();
      setBookingModalOpen(false);
      setFormStatus('success');
      scrollToSection('contact');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    }
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleAdminStatusUpdate = async (id: string, status: ClientRequest['status']) => {
    try {
      const { error } = await supabase
        .from('client_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAdminDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const { error } = await supabase
        .from('client_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRequests(requests.filter(req => req.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
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
    setLang(prev => prev === 'en' ? 'fr' : 'en');
  }

  return (
    <>
    {showIntro ? (
      <IntroScreen onComplete={(selectedLang) => {
        setLang(selectedLang);
        setShowIntro(false);
      }} />
    ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-slate-100 font-sans relative overflow-x-hidden animate-in fade-in duration-700">

      {/* 3D Background - Floating Lines */}
      {/* Mounted but optimized. No prop changes needed as internal optimization handles DPR */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div className="fixed inset-0 bg-slate-950 -z-50" />}>
          <FloatingLines
            linesGradient={['#4f46e5', '#0891b2', '#7c3aed', '#ec4899']}
            topWavePosition={{ x: 0, y: 1.0, rotate: 0 }}
            middleWavePosition={{ x: 0, y: 0, rotate: 0 }}
            bottomWavePosition={{ x: 0, y: -1.0, rotate: 0 }}
            lineCount={[3, 5, 3]}
            lineDistance={[4, 5, 4]}
            animationSpeed={0.8}
            interactive={true}
            bendStrength={0.5}
            parallaxStrength={0.1}
          />
        </Suspense>
      </div>

      {/* Navbar - Glass */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <Logo className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]" />
              <span className="font-display font-bold text-lg md:text-2xl tracking-tight">
                <GradientText colors={['#fff', '#818cf8', '#fff']} animationSpeed={6}>WebGen</GradientText>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors">{t.nav.services}</button>
              <button onClick={() => scrollToSection('projets')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Projets</button>
              <button onClick={() => scrollToSection('equipe')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors">{t.nav.team}</button>
              <button onClick={() => scrollToSection('temoignages')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors">{t.nav.reviews}</button>

              <button onClick={toggleLang} className="flex items-center gap-1 text-slate-200 hover:text-white font-medium text-sm border border-white/10 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 transition-all">
                 <Globe className="w-3 h-3" /> {lang.toUpperCase()}
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="glass-button px-5 py-2.5 rounded-full text-white text-sm font-bold"
              >
                {t.nav.cta}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleLang} className="text-slate-200 font-bold text-sm">
                 {lang.toUpperCase()}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2">
             <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('services')} className="text-left font-medium text-slate-200 p-2 hover:bg-white/5 rounded-lg transition-colors">{t.nav.services}</button>
              <button onClick={() => scrollToSection('projets')} className="text-left font-medium text-slate-200 p-2 hover:bg-white/5 rounded-lg transition-colors">Projets</button>
              <button onClick={() => scrollToSection('equipe')} className="text-left font-medium text-slate-200 p-2 hover:bg-white/5 rounded-lg transition-colors">{t.nav.team}</button>
              <button onClick={() => scrollToSection('temoignages')} className="text-left font-medium text-slate-200 p-2 hover:bg-white/5 rounded-lg transition-colors">{t.nav.reviews}</button>
              <button onClick={() => scrollToSection('contact')} className="bg-indigo-600 text-white p-3 rounded-lg font-bold text-center shadow-lg shadow-indigo-500/20">{t.nav.cta}</button>
             </div>
          </div>
        )}
      </nav>

      <main className="pt-24 md:pt-28 relative z-10">

        {/* HERO SECTION */}
        <section className="relative pt-12 md:pt-16 pb-16 md:pb-20">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="glass-panel p-6 md:p-10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-4xl mx-auto">
               <div className="text-center space-y-4 md:space-y-6">

                 <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 md:mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700 backdrop-blur-sm">
                    <Rocket className="w-4 h-4 text-indigo-400" />
                    <TextType
                      text={["React Experts", "High Performance", "Mobile First", "WebGen Studio"]}
                      typingSpeed={80}
                      deletingSpeed={40}
                      pauseDuration={2000}
                      loop={true}
                    />
                 </div>

                 <div className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                   <SplitText
                     text={t.hero.titleStart}
                     className="block mb-1 md:mb-2"
                     delay={50}
                   />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-pulse block">
                     {t.hero.titleEnd}
                   </span>
                 </div>

                 <div className="max-w-2xl mx-auto">
                   <BlurText
                      text={t.hero.subtitle}
                      className="text-base md:text-lg text-slate-100 leading-relaxed font-medium drop-shadow-md text-center justify-center"
                      delay={30}
                   />
                 </div>

                 <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500">
                   <button onClick={() => scrollToSection('contact')} className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 border border-white/10 text-sm md:text-base">
                      {t.hero.ctaPrimary} <ArrowRight className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* WHY US (Bento Grid) - Glass Panels */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title Container - Glass Box */}
            <div className="max-w-3xl mx-auto mb-12 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl text-center shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                 <GradientText colors={['#fff', '#a5b4fc', '#fff']} animationSpeed={8}>{t.whyUs.title}</GradientText>
              </h2>
              <p className="text-slate-300 font-medium">{t.whyUs.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Card 1 */}
               <div className="glass-panel col-span-1 md:col-span-2 p-8 rounded-3xl hover:bg-slate-900/80 transition-all duration-500 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
                  <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-indigo-400 group-hover:scale-110 transition-transform group-hover:text-indigo-300">
                     <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.whyUs.card1.title}</h3>
                  <p className="text-slate-200 leading-relaxed transition-colors">
                    {t.whyUs.card1.desc}
                  </p>
               </div>

               {/* Card 2 */}
               <div className="bg-gradient-to-br from-indigo-900/70 to-slate-900/70 p-8 rounded-3xl border border-indigo-500/30 text-white relative overflow-hidden group backdrop-blur-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-indigo-300 backdrop-blur-sm relative z-10 border border-white/10">
                     <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 relative z-10">{t.whyUs.card2.title}</h3>
                  <p className="text-indigo-100 leading-relaxed relative z-10 font-medium">
                    {t.whyUs.card2.desc}
                  </p>
               </div>

               {/* Card 3 */}
               <div className="glass-panel p-8 rounded-3xl hover:bg-slate-900/80 transition-all duration-500 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                  <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-orange-400 group-hover:rotate-12 transition-transform">
                     <Store className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.whyUs.card3.title}</h3>
                  <p className="text-slate-200 leading-relaxed transition-colors">
                    {t.whyUs.card3.desc}
                  </p>
               </div>

               {/* Card 4 */}
               <div className="col-span-1 md:col-span-2 glass-panel p-8 rounded-3xl hover:bg-slate-900/80 transition-all duration-500 group hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-sm text-cyan-400 flex-shrink-0">
                       <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t.whyUs.card4.title}</h3>
                      <p className="text-slate-200 leading-relaxed">
                        {t.whyUs.card4.desc}
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-16 relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Title Container - Glass Box */}
              <div className="max-w-3xl mx-auto mb-12 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl text-center shadow-2xl">
                 <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2 block animate-pulse">{t.services.badge}</span>
                 <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                    <GradientText colors={['#818cf8', '#2dd4bf', '#818cf8']} animationSpeed={6}>{t.services.title}</GradientText>
                 </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Service 1: Entry Point */}
                 <div className="glass-panel p-8 rounded-2xl hover:border-indigo-500 transition-all duration-300 flex flex-col group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)]">
                    <div className="inline-block bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">{t.services.s1.badge}</div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">{t.services.s1.title}</h3>
                    <div className="mb-6">
                       <div className="text-3xl font-bold text-white">{t.services.s1.price}</div>
                       <div className="text-sm text-slate-300">{t.services.s1.subPrice}</div>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                       {t.services.s1.features.map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                            <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0 group-hover:text-indigo-300 transition-colors" /> {item}
                         </li>
                       ))}
                    </ul>
                    <button onClick={() => handleServiceSelect('starter')} className="w-full py-3 border border-white/10 bg-white/5 rounded-xl font-bold text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all">{t.services.s1.btn}</button>
                 </div>

                 {/* Service 2 (Full Stack - Custom) */}
                 <div className="bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-indigo-500 relative transform md:-translate-y-4 hover:md:-translate-y-5 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:shadow-[0_0_80px_rgba(79,70,229,0.5)] flex flex-col z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-indigo-400/50">{t.services.s2.badge}</div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">{t.services.s2.title}</h3>
                    <div className="mb-6">
                       <div className="text-3xl font-bold text-indigo-400">{t.services.s2.price}</div>
                       <div className="text-sm text-indigo-200">{t.services.s2.subPrice}</div>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                       {t.services.s2.features.map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-slate-100 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" /> {item}
                         </li>
                       ))}
                    </ul>
                    <button onClick={() => handleServiceSelect('custom')} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 border border-indigo-400/20">{t.services.s2.btn}</button>
                 </div>

                 {/* Service 3 (Refonte) */}
                 <div className="glass-panel p-8 rounded-2xl hover:border-orange-500 transition-all duration-300 flex flex-col group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.3)]">
                    <div className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">{t.services.s3.badge}</div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">{t.services.s3.title}</h3>
                    <div className="mb-6">
                       <div className="text-3xl font-bold text-white">{t.services.s3.price}</div>
                       <div className="text-sm text-slate-300">{t.services.s3.subPrice}</div>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                       {t.services.s3.features.map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                            <RefreshCw className="w-4 h-4 text-orange-400 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" /> {item}
                         </li>
                       ))}
                    </ul>
                    <button onClick={() => handleServiceSelect('redesign')} className="w-full py-3 border border-white/10 bg-white/5 rounded-xl font-bold text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all">{t.services.s3.btn}</button>
                 </div>
              </div>

              {/* Maintenance & Support Add-on */}
              <div
                className="mt-12 max-w-2xl mx-auto glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-slate-900/80 transition-all duration-300 group hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-1 cursor-pointer"
                onClick={() => handleServiceSelect('maintenance_only')}
              >
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-lg">{t.services.maintenanceTitle}</h4>
                       <p className="text-slate-300 text-sm max-w-sm">
                          {t.services.maintenanceDesc} <span className="text-indigo-400 font-bold">{t.services.maintenancePrice}</span>.
                       </p>
                    </div>
                 </div>
                 <button className="whitespace-nowrap px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-sm font-bold text-white transition-all">
                    + Add Option
                 </button>
              </div>
           </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projets" className="py-24 relative bg-slate-900/40">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Title Container - Glass Box */}
              <div className="max-w-3xl mx-auto mb-16 bg-slate-900/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl text-center shadow-2xl">
                 <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2 block animate-pulse">{t.projects.badge}</span>
                 <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                    <GradientText colors={['#fff', '#6366f1', '#fff']} animationSpeed={6}>{t.projects.title}</GradientText>
                 </h2>
                 <p className="text-slate-300 max-w-2xl mx-auto font-medium">{t.projects.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Project 1: Express Divorce USA */}
                 <div className="glass-panel p-8 rounded-3xl hover:bg-slate-900/80 transition-all duration-300 group flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="w-16 h-16 bg-white/5 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform relative z-10 overflow-hidden p-3 backdrop-blur-md">
                       <img src={divorceImg} alt="Express Divorce App" loading="lazy" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{t.projects.p1.title}</h3>
                    <p className="text-slate-300 leading-relaxed font-medium mb-8 flex-1 relative z-10">{t.projects.p1.desc}</p>
                    <a
                      href={t.projects.p1.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-all relative z-10 group/btn"
                    >
                       {t.projects.p1.btn} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                 </div>

                 {/* Project 2: CallKitchen */}
                 <div className="bg-gradient-to-br from-indigo-900/80 to-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-indigo-500/50 flex flex-col transform md:-translate-y-4 hover:md:-translate-y-6 hover:scale-[1.02] transition-all duration-500 shadow-[0_0_40px_rgba(79,70,229,0.15)] hover:shadow-[0_0_80px_rgba(79,70,229,0.4)] relative overflow-hidden z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-32 h-32 bg-indigo-500/40 rounded-full blur-3xl opacity-50"></div>
                    <div className="w-16 h-16 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-xl overflow-hidden group-hover:scale-110 transition-transform p-1">
                       <img src={callKitchenImg} alt="CallKitchen App" loading="lazy" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{t.projects.p2.title}</h3>
                    <p className="text-indigo-100/90 leading-relaxed font-medium mb-8 flex-1 relative z-10">{t.projects.p2.desc}</p>
                    <a
                      href={t.projects.p2.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 transition-all relative z-10 group/btn"
                    >
                       {t.projects.p2.btn} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                 </div>

                 {/* Project 3: Two */}
                 <div className="glass-panel p-8 rounded-3xl hover:bg-slate-900/80 transition-all duration-300 group flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(236,72,153,0.3)] border border-white/10 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform relative z-10 overflow-hidden p-1">
                       <img src="https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/8a/87/0f/8a870f74-5c66-359c-2901-e2fd674575f7/Placeholder.mill/400x400bb-75.webp" alt="Two App" loading="lazy" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{t.projects.p3.title}</h3>
                    <p className="text-slate-300 leading-relaxed font-medium mb-8 flex-1 relative z-10">{t.projects.p3.desc}</p>
                    <a
                      href={t.projects.p3.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-all relative z-10 group/btn"
                    >
                       {t.projects.p3.btn} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                 </div>
              </div>
           </div>
        </section>

        {/* TEAM SECTION */}
        <section id="equipe" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title Container - Glass Box */}
            <div className="max-w-3xl mx-auto mb-16 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl text-center shadow-2xl">
              <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2 block">{t.team.badge}</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{t.team.title}</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">{t.team.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Member 1: Elias (Front) */}
              <div className="glass-panel p-6 rounded-2xl hover:bg-slate-900/80 transition-all duration-300 group text-center flex flex-col items-center hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)]">
                 <div className="relative w-28 h-28 mb-6 group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-indigo-500/50">
                    <img
                      src={eliasImg}
                      alt="Elias Eloumi"
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                 </div>
                 <h3 className="text-xl font-bold text-white">Elias Eloumi</h3>
                 <p className="text-indigo-400 font-medium text-sm mb-4 flex items-center gap-1 justify-center"><Sparkles className="w-3 h-3" />{t.team.roles.elias}</p>
                 <p className="text-slate-200 text-sm mb-6 max-w-xs leading-relaxed font-medium">{t.team.roles.eliasDesc}</p>
                 <a
                   href="https://www.linkedin.com/in/elias-eloumi/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group mt-auto w-12 hover:w-44 h-12 hover:bg-sky-600 relative bg-sky-700 rounded-xl text-neutral-50 duration-700 before:duration-700 before:hover:500 font-bold flex justify-start gap-2 items-center p-2 pr-6 before:absolute before:-z-10 before:left-8 before:hover:left-40 before:w-6 before:h-6 before:bg-sky-700 before:hover:bg-sky-600 before:rotate-45"
                 >
                   <svg
                     y="0"
                     xmlns="http://www.w3.org/2000/svg"
                     x="0"
                     width="100"
                     viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid meet"
                     height="100"
                     className="w-8 h-8 shrink-0 fill-neutral-50"
                   >
                     <path
                       d="M92.86,0H7.12A7.17,7.17,0,0,0,0,7.21V92.79A7.17,7.17,0,0,0,7.12,100H92.86A7.19,7.19,0,0,0,100,92.79V7.21A7.19,7.19,0,0,0,92.86,0ZM30.22,85.71H15.4V38H30.25V85.71ZM22.81,31.47a8.59,8.59,0,1,1,8.6-8.59A8.6,8.6,0,0,1,22.81,31.47Zm63,54.24H71V62.5c0-5.54-.11-12.66-7.7-12.66s-8.91,6-8.91,12.26V85.71H39.53V38H53.75v6.52H54c2-3.75,6.83-7.7,14-7.7,15,0,17.79,9.89,17.79,22.74Z"
                     ></path>
                   </svg>
                   <span className="origin-left inline-flex duration-100 group-hover:duration-300 group-hover:delay-500 opacity-0 group-hover:opacity-100 border-l-2 border-white/30 px-2 ml-1 transform scale-x-0 group-hover:scale-x-100 transition-all truncate text-sm">
                     Elias Eloumi
                   </span>
                 </a>
              </div>

              {/* Member 2: Noam (Back) */}
              <div className="glass-panel p-6 rounded-2xl hover:bg-slate-900/80 transition-all duration-300 group text-center flex flex-col items-center hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)]">
                 <div className="relative w-28 h-28 mb-6 group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-indigo-500/50">
                    <img
                      src={noamImg}
                      alt="Noam Leclappart"
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                 </div>
                 <h3 className="text-xl font-bold text-white">Noam Leclappart</h3>
                 <p className="text-slate-300 font-medium text-sm mb-4 flex items-center gap-1 justify-center"><Database className="w-3 h-3" />{t.team.roles.noam}</p>
                 <p className="text-slate-200 text-sm mb-6 max-w-xs leading-relaxed font-medium">{t.team.roles.noamDesc}</p>
                 <a
                   href="https://www.linkedin.com/in/noam-leclapart-jublot/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group mt-auto w-12 hover:w-44 h-12 hover:bg-sky-600 relative bg-sky-700 rounded-xl text-neutral-50 duration-700 before:duration-700 before:hover:500 font-bold flex justify-start gap-2 items-center p-2 pr-6 before:absolute before:-z-10 before:left-8 before:hover:left-40 before:w-6 before:h-6 before:bg-sky-700 before:hover:bg-sky-600 before:rotate-45"
                 >
                   <svg
                     y="0"
                     xmlns="http://www.w3.org/2000/svg"
                     x="0"
                     width="100"
                     viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid meet"
                     height="100"
                     className="w-8 h-8 shrink-0 fill-neutral-50"
                   >
                     <path
                       d="M92.86,0H7.12A7.17,7.17,0,0,0,0,7.21V92.79A7.17,7.17,0,0,0,7.12,100H92.86A7.19,7.19,0,0,0,100,92.79V7.21A7.19,7.19,0,0,0,92.86,0ZM30.22,85.71H15.4V38H30.25V85.71ZM22.81,31.47a8.59,8.59,0,1,1,8.6-8.59A8.6,8.6,0,0,1,22.81,31.47Zm63,54.24H71V62.5c0-5.54-.11-12.66-7.7-12.66s-8.91,6-8.91,12.26V85.71H39.53V38H53.75v6.52H54c2-3.75,6.83-7.7,14-7.7,15,0,17.79,9.89,17.79,22.74Z"
                     ></path>
                   </svg>
                   <span className="origin-left inline-flex duration-100 group-hover:duration-300 group-hover:delay-500 opacity-0 group-hover:opacity-100 border-l-2 border-white/30 px-2 ml-1 transform scale-x-0 group-hover:scale-x-100 transition-all truncate text-sm">
                     Noam Leclappart
                   </span>
                 </a>
              </div>

               {/* Member 3: Charles (Sales) */}
              <div className="glass-panel p-6 rounded-2xl hover:bg-slate-900/80 transition-all duration-300 group text-center flex flex-col items-center hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)]">
                 <div className="relative w-28 h-28 mb-6 group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-orange-500/50">
                    <img
                      src={charlesImg}
                      alt="Charles Garbus"
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                 </div>
                 <h3 className="text-xl font-bold text-white">Charles Garbus</h3>
                 <p className="text-orange-400 font-medium text-sm mb-4 flex items-center gap-1 justify-center"><Users className="w-3 h-3" />{t.team.roles.charles}</p>
                 <p className="text-slate-200 text-sm mb-6 max-w-xs leading-relaxed font-medium">{t.team.roles.charlesDesc}</p>
                 <a
                   href="https://www.linkedin.com/in/charlesgarbus/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group mt-auto w-12 hover:w-44 h-12 hover:bg-sky-600 relative bg-sky-700 rounded-xl text-neutral-50 duration-700 before:duration-700 before:hover:500 font-bold flex justify-start gap-2 items-center p-2 pr-6 before:absolute before:-z-10 before:left-8 before:hover:left-40 before:w-6 before:h-6 before:bg-sky-700 before:hover:bg-sky-600 before:rotate-45"
                 >
                   <svg
                     y="0"
                     xmlns="http://www.w3.org/2000/svg"
                     x="0"
                     width="100"
                     viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid meet"
                     height="100"
                     className="w-8 h-8 shrink-0 fill-neutral-50"
                   >
                     <path
                       d="M92.86,0H7.12A7.17,7.17,0,0,0,0,7.21V92.79A7.17,7.17,0,0,0,7.12,100H92.86A7.19,7.19,0,0,0,100,92.79V7.21A7.19,7.19,0,0,0,92.86,0ZM30.22,85.71H15.4V38H30.25V85.71ZM22.81,31.47a8.59,8.59,0,1,1,8.6-8.59A8.6,8.6,0,0,1,22.81,31.47Zm63,54.24H71V62.5c0-5.54-.11-12.66-7.7-12.66s-8.91,6-8.91,12.26V85.71H39.53V38H53.75v6.52H54c2-3.75,6.83-7.7,14-7.7,15,0,17.79,9.89,17.79,22.74Z"
                     ></path>
                   </svg>
                   <span className="origin-left inline-flex duration-100 group-hover:duration-300 group-hover:delay-500 opacity-0 group-hover:opacity-100 border-l-2 border-white/30 px-2 ml-1 transform scale-x-0 group-hover:scale-x-100 transition-all truncate text-sm">
                     Charles Garbus
                   </span>
                 </a>
              </div>

            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section id="temoignages" className="py-24 relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Title Container - Glass Box */}
              <div className="max-w-3xl mx-auto mb-16 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl text-center shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{t.reviews.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Testimonial 1 */}
                 <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex gap-1 text-orange-400 mb-4">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-100 mb-6 italic font-light font-medium">"{t.reviews.r1}"</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold border border-white/5">JD</div>
                       <div>
                          <p className="text-sm font-bold text-white">Jean Dupont</p>
                          <p className="text-xs text-slate-300">Le Petit Bistrot</p>
                       </div>
                    </div>
                 </div>

                 {/* Testimonial 2 */}
                 <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex gap-1 text-orange-400 mb-4">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-100 mb-6 italic font-light font-medium">"{t.reviews.r2}"</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold border border-white/5">ML</div>
                       <div>
                          <p className="text-sm font-bold text-white">Marie L.</p>
                          <p className="text-xs text-slate-300">Modern Ceramics</p>
                       </div>
                    </div>
                 </div>

                 {/* Testimonial 3 */}
                 <div className="glass-panel p-6 rounded-2xl hidden lg:block">
                    <div className="flex gap-1 text-orange-400 mb-4">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-100 mb-6 italic font-light font-medium">"{t.reviews.r3}"</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold border border-white/5">PV</div>
                       <div>
                          <p className="text-sm font-bold text-white">Pierre V.</p>
                          <p className="text-xs text-slate-300">Concept Store</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 relative">
           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10">

                 {/* Form Side */}
                 <div className="p-8 md:p-12 md:w-3/5 relative">
                    <h2 className="text-3xl font-display font-bold text-white mb-2">{t.contact.title}</h2>
                    <p className="text-slate-300 mb-8 font-medium">{t.contact.subtitle}</p>

                    {formStatus === 'success' ? (
                       <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in py-12">
                          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                             <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{t.contact.successTitle}</h3>
                          <p className="text-slate-300 max-w-xs mb-8">{t.contact.successDesc}</p>
                          <div className="p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl text-sm text-indigo-200">
                            {t.contact.successTip}
                          </div>
                       </div>
                    ) : (
                       <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="group">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.name}</label>
                                <input
                                   name="name"
                                   required
                                   type="text"
                                   placeholder="John Doe"
                                   className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white placeholder:text-slate-300 shadow-inner"
                                />
                             </div>
                             <div className="group">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.email}</label>
                                <input
                                   name="email"
                                   required
                                   type="email"
                                   placeholder="john@example.com"
                                   className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white placeholder:text-slate-300 shadow-inner"
                                />
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                               <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.type}</label>
                               <div className="relative">
                                 <select name="type" className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white appearance-none cursor-pointer shadow-inner">
                                    {t.contact.form.types.map((type, i) => (
                                        <option key={i} className="bg-slate-900 text-white py-2" value={type}>{type}</option>
                                    ))}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                               </div>
                            </div>

                            {/* Service Selection Field */}
                            <div className="group">
                               <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.serviceInterest}</label>
                               <div className="relative">
                                 <select name="service" className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white appearance-none cursor-pointer shadow-inner">
                                    {t.contact.form.serviceOptions.map((opt, i) => (
                                        <option key={i} className="bg-slate-900 text-white py-2" value={opt}>{opt}</option>
                                    ))}
                                 </select>
                                 <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                               </div>
                            </div>
                          </div>

                          <div className="group">
                             <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.message}</label>
                             <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="Tell us about your project..."
                                className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white placeholder:text-slate-300 shadow-inner resize-none"
                             ></textarea>
                          </div>

                          <button
                             type="submit"
                             disabled={formStatus === 'submitting'}
                             className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 border border-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                             {formStatus === 'submitting' ? (
                                <span className="flex items-center gap-2">
                                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                   {t.contact.form.sending}
                                </span>
                             ) : (
                                <>{t.contact.form.btn} <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                             )}
                          </button>
                       </form>
                    )}
                 </div>

                 {/* Direct Contact Side (Charles) */}
                 <div className="bg-indigo-900/80 p-8 md:p-12 md:w-2/5 text-indigo-100 flex flex-col items-center justify-center text-center backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>

                    <div className="relative z-10 flex flex-col items-center">
                       <h3 className="text-xl font-bold text-white mb-6">{t.contact.direct.title}</h3>

                       <div className="relative w-32 h-32 mb-6 p-1 rounded-full border-2 border-green-400/50 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                         <img
                           src={charlesImg}
                           alt="Charles Garbus"
                           className="w-full h-full rounded-full object-cover"
                           loading="lazy"
                         />
                         <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-indigo-900 rounded-full"></div>
                       </div>

                       <p className="text-white font-bold text-lg mb-1">Charles Garbus</p>
                       <p className="text-indigo-100 text-sm font-medium mb-8">{t.contact.direct.subtitle}</p>

                       {/* Custom WhatsApp Button */}
                       <a href="https://wa.me/33671618119" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          <button className="button2">
                              WhatsApp
                              <svg viewBox="0 0 48 48" y="0px" x="0px" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z" fill="#fff"></path>
                                <path d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z" fill="#fff"></path>
                                <path d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z" fill="#cfd8dc"></path>
                                <path d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z" fill="#40c351"></path>
                                <path clipRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" fillRule="evenodd" fill="#fff"></path>
                              </svg>
                          </button>
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Booking Modal */}
        <Suspense fallback={null}>
          <BookingModal
            isOpen={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            selectedService={selectedService}
            onSubmit={handleBookingSubmit}
            translations={t}
          />
        </Suspense>

        {/* Admin Dashboard */}
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

        {/* GDPR Components */}
        <CookieConsent
          translations={t.cookie}
          onAccept={() => console.log('Cookies accepted')}
          onDecline={() => console.log('Cookies declined')}
        />

        <LegalModals
          translations={t.legal}
          isOpen={legalModalOpen}
          onClose={() => setLegalModalOpen(false)}
          initialTab={legalTab}
        />

      </main>

      {/* FOOTER */}
      <footer className="relative bg-slate-950/90 border-t border-white/5 py-12 backdrop-blur-xl">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                 <Code2 className="w-4 h-4" />
               </div>
               <span className="font-display font-bold text-lg text-white">WebGen</span>
            </div>
            <div className="text-slate-300 text-sm font-medium">
               &copy; {new Date().getFullYear()} WebGen. {t.footer.rights}
            </div>
            <div className="flex gap-6 text-sm font-medium text-slate-300 items-center">
               <button onClick={() => openLegal('legal')} className="hover:text-indigo-400 transition-colors">{t.legal.tabs.legal}</button>
               <button onClick={() => openLegal('privacy')} className="hover:text-indigo-400 transition-colors">{t.legal.tabs.privacy}</button>
               <button onClick={() => openLegal('terms')} className="hover:text-indigo-400 transition-colors">{t.legal.tabs.terms}</button>

               <button onClick={() => setAdminOpen(true)} className="text-slate-700 hover:text-slate-500 transition-colors" title="Admin Access">
                 <Lock className="w-3 h-3" />
               </button>
            </div>
         </div>
      </footer>
    </div>
    )}
    </>
  );
};

export default App;
