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

const AI_METHOD: ContentSection = {
  type: 'steps',
  path: { fr: 'Comment ça se passe', en: 'How it goes' },
  title: { fr: 'Un pilote en quelques semaines, pas un projet de six mois.', en: 'A pilot in a few weeks, not a six-month project.' },
  items: {
    fr: [
      { t: 'Audit gratuit · 30 min', d: 'On passe en revue vos outils et les demandes que reçoit votre équipe, pour repérer ce qu’un agent peut prendre en charge.' },
      { t: 'Pilote sur un cas précis', d: 'Un premier agent, branché sur vos vraies données, sur un seul canal : on mesure ce qu’il traite seul et ce qu’il transmet.' },
      { t: 'Intégration & sécurité', d: 'On le relie à vos outils avec des règles claires sur les données : modèles hébergés en France ou sur vos serveurs si besoin.' },
      { t: 'Déploiement & suivi', d: 'Formation de l’équipe, suivi des réponses et améliorations en continu. Vous payez une fois satisfait.' },
    ],
    en: [
      { t: 'Free audit · 30 min', d: 'We go through your tools and the requests your team receives, to spot what an agent can take on.' },
      { t: 'Pilot on one precise case', d: 'A first agent, plugged into your real data, on a single channel: we measure what it handles alone and what it hands over.' },
      { t: 'Integration & security', d: 'We connect it to your tools with clear rules on data: models hosted in France or on your servers if needed.' },
      { t: 'Rollout & follow-up', d: 'Team training, answer monitoring and continuous improvements. You pay once satisfied.' },
    ],
  },
};

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
      AI_METHOD,
    ],
    related: [],
    bookingSource: 'seo-agents-ia',
    updated: '2026-10-24',
  },
];

export const findContentPage = (path: string) => CONTENT_PAGES.find((page) => page.path === path);
