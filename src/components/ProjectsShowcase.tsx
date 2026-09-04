import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import GradientText from './GradientText';
import { Mark } from './Logo';

import callKitchenImg from '../assets/images/CallKitchen.jpeg';
import divorceImg from '../assets/images/divorce.png';
import vipagenceImg from '../assets/images/vipagence.jpg';
import greenJardinImg from '../assets/images/green-jardin.png';
import promptHubImg from '../assets/images/prompt-hub.png';
import promptOptimImg from '../assets/images/prompt-optim.png';

interface ProjectsShowcaseProps {
  lang: 'en' | 'fr';
}

type FilterCategory = 'all' | 'client' | 'studio';

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

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ lang }) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const clientCount = PROJECTS_DATA.filter((p) => p.category === 'client').length;
  const studioCount = PROJECTS_DATA.filter((p) => p.category === 'studio').length;
  const allCount = PROJECTS_DATA.length;

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <section id="projets" className="py-10 md:py-24 relative bg-[#0d1117]/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-300 mb-3">
            <Layers className="h-3.5 w-3.5" />
            {lang === 'fr' ? 'Réalisations récentes par 3geeks' : 'Recent work by 3geeks'}
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            <GradientText colors={['#ffffff', '#22d3ee', '#a3e635', '#ffffff']} animationSpeed={7}>
              {lang === 'fr' ? 'Des projets réels, déjà en ligne' : 'Real projects, already online'}
            </GradientText>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-400 md:text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            {lang === 'fr'
              ? 'Des applications web, SaaS juridiques, assistants vocaux IA et outils open source conçus, développés et lancés par le studio 3geeks.'
              : 'Public projects showing the kind of web, app and digital experiences we design, build and launch at 3geeks.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 md:mb-12">
          {[
            { id: 'all', labelFr: `Tous les projets (${allCount})`, labelEn: `All projects (${allCount})` },
            { id: 'client', labelFr: `Projets Clients & SaaS (${clientCount})`, labelEn: `Client & SaaS (${clientCount})` },
            { id: 'studio', labelFr: `3Geeks Lab & Infra (${studioCount})`, labelEn: `3Geeks Lab & Infra (${studioCount})` }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as FilterCategory)}
              className={`rounded-full px-4 py-2 text-xs font-mono font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25 scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-400/40'
              }`}
            >
              {lang === 'fr' ? cat.labelFr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="glass-panel rounded-3xl border border-white/10 flex flex-col justify-between overflow-hidden transition-all duration-300 group hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/10"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300/90 truncate max-w-[160px]">
                  {project.subtitle}
                </span>
                {project.statsBadge && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-200">
                    {project.statsBadge}
                  </span>
                )}
              </div>

              {/* Card Main */}
              <div className="p-5 md:p-6 flex-1 flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                    {project.badge}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 mb-3">
                  {project.useStudioMark ? (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-[#0d1117] p-1.5 shadow-md">
                      <Mark className="h-9 w-9" />
                    </div>
                  ) : project.image ? (
                    <div className={`h-12 w-12 shrink-0 rounded-xl border border-white/20 overflow-hidden shadow-md ${project.imageBg === 'light' ? 'bg-white p-1' : 'bg-white/10 p-0.5'}`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className={`h-full w-full rounded-lg ${project.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-bold font-mono text-lg">
                      {project.title.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4 flex-1">
                  {project.description[lang]}
                </p>

                {/* Bullet highlights */}
                <ul className="space-y-1.5 mb-4 text-xs text-slate-200">
                  {project.highlights[lang].map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-lime-300 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link Action */}
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400 hover:text-slate-950 text-xs font-bold text-cyan-200 transition-all duration-200 group/btn"
                  >
                    <span>{project.btnText[lang]}</span>
                    <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300">
                    <span>{project.btnText[lang]}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
