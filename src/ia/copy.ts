// Texts of the AI & automation page (3geeks.fr/ia), aimed at companies that already have
// a website and software, and want AI and automation inside the tools they use.
// Keep server/knowledge.mjs (chunks `ai-services`, `ai-data`) in sync with this file.

export interface AiCopy {
  meta: { title: string; description: string };
  nav: { services: string; useCases: string; proof: string; method: string; cta: string; mainSite: string };
  hero: {
    badge: string;
    titleStart: string;
    titleEnd: string;
    comment: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: Array<{ k: string; v: string }>;
    diagram: { tools: string[]; core: string; coreSub: string; outcomes: string[] };
  };
  services: {
    path: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; desc: string; bullets: string[] }>;
  };
  useCases: {
    path: string;
    title: string;
    subtitle: string;
    before: string;
    after: string;
    items: Array<{ sector: string; before: string; after: string }>;
  };
  proof: {
    path: string;
    title: string;
    subtitle: string;
    open: string;
    privateTag: string;
    items: Array<{ name: string; title: string; desc: string; tags: string[]; link?: string; isPrivate?: boolean }>;
  };
  method: { path: string; title: string; subtitle: string; steps: Array<{ t: string; d: string }> };
  why: { path: string; title: string; subtitle: string; cards: Array<{ title: string; desc: string }> };
  contact: { path: string; title: string; subtitle: string; book: string; bookDesc: string; email: string; linkedin: string };
  footer: { blurb: string; webSite: string; rights: string; tagline: string; navigate: string };
  assistant: { greeting: string; suggestions: string[] };
}

export const aiCopy: Record<'fr' | 'en', AiCopy> = {
  fr: {
    meta: {
      title: '3geeks — Intégration IA et automatisation pour entreprises',
      description:
        'Intégrez l’IA dans vos logiciels existants (ERP, CRM, site, logistique) : agents IA, automatisation des opérations, traitement de documents, applications associées. Audit gratuit de 30 min, rien à payer d’avance.',
    },
    nav: {
      services: 'Services',
      useCases: 'Cas d’usage',
      proof: 'Réalisations',
      method: 'Méthode',
      cta: 'Réserver un audit gratuit',
      mainSite: 'Sites & applications',
    },
    hero: {
      badge: 'IA & automatisation pour entreprises · Made in France',
      titleStart: 'Mettez l’IA au travail',
      titleEnd: 'dans les outils que vous utilisez déjà.',
      comment:
        'Vous avez déjà un site, un logiciel métier, un ERP ou un CRM. On y intègre de l’IA et de l’automatisation pour supprimer les tâches répétitives, répondre plus vite à vos clients et exploiter vos données. Sans rien remplacer.',
      ctaPrimary: 'Réserver un audit gratuit',
      ctaSecondary: 'Voir ce qu’on peut automatiser',
      trust: [
        { k: '30 min', v: 'd’audit gratuit pour repérer vos gains rapides' },
        { k: '0 €', v: 'd’avance : vous payez une fois satisfait' },
        { k: 'FR', v: 'modèles hébergés en France ou sur vos serveurs' },
        { k: 'AWS', v: 'équipe certifiée cloud & machine learning' },
      ],
      diagram: {
        tools: ['ERP / logiciel métier', 'CRM & e-mails', 'Site & e-commerce', 'Logistique & stocks'],
        core: 'Couche IA 3geeks',
        coreSub: 'agents · automatisations · données',
        outcomes: ['Réponses clients 24h/24', 'Documents traités automatiquement', 'Alertes et tableaux de bord', 'Équipes libérées des ressaisies'],
      },
    },
    services: {
      path: 'Nos services IA',
      title: 'Six façons concrètes d’utiliser l’IA dans votre entreprise.',
      subtitle: 'Chaque service part de vos outils et de vos données actuels. Pas de plateforme à remplacer, pas d’usine à gaz.',
      items: [
        {
          title: 'Intégration IA dans vos logiciels',
          desc: 'On branche l’IA dans votre ERP, CRM, back-office ou logiciel métier via leurs API : un assistant dans l’outil, des réponses tirées de vos documents, des champs remplis automatiquement.',
          bullets: ['Assistant interne qui répond à partir de vos documents', 'Connexion à l’existant : API, exports, bases de données', 'Rédaction et pré-remplissage automatiques'],
        },
        {
          title: 'Automatisation logistique & opérations',
          desc: 'Commandes, bons de livraison, factures, stocks, planning : on automatise les étapes qui prennent du temps à vos équipes chaque jour.',
          bullets: ['Lecture automatique des bons de livraison, factures et commandes', 'Alertes stock, retards et anomalies en temps réel', 'Planning et tournées assistés'],
        },
        {
          title: 'Agents IA : chat, e-mail, téléphone',
          desc: 'Un agent qui répond à vos clients 24h/24 sur votre site, par e-mail ou au téléphone, qualifie les demandes et transmet le reste à votre équipe.',
          bullets: ['Support client et FAQ 24h/24', 'Qualification et tri des demandes entrantes', 'Réception téléphonique IA, comme CallKitchen'],
        },
        {
          title: 'Documents & données',
          desc: 'Extraction d’informations dans vos contrats, factures et e-mails, classement automatique, tableaux de bord et prévisions à partir de vos données.',
          bullets: ['Extraction et classement automatiques', 'Tableaux de bord et reporting', 'Prévisions : ventes, stocks, charge'],
        },
        {
          title: 'Applications associées',
          desc: 'Une app web, mobile ou Telegram reliée à votre système : espace client, outil terrain pour vos équipes, portail fournisseurs ou partenaires.',
          bullets: ['App web ou iOS reliée à vos données', 'Espace client ou portail partenaires', 'Outil terrain pour les équipes'],
        },
        {
          title: 'Cadrage & formation',
          desc: 'On identifie les cas d’usage rentables, on fixe les règles de confidentialité des données et on forme vos équipes à utiliser l’IA au quotidien.',
          bullets: ['Audit des cas d’usage et priorisation', 'Règles de confidentialité et droits d’accès', 'Formation des équipes : prompts, bons usages'],
        },
      ],
    },
    useCases: {
      path: 'Cas d’usage',
      title: 'Ce que ça change, concrètement.',
      subtitle: 'Des exemples par secteur pour vous projeter. Chaque entreprise a ses propres gains rapides : on les trouve ensemble en 30 min.',
      before: 'Aujourd’hui',
      after: 'Avec 3geeks',
      items: [
        {
          sector: 'Logistique & transport',
          before: 'Les bons de livraison et les commandes sont ressaisis à la main, les retards se découvrent trop tard.',
          after: 'Les documents sont lus automatiquement, les anomalies remontent en temps réel, les tournées se planifient en quelques clics.',
        },
        {
          sector: 'Commerce & e-commerce',
          before: 'Les mêmes questions clients reviennent chaque jour, les stocks sont tenus sur trois outils différents.',
          after: 'Un assistant répond 24h/24, les stocks et les prix sont synchronisés entre le site, la caisse et les écrans.',
        },
        {
          sector: 'Services & cabinets',
          before: 'Contrats, devis et dossiers prennent des heures à rédiger et à suivre.',
          after: 'Les documents sont pré-remplis et signés en ligne, les dossiers suivis dans un tableau de bord.',
        },
        {
          sector: 'Restauration & hôtellerie',
          before: 'Chaque appel manqué est une commande ou une réservation perdue.',
          after: 'Une réception IA prend commandes et réservations à toute heure et prévient l’équipe par SMS.',
        },
        {
          sector: 'Industrie & PME',
          before: 'Les données existent, mais personne n’a le temps de les analyser.',
          after: 'Tableaux de bord automatiques, prévisions de charge et alertes sur les indicateurs clés.',
        },
        {
          sector: 'Équipes internes',
          before: 'Chacun cherche l’information dans des dossiers, des e-mails et des procédures éparpillés.',
          after: 'Un assistant interne répond à partir de vos documents, en citant ses sources et en respectant les droits d’accès.',
        },
      ],
    },
    proof: {
      path: 'Déjà en production',
      title: 'De l’IA et des automatisations qui tournent déjà.',
      subtitle: 'Quelques exemples livrés par 3geeks, chez des clients et dans nos propres outils.',
      open: 'Voir',
      privateTag: 'Projet privé',
      items: [
        {
          name: 'CallKitchen',
          title: 'Réception téléphonique IA pour restaurants',
          desc: 'Agent vocal qui prend commandes et réservations 24h/24, répond sur les menus, prévient l’équipe par SMS et alimente un tableau de bord cuisine.',
          tags: ['Agent vocal', 'SMS', 'Dashboard'],
          link: 'https://call-kitchen-landing.vercel.app',
        },
        {
          name: 'Assistant 3geeks',
          title: 'L’assistant IA de ce site, hébergé en France',
          desc: 'L’assistant en bas à droite répond à partir de notre base de connaissances, sur un modèle qui tourne sur nos propres serveurs. Testez-le : c’est ce qu’on peut déployer sur votre site ou en interne.',
          tags: ['Modèle hébergé en France', 'RAG', 'Messages non conservés'],
        },
        {
          name: 'Green Jardin',
          title: 'Site, caisse et écran synchronisés',
          desc: 'La boutique en ligne, la caisse avec balance et le menu TV du magasin partagent les mêmes produits et les mêmes prix : une seule source à tenir à jour.',
          tags: ['Automatisation', 'POS', 'Temps réel'],
          link: 'https://green-jardin.fr',
        },
        {
          name: 'Signature de contrats',
          title: 'Documents générés et signés automatiquement',
          desc: 'Liens de signature par rôle, suivi des statuts et PDF consolidé mis à jour à chaque signature, avec un tableau de bord d’administration.',
          tags: ['PDF dynamique', 'Workflow', 'Dashboard'],
          isPrivate: true,
        },
        {
          name: 'Boutique sur Telegram',
          title: 'Commandes et gestion en temps réel',
          desc: 'Mini-app de commande intégrée à Telegram, accès vérifié côté serveur et espace gérant installable sur iPhone pour suivre les commandes.',
          tags: ['Mini-app', 'PWA', 'Temps réel'],
          isPrivate: true,
        },
        {
          name: 'Prompt Hub & PromptOptim',
          title: 'Nos outils IA maison',
          desc: 'Prompt Hub transforme une idée en plan d’exécution orchestré par des agents IA. PromptOptim réduit la consommation de tokens et estime l’impact CO2 de chaque requête.',
          tags: ['Multi-agent', 'Green IT'],
          link: 'https://prompt-hub.3geeks.fr/',
        },
      ],
    },
    method: {
      path: 'Méthode',
      title: 'Un pilote en quelques semaines, pas un projet de six mois.',
      subtitle: 'On commence petit, sur un cas précis et mesurable, puis on étend ce qui marche.',
      steps: [
        { t: 'Audit gratuit · 30 min', d: 'On passe en revue vos outils et vos tâches répétitives pour repérer deux ou trois gains rapides.' },
        { t: 'Pilote sur un cas précis', d: 'On livre un premier cas d’usage fonctionnel, branché sur vos vraies données, pour mesurer le gain.' },
        { t: 'Intégration & sécurité', d: 'On l’intègre dans vos outils, avec des règles claires sur les données : modèles hébergés en France ou sur vos serveurs si besoin.' },
        { t: 'Déploiement & suivi', d: 'Formation de l’équipe, suivi des résultats et améliorations en continu. Vous payez une fois satisfait.' },
      ],
    },
    why: {
      path: 'Pourquoi 3geeks',
      title: 'Des ingénieurs IA en direct, pas un intermédiaire.',
      subtitle: 'Elias et Noam, cofondateurs, travaillent au quotidien sur des projets d’IA générative et de cloud. Vous parlez directement à ceux qui développent.',
      cards: [
        { title: 'Vos données restent sous contrôle', desc: 'Modèles hébergés en France, sur nos serveurs ou les vôtres. Rien n’est envoyé à un service tiers sans votre accord.' },
        { title: 'Compatible avec l’existant', desc: 'On s’appuie sur vos API, exports et bases de données. Votre ERP, votre CRM et votre site restent en place.' },
        { title: 'Du code qui vous appartient', desc: 'Tout ce qu’on développe est à votre nom : code source, prompts, intégrations. Aucune dépendance à 3geeks.' },
        { title: 'Certifiés cloud & IA', desc: 'Équipe certifiée AWS (Cloud Practitioner, Machine Learning, Cloud Architecting) et formée au prompt engineering.' },
      ],
    },
    contact: {
      path: 'Contact',
      title: 'Trouvons vos gains rapides.',
      subtitle: 'Expliquez-nous vos outils et ce qui prend du temps à vos équipes. En 30 min, on vous dit ce qui est automatisable, et on vous envoie un devis gratuit.',
      book: 'Réserver un audit gratuit',
      bookDesc: '30 min par téléphone ou en visio, sans engagement.',
      email: 'Réponse sous 24h',
      linkedin: 'Ou écrivez directement à un cofondateur sur LinkedIn',
    },
    footer: {
      blurb: 'IA et automatisation intégrées dans les outils de votre entreprise.',
      webSite: 'Besoin d’un site ou d’une application ? Voir nos offres web',
      rights: 'Tous droits réservés.',
      tagline: 'Made in France',
      navigate: 'Navigation',
    },
    assistant: {
      greeting: 'Bonjour ! Je suis l’assistant de 3geeks. Posez-moi vos questions sur l’intégration de l’IA dans vos outils, l’automatisation de vos opérations ou votre projet.',
      suggestions: ['Que pouvez-vous automatiser dans ma logistique ?', 'Pouvez-vous intégrer l’IA à mon logiciel actuel ?', 'Où sont hébergées les données ?', 'Comment se passe le paiement ?'],
    },
  },
  en: {
    meta: {
      title: '3geeks — AI integration and automation for businesses',
      description:
        'Bring AI into the software you already use (ERP, CRM, website, logistics): AI agents, operations automation, document processing, companion apps. Free 30-minute audit, nothing to pay upfront.',
    },
    nav: {
      services: 'Services',
      useCases: 'Use cases',
      proof: 'Work',
      method: 'Process',
      cta: 'Book a free audit',
      mainSite: 'Websites & apps',
    },
    hero: {
      badge: 'AI & automation for businesses · Made in France',
      titleStart: 'Put AI to work',
      titleEnd: 'inside the tools you already use.',
      comment:
        'You already have a website, business software, an ERP or a CRM. We add AI and automation to them to remove repetitive tasks, answer your customers faster and make use of your data. Without replacing anything.',
      ctaPrimary: 'Book a free audit',
      ctaSecondary: 'See what we can automate',
      trust: [
        { k: '30 min', v: 'free audit to spot your quick wins' },
        { k: '€0', v: 'upfront: you pay once you are happy' },
        { k: 'FR', v: 'models hosted in France or on your servers' },
        { k: 'AWS', v: 'cloud & machine learning certified team' },
      ],
      diagram: {
        tools: ['ERP / business software', 'CRM & email', 'Website & e-commerce', 'Logistics & inventory'],
        core: '3geeks AI layer',
        coreSub: 'agents · automations · data',
        outcomes: ['Customer answers 24/7', 'Documents processed automatically', 'Alerts and dashboards', 'Teams freed from re-typing'],
      },
    },
    services: {
      path: 'Our AI services',
      title: 'Six concrete ways to use AI in your business.',
      subtitle: 'Every service starts from your current tools and data. No platform to replace, no over-engineering.',
      items: [
        {
          title: 'AI integration into your software',
          desc: 'We plug AI into your ERP, CRM, back office or business software through their APIs: an assistant inside the tool, answers drawn from your documents, fields filled automatically.',
          bullets: ['Internal assistant answering from your documents', 'Connected to what exists: APIs, exports, databases', 'Automatic drafting and pre-filling'],
        },
        {
          title: 'Logistics & operations automation',
          desc: 'Orders, delivery notes, invoices, inventory, planning: we automate the steps that cost your teams time every day.',
          bullets: ['Automatic reading of delivery notes, invoices and orders', 'Real-time stock, delay and anomaly alerts', 'Assisted planning and routing'],
        },
        {
          title: 'AI agents: chat, email, phone',
          desc: 'An agent that answers your customers 24/7 on your website, by email or on the phone, qualifies requests and hands the rest to your team.',
          bullets: ['Customer support and FAQ 24/7', 'Qualification and triage of incoming requests', 'AI phone reception, like CallKitchen'],
        },
        {
          title: 'Documents & data',
          desc: 'Information extraction from your contracts, invoices and emails, automatic filing, dashboards and forecasts built on your data.',
          bullets: ['Automatic extraction and filing', 'Dashboards and reporting', 'Forecasts: sales, stock, workload'],
        },
        {
          title: 'Companion apps',
          desc: 'A web, mobile or Telegram app connected to your system: customer area, field tool for your teams, supplier or partner portal.',
          bullets: ['Web or iOS app connected to your data', 'Customer area or partner portal', 'Field tool for teams'],
        },
        {
          title: 'Scoping & training',
          desc: 'We identify the profitable use cases, set the data privacy rules and train your teams to use AI every day.',
          bullets: ['Use-case audit and prioritisation', 'Privacy rules and access rights', 'Team training: prompts, good practice'],
        },
      ],
    },
    useCases: {
      path: 'Use cases',
      title: 'What it changes, concretely.',
      subtitle: 'Examples by sector to picture it. Every company has its own quick wins: we find them together in 30 minutes.',
      before: 'Today',
      after: 'With 3geeks',
      items: [
        {
          sector: 'Logistics & transport',
          before: 'Delivery notes and orders are re-typed by hand, delays are discovered too late.',
          after: 'Documents are read automatically, anomalies surface in real time, routes are planned in a few clicks.',
        },
        {
          sector: 'Retail & e-commerce',
          before: 'The same customer questions come back every day, stock is tracked in three different tools.',
          after: 'An assistant answers 24/7, stock and prices stay in sync between the website, the till and the screens.',
        },
        {
          sector: 'Services & firms',
          before: 'Contracts, quotes and files take hours to write and follow up.',
          after: 'Documents are pre-filled and signed online, files are tracked in a dashboard.',
        },
        {
          sector: 'Restaurants & hospitality',
          before: 'Every missed call is a lost order or booking.',
          after: 'An AI reception takes orders and bookings at any hour and notifies the team by SMS.',
        },
        {
          sector: 'Industry & SMEs',
          before: 'The data exists, but nobody has time to analyse it.',
          after: 'Automatic dashboards, workload forecasts and alerts on key indicators.',
        },
        {
          sector: 'Internal teams',
          before: 'Everyone hunts for information across scattered folders, emails and procedures.',
          after: 'An internal assistant answers from your documents, citing sources and respecting access rights.',
        },
      ],
    },
    proof: {
      path: 'Already in production',
      title: 'AI and automations that already run.',
      subtitle: 'A few examples delivered by 3geeks, for clients and in our own tools.',
      open: 'Open',
      privateTag: 'Private project',
      items: [
        {
          name: 'CallKitchen',
          title: 'AI phone reception for restaurants',
          desc: 'Voice agent that takes orders and bookings 24/7, answers menu questions, notifies the team by SMS and feeds a kitchen dashboard.',
          tags: ['Voice agent', 'SMS', 'Dashboard'],
          link: 'https://call-kitchen-landing.vercel.app',
        },
        {
          name: '3geeks assistant',
          title: 'This site’s AI assistant, hosted in France',
          desc: 'The assistant in the bottom right answers from our knowledge base, on a model running on our own servers. Try it: this is what we can deploy on your website or internally.',
          tags: ['Model hosted in France', 'RAG', 'Messages not stored'],
        },
        {
          name: 'Green Jardin',
          title: 'Website, till and screen in sync',
          desc: 'The online store, the till with its scale and the in-store TV menu share the same products and prices: a single source to keep up to date.',
          tags: ['Automation', 'POS', 'Real time'],
          link: 'https://green-jardin.fr',
        },
        {
          name: 'Contract signing',
          title: 'Documents generated and signed automatically',
          desc: 'Per-role signing links, status tracking and a consolidated PDF updated with every signature, with an admin dashboard.',
          tags: ['Dynamic PDF', 'Workflow', 'Dashboard'],
          isPrivate: true,
        },
        {
          name: 'Telegram shop',
          title: 'Orders and management in real time',
          desc: 'Ordering mini-app built into Telegram, server-side verified access and a manager space installable on iPhone to follow orders.',
          tags: ['Mini-app', 'PWA', 'Real time'],
          isPrivate: true,
        },
        {
          name: 'Prompt Hub & PromptOptim',
          title: 'Our in-house AI tools',
          desc: 'Prompt Hub turns an idea into an execution plan orchestrated by AI agents. PromptOptim cuts token usage and estimates the CO2 impact of each request.',
          tags: ['Multi-agent', 'Green IT'],
          link: 'https://prompt-hub.3geeks.fr/',
        },
      ],
    },
    method: {
      path: 'Process',
      title: 'A pilot in a few weeks, not a six-month project.',
      subtitle: 'We start small, on one precise and measurable case, then extend what works.',
      steps: [
        { t: 'Free audit · 30 min', d: 'We review your tools and repetitive tasks to spot two or three quick wins.' },
        { t: 'Pilot on one case', d: 'We deliver a first working use case, connected to your real data, to measure the gain.' },
        { t: 'Integration & security', d: 'We integrate it into your tools, with clear data rules: models hosted in France or on your servers if needed.' },
        { t: 'Rollout & follow-up', d: 'Team training, results tracking and continuous improvements. You pay once you are happy.' },
      ],
    },
    why: {
      path: 'Why 3geeks',
      title: 'AI engineers, directly. No middleman.',
      subtitle: 'Elias and Noam, the co-founders, work on generative AI and cloud projects every day. You talk directly to the people who build.',
      cards: [
        { title: 'Your data stays under control', desc: 'Models hosted in France, on our servers or yours. Nothing is sent to a third-party service without your agreement.' },
        { title: 'Works with what you have', desc: 'We build on your APIs, exports and databases. Your ERP, CRM and website stay in place.' },
        { title: 'Code that belongs to you', desc: 'Everything we build is in your name: source code, prompts, integrations. No dependency on 3geeks.' },
        { title: 'Cloud & AI certified', desc: 'AWS-certified team (Cloud Practitioner, Machine Learning, Cloud Architecting), trained in prompt engineering.' },
      ],
    },
    contact: {
      path: 'Contact',
      title: 'Let’s find your quick wins.',
      subtitle: 'Tell us about your tools and what costs your teams time. In 30 minutes we tell you what can be automated, then send a free quote.',
      book: 'Book a free audit',
      bookDesc: '30 minutes by phone or video call, no commitment.',
      email: 'Reply within 24h',
      linkedin: 'Or reach a co-founder directly on LinkedIn',
    },
    footer: {
      blurb: 'AI and automation built into your company’s tools.',
      webSite: 'Need a website or an app? See our web offers',
      rights: 'All rights reserved.',
      tagline: 'Made in France',
      navigate: 'Navigate',
    },
    assistant: {
      greeting: 'Hi! I’m the 3geeks assistant. Ask me about bringing AI into your tools, automating your operations, or your own project.',
      suggestions: ['What can you automate in my logistics?', 'Can you add AI to my current software?', 'Where is the data hosted?', 'How does payment work?'],
    },
  },
};
