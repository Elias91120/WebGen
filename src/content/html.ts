/**
 * The HTML entry of each content page (src/content/pages.ts), written by vite.config.ts before dev and
 * build into <path>/index.html (git-ignored). The head is in French, like the prerendered body: title,
 * description, canonical, sharing cards and schema.org data, so search engines read them without JS.
 */
import type { ContentPage } from './pages';

const SITE = 'https://3geeks.fr';

const esc = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function jsonLd(page: ContentPage): string {
  const url = `${SITE}${page.path}`;
  const fr = page.meta.fr;
  const organization = {
    '@type': 'Organization',
    name: '3geeks',
    url: SITE,
    logo: `${SITE}/favicon.png`,
    contactPoint: { '@type': 'ContactPoint', email: 'contact@3geeks.fr', contactType: 'sales' },
  };
  const main =
    page.schema === 'CaseStudy'
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: page.h1.fr,
          headline: page.eyebrow.fr,
          description: fr.description,
          url,
          inLanguage: 'fr',
          creator: organization,
          ...(page.hero ? { image: `${SITE}${page.hero.desktop}` } : {}),
          ...(page.live ? { sameAs: page.live } : {}),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: page.h1.fr,
          description: fr.description,
          url,
          areaServed: 'FR',
          availableLanguage: ['French', 'English'],
          provider: organization,
        };
  const data = [
    main,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: '3geeks', item: SITE },
        ...(page.parent.href === '/' ? [] : [{ name: page.parent.label.fr, item: `${SITE}${page.parent.href}` }]),
        { name: page.eyebrow.fr, item: url },
      ].map((step, i) => ({ '@type': 'ListItem', position: i + 1, ...step })),
    },
  ];
  // "</" would end the script tag early.
  return JSON.stringify(data, null, 2).replace(/<\//g, '<\\/');
}

export function contentPageHtml(page: ContentPage): string {
  const url = `${SITE}${page.path}`;
  const { title, description } = page.meta.fr;
  const image = page.hero ? `${SITE}${page.hero.desktop}` : `${SITE}/og-cover.png`;
  return `<!DOCTYPE html>
<!-- Generated from src/content/pages.ts by vite.config.ts: edit the page there, not here. -->
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#08090d" />
    <meta name="color-scheme" content="dark" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="author" content="3geeks" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="3geeks" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${image}" />

    <script type="application/ld+json">
${jsonLd(page)}
    </script>

    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#08090d] text-slate-50 antialiased">
    <div id="root" data-page="${esc(page.path)}"></div>
    <script type="module" src="/src/pages/entries/content.tsx"></script>
  </body>
</html>
`;
}
