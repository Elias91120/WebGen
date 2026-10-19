/**
 * The two sides of 3geeks — websites & apps (/) and AI for companies (/ia) — as one two-segment switch,
 * shown in both headers so visitors always see which side they are on and how to go back.
 * `pill`: compact, in the header bar. `menu`: two large cards at the top of the mobile menu.
 */
import { Code2, Sparkles } from 'lucide-react';
import React from 'react';

import type { Lang } from '../i18n';

export type Space = 'web' | 'ai';

const LABELS: Record<Lang, Record<Space, { short: string; medium: string; long: string; hint: string }>> = {
  fr: {
    web: { short: 'Sites', medium: 'Sites & applis', long: 'Sites & applications', hint: 'Sites vitrines, e-commerce, applis' },
    ai: { short: 'IA', medium: 'IA entreprises', long: 'IA pour entreprises', hint: 'Agents IA, automatisation, logiciels' },
  },
  en: {
    web: { short: 'Web', medium: 'Websites & apps', long: 'Websites & apps', hint: 'Showcase sites, e-commerce, apps' },
    ai: { short: 'AI', medium: 'AI for business', long: 'AI for business', hint: 'AI agents, automation, software' },
  },
};

const SPACES: Array<{ id: Space; href: string; Icon: typeof Code2 }> = [
  { id: 'web', href: '/', Icon: Code2 },
  { id: 'ai', href: '/ia', Icon: Sparkles },
];

interface SpaceSwitchProps {
  active: Space;
  lang: Lang;
  variant?: 'pill' | 'menu';
  className?: string;
}

const SpaceSwitch: React.FC<SpaceSwitchProps> = ({ active, lang, variant = 'pill', className = '' }) => {
  const labels = LABELS[lang];
  const navLabel = lang === 'fr' ? 'Univers 3geeks' : '3geeks sections';

  if (variant === 'menu') {
    return (
      <nav aria-label={navLabel} className={`grid grid-cols-2 gap-2 ${className}`}>
        {SPACES.map(({ id, href, Icon }) => {
          const on = id === active;
          return (
            <a
              key={id}
              href={href}
              aria-current={on ? 'page' : undefined}
              className={`rounded-2xl border p-3.5 transition ${
                on
                  ? id === 'ai'
                    ? 'border-brand-mint/50 bg-brand-mint/10'
                    : 'border-white/25 bg-white/[0.07]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/25'
              }`}
            >
              <span className={`flex items-center gap-2 text-sm font-semibold ${on ? (id === 'ai' ? 'text-brand-mint' : 'text-white') : 'text-slate-300'}`}>
                <Icon className="h-4 w-4 shrink-0" /> {labels[id].long}
              </span>
              <span className="mt-1 block text-xs leading-snug text-slate-400">{labels[id].hint}</span>
              <span className={`mt-2 block text-[11px] font-semibold uppercase tracking-wider ${on ? 'text-slate-500' : 'text-brand-mint'}`}>
                {on ? (lang === 'fr' ? 'Vous êtes ici' : 'You are here') : lang === 'fr' ? 'Y aller →' : 'Go →'}
              </span>
            </a>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label={navLabel}
      className={`inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.04] p-1 ${className}`}
    >
      {SPACES.map(({ id, href, Icon }) => {
        const on = id === active;
        return (
          <a
            key={id}
            href={href}
            aria-current={on ? 'page' : undefined}
            title={labels[id].long}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
              on
                ? id === 'ai'
                  ? 'bg-brand-mint text-ink shadow-[0_0_18px_rgba(10,239,187,0.35)]'
                  : 'bg-white text-ink'
                : id === 'ai'
                  ? 'text-brand-mint hover:bg-brand-mint/10'
                  : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Icon className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
            <span className="xl:hidden">{labels[id].short}</span>
            <span className="hidden xl:inline">{labels[id].medium}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default SpaceSwitch;
