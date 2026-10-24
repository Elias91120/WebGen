import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, GraduationCap, Lock, Send, X } from 'lucide-react';
import BeforeAfter from './BeforeAfter/BeforeAfter';
import { Mark } from './Logo';
import Reveal from './Reveal';

// Our video game (featured lab card), from the /17-octobre page
const GAME_COVER = '/images/17-octobre/manif-lyon-640.webp';
const GAME_COVER_LARGE = '/images/17-octobre/manif-lyon.webp';
// The 3Geeks Studio logo: shown wherever 3geeks' games are (Elias, 21/10/2026)
const STUDIO_LOGO = '/images/3geeks-studio.svg';

// Small logos (lab cards)
import promptHubImg from '../assets/images/prompt-hub.png';

// Covers: above-the-fold captures of the live sites
import jelloulCover from '../assets/images/projects/jellouli.jpg';
import expressDivorceCover from '../assets/images/projects/express-divorce.jpg';
import twoCover from '../assets/images/projects/two.jpg';
import aurenzaCover from '../assets/images/projects/aurenza.jpg';
import callKitchenCover from '../assets/images/projects/callkitchen.jpg';
import sonorStudioCover from '../assets/images/projects/sonorstudio.jpg';

// Phone captures for the case studies
import jelloulMobile from '../assets/images/projects/jellouli-mobile.jpg';
import expressDivorceMobile from '../assets/images/projects/express-divorce-mobile.jpg';
import twoMobile from '../assets/images/projects/two-mobile.jpg';

interface ProjectsShowcaseProps {
  lang: 'en' | 'fr';
  onContact?: () => void;
  /** On /realisations the page intro (h1) replaces the section heading. */
  showIntro?: boolean;
}

type Localized<T> = { fr: T; en: T };

export interface ProjectItem {
  id: string;
  category: 'client' | 'studio';
  title: Localized<string>;
  /** Small line under the cover: a domain, or a localized label. */
  subtitle: string | Localized<string>;
  badge: Localized<string>;
  description: Localized<string>;
  tags: Localized<string[]>;
  /** Private projects have no link and never expose a URL or client name. */
  link?: string;
  cover?: string;
  mockup?: 'esign';
  /** Lab cards: logo image, studio mark or icon. */
  image?: string;
  icon?: React.ElementType;
  useStudioMark?: boolean;
  /** Public in-house product with a cover and a link: shown wide, like the game. */
  wide?: { cta: Localized<string> };
  /** In-house product we sell to companies: shown wide, with figures measured on our own use. */
  featured?: {
    metrics: Localized<{ value: string; label: string }[]>;
    points: Localized<string[]>;
  };
  /** Flagship public projects get a short case study (context, what we shipped, result). */
  /** Its full case-study page (src/content/pages.ts), when it has one. */
  page?: string;
  caseStudy?: {
    mobile: string;
    context: Localized<string>;
    delivered: Localized<string[]>;
    result: Localized<string>;
  };
}

// Display order: strongest work first.
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'jellouli',
    page: '/realisations/cabinet-dermatologie-tunis',
    category: 'client',
    title: { fr: 'Cabinet Dr Amel Elloumi Jellouli', en: "Dr Amel Elloumi Jellouli's practice" },
    subtitle: 'amel-jellouli-elloumi.com',
    badge: { fr: 'Santé · Site médical premium', en: 'Healthcare · Premium medical website' },
    description: {
      fr: 'Site d’un cabinet de dermatologie à Tunis : soins détaillés, résultats cliniques repris automatiquement de la page Facebook du cabinet, avis Google et prise de rendez-vous en un clic, en français et en arabe.',
      en: 'Website for a dermatology practice in Tunis: detailed treatments, clinical results pulled automatically from the practice’s Facebook page, Google reviews and one-click booking, in French and Arabic.'
    },
    tags: { fr: ['Bilingue FR / AR','Synchro Facebook','Prise de RDV'], en: ['Bilingual FR / AR','Facebook sync','Online booking'] },
    link: 'https://www.amel-jellouli-elloumi.com/',
    cover: jelloulCover,
    caseStudy: {
      mobile: jelloulMobile,
      context: {
        fr: 'Le Dr Amel Elloumi Jellouli, ancien médecin principal des hôpitaux, exerce à la Clinique Les Jasmins à Tunis. Ses patients, francophones comme arabophones, veulent être rassurés avant de prendre rendez-vous : le site devait refléter son exigence médicale.',
        en: 'Dr Amel Elloumi Jellouli, a former senior hospital physician, practises at Clinique Les Jasmins in Tunis. Her French- and Arabic-speaking patients want reassurance before booking: the site had to reflect her medical standards.'
      },
      delivered: {
        fr: ['Site bilingue français / arabe', 'Pôles d’expertise détaillés : dermatologie, lasers, esthétique, chirurgie', 'Résultats cliniques repris de la page Facebook du cabinet toutes les 5 minutes, classés par thème', 'Avis Google, carte et bouton WhatsApp toujours à portée de main', 'Rendez-vous en un clic : appel, WhatsApp, e-mail, itinéraire'],
        en: ['Bilingual French / Arabic website', 'Detailed specialties: dermatology, lasers, aesthetics, surgery', 'Clinical results pulled from the practice’s Facebook page every 5 minutes, sorted by theme', 'Google reviews, map and an always-visible WhatsApp button', 'One-tap booking: call, WhatsApp, email, directions']
      },
      result: {
        fr: 'Un site à la hauteur du parcours du Dr Jellouli, pensé d’abord pour le mobile, et qui se tient à jour tout seul : le cabinet publie sur Facebook comme d’habitude, le site suit.',
        en: "A site that matches Dr Jellouli's background, designed mobile-first, and that keeps itself up to date: the practice posts on Facebook as usual, and the site follows."
      }
    }
  },
  {
    id: 'express-divorce',
    page: '/realisations/express-divorce-usa',
    category: 'client',
    title: { fr: 'Express Divorce USA', en: 'Express Divorce USA' },
    subtitle: 'expressdivorceusa.co',
    badge: { fr: 'Juridique · Plateforme SaaS US', en: 'Legal · US SaaS platform' },
    description: {
      fr: 'Plateforme SaaS en production aux États-Unis : un questionnaire guidé génère les formulaires de divorce propres à chaque État, avec sécurité des données et conformité multi-états.',
      en: 'Live SaaS platform in the United States: a guided questionnaire generates state-specific divorce forms, with data security and multi-state compliance.'
    },
    tags: { fr: ['Next.js','Legal tech','50 États'], en: ['Next.js','Legal tech','50 states'] },
    link: 'https://www.expressdivorceusa.co',
    cover: expressDivorceCover,
    caseStudy: {
      mobile: expressDivorceMobile,
      context: {
        fr: 'Express Divorce USA simplifie le divorce à l’amiable aux États-Unis. La difficulté : chaque État a ses propres formulaires, et le sujet est sensible pour les utilisateurs.',
        en: 'Express Divorce USA makes uncontested divorce simpler in the United States. The challenge: every state has its own forms, and the topic is sensitive for users.'
      },
      delivered: {
        fr: ['Questionnaire guidé qui vérifie l’éligibilité', 'Génération des formulaires propres à chaque État', 'Parcours disponible dans les 50 États', 'Tarif affiché dès l’accueil, à partir de 299 $', 'Un ton et un design rassurants sur un sujet difficile'],
        en: ['Guided questionnaire that checks eligibility', 'State-specific forms generated automatically', 'Available in all 50 states', 'Price shown upfront, starting at $299', 'Reassuring tone and design on a difficult topic']
      },
      result: {
        fr: 'Plateforme en production aux États-Unis, avec plus de 500 familles accompagnées selon les chiffres affichés par le client.',
        en: 'Live platform in the United States, with 500+ families helped according to the figures the client displays.'
      }
    }
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
    tags: { fr: ['E-signature','PDF dynamique','Dashboard admin'], en: ['E-signature','Dynamic PDF','Admin dashboard'] },
    mockup: 'esign'
  },
  {
    id: 'two-app',
    page: '/realisations/two-app-ios',
    category: 'client',
    title: { fr: 'Two', en: 'Two' },
    subtitle: { fr: 'App Store · 5,0 ★', en: 'App Store · 5.0 ★' },
    badge: { fr: 'Mobile · App iOS', en: 'Mobile · iOS app' },
    description: {
      fr: 'L’app des couples, publiée sur l’App Store et notée 5,0 : souvenirs sur une carte, humeur du jour, calendrier partagé et CinéMatch pour choisir un film à deux.',
      en: 'The app for couples, live on the App Store and rated 5.0: memories on a map, daily mood, a shared calendar and CinéMatch to pick a movie together.'
    },
    tags: { fr: ['iOS','Swift','App Store'], en: ['iOS','Swift','App Store'] },
    link: 'https://apps.apple.com/fr/app/two/id6758867716',
    cover: twoCover,
    caseStudy: {
      mobile: twoMobile,
      context: {
        fr: 'Two est une app pour les couples : un espace privé pour partager le quotidien, les souvenirs et les projets à deux.',
        en: 'Two is an app for couples: a private space to share everyday life, memories and plans together.'
      },
      delivered: {
        fr: ['App iOS native publiée sur l’App Store', 'Carte des souvenirs partagés', 'Humeur du jour et compteur de jours ensemble', 'Calendrier commun pour planifier', 'CinéMatch : trouver un film qui plaît aux deux'],
        en: ['Native iOS app live on the App Store', 'Shared memory map', 'Daily mood and days-together counter', 'Shared calendar to plan ahead', 'CinéMatch: find a movie you both like']
      },
      result: {
        fr: 'Application publique sur l’App Store, notée 5,0 par ses utilisateurs.',
        en: 'Public app on the App Store, rated 5.0 by its users.'
      }
    }
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
    tags: { fr: ['Direction artistique','Finance','Vitrine'], en: ['Art direction','Finance','Showcase site'] },
    link: 'https://mathis-mourot.vercel.app/',
    cover: aurenzaCover
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
    tags: { fr: ['Agent vocal IA','Landing SaaS','Restauration'], en: ['AI voice agent','SaaS landing','Restaurants'] },
    link: 'https://call-kitchen-landing.vercel.app',
    cover: callKitchenCover
  },
  {
    id: 'workspace',
    page: '/realisations/workspace',
    category: 'studio',
    title: { fr: 'Workspace', en: 'Workspace' },
    subtitle: { fr: 'En production chez nous · démo sur demande', en: 'In production at 3geeks · demo on request' },
    badge: { fr: 'Pilotage de projets + IA · déployable en entreprise', en: 'Project hub + AI · ready for companies' },
    description: {
      fr: 'Notre propre espace de travail : projets, tâches, documentation et décisions au même endroit. Son serveur MCP laisse l’IA tenir le tableau de bord à jour pendant qu’elle travaille : on voit où en est chaque projet sans rien saisir. On s’en sert tous les jours, et on peut l’installer dans votre entreprise, sur vos serveurs.',
      en: 'Our own workspace: projects, tasks, documentation and decisions in one place. Its MCP server lets the AI keep the dashboard up to date while it works, so everyone sees where each project stands without typing anything. We use it every day, and we can install it in your company, on your servers.'
    },
    tags: { fr: ['Serveur MCP','IA sur nos serveurs','Angular · Next.js · Python'], en: ['MCP server','Self-hosted AI','Angular · Next.js · Python'] },
    featured: {
      // Counted in Workspace on 24/10/2026 (tasks of 17 OCTOBRE, 3Geeks Startup and Workspace alone; tests from its CI).
      metrics: {
        fr: [{ value: '9', label: 'projets suivis' }, { value: '100+', label: 'tâches depuis le 19/10' }, { value: '233', label: 'tests automatiques' }],
        en: [{ value: '9', label: 'projects tracked' }, { value: '100+', label: 'tasks since 19 Oct' }, { value: '233', label: 'automated tests' }],
      },
      points: {
        fr: ['L’IA crée les tâches, les fait avancer et tient le journal de chaque projet', 'Chaque dépôt de code est lu et résumé par une IA hébergée sur nos serveurs', 'Chaque action est tracée au nom de la personne, et les décisions attendent un humain'],
        en: ['The AI creates tasks, moves them forward and keeps each project’s log', 'Every code repository is read and summarised by an AI hosted on our servers', 'Every action is logged in the person’s name, and decisions wait for a human'],
      },
    },
  },
  {
    id: 'sonorstudio',
    page: '/realisations/sonorstudio',
    category: 'studio',
    title: { fr: 'SonorStudio', en: 'SonorStudio' },
    subtitle: 'sonorstudio.vercel.app',
    badge: { fr: 'Musique · studio dans le navigateur · bêta gratuite', en: 'Music · in-browser studio · free beta' },
    description: {
      fr: 'Un studio de production musicale qui s’ouvre dans un onglet : channel rack, piano roll, playlist et mixer, avec les raccourcis des beatmakers. On y dépose un projet .flp et son kit, et le beat rejoue tel quel : tempo, patterns, notes de 808 et mixer. Gratuit, sans compte, rien à installer, et les sons restent sur votre ordinateur.',
      en: 'A music production studio that opens in a browser tab: channel rack, piano roll, playlist and mixer, with the shortcuts beatmakers already use. Drop in a .flp project and its kit, and the beat plays back as is: tempo, patterns, 808 notes and mixer. Free, no account, nothing to install, and your sounds stay on your computer.'
    },
    tags: { fr: ['Web Audio','Import .flp','Gratuit'], en: ['Web Audio','.flp import','Free'] },
    link: 'https://sonorstudio.vercel.app/',
    cover: sonorStudioCover,
    wide: { cta: { fr: 'Essayer la bêta', en: 'Try the beta' } },
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
    tags: { fr: ['Hébergement','CI/CD','Privé'], en: ['Hosting','CI/CD','Private'] },
    useStudioMark: true
  },
  {
    id: 'prompt-hub',
    category: 'studio',
    title: { fr: 'Prompt Hub', en: 'Prompt Hub' },
    subtitle: 'prompt-hub.3geeks.fr',
    badge: { fr: 'Planification projet IA · beta', en: 'AI project planning · beta' },
    description: {
      fr: 'Outil bêta qui transforme une idée floue en plan d’exécution par étapes. Son serveur MCP branche ce plan dans votre IDE : l’IA récupère la prochaine étape, puis rend compte de ce qu’elle a livré.',
      en: 'Beta tool that turns a rough idea into a step-by-step execution plan. Its MCP server plugs the plan into your IDE: the AI fetches the next step, then reports what it shipped.'
    },
    tags: { fr: ['Multi-agent','Serveur MCP','Bêta'], en: ['Multi-agent','MCP server','Beta'] },
    link: 'https://prompt-hub.3geeks.fr/',
    image: promptHubImg
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
    tags: { fr: ['IA générative','WebAssembly','Open source'], en: ['Generative AI','WebAssembly','Open source'] },
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

// Workspace is private: a sketch of its board (columns of tasks, and the AI's log on the side), never a real capture.
const WorkspaceMockup: React.FC = () => (
  <div className="absolute inset-0 flex items-center gap-[3%] bg-ink bg-[radial-gradient(circle_at_15%_20%,rgba(10,239,187,0.16),transparent_55%),radial-gradient(circle_at_90%_90%,rgba(195,251,5,0.12),transparent_50%)] p-[5%]" aria-hidden="true">
    {[3, 2, 4].map((cards, col) => (
      <div key={col} className="flex flex-1 flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-[3%]">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${['bg-slate-400', 'bg-brand-lime', 'bg-brand-mint'][col]}`} />
          <div className="h-1 w-1/2 rounded-full bg-white/35" />
        </div>
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="rounded-md border border-white/10 bg-surface-2 p-[8%]">
            <div className="h-1 w-4/5 rounded-full bg-white/45" />
            <div className="mt-1.5 h-1 w-1/2 rounded-full bg-white/15" />
          </div>
        ))}
      </div>
    ))}
    <div className="flex w-[30%] flex-col gap-2.5 rounded-lg border border-brand-mint/25 bg-brand-mint/[0.05] p-[3%]">
      <div className="flex items-center gap-1.5">
        <span className="rounded-sm bg-brand-mint px-1 text-[8px] font-bold leading-tight text-ink">MCP</span>
        <div className="h-1 w-1/2 rounded-full bg-white/35" />
      </div>
      {[90, 70, 85, 60, 75, 80].map((w, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Check className="h-2.5 w-2.5 shrink-0 text-brand-mint" strokeWidth={3} />
          <div className="h-1 rounded-full bg-white/20" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  </div>
);

/** A public in-house product (SonorStudio): wide card with its cover, opening the live product. */
const WideProductCard: React.FC<{ project: ProjectItem; lang: 'en' | 'fr' }> = ({ project, lang }) => (
  <article
    id={project.id}
    className="card group grid scroll-mt-24 overflow-hidden hover:bg-surface-2 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
  >
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-[16/10] overflow-hidden border-b border-white/[0.07] bg-ink md:aspect-auto md:border-b-0 md:border-r"
      aria-label={project.title[lang]}
    >
      <img
        src={project.cover}
        alt={project.title[lang]}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur">
        {lang === 'fr' ? 'En ligne · gratuit' : 'Live · free'}
      </span>
    </a>
    <div className="flex flex-col p-6 md:p-8">
      <p className="text-xs font-medium text-brand-mint/90">{project.badge[lang]}</p>
      <h3 className="mt-1.5 font-display text-2xl font-semibold text-white">{project.title[lang]}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description[lang]}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags[lang].map((tag) => (
          <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand-mint transition-colors hover:text-white">
          {project.wide!.cta[lang]} <ArrowUpRight className="h-4 w-4" />
        </a>
        {project.page && (
          <a href={project.page} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
            {lang === 'fr' ? 'Étude de cas' : 'Case study'} <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  </article>
);

/** An in-house product we sell to companies: wide card, with what it does and the figures from our own use. */
const FeaturedProductCard: React.FC<{ project: ProjectItem; lang: 'en' | 'fr'; onContact?: () => void }> = ({ project, lang, onContact }) => {
  const fr = lang === 'fr';
  const featured = project.featured!;
  return (
    <article id={project.id} className="card grid scroll-mt-24 overflow-hidden lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.07] bg-ink lg:aspect-auto lg:border-b-0 lg:border-r">
        <WorkspaceMockup />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur">
          {fr ? 'Fait et utilisé chez nous' : 'Built and used in-house'}
        </span>
      </div>
      <div className="flex flex-col p-6 md:p-8">
        <p className="text-xs font-medium text-brand-mint/90">{project.badge[lang]}</p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold text-white md:text-3xl">{project.title[lang]}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{project.description[lang]}</p>

        <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {featured.metrics[lang].map((m) => (
            <div key={m.label} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 sm:p-3">
              <dt className="sr-only">{m.label}</dt>
              <dd className="font-display text-2xl font-semibold text-white">{m.value}</dd>
              <dd className="mt-1 break-words text-[10px] leading-snug text-slate-400 sm:text-[11px]">{m.label}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-6 space-y-2.5">
          {featured.points[lang].map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/[0.07] pt-5">
          {onContact && (
            <button type="button" data-booking="workspace" onClick={onContact} className="btn btn-primary">
              {fr ? 'Le voir en démo' : 'See a demo'} <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {project.page && (
            <a href={project.page} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand-mint transition-colors hover:text-white">
              {fr ? 'Étude de cas' : 'Case study'} <ArrowRight className="h-4 w-4" />
            </a>
          )}
          <span className="text-xs text-slate-400">{typeof project.subtitle === 'string' ? project.subtitle : project.subtitle[lang]}</span>
        </div>
      </div>
    </article>
  );
};

const ClientCard: React.FC<{ project: ProjectItem; lang: 'en' | 'fr'; onOpenCase: (project: ProjectItem) => void }> = ({
  project,
  lang,
  onOpenCase,
}) => {
  const fr = lang === 'fr';
  const visual = project.cover ? (
    <img
      src={project.cover}
      alt={project.title[lang]}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  ) : (
    <EsignMockup />
  );
  const coverClass = 'relative block aspect-[16/10] w-full overflow-hidden border-b border-white/[0.07] bg-ink text-left';

  return (
    <article id={project.id} className="card group flex h-full scroll-mt-24 flex-col overflow-hidden hover:-translate-y-1 hover:bg-surface-2">
      {project.caseStudy ? (
        <button type="button" onClick={() => onOpenCase(project)} className={coverClass} aria-label={`${fr ? 'Étude de cas' : 'Case study'} : ${project.title[lang]}`}>
          {visual}
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/75 px-3 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {fr ? 'Voir l’étude de cas' : 'View case study'} <ArrowRight className="h-3 w-3" />
          </span>
        </button>
      ) : project.link ? (
        <a href={project.link} target="_blank" rel="noopener noreferrer" className={coverClass} aria-label={project.title[lang]}>
          {visual}
        </a>
      ) : (
        <div className={coverClass}>
          {visual}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur">
            <Lock className="h-3 w-3" /> {fr ? 'Confidentiel' : 'Confidential'}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium text-brand-mint/90">{project.badge[lang]}</p>
        <h3 className="mt-1.5 font-display text-xl font-semibold text-white">{project.title[lang]}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description[lang]}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags[lang].map((tag) => (
            <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4 text-xs">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="-my-2 inline-flex min-h-10 min-w-0 items-center gap-1 text-slate-400 transition-colors hover:text-white">
              <span className="truncate">{typeof project.subtitle === 'string' ? project.subtitle : project.subtitle[lang]}</span> <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Lock className="h-3.5 w-3.5" /> {fr ? 'Projet privé · pas de lien public' : 'Private project · no public link'}
            </span>
          )}
          {project.page ? (
            <a href={project.page} className="-my-2 inline-flex min-h-10 shrink-0 items-center gap-1 font-semibold text-brand-mint transition-colors hover:text-white">
              {fr ? 'Étude de cas' : 'Case study'} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : project.caseStudy && (
            <button type="button" onClick={() => onOpenCase(project)} className="-my-2 inline-flex min-h-10 shrink-0 items-center gap-1 font-semibold text-brand-mint transition-colors hover:text-white">
              {fr ? 'Étude de cas' : 'Case study'} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const CaseStudyModal: React.FC<{ project: ProjectItem; lang: 'en' | 'fr'; onClose: () => void; onContact?: () => void }> = ({
  project,
  lang,
  onClose,
  onContact,
}) => {
  const fr = lang === 'fr';
  const study = project.caseStudy!;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div
        className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-white/10 bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zero-height sticky bar: keeps the close button visible while the sheet scrolls. */}
        <div className="sticky top-0 z-10 flex h-0 justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mr-4 mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-ink/80 text-slate-200 backdrop-blur transition-colors hover:text-white"
            aria-label={fr ? 'Fermer' : 'Close'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid items-end gap-4 border-b border-white/[0.07] bg-ink p-5 sm:grid-cols-[minmax(0,1fr)_auto] md:p-8">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <img src={project.cover} alt={`${project.title[lang]} — ${fr ? 'version ordinateur' : 'desktop'}`} className="block aspect-[16/10] w-full object-cover object-left-top" />
          </div>
          <div className="mx-auto w-40 overflow-hidden rounded-[1.6rem] border-4 border-white/10 shadow-xl sm:w-44">
            <img src={study.mobile} alt={`${project.title[lang]} — ${fr ? 'version mobile' : 'mobile'}`} className="block aspect-[468/797] w-full object-cover object-top" />
          </div>
        </div>

        <div className="p-6 md:p-10">
          <p className="text-xs font-medium text-brand-mint/90">{project.badge[lang]}</p>
          <h3 id="case-study-title" className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">{project.title[lang]}</h3>

          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{fr ? 'Le contexte' : 'Context'}</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">{study.context[lang]}</p>

              <h4 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{fr ? 'Le résultat' : 'Result'}</h4>
              <p className="mt-3 text-sm leading-relaxed text-white md:text-base">{study.result[lang]}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{fr ? 'Ce qu’on a livré' : 'What we shipped'}</h4>
              <ul className="mt-3 space-y-3">
                {study.delivered[lang].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/15 text-brand-mint">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
            {onContact && (
              <button
                type="button"
                data-booking="case-study"
                onClick={() => {
                  onClose();
                  onContact();
                }}
                className="btn btn-primary"
              >
                {fr ? 'Un projet similaire ? Parlons-en' : 'A similar project? Let’s talk'} <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {project.page && (
              <a href={project.page} className="btn btn-ghost">
                {fr ? 'Lire l’étude de cas complète' : 'Read the full case study'} <ArrowRight className="h-4 w-4" />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                {fr ? 'Voir le projet en ligne' : 'See it live'} <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
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
        {project.tags[lang].map((tag) => (
          <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </Wrapper>
  );
};

/** Project shown in the before/after slider at the top of the section. */
const BEFORE_AFTER_ID = 'jellouli';

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ lang, onContact, showIntro = true }) => {
  const fr = lang === 'fr';
  const [openCase, setOpenCase] = useState<ProjectItem | null>(null);
  const closeCase = useCallback(() => setOpenCase(null), []);
  // The Jellouli site already leads the section in the before/after, so its card goes last in the grid.
  const clientProjects = PROJECTS_DATA.filter((p) => p.category === 'client').sort(
    (a, b) => Number(a.id === BEFORE_AFTER_ID) - Number(b.id === BEFORE_AFTER_ID),
  );
  const labProjects = PROJECTS_DATA.filter((p) => p.category === 'studio');
  const featuredProducts = labProjects.filter((p) => p.featured);
  const wideProducts = labProjects.filter((p) => p.wide);
  const otherProducts = labProjects.filter((p) => !p.featured && !p.wide);

  return (
    <section id="projets" className={`relative border-t border-white/5 bg-surface/60 ${showIntro ? 'py-20 md:py-28' : 'pb-20 pt-12 md:pb-28 md:pt-16'}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {showIntro && (
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <span className="eyebrow">{fr ? 'Réalisations' : 'Selected work'}</span>
          <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">
            {fr ? 'Ce qu’on a déjà construit.' : "What we've already built."}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">
            {fr
              ? 'Santé, juridique, finance, restauration, applications mobiles et plateformes privées : des projets conçus, développés et lancés par 3geeks.'
              : 'Healthcare, legal, finance, restaurants, mobile apps and private platforms: projects designed, built and launched by 3geeks.'}
          </p>
        </Reveal>
        )}

        <Reveal className="mb-6 flex items-center gap-4">
          <h2 className="font-display text-lg font-semibold text-white md:text-xl">
            {fr ? 'Projets clients' : 'Client projects'}
          </h2>
          <span className="h-px flex-1 bg-white/10" />
          <span className="hidden text-sm text-slate-500 sm:block">
            {fr ? 'Conçus et livrés pour nos clients' : 'Designed and delivered for our clients'}
          </span>
        </Reveal>

        <Reveal className="mb-16 scroll-mt-24 md:mb-20">
          <div id="avant-apres" className="scroll-mt-24" />
          <BeforeAfter lang={lang} onOpenCase={() => setOpenCase(PROJECTS_DATA.find((p) => p.id === BEFORE_AFTER_ID) ?? null)} />
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {clientProjects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80}>
              <ClientCard project={project} lang={lang} onOpenCase={setOpenCase} />
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
                    ? `${clientProjects.length} réalisations clients, ${labProjects.length} produits maison et un jeu vidéo : chaque projet élargit ce qu’on sait construire. Le prochain peut être le vôtre.`
                    : `${clientProjects.length} client projects, ${labProjects.length} in-house products and a video game: every project widens what we can build. The next one could be yours.`}
                </p>
              </div>
              <button type="button" data-booking="projects" onClick={onContact} className="btn btn-primary shrink-0">
                {fr ? 'Lancer mon projet' : 'Start my project'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        )}

        <Reveal className="mb-6 mt-16 flex items-center gap-4">
          <h2 className="font-display text-lg font-semibold text-white md:text-xl">
            {fr ? 'Nos produits maison' : 'Our in-house products'}
          </h2>
          <span className="h-px flex-1 bg-white/10" />
          <span className="hidden text-sm text-slate-500 sm:block">
            {fr ? 'Sortis de chez nous : à essayer, ou à déployer chez vous' : 'Made at 3geeks: try them, or run them in your company'}
          </span>
        </Reveal>

        {featuredProducts.map((project) => (
          <Reveal key={project.id} className="mb-5">
            <FeaturedProductCard project={project} lang={lang} onContact={onContact} />
          </Reveal>
        ))}

        {wideProducts.map((project) => (
          <Reveal key={project.id} className="mb-5">
            <WideProductCard project={project} lang={lang} />
          </Reveal>
        ))}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {otherProducts.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80}>
              <LabCard project={project} lang={lang} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-5">
          <a
            id="17-octobre"
            href="/17-octobre"
            className="card group grid scroll-mt-24 overflow-hidden hover:-translate-y-1 hover:bg-surface-2 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.07] bg-ink md:aspect-auto md:border-b-0 md:border-r">
              <img
                src={GAME_COVER}
                srcSet={`${GAME_COVER} 640w, ${GAME_COVER_LARGE} 1600w`}
                sizes="(min-width: 768px) 700px, 100vw"
                alt={fr ? '17 OCTOBRE : la Manif à Lyon, la grande roue de la place Bellecour' : '17 OCTOBRE: the Manif in Lyon, by the Ferris wheel on Place Bellecour'}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur">
                {fr ? 'Jeu vidéo · gratuit' : 'Video game · free'}
              </span>
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <img src={STUDIO_LOGO} alt="3Geeks Studio" width={970} height={372} loading="lazy" className="block h-10 w-auto self-start select-none" draggable={false} />
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-[#FCC200]">17 OCTOBRE</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                {fr
                  ? 'Notre jeu, trois jeux en un, gratuits sur Windows et Mac : les Actes, la stratégie en temps réel ; la Manif, un roguelite en 3D de Paris à Lyon, Clermont-Ferrand et Angers ; la Campagne, Paris en monde ouvert. Des centaines de personnages simulés, des villes entièrement dessinées par le code. Bientôt sur Steam.'
                  : 'Our game, three games in one, free on Windows and Mac: Les Actes, real-time strategy; the Manif, a 3D roguelite from Paris to Lyon, Clermont-Ferrand and Angers; the Campagne, an open-world Paris. Hundreds of simulated characters, cities drawn entirely by code. Coming to Steam.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {(fr ? ['Godot 4', '3 jeux en 1', 'Windows et Mac', 'Steam'] : ['Godot 4', '3 games in 1', 'Windows and Mac', 'Steam']).map((tag) => (
                  <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-mint transition-colors group-hover:text-white">
                {fr ? 'Bande-annonce et téléchargement' : 'Trailer and download'} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        </Reveal>
      </div>

      {openCase?.caseStudy && (
        <CaseStudyModal project={openCase} lang={lang} onClose={closeCase} onContact={onContact} />
      )}
    </section>
  );
};

export default ProjectsShowcase;
