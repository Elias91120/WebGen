import { Globe, List, X } from '@phosphor-icons/react';
import Logo from '../Logo';
import type { Lang, Translations } from '../../i18n/translations';

interface NavbarProps {
  t: Translations;
  lang: Lang;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onToggleLang: () => void;
  onScrollTo: (id: string) => void;
}

export default function Navbar({
  t,
  lang,
  isMenuOpen,
  onToggleMenu,
  onToggleLang,
  onScrollTo,
}: NavbarProps) {
  return (
    <nav className="fixed top-3 md:top-4 left-1/2 z-50 w-[96%] max-w-6xl -translate-x-1/2">
      <div className="glass-nav rounded-2xl shadow-xl shadow-black/20">
        <div className="flex h-14 md:h-[4.25rem] items-center justify-between px-3 sm:px-5 lg:px-6">
          <button
            type="button"
            className="flex min-w-0 max-w-[55%] flex-shrink-0 items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="3geeks"
          >
            <Logo variant="wordmark" compact className="opacity-95" />
          </button>

          <div className="hidden items-center gap-6 md:flex">
            <button
              type="button"
              onClick={() => onScrollTo('services')}
              className="text-sm text-slate-300 transition-colors hover:text-cyan-300"
            >
              {t.nav.services}
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('projets')}
              className="text-sm text-slate-300 transition-colors hover:text-cyan-300"
            >
              {t.nav.projects}
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('equipe')}
              className="text-sm text-slate-300 transition-colors hover:text-cyan-300"
            >
              {t.nav.team}
            </button>
            <button
              type="button"
              onClick={onToggleLang}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition-colors hover:bg-white/10"
              aria-label="Language"
            >
              <Globe className="h-3.5 w-3.5" weight="bold" />
              {lang.toUpperCase()}
            </button>
            <button type="button" onClick={() => onScrollTo('contact')} className="btn-primary !py-2 !px-5 !text-sm">
              {t.nav.cta}
            </button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={onToggleLang}
              className="font-mono text-xs text-slate-200"
              aria-label="Language"
            >
              {lang.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={onToggleMenu}
              className="p-2 text-white"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" weight="bold" /> : <List className="h-6 w-6" weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="glass-nav mt-2 rounded-xl p-3 shadow-xl md:hidden">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onScrollTo('services')}
              className="rounded-lg px-2 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/5 hover:text-cyan-300"
            >
              {t.nav.services}
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('projets')}
              className="rounded-lg px-2 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/5 hover:text-cyan-300"
            >
              {t.nav.projects}
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('equipe')}
              className="rounded-lg px-2 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/5 hover:text-cyan-300"
            >
              {t.nav.team}
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('temoignages')}
              className="rounded-lg px-2 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/5 hover:text-cyan-300"
            >
              {t.nav.reviews}
            </button>
            <button type="button" onClick={() => onScrollTo('contact')} className="btn-primary mt-1 w-full !text-sm">
              {t.nav.cta}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
