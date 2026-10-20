import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, GraduationCap, Lock, Send, X } from 'lucide-react';
import BeforeAfter from './BeforeAfter/BeforeAfter';
import { Mark } from './Logo';
import Reveal from './Reveal';

// Our video game (featured lab card), from the /17-octobre page
const GAME_COVER = '/images/17-octobre/nuit-640.webp';

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

// Phone captures for the case studies
import jelloulMobile from '../assets/images/projects/jellouli-mobile.jpg';
import expressDivorceMobile from '../assets/images/projects/express-divorce-mobile.jpg';
import twoMobile from '../assets/images/projects/two-mobile.jpg';
import greenJardinMobile from '../assets/images/projects/green-jardin-mobile.jpg';

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
  mockup?: 'esign' | 'telegram';
  /** Lab cards: logo image, studio mark or icon. */
  image?: string;
  icon?: React.ElementType;
  useStudioMark?: boolean;
  /** Flagship public projects get a short case study (context, what we shipped, result). */
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
    category: 'client',
    title: { fr: 'Cabinet Dr Amel Elloumi Jellouli', en: "Dr Amel Elloumi Jellouli's practice" },
    subtitle: 'amel-jellouli-elloumi.com',
    badge: { fr: 'Santé · Site médical premium', en: 'Healthcare · Premium medical website' },
    description: {
      fr: 'Site d’un cabinet de dermatologie à Tunis : expertises détaillées, cas cliniques documentés, visite vidéo du plateau laser et prise de rendez-vous en un clic, en français et en arabe.',
      en: 'Website for a dermatology practice in Tunis: detailed specialties, documented clinical cases, a video tour of the laser suite and one-click booking, in French and Arabic.'
    },
    tags: { fr: ['Bilingue FR / AR','Cas cliniques','Prise de RDV'], en: ['Bilingual FR / AR','Clinical cases','Online booking'] },
    link: 'https://www.amel-jellouli-elloumi.com/',
    cover: jelloulCover,
    caseStudy: {
      mobile: jelloulMobile,
      context: {
        fr: 'Le Dr Amel Elloumi Jellouli, ancien médecin principal des hôpitaux, exerce à la Clinique Les Jasmins à Tunis. Ses patients, francophones comme arabophones, veulent être rassurés avant de prendre rendez-vous : le site devait refléter son exigence médicale.',
        en: 'Dr Amel Elloumi Jellouli, a former senior hospital physician, practises at Clinique Les Jasmins in Tunis. Her French- and Arabic-speaking patients want reassurance before booking: the site had to reflect her medical standards.'
      },
      delivered: {
        fr: ['Site bilingue français / arabe', 'Pôles d’expertise détaillés : dermatologie, lasers, esthétique, chirurgie', '15 cas cliniques documentés, filtrables par spécialité', 'Visite vidéo du cabinet et du plateau laser', 'Rendez-vous en un clic : appel, WhatsApp, e-mail, itinéraire'],
        en: ['Bilingual French / Arabic website', 'Detailed specialties: dermatology, lasers, aesthetics, surgery', '15 documented clinical cases, filterable by specialty', 'Video tour of the practice and the laser suite', 'One-tap booking: call, WhatsApp, email, directions']
      },
      result: {
        fr: 'Un site à la hauteur du parcours du Dr Jellouli : crédible pour les patients, clair sur chaque soin, et pensé d’abord pour le mobile.',
        en: "A site that matches Dr Jellouli's background: credible for patients, clear about every treatment, and designed mobile-first."
      }
    }
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
    id: 'vipagence',
    category: 'client',
    title: { fr: 'Vipagence', en: 'Vipagence' },
    subtitle: 'vipagence.net',
    badge: { fr: 'Marketplace · Plateforme web', en: 'Marketplace · Web platform' },
    description: {
      fr: 'Site vitrine et parcours d’inscription pour une agence qui relie créateurs UGC, clippers et marques. Conçu et développé par 3geeks — le site, pas le casting.',
      en: 'Marketing site and sign-up flows for an agency connecting UGC creators, clippers and brands. Designed and built by 3geeks — the website, not the roster.'
    },
    tags: { fr: ['React','Site produit','Marketplace'], en: ['React','Product site','Marketplace'] },
    link: 'https://www.vipagence.net/',
    cover: vipagenceCover
  },
  {
    id: 'two-app',
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
    id: 'green-jardin',
    category: 'client',
    title: { fr: 'Green Jardin', en: 'Green Jardin' },
    subtitle: 'green-jardin.fr',
    badge: { fr: 'Retail omnicanal · Shopify', en: 'Omnichannel retail · Shopify' },
    description: {
      fr: 'Boutique CBD en ligne et en magasin (Palaiseau) : vitrine Shopify avec Ino Digital, menu TV dynamique en temps réel, caisse POS avec balance et fidélité 14 %.',
      en: 'CBD shop online and in-store (Palaiseau): Shopify storefront with Ino Digital, real-time TV menu, gram-scale POS and loyalty sync.'
    },
    tags: { fr: ['Shopify','Caisse POS','Firebase'], en: ['Shopify','POS','Firebase'] },
    link: 'https://green-jardin.fr',
    cover: greenJardinCover,
    caseStudy: {
      mobile: greenJardinMobile,
      context: {
        fr: 'Green Jardin vend du CBD en boutique à Palaiseau et en ligne. Trois canaux à garder alignés : le site, la caisse du magasin et l’affichage en boutique.',
        en: 'Green Jardin sells CBD in its Palaiseau shop and online. Three channels to keep aligned: the website, the in-store till and the in-store display.'
      },
      delivered: {
        fr: ['Boutique Shopify, réalisée avec Ino Digital', 'Menu TV dynamique en magasin, mis à jour en temps réel', 'Caisse POS avec balance et programme de fidélité', 'Vérification d’âge et paiement sécurisé', 'Livraison offerte dès 50 € et expédition en 24/48 h'],
        en: ['Shopify store, built with Ino Digital', 'Dynamic in-store TV menu, updated in real time', 'POS till with scale and loyalty programme', 'Age verification and secure checkout', 'Free shipping from €50, dispatched in 24/48h']
      },
      result: {
        fr: 'Le site, la caisse et l’écran du magasin partagent les mêmes produits et les mêmes prix : une seule source à tenir à jour.',
        en: 'The website, the till and the in-store screen share the same products and prices: a single source to keep up to date.'
      }
    }
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
    tags: { fr: ['Mini-app Telegram','PWA','Docker'], en: ['Telegram Mini App','PWA','Docker'] },
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
    tags: { fr: ['Agent vocal IA','Landing SaaS','Restauration'], en: ['AI voice agent','SaaS landing','Restaurants'] },
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
      fr: 'Outil beta qui transforme une idée floue en un plan d’exécution structuré par étapes et prompts contextualisés à utiliser dans votre IDE.',
      en: 'Beta tool that turns a short brief into phased steps and copy-paste prompts, orchestrated by specialized AI agents.'
    },
    tags: { fr: ['Multi-agent','Planification IA','Bêta'], en: ['Multi-agent','AI planning','Beta'] },
    link: 'https://prompt-hub.3geeks.fr/',
    image: promptHubImg
  },
  {
    id: 'prompt-optim',
    category: 'studio',
    title: { fr: 'PromptOptim', en: 'PromptOptim' },
    subtitle: 'prompt-optim.3geeks.fr',
    badge: { fr: 'Green IT & sobriété numérique', en: 'Green IT & low-impact computing' },
    description: {
      fr: 'Optimiseur de prompts IA qui réduit la consommation de tokens, estime l’impact CO2 par requête et encourage une utilisation sobre et souveraine de l’IA.',
      en: 'AI prompt optimization tool designed to reduce token usage, estimate the CO2 impact of each request and encourage frugal AI use.'
    },
    tags: { fr: ['Green IT','Sobriété IA','Outil ouvert'], en: ['Green IT','Frugal AI','Open tool'] },
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
        <span className="h-2 w-2 rounded-full bg-brand-lime" />
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
  ) : project.mockup === 'esign' ? (
    <EsignMockup />
  ) : (
    <TelegramMockup />
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
          {project.caseStudy && (
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
              ? 'Santé, juridique, finance, e-commerce, applications mobiles et plateformes privées : des projets conçus, développés et lancés par 3geeks.'
              : 'Healthcare, legal, finance, e-commerce, mobile apps and private platforms: projects designed, built and launched by 3geeks.'}
          </p>
        </Reveal>
        )}

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
          <h3 className="font-display text-lg font-semibold text-white md:text-xl">
            {fr ? 'Le lab 3geeks' : 'The 3geeks lab'}
          </h3>
          <span className="h-px flex-1 bg-white/10" />
          <span className="hidden text-sm text-slate-500 sm:block">
            {fr ? 'Nos propres produits et outils' : 'Our own products and tools'}
          </span>
        </Reveal>

        <Reveal className="mb-5">
          <a
            id="17-octobre"
            href="/17-octobre"
            className="card group grid scroll-mt-24 overflow-hidden hover:-translate-y-1 hover:bg-surface-2 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.07] bg-ink md:aspect-auto md:border-b-0 md:border-r">
              <img
                src={GAME_COVER}
                alt={fr ? '17 OCTOBRE : une manif vue d’en haut, la nuit' : '17 OCTOBRE: a street protest seen from above, at night'}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur">
                {fr ? 'Jeu vidéo · bêta' : 'Video game · beta'}
              </span>
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <p className="text-xs font-medium text-brand-mint/90">{fr ? 'Jeu vidéo · stratégie en temps réel' : 'Video game · real-time strategy'}</p>
              <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#FCC200]">17 OCTOBRE</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                {fr
                  ? 'Notre jeu : une manif vue d’en haut, satirique et cartoon. Des centaines de personnages simulés, une ville de Paris entièrement dessinée par le code, une campagne de huit Actes, le camp CRS, et bientôt le duel en ligne. Bientôt sur Steam.'
                  : 'Our game: a street protest seen from above, satirical and cartoonish. Hundreds of simulated characters, a Paris drawn entirely by code, an eight-Act campaign, the riot police side, and an online duel on the way. Coming to Steam.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {(fr ? ['Godot 4', 'Simulation de foule', 'Pixel art généré', 'Steam'] : ['Godot 4', 'Crowd simulation', 'Generated pixel art', 'Steam']).map((tag) => (
                  <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-mint transition-colors group-hover:text-white">
                {fr ? 'Bande-annonce et bêta' : 'Trailer and beta'} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {labProjects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 4) * 80}>
              <LabCard project={project} lang={lang} />
            </Reveal>
          ))}
        </div>
      </div>

      {openCase?.caseStudy && (
        <CaseStudyModal project={openCase} lang={lang} onClose={closeCase} onContact={onContact} />
      )}
    </section>
  );
};

export default ProjectsShowcase;
