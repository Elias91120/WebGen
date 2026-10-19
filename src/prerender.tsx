/**
 * Server-side entry used only at build time (scripts/prerender.mjs): renders each page to HTML,
 * in French, so the text is in the page before any JavaScript runs.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';

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
