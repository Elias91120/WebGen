import React from 'react';
import { ArrowRight, ArrowUpRight, Check, GraduationCap, Lock, Send } from 'lucide-react';
import { Mark } from './Logo';
import Reveal from './Reveal';

// Small logos (lab cards)
import promptHubImg from '../assets/images/prompt-hub.png';
import promptOptimImg from '../assets/images/prompt-optim.png';

// Covers: above-the-fold captures of the live sites
import jelloulCover from '../assets/images/projects/jellouli.jpg';
import expressDivorceCover from '../assets/images/projects/express-divorce.jpg';
import vipagenceCover from '../assets/images/projects/vipagence.jpg';
import twoCover from '../assets/images/projects/two.jpg';
import aurenzaCover from '../assets/images/projects/aurenza.jpg';
import greenJardinCover from '../assets/images/projects/green-jardin.jpg';
import callKitchenCover from '../assets/images/projects/callkitchen.jpg';

interface ProjectsShowcaseProps {
  lang: 'en' | 'fr';
  onContact?: () => void;
}

type Localized<T> = { fr: T; en: T };

export interface ProjectItem {
  id: string;
  category: 'client' | 'studio';
  title: Localized<string>;
  subtitle: string;
  badge: Localized<string>;
  description: Localized<string>;
  tags: string[];
  /** Private projects have no link and never expose a URL or client name. */
  link?: string;
  cover?: string;
  mockup?: 'esign' | 'telegram';
  /** Lab cards: logo image, studio mark or icon. */
  image?: string;
  icon?: React.ElementType;
  useStudioMark?: boolean;
}

// Display order: strongest work first.
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'jellouli',
    category: 'client',
    title: { fr: 'Cabinet Dr Amel Elloumi Jellouli', en: "Dr Amel Elloumi Jellouli's practice" },
    subtitle: 'amel-jellouli-elloumi.com',
    badge: { fr: 'Santé · Site médical premium', en: 'Healthcare · Premium medical website' },
    description: {
      fr: 'Site d’un cabinet de dermatologie à Tunis : expertises détaillées, cas cliniques documentés, visite vidéo du plateau laser et prise de rendez-vous en un clic, en français et en arabe.',
      en: 'Website for a dermatology practice in Tunis: detailed specialties, documented clinical cases, a video tour of the laser suite and one-click booking, in French and Arabic.'
    },
    tags: ['Bilingue FR / AR', 'Cas cliniques', 'Prise de RDV'],
    link: 'https://www.amel-jellouli-elloumi.com/',
    cover: jelloulCover
  },
  {
    id: 'express-divorce',
    category: 'client',
    title: { fr: 'Express Divorce USA', en: 'Express Divorce USA' },
    subtitle: 'expressdivorceusa.co',
    badge: { fr: 'Juridique · Plateforme SaaS US', en: 'Legal · US SaaS platform' },
    description: {
      fr: 'Plateforme SaaS en production aux États-Unis : un questionnaire guidé génère les formulaires de divorce propres à chaque État, avec sécurité des données et conformité multi-états.',
      en: 'Live SaaS platform in the United States: a guided questionnaire generates state-specific divorce forms, with data security and multi-state compliance.'
    },
    tags: ['Next.js', 'Legal tech', '50 États'],
    link: 'https://www.expressdivorceusa.co',
    cover: expressDivorceCover
  },
  {
    id: 'esign',
    category: 'client',
    title: { fr: 'Signature de contrats multi-parties', en: 'Multi-party contract signing' },
    subtitle: '',
    badge: { fr: 'Juridique · Plateforme privée', en: 'Legal · Private platform' },
    description: {
      fr: 'Plateforme privée pour faire signer des accords aux États-Unis de façon conforme et professionnelle : liens de signature par rôle, suivi des statuts et PDF consolidé mis à jour à chaque signature.',
      en: 'Private platform to get agreements signed in the US in a compliant, professional way: per-role signing links, status tracking and a consolidated PDF updated with every signature.'
    },
    tags: ['E-signature', 'PDF dynamique', 'Dashboard admin'],
    mockup: 'esign'
  },
  {
    id: 'vipagence',
    category: 'client',
    title: { fr: 'Vipagence', en: 'Vipagence' },
    subtitle: 'vipagence.net',
    badge: { fr: 'Marketplace · Plateforme web', en: 'Marketplace · Web platform' },
    description: {
      fr: 'Site vitrine et parcours d’inscription pour une agence qui relie créateurs UGC, clippers et marques. Conçu et développé par 3geeks — le site, pas le casting.',
      en: 'Marketing site and sign-up flows for an agency connecting UGC creators, clippers and brands. Designed and built by 3geeks — the website, not the roster.'
    },
    tags: ['React', 'Product site', 'Marketplace'],
    link: 'https://www.vipagence.net/',
    cover: vipagenceCover
  },
  {
    id: 'two-app',
    category: 'client',
    title: { fr: 'Two', en: 'Two' },
    subtitle: 'App Store · 5,0 ★',
    badge: { fr: 'Mobile · App iOS', en: 'Mobile · iOS app' },
    description: {
      fr: 'L’app des couples, publiée sur l’App Store et notée 5,0 : souvenirs sur une carte, humeur du jour, calendrier partagé et CinéMatch pour choisir un film à deux.',
      en: 'The app for couples, live on the App Store and rated 5.0: memories on a map, daily mood, a shared calendar and CinéMatch to pick a movie together.'
    },
    tags: ['iOS', 'Swift', 'App Store'],
    link: 'https://apps.apple.com/fr/app/two/id6758867716',
    cover: twoCover
  },
  {
    id: 'aurenza',
    category: 'client',
    title: { fr: 'Aurenza Capital', en: 'Aurenza Capital' },
    subtitle: 'mathis-mourot.vercel.app',
    badge: { fr: 'Finance · Conseil patrimonial', en: 'Finance · Wealth advisory' },
    description: {
      fr: 'Vitrine d’un courtier en gestion de patrimoine à Boulogne-Billancourt : direction artistique sobre et haut de gamme, chiffres sourcés (AMF, Banque de France) et prise de contact directe.',
      en: 'Showcase site for a wealth management broker in Boulogne-Billancourt: understated premium art direction, figures sourced from the AMF and Banque de France, and direct contact.'
    },
    tags: ['Direction artistique', 'Finance', 'Vitrine'],
    link: 'https://mathis-mourot.vercel.app/',
    cover: aurenzaCover
  },
  {
    id: 'green-jardin',
    category: 'client',
    title: { fr: 'Green Jardin', en: 'Green Jardin' },
    subtitle: 'green-jardin.fr',
    badge: { fr: 'Retail omnicanal · Shopify', en: 'Omnichannel retail · Shopify' },
    description: {
      fr: 'Boutique CBD en ligne et en magasin (Palaiseau) : vitrine Shopify avec Ino Digital, menu TV dynamique en temps réel, caisse POS avec balance et fidélité 14 %.',
      en: 'CBD shop online and in-store (Palaiseau): Shopify storefront with Ino Digital, real-time TV menu, gram-scale POS and loyalty sync.'
    },
    tags: ['Shopify', 'POS', 'Firebase'],
    link: 'https://green-jardin.fr',
    cover: greenJardinCover
  },
  {
    id: 'telegram',
    category: 'client',
    title: { fr: 'Boutique privée sur Telegram', en: 'Private shop on Telegram' },
    subtitle: '',
    badge: { fr: 'Commerce · Mini-app Telegram', en: 'Commerce · Telegram mini-app' },
    description: {
      fr: 'Une mini-app de commande intégrée à Telegram, avec accès vérifié côté serveur, et un espace gérant installable sur iPhone pour suivre les commandes et modérer les membres en temps réel.',
      en: 'An ordering mini-app built into Telegram with server-side verified access, plus a manager space installable on iPhone to follow orders and moderate members in real time.'
    },
    tags: ['Telegram Mini App', 'PWA', 'Docker'],
    mockup: 'telegram'
  },
  {
    id: 'callkitchen',
    category: 'client',
    title: { fr: 'CallKitchen', en: 'CallKitchen' },
    subtitle: 'call-kitchen-landing.vercel.app',
    badge: { fr: 'Restauration · IA vocale', en: 'Restaurants · Voice AI' },
    description: {
      fr: 'Landing page et réception téléphonique IA 24/7 pour restaurants : prise de commandes, réservations, FAQ menus, notifications SMS et tableau de bord cuisine.',
      en: 'Landing page for a 24/7 AI phone reception for restaurants: orders, bookings, menu FAQ, SMS notifications and a kitchen dashboard.'
    },
    tags: ['AI Voice Agent', 'SaaS Landing', 'Restauration'],
    link: 'https://call-kitchen-landing.vercel.app',
    cover: callKitchenCover
  },
  {
    id: '3geeks-infra',
    category: 'studio',
    title: { fr: '3geeks Infra', en: '3geeks Infra' },
    subtitle: 'Production privée',
    badge: { fr: 'Infra studio · privée', en: 'Studio infra · private' },
    description: {
      fr: 'On héberge et opère nos produits sur une infra studio. Les outils internes restent internes — pas de détail public.',
      en: 'We host and operate our products on studio infrastructure. Internal tools stay internal — no public detail.'
    },
    tags: ['Hosting', 'CI/CD', 'Private'],
    useStudioMark: true
  },
  {
    id: 'prompt-hub',
    category: 'studio',
    title: { fr: 'Prompt Hub', en: 'Prompt Hub' },
    subtitle: 'prompt-hub.3geeks.fr',
    badge: { fr: 'Planification projet IA · beta', en: 'AI project planning · beta' },
    description: {
      fr: 'Outil beta qui transforme une idée floue en un plan d’exécution structuré par étapes et prompts contextualisés à utiliser dans votre IDE.',
      en: 'Beta tool that turns a short brief into phased steps and copy-paste prompts, orchestrated by specialized AI agents.'
    },
    tags: ['Multi-agent', 'AI planning', 'Beta'],
    link: 'https://prompt-hub.3geeks.fr/',
    image: promptHubImg
  },
  {
    id: 'prompt-optim',
    category: 'studio',
    title: { fr: 'PromptOptim', en: 'PromptOptim' },
    subtitle: 'prompt-optim.3geeks.fr',
    badge: { fr: 'Green IT & sobriété numérique', en: 'Green IT & digital sobriety' },
    description: {
      fr: 'Optimiseur de prompts IA qui réduit la consommation de tokens, estime l’impact CO2 par requête et encourage une utilisation sobre et souveraine de l’IA.',
      en: 'AI prompt optimization tool designed to reduce token usage, estimate CO2 impact and encourage sober AI usage.'
    },
    tags: ['Green IT', 'Sobriété IA', 'Open tool'],
    link: 'https://prompt-optim.3geeks.fr/',
    image: promptOptimImg
  },
  {
    id: 'efrei-skill-hub',
    category: 'studio',
    title: { fr: 'EFREI Skill Hub', en: 'EFREI Skill Hub' },
    subtitle: 'efrei-skill-hub.vercel.app',
    badge: { fr: 'Éducation & IA · open source', en: 'Education & AI · open source' },
    description: {
      fr: 'Conçu pour une promo d’ingénieurs qui préparait un partiel de Python sur table : fiches de cours, exercices générés par IA à l’infini, détecteur de pièges et simulateur d’examen noté sur 20.',
      en: 'Built for an engineering class preparing a pen-and-paper Python exam: course sheets, endless AI-generated exercises, a trap detector and an exam simulator graded out of 20.'
    },
    tags: ['IA générative', 'WebAssembly', 'Open source'],
    link: 'https://efrei-skill-hub.vercel.app/',
    icon: GraduationCap
  }
];

// Illustrations for private projects: no real data or screenshots ever leave the client.
const EsignMockup: React.FC = () => (
  <div className="absolute inset-0 flex gap-[4%] bg-ink bg-[radial-gradient(circle_at_20%_15%,rgba(10,239,187,0.18),transparent_55%),radial-gradient(circle_at_85%_90%,rgba(195,251,5,0.12),transparent_50%)] p-[6%]" aria-hidden="true">
    <div className="flex flex-1 flex-col rounded-lg bg-slate-50 p-[6%] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <div className="h-2 w-1/2 rounded-sm bg-slate-800/80" />
      <div className="mt-[8%] space-y-1.5">
        {[100, 94, 98, 72, 100, 86].map((w, i) => (
          <div key={i} className="h-1 rounded-full bg-slate-300" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-auto grid grid-cols-2 gap-[10%]">
        {[true, false].map((signed, i) => (
          <div key={i}>
            <div className="flex h-6 items-end md:h-7">
              {signed && (
                <svg viewBox="0 0 120 40" className="h-full w-auto text-slate-800">
                  <path d="M4 30c10-18 18-22 22-12s-6 16 2 8 14-20 20-14-4 18 4 12 12-10 18-8 10 6 20 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="h-px bg-slate-400" />
            <div className="mt-1 h-1 w-2/3 rounded-full bg-slate-300" />
          </div>
        ))}
      </div>
    </div>
    <div className="flex w-[40%] flex-col gap-[6%] rounded-lg border border-white/10 bg-white/[0.04] p-[5%]">
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-1/2 rounded-full bg-white/40" />
        <span className="text-[10px] font-semibold text-brand-mint">4/6</span>
      </div>
      <div className="h-1 rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-brand-gradient" />
      </div>
      {[true, true, false, true, true, false].map((signed, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-white/15 md:h-4 md:w-4" />
          <div className="h-1 flex-1 rounded-full bg-white/25" />
          <span className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full ${signed ? 'bg-brand-mint' : 'bg-white/25'}`}>
            {signed && <Check className="h-2 w-2 text-ink" strokeWidth={4} />}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const TelegramMockup: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center gap-[5%] bg-ink bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(circle_at_90%_85%,rgba(195,251,5,0.12),transparent_50%)] px-[6%]" aria-hidden="true">
    <div className="flex aspect-[9/19] h-[86%] flex-col gap-[4%] rounded-[1.2rem] border-[3px] border-white/15 bg-surface-2 p-[5%] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.9)]">
      <div className="mx-auto h-1 w-1/3 rounded-full bg-white/20" />
      <div className="flex items-center gap-1.5">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500">
          <Send className="h-2 w-2 text-white" />
        </span>
        <div className="h-1 w-1/2 rounded-full bg-white/40" />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-[6%]">
        {['from-brand-mint/50', 'from-brand-lime/45', 'from-sky-400/45', 'from-brand-mint/30'].map((tint) => (
          <div key={tint} className="flex flex-col gap-1">
            <div className={`flex-1 rounded-md bg-gradient-to-br ${tint} to-white/5`} />
            <div className="h-1 w-4/5 rounded-full bg-white/25" />
          </div>
        ))}
      </div>
      <div className="flex h-[8%] items-center justify-center rounded-md bg-sky-500">
        <div className="h-1 w-1/3 rounded-full bg-white/80" />
      </div>
    </div>
    <div className="flex h-[70%] w-[48%] flex-col gap-[7%] rounded-lg border border-white/10 bg-white/[0.04] p-[4%]">
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-1/3 rounded-full bg-white/40" />
        <span className="h-2 w-2 rounded-full bg-brand-lime shadow-[0_0_8px_rgba(195,251,5,0.8)]" />
      </div>
      <div className="grid grid-cols-3 gap-[5%]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md border border-white/10 bg-white/[0.04] p-[12%]">
            <div className="h-2.5 w-2/3 rounded-sm bg-white/50" />
            <div className="mt-1 h-1 w-full rounded-full bg-white/15" />
          </div>
        ))}
      </div>
      {['bg-brand-mint', 'bg-brand-lime', 'bg-sky-400', 'bg-brand-mint'].map((dot, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <div className="h-1 flex-1 rounded-full bg-white/20" />
          <div className="h-1 w-1/5 rounded-full bg-white/30" />
        </div>
      ))}
    </div>
  </div>
);

const ClientCard: React.FC<{ project: ProjectItem; lang: 'en' | 'fr' }> = ({ project, lang }) => {
  const fr = lang === 'fr';
  const Wrapper: React.ElementType = project.link ? 'a' : 'div';
  const wrapperProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:bg-surface-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.07] bg-ink">
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title[lang]}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : project.mockup === 'esign' ? (
          <EsignMockup />
        ) : (
          <TelegramMockup />
        )}
        {project.link ? (
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-ink/70 text-slate-200 backdrop-blur transition-all group-hover:border-brand-mint/50 group-hover:bg-brand-mint group-hover:text-ink">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        ) : (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur">
            <Lock className="h-3 w-3" /> {fr ? 'Confidentiel' : 'Confidential'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium text-brand-mint/90">{project.badge[lang]}</p>
        <h3 className="mt-1.5 font-display text-xl font-semibold text-white">{project.title[lang]}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description[lang]}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 border-t border-white/[0.07] pt-4 text-xs">
          {project.link ? (
            <span className="text-slate-500 transition-colors group-hover:text-slate-300">{project.subtitle}</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Lock className="h-3.5 w-3.5" /> {fr ? 'Projet privé · pas de lien public' : 'Private project · no public link'}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const LabLogo: React.FC<{ project: ProjectItem }> = ({ project }) => {
  if (project.useStudioMark || project.icon) {
    const Icon = project.icon;
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink text-brand-mint">
        {Icon ? <Icon className="h-6 w-6" /> : <Mark className="h-7 w-7" />}
      </div>
    );
  }
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] p-0.5">
      <img src={project.image} alt="" loading="lazy" className="h-full w-full rounded-lg object-contain" />
    </div>
  );
};

const LabCard: React.FC<{ project: ProjectItem; lang: 'en' | 'fr' }> = ({ project, lang }) => {
  const Wrapper: React.ElementType = project.link ? 'a' : 'div';
  const wrapperProps = project.link
    ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="card group flex h-full flex-col p-6 hover:-translate-y-1 hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-4">
        <LabLogo project={project} />
        {project.link && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all group-hover:border-brand-mint/50 group-hover:bg-brand-mint group-hover:text-ink">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-semibold text-white">{project.title[lang]}</h3>
      <p className="mt-1 text-xs font-medium text-brand-mint/90">{project.badge[lang]}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description[lang]}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </Wrapper>
  );
};

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ lang, onContact }) => {
  const fr = lang === 'fr';
  const clientProjects = PROJECTS_DATA.filter((p) => p.category === 'client');
  const labProjects = PROJECTS_DATA.filter((p) => p.category === 'studio');

  return (
    <section id="projets" className="relative border-t border-white/5 bg-surface/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <span className="eyebrow">{fr ? 'Réalisations' : 'Selected work'}</span>
          <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">
            {fr ? 'Ce qu’on a déjà construit.' : "What we've already built."}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">
            {fr
              ? 'Santé, juridique, finance, e-commerce, applications mobiles et plateformes privées : des projets conçus, développés et lancés par 3geeks.'
              : 'Healthcare, legal, finance, e-commerce, mobile apps and private platforms: projects designed, built and launched by 3geeks.'}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {clientProjects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80}>
              <ClientCard project={project} lang={lang} />
            </Reveal>
          ))}
        </div>

        {onContact && (
          <Reveal className="mt-5">
            <div className="card-featured relative flex flex-col gap-6 overflow-hidden p-7 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-2xl">
                <span className="eyebrow">{fr ? 'La suite' : "What's next"}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white md:text-4xl">
                  {fr ? 'Et ce n’est que le début.' : 'And this is just the beginning.'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">
                  {fr
                    ? `${clientProjects.length} réalisations clients et ${labProjects.length} produits maison : chaque projet élargit ce qu’on sait construire. Le prochain peut être le vôtre.`
                    : `${clientProjects.length} client projects and ${labProjects.length} in-house products: every project widens what we can build. The next one could be yours.`}
                </p>
              </div>
              <button type="button" onClick={onContact} className="btn btn-primary shrink-0">
                {fr ? 'Lancer mon projet' : 'Start my project'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        )}

        <Reveal className="mb-6 mt-16 flex items-center gap-4">
          <h3 className="font-display text-lg font-semibold text-white md:text-xl">
            {fr ? 'Le lab 3geeks' : 'The 3geeks lab'}
          </h3>
          <span className="h-px flex-1 bg-white/10" />
          <span className="hidden text-sm text-slate-500 sm:block">
            {fr ? 'Nos propres produits et outils' : 'Our own products and tools'}
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {labProjects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 4) * 80}>
              <LabCard project={project} lang={lang} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
