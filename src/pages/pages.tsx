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
import SiteLayout, { PageId } from '../site/SiteLayout';
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

const PAGES: Record<PageId, React.FC> = { home: HomePage, offers: OffersPage, work: WorkPage, team: TeamPage, game: GamePage };

/** Each HTML entry calls this with its page id. */
export function mount(page: PageId) {
  const root = document.getElementById('root');
  if (!root) throw new Error('Could not find root element to mount to');
  const Page = PAGES[page];
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Page />
    </React.StrictMode>,
  );
}
