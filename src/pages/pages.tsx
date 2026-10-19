/**
 * The studio's pages. Home answers "what do you do, how, and can I trust you?" in about
 * 30 seconds; each detail lives on its own page, reachable from the header and footer.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';

import AiTeaser from '../components/AiTeaser';
import ClientLogos from '../components/ClientLogos';
import ProjectsShowcase from '../components/ProjectsShowcase';
import SkillsRadar from '../components/SkillsRadar';
import TeamSection from '../components/TeamSection';
import {
  Commitments,
  ContactSection,
  FeaturedWork,
  Hero,
  HowItWorks,
  MethodSection,
  OffersSection,
  PageIntro,
  Reviews,
  WhatWeDo,
  WhyUs,
} from '../site/sections';
import GameSections from '../game/GameSections';
import LegalContent from '../site/LegalPage';
import SiteLayout, { PageId } from '../site/SiteLayout';
import { demarrerMesure } from '../lib/mesure';
import '../index.css';

export const HomePage: React.FC = () => (
  <SiteLayout page="home">
    {(ctx) => (
      <>
        <Hero {...ctx} />
        <ClientLogos lang={ctx.lang} />
        <WhatWeDo {...ctx} />
        <HowItWorks {...ctx} />
        <FeaturedWork {...ctx} />
        <ContactSection {...ctx} />
      </>
    )}
  </SiteLayout>
);

export const OffersPage: React.FC = () => (
  <SiteLayout page="offers">
    {(ctx) => (
      <>
        <PageIntro {...ctx.t.site.pages.offers} title={ctx.t.site.pages.offers.h1} />
        <OffersSection {...ctx} />
        <Commitments {...ctx} />
        <MethodSection {...ctx} />
        <AiTeaser lang={ctx.lang} copy={ctx.t.aiTeaser} />
        <ContactSection {...ctx} />
      </>
    )}
  </SiteLayout>
);

export const WorkPage: React.FC = () => (
  <SiteLayout page="work">
    {(ctx) => (
      <>
        <PageIntro {...ctx.t.site.pages.work} title={ctx.t.site.pages.work.h1} />
        <ProjectsShowcase lang={ctx.lang} onContact={() => ctx.book('projects')} showIntro={false} />
        <Reviews {...ctx} />
        <ContactSection {...ctx} />
      </>
    )}
  </SiteLayout>
);

export const TeamPage: React.FC = () => (
  <SiteLayout page="team">
    {(ctx) => (
      <>
        <PageIntro {...ctx.t.site.pages.team} title={ctx.t.site.pages.team.h1} />
        <TeamSection team={ctx.t.team} showIntro={false} />
        <WhyUs {...ctx} />
        <SkillsRadar lang={ctx.lang} />
        <ContactSection {...ctx} />
      </>
    )}
  </SiteLayout>
);

/** Our video game (/17-octobre), from the lab: trailer, screenshots and the private beta download. */
export const GamePage: React.FC = () => (
  <SiteLayout page="game">
    {(ctx) => <GameSections lang={ctx.lang} book={ctx.book} />}
  </SiteLayout>
);

/** Legal pages (/mentions-legales, /confidentialite, /cgv), each on its own address. */
const legalPage = (page: 'legalNotice' | 'privacy' | 'terms'): React.FC => () => (
  <SiteLayout page={page}>{(ctx) => <LegalContent {...ctx} page={page} />}</SiteLayout>
);

export const PAGES: Record<PageId, React.FC> = {
  home: HomePage,
  offers: OffersPage,
  work: WorkPage,
  team: TeamPage,
  game: GamePage,
  legalNotice: legalPage('legalNotice'),
  privacy: legalPage('privacy'),
  terms: legalPage('terms'),
};

/** Each HTML entry calls this with its page id. */
export function mount(page: PageId) {
  const root = document.getElementById('root');
  if (!root) throw new Error('Could not find root element to mount to');
  const Page = PAGES[page];
  demarrerMesure();   // (la mesure d'audience, anonyme et sans cookie : src/lib/mesure.ts)
  const app = (
    <React.StrictMode>
      <Page />
    </React.StrictMode>
  );
  // The build prerenders each page (scripts/prerender.mjs): React then takes over that HTML
  // instead of rebuilding it, so the text shows before the JavaScript has loaded.
  if (root.dataset.prerendered) ReactDOM.hydrateRoot(root, app);
  else ReactDOM.createRoot(root).render(app);
}
