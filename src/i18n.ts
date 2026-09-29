export type Lang = 'en' | 'fr';

export const translations = {
  en: {
    nav: {
      services: "Offers",
      method: "Process",
      projects: "Work",
      expertise: "Expertise",
      reviews: "Reviews",
      cta: "Let's talk",
    },
    hero: {
      badge: "Web & digital studio · Made in France",
      titleStart: "Websites and digital tools",
      titleEnd: "that make people contact you.",
      comment: "Start with a focused €300 website or a custom web project. We help you choose the simplest format for your goal.",
      ctaPrimary: "Talk about my project",
      ctaSecondary: "See our offers",
      scroll: "Scroll",
      trust: [
        { k: "24h", v: "response time" },
        { k: "€300", v: "Starter website, one-off" },
        { k: "AWS", v: "certified cloud expertise" },
        { k: "100%", v: "Made in France" },
      ],
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
    whyUs: {
      path: "Why clients choose us",
      title: "A small team that turns ideas into useful products.",
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
        desc: "One direct point of contact who translates business needs into concrete decisions and keeps every step understandable."
      },
    },
    stack: {
      path: "Process",
      title: "From first call to launch, you always know what happens next.",
      subtitle: "Understand the need, design the experience, build the product, then improve it with real feedback.",
      steps: [
        { t: "Clear discovery", d: "We clarify your goal, your audience and the simplest format that works." },
        { t: "Readable design", d: "A clear layout of the experience, designed to convert from the first screen." },
        { t: "Reliable build", d: "Forms, automations and integrations built cleanly to last after launch." },
        { t: "Launch", d: "A careful go-live plan, without an abrupt cut-over on your existing site." },
        { t: "Continuous improvement", d: "We keep improving the product based on real feedback." },
      ],
    },
    services: {
      path: "Service plans",
      badge: "SOLUTIONS",
      title: "Three clear ways to start your project.",
      subtitle: "A displayed price when possible, a fast quote otherwise.",
      maintenanceTitle: "Peace-of-mind option",
      maintenanceDesc: "Keep your site monitored, secure and lightly updated after launch.",
      maintenancePrice: "€50/mo",
      maintenanceCta: "+ add option",
      maintenanceHighlight: "Recommended",
      maintenanceBenefits: [
        "Uptime monitoring",
        "Security updates",
        "Small content edits each month",
      ],
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
      title: "Confirm your request",
      stepOf: "Step {step} of 2",
      selectedOffer: "Selected offer",
      quote: "Custom quote",
      estimatedTotal: "Estimated total",
      continue: "Continue",
      back: "Back",
      confirm: "Confirm",
      processing: "Sending...",
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
    reviews: {
      path: "Client feedback",
      title: "What clients say after delivery.",
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
      successTip: "Need it urgent? Message us directly on WhatsApp.",
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
        title: "Prefer a direct chat?",
        subtitle: "Skip the form and write to us on WhatsApp.",
        phone: "+33 6 71 61 81 19"
      }
    },
    footer: {
      eof: "End",
      rights: "All rights reserved.",
      tagline: "Made in France",
      links: ["Legal", "Privacy", "Terms"],
      blurb: "Websites and digital tools that make people want to contact you."
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
      services: "Offres",
      method: "Méthode",
      projects: "Réalisations",
      expertise: "Expertise",
      reviews: "Avis",
      cta: "Parler de mon projet",
    },
    hero: {
      badge: "Studio web & digital · Made in France",
      titleStart: "Des sites et outils web",
      titleEnd: "qui donnent envie de vous contacter.",
      comment: "Démarrez avec un site ciblé à 300€ ou un projet web sur mesure. On vous aide à choisir le format le plus simple pour votre objectif.",
      ctaPrimary: "Parler de mon projet",
      ctaSecondary: "Découvrir nos offres",
      scroll: "Défiler",
      trust: [
        { k: "24h", v: "de délai de réponse" },
        { k: "300€", v: "site Starter, paiement unique" },
        { k: "AWS", v: "expertise cloud certifiée" },
        { k: "100%", v: "Made in France" },
      ],
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
    whyUs: {
      path: "Pourquoi travailler avec nous",
      title: "Une petite équipe qui transforme vos idées en produits utiles.",
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
        desc: "Un interlocuteur direct qui traduit vos besoins terrain en décisions concrètes et vous évite le jargon inutile."
      }
    },
    stack: {
      path: "Méthode",
      title: "Du premier appel à la mise en ligne, vous savez toujours où on va.",
      subtitle: "Comprendre le besoin, designer l'expérience, construire le produit, puis l'améliorer avec les retours réels.",
      steps: [
        { t: "Cadrage clair", d: "On clarifie votre objectif, votre cible et le format le plus simple qui fonctionne." },
        { t: "Maquette lisible", d: "Une expérience claire, pensée pour convertir dès le premier écran." },
        { t: "Développement fiable", d: "Formulaires, automatisations et intégrations construits proprement pour durer." },
        { t: "Mise en ligne", d: "Un plan de lancement soigné, sans coupure brutale de votre site existant." },
        { t: "Optimisation continue", d: "On continue d'améliorer le produit à partir des retours réels." },
      ],
    },
    services: {
      path: "Nos offres",
      badge: "SOLUTIONS",
      title: "Trois façons claires de démarrer votre projet.",
      subtitle: "Un prix affiché quand c'est possible, un devis rapide sinon.",
      maintenanceTitle: "Option Sérénité",
      maintenanceDesc: "Gardez votre site surveillé, sécurisé et légèrement mis à jour après la mise en ligne.",
      maintenancePrice: "50€/mois",
      maintenanceCta: "+ ajouter l'option",
      maintenanceHighlight: "Recommandé",
      maintenanceBenefits: [
        "Monitoring de disponibilité",
        "Mises à jour de sécurité",
        "Petits edits de contenu chaque mois",
      ],
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
      title: "Confirmer votre demande",
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
    reviews: {
      path: "Retours clients",
      title: "Ce que nos clients disent après livraison.",
      r1: "Équipe réactive, process très clair et exécution propre. Le nouveau site a fluidifié notre acquisition.",
      r2: "Ils ont compris notre métier rapidement et proposé des choix utiles. On a vu une vraie progression.",
      r3: "Le système mis en place est robuste et simple à opérer. Notre quotidien est plus serein."
    },
    contact: {
      path: "Discutons de votre projet",
      title: "Vous hésitez entre site starter et projet sur mesure ?",
      subtitle: "Expliquez ce que vous voulez vendre, présenter ou automatiser. On répond sous 24h avec la prochaine étape la plus simple.",
      successTitle: "Bien reçu.",
      successDesc: "L'équipe 3geeks vous recontacte très vite.",
      successTip: "Urgent ? Écrivez-nous directement sur WhatsApp.",
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
        title: "Vous préférez discuter ?",
        subtitle: "Pas de formulaire : écrivez-nous sur WhatsApp.",
        phone: "+33 6 71 61 81 19"
      }
    },
    footer: {
      eof: "Fin",
      rights: "Tous droits réservés.",
      tagline: "Made in France",
      links: ["Mentions Légales", "Confidentialité", "CGV"],
      blurb: "Des sites et outils web qui donnent envie de vous contacter."
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
