import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Mark } from './Logo';
import Reveal from './Reveal';

import callKitchenImg from '../assets/images/CallKitchen.jpeg';
import divorceImg from '../assets/images/divorce.png';
import vipagenceImg from '../assets/images/vipagence.jpg';
import greenJardinImg from '../assets/images/green-jardin.png';
import promptHubImg from '../assets/images/prompt-hub.png';
import promptOptimImg from '../assets/images/prompt-optim.png';

interface ProjectsShowcaseProps {
  lang: 'en' | 'fr';
  onContact?: () => void;
}

export interface ProjectItem {
  id: string;
  category: 'client' | 'studio';
  title: string;
  subtitle: string;
  badge: string;
  description: { fr: string; en: string };
  highlights: { fr: string[]; en: string[] };
  tags: string[];
  link?: string;
  btnText: { fr: string; en: string };
  statsBadge?: string;
  image?: string;
  imageFit?: 'cover' | 'contain';
  imageBg?: 'light' | 'dark';
  useStudioMark?: boolean;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'express-divorce',
    category: 'client',
    title: 'Express Divorce USA',
    subtitle: 'expressdivorceusa.co',
    badge: 'Plateforme SaaS · 3geeks',
    description: {
      fr: 'Plateforme web SaaS qui guide les utilisateurs dans des démarches juridiques aux États-Unis avec clarté, sécurité des données et conformité multi-états.',
      en: 'A reassuring web platform that guides users through US legal processes across multiple states with clarity and data security.'
    },
    highlights: {
      fr: ['Conformité US multi-états', 'Parcours client rassurant et sécurisé', 'Projet SaaS réel en production'],
      en: ['Multi-state US compliance', 'Reassuring personal-data security', 'Live SaaS in production']
    },
    tags: ['Next.js', 'Legal tech', 'Multi-state compliance', 'SaaS'],
    link: 'https://www.expressdivorceusa.co',
    btnText: { fr: 'Ouvrir le projet', en: 'Open project' },
    statsBadge: 'Live in prod',
    image: divorceImg
  },
  {
    id: 'vipagence',
    category: 'client',
    title: 'Vipagence',
    subtitle: 'vipagence.net',
    badge: 'Plateforme web · 3geeks',
    description: {
      fr: 'Site vitrine et parcours d’inscription pour une agence qui relie créateurs UGC, clippers et marques. Conçu et développé par 3geeks — le site, pas le casting.',
      en: 'Marketing site and sign-up flows for an agency connecting UGC creators, clippers and brands. Designed and built by 3geeks — the website, not the roster.'
    },
    highlights: {
      fr: ['Vitrine + parcours créateur / clipper', 'Inscriptions distinctes selon le profil', 'Site livré et en ligne'],
      en: ['Landing + creator / clipper journeys', 'Separate sign-up paths by profile', 'Shipped and live']
    },
    tags: ['React', 'Product site', 'Marketplace'],
    link: 'https://www.vipagence.net/',
    btnText: { fr: 'Ouvrir le projet', en: 'Open project' },
    statsBadge: 'Live in prod',
    image: vipagenceImg
  },
  {
    id: 'callkitchen',
    category: 'client',
    title: 'CallKitchen',
    subtitle: 'call-kitchen-landing.vercel.app',
    badge: 'Automatisation restauration · 3geeks',
    description: {
      fr: 'Landing page et réception téléphonique IA 24/7 pour restaurants : prise de commandes, réservations, FAQ menus, notifications SMS et tableau de bord cuisine.',
      en: 'A practical landing page for an AI phone assistant that helps restaurants capture missed calls, take reservations, and notify the kitchen 24/7.'
    },
    highlights: {
      fr: ['Réception IA 24/7 (commandes & résas)', 'Démo interactive & tarifs transparents', 'Landing page GTM performante'],
      en: ['24/7 AI reception (orders & bookings)', 'Interactive demo & pricing', 'Shipped GTM landing']
    },
    tags: ['AI Voice Agent', 'SaaS Landing', 'Restauration'],
    link: 'https://call-kitchen-landing.vercel.app',
    btnText: { fr: 'Ouvrir le projet', en: 'Open project' },
    statsBadge: '24/7 AI Voice',
    image: callKitchenImg
  },
  {
    id: 'two-app',
    category: 'client',
    title: 'Two',
    subtitle: 'App Store iOS',
    badge: 'Application iOS · 3geeks',
    description: {
      fr: 'Application mobile grand public disponible sur l\'App Store : espace tout-en-un pour couples (suivi de distance, partage d\'humeur, mur de mots doux, coffre fort partagé et calendrier).',
      en: 'All-in-one iOS cocoon for couples live on the App Store: distance tracking, mood sharing, sweet-notes wall, photo map, and shared vault.'
    },
    highlights: {
      fr: ['Espace privé sécurisé sans pub', 'Application publique sur l\'App Store', 'Pensée pour un usage quotidien'],
      en: ['Privacy-first couple space', 'Live product on App Store', 'Built for daily recurring use']
    },
    tags: ['iOS', 'Swift', 'Consumer App', 'App Store'],
    link: 'https://apps.apple.com/fr/app/two/id6758867716',
    btnText: { fr: 'App Store', en: 'Open on App Store' },
    statsBadge: 'App Store Live',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/8a/87/0f/8a870f74-5c66-359c-2901-e2fd674575f7/Placeholder.mill/400x400bb-75.webp'
  },
  {
    id: 'green-jardin',
    category: 'client',
    title: 'Green Jardin',
    subtitle: 'green-jardin.fr',
    badge: 'Retail omnicanal · 3geeks',
    description: {
      fr: 'Boutique CBD en ligne et en magasin (Palaiseau) : vitrine Shopify avec Ino Digital, menu TV dynamique en temps réel, caisse POS avec balance et fidélité 14%.',
      en: 'Live CBD shop online and in-store (Palaiseau): Shopify storefront with Ino Digital, real-time TV menu, gram-scale POS, and loyalty sync.'
    },
    highlights: {
      fr: ['3 canaux synchronisés en temps réel', 'Menu TV dynamique & caisse POS', 'Commerce physique + e-commerce'],
      en: ['3 channels synced live', 'Shopify + POS + TV menu', 'Omnichannel retail']
    },
    tags: ['Shopify', 'GraphQL', 'Firebase', 'POS'],
    link: 'https://green-jardin.fr',
    btnText: { fr: 'Voir le projet', en: 'View project' },
    statsBadge: '3 channels synced',
    image: greenJardinImg,
    imageFit: 'contain',
    imageBg: 'light'
  },
  {
    id: '3geeks-infra',
    category: 'studio',
    title: '3geeks Infra',
    subtitle: 'Production privée',
    badge: 'Infra studio · privée',
    description: {
      fr: 'On héberge et opère nos produits sur une infra studio. Les outils internes restent internes — pas de détail public.',
      en: 'We host and operate our products on studio infrastructure. Internal tools stay internal — no public detail.'
    },
    highlights: {
      fr: ['Hébergement autonome', 'Déploiements maîtrisés', 'Outils internes non détaillés'],
      en: ['Self-hosted production', 'Controlled deployments', 'Internal tools undisclosed']
    },
    tags: ['Hosting', 'CI/CD', 'Private'],
    btnText: { fr: 'Hébergement studio', en: 'Studio hosting' },
    statsBadge: 'Private',
    useStudioMark: true
  },
  {
    id: 'prompt-hub',
    category: 'studio',
    title: 'Prompt Hub',
    subtitle: 'prompt-hub.3geeks.fr',
    badge: 'Planification projet IA · 3geeks beta',
    description: {
      fr: 'Outil beta qui transforme une idée floue en un plan d\'exécution structuré par étapes et prompts contextualisés à utiliser dans votre IDE.',
      en: 'Beta tool that turns a short brief into phased steps and copy-paste prompts, orchestrated by specialized AI agents.'
    },
    highlights: {
      fr: ['Idée → plan d\'exécution en < 1 min', 'Agents IA spécialisés', 'Graphe de dépendances interactif'],
      en: ['Idea → execution plan in < 1 min', 'Specialized AI agents', 'Interactive dependency graph']
    },
    tags: ['Multi-agent', 'AI planning', 'Beta', 'Green IT'],
    link: 'https://prompt-hub.3geeks.fr/',
    btnText: { fr: 'Ouvrir la beta', en: 'Open the beta' },
    statsBadge: 'Beta Live',
    image: promptHubImg,
    imageFit: 'contain'
  },
  {
    id: 'prompt-optim',
    category: 'studio',
    title: 'PromptOptim',
    subtitle: 'prompt-optim.3geeks.fr',
    badge: 'Green IT & Sobriété numérique',
    description: {
      fr: 'Optimiseur de prompts IA qui réduit la consommation de tokens, estime l\'impact CO2 par requête et encourage une utilisation sobre et souveraine de l\'IA.',
      en: 'AI prompt optimization tool designed to reduce token usage, estimate CO2 impact, and encourage sober AI usage.'
    },
    highlights: {
      fr: ['Même intention, moins de tokens', 'Estimation CO2 par requête', 'Modèles européens et RGPD'],
      en: ['Precision over padding', 'CO2 estimation per request', 'European models + GDPR']
    },
    tags: ['Green IT', 'Sobriété IA', 'Open tool', '3geeks'],
    link: 'https://prompt-optim.3geeks.fr/',
    btnText: { fr: 'Ouvrir PromptOptim', en: 'Open PromptOptim' },
    statsBadge: 'Open tool',
    image: promptOptimImg,
    imageFit: 'contain'
  }
];

const ProjectLogo: React.FC<{ project: ProjectItem }> = ({ project }) => {
  if (project.useStudioMark) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink">
        <Mark className="h-7 w-7" />
      </div>
    );
  }
  return (
    <div
      className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 ${
        project.imageBg === 'light' ? 'bg-white p-1' : 'bg-white/[0.06] p-0.5'
      }`}
    >
      <img
        src={project.image}
        alt=""
        loading="lazy"
        className={`h-full w-full rounded-lg ${project.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
      />
    </div>
  );
};

const ProjectCard: React.FC<{ project: ProjectItem; lang: 'en' | 'fr' }> = ({ project, lang }) => {
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
        <ProjectLogo project={project} />
        {project.link && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all group-hover:border-brand-mint/50 group-hover:bg-brand-mint group-hover:text-ink">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-1 text-xs font-medium text-brand-mint/90">{project.badge.replace(' · 3geeks beta', '').replace(' · 3geeks', '')}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description[lang]}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </Wrapper>
  );
};

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ lang, onContact }) => {
  const clientProjects = PROJECTS_DATA.filter((p) => p.category === 'client');
  const labProjects = PROJECTS_DATA.filter((p) => p.category === 'studio');

  return (
    <section id="projets" className="relative border-t border-white/5 bg-surface/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <span className="eyebrow">{lang === 'fr' ? 'Réalisations' : 'Selected work'}</span>
          <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">
            {lang === 'fr' ? 'Des projets réels, déjà en ligne.' : 'Real projects, already live.'}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">
            {lang === 'fr'
              ? 'Sites, plateformes SaaS, assistants IA et applications mobiles conçus, développés et lancés par 3geeks.'
              : 'Websites, SaaS platforms, AI assistants and mobile apps designed, built and launched by 3geeks.'}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {clientProjects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80}>
              <ProjectCard project={project} lang={lang} />
            </Reveal>
          ))}
          {onContact && (
            <Reveal delay={(clientProjects.length % 3) * 80}>
              <button
                type="button"
                onClick={onContact}
                className="group flex h-full min-h-[16rem] w-full flex-col items-start justify-between rounded-[1.25rem] border border-dashed border-brand-mint/30 bg-brand-mint/[0.03] p-6 text-left transition-colors hover:border-brand-mint/60 hover:bg-brand-mint/[0.07]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-ink">
                  <ArrowRight className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold text-white">
                    {lang === 'fr' ? 'Votre projet est le prochain.' : 'Your project is next.'}
                  </span>
                  <span className="mt-2 block text-sm text-slate-400">
                    {lang === 'fr' ? 'Parlons-en : réponse sous 24h.' : "Let's talk: reply within 24h."}
                  </span>
                </span>
              </button>
            </Reveal>
          )}
        </div>

        <Reveal className="mb-6 mt-16 flex items-center gap-4">
          <h3 className="font-display text-lg font-semibold text-white md:text-xl">
            {lang === 'fr' ? 'Le lab 3geeks' : 'The 3geeks lab'}
          </h3>
          <span className="h-px flex-1 bg-white/10" />
          <span className="hidden text-sm text-slate-500 sm:block">
            {lang === 'fr' ? 'Nos propres produits et outils' : 'Our own products and tools'}
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {labProjects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80}>
              <ProjectCard project={project} lang={lang} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
