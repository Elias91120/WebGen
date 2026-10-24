/**
 * Server-side entry used only at build time (scripts/prerender.mjs): renders each page to HTML,
 * in French, so the text is in the page before any JavaScript runs.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';

import ContentPageView from './content/ContentPage';
import { CONTENT_PAGES, findContentPage } from './content/pages';
import AiPage from './ia/AiPage';
import { PAGES } from './pages/pages';
import type { PageId } from './site/SiteLayout';

export function render(page: PageId | 'ia'): string {
  const Page = page === 'ia' ? AiPage : PAGES[page];
  return renderToString(
    <React.StrictMode>
      <Page />
    </React.StrictMode>,
  );
}

/** A content page, by its address (/ia/agents-ia). */
export function renderContent(path: string): string {
  const page = findContentPage(path);
  if (!page) throw new Error(`Unknown content page: ${path}`);
  return renderToString(
    <React.StrictMode>
      <ContentPageView page={page} />
    </React.StrictMode>,
  );
}

/** For the sitemap and the prerender loop. */
export const contentPages = CONTENT_PAGES.map((page) => ({ path: page.path, updated: page.updated }));
