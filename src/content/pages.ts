/**
 * Content pages written for search engines (plan SEO, PLAN-SEO.md): one entry per page, text only.
 * From this list come the HTML entry of each page (vite.config.ts), its prerender, its sitemap entry
 * and its route. Adding a page = adding an entry here. Pure data: no React, no image import, because
 * vite.config.ts reads this file too.
 *
 * Rules (site content rules): facts we can prove, no prices on the AI side, no FAQ, no private or
 * discreet project, and nothing built on Green Jardin, the Telegram shop or Vipagence.
 */

export type Localized<T> = { fr: T; en: T };

export type ContentSection =
  /** "What we set up": cards with a title and a short text. */
  | { type: 'points'; path: Localized<string>; title: Localized<string>; sub?: Localized<string>; items: Localized<Array<{ t: string; d: string }>> }
  /** Numbered steps (how it goes). */
  | { type: 'steps'; path: Localized<string>; title: Localized<string>; sub?: Localized<string>; items: Localized<Array<{ t: string; d: string }>> }
  /** Things we already shipped, each with an optional public link. */
  | {
      type: 'proof';
      path: Localized<string>;
      title: Localized<string>;
      sub?: Localized<string>;
      items: Array<{ name: string; title: Localized<string>; d: Localized<string>; link?: string }>;
    }
  /** Short list of limits or commitments, as plain checked lines. */
  | { type: 'checks'; path: Localized<string>; title: Localized<string>; items: Localized<string[]> };

export interface ContentPage {
  /** Address without trailing slash, e.g. /ia/agents-ia. */
  path: string;
  /** Which side of the site it belongs to: the AI pages keep the /ia frame (no web offers, no prices). */
  space: 'web' | 'ai';
  /** The page one level up, for the breadcrumb. */
  parent: { href: string; label: Localized<string> };
  /** schema.org type declared in the page head. */
  schema: 'Service';
  /** Search-result title (about 60 characters) and description (about 155). */
  meta: Localized<{ title: string; description: string }>;
  eyebrow: Localized<string>;
  h1: Localized<string>;
  intro: Localized<string>;
  sections: ContentSection[];
  /** Other content pages to suggest at the bottom (their paths). */
  related: string[];
  /** Booking source shown in Calendly (utm_content). */
  bookingSource: string;
  /** Last real change, for the sitemap. */
  updated: string;
}

const AI_PARENT = { href: '/ia', label: { fr: 'IA pour entreprises', en: 'AI for business' } };

/** The four steps of every AI project (as on /ia), with the first two told for each service. */
const aiMethod = (audit: Localized<string>, pilot: Localized<string>): ContentSection => ({
  type: 'steps',
  path: { fr: 'Comment ça se passe', en: 'How it goes' },
  title: { fr: 'Un pilote en quelques semaines, pas un projet de six mois.', en: 'A pilot in a few weeks, not a six-month project.' },
  items: {
    fr: [
      { t: 'Audit gratuit · 30 min', d: audit.fr },
      { t: 'Pilote sur un cas précis', d: pilot.fr },
      { t: 'Intégration & sécurité', d: 'On l’intègre dans vos outils avec des règles claires sur les données : modèles hébergés en France ou sur vos serveurs si besoin.' },
      { t: 'Déploiement & suivi', d: 'Formation de l’équipe, suivi des résultats et améliorations en continu. Vous payez une fois satisfait.' },
    ],
    en: [
      { t: 'Free audit · 30 min', d: audit.en },
      { t: 'Pilot on one precise case', d: pilot.en },
      { t: 'Integration & security', d: 'We integrate it into your tools with clear rules on data: models hosted in France or on your servers if needed.' },
      { t: 'Rollout & follow-up', d: 'Team training, results tracking and continuous improvements. You pay once satisfied.' },
    ],
  },
});

export const CONTENT_PAGES: ContentPage[] = [
  {
    path: '/ia/agents-ia',
    space: 'ai',
    parent: AI_PARENT,
    schema: 'Service',
    meta: {
      fr: {
        title: 'Agent IA pour entreprise : chat, e-mail et téléphone | 3geeks',
        description: 'Un agent IA qui répond à vos clients 24 h/24 sur votre site, par e-mail ou au téléphone, trie les demandes et transmet le reste à votre équipe. Audit gratuit de 30 min.',
      },
      en: {
        title: 'AI agents for business: chat, email and phone | 3geeks',
        description: 'An AI agent that answers your customers 24/7 on your website, by email or on the phone, sorts requests and hands the rest to your team. Free 30-min audit.',
      },
    },
    eyebrow: { fr: 'Agents IA', en: 'AI agents' },
    h1: {
      fr: 'Un agent IA qui répond à vos clients, jour et nuit.',
      en: 'An AI agent that answers your customers, day and night.',
    },
    intro: {
      fr: 'Sur votre site, par e-mail ou au téléphone, l’agent répond aux questions qui reviennent tout le temps, trie les demandes et passe le relais à votre équipe pour le reste. Il s’appuie sur vos documents et vos outils actuels : rien à remplacer.',
      en: 'On your website, by email or on the phone, the agent answers the questions that keep coming back, sorts requests and hands over to your team for the rest. It relies on your documents and current tools: nothing to replace.',
    },
    sections: [
      {
        type: 'points',
        path: { fr: 'Ce qu’on met en place', en: 'What we set up' },
        title: { fr: 'Un agent par canal, relié à vos outils.', en: 'One agent per channel, connected to your tools.' },
        sub: {
          fr: 'On commence par le canal qui vous prend le plus de temps, puis on étend ce qui marche.',
          en: 'We start with the channel that takes you the most time, then extend what works.',
        },
        items: {
          fr: [
            { t: 'Chat sur votre site', d: 'Des réponses tirées de vos pages, de vos tarifs et de vos documents, avec un passage de relais vers un humain quand la question sort du cadre.' },
            { t: 'Réponses aux e-mails', d: 'L’agent lit les messages entrants, prépare une réponse ou la classe, et ne laisse partir seul que ce que vous avez validé.' },
            { t: 'Réception téléphonique', d: 'Un agent vocal qui décroche, répond aux questions courantes, prend une commande ou un rendez-vous, et prévient l’équipe.' },
            { t: 'Tri et qualification', d: 'Chaque demande arrive au bon endroit, résumée et classée par urgence, dans l’outil que votre équipe utilise déjà.' },
          ],
          en: [
            { t: 'Chat on your website', d: 'Answers drawn from your pages, prices and documents, with a handover to a human when the question goes beyond its scope.' },
            { t: 'Email replies', d: 'The agent reads incoming messages, drafts a reply or files it, and only sends on its own what you have approved.' },
            { t: 'Phone reception', d: 'A voice agent that picks up, answers common questions, takes an order or a booking, and notifies the team.' },
            { t: 'Sorting and qualification', d: 'Every request lands in the right place, summarised and ranked by urgency, in the tool your team already uses.' },
          ],
        },
      },
      {
        type: 'proof',
        path: { fr: 'Déjà en production', en: 'Already live' },
        title: { fr: 'Deux agents qui tournent déjà.', en: 'Two agents already running.' },
        items: [
          {
            name: 'CallKitchen',
            title: { fr: 'Réception téléphonique IA pour restaurants', en: 'AI phone reception for restaurants' },
            d: {
              fr: 'Un agent vocal qui prend commandes et réservations 24 h/24, répond sur les menus, prévient l’équipe par SMS et alimente un tableau de bord cuisine.',
              en: 'A voice agent that takes orders and bookings 24/7, answers menu questions, alerts the team by SMS and feeds a kitchen dashboard.',
            },
            link: 'https://call-kitchen-landing.vercel.app',
          },
          {
            name: 'Assistant 3geeks',
            title: { fr: 'L’assistant de ce site', en: 'This website’s assistant' },
            d: {
              fr: 'L’assistant en bas à droite répond à partir de notre base de connaissances, avec un modèle français de Mistral AI et un relais sur nos propres serveurs. Posez-lui une question : c’est ce qu’on peut déployer chez vous.',
              en: 'The assistant at the bottom right answers from our knowledge base, with a French Mistral AI model and a relay on our own servers. Ask it a question: this is what we can deploy for you.',
            },
          },
        ],
      },
      {
        type: 'checks',
        path: { fr: 'Nos règles', en: 'Our rules' },
        title: { fr: 'Un agent utile, pas un agent qui invente.', en: 'A useful agent, not one that makes things up.' },
        items: {
          fr: [
            'L’agent répond à partir de vos contenus, et dit quand il ne sait pas.',
            'Ce qui vous engage (devis, litige, réclamation sensible) passe toujours par un humain.',
            'Vos données restent sous contrôle : modèles hébergés en France, sur nos serveurs ou les vôtres, rien n’est envoyé à un service tiers sans votre accord.',
            'Tout ce qu’on développe est à votre nom : code, prompts, intégrations.',
          ],
          en: [
            'The agent answers from your content, and says when it does not know.',
            'Anything that commits you (quotes, disputes, sensitive complaints) always goes through a human.',
            'Your data stays under control: models hosted in France, on our servers or yours, nothing is sent to a third party without your consent.',
            'Everything we build is yours: code, prompts, integrations.',
          ],
        },
      },
      aiMethod(
        {
          fr: 'On passe en revue vos outils et les demandes que reçoit votre équipe, pour repérer ce qu’un agent peut prendre en charge.',
          en: 'We go through your tools and the requests your team receives, to spot what an agent can take on.',
        },
        {
          fr: 'Un premier agent, branché sur vos vraies données, sur un seul canal : on mesure ce qu’il traite seul et ce qu’il transmet.',
          en: 'A first agent, plugged into your real data, on a single channel: we measure what it handles alone and what it hands over.',
        },
      ),
    ],
    related: ['/ia/assistant-interne', '/ia/automatisation', '/ia/integration-logiciels'],
    bookingSource: 'seo-agents-ia',
    updated: '2026-10-24',
  },
  {
    path: '/ia/automatisation',
    space: 'ai',
    parent: AI_PARENT,
    schema: 'Service',
    meta: {
      fr: {
        title: 'Automatisation des processus avec l’IA pour les entreprises | 3geeks',
        description: 'Commandes, bons de livraison, factures, stocks, planning : on automatise avec l’IA les tâches répétitives de vos équipes, dans vos outils actuels. Audit gratuit de 30 min.',
      },
      en: {
        title: 'Business process automation with AI | 3geeks',
        description: 'Orders, delivery notes, invoices, stock, planning: we automate your teams’ repetitive tasks with AI, inside your current tools. Free 30-min audit.',
      },
    },
    eyebrow: { fr: 'Automatisation', en: 'Automation' },
    h1: {
      fr: 'Automatisez les tâches qui prennent du temps à vos équipes.',
      en: 'Automate the tasks that eat up your teams’ time.',
    },
    intro: {
      fr: 'Recopier une commande, vérifier un bon de livraison, relancer un retard, mettre à jour un tableau : l’IA prend ces étapes en charge dans les outils que vous utilisez déjà, et prévient un humain dès que quelque chose sort de l’ordinaire.',
      en: 'Copying an order, checking a delivery note, chasing a delay, updating a spreadsheet: AI takes over these steps inside the tools you already use, and alerts a human as soon as something is out of the ordinary.',
    },
    sections: [
      {
        type: 'points',
        path: { fr: 'Ce qu’on automatise', en: 'What we automate' },
        title: { fr: 'Les étapes répétitives, pas votre métier.', en: 'The repetitive steps, not your trade.' },
        sub: {
          fr: 'On part d’un process précis et mesurable, on l’automatise, puis on étend ce qui marche.',
          en: 'We start from one precise, measurable process, automate it, then extend what works.',
        },
        items: {
          fr: [
            { t: 'Commandes et documents entrants', d: 'Bons de livraison, factures et commandes lus automatiquement, et leurs informations reportées dans le bon outil.' },
            { t: 'Alertes en temps réel', d: 'Stock bas, retard, anomalie de prix ou de quantité : la bonne personne est prévenue au bon moment.' },
            { t: 'Planning et tournées', d: 'Des propositions de planning ou de tournée à partir de vos contraintes, qu’un humain valide.' },
            { t: 'Suivi et tableaux de bord', d: 'Les tâches qui avancent seules et un tableau à jour, sans ressaisie entre vos outils.' },
          ],
          en: [
            { t: 'Incoming orders and documents', d: 'Delivery notes, invoices and orders read automatically, and their details carried into the right tool.' },
            { t: 'Real-time alerts', d: 'Low stock, delays, price or quantity anomalies: the right person is notified at the right time.' },
            { t: 'Planning and routes', d: 'Planning or route suggestions from your constraints, approved by a human.' },
            { t: 'Tracking and dashboards', d: 'Tasks that move forward on their own and an up-to-date dashboard, with no re-typing between tools.' },
          ],
        },
      },
      {
        type: 'proof',
        path: { fr: 'Déjà en production', en: 'Already live' },
        title: { fr: 'Des automatisations qu’on utilise déjà.', en: 'Automations we already use.' },
        items: [
          {
            name: 'Workspace',
            title: { fr: 'Notre pilotage de projets, tenu à jour par l’IA', en: 'Our project hub, kept up to date by AI' },
            d: {
              fr: 'Chez 3geeks, l’IA crée les tâches, les fait avancer et tient le journal de chaque projet pendant qu’elle travaille : plus de 100 tâches suivies depuis sa mise en service, le 19 octobre 2026, sans saisie à la main.',
              en: 'At 3geeks, the AI creates tasks, moves them forward and keeps each project’s log while it works: over 100 tasks tracked since it went live on 19 October 2026, with no manual entry.',
            },
          },
          {
            name: 'CallKitchen',
            title: { fr: 'Les commandes passées au téléphone, jusqu’en cuisine', en: 'Phone orders, all the way to the kitchen' },
            d: {
              fr: 'Chaque commande prise par l’agent vocal arrive dans un tableau de bord cuisine, et l’équipe est prévenue par SMS.',
              en: 'Every order taken by the voice agent lands in a kitchen dashboard, and the team is alerted by SMS.',
            },
            link: 'https://call-kitchen-landing.vercel.app',
          },
        ],
      },
      {
        type: 'checks',
        path: { fr: 'Ce qu’on n’automatise pas', en: 'What we do not automate' },
        title: { fr: 'L’IA prépare, un humain décide.', en: 'AI prepares, a human decides.' },
        items: {
          fr: [
            'Les décisions sensibles (recrutement, litige, sanction) restent humaines : l’IA prépare le dossier.',
            'Si les données sont éparpillées, on commence par les structurer avant d’automatiser.',
            'Si un simple script suffit, on fait le script : c’est moins cher.',
            'On s’appuie sur vos outils actuels (API, exports, bases de données) : rien à remplacer.',
          ],
          en: [
            'Sensitive decisions (hiring, disputes, sanctions) stay human: AI prepares the file.',
            'If your data is scattered, we structure it first, then automate.',
            'If a simple script is enough, we write the script: it costs less.',
            'We build on your current tools (APIs, exports, databases): nothing to replace.',
          ],
        },
      },
      aiMethod(
        {
          fr: 'On passe en revue vos outils et vos tâches répétitives pour repérer deux ou trois gains rapides.',
          en: 'We go through your tools and repetitive tasks to spot two or three quick wins.',
        },
        {
          fr: 'Un premier process automatisé, branché sur vos vraies données, pour mesurer le temps gagné.',
          en: 'A first automated process, plugged into your real data, to measure the time saved.',
        },
      ),
    ],
    related: ['/ia/documents', '/ia/integration-logiciels', '/ia/agents-ia'],
    bookingSource: 'seo-automatisation',
    updated: '2026-10-24',
  },
  {
    path: '/ia/documents',
    space: 'ai',
    parent: AI_PARENT,
    schema: 'Service',
    meta: {
      fr: {
        title: 'Lecture automatique de factures et documents par l’IA | 3geeks',
        description: 'Factures, contrats, bons de commande, e-mails : l’IA extrait les informations, classe les documents et remplit vos outils. Vous validez ce qui compte. Audit gratuit de 30 min.',
      },
      en: {
        title: 'Automatic reading of invoices and documents with AI | 3geeks',
        description: 'Invoices, contracts, purchase orders, emails: AI extracts the information, files the documents and fills in your tools. You approve what matters. Free 30-min audit.',
      },
    },
    eyebrow: { fr: 'Documents & données', en: 'Documents & data' },
    h1: {
      fr: 'Vos factures et vos contrats lus, classés et saisis automatiquement.',
      en: 'Your invoices and contracts read, filed and entered automatically.',
    },
    intro: {
      fr: 'L’IA lit les documents qui arrivent par e-mail ou par scan, en extrait les informations utiles et les reporte dans vos outils. Vos équipes ne ressaisissent plus : elles vérifient ce qui le mérite.',
      en: 'AI reads the documents that arrive by email or scan, extracts the useful information and carries it into your tools. Your teams stop re-typing: they check what deserves it.',
    },
    sections: [
      {
        type: 'points',
        path: { fr: 'Ce qu’on met en place', en: 'What we set up' },
        title: { fr: 'Du document au bon champ, sans ressaisie.', en: 'From the document to the right field, no re-typing.' },
        items: {
          fr: [
            { t: 'Extraction', d: 'Montants, dates, références, parties d’un contrat : les informations sortent du PDF, du scan ou de l’e-mail.' },
            { t: 'Classement', d: 'Chaque document est rangé au bon endroit, nommé et rattaché au bon client, fournisseur ou dossier.' },
            { t: 'Documents générés', d: 'Contrats, formulaires et courriers pré-remplis à partir de vos données, prêts à relire et à signer.' },
            { t: 'Tableaux de bord et synthèses', d: 'Vos données remontent dans un tableau à jour, et les documents longs sont résumés pour décider plus vite.' },
          ],
          en: [
            { t: 'Extraction', d: 'Amounts, dates, references, contract parties: the information comes out of the PDF, scan or email.' },
            { t: 'Filing', d: 'Each document is stored in the right place, named and linked to the right client, supplier or file.' },
            { t: 'Generated documents', d: 'Contracts, forms and letters pre-filled from your data, ready to review and sign.' },
            { t: 'Dashboards and summaries', d: 'Your data flows into an up-to-date dashboard, and long documents are summarised to decide faster.' },
          ],
        },
      },
      {
        type: 'proof',
        path: { fr: 'Déjà en production', en: 'Already live' },
        title: { fr: 'Des documents qu’on génère déjà automatiquement.', en: 'Documents we already generate automatically.' },
        items: [
          {
            name: 'Express Divorce USA',
            title: { fr: 'Les formulaires de chaque État générés automatiquement', en: 'Each state’s forms generated automatically' },
            d: {
              fr: 'Un questionnaire guidé vérifie l’éligibilité, puis la plateforme génère les formulaires de divorce propres à chaque État américain.',
              en: 'A guided questionnaire checks eligibility, then the platform generates the divorce forms specific to each US state.',
            },
            link: 'https://www.expressdivorceusa.co',
          },
          {
            name: 'Signature de contrats',
            title: { fr: 'Un PDF consolidé à chaque signature', en: 'A consolidated PDF at every signature' },
            d: {
              fr: 'Une plateforme privée : liens de signature par rôle, suivi des statuts, et un PDF mis à jour automatiquement à chaque nouvelle signature.',
              en: 'A private platform: per-role signing links, status tracking, and a PDF updated automatically with every new signature.',
            },
          },
        ],
      },
      {
        type: 'checks',
        path: { fr: 'Nos règles', en: 'Our rules' },
        title: { fr: 'Vos documents restent les vôtres.', en: 'Your documents stay yours.' },
        items: {
          fr: [
            'Ce qui vous engage (contrats, courriers juridiques) passe toujours par une validation humaine.',
            'Les documents restent sous contrôle : modèles hébergés en France, sur nos serveurs ou les vôtres.',
            'Rien n’est envoyé à un service tiers sans votre accord.',
            'Le code, les prompts et les intégrations sont à votre nom.',
          ],
          en: [
            'Anything that commits you (contracts, legal letters) always goes through human approval.',
            'Documents stay under control: models hosted in France, on our servers or yours.',
            'Nothing is sent to a third party without your consent.',
            'The code, prompts and integrations are yours.',
          ],
        },
      },
      aiMethod(
        {
          fr: 'On regarde les documents que vos équipes traitent à la main et ce qu’elles en font ensuite.',
          en: 'We look at the documents your teams handle by hand and what they do with them next.',
        },
        {
          fr: 'Un premier type de document traité automatiquement, sur vos vrais fichiers, pour mesurer la fiabilité et le temps gagné.',
          en: 'A first document type handled automatically, on your real files, to measure reliability and time saved.',
        },
      ),
    ],
    related: ['/ia/automatisation', '/ia/assistant-interne', '/ia/integration-logiciels'],
    bookingSource: 'seo-documents',
    updated: '2026-10-24',
  },
  {
    path: '/ia/integration-logiciels',
    space: 'ai',
    parent: AI_PARENT,
    schema: 'Service',
    meta: {
      fr: {
        title: 'Intégrer l’IA dans votre ERP, votre CRM ou votre logiciel métier | 3geeks',
        description: 'On branche l’IA dans les logiciels que vous utilisez déjà, via leurs API : assistant dans l’outil, champs remplis automatiquement, réponses tirées de vos données. Audit gratuit de 30 min.',
      },
      en: {
        title: 'Integrate AI into your ERP, CRM or business software | 3geeks',
        description: 'We plug AI into the software you already use, through its APIs: an assistant inside the tool, fields filled in automatically, answers drawn from your data. Free 30-min audit.',
      },
    },
    eyebrow: { fr: 'Intégration IA', en: 'AI integration' },
    h1: {
      fr: 'L’IA dans les logiciels que vous utilisez déjà.',
      en: 'AI inside the software you already use.',
    },
    intro: {
      fr: 'Pas de nouvelle plateforme à apprendre : on branche l’IA dans votre ERP, votre CRM, votre back-office ou votre logiciel métier, par leurs API, leurs exports ou leurs bases de données. Vos équipes gardent leurs outils, l’IA travaille dedans.',
      en: 'No new platform to learn: we plug AI into your ERP, CRM, back office or business software, through their APIs, exports or databases. Your teams keep their tools, and the AI works inside them.',
    },
    sections: [
      {
        type: 'points',
        path: { fr: 'Ce qu’on branche', en: 'What we plug in' },
        title: { fr: 'L’IA là où vos équipes travaillent.', en: 'AI where your teams work.' },
        items: {
          fr: [
            { t: 'Un assistant dans l’outil', d: 'Vos équipes posent leurs questions dans le logiciel qu’elles ouvrent déjà, et obtiennent des réponses tirées de vos données.' },
            { t: 'Champs remplis et rédaction', d: 'Fiches, devis, comptes rendus ou réponses pré-remplis par l’IA, que la personne relit et valide.' },
            { t: 'Connexion à l’existant', d: 'API, exports, bases de données : on relie vos outils entre eux pour que l’information ne soit saisie qu’une fois.' },
            { t: 'Un serveur MCP pour vos assistants', d: 'Le standard qui permet à un assistant IA comme Claude de lire et de mettre à jour vos outils, avec des droits que vous fixez.' },
          ],
          en: [
            { t: 'An assistant inside the tool', d: 'Your teams ask their questions in the software they already open, and get answers drawn from your data.' },
            { t: 'Filled fields and drafting', d: 'Records, quotes, reports or replies pre-filled by AI, which the person reviews and approves.' },
            { t: 'Connecting what exists', d: 'APIs, exports, databases: we connect your tools so information is only entered once.' },
            { t: 'An MCP server for your assistants', d: 'The standard that lets an AI assistant such as Claude read and update your tools, with the rights you set.' },
          ],
        },
      },
      {
        type: 'proof',
        path: { fr: 'Déjà en production', en: 'Already live' },
        title: { fr: 'Deux outils qu’on a branchés sur l’IA.', en: 'Two tools we have plugged into AI.' },
        items: [
          {
            name: 'Workspace',
            title: { fr: 'Notre pilotage de projets, avec son serveur MCP', en: 'Our project hub, with its MCP server' },
            d: {
              fr: 'L’IA se connecte à Workspace pendant qu’elle code : elle lit le contexte du projet, crée les tâches et tient le journal. Chaque action est tracée au nom de la personne, et les décisions attendent un humain.',
              en: 'The AI connects to Workspace while it codes: it reads the project context, creates tasks and keeps the log. Every action is logged in the person’s name, and decisions wait for a human.',
            },
          },
          {
            name: 'Prompt Hub',
            title: { fr: 'Un plan de projet branché dans l’éditeur de code', en: 'A project plan plugged into the code editor' },
            d: {
              fr: 'Prompt Hub transforme une idée en plan d’exécution. Son serveur MCP le branche dans l’éditeur : l’IA récupère la prochaine étape, puis rend compte de ce qu’elle a livré.',
              en: 'Prompt Hub turns an idea into an execution plan. Its MCP server plugs it into the editor: the AI fetches the next step, then reports what it shipped.',
            },
            link: 'https://prompt-hub.3geeks.fr/',
          },
        ],
      },
      {
        type: 'checks',
        path: { fr: 'Nos règles', en: 'Our rules' },
        title: { fr: 'On s’adapte à votre système, pas l’inverse.', en: 'We adapt to your system, not the other way round.' },
        items: {
          fr: [
            'Votre ERP, votre CRM et votre site restent en place.',
            'L’IA n’a accès qu’à ce que vous décidez : droits d’accès définis avec vous.',
            'Modèles hébergés en France, sur nos serveurs ou les vôtres, selon la sensibilité des données.',
            'Tout ce qu’on développe est à votre nom : aucune dépendance à 3geeks.',
          ],
          en: [
            'Your ERP, CRM and website stay in place.',
            'The AI only reaches what you decide: access rights set with you.',
            'Models hosted in France, on our servers or yours, depending on how sensitive the data is.',
            'Everything we build is yours: no dependency on 3geeks.',
          ],
        },
      },
      aiMethod(
        {
          fr: 'On fait le tour de vos logiciels et de ce qu’ils permettent de brancher (API, exports, bases).',
          en: 'We go over your software and what it lets us connect (APIs, exports, databases).',
        },
        {
          fr: 'Une première intégration sur un usage précis, dans l’outil de vos équipes, pour mesurer le gain.',
          en: 'A first integration for one precise use, inside your teams’ tool, to measure the gain.',
        },
      ),
    ],
    related: ['/ia/assistant-interne', '/ia/automatisation', '/ia/documents'],
    bookingSource: 'seo-integration',
    updated: '2026-10-24',
  },
  {
    path: '/ia/assistant-interne',
    space: 'ai',
    parent: AI_PARENT,
    schema: 'Service',
    meta: {
      fr: {
        title: 'Assistant IA interne sur les documents de l’entreprise | 3geeks',
        description: 'Un assistant IA qui répond à vos équipes à partir de vos propres documents, avec ses sources, sur des modèles hébergés en France ou sur vos serveurs. Audit gratuit de 30 min.',
      },
      en: {
        title: 'Internal AI assistant on your company documents | 3geeks',
        description: 'An AI assistant that answers your teams from your own documents, with its sources, on models hosted in France or on your servers. Free 30-min audit.',
      },
    },
    eyebrow: { fr: 'Assistant interne', en: 'Internal assistant' },
    h1: {
      fr: 'Un assistant qui connaît vos documents, et qui reste chez vous.',
      en: 'An assistant that knows your documents, and stays in-house.',
    },
    intro: {
      fr: 'Procédures, contrats, fiches produits, historique des projets : vos équipes posent leurs questions et l’assistant répond à partir de vos propres documents, en citant ses sources. Les données restent sous votre contrôle.',
      en: 'Procedures, contracts, product sheets, project history: your teams ask their questions and the assistant answers from your own documents, citing its sources. The data stays under your control.',
    },
    sections: [
      {
        type: 'points',
        path: { fr: 'Ce qu’on met en place', en: 'What we set up' },
        title: { fr: 'Les réponses de l’entreprise, en quelques secondes.', en: 'The company’s answers, in seconds.' },
        items: {
          fr: [
            { t: 'Réponses avec les sources', d: 'Chaque réponse s’appuie sur vos documents et indique d’où elle vient, pour vérifier en un clic.' },
            { t: 'Vos documents, tenus à jour', d: 'L’assistant lit vos dossiers, votre wiki ou votre drive, et suit les nouvelles versions.' },
            { t: 'Droits d’accès', d: 'Chacun ne voit que ce qu’il a le droit de voir, comme dans vos outils actuels.' },
            { t: 'Là où vos équipes sont', d: 'Dans une page interne, dans votre logiciel ou dans votre messagerie d’équipe.' },
          ],
          en: [
            { t: 'Answers with sources', d: 'Every answer relies on your documents and says where it comes from, to check in one click.' },
            { t: 'Your documents, kept current', d: 'The assistant reads your folders, wiki or drive, and follows new versions.' },
            { t: 'Access rights', d: 'Everyone only sees what they are allowed to see, as in your current tools.' },
            { t: 'Where your teams are', d: 'In an internal page, inside your software or in your team chat.' },
          ],
        },
      },
      {
        type: 'proof',
        path: { fr: 'Déjà en production', en: 'Already live' },
        title: { fr: 'Deux assistants qui tournent déjà.', en: 'Two assistants already running.' },
        items: [
          {
            name: 'Assistant 3geeks',
            title: { fr: 'L’assistant de ce site', en: 'This website’s assistant' },
            d: {
              fr: 'Il répond uniquement à partir de notre base de connaissances, avec un modèle français de Mistral AI et un relais sur nos propres serveurs, sans que 3geeks conserve les messages. Posez-lui une question en bas à droite.',
              en: 'It answers only from our knowledge base, with a French Mistral AI model and a relay on our own servers, without 3geeks keeping the messages. Ask it a question at the bottom right.',
            },
          },
          {
            name: 'Workspace',
            title: { fr: 'Chaque dépôt de code résumé par une IA hébergée chez nous', en: 'Every code repository summarised by an AI hosted in-house' },
            d: {
              fr: 'Dans notre outil de pilotage, une IA tournant sur nos propres serveurs lit chaque projet et en tire une synthèse que toute l’équipe peut consulter.',
              en: 'In our project hub, an AI running on our own servers reads each project and writes a summary the whole team can read.',
            },
          },
        ],
      },
      {
        type: 'checks',
        path: { fr: 'Confidentialité', en: 'Confidentiality' },
        title: { fr: 'Vos documents ne servent qu’à vous.', en: 'Your documents only serve you.' },
        items: {
          fr: [
            'Modèles hébergés en France, sur nos serveurs ou sur les vôtres : on choisit avec vous.',
            'Rien n’est envoyé à un service tiers sans votre accord.',
            'L’assistant dit quand il ne sait pas, au lieu d’inventer.',
            'Le code, les prompts et l’index des documents sont à votre nom.',
          ],
          en: [
            'Models hosted in France, on our servers or yours: we choose together.',
            'Nothing is sent to a third party without your consent.',
            'The assistant says when it does not know, instead of making things up.',
            'The code, the prompts and the document index are yours.',
          ],
        },
      },
      aiMethod(
        {
          fr: 'On identifie les questions que vos équipes posent le plus souvent, et les documents qui y répondent.',
          en: 'We identify the questions your teams ask most often, and the documents that answer them.',
        },
        {
          fr: 'Un premier assistant sur un ensemble de documents choisi, testé par vos équipes sur leurs vraies questions.',
          en: 'A first assistant on a chosen set of documents, tested by your teams on their real questions.',
        },
      ),
    ],
    related: ['/ia/integration-logiciels', '/ia/documents', '/ia/agents-ia'],
    bookingSource: 'seo-assistant-interne',
    updated: '2026-10-24',
  },
  {
    path: '/ia/audit-formation',
    space: 'ai',
    parent: AI_PARENT,
    schema: 'Service',
    meta: {
      fr: {
        title: 'Audit IA et formation des équipes en entreprise | 3geeks',
        description: 'On repère les usages de l’IA rentables pour votre entreprise, on fixe les règles sur les données et on forme vos équipes aux bons usages. Audit gratuit de 30 min.',
      },
      en: {
        title: 'AI audit and team training for businesses | 3geeks',
        description: 'We find the AI uses that pay off for your company, set the rules on data and train your teams in good practice. Free 30-min audit.',
      },
    },
    eyebrow: { fr: 'Audit & formation', en: 'Audit & training' },
    h1: {
      fr: 'Savoir où l’IA vous fera gagner du temps, avant d’y investir.',
      en: 'Know where AI will save you time, before you invest in it.',
    },
    intro: {
      fr: 'On commence par regarder vos outils et vos tâches répétitives pour repérer les usages qui rapportent vraiment, et ceux qui n’en valent pas la peine. Puis on fixe les règles sur les données et on forme vos équipes pour qu’elles s’en servent bien.',
      en: 'We start by looking at your tools and repetitive tasks to find the uses that really pay off, and those that are not worth it. Then we set the rules on data and train your teams to use AI well.',
    },
    sections: [
      {
        type: 'points',
        path: { fr: 'Ce qu’on fait', en: 'What we do' },
        title: { fr: 'Du cadrage à l’usage au quotidien.', en: 'From scoping to everyday use.' },
        items: {
          fr: [
            { t: 'Audit des cas d’usage', d: 'La liste des tâches où l’IA fait gagner du temps chez vous, classées par gain et par effort.' },
            { t: 'Règles sur les données', d: 'Ce qui peut passer par une IA, ce qui reste en interne, où sont hébergés les modèles, qui a accès à quoi.' },
            { t: 'Formation des équipes', d: 'Les bons usages et l’écriture de prompts, sur vos propres cas, pour des résultats fiables.' },
            { t: 'Un plan d’action', d: 'Deux ou trois chantiers prioritaires, avec ce qu’ils coûtent et ce qu’ils rapportent, pour décider sereinement.' },
          ],
          en: [
            { t: 'Use-case audit', d: 'The list of tasks where AI saves time in your company, ranked by gain and effort.' },
            { t: 'Rules on data', d: 'What can go through an AI, what stays in-house, where models are hosted, who can access what.' },
            { t: 'Team training', d: 'Good practice and prompt writing, on your own cases, for reliable results.' },
            { t: 'An action plan', d: 'Two or three priority projects, with what they cost and what they bring, to decide with confidence.' },
          ],
        },
      },
      {
        type: 'checks',
        path: { fr: 'Pourquoi nous', en: 'Why us' },
        title: { fr: 'Des ingénieurs IA en direct, pas un intermédiaire.', en: 'AI engineers directly, not a middleman.' },
        items: {
          fr: [
            'Elias et Noam, cofondateurs, travaillent au quotidien sur des projets d’IA générative et de cloud.',
            'Équipe certifiée AWS (Cloud Practitioner, Machine Learning, Cloud Architecting) et formée au prompt engineering.',
            'On vous dit franchement ce qui ne vaut pas la peine d’être automatisé : si un simple script suffit, on fait le script.',
            'L’audit de départ est gratuit, et rien n’est à payer d’avance.',
          ],
          en: [
            'Elias and Noam, co-founders, work on generative AI and cloud projects every day.',
            'AWS-certified team (Cloud Practitioner, Machine Learning, Cloud Architecting) trained in prompt engineering.',
            'We tell you frankly what is not worth automating: if a simple script is enough, we write the script.',
            'The first audit is free, and nothing is paid upfront.',
          ],
        },
      },
      aiMethod(
        {
          fr: 'Un premier échange pour comprendre votre activité, vos outils et ce qui prend du temps à vos équipes.',
          en: 'A first call to understand your business, your tools and what takes your teams time.',
        },
        {
          fr: 'Le premier chantier du plan, réalisé sur vos vraies données, pour vérifier le gain annoncé.',
          en: 'The plan’s first project, built on your real data, to check the expected gain.',
        },
      ),
    ],
    related: ['/ia/automatisation', '/ia/agents-ia', '/ia/assistant-interne'],
    bookingSource: 'seo-audit-formation',
    updated: '2026-10-24',
  },
];

export const findContentPage = (path: string) => CONTENT_PAGES.find((page) => page.path === path);
