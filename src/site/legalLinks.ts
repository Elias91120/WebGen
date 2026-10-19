/** The three legal pages, each on its own address (they used to be a modal without a URL). */
export const LEGAL_LINKS: Array<{ page: 'legalNotice' | 'privacy' | 'terms'; tab: 'legal' | 'privacy' | 'terms'; href: string }> = [
  { page: 'legalNotice', tab: 'legal', href: '/mentions-legales' },
  { page: 'privacy', tab: 'privacy', href: '/confidentialite' },
  { page: 'terms', tab: 'terms', href: '/cgv' },
];
