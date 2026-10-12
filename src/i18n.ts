export type Lang = 'en' | 'fr';

export const translations = {
  en: {
    nav: {
      services: "Offers",
      method: "Process",
      projects: "Work",
      expertise: "Expertise",
      team: "Team",
      reviews: "Reviews",
      cta: "Let's talk",
    },
    hero: {
      badge: "Web & digital studio · Made in France",
      titleStart: "Websites and digital tools",
      titleEnd: "that make people contact you.",
      comment: "Start with a focused €300 website or a custom web project. Small requests delivered in 24 to 48 hours, and nothing to pay until you're happy.",
      ctaPrimary: "Book a free call",
      ctaSecondary: "See our offers",
      scroll: "Scroll",
      trust: [
        { k: "24–48 h", v: "to deliver a small request" },
        { k: "€300", v: "Starter website, one-off" },
        { k: "AWS", v: "certified cloud expertise" },
        { k: "{projects}", v: "projects delivered" },
      ],
    },
    commitments: {
      path: "Our commitments",
      title: "Fast delivery, nothing upfront, and your site stays yours.",
      items: [
        { k: "24–48 h", title: "Express delivery", desc: "Small requests are delivered in 24 to 48 hours. For larger projects, the schedule is set on the first call." },
        { k: "€0", title: "Nothing to pay upfront", desc: "You pay on delivery, once you're happy with the result. No deposit." },
        { k: "100%", title: "Your site belongs to you", desc: "The source code and the domain name are in your name. You stay free, with no lock-in." },
        { k: "Free", title: "Free quote, no commitment", desc: "We talk it through on a 30-minute call, no pressure, then send you a clear quote." },
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
      subtitle: "A displayed price when possible, otherwise a free quote after a 30-minute call.",
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
    reviews: {
      path: "Client feedback",
      title: "What clients say after delivery.",
      r1: "Fast, structured and very clear communication. The final platform made our client process much smoother.",
      r2: "The team translated our constraints into concrete decisions. We saw better traction within weeks.",
      r3: "Our booking operations became far more reliable and easier to manage day to day."
    },
    team: {
      path: "Founding team",
      title: "Co-founded by Elias & Noam.",
      subtitle: "3geeks is co-founded by Elias and Noam. Alongside them, a growing network of business introducers brings new opportunities.",
      labels: {
        expertise: "3geeks expertise",
        background: "Background",
        certifications: "Licenses & certifications",
        issued: "Issued",
        expires: "Expires",
        expired: "Expired",
        credentialId: "Credential ID:",
        skills: "Skills:",
        viewCredential: "View credential",
      },
      founders: {
        elias: {
          role: "Co-founder · Design & experience",
          desc: "Elias shapes the visual experience: clear pages, smooth interactions and a polished feeling that helps visitors understand the offer.",
          expertise: ["UI/UX & front-end", "React · Vite · Node.js", "Tailwind CSS", "Python · SQL & NoSQL", "Generative AI & prompt engineering"],
          background: [
            { title: "Data & AI Developer · apprenticeship", org: "ClevAI", period: "2026 – now" },
            { title: "Apprentice", org: "Nokia", period: "2025 – 2026" },
            { title: "Master's in Data & Artificial Intelligence", org: "ECE Paris", period: "2026 – 2028" },
            { title: "Bachelor's in Computer Science", org: "ECE Paris", period: "2023 – 2026" },
          ],
          certifications: [
            { title: "IA & GenAI - Prompt Engineering Niveau 1 certification (FR)", issuer: "Liora", date: "Apr 2026", link: "https://files.datascientest.com/certification/47ea77a3-3b36-40c4-be71-829d9f2d5c87.pdf" },
            { title: "AWS Academy Graduate - Machine Learning Foundations - Training Badge", issuer: "Amazon Web Services (AWS)", date: "Mar 2026", credentialId: "1be23fb4-8b0e-4923-8192-346026ef3683" },
            { title: "AWS Academy Graduate - Cloud Architecting - Training Badge", issuer: "Amazon Web Services (AWS)", date: "Mar 2026", skill: "AWS CloudFormation", link: "https://www.credly.com/go/ffYE77aJ" },
            { title: "Examen Final - Programming for DS - Techaway niv2 (FR)", issuer: "Liora", link: "https://files.datascientest.com/certification/20e5da1e-97e2-44ce-bc0b-ad60bb603e7a.pdf" },
            { title: "IA & GenAI - Prompt Engineering", issuer: "DataScientest.com", date: "Dec 2025", skill: "Applied AI & Prompt Engineering", link: "https://files.datascientest.com/certification/47ea77a3-3b36-40c4-be71-829d9f2d5c87.pdf" },
            { title: "Final Exam - Python pour les Data Scientists - Techaway niv1", issuer: "DataScientest.com", date: "Nov 2024", expired: true, skill: "Python (programming language)", link: "https://files.datascientest.com/certification/456ec476-8bab-43f9-9b11-849e31d4cc92.pdf" },
          ],
        },
        noam: {
          role: "Co-founder · Systems & data",
          desc: "Noam builds the reliable logic behind the product: forms, dashboards, automations and clean data flows.",
          expertise: ["Generative AI", "AWS cloud & infrastructure", "Machine learning", "Python & data", "Automations & dashboards"],
          background: [
            { title: "Generative AI Engineer · apprenticeship", org: "Thales", period: "2025 – now" },
            { title: "Cloud Infrastructure Intern", org: "SOWARP", period: "2024" },
            { title: "Engineering degree, Big Data & Machine Learning", org: "EFREI Paris", period: "2026 – 2029" },
            { title: "Bachelor's in Computer Science", org: "ECE Paris", period: "2023 – 2026" },
          ],
          certifications: [
            { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services (AWS)", date: "Oct 2025", expires: "Oct 2028", skill: "AWS CloudFormation, Amazon Web Services", link: "https://www.credly.com/badges/4b3cbf5d-c390-4c85-9088-fe55a7cf31a1" },
            { title: "AWS Academy Graduate - Machine Learning Foundations - Training Badge", issuer: "Amazon Web Services (AWS)", date: "Mar 2026", skill: "Supervised learning, AWS Machine Learning", link: "https://www.credly.com/badges/e5a0aaa5-44e6-4e0e-ac8e-08176d234b53" },
            { title: "AWS Academy Graduate - AWS Academy Cloud Foundations", issuer: "Amazon Web Services (AWS)", date: "Dec 2024", skill: "AWS CloudFormation", link: "https://www.credly.com/badges/fa42ebd1-ab76-436e-80b2-505e115a6918" },
            { title: "Final Exam - Python pour les Data Scientists - Techaway niv1", issuer: "DataScientest.com", link: "https://files.datascientest.com/certification/3c76d004-b05c-42de-bdf9-d963142fbb27.pdf" },
          ],
        },
      },
      introducersTitle: "Business introducers",
      introducersSubtitle: "Charles and Niels are part of our growing introducer network. We aim to welcome more partners over time.",
      introducerRole: "Business introducer",
      introducers: {
        charles: "Charles spots companies and project owners who need a website or digital tool, and introduces them to 3geeks.",
        niels: "Niels finds new opportunities among businesses looking for a digital project, and points them towards 3geeks.",
      },
    },
    contact: {
      path: "Contact",
      title: "Let's talk about your project.",
      subtitle: "Tell us what you want to sell, show or automate. We reply within 24h with the simplest next step.",
      email: "Reply within 24h",
      book: "Book a free call",
      bookDesc: "30 minutes by phone, no commitment. Free quote.",
      linkedin: "Or reach a co-founder directly on LinkedIn",
    },
    footer: {
      eof: "End",
      rights: "All rights reserved.",
      tagline: "Made in France",
      links: ["Legal", "Privacy", "Terms"],
      blurb: "Websites and digital tools that make people want to contact you."
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
            title: "1. Website editor",
            text: "This website is published by 3geeks, a web studio co-founded by Elias Elloumi and Noam Leclapart-Jublot.\nPublication directors: Elias Elloumi and Noam Leclapart-Jublot.\nContact: contact@3geeks.fr"
          },
          {
            title: "2. Hosting",
            text: "The website runs on servers operated by 3geeks and is delivered through the Cloudflare network (Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA)."
          },
          {
            title: "3. Intellectual property",
            text: "The content of this site (texts, visuals, logo, brand video) belongs to 3geeks. Client logos and screenshots of client projects belong to their respective owners and are shown as references."
          }
        ],
        privacy: [
          {
            title: "1. What we receive",
            text: "This site has no contact form and does not track you. We only receive what you choose to send us: an email to contact@3geeks.fr, a LinkedIn message, a call booked through Calendly (name, email, phone number and the details you share), or the questions you ask the site assistant."
          },
          {
            title: "2. How we use it",
            text: "Only to answer you, prepare your quote and follow up on our work together. Your data is never sold or passed on to third parties."
          },
          {
            title: "3. Services we rely on",
            text: "Calls are booked through Calendly, which processes booking data under its own privacy policy. The site assistant is an AI run on 3geeks’ own servers: your messages are sent to it only to generate the answer, and their content is not stored. Please don’t share sensitive information with it."
          },
          {
            title: "4. Your rights",
            text: "Under the GDPR, you can access, correct or delete your data by writing to contact@3geeks.fr. You can also file a complaint with the CNIL (cnil.fr)."
          },
          {
            title: "5. Cookies",
            text: "This site sets no advertising or tracking cookies. Your language choice is stored in your browser only. If you open the booking window, Calendly may set its own cookies."
          }
        ],
        terms: [
          {
            title: "1. Purpose",
            text: "These conditions govern the web development services provided by 3geeks."
          },
          {
            title: "2. Quote",
            text: "Every project starts with a free call and a free, no-commitment quote."
          },
          {
            title: "3. Price",
            text: "Prices are in euros. The price billed is the one set in the accepted quote."
          },
          {
            title: "4. Payment",
            text: "Nothing is paid upfront: payment is due on delivery, once the client has approved the result."
          },
          {
            title: "5. Delivery",
            text: "Small requests are usually delivered within 24 to 48 hours. For larger projects, the schedule is agreed in the quote and may depend on the client's responsiveness."
          },
          {
            title: "6. Ownership",
            text: "Once paid, the source code and the domain name belong to the client."
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
      team: "Équipe",
      reviews: "Avis",
      cta: "Parler de mon projet",
    },
    hero: {
      badge: "Studio web & digital · Made in France",
      titleStart: "Des sites et outils web",
      titleEnd: "qui donnent envie de vous contacter.",
      comment: "Démarrez avec un site ciblé à 300€ ou un projet web sur mesure. Petites demandes livrées en 24 à 48 h, et rien à payer avant d’être satisfait.",
      ctaPrimary: "Réserver un appel gratuit",
      ctaSecondary: "Découvrir nos offres",
      scroll: "Défiler",
      trust: [
        { k: "24–48 h", v: "pour livrer une petite demande" },
        { k: "300€", v: "site Starter, paiement unique" },
        { k: "AWS", v: "expertise cloud certifiée" },
        { k: "{projects}", v: "projets livrés" },
      ],
    },
    commitments: {
      path: "Nos engagements",
      title: "Livraison rapide, zéro avance, et votre site reste à vous.",
      items: [
        { k: "24–48 h", title: "Livraison express", desc: "Les petites demandes sont livrées en 24 à 48 h. Pour un projet plus large, le planning est fixé dès le premier appel." },
        { k: "0 €", title: "Rien à payer d’avance", desc: "Vous réglez à la livraison, une fois satisfait du résultat. Pas d’acompte." },
        { k: "100 %", title: "Votre site vous appartient", desc: "Le code source et le nom de domaine sont à votre nom. Vous restez libre, sans engagement." },
        { k: "Gratuit", title: "Devis offert, sans engagement", desc: "On en parle lors d’un appel de 30 min, sans pression, puis on vous envoie un devis clair." },
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
      subtitle: "Un prix affiché quand c’est possible, sinon un devis gratuit après un appel de 30 min.",
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
    reviews: {
      path: "Retours clients",
      title: "Ce que nos clients disent après livraison.",
      r1: "Équipe réactive, process très clair et exécution propre. Le nouveau site a fluidifié notre acquisition.",
      r2: "Ils ont compris notre métier rapidement et proposé des choix utiles. On a vu une vraie progression.",
      r3: "Le système mis en place est robuste et simple à opérer. Notre quotidien est plus serein."
    },
    team: {
      path: "Équipe fondatrice",
      title: "3geeks, cofondée par Elias et Noam.",
      subtitle: "3geeks est cofondée par Elias et Noam. À leurs côtés, un réseau grandissant d’apporteurs d’affaires fait émerger de nouvelles opportunités.",
      labels: {
        expertise: "Expertise 3geeks",
        background: "Parcours",
        certifications: "Licences et certifications",
        issued: "Émise le",
        expires: "Expire le",
        expired: "Expirée le",
        credentialId: "Identifiant du diplôme :",
        skills: "Compétences :",
        viewCredential: "Afficher le diplôme",
      },
      founders: {
        elias: {
          role: "Cofondateur · Design & expérience",
          desc: "Elias façonne l'expérience visuelle : pages claires, interactions fluides et rendu soigné qui aide à comprendre l'offre.",
          expertise: ["UI/UX & front-end", "React · Vite · Node.js", "Tailwind CSS", "Python · SQL & NoSQL", "IA générative & prompt engineering"],
          background: [
            { title: "Développeur Data & IA · alternance", org: "ClevAI", period: "2026 – auj." },
            { title: "Alternant", org: "Nokia", period: "2025 – 2026" },
            { title: "Master Data & Intelligence Artificielle", org: "ECE Paris", period: "2026 – 2028" },
            { title: "Bachelor Informatique", org: "ECE Paris", period: "2023 – 2026" },
          ],
          certifications: [
            { title: "IA & GenAI - Prompt Engineering Niveau 1 certification (FR)", issuer: "Liora", date: "avr. 2026", link: "https://files.datascientest.com/certification/47ea77a3-3b36-40c4-be71-829d9f2d5c87.pdf" },
            { title: "AWS Academy Graduate - Machine Learning Foundations - Training Badge", issuer: "Amazon Web Services (AWS)", date: "mars 2026", credentialId: "1be23fb4-8b0e-4923-8192-346026ef3683" },
            { title: "AWS Academy Graduate - Cloud Architecting - Training Badge", issuer: "Amazon Web Services (AWS)", date: "mars 2026", skill: "AWS CloudFormation", link: "https://www.credly.com/go/ffYE77aJ" },
            { title: "Examen Final - Programming for DS - Techaway niv2 (FR)", issuer: "Liora", link: "https://files.datascientest.com/certification/20e5da1e-97e2-44ce-bc0b-ad60bb603e7a.pdf" },
            { title: "IA & GenAI - Prompt Engineering", issuer: "DataScientest.com", date: "déc. 2025", skill: "Applied AI & Prompt Engineering", link: "https://files.datascientest.com/certification/47ea77a3-3b36-40c4-be71-829d9f2d5c87.pdf" },
            { title: "Final Exam - Python pour les Data Scientists - Techaway niv1", issuer: "DataScientest.com", date: "nov. 2024", expired: true, skill: "Python (langage de programmation)", link: "https://files.datascientest.com/certification/456ec476-8bab-43f9-9b11-849e31d4cc92.pdf" },
          ],
        },
        noam: {
          role: "Cofondateur · Systèmes & data",
          desc: "Noam construit la logique fiable derrière le produit : formulaires, dashboards, automatisations et flux de données propres.",
          expertise: ["IA générative", "Cloud AWS & infrastructure", "Machine learning", "Python & data", "Automatisations & dashboards"],
          background: [
            { title: "Ingénieur en IA générative · alternance", org: "Thales", period: "2025 – auj." },
            { title: "Stagiaire Infrastructure Cloud", org: "SOWARP", period: "2024" },
            { title: "Diplôme d’ingénieur Big Data & Machine Learning", org: "EFREI Paris", period: "2026 – 2029" },
            { title: "Bachelor Informatique", org: "ECE Paris", period: "2023 – 2026" },
          ],
          certifications: [
            { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services (AWS)", date: "oct. 2025", expires: "oct. 2028", skill: "AWS CloudFormation, Amazon Web Services", link: "https://www.credly.com/badges/4b3cbf5d-c390-4c85-9088-fe55a7cf31a1" },
            { title: "AWS Academy Graduate - Machine Learning Foundations - Training Badge", issuer: "Amazon Web Services (AWS)", date: "mars 2026", skill: "Apprentissage supervisé, AWS Machine Learning", link: "https://www.credly.com/badges/e5a0aaa5-44e6-4e0e-ac8e-08176d234b53" },
            { title: "AWS Academy Graduate - AWS Academy Cloud Foundations", issuer: "Amazon Web Services (AWS)", date: "déc. 2024", skill: "AWS CloudFormation", link: "https://www.credly.com/badges/fa42ebd1-ab76-436e-80b2-505e115a6918" },
            { title: "Final Exam - Python pour les Data Scientists - Techaway niv1", issuer: "DataScientest.com", link: "https://files.datascientest.com/certification/3c76d004-b05c-42de-bdf9-d963142fbb27.pdf" },
          ],
        },
      },
      introducersTitle: "Apporteurs d’affaires",
      introducersSubtitle: "Charles et Niels font partie de notre réseau, que nous souhaitons développer avec de nouveaux apporteurs d’affaires.",
      introducerRole: "Apporteur d’affaires",
      introducers: {
        charles: "Charles repère des entreprises et porteurs de projet qui ont besoin d’un site ou d’un outil digital, et les met en relation avec 3geeks.",
        niels: "Niels identifie de nouvelles opportunités auprès d’entreprises en quête d’un projet digital, et les oriente vers 3geeks.",
      },
    },
    contact: {
      path: "Contact",
      title: "Parlons de votre projet.",
      subtitle: "Expliquez-nous ce que vous voulez vendre, présenter ou automatiser. On répond sous 24h avec la prochaine étape la plus simple.",
      email: "Réponse sous 24h",
      book: "Réserver un appel gratuit",
      bookDesc: "30 min au téléphone, sans engagement. Devis offert.",
      linkedin: "Ou écrivez directement à un cofondateur sur LinkedIn",
    },
    footer: {
      eof: "Fin",
      rights: "Tous droits réservés.",
      tagline: "Made in France",
      links: ["Mentions Légales", "Confidentialité", "CGV"],
      blurb: "Des sites et outils web qui donnent envie de vous contacter."
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
            text: "Ce site est édité par 3geeks, studio web cofondé par Elias Elloumi et Noam Leclapart-Jublot.\nDirecteurs de la publication : Elias Elloumi et Noam Leclapart-Jublot.\nContact : contact@3geeks.fr"
          },
          {
            title: "2. Hébergement",
            text: "Le site est hébergé sur des serveurs exploités par 3geeks et distribué via le réseau Cloudflare (Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis)."
          },
          {
            title: "3. Propriété intellectuelle",
            text: "Les contenus de ce site (textes, visuels, logo, vidéo de marque) appartiennent à 3geeks. Les logos et captures des projets clients restent la propriété de leurs titulaires et sont présentés à titre de références."
          }
        ],
        privacy: [
          {
            title: "1. Ce que nous recevons",
            text: "Ce site n’a pas de formulaire et ne vous suit pas. Nous recevons uniquement ce que vous choisissez de nous envoyer : un e-mail à contact@3geeks.fr, un message LinkedIn, un appel réservé via Calendly (nom, e-mail, numéro de téléphone et les informations que vous partagez) ou les questions posées à l’assistant du site."
          },
          {
            title: "2. Utilisation",
            text: "Uniquement pour vous répondre, préparer votre devis et assurer le suivi de notre collaboration. Vos données ne sont jamais vendues ni transmises à des tiers."
          },
          {
            title: "3. Services utilisés",
            text: "Les appels sont réservés via Calendly, qui traite les données de réservation selon sa propre politique de confidentialité. L’assistant du site est une IA exécutée sur les serveurs de 3geeks : vos messages lui sont transmis uniquement pour générer la réponse, et leur contenu n’est pas conservé. Merci de ne pas y partager d’informations sensibles."
          },
          {
            title: "4. Vos droits",
            text: "Conformément au RGPD, vous pouvez accéder à vos données, les rectifier ou les supprimer en écrivant à contact@3geeks.fr. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr)."
          },
          {
            title: "5. Cookies",
            text: "Ce site ne dépose aucun cookie publicitaire ni de suivi. Votre choix de langue est seulement mémorisé dans votre navigateur. Si vous ouvrez la fenêtre de réservation, Calendly peut déposer ses propres cookies."
          }
        ],
        terms: [
          {
            title: "1. Objet",
            text: "Les présentes conditions régissent les prestations de développement web réalisées par 3geeks."
          },
          {
            title: "2. Devis",
            text: "Chaque projet commence par un appel et un devis gratuits, sans engagement."
          },
          {
            title: "3. Prix",
            text: "Les prix sont indiqués en euros. Le prix facturé est celui fixé dans le devis accepté."
          },
          {
            title: "4. Paiement",
            text: "Rien n’est payé d’avance : le règlement intervient à la livraison, une fois le résultat validé par le client."
          },
          {
            title: "5. Livraison",
            text: "Les petites demandes sont généralement livrées en 24 à 48 h. Pour les projets plus larges, le planning est fixé dans le devis et peut dépendre de la réactivité du client."
          },
          {
            title: "6. Propriété",
            text: "Une fois la prestation réglée, le code source et le nom de domaine appartiennent au client."
          }
        ]
      },
      close: "Fermer"
    }
  }
};
