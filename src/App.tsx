
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Database,
  Github,
  Globe,
  Layers,
  Leaf,
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
  Zap,
} from 'lucide-react';
import React, { useEffect, useState, Suspense, lazy } from 'react';
import CookieConsent from './components/CookieConsent';
import GradientText from './components/GradientText';
import IntroScreen from './components/IntroScreen';
import LegalModals from './components/LegalModals';
import Logo from './components/Logo';
import SplitText from './components/SplitText';
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
      services: "Services",
      projects: "Projects",
      team: "Team",
      reviews: "Reviews",
      cta: "Let's talk",
    },
    hero: {
      badge: "Websites clients understand instantly",
      brandSubtitle: "Three founders, one studio — the brand is 3geeks. Web & digital products, made in France.",
      titleStart: "Websites and digital tools",
      titleEnd: "that make people contact you.",
      comment: "Start with a focused €300 website or a custom web project. We help you choose the simplest format for your goal.",
      ctaPrimary: "Talk about my project",
      ctaSecondary: "See our projects",
    },
    stats: {
      founders: "founders",
      projects: "public projects",
      response: "response",
      french: "Made in France",
    },
    projects: {
      path: "Recent work",
      title: "Real projects, already online",
      subtitle: "Three public projects that show the type of web and app experiences we can design, build and launch.",
      p1: {
        title: "Express Divorce USA",
        tag: "Legal service platform",
        desc: "A reassuring web platform that guides users through a sensitive legal process with clarity.",
        result1: "Clearer client journey",
        result2: "Reassuring steps before contact",
        result3: "Public project available online",
        link: "https://www.expressdivorceusa.co",
        btn: "Open the project"
      },
      p2: {
        title: "CallKitchen",
        tag: "Restaurant voice automation",
        desc: "A practical landing page for an AI phone assistant that helps restaurants capture missed calls.",
        result1: "Clear product explanation",
        result2: "Direct call-to-action for demos",
        result3: "Public landing page available online",
        link: "https://call-kitchen-landing.vercel.app",
        btn: "Open the project"
      },
      p3: {
        title: "Two",
        tag: "Consumer mobile app",
        desc: "A polished iOS experience designed to feel simple and useful from the first interaction.",
        result1: "Public app available on the App Store",
        result2: "Clean mobile interface",
        result3: "Built for recurring usage",
        link: "https://apps.apple.com/fr/app/two/id6758867716",
        btn: "Open on App Store"
      }
    },
    openSource: {
      path: "Open source lab by 3geeks",
      title: "Side projects we build in public",
      subtitle: "Alongside client work, we experiment with useful AI tools around digital sobriety, project planning and developer workflows.",
      p1: {
        title: "PromptOptim",
        status: "Live open source project",
        tag: "Green IT & Digital Sovereignty",
        desc: "An AI prompt optimization tool designed to reduce token usage, estimate CO2 impact and encourage more sober AI usage.",
        point1: "More precise prompts with fewer tokens",
        point2: "CO2 impact estimation per request",
        point3: "European models and GDPR-first positioning",
        link: "https://frontend-prompt-optim.vercel.app/",
        btn: "Open PromptOptim"
      },
      p2: {
        title: "Prompt Hub",
        status: "Accessible beta, still in development",
        tag: "AI project planning",
        desc: "The logical continuation of PromptOptim: a beta tool that turns a vague idea into a structured execution plan with contextual prompts.",
        point1: "Project phases and steps generated from an idea",
        point2: "Contextual prompts for coding assistants",
        point3: "Specialized AI agents and dependency graph in progress",
        link: "https://prompt-hub.3geeks.fr/",
        btn: "Open the beta"
      }
    },
    whyUs: {
      path: "Why clients choose us",
      title: "A small team that turns ideas into useful products",
      subtitle: "We combine design sense, technical reliability and direct communication so your project moves fast without becoming messy.",
      card1: {
        file: "Design that sells",
        title: "A first impression that helps you sell",
        desc: "We design pages that make the offer easy to understand, pleasant to browse and credible from the first screen."
      },
      card2: {
        file: "Reliable build",
        title: "Solid foundations behind the interface",
        desc: "Forms, automations, dashboards and integrations are built cleanly so your site stays reliable after launch."
      },
      card3: {
        file: "Business focus",
        title: "Built around your real activity",
        desc: "Restaurants, shops, service businesses or startups: we adapt the product to how your clients actually decide."
      },
      card4: {
        file: "Direct contact",
        title: "You speak with people, not a ticket system",
        desc: "Charles keeps the project clear, translates business needs into concrete decisions and makes sure every step stays understandable."
      },
    },
    stack: {
      path: "Simple method",
      title: "From first call to launch, you always know what happens next",
      subtitle: "Understand the need, design the experience, build the product, then improve it with real feedback.",
    },
    services: {
      path: "Service plans",
      badge: "SOLUTIONS",
      title: "Two clear ways to start your project",
      maintenanceTitle: "Peace-of-mind option",
      maintenanceDesc: "Add monitoring, security updates and small content edits to any plan for",
      maintenancePrice: "€50/mo",
      maintenanceCta: "+ add option",
      maintenanceHighlight: "Recommended",
      s1: {
        title: "Starter website",
        price: "€300",
        subPrice: "one-off payment",
        badge: "clear scope",
        btn: "Start now",
        features: [
          { text: 'One-page responsive website', checked: true },
          { text: 'Clear offer and contact CTA', checked: true },
          { text: 'Modern visual design', checked: true },
          { text: 'Contact form or WhatsApp link', checked: false },
          { text: 'Mobile-first layout', checked: false },
        ]
      },
      s2: {
        title: "Custom web project",
        price: "Custom quote",
        subPrice: "based on complexity",
        badge: "tailored",
        btn: "Talk to us",
        features: [
          { text: 'Everything in Starter, adapted to your offer', checked: true },
          { text: 'Booking or request flows', checked: true },
          { text: 'E-commerce or payments if needed', checked: true },
          { text: 'Accounts and structured data', checked: true },
          { text: 'Custom admin dashboard', checked: true },
          { text: 'External tool integrations', checked: true },
        ]
      },
      s3: {
        title: "Complete redesign",
        price: "Custom quote",
        subPrice: "audit & overhaul",
        badge: "improve",
        btn: "Request audit",
        features: [
          { text: 'Visual and UX overhaul', checked: true },
          { text: 'Performance and structure audit', checked: true },
          { text: 'Modern front-end rebuild', checked: true },
          { text: 'Existing SEO considered', checked: true },
          { text: 'Cleaner conversion path', checked: true },
          { text: 'Safer launch plan with your current site', checked: true },
        ]
      }
    },
    booking: {
      stepOf: "Step {step} of 2",
      selectedOffer: "Selected offer",
      quote: "Quote",
      estimatedTotal: "Estimated total",
      continue: "Continue",
      back: "Back",
      confirm: "Confirm",
      processing: "Processing...",
      name: "Name",
      email: "Email",
      company: "Company / project",
      preferredDate: "Preferred date (optional)",
      dateHint: "Leave blank to schedule later",
      details: "Additional details",
      namePlaceholder: "John Doe",
      emailPlaceholder: "john@company.com",
      companyPlaceholder: "My Awesome Shop",
      detailsPlaceholder: "Anything else we should know?",
    },
    team: {
      path: "Founding team",
      title: "Meet the founders",
      subtitle: "Three complementary profiles, one direct point of contact, and a shared goal: ship useful products clients enjoy using.",
      roles: {
        elias: "Design & experience",
        eliasDesc: "Elias shapes the visual experience: clear pages, smooth interactions and a polished feeling that helps visitors understand the offer.",
        noam: "Systems & data",
        noamDesc: "Noam builds the reliable logic behind the product: forms, dashboards, automations and clean data flows.",
        charles: "Client relation",
        charlesDesc: "Charles keeps the project aligned with your business goals and makes sure every decision remains clear."
      }
    },
    reviews: {
      path: "Client feedback",
      title: "What clients say after delivery",
      r1: "Fast, structured and very clear communication. The final platform made our client process much smoother.",
      r2: "The team translated our constraints into concrete decisions. We saw better traction within weeks.",
      r3: "Our booking operations became far more reliable and easier to manage day to day."
    },
    contact: {
      path: "Let's discuss your project",
      title: "Not sure whether you need a starter site or custom project?",
      subtitle: "Tell us what you want to sell, show or automate. We reply within 24h with the simplest next step.",
      successTitle: "Received.",
      successDesc: "The 3geeks team will be in touch shortly.",
      successTip: "Need it urgent? Ping Charles directly on the right.",
      form: {
        name: "Full name",
        email: "Email",
        type: "Business type",
        serviceInterest: "Solution interest",
        message: "Message & project details",
        btn: "Send request",
        sending: "Sending...",
        types: ["Restaurant / Bar", "Retail / Shop", "Service / Craftsman", "Health / Medical", "Other"],
        serviceOptions: ["Starter website (€300)", "Custom web project", "Complete redesign", "Maintenance only", "Other / Not sure"]
      },
      direct: {
        title: "Or chat with Charles",
        subtitle: "Skip the form. Reply on WhatsApp.",
        phone: "+33 6 71 61 81 19"
      }
    },
    footer: {
      eof: "End",
      rights: "All rights reserved.",
      tagline: "Made in France",
      links: ["Legal", "Privacy", "Terms"]
    },
    cookie: {
      title: "Cookies, please.",
      desc: "We use cookies to improve your browsing experience and analyse our traffic. Click \"Accept\" to consent.",
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
            text: "This site is edited by 3geeks.\nCompany registration details and registered office must be added before commercial publication.\nEmail: contact@3geeks.fr\nPhone: +33 6 71 61 81 19"
          },
          {
            title: "2. Hosting",
            text: "The website is hosted by Vercel Inc.\nAddress: 340 S Lemon Ave #4133 Walnut, CA 91789, USA"
          },
          {
            title: "3. Intellectual Property",
            text: "This entire site is subject to French and international copyright and intellectual property law. All reproduction rights reserved."
          }
        ],
        privacy: [
          {
            title: "1. Data Collection",
            text: "We collect the following information via our contact form:\n- First and last name\n- Email address\n- Company name\n- Project details"
          },
          {
            title: "2. Data Usage",
            text: "This data is used solely to:\n- Respond to your contact requests\n- Establish quotes\n- Contact you regarding commercial relations\n\nYour data is never sold to third parties."
          },
          {
            title: "3. Your Rights",
            text: "Under the GDPR, you have the right to access, rectify, and delete your data. To exercise this right, contact us at contact@3geeks.fr."
          },
          {
            title: "4. Cookies",
            text: "This site uses essential cookies for operation and analytics cookies to improve your experience. You can manage preferences via the consent banner."
          }
        ],
        terms: [
          {
            title: "1. Purpose",
            text: "These conditions govern the sale of web development services by 3geeks."
          },
          {
            title: "2. Price",
            text: "Prices are listed in euros. 3geeks reserves the right to modify prices at any time, but any service is billed at the rate in effect when the quote is validated."
          },
          {
            title: "3. Payment",
            text: "Payment is due upon signing the quote (deposit) and upon delivery (balance)."
          },
          {
            title: "4. Delivery",
            text: "Delivery times are indicative and may vary depending on project complexity and client responsiveness."
          }
        ]
      },
      close: "Close"
    }
  },
  fr: {
    nav: {
      services: "Services",
      projects: "Projets",
      team: "Equipe",
      reviews: "Avis",
      cta: "Nous contacter",
    },
    hero: {
      badge: "Des sites compris en quelques secondes",
      brandSubtitle: "Trois associés, un studio — la marque s’écrit 3geeks. Sites & produits digitaux, faits en France.",
      titleStart: "Des sites et outils web",
      titleEnd: "qui donnent envie de vous contacter.",
      comment: "Démarrez avec un site ciblé à 300€ ou un projet web sur mesure. On vous aide à choisir le format le plus simple pour votre objectif.",
      ctaPrimary: "Parler de mon projet",
      ctaSecondary: "Voir nos realisations",
    },
    stats: {
      founders: "fondateurs",
      projects: "projets publics",
      response: "de réponse",
      french: "Made in France",
    },
    projects: {
      path: "Réalisations récentes",
      title: "Des projets réels, déjà en ligne",
      subtitle: "Trois projets publics qui montrent le type d'expériences web et app que nous pouvons concevoir, développer et lancer.",
      p1: {
        title: "Express Divorce USA",
        tag: "Plateforme de services juridiques",
        desc: "Une plateforme rassurante qui guide les utilisateurs dans un parcours juridique sensible avec clarté.",
        result1: "Parcours client plus clair",
        result2: "Étapes rassurantes avant contact",
        result3: "Projet public consultable en ligne",
        link: "https://www.expressdivorceusa.co",
        btn: "Ouvrir le projet"
      },
      p2: {
        title: "CallKitchen",
        tag: "Automatisation telephonique restauration",
        desc: "Une landing page concrète pour un assistant téléphonique IA qui aide les restaurants à capter les appels manqués.",
        result1: "Produit expliqué clairement",
        result2: "Appel à l'action direct vers la démo",
        result3: "Landing page publique en ligne",
        link: "https://call-kitchen-landing.vercel.app",
        btn: "Ouvrir le projet"
      },
      p3: {
        title: "Two",
        tag: "Application mobile grand public",
        desc: "Une expérience iOS soignée, pensée pour être simple et utile dès la première interaction.",
        result1: "Application publique sur l'App Store",
        result2: "Interface mobile claire",
        result3: "Pensée pour un usage récurrent",
        link: "https://apps.apple.com/fr/app/two/id6758867716",
        btn: "App Store"
      }
    },
    openSource: {
      path: "Open source lab by 3geeks",
      title: "Des projets que l'on construit en public",
      subtitle: "À côté des projets clients, nous développons des outils IA utiles autour de la sobriété numérique, de la planification projet et des workflows développeurs.",
      p1: {
        title: "PromptOptim",
        status: "Projet open source en ligne",
        tag: "Green IT & Souveraineté numérique",
        desc: "Un outil d'optimisation de prompts IA pensé pour réduire la consommation de tokens, estimer l'impact CO2 et encourager un usage plus sobre de l'IA.",
        point1: "Prompts plus précis avec moins de tokens",
        point2: "Estimation CO2 par requête",
        point3: "Positionnement modèles européens et RGPD",
        link: "https://frontend-prompt-optim.vercel.app/",
        btn: "Ouvrir PromptOptim"
      },
      p2: {
        title: "Prompt Hub",
        status: "Beta accessible, encore en développement",
        tag: "Planification projet par IA",
        desc: "La suite logique de PromptOptim : un outil beta qui transforme une idée floue en plan d'exécution structuré avec des prompts contextualisés.",
        point1: "Phases et étapes générées depuis une idée",
        point2: "Prompts contextualisés pour assistants de code",
        point3: "Agents IA spécialisés et graphe en développement",
        link: "https://prompt-hub.3geeks.fr/",
        btn: "Ouvrir la beta"
      }
    },
    whyUs: {
      path: "Pourquoi travailler avec nous",
      title: "Une petite équipe qui transforme vos idées en produits utiles",
      subtitle: "On combine sens du design, fiabilité technique et communication directe pour faire avancer votre projet sans complexité inutile.",
      card1: {
        file: "Design qui vend",
        title: "Une première impression qui aide à vendre",
        desc: "On conçoit des pages faciles à comprendre, agréables à parcourir et crédibles dès le premier écran."
      },
      card2: {
        file: "Base fiable",
        title: "Des fondations solides derrière l'interface",
        desc: "Formulaires, automatisations, dashboards et intégrations sont construits proprement pour rester fiables après la mise en ligne."
      },
      card3: {
        file: "Objectifs business",
        title: "Pensé autour de votre activité réelle",
        desc: "Restaurant, boutique, service ou startup : on adapte le produit à la façon dont vos clients décident vraiment."
      },
      card4: {
        file: "Contact direct",
        title: "Vous parlez à des humains, pas à un ticket",
        desc: "Charles garde le projet clair, traduit vos besoins terrain en décisions concrètes et vous évite le jargon inutile."
      }
    },
    stack: {
      path: "Méthode simple",
      title: "Du premier appel à la mise en ligne, vous savez toujours où on va",
      subtitle: "Comprendre le besoin, designer l'expérience, construire le produit, puis l'améliorer avec les retours réels.",
    },
    services: {
      path: "Nos offres",
      badge: "SOLUTIONS",
      title: "Deux façons claires de démarrer votre projet",
      maintenanceTitle: "Option Sérénité",
      maintenanceDesc: "Ajoutez monitoring, mises à jour sécu et petits edits à n'importe quelle offre pour",
      maintenancePrice: "50€/mois",
      maintenanceCta: "+ ajouter l'option",
      maintenanceHighlight: "Recommandé",
      s1: {
        title: "Site Starter",
        price: "300€",
        subPrice: "paiement unique",
        badge: "cadre clair",
        btn: "Démarrer",
        features: [
          { text: 'Site one-page responsive', checked: true },
          { text: 'Offre claire et appel à l’action', checked: true },
          { text: 'Design moderne et soigné', checked: true },
          { text: 'Formulaire ou lien WhatsApp', checked: false },
          { text: 'Pensé d’abord pour mobile', checked: false },
        ]
      },
      s2: {
        title: "Projet web sur mesure",
        price: "Sur devis",
        subPrice: "selon complexité",
        badge: "sur mesure",
        btn: "Nous parler",
        features: [
          { text: 'Tout le Starter, adapté à votre offre', checked: true },
          { text: 'Parcours de réservation ou demande', checked: true },
          { text: 'E-commerce ou paiements si besoin', checked: true },
          { text: 'Comptes et données structurées', checked: true },
          { text: 'Dashboard admin sur mesure', checked: true },
          { text: 'Intégrations avec vos outils', checked: true },
        ]
      },
      s3: {
        title: "Refonte complète",
        price: "Sur devis",
        subPrice: "audit & mise à niveau",
        badge: "amélioration",
        btn: "Demander un audit",
        features: [
          { text: 'Refonte visuelle et UX', checked: true },
          { text: 'Audit performance et structure', checked: true },
          { text: 'Reconstruction front-end moderne', checked: true },
          { text: 'SEO existant pris en compte', checked: true },
          { text: 'Parcours de contact plus clair', checked: true },
          { text: 'Plan de mise en ligne sans coupure brutale', checked: true },
        ]
      },
    },
    booking: {
      stepOf: "Étape {step} sur 2",
      selectedOffer: "Offre sélectionnée",
      quote: "Sur devis",
      estimatedTotal: "Total estimé",
      continue: "Continuer",
      back: "Retour",
      confirm: "Confirmer",
      processing: "Envoi...",
      name: "Nom",
      email: "Email",
      company: "Entreprise / projet",
      preferredDate: "Date souhaitée (optionnel)",
      dateHint: "Laissez vide pour planifier plus tard",
      details: "Détails supplémentaires",
      namePlaceholder: "Jean Dupont",
      emailPlaceholder: "jean@entreprise.com",
      companyPlaceholder: "Ma boutique",
      detailsPlaceholder: "Autre chose à savoir ?",
    },
    team: {
      path: "Equipe fondatrice",
      title: "Les fondateurs",
      subtitle: "Trois profils complémentaires, un contact direct et le même objectif : livrer des produits utiles que vos clients aiment utiliser.",
      roles: {
        elias: "Design & expérience",
        eliasDesc: "Elias façonne l'expérience visuelle : pages claires, interactions fluides et rendu soigné qui aide à comprendre l'offre.",
        noam: "Systèmes & data",
        noamDesc: "Noam construit la logique fiable derrière le produit : formulaires, dashboards, automatisations et flux de données propres.",
        charles: "Relation client",
        charlesDesc: "Charles garde le projet aligné avec vos objectifs business et s'assure que chaque décision reste claire."
      }
    },
    reviews: {
      path: "Retours clients",
      title: "Ce que nos clients disent apres livraison",
      r1: "Equipe reactive, process tres clair et execution propre. Le nouveau site a fluidifie notre acquisition.",
      r2: "Ils ont compris notre metier rapidement et propose des choix utiles. On a vu une vraie progression.",
      r3: "Le systeme mis en place est robuste et simple a operer. Notre quotidien est plus serein."
    },
    contact: {
      path: "Discutons de votre projet",
      title: "Vous hésitez entre site starter et projet sur mesure ?",
      subtitle: "Expliquez ce que vous voulez vendre, présenter ou automatiser. On répond sous 24h avec la prochaine étape la plus simple.",
      successTitle: "Bien reçu.",
      successDesc: "L'équipe 3geeks vous recontacte très vite.",
      successTip: "Urgent ? Pinguez Charles directement sur la droite.",
      form: {
        name: "Nom complet",
        email: "Email",
        type: "Type de business",
        serviceInterest: "Solution envisagée",
        message: "Message & détails du projet",
        btn: "Envoyer la demande",
        sending: "Envoi...",
        types: ["Restauration / Bar", "Commerce / Boutique", "Artisan / Service", "Santé / Médical", "Autre"],
        serviceOptions: ["Site Starter (300€)", "Projet web sur mesure", "Refonte complète", "Maintenance seule", "Autre / Je ne sais pas"]
      },
      direct: {
        title: "Ou contactez Charles",
        subtitle: "Pas de formulaire. Réponse rapide sur WhatsApp.",
        phone: "+33 6 71 61 81 19"
      }
    },
    footer: {
      eof: "Fin",
      rights: "Tous droits réservés.",
      tagline: "Made in France",
      links: ["Mentions Légales", "Confidentialité", "CGV"]
    },
    cookie: {
      title: "Cookies, s'il vous plaît.",
      desc: "Nous utilisons des cookies pour améliorer votre navigation et analyser notre trafic. Cliquez sur \"Accepter\" pour consentir.",
      accept: "Accepter",
      decline: "Refuser"
    },
    legal: {
      title: "Informations légales",
      tabs: {
        legal: "Mentions Légales",
        privacy: "Politique de Confidentialité",
        terms: "CGV"
      },
      content: {
        legal: [
          {
            title: "1. Éditeur du site",
            text: "Ce site est édité par 3geeks.\nLes informations d'immatriculation et de siège social doivent être ajoutées avant une publication commerciale définitive.\nEmail : contact@3geeks.fr\nTéléphone : +33 6 71 61 81 19"
          },
          {
            title: "2. Hébergement",
            text: "Le site est hébergé par Vercel Inc.\nAdresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA"
          },
          {
            title: "3. Propriété intellectuelle",
            text: "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés."
          }
        ],
        privacy: [
          {
            title: "1. Collecte des données",
            text: "Nous collectons les informations suivantes via notre formulaire de contact :\n- Nom et prénom\n- Adresse email\n- Nom de l'entreprise\n- Détails du projet"
          },
          {
            title: "2. Utilisation des données",
            text: "Ces données sont utilisées uniquement pour :\n- Répondre à vos demandes de contact\n- Établir des devis\n- Vous contacter dans le cadre de la relation commerciale\n\nVos données ne sont jamais vendues à des tiers."
          },
          {
            title: "3. Vos droits",
            text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à contact@3geeks.fr."
          },
          {
            title: "4. Cookies",
            text: "Ce site utilise des cookies essentiels au fonctionnement et des cookies d'analyse pour améliorer votre expérience. Vous pouvez gérer vos préférences via la bannière de consentement."
          }
        ],
        terms: [
          {
            title: "1. Objet",
            text: "Les présentes conditions régissent les ventes de prestations de services de développement web par 3geeks."
          },
          {
            title: "2. Prix",
            text: "Les prix sont indiqués en euros. 3geeks se réserve le droit de modifier ses prix à tout moment, mais le service sera facturé sur la base du tarif en vigueur au moment de la validation du devis."
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

// Reusable card label. The window variant is used sparingly for project showcases.
const IdeBar: React.FC<{ filename: string; accent?: string; variant?: 'badge' | 'window' }> = ({
  filename,
  accent = 'cyan',
  variant = 'badge',
}) => {
  const accentClass = accent === 'lime'
    ? 'border-lime-300/25 bg-lime-300/10 text-lime-200'
    : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200';

  if (variant === 'window') {
    return (
      <div className="flex items-center gap-2 md:gap-3 border-b border-white/10 bg-white/[0.045] px-3 py-2 md:px-5 md:py-3">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-amber-300/80" />
          <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-lime-300/80" />
        </div>
        <span className={`min-w-0 truncate rounded-full border px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-wide ${accentClass}`}>
          {filename}
        </span>
      </div>
    );
  }

  return (
    <div className="px-4 pt-3 pb-1 md:px-5 md:pt-5">
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-wide ${accentClass}`}>
        {filename}
      </span>
    </div>
  );
};

const PromptHubMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center rounded-[1.35rem] border border-emerald-200/35 bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 text-[#06110b] shadow-[0_18px_45px_-20px_rgba(52,211,153,0.9)] ${className}`}>
    <Sparkles className="h-8 w-8 stroke-[2.4]" />
    <span className="absolute right-4 top-4 text-lg font-black leading-none">+</span>
  </div>
);

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [lang, setLang] = useState<Lang>('fr');

  // Booking & Admin State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  // GDPR State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'legal'>('legal');

  // Mouse parallax (normalised -1..1 from screen center)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    const handleMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        setMouseOffset({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  const openLegal = (tab: 'privacy' | 'terms' | 'legal') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const t = translations[lang];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
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

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'fr' : 'en');
  }

  // Simple delivery steps, kept concise for non-technical visitors.
  const stackChips: Array<{ label: string; icon: React.ReactNode }> = [
    { label: lang === 'fr' ? 'Cadrage clair' : 'Clear discovery', icon: <Users className="w-4 h-4" /> },
    { label: lang === 'fr' ? 'Maquette lisible' : 'Readable design', icon: <Layers className="w-4 h-4" /> },
    { label: lang === 'fr' ? 'Développement fiable' : 'Reliable build', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: lang === 'fr' ? 'Mise en ligne' : 'Launch', icon: <Rocket className="w-4 h-4" /> },
    { label: lang === 'fr' ? 'Optimisation continue' : 'Continuous improvement', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  return (
    <>
    {showIntro ? (
      <IntroScreen onComplete={(selectedLang) => {
        setLang(selectedLang);
        setShowIntro(false);
      }} />
    ) : (
    <div className="min-h-screen bg-[#08090d] text-slate-100 font-sans relative overflow-x-hidden animate-in fade-in duration-700">

      {/* 3D Background — re-tinted to brand cyan/lime/violet */}
      <div className="fixed inset-0 z-0 hidden md:block">
        <Suspense fallback={<div className="fixed inset-0 bg-[#08090d] -z-50" />}>
          <FloatingLines
            linesGradient={['#22d3ee', '#a3e635', '#a78bfa', '#22d3ee']}
            topWavePosition={{ x: 0, y: 1.0, rotate: 0 }}
            middleWavePosition={{ x: 0, y: 0, rotate: 0 }}
            bottomWavePosition={{ x: 0, y: -1.0, rotate: 0 }}
            lineCount={[3, 5, 3]}
            lineDistance={[4, 5, 4]}
            animationSpeed={0.7}
            interactive={true}
            bendStrength={0.5}
            parallaxStrength={0.1}
          />
        </Suspense>
      </div>

      {/* Subtle code-grid overlay (parallax-driven) */}
      <div
        className="fixed inset-0 z-0 grid-dust opacity-[0.18] md:opacity-[0.25] pointer-events-none transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${mouseOffset.x * -12}px, ${mouseOffset.y * -12}px, 0)` }}
      />

      {/* Parallax light halo following the cursor */}
      <div
        className="fixed inset-0 z-0 pointer-events-none hidden md:block transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${mouseOffset.x * 30}px, ${mouseOffset.y * 30}px, 0)` }}
        aria-hidden="true"
      >
        <div
          className="absolute h-[520px] w-[520px] rounded-full blur-[120px] opacity-50"
          style={{
            left: `calc(${(mouseOffset.x + 1) * 50}% - 260px)`,
            top: `calc(${(mouseOffset.y + 1) * 50}% - 260px)`,
            background: 'radial-gradient(circle, rgba(34,211,238,0.18), rgba(163,230,53,0.08) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl z-50 bg-[#0d1117]/90 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl transition-all duration-300">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-20">
            {/* Logo */}
            <button
              type="button"
              className="flex-shrink-0 flex items-center cursor-pointer group min-w-0 max-w-[70%]"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="3geeks — back to top"
            >
              <Logo
                variant="wordmark"
                spaced
                compact
                className="group-hover:scale-[1.02] transition-transform duration-300"
              />
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-7">
              <button onClick={() => scrollToSection('services')} className="text-sm text-slate-300 hover:text-cyan-300 transition-colors">{t.nav.services}</button>
              <button onClick={() => scrollToSection('projets')} className="text-sm text-slate-300 hover:text-cyan-300 transition-colors">{t.nav.projects}</button>
              <button onClick={() => scrollToSection('equipe')} className="text-sm text-slate-300 hover:text-cyan-300 transition-colors">{t.nav.team}</button>
              <button onClick={() => scrollToSection('temoignages')} className="text-sm text-slate-300 hover:text-cyan-300 transition-colors">{t.nav.reviews}</button>

              <button onClick={toggleLang} className="flex items-center gap-1 text-slate-200 hover:text-white text-xs border border-white/10 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 transition-all">
                 <Globe className="w-3 h-3" /> {lang.toUpperCase()}
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="glass-button px-5 py-2.5 rounded-full text-white text-sm font-semibold"
              >
                {t.nav.cta}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleLang} className="text-slate-200 font-mono text-xs">
                 {lang.toUpperCase()}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2" aria-label="menu">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-2 bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl animate-in slide-in-from-top-2">
             <div className="flex flex-col space-y-1">
              <button onClick={() => scrollToSection('services')} className="text-left text-slate-200 text-sm py-2.5 px-2 hover:bg-white/5 hover:text-cyan-300 rounded-lg transition-colors">{t.nav.services}</button>
              <button onClick={() => scrollToSection('projets')} className="text-left text-slate-200 text-sm py-2.5 px-2 hover:bg-white/5 hover:text-cyan-300 rounded-lg transition-colors">{t.nav.projects}</button>
              <button onClick={() => scrollToSection('equipe')} className="text-left text-slate-200 text-sm py-2.5 px-2 hover:bg-white/5 hover:text-cyan-300 rounded-lg transition-colors">{t.nav.team}</button>
              <button onClick={() => scrollToSection('temoignages')} className="text-left text-slate-200 text-sm py-2.5 px-2 hover:bg-white/5 hover:text-cyan-300 rounded-lg transition-colors">{t.nav.reviews}</button>
              <button onClick={() => scrollToSection('contact')} className="bg-cyan-500 text-slate-950 py-2.5 rounded-lg text-sm font-bold text-center shadow-md shadow-cyan-500/25">{t.nav.cta}</button>
             </div>
          </div>
        )}
      </nav>

      <main className="pt-20 md:pt-28 pb-20 md:pb-0 relative z-10">

        {/* HERO SECTION */}
        <section className="relative pt-6 md:pt-16 pb-8 md:pb-16">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="glass-panel p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl max-w-5xl mx-auto border border-white/10">

               <div className="text-center space-y-4 md:space-y-7">

                 <div className="inline-flex items-center px-2.5 md:px-4 py-1 md:py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-[10px] md:text-xs uppercase tracking-wide md:tracking-wider mb-0 md:mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700 backdrop-blur-sm">
                    {t.hero.badge}
                 </div>

                 <div className="flex flex-col items-center gap-2 pt-1 md:pt-0">
                   <Logo
                     variant="wordmark"
                     spaced
                     large
                     className="justify-center opacity-95"
                   />
                   <p className="text-center text-[11px] md:text-xs text-slate-500 font-mono leading-relaxed max-w-md px-2 border-b border-white/5 pb-3 md:pb-4">
                     {t.hero.brandSubtitle}
                   </p>
                 </div>

                 <div className="text-[1.35rem] leading-tight sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white md:leading-[1.05] tracking-tight drop-shadow-lg md:drop-shadow-2xl">
                   <SplitText
                     text={t.hero.titleStart}
                     className="block mb-0.5 md:mb-2"
                     delay={50}
                   />
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-lime-300 to-cyan-300 block mt-1 md:mt-0">
                     {t.hero.titleEnd}
                   </span>
                 </div>

                <p className="text-xs md:text-base text-slate-400 md:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                   {t.hero.comment}
                 </p>

                 <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 pt-1 md:pt-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500">
                   <button
                     onClick={() => scrollToSection('contact')}
                    className="w-full sm:w-auto px-5 md:px-8 py-2.5 md:py-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg md:rounded-xl font-semibold shadow-md md:shadow-[0_0_24px_rgba(34,211,238,0.3)] transition-all md:transform md:hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
                   >
                     {t.hero.ctaPrimary} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                   </button>
                   <button
                    onClick={() => scrollToSection('projets')}
                    className="w-full sm:w-auto px-5 md:px-8 py-2.5 md:py-4 bg-white/5 border border-white/15 hover:border-cyan-300/60 text-slate-100 rounded-lg md:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                   >
                     {t.hero.ctaSecondary}
                   </button>
                 </div>
               </div>
             </div>

             {/* STATS BAR */}
             <div className="max-w-5xl mx-auto mt-4 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
               {[
                 { n: '03', l: t.stats.founders },
                 { n: '03', l: t.stats.projects },
                 { n: '24h', l: t.stats.response },
                 { n: '100%', l: t.stats.french },
               ].map((s, i) => (
                 <div key={i} className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 text-center">
                  <div className="text-xl md:text-3xl font-bold text-cyan-300 text-glow-cyan">{s.n}</div>
                  <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide md:tracking-widest mt-0.5 md:mt-1 leading-tight">{s.l}</div>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projets" className="py-9 md:py-20 relative bg-[#0d1117]/25">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="max-w-3xl mx-auto mb-6 md:mb-14 rounded-2xl md:rounded-3xl text-center">
                <div className="text-[10px] md:text-xs text-cyan-300/80 mb-2 md:mb-3 uppercase tracking-wide">{t.projects.path}</div>
                 <h2 className="text-xl md:text-4xl font-display font-bold text-white mb-2 md:mb-4 leading-snug">
                    <GradientText colors={['#fff', '#22d3ee', '#fff']} animationSpeed={6}>{t.projects.title}</GradientText>
                 </h2>
                 <p className="text-sm md:text-base text-slate-400 md:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">{t.projects.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-7">
                 {/* Project 1 */}
                 <div className="glass-panel rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col border border-white/10 relative">
                   <IdeBar filename={t.projects.p1.tag} variant="window" />
                    <div className="p-4 md:p-7 relative flex flex-col flex-1">
                      <div className="absolute top-4 right-4 -mt-2 -mr-2 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl opacity-70 transition-opacity duration-700"></div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-cyan-400/25 rounded-xl md:rounded-2xl flex items-center justify-center shadow-md md:shadow-lg mb-3 md:mb-5 relative z-10 overflow-hidden p-2 md:p-3 backdrop-blur-md">
                         <img src={divorceImg} alt="Express Divorce USA" loading="lazy" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 relative z-10">{t.projects.p1.title}</h3>
                      <p className="text-sm text-slate-400 md:text-slate-300 leading-relaxed mb-4 md:mb-5 relative z-10">{t.projects.p1.desc}</p>
                      <ul className="space-y-1.5 md:space-y-2 mb-5 md:mb-8 relative z-10 flex-1">
                        <li className="text-xs md:text-sm text-slate-200 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p1.result1}</li>
                        <li className="text-xs md:text-sm text-slate-200 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p1.result2}</li>
                        <li className="text-xs md:text-sm text-slate-200 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p1.result3}</li>
                      </ul>
                      <a
                        href={t.projects.p1.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 md:py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 rounded-lg md:rounded-xl text-sm font-semibold text-white transition-all relative z-10 group/btn"
                      >
                         {t.projects.p1.btn} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </div>
                 </div>

                 {/* Project 2 */}
                 <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-500/12 via-[#0d1117]/88 to-lime-500/10 backdrop-blur-2xl border border-cyan-400/35 flex flex-col transition-all duration-500 shadow-[0_18px_50px_-25px_rgba(34,211,238,0.45)] relative z-10">
                    <IdeBar filename={t.projects.p2.tag} accent="lime" variant="window" />
                    <div className="p-4 md:p-7 relative flex flex-col flex-1">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-32 h-32 bg-lime-400/20 rounded-full blur-3xl opacity-60"></div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/15 border border-white/25 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-5 relative z-10 shadow-lg md:shadow-xl overflow-hidden p-1">
                         <img src={callKitchenImg} alt="CallKitchen" loading="lazy" className="w-full h-full object-cover rounded-lg md:rounded-xl" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 relative z-10">{t.projects.p2.title}</h3>
                      <p className="text-sm text-slate-300 md:text-slate-200 leading-relaxed mb-4 md:mb-5 relative z-10">{t.projects.p2.desc}</p>
                      <ul className="space-y-1.5 md:space-y-2 mb-5 md:mb-8 relative z-10 flex-1">
                        <li className="text-xs md:text-sm text-slate-100 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p2.result1}</li>
                        <li className="text-xs md:text-sm text-slate-100 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p2.result2}</li>
                        <li className="text-xs md:text-sm text-slate-100 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p2.result3}</li>
                      </ul>
                      <a
                        href={t.projects.p2.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 md:py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg md:rounded-xl text-sm font-semibold shadow-md md:shadow-lg shadow-cyan-500/25 transition-all relative z-10 group/btn"
                      >
                         {t.projects.p2.btn} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </div>
                 </div>

                 {/* Project 3 */}
                 <div className="glass-panel rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col border border-white/10 relative">
                    <IdeBar filename={t.projects.p3.tag} variant="window" />
                    <div className="p-4 md:p-7 relative flex flex-col flex-1">
                      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-violet-500/15 rounded-full blur-3xl opacity-70 transition-opacity duration-700"></div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-violet-500/10 border border-violet-400/25 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-3 md:mb-5 relative z-10 overflow-hidden p-1">
                         <img src="https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/8a/87/0f/8a870f74-5c66-359c-2901-e2fd674575f7/Placeholder.mill/400x400bb-75.webp" alt="Two App" loading="lazy" className="w-full h-full object-cover rounded-lg md:rounded-xl" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3 relative z-10">{t.projects.p3.title}</h3>
                      <p className="text-sm text-slate-400 md:text-slate-300 leading-relaxed mb-4 md:mb-5 relative z-10">{t.projects.p3.desc}</p>
                      <ul className="space-y-1.5 md:space-y-2 mb-5 md:mb-8 relative z-10 flex-1">
                        <li className="text-xs md:text-sm text-slate-200 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p3.result1}</li>
                        <li className="text-xs md:text-sm text-slate-200 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p3.result2}</li>
                        <li className="text-xs md:text-sm text-slate-200 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-lime-300 flex-shrink-0" /> {t.projects.p3.result3}</li>
                      </ul>
                      <a
                        href={t.projects.p3.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 md:py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-400/40 rounded-lg md:rounded-xl text-sm font-semibold text-white transition-all relative z-10 group/btn"
                      >
                         {t.projects.p3.btn} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* OPEN SOURCE PROJECTS */}
        <section className="py-10 md:py-24 relative bg-[#0d1117]/25">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
            <div className="absolute left-[15%] top-[10%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute right-[10%] bottom-[10%] h-80 w-80 rounded-full bg-cyan-400/[0.08] blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 md:mb-14 flex flex-col items-center text-center px-1">
              <div className="mb-3 md:mb-4 inline-flex flex-wrap justify-center items-center gap-1.5 md:gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/[0.08] px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.18em] text-emerald-200 backdrop-blur-sm max-w-full">
                <Github className="h-3.5 w-3.5" />
                {t.openSource.path}
                <span className="h-1 w-1 rounded-full bg-emerald-300/50" aria-hidden="true" />
                <Leaf className="h-3.5 w-3.5" />
                <span>Green stack</span>
              </div>
              <h2 className="text-xl md:text-5xl font-display font-bold text-white tracking-tight leading-snug">
                {t.openSource.title}
              </h2>
              <p className="mt-2 md:mt-4 max-w-2xl text-sm md:text-lg text-slate-400 md:text-slate-300 leading-relaxed">{t.openSource.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-5">
              {/* Prompt Hub — featured */}
              <article className="relative overflow-hidden rounded-[2rem] border border-emerald-300/30 bg-gradient-to-br from-[#08130e] via-[#06110d] to-[#04140e] shadow-[0_30px_90px_-35px_rgba(52,211,153,0.55)] lg:col-span-3">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />
                <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
                    </div>
                    <span className="hidden sm:inline text-xs font-mono text-slate-500">prompt-hub.3geeks.fr</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-300/[0.12] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    </span>
                    Beta
                  </span>
                </div>

                <div className="relative z-10 flex h-full flex-col p-4 md:p-9">
                  <div className="mb-4 md:mb-6 flex flex-col gap-3 md:gap-5 sm:flex-row sm:items-center">
                    <PromptHubMark className="h-14 w-14 md:h-24 md:w-24 shrink-0 mx-auto sm:mx-0" />
                    <div className="text-center sm:text-left">
                      <div className="mb-1 md:mb-2 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300/85">
                        {t.openSource.p2.tag}
                      </div>
                      <h3 className="text-2xl md:text-5xl font-bold tracking-tight text-white leading-tight">{t.openSource.p2.title}</h3>
                      <div className="mt-1 md:mt-2 text-[10px] md:text-xs text-emerald-200/70">{t.openSource.p2.status}</div>
                    </div>
                  </div>

                  <p className="mb-5 md:mb-7 max-w-2xl text-sm md:text-lg leading-relaxed text-slate-300 md:text-slate-200">{t.openSource.p2.desc}</p>

                  <div className="mb-5 md:mb-8 grid grid-cols-1 gap-2 md:gap-3 sm:grid-cols-3">
                    {[t.openSource.p2.point1, t.openSource.p2.point2, t.openSource.p2.point3].map((point) => (
                      <div
                        key={point}
                        className="rounded-xl md:rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-3 md:p-4 text-xs md:text-sm text-slate-200 transition-colors hover:border-emerald-300/30 hover:bg-emerald-300/[0.07]"
                      >
                        <CheckCircle2 className="mb-2 md:mb-3 h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-300" />
                        {point}
                      </div>
                    ))}
                  </div>

                  <a
                    href={t.openSource.p2.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-fit items-center justify-center gap-2 rounded-xl md:rounded-2xl bg-emerald-400 px-5 py-2.5 md:px-7 md:py-3.5 text-sm md:text-base font-bold text-[#06110d] shadow-md md:shadow-[0_22px_50px_-20px_rgba(52,211,153,0.8)] transition-all hover:bg-emerald-300 md:hover:shadow-[0_22px_60px_-15px_rgba(52,211,153,1)] group/link"
                  >
                    {t.openSource.p2.btn}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </article>

              {/* PromptOptim — secondary */}
              <article className="relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#06110d]/85 backdrop-blur-xl transition-all hover:border-emerald-300/25 lg:col-span-2">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />

                <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/65" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/65" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/65" />
                    </div>
                    <span className="hidden sm:inline text-xs font-mono text-slate-500">promptoptim.app</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                    Live
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4 md:p-7">
                  <div className="mb-4 md:mb-5 flex items-center gap-3 md:gap-4">
                    <div className="relative flex h-11 w-11 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl md:rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-300/20 to-emerald-500/10 text-emerald-200 shadow-md md:shadow-[0_8px_24px_-12px_rgba(52,211,153,0.6)]">
                      <Leaf className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-0.5 md:mb-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                        {t.openSource.p1.tag}
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white leading-snug">{t.openSource.p1.title}</h3>
                    </div>
                  </div>

                  <p className="mb-4 md:mb-6 text-sm leading-relaxed text-slate-400 md:text-slate-300">{t.openSource.p1.desc}</p>

                  <ul className="mb-5 md:mb-7 flex-1 space-y-2 md:space-y-2.5">
                    {[t.openSource.p1.point1, t.openSource.p1.point2, t.openSource.p1.point3].map((point) => (
                      <li key={point} className="flex items-start gap-2 text-xs md:text-sm text-slate-200">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0 text-emerald-300" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={t.openSource.p1.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl md:rounded-2xl border border-emerald-300/30 bg-emerald-300/[0.08] py-2.5 md:py-3.5 text-sm font-semibold text-emerald-100 transition-all hover:border-emerald-300/50 hover:bg-emerald-300/[0.14] group/link"
                  >
                    {t.openSource.p1.btn}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* WHY US (Bento Grid) */}
        <section className="py-9 md:py-16 relative bg-[#0d1117]/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-8 md:mb-12 bg-[#0d1117]/40 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl text-center shadow-lg md:shadow-2xl">
              <div className="text-[10px] md:text-xs font-mono text-cyan-300/80 mb-1 md:mb-2">{t.whyUs.path}</div>
              <h2 className="text-lg md:text-3xl font-display font-bold text-white mb-2 md:mb-3 leading-snug">
                 <GradientText colors={['#fff', '#22d3ee', '#a3e635', '#fff']} animationSpeed={8}>{t.whyUs.title}</GradientText>
              </h2>
              <p className="text-sm text-slate-400 md:text-slate-300 font-medium leading-relaxed">{t.whyUs.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
               {/* Card 1 */}
               <div className="glass-panel col-span-1 md:col-span-2 rounded-2xl md:rounded-3xl overflow-hidden hover:bg-[#0d1117]/85 transition-all duration-500 group md:hover:scale-[1.01] md:hover:shadow-2xl md:hover:shadow-cyan-500/15">
                  <IdeBar filename={t.whyUs.card1.file} />
                  <div className="p-5 md:p-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-400/15 border border-cyan-400/30 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 text-cyan-300 md:group-hover:scale-110 transition-transform">
                       <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-white mb-1.5 md:mb-2 font-mono">{t.whyUs.card1.title}</h3>
                    <p className="text-sm text-slate-400 md:text-slate-300 leading-relaxed">{t.whyUs.card1.desc}</p>
                  </div>
               </div>

               {/* Card 2 (highlighted) */}
               <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-500/15 via-[#0d1117]/80 to-violet-500/10 border border-cyan-400/30 backdrop-blur-2xl text-white relative group transition-all duration-500 md:hover:scale-[1.01] md:hover:shadow-2xl md:hover:shadow-cyan-500/25">
                  <IdeBar filename={t.whyUs.card2.file} accent="lime" />
                  <div className="absolute top-2 right-0 -mt-4 -mr-4 w-24 h-24 bg-lime-400/20 rounded-full blur-2xl opacity-60 md:group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-5 md:p-8 relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-lime-400/15 border border-lime-400/30 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 text-lime-300 backdrop-blur-sm">
                       <Database className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-base md:text-xl font-bold mb-1.5 md:mb-2 font-mono">{t.whyUs.card2.title}</h3>
                    <p className="text-sm text-slate-300 md:text-slate-200 leading-relaxed">{t.whyUs.card2.desc}</p>
                  </div>
               </div>

               {/* Card 3 */}
               <div className="glass-panel rounded-2xl md:rounded-3xl overflow-hidden hover:bg-[#0d1117]/85 transition-all duration-500 group md:hover:scale-[1.01] md:hover:shadow-2xl md:hover:shadow-violet-500/15">
                  <IdeBar filename={t.whyUs.card3.file} />
                  <div className="p-5 md:p-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-violet-400/15 border border-violet-400/30 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 text-violet-300 md:group-hover:rotate-12 transition-transform">
                       <Store className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-white mb-1.5 md:mb-2 font-mono">{t.whyUs.card3.title}</h3>
                    <p className="text-sm text-slate-400 md:text-slate-300 leading-relaxed">{t.whyUs.card3.desc}</p>
                  </div>
               </div>

               {/* Card 4 */}
               <div className="col-span-1 md:col-span-2 glass-panel rounded-2xl md:rounded-3xl overflow-hidden hover:bg-[#0d1117]/85 transition-all duration-500 group md:hover:scale-[1.01] md:hover:shadow-2xl md:hover:shadow-cyan-500/15">
                  <IdeBar filename={t.whyUs.card4.file} />
                  <div className="p-5 md:p-8">
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-400/15 border border-cyan-400/30 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm text-cyan-300 flex-shrink-0">
                         <Users className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-xl font-bold text-white mb-1.5 md:mb-2 font-mono">{t.whyUs.card4.title}</h3>
                        <p className="text-sm text-slate-400 md:text-slate-300 leading-relaxed">{t.whyUs.card4.desc}</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* STACK SECTION (NEW) */}
        <section className="py-8 md:py-16 relative bg-[#0d1117]/25">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 md:mb-10 max-w-3xl mx-auto">
              <div className="text-xs md:text-sm font-mono text-cyan-300 mb-2 md:mb-3 tracking-wide">{t.stack.path}</div>
              <h3 className="text-xl md:text-3xl font-display font-bold text-white leading-snug">{t.stack.title}</h3>
              <p className="text-slate-300 text-sm md:text-base mt-3 md:mt-4 max-w-2xl mx-auto leading-relaxed">{t.stack.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
              {stackChips.map((chip, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2.5 rounded-full bg-[#0d1117]/80 border border-white/15 backdrop-blur-md font-mono text-xs md:text-sm text-slate-200 hover:border-cyan-400/50 hover:text-cyan-300 md:hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
                >
                  <span className="text-lime-300 group-hover:text-cyan-300 transition-colors">{chip.icon}</span>
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-9 md:py-16 relative bg-[#0d1117]/25">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto mb-8 md:mb-12 bg-[#0d1117]/40 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl text-center shadow-lg md:shadow-2xl">
                 <div className="text-[10px] md:text-xs font-mono text-cyan-300/80 mb-1 md:mb-2">{t.services.path}</div>
                 <h2 className="text-xl md:text-4xl font-display font-bold text-white leading-snug">
                    <GradientText colors={['#22d3ee', '#a3e635', '#22d3ee']} animationSpeed={6}>{t.services.title}</GradientText>
                 </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                 {/* Service 1 */}
                 <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden hover:border-cyan-400/40 transition-all duration-300 flex flex-col group md:hover:scale-[1.02] md:hover:-translate-y-1 md:hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.35)]">
                    <IdeBar filename={lang === 'fr' ? 'Site vitrine' : 'Business website'} />
                    <div className="p-5 md:p-8 flex flex-col flex-1">
                      <div className="inline-block bg-white/10 text-white text-[10px] md:text-[11px] font-mono font-bold px-2.5 py-0.5 md:px-3 md:py-1 rounded-full w-fit mb-3 md:mb-4 uppercase tracking-wider">{t.services.s1.badge}</div>
                      <h3 className="text-lg md:text-2xl font-display font-bold text-white mb-3 md:mb-4">{t.services.s1.title}</h3>
                      <div className="mb-4 md:mb-6">
                         <div className="text-2xl md:text-3xl font-bold text-white font-mono">{t.services.s1.price}</div>
                         <div className="text-xs md:text-sm text-slate-400 font-mono">{t.services.s1.subPrice}</div>
                      </div>
                      <ul className="space-y-2 md:space-y-3 mb-5 md:mb-8 flex-1">
                         {t.services.s1.features.map((item, i) => (
                           <li key={i} className="flex items-center gap-2 md:gap-3 text-slate-300 md:text-slate-200 text-xs md:text-sm">
                              {item.checked ? (
                                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-lime-300 flex-shrink-0" />
                              ) : (
                                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-300 flex-shrink-0" />
                              )}
                              {item.text}
                           </li>
                         ))}
                      </ul>
                      <button onClick={() => handleServiceSelect('starter')} className="w-full py-2.5 md:py-3 text-sm border border-white/10 bg-white/5 rounded-lg md:rounded-xl font-mono font-bold text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all">{t.services.s1.btn}</button>
                    </div>
                 </div>

                 {/* Service 2 (highlighted) */}
                 <div className="rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/10 via-[#0d1117]/85 to-violet-500/10 border border-cyan-400/40 relative transform md:-translate-y-4 md:hover:-translate-y-5 md:hover:scale-[1.03] transition-all duration-300 shadow-md md:shadow-[0_0_40px_rgba(34,211,238,0.25)] md:hover:shadow-[0_0_80px_rgba(34,211,238,0.55)] flex flex-col z-10">
                    <IdeBar filename={lang === 'fr' ? 'Projet sur mesure' : 'Custom project'} accent="lime" />
                    <div className="p-5 md:p-8 flex flex-col flex-1">
                      <h3 className="text-lg md:text-2xl font-display font-bold text-white mb-3 md:mb-4">{t.services.s2.title}</h3>
                      <div className="mb-4 md:mb-6">
                         <div className="text-2xl md:text-3xl font-bold text-cyan-300 font-mono">{t.services.s2.price}</div>
                         <div className="text-xs md:text-sm text-slate-300 font-mono">{t.services.s2.subPrice}</div>
                      </div>
                      <ul className="space-y-2 md:space-y-3 mb-5 md:mb-8 flex-1">
                         {t.services.s2.features.map((item, i) => (
                           <li key={i} className="flex items-center gap-2 md:gap-3 text-slate-200 md:text-slate-100 text-xs md:text-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-lime-300 flex-shrink-0" /> {item.text}
                           </li>
                         ))}
                      </ul>
                      <button onClick={() => handleServiceSelect('custom')} className="w-full py-2.5 md:py-3 text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg md:rounded-xl font-mono font-bold transition-colors shadow-md md:shadow-lg shadow-cyan-500/30">{t.services.s2.btn}</button>
                    </div>
                 </div>

                 {/* Service 3 */}
                 <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden hover:border-violet-400/40 transition-all duration-300 flex flex-col group md:hover:scale-[1.02] md:hover:-translate-y-1 md:hover:shadow-[0_10px_40px_-10px_rgba(167,139,250,0.4)]">
                    <IdeBar filename={lang === 'fr' ? 'Refonte complète' : 'Complete redesign'} />
                    <div className="p-5 md:p-8 flex flex-col flex-1">
                      <div className="inline-block bg-violet-400/20 text-violet-300 text-[10px] md:text-[11px] font-mono font-bold px-2.5 py-0.5 md:px-3 md:py-1 rounded-full w-fit mb-3 md:mb-4 uppercase tracking-wider">{t.services.s3.badge}</div>
                      <h3 className="text-lg md:text-2xl font-display font-bold text-white mb-3 md:mb-4">{t.services.s3.title}</h3>
                      <div className="mb-4 md:mb-6">
                         <div className="text-2xl md:text-3xl font-bold text-white font-mono">{t.services.s3.price}</div>
                         <div className="text-xs md:text-sm text-slate-400 font-mono">{t.services.s3.subPrice}</div>
                      </div>
                      <ul className="space-y-2 md:space-y-3 mb-5 md:mb-8 flex-1">
                         {t.services.s3.features.map((item, i) => (
                           <li key={i} className="flex items-center gap-2 md:gap-3 text-slate-300 md:text-slate-200 text-xs md:text-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-lime-300 flex-shrink-0" /> {item.text}
                           </li>
                         ))}
                      </ul>
                      <button onClick={() => handleServiceSelect('redesign')} className="w-full py-2.5 md:py-3 text-sm border border-white/10 bg-white/5 rounded-lg md:rounded-xl font-mono font-bold text-white hover:bg-white/10 hover:border-violet-400/50 transition-all">{t.services.s3.btn}</button>
                    </div>
                 </div>
              </div>

              {/* Maintenance Add-on */}
              <div
                className="mt-8 md:mt-12 max-w-3xl mx-auto relative overflow-hidden rounded-xl md:rounded-2xl border border-lime-400/40 bg-gradient-to-r from-lime-400/10 via-[#0d1117]/85 to-cyan-400/10 p-5 md:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 hover:border-lime-400/60 transition-all duration-300 group md:hover:shadow-[0_10px_40px_-10px_rgba(163,230,53,0.35)] md:hover:-translate-y-1 cursor-pointer"
                onClick={() => handleServiceSelect('maintenance_only')}
              >
                 <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_50%,rgba(163,230,53,0.12),transparent_55%)]" />
                 <div className="flex items-start gap-3 md:gap-4 w-full sm:w-auto relative z-10">
                    <div className="p-2.5 md:p-3.5 bg-lime-400/20 border border-lime-400/40 rounded-lg md:rounded-xl text-lime-300 md:group-hover:scale-110 transition-transform shrink-0">
                       <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                       <div className="flex flex-wrap items-center gap-2 mb-1">
                         <h4 className="text-white font-bold text-base md:text-xl font-mono">{t.services.maintenanceTitle}</h4>
                         <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30">
                           {t.services.maintenanceHighlight}
                         </span>
                       </div>
                       <p className="text-slate-300 text-sm md:text-base max-w-md mt-0.5 leading-relaxed">
                          {t.services.maintenanceDesc} <span className="text-lime-300 font-bold font-mono">{t.services.maintenancePrice}</span>.
                       </p>
                    </div>
                 </div>
                 <button type="button" className="relative z-10 whitespace-nowrap w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 bg-lime-400/15 border border-lime-400/40 hover:bg-lime-400/25 rounded-full text-xs md:text-sm font-mono font-bold text-lime-200 transition-all">
                    {t.services.maintenanceCta}
                 </button>
              </div>
           </div>
        </section>

        {/* TEAM SECTION */}
        <section id="equipe" className="py-10 md:py-20 relative bg-[#0d1117]/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-8 md:mb-16 bg-[#0d1117]/40 backdrop-blur-xl border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl text-center shadow-lg md:shadow-2xl">
              <div className="text-[10px] md:text-xs font-mono text-cyan-300/80 mb-1 md:mb-2">{t.team.path}</div>
              <h2 className="text-xl md:text-4xl font-display font-bold text-white mb-2 md:mb-4 leading-snug">{t.team.title}</h2>
              <p className="text-sm text-slate-400 md:text-slate-300 max-w-2xl mx-auto leading-relaxed">{t.team.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">

              {/* Member 1: Elias */}
              <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden hover:bg-[#0d1117]/85 transition-all duration-300 group text-center flex flex-col md:hover:scale-[1.02] md:hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.4)]">
                 <IdeBar filename={t.team.roles.elias} />
                 <div className="p-4 md:p-6 flex flex-col items-center">
                   <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4 md:mb-6 md:group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-cyan-400/50 shadow-md md:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                      <img
                        src={eliasImg}
                        alt="Elias Eloumi"
                        className="w-full h-full rounded-full object-cover"
                        loading="lazy"
                      />
                   </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Elias Eloumi</h3>
                  <p className="text-cyan-300 text-[10px] md:text-xs mb-3 md:mb-4 flex items-center gap-1 justify-center"><Sparkles className="w-3 h-3 shrink-0" />{t.team.roles.elias}</p>
                   <p className="text-slate-400 md:text-slate-300 text-xs md:text-sm mb-4 md:mb-6 max-w-xs leading-relaxed">{t.team.roles.eliasDesc}</p>
                   <a
                     href="https://www.linkedin.com/in/elias-eloumi/"
                     target="_blank"
                     rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-sky-600 hover:bg-sky-500 rounded-lg md:rounded-xl text-white text-xs md:text-sm font-semibold transition-colors"
                   >
                    <svg viewBox="0 0 100 100" className="w-5 h-5 shrink-0 fill-neutral-50">
                       <path d="M92.86,0H7.12A7.17,7.17,0,0,0,0,7.21V92.79A7.17,7.17,0,0,0,7.12,100H92.86A7.19,7.19,0,0,0,100,92.79V7.21A7.19,7.19,0,0,0,92.86,0ZM30.22,85.71H15.4V38H30.25V85.71ZM22.81,31.47a8.59,8.59,0,1,1,8.6-8.59A8.6,8.6,0,0,1,22.81,31.47Zm63,54.24H71V62.5c0-5.54-.11-12.66-7.7-12.66s-8.91,6-8.91,12.26V85.71H39.53V38H53.75v6.52H54c2-3.75,6.83-7.7,14-7.7,15,0,17.79,9.89,17.79,22.74Z" />
                     </svg>
                    <span>Elias Eloumi</span>
                   </a>
                 </div>
              </div>

              {/* Member 2: Noam */}
              <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden hover:bg-[#0d1117]/85 transition-all duration-300 group text-center flex flex-col md:hover:scale-[1.02] md:hover:shadow-[0_20px_40px_-10px_rgba(163,230,53,0.4)]">
                 <IdeBar filename={t.team.roles.noam} accent="lime" />
                 <div className="p-4 md:p-6 flex flex-col items-center">
                   <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4 md:mb-6 md:group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-lime-400/50 shadow-md md:shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                      <img
                        src={noamImg}
                        alt="Noam Leclappart"
                        className="w-full h-full rounded-full object-cover"
                        loading="lazy"
                      />
                   </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Noam Leclappart</h3>
                  <p className="text-lime-300 text-[10px] md:text-xs mb-3 md:mb-4 flex items-center gap-1 justify-center"><Database className="w-3 h-3 shrink-0" />{t.team.roles.noam}</p>
                   <p className="text-slate-400 md:text-slate-300 text-xs md:text-sm mb-4 md:mb-6 max-w-xs leading-relaxed">{t.team.roles.noamDesc}</p>
                   <a
                     href="https://www.linkedin.com/in/noam-leclapart-jublot/"
                     target="_blank"
                     rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-sky-600 hover:bg-sky-500 rounded-lg md:rounded-xl text-white text-xs md:text-sm font-semibold transition-colors"
                   >
                    <svg viewBox="0 0 100 100" className="w-5 h-5 shrink-0 fill-neutral-50">
                       <path d="M92.86,0H7.12A7.17,7.17,0,0,0,0,7.21V92.79A7.17,7.17,0,0,0,7.12,100H92.86A7.19,7.19,0,0,0,100,92.79V7.21A7.19,7.19,0,0,0,92.86,0ZM30.22,85.71H15.4V38H30.25V85.71ZM22.81,31.47a8.59,8.59,0,1,1,8.6-8.59A8.6,8.6,0,0,1,22.81,31.47Zm63,54.24H71V62.5c0-5.54-.11-12.66-7.7-12.66s-8.91,6-8.91,12.26V85.71H39.53V38H53.75v6.52H54c2-3.75,6.83-7.7,14-7.7,15,0,17.79,9.89,17.79,22.74Z" />
                     </svg>
                    <span>Noam Leclappart</span>
                   </a>
                 </div>
              </div>

               {/* Member 3: Charles */}
              <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden hover:bg-[#0d1117]/85 transition-all duration-300 group text-center flex flex-col md:hover:scale-[1.02] md:hover:shadow-[0_20px_40px_-10px_rgba(167,139,250,0.4)]">
                 <IdeBar filename={t.team.roles.charles} />
                 <div className="p-4 md:p-6 flex flex-col items-center">
                   <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4 md:mb-6 md:group-hover:scale-105 transition-transform p-1 rounded-full border-2 border-violet-400/50 shadow-md md:shadow-[0_0_20px_rgba(167,139,250,0.3)]">
                      <img
                        src={charlesImg}
                        alt="Charles Garbus"
                        className="w-full h-full rounded-full object-cover"
                        loading="lazy"
                      />
                   </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Charles Garbus</h3>
                  <p className="text-violet-300 text-[10px] md:text-xs mb-3 md:mb-4 flex items-center gap-1 justify-center"><Users className="w-3 h-3 shrink-0" />{t.team.roles.charles}</p>
                   <p className="text-slate-400 md:text-slate-300 text-xs md:text-sm mb-4 md:mb-6 max-w-xs leading-relaxed">{t.team.roles.charlesDesc}</p>
                   <a
                     href="https://www.linkedin.com/in/charlesgarbus/"
                     target="_blank"
                     rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-sky-600 hover:bg-sky-500 rounded-lg md:rounded-xl text-white text-xs md:text-sm font-semibold transition-colors"
                   >
                    <svg viewBox="0 0 100 100" className="w-5 h-5 shrink-0 fill-neutral-50">
                       <path d="M92.86,0H7.12A7.17,7.17,0,0,0,0,7.21V92.79A7.17,7.17,0,0,0,7.12,100H92.86A7.19,7.19,0,0,0,100,92.79V7.21A7.19,7.19,0,0,0,92.86,0ZM30.22,85.71H15.4V38H30.25V85.71ZM22.81,31.47a8.59,8.59,0,1,1,8.6-8.59A8.6,8.6,0,0,1,22.81,31.47Zm63,54.24H71V62.5c0-5.54-.11-12.66-7.7-12.66s-8.91,6-8.91,12.26V85.71H39.53V38H53.75v6.52H54c2-3.75,6.83-7.7,14-7.7,15,0,17.79,9.89,17.79,22.74Z" />
                     </svg>
                    <span>Charles Garbus</span>
                   </a>
                 </div>
              </div>

            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section id="temoignages" className="py-10 md:py-20 relative bg-[#0d1117]/25">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto mb-8 md:mb-16 bg-[#0d1117]/40 backdrop-blur-xl border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl text-center shadow-lg md:shadow-2xl">
                <div className="text-[10px] md:text-xs text-cyan-300/80 mb-1 md:mb-2 uppercase tracking-wide">{t.reviews.path}</div>
                <h2 className="text-xl md:text-4xl font-display font-bold text-white leading-snug">{t.reviews.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                 {/* Testimonial 1 */}
                 <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden">
                   <IdeBar filename={t.reviews.path} accent="lime" />
                    <div className="p-4 md:p-6">
                      <div className="flex gap-1 text-lime-300 mb-2 md:mb-3 items-center">
                        <span className="text-[10px] md:text-[11px] mr-2">5/5</span>
                         {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-200 md:text-slate-100 text-sm md:text-base mb-4 md:mb-6 italic font-medium leading-relaxed">"{t.reviews.r1}"</p>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/30 to-lime-300/30 rounded-full flex items-center justify-center text-white font-bold border border-cyan-400/40 font-mono text-sm shadow-[0_0_12px_rgba(34,211,238,0.3)]">A</div>
                         <div className="flex-1">
                           <p className="text-sm font-bold text-white">Adrien</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="px-2 py-0.5 bg-cyan-400/20 border border-cyan-400/40 rounded text-[10px] text-cyan-300">CallKitchen</span>
                               <span className="text-slate-500">+</span>
                               <span className="px-2 py-0.5 bg-violet-400/20 border border-violet-400/40 rounded text-[10px] text-violet-300 font-mono">Express Divorce</span>
                            </div>
                         </div>
                      </div>
                    </div>
                 </div>

                 {/* Testimonial 2 - Henry from Two App */}
                 <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden border-lime-400/30">
                   <IdeBar filename={t.reviews.path} accent="lime" />
                    <div className="p-4 md:p-6">
                      <div className="flex gap-1 text-lime-300 mb-2 md:mb-3 items-center">
                         <span className="text-[10px] md:text-[11px] mr-2">5/5</span>
                         {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-200 md:text-slate-100 text-sm md:text-base mb-4 md:mb-6 italic font-medium leading-relaxed">"{t.reviews.r2}"</p>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gradient-to-br from-violet-400/30 to-lime-300/30 rounded-full flex items-center justify-center text-white font-bold border border-violet-400/40 font-mono text-sm">H</div>
                         <div className="flex-1">
                           <p className="text-sm font-bold text-white">Henry F.</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="px-2 py-0.5 bg-violet-400/20 border border-violet-400/40 rounded text-[10px] text-violet-300">Two App</span>
                               <span className="text-[10px] text-slate-500">verified review</span>
                            </div>
                         </div>
                      </div>
                    </div>
                 </div>

                 {/* Testimonial 3 */}
                 <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden hidden lg:block">
                   <IdeBar filename={t.reviews.path} accent="lime" />
                    <div className="p-4 md:p-6">
                      <div className="flex gap-1 text-lime-300 mb-2 md:mb-3 items-center">
                        <span className="text-[10px] md:text-[11px] mr-2">5/5</span>
                         {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-200 md:text-slate-100 text-sm md:text-base mb-4 md:mb-6 italic font-medium leading-relaxed">"{t.reviews.r3}"</p>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold border border-white/5 font-mono">PV</div>
                         <div>
                           <p className="text-sm font-bold text-white">Pierre V.</p>
                           <p className="text-xs text-slate-400">Concept Store</p>
                         </div>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-10 md:py-20 relative bg-[#0d1117]/25">
           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-panel rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl flex flex-col md:flex-row border border-white/10">

                 {/* Form Side */}
                 <div className="p-5 md:p-12 md:w-3/5 relative">
                   <div className="text-[10px] md:text-xs text-cyan-300/80 mb-1 md:mb-2 uppercase tracking-wide">{t.contact.path}</div>
                    <h2 className="text-xl md:text-3xl font-display font-bold text-white mb-1 md:mb-2 leading-snug">{t.contact.title}</h2>
                    <p className="text-sm text-slate-400 md:text-slate-300 mb-5 md:mb-8 font-medium leading-relaxed">{t.contact.subtitle}</p>

                    {formStatus === 'success' ? (
                       <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in py-8 md:py-12">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-lime-400/15 text-lime-300 rounded-full flex items-center justify-center mb-4 md:mb-6 border border-lime-400/30 glow-lime">
                             <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
                          </div>
                          <h3 className="text-lg md:text-2xl font-bold text-white mb-2">{t.contact.successTitle}</h3>
                          <p className="text-sm text-slate-400 md:text-slate-300 max-w-xs mb-5 md:mb-8">{t.contact.successDesc}</p>
                          <div className="p-3 md:p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg md:rounded-xl text-xs md:text-sm text-cyan-200">
                            {t.contact.successTip}
                          </div>
                       </div>
                    ) : (
                       <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                             <div className="group">
                               <label className="block text-[10px] md:text-xs font-semibold text-slate-400 md:text-slate-300 mb-1 md:mb-2 uppercase tracking-wider">{t.contact.form.name}</label>
                                <input
                                   name="name"
                                   required
                                   type="text"
                                   placeholder="John Doe"
                                   className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm rounded-lg md:rounded-xl bg-[#0d1117]/70 backdrop-blur-md border border-white/10 focus:border-cyan-400 focus:bg-white/5 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all duration-300 text-white placeholder:text-slate-500 shadow-inner"
                                />
                             </div>
                             <div className="group">
                                <label className="block text-[10px] md:text-xs font-mono font-semibold text-slate-400 md:text-slate-300 mb-1 md:mb-2 uppercase tracking-wider">{t.contact.form.email}</label>
                                <input
                                   name="email"
                                   required
                                   type="email"
                                   placeholder="john@example.com"
                                   className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm rounded-lg md:rounded-xl bg-[#0d1117]/70 backdrop-blur-md border border-white/10 focus:border-cyan-400 focus:bg-white/5 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all duration-300 text-white placeholder:text-slate-500 font-mono shadow-inner"
                                />
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="group">
                               <label className="block text-[10px] md:text-xs font-mono font-semibold text-slate-400 md:text-slate-300 mb-1 md:mb-2 uppercase tracking-wider">{t.contact.form.type}</label>
                               <div className="relative">
                                 <select name="type" className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm rounded-lg md:rounded-xl bg-[#0d1117]/70 backdrop-blur-md border border-white/10 focus:border-cyan-400 focus:bg-white/5 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all duration-300 text-white appearance-none cursor-pointer font-mono shadow-inner">
                                    {t.contact.form.types.map((type, i) => (
                                        <option key={i} className="bg-[#0d1117] text-white py-2" value={type}>{type}</option>
                                    ))}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                               </div>
                            </div>

                            <div className="group">
                               <label className="block text-[10px] md:text-xs font-mono font-semibold text-slate-400 md:text-slate-300 mb-1 md:mb-2 uppercase tracking-wider">{t.contact.form.serviceInterest}</label>
                               <div className="relative">
                                 <select name="service" className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm rounded-lg md:rounded-xl bg-[#0d1117]/70 backdrop-blur-md border border-white/10 focus:border-cyan-400 focus:bg-white/5 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all duration-300 text-white appearance-none cursor-pointer font-mono shadow-inner">
                                    {t.contact.form.serviceOptions.map((opt, i) => (
                                        <option key={i} className="bg-[#0d1117] text-white py-2" value={opt}>{opt}</option>
                                    ))}
                                 </select>
                                 <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                               </div>
                            </div>
                          </div>

                          <div className="group">
                             <label className="block text-[10px] md:text-xs font-semibold text-slate-400 md:text-slate-300 mb-1 md:mb-2 uppercase tracking-wider">{t.contact.form.message}</label>
                             <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="Tell us about your project, goals and deadline..."
                                className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm rounded-lg md:rounded-xl bg-[#0d1117]/70 backdrop-blur-md border border-white/10 focus:border-cyan-400 focus:bg-white/5 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all duration-300 text-white placeholder:text-slate-500 shadow-inner resize-none"
                             ></textarea>
                          </div>

                          <button
                             type="submit"
                             disabled={formStatus === 'submitting'}
                             className="w-full py-3 md:py-4 mt-1 md:mt-2 text-sm md:text-base bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg md:rounded-xl font-semibold shadow-md md:shadow-[0_0_30px_rgba(34,211,238,0.4)] md:hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] transition-all duration-300 md:transform md:hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                             {formStatus === 'submitting' ? (
                                <span className="flex items-center gap-2">
                                   <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                                   {t.contact.form.sending}
                                </span>
                             ) : (
                                <>{t.contact.form.btn} <Send className="w-4 h-4" /></>
                             )}
                          </button>
                       </form>
                    )}
                 </div>

                 {/* Direct Contact Side (Charles) */}
                 <div className="bg-gradient-to-br from-cyan-500/15 via-[#0d1117] to-violet-500/10 p-5 md:p-12 md:w-2/5 text-slate-100 flex flex-col items-center justify-center text-center backdrop-blur-xl relative overflow-hidden border-t md:border-t-0 md:border-l border-white/10">
                    <div className="absolute inset-0 grid-dust opacity-30 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                       <h3 className="text-base md:text-xl font-bold text-white mb-4 md:mb-6">{t.contact.direct.title}</h3>

                       <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 p-1 rounded-full border-2 border-lime-400/50 shadow-md md:shadow-[0_0_24px_rgba(163,230,53,0.3)]">
                         <img
                           src={charlesImg}
                           alt="Charles Garbus"
                           className="w-full h-full rounded-full object-cover"
                           loading="lazy"
                         />
                         <div className="absolute bottom-1 right-1 w-6 h-6 bg-lime-400 border-4 border-[#0d1117] rounded-full"></div>
                       </div>

                       <p className="text-white font-bold text-base md:text-lg mb-1">Charles Garbus</p>
                       <p className="text-slate-400 md:text-slate-300 text-xs md:text-sm mb-5 md:mb-8">{t.contact.direct.subtitle}</p>

                       <a href="https://wa.me/33671618119" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          <button className="button2">
                              WhatsApp
                              <svg viewBox="0 0 48 48" y="0px" x="0px" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z" fill="#fff"></path>
                                <path d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z" fill="#fff"></path>
                                <path d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z" fill="#cfd8dc"></path>
                                <path d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z" fill="#40c351"></path>
                                <path clipRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" fillRule="evenodd" fill="#fff"></path>
                              </svg>
                          </button>
                       </a>
                       <div className="mt-3 md:mt-4 text-[10px] md:text-xs font-mono text-slate-500">{t.contact.direct.phone}</div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 pb-[env(safe-area-inset-bottom)]">
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full py-2.5 text-sm bg-cyan-400 text-slate-950 rounded-lg font-semibold shadow-md shadow-cyan-500/25"
          >
            {t.nav.cta}
          </button>
        </div>

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
      <footer className="relative bg-[#0d1117]/90 border-t border-white/5 py-6 md:py-10 backdrop-blur-xl mt-8 md:mt-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Logo variant="wordmark" spaced compact className="justify-center md:justify-start" />
              <p className="text-[11px] md:text-xs text-slate-500 text-center md:text-left font-mono">
                <span className="text-slate-600">© {new Date().getFullYear()}</span>
                <span className="mx-1.5 text-slate-700">·</span>
                <span className="text-lime-300/90">{t.footer.tagline}</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs md:text-sm font-mono text-slate-500 md:text-slate-400 items-center">
               <button onClick={() => openLegal('legal')} className="hover:text-cyan-300 transition-colors">{t.legal.tabs.legal}</button>
               <button onClick={() => openLegal('privacy')} className="hover:text-cyan-300 transition-colors">{t.legal.tabs.privacy}</button>
               <button onClick={() => openLegal('terms')} className="hover:text-cyan-300 transition-colors">{t.legal.tabs.terms}</button>
               <a href="mailto:contact@3geeks.fr" className="hover:text-cyan-300 transition-colors hidden md:inline">contact@3geeks.fr</a>
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
