import Logo from '../Logo';
import type { Translations } from '../../i18n/translations';

interface FooterProps {
  t: Translations;
  onOpenLegal: (tab: 'privacy' | 'terms' | 'legal') => void;
}

export default function Footer({ t, onOpenLegal }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#08090d]/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Logo variant="wordmark" compact />
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} 3geeks. {t.footer.rights}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
          <button type="button" onClick={() => onOpenLegal('legal')} className="transition-colors hover:text-cyan-300">
            {t.footer.links[0]}
          </button>
          <button type="button" onClick={() => onOpenLegal('privacy')} className="transition-colors hover:text-cyan-300">
            {t.footer.links[1]}
          </button>
          <button type="button" onClick={() => onOpenLegal('terms')} className="transition-colors hover:text-cyan-300">
            {t.footer.links[2]}
          </button>
          <a href="mailto:contact@3geeks.fr" className="hidden transition-colors hover:text-cyan-300 md:inline">
            contact@3geeks.fr
          </a>
          <span className="font-mono text-[11px] text-slate-600">{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
