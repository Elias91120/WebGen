import type { Lang } from '../i18n';

export const LANG_STORAGE_KEY = '3geeks-lang';

/** Langue mémorisée, sinon celle du navigateur (français par défaut pour la France). */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* stockage indisponible */
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }
  return 'fr';
}

/**
 * Langue du tout premier rendu. Le HTML pré-rendu au build est en français : pendant l'hydratation,
 * le premier rendu doit donc l'être aussi, puis la page passe à la langue du visiteur (useSyncedLang).
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
