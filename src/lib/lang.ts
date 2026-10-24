import type { Lang } from '../i18n';

export const LANG_STORAGE_KEY = '3geeks-lang';

/** Search engine and link-preview robots (Googlebot, Bingbot, ChatGPT, social previews...). */
const CRAWLER = /bot|crawler|spider|slurp|bingpreview|google-inspectiontool|googleother|facebookexternalhit|embedly|quora link preview|chatgpt|gptbot|perplexity|claude/i;

/** Langue mémorisée, sinon celle du navigateur (français par défaut pour la France). */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* stockage indisponible */
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    // Search engines render pages with an English browser: they keep the French of the HTML and of
    // the canonical address, or Google indexes the English version (seen on 24/10/2026).
    if (CRAWLER.test(navigator.userAgent)) return 'fr';
    return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }
  return 'fr';
}

/**
 * Langue du tout premier rendu. Le HTML pré-rendu au build est en français : pendant l'hydratation,
 * le premier rendu doit donc l'être aussi, puis la page passe à la langue du visiteur.
 */
export function initialLang(): Lang {
  if (typeof document === 'undefined') return 'fr';
  return document.getElementById('root')?.dataset.prerendered ? 'fr' : detectLang();
}

/** Applique la langue au document et la mémorise pour les autres pages du site. */
export function persistLang(lang: Lang) {
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}
