export type Lang = 'en' | 'fr';

export const translations = {
  en: {
    meta: {
      title: "3geeks — Websites and digital tools | Made in France",
      description: "3geeks, a French web studio. Clear, fast and polished websites, apps and digital tools to present your business and bring in leads. Starter website from €300, reply within 24h.",
    },
    nav: {
      services: "Offers",
      method: "Process",
      projects: "Work",
      expertise: "Expertise",
      team: "Team",
      reviews: "Reviews",
      ai: "AI for businesses",
      cta: "Let's talk",
    },
    hero: {
      badge: "Web & digital studio · Made in France",
      titleStart: "Websites and digital tools",
      titleEnd: "that make people want to contact you.",
      comment: "Start with a focused €300 website or a custom web project. Small requests delivered in 24 to 48 hours, and nothing to pay until you're happy.",
      ctaPrimary: "Book a free call",
      ctaSecondary: "See what we do",
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
      mock: {
        url: "your-business.com",
        draft: "Draft",
        live: "Live",
        briefTitle: "Project brief",
        brief: ["Goal: more quote requests", "Audience: local businesses", "Format: one clear page"],
        form: "Form connected",
        toast: "New quote request",
        toastSub: "just now · from the website",
        improve: "Real feedback → improvements",
      },
    },
    aiTeaser: {
      path: "AI & automation",
      title: "A specific AI need?",
      subtitle: "Invoices, stock, customer service, reporting: we plug AI into the tools you already use, so repetitive tasks get done on their own.",
      chipsLabel: "Pick your area",
      chips: ["Accounting", "Logistics", "Customer service", "Sales", "HR", "Management"],
      cta: "Explore our AI solutions",
    },
    site: {
      nav: { home: "Home", offers: "Offers", work: "Work", ai: "AI for businesses", team: "Team", cta: "Book a call", method: "Process" },
      pages: {
        offers: {
          title: "Offers & pricing — 3geeks",
          description: "Starter website from €300, custom web projects, complete redesigns and the Peace-of-mind option. Free quote after a 30-minute call, nothing to pay upfront.",
          path: "Offers",
          h1: "Clear offers, a price as soon as possible.",
          sub: "Pick the format that fits your project. If you're not sure, a free 30-minute call is enough to decide.",
        },
        work: {
          title: "Our work — 3geeks",
          description: "Websites, SaaS platforms, iOS apps, e-commerce and AI: projects designed, built and launched by 3geeks, with a before/after and client reviews.",
          path: "Work",
          h1: "What we've already built.",
          sub: "Healthcare, legal, finance, e-commerce, mobile apps and private platforms: projects designed, built and launched by 3geeks.",
        },
        game: {
          title: "17 OCTOBRE — the 3geeks lab video game",
          description: "17 OCTOBRE, the 3geeks lab video game: a satirical, cartoon real-time strategy game. Lead the Yellow Vest marches through Paris, or switch to the riot police. Trailer, screenshots and private beta for Windows.",
          path: "Video game",
          h1: "17 OCTOBRE",
          sub: "A satirical, cartoon real-time strategy game.",
        },
        team: {
          title: "Team — 3geeks",
          description: "3geeks is co-founded by Elias Elloumi and Noam Leclapart-Jublot: background, certifications, expertise and business introducers.",
          path: "Team",
          h1: "Co-founded by Elias & Noam.",
          sub: "3geeks is co-founded by Elias and Noam. Alongside them, a growing network of business introducers brings new opportunities.",
        },
      },
      whatWeDo: {
        path: "What we do",
        title: "Three things, done well.",
        items: [
          { title: "Websites", desc: "Showcase site, redesign or online shop, designed to bring in contacts.", meta: "From €300", cta: "See the offers" },
          { title: "Apps & platforms", desc: "Web platforms, customer areas, iOS apps, dashboards and integrations with your tools.", meta: "Custom quote", cta: "See the offers" },
          { title: "AI & automation", desc: "AI plugged into the tools you already use: invoices, stock, customer service, reporting.", meta: "Free audit", cta: "Discover" },
        ],
      },
      howItWorks: {
        path: "How it works",
        title: "Simple, fast, risk-free.",
        steps: [
          { t: "A free 30-minute call", d: "You explain your need, we send you a clear, free quote." },
          { t: "We build, fast", d: "Small requests delivered in 24 to 48 h. For larger projects, the schedule is set from the start." },
          { t: "You pay once you're happy", d: "Nothing upfront. The source code and the domain name are in your name." },
        ],
        more: "See our process",
      },
      featured: {
        path: "Selected work",
        title: "A few projects already live.",
        more: "See all our work",
        items: {
          jellouli: "Bilingual medical website, rebuilt in 24 h.",
          "express-divorce": "Legal SaaS platform, live in the United States.",
          "two-app": "The iOS app for couples, rated 5.0 on the App Store.",
        },
      },
      footer: { pages: "The studio" },
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
      r1: "A responsive team, a very clear process and clean execution. The new website made our customer acquisition much smoother.",
      r2: "They understood our business quickly and suggested useful choices. We saw real progress.",
      r3: "The system they set up is robust and simple to run. Our day-to-day is much calmer."
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
        showMore: "Show {n} more",
        showMoreOne: "Show 1 more",
        showLess: "Show less",
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
            text: "Calls are booked through Calendly, which processes booking data under its own privacy policy. The site assistant uses an AI model from Mistral AI, a French company, with 3geeks’ own servers as a fallback: your messages are sent to them only to generate the answer, and 3geeks does not store their content. Please don’t share sensitive information with it."
          },
          {
            title: "4. Your rights",
            text: "Under the GDPR, you can access, correct or delete your data by writing to contact@3geeks.fr. You can also file a complaint with the CNIL (cnil.fr)."
          },
          {
            title: "5. Cookies",
            text: "This site sets no advertising or tracking cookies. Your language choice is stored in your browser only. The booking calendar is provided by Calendly: it starts loading when you point at a booking button or when the assistant offers a call, and Calendly may then set its own technical cookies."
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
    meta: {
      title: "3geeks — Création de sites web et outils digitaux | Made in France",
      description: "3geeks — studio web français. Sites, applications et outils digitaux clairs, rapides et soignés pour présenter votre activité et générer des contacts. Site Starter dès 300 €, réponse sous 24h.",
    },
    nav: {
      services: "Offres",
      method: "Méthode",
      projects: "Réalisations",
      expertise: "Expertise",
      team: "Équipe",
      reviews: "Avis",
      ai: "IA pour entreprises",
      cta: "Parler de mon projet",
    },
    hero: {
      badge: "Studio web & digital · Made in France",
      titleStart: "Des sites et outils web",
      titleEnd: "qui donnent envie de vous contacter.",
      comment: "Démarrez avec un site ciblé à 300 € ou un projet web sur mesure. Petites demandes livrées en 24 à 48 h, et rien à payer avant d’être satisfait.",
      ctaPrimary: "Réserver un appel gratuit",
      ctaSecondary: "Voir ce qu’on fait",
      scroll: "Défiler",
      trust: [
        { k: "24–48 h", v: "pour livrer une petite demande" },
        { k: "300 €", v: "site Starter, paiement unique" },
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
        tag: "Automatisation téléphonique pour la restauration",
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
      mock: {
        url: "votre-entreprise.fr",
        draft: "Brouillon",
        live: "En ligne",
        briefTitle: "Cadrage du projet",
        brief: ["Objectif : plus de demandes de devis", "Cible : entreprises locales", "Format : une page claire"],
        form: "Formulaire connecté",
        toast: "Nouvelle demande de devis",
        toastSub: "à l’instant · depuis le site",
        improve: "Retours réels → améliorations",
      },
    },
    aiTeaser: {
      path: "IA & automatisation",
      title: "Un besoin précis en IA ?",
      subtitle: "Factures, stocks, service client, reporting : on branche l’IA sur les outils que vous utilisez déjà, pour que les tâches répétitives se fassent toutes seules.",
      chipsLabel: "Choisissez votre domaine",
      chips: ["Compta", "Logistique", "Service client", "Commercial", "RH", "Direction"],
      cta: "Découvrir nos solutions IA",
    },
    site: {
      nav: { home: "Accueil", offers: "Offres", work: "Réalisations", ai: "IA pour entreprises", team: "Équipe", cta: "Réserver un appel", method: "Méthode" },
      pages: {
        offers: {
          title: "Offres et tarifs — 3geeks",
          description: "Site Starter dès 300 €, projets web sur mesure, refonte complète et Option Sérénité. Devis gratuit après un appel de 30 min, rien à payer d’avance.",
          path: "Offres",
          h1: "Des offres claires, un prix dès que possible.",
          sub: "Choisissez le format qui correspond à votre projet. Si vous hésitez, un appel gratuit de 30 min suffit pour décider.",
        },
        work: {
          title: "Réalisations — 3geeks",
          description: "Sites, plateformes SaaS, apps iOS, e-commerce et IA : des projets conçus, développés et lancés par 3geeks, avec un avant/après et les avis clients.",
          path: "Réalisations",
          h1: "Ce qu’on a déjà construit.",
          sub: "Santé, juridique, finance, e-commerce, applications mobiles et plateformes privées : des projets conçus, développés et lancés par 3geeks.",
        },
        game: {
          title: "17 OCTOBRE — le jeu vidéo du lab 3geeks",
          description: "17 OCTOBRE, le jeu vidéo du lab 3geeks : stratégie en temps réel satirique et cartoon. Mène les cortèges de Gilets Jaunes dans Paris, ou passe côté CRS. Bande-annonce, captures et bêta privée pour Windows.",
          path: "Jeu vidéo",
          h1: "17 OCTOBRE",
          sub: "Un jeu de stratégie en temps réel, satirique et cartoon.",
        },
        team: {
          title: "Équipe — 3geeks",
          description: "3geeks est cofondée par Elias Elloumi et Noam Leclapart-Jublot : parcours, certifications, expertises et apporteurs d’affaires.",
          path: "Équipe",
          h1: "3geeks, cofondée par Elias et Noam.",
          sub: "3geeks est cofondée par Elias et Noam. À leurs côtés, un réseau grandissant d’apporteurs d’affaires fait émerger de nouvelles opportunités.",
        },
      },
      whatWeDo: {
        path: "Ce qu’on fait",
        title: "Trois métiers, bien faits.",
        items: [
          { title: "Sites web", desc: "Site vitrine, refonte ou boutique en ligne, pensés pour vous apporter des contacts.", meta: "Dès 300 €", cta: "Voir les offres" },
          { title: "Applications & plateformes", desc: "Plateformes web, espaces clients, apps iOS, tableaux de bord et intégrations à vos outils.", meta: "Sur devis", cta: "Voir les offres" },
          { title: "IA & automatisation", desc: "L’IA branchée sur les outils que vous utilisez déjà : factures, stocks, service client, reporting.", meta: "Audit gratuit", cta: "Découvrir" },
        ],
      },
      howItWorks: {
        path: "Comment ça marche",
        title: "Simple, rapide, sans risque.",
        steps: [
          { t: "Un appel gratuit de 30 min", d: "Vous nous expliquez votre besoin, on vous envoie un devis clair et gratuit." },
          { t: "On construit, vite", d: "Petites demandes livrées en 24 à 48 h. Pour un projet plus large, le planning est fixé dès le départ." },
          { t: "Vous payez une fois satisfait", d: "Rien d’avance. Le code source et le nom de domaine sont à votre nom." },
        ],
        more: "Voir notre méthode",
      },
      featured: {
        path: "Réalisations",
        title: "Quelques projets déjà en ligne.",
        more: "Voir toutes nos réalisations",
        items: {
          jellouli: "Site médical bilingue, refait en 24 h.",
          "express-divorce": "Plateforme SaaS juridique, en production aux États-Unis.",
          "two-app": "L’app iOS des couples, notée 5,0 sur l’App Store.",
        },
      },
      footer: { pages: "Le studio" },
    },
    services: {
      path: "Nos offres",
      badge: "SOLUTIONS",
      title: "Trois façons claires de démarrer votre projet.",
      subtitle: "Un prix affiché quand c’est possible, sinon un devis gratuit après un appel de 30 min.",
      maintenanceTitle: "Option Sérénité",
      maintenanceDesc: "Gardez votre site surveillé, sécurisé et légèrement mis à jour après la mise en ligne.",
      maintenancePrice: "50 €/mois",
      maintenanceCta: "+ ajouter l'option",
      maintenanceHighlight: "Recommandé",
      maintenanceBenefits: [
        "Monitoring de disponibilité",
        "Mises à jour de sécurité",
        "Petits edits de contenu chaque mois",
      ],
      s1: {
        title: "Site Starter",
        price: "300 €",
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
        showMore: "Voir les {n} autres",
        showMoreOne: "Voir l’autre certification",
        showLess: "Réduire",
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
            text: "Les appels sont réservés via Calendly, qui traite les données de réservation selon sa propre politique de confidentialité. L’assistant du site utilise un modèle d’IA de Mistral AI, société française, avec les serveurs de 3geeks en relais : vos messages leur sont transmis uniquement pour générer la réponse, et 3geeks n’en conserve pas le contenu. Merci de ne pas y partager d’informations sensibles."
          },
          {
            title: "4. Vos droits",
            text: "Conformément au RGPD, vous pouvez accéder à vos données, les rectifier ou les supprimer en écrivant à contact@3geeks.fr. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr)."
          },
          {
            title: "5. Cookies",
            text: "Ce site ne dépose aucun cookie publicitaire ni de suivi. Votre choix de langue est seulement mémorisé dans votre navigateur. Le calendrier de réservation est fourni par Calendly : il commence à se charger quand vous pointez un bouton de réservation ou quand l’assistant vous propose un appel, et Calendly peut alors déposer ses propres cookies techniques."
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
