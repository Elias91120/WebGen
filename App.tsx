
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import FloatingLines from './components/FloatingLines';
import GradientText from './components/GradientText';
import TextType from './components/TextType';
import SplitText from './components/SplitText';
import BlurText from './components/BlurText';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import Logo from './components/Logo';
import { 
  ArrowRight, 
  Store, 
  Smartphone, 
  Rocket, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  Menu,
  X,
  Send,
  Globe,
  Code2,
  Database,
  Users,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Zap,
  MessageCircle,
  ChevronDown,
  Lock,
  Layers
} from 'lucide-react';
import { ServiceType, ClientRequest } from './types';

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
      titleStart: "Des solutions simples pour",
      titleEnd: "faire décoller votre commerce.",
      subtitle: "Nous sommes WebGen. Une équipe de trois jeunes ingénieurs & créatifs. Nous apportons la tech de pointe aux commerces locaux. Rapide, animé, performant.",
      ctaPrimary: "Lancer le Projet",
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
        badge: "Best Seller",
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
        elias: "Creative Tech Lead",
        eliasDesc: "Le Virtuose React. Elias vit pour l'UI/UX et les animations. C'est lui qui crée l'effet 'Wow' qui retient vos clients sur le site.",
        noam: "Lead Backend & Data",
        noamDesc: "L'Architecte. Spécialiste Data & Robustesse, il construit la logique solide et les systèmes sécurisés derrière la belle interface.",
        charles: "Head of Growth",
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

  const t = translations[lang];

  // Load requests from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('webgen_requests');
    if (saved) {
      setRequests(JSON.parse(saved));
    }
  }, []);

  // Save requests when changed
  useEffect(() => {
    localStorage.setItem('webgen_requests', JSON.stringify(requests));
  }, [requests]);

  // Handle Contact Form Submit (Simple contact from bottom section)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      // NOTE: We do NOT reset formStatus to 'idle' automatically to prevent double submissions 
      // and to encourage user to use direct contact if they need more info.
      // setTimeout(() => setFormStatus('idle'), 3000); 
    }, 1500);
  };

  // Handle Booking Submit (From Modal)
  const handleBookingSubmit = (data: Omit<ClientRequest, 'id' | 'date' | 'status'>) => {
    const newRequest: ClientRequest = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'new'
    };
    
    setRequests(prev => [...prev, newRequest]);
    setBookingModalOpen(false);
    
    setFormStatus('success');
    // We let the success state persist to show the user their request is in.
    scrollToSection('contact');
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleAdminStatusUpdate = (id: string, status: ClientRequest['status']) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
  };

  const handleAdminDelete = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden animate-in fade-in duration-700">
      
      {/* 3D Background - Floating Lines */}
      {/* Mounted but optimized. No prop changes needed as internal optimization handles DPR */}
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
      
      {/* Navbar - Glass */}
      <nav className="fixed w-full z-50 bg-slate-950/90 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <Logo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]" />
              <span className="font-display font-bold text-xl md:text-2xl tracking-tight">
                <GradientText colors={['#fff', '#818cf8', '#fff']} animationSpeed={6}>WebGen</GradientText>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors">{t.nav.services}</button>
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
          <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-4 shadow-xl animate-in slide-in-from-top-4">
             <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('services')} className="text-left font-medium text-slate-200 p-2">{t.nav.services}</button>
              <button onClick={() => scrollToSection('equipe')} className="text-left font-medium text-slate-200 p-2">{t.nav.team}</button>
              <button onClick={() => scrollToSection('temoignages')} className="text-left font-medium text-slate-200 p-2">{t.nav.reviews}</button>
              <button onClick={() => scrollToSection('contact')} className="bg-indigo-600 text-white p-3 rounded-lg font-bold text-center">{t.nav.cta}</button>
             </div>
          </div>
        )}
      </nav>

      <main className="pt-20 relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="glass-panel p-8 md:p-12 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-4xl mx-auto">
               <div className="text-center space-y-8">
                 
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700 backdrop-blur-sm">
                    <Rocket className="w-4 h-4 text-indigo-400" />
                    <TextType 
                      text={["React Experts", "High Performance", "Mobile First", "WebGen Studio"]} 
                      typingSpeed={80} 
                      deletingSpeed={40} 
                      pauseDuration={2000} 
                      loop={true}
                    />
                 </div>
                 
                 <div className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                   <SplitText 
                     text={t.hero.titleStart} 
                     className="block mb-2"
                     delay={50}
                   />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-pulse block">
                     {t.hero.titleEnd}
                   </span>
                 </div>
                 
                 <div className="max-w-2xl mx-auto">
                   <BlurText 
                      text={t.hero.subtitle}
                      className="text-lg md:text-xl text-slate-100 leading-relaxed font-medium drop-shadow-md text-center justify-center"
                      delay={30}
                   />
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500">
                   <button onClick={() => scrollToSection('contact')} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 border border-white/10">
                      {t.hero.ctaPrimary} <ArrowRight className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* WHY US (Bento Grid) - Glass Panels */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title Container - Glass Box */}
            <div className="max-w-3xl mx-auto mb-16 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
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
        <section id="services" className="py-24 relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Title Container - Glass Box */}
              <div className="max-w-3xl mx-auto mb-16 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl text-center shadow-2xl">
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
                      src="https://media.licdn.com/dms/image/v2/D4E03AQFu2YX0Ge5iyA/profile-displayphoto-shrink_400_400/B4EZXK2izSH0Ak-/0/1742865052510?e=1766016000&v=beta&t=5rJlqgRwNNLNgY1ZXdh_gmAC0NUDk-b6c7yzCUltJIA" 
                      alt="Elias Eloumi"
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                 </div>
                 <h3 className="text-xl font-bold text-white">Elias Eloumi</h3>
                 <p className="text-indigo-400 font-medium text-sm mb-4 flex items-center gap-1 justify-center"><Sparkles className="w-3 h-3" />{t.team.roles.elias}</p>
                 <p className="text-slate-200 text-sm mb-6 max-w-xs leading-relaxed font-medium">{t.team.roles.eliasDesc}</p>
                 <a 
                   href="https://www.linkedin.com/in/elias-elloumi/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="Btn-LinkedIn mt-auto"
                 >
                    <div className="sign">
                        <svg fill="white" className="svgIcon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"></path>
                        </svg>
                    </div>
                    <div className="text">LinkedIn</div>
                 </a>
              </div>

              {/* Member 2: Noam (Back) */}
              <div className="glass-panel p-6 rounded-2xl hover:bg-slate-900/80 transition-all duration-300 group text-center flex flex-col items-center hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)]">
                 <div className="relative w-28 h-28 mb-6 group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-indigo-500/50">
                    <img 
                      src="https://media.licdn.com/dms/image/v2/D4E03AQGiD7tFAd5ZEQ/profile-displayphoto-scale_400_400/B4EZlR5n58IoAg-/0/1758015687133?e=1766016000&v=beta&t=qN8jGGU0s11i-xq5pQyeaaDMB1GcrkJzcndvWyTfwas" 
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
                   className="Btn-LinkedIn mt-auto"
                 >
                    <div className="sign">
                        <svg fill="white" className="svgIcon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"></path>
                        </svg>
                    </div>
                    <div className="text">LinkedIn</div>
                 </a>
              </div>

               {/* Member 3: Charles (Sales) */}
              <div className="glass-panel p-6 rounded-2xl hover:bg-slate-900/80 transition-all duration-300 group text-center flex flex-col items-center hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)]">
                 <div className="relative w-28 h-28 mb-6 group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-orange-500/50">
                    <img 
                      src="https://media.licdn.com/dms/image/v2/D4E03AQGJO6nv360qcg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1713713155263?e=1766016000&v=beta&t=HJrhGPpCM_85mG26jxOdD205Q53Xe8WaVpADE1GbWBk" 
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
                   className="Btn-LinkedIn mt-auto"
                 >
                    <div className="sign">
                        <svg fill="white" className="svgIcon w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"></path>
                        </svg>
                    </div>
                    <div className="text">LinkedIn</div>
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
                                   required 
                                   type="text" 
                                   placeholder="John Doe" 
                                   className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white placeholder:text-slate-300 shadow-inner" 
                                />
                             </div>
                             <div className="group">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.email}</label>
                                <input 
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
                                 <select className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white appearance-none cursor-pointer shadow-inner">
                                    {t.contact.form.types.map((type, i) => (
                                        <option key={i} className="bg-slate-900 text-white py-2">{type}</option>
                                    ))}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                               </div>
                            </div>

                            {/* Service Selection Field */}
                            <div className="group">
                               <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.serviceInterest}</label>
                               <div className="relative">
                                 <select className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:bg-white/5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300 text-white appearance-none cursor-pointer shadow-inner">
                                    {t.contact.form.serviceOptions.map((opt, i) => (
                                        <option key={i} className="bg-slate-900 text-white py-2">{opt}</option>
                                    ))}
                                 </select>
                                 <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                               </div>
                            </div>
                          </div>
                          
                          <div className="group">
                             <label className="block text-sm font-semibold text-slate-300 mb-2">{t.contact.form.message}</label>
                             <textarea 
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
                           src="https://media.licdn.com/dms/image/v2/D4E03AQGJO6nv360qcg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1713713155263?e=1766016000&v=beta&t=HJrhGPpCM_85mG26jxOdD205Q53Xe8WaVpADE1GbWBk" 
                           alt="Charles Garbus"
                           className="w-full h-full rounded-full object-cover"
                           loading="lazy"
                         />
                         <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-indigo-900 rounded-full"></div>
                       </div>

                       <p className="text-white font-bold text-lg mb-1">Charles Garbus</p>
                       <p className="text-indigo-100 text-sm font-medium mb-8">{t.contact.direct.subtitle}</p>

                       {/* Custom WhatsApp Button */}
                       <a href="https://wa.me/33671618119" target="_blank" rel="noopener noreferrer" className="Btn text-decoration-none">
                          <div className="sign">
                            <svg className="socialSvg whatsappSvg" viewBox="0 0 16 16">
                              <path
                                d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
                              ></path>
                            </svg>
                          </div>
                          <div className="text">WhatsApp</div>
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Booking Modal */}
        <BookingModal 
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          selectedService={selectedService}
          onSubmit={handleBookingSubmit}
          translations={t}
        />

        {/* Admin Dashboard */}
        {adminOpen && (
          <AdminDashboard 
            requests={requests}
            onUpdateStatus={handleAdminStatusUpdate}
            onDelete={handleAdminDelete}
            onClose={() => setAdminOpen(false)}
          />
        )}

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
               {t.footer.links.map((link, i) => (
                  <a key={i} href="#" className="hover:text-indigo-400 transition-colors">{link}</a>
               ))}
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
