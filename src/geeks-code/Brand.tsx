/**
 * « À vos couleurs » : la même fenêtre, sous le nom et aux couleurs d'une autre entreprise. La personne tape un nom,
 * choisit une couleur, et tout suit, Geeko compris. Rien ne quitte la page : c'est un essai dans le navigateur.
 * Geeks Code est un outil interne ; ce bloc montre ce que la version pour les entreprises pourra donner.
 */
import { ArrowRight, Check, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import type { Lang } from '../i18n';
import { BRAND } from './copy';
import IdeMock, { EASE, type Scene } from './IdeMock';

// L'IA vient d'écrire le code, les tests passent : une coche sur trois.
const SCENE: Scene = { view: 'editor', ticks: 1, prompt: 'sent', said: 4, code: 'there', tested: true, geeko: 'deux-doigts' };

interface Theme {
  /** Les deux couleurs de la fenêtre, et celle du texte posé dessus. */
  a: string;
  b: string;
  on: string;
}
// 3geeks, bleu, corail, violet (la palette « intensive » de Geeko), or.
const PRESETS: Theme[] = [
  { a: '#c3fb05', b: '#0aefbb', on: '#06130f' },
  { a: '#8fc7ff', b: '#4f8bff', on: '#06101f' },
  { a: '#ffb39c', b: '#ff6b4a', on: '#220b05' },
  { a: '#f0abfc', b: '#b57bff', on: '#190a2e' },
  { a: '#ffe08a', b: '#f5b83d', on: '#211603' },
];
const VIOLET = 3;
// La teinte du lime de Geeko : sa couleur tourne d'autant pour rejoindre celle de la marque.
const GEEKO_HUE = 74;

const rgb = (hex: string) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));
const hex = (parts: number[]) => `#${parts.map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`;
const mix = (from: string, to: string, share: number) => hex(rgb(from).map((part, i) => part + (rgb(to)[i] - part) * share));
const light = (colour: string) => {
  const [r, g, b] = rgb(colour);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
function hue(colour: string): number {
  const [r, g, b] = rgb(colour).map((part) => part / 255);
  const max = Math.max(r, g, b);
  const spread = max - Math.min(r, g, b);
  if (!spread) return GEEKO_HUE;
  const turn = max === r ? ((g - b) / spread) % 6 : max === g ? (b - r) / spread + 2 : (r - g) / spread + 4;
  return (turn * 60 + 360) % 360;
}
/** Une couleur choisie à la main : sa version claire l'accompagne, et le texte posé dessus reste lisible. */
const themeOf = (colour: string): Theme => ({ a: mix(colour, '#ffffff', 0.4), b: colour, on: light(colour) > 0.45 ? '#08090d' : '#ffffff' });

const Brand: React.FC<{ lang: Lang; book: (source: string) => void }> = ({ lang, book }) => {
  const ui = BRAND[lang];
  const [name, setName] = useState('');
  const [preset, setPreset] = useState(0);
  const [custom, setCustom] = useState<string>();

  const theme = custom ? themeOf(custom) : PRESETS[preset];
  const shown = name.trim() || ui.fallback;
  // Tant qu'on n'a rien changé, c'est Geeks Code tel quel.
  const ours = !custom && preset === 0 && !name.trim();
  const tinted = Boolean(custom) || (preset !== 0 && preset !== VIOLET);

  return (
    <div>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div className="min-w-0">
          <label htmlFor="gc-brand-name" className="block text-sm font-semibold text-white">
            {ui.name}
          </label>
          <input
            id="gc-brand-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={18}
            autoComplete="off"
            spellCheck={false}
            placeholder={ui.namePlaceholder}
            className="mt-2 w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand-mint/60 focus:outline-none"
          />

          <p className="mt-6 text-sm font-semibold text-white">{ui.colour}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            {PRESETS.map((item, i) => {
              const on = !custom && preset === i;
              return (
                <button
                  key={item.b}
                  type="button"
                  onClick={() => {
                    setCustom(undefined);
                    setPreset(i);
                  }}
                  aria-pressed={on}
                  aria-label={ui.presets[i]}
                  title={ui.presets[i]}
                  className={`gc-swatch ${on ? 'is-on' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${item.a}, ${item.b})` }}
                />
              );
            })}
            <label className={`gc-swatch gc-swatch-custom ${custom ? 'is-on' : ''}`} title={ui.custom} style={custom ? { background: custom } : undefined}>
              <span className="sr-only">{ui.custom}</span>
              {!custom && <Plus className="h-4 w-4" aria-hidden="true" />}
              <input type="color" value={custom ?? '#4f8bff'} onChange={(event) => setCustom(event.target.value)} />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500">{ui.privacy}</p>

          <p className="mt-7 text-sm font-semibold text-white">{ui.plugged}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ui.tools.map((tool, i) => (
              <motion.li
                key={tool}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.12, ease: EASE }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} style={{ color: theme.b }} />
                {tool}
              </motion.li>
            ))}
          </ul>
        </div>

        <IdeMock
          lang={lang}
          scene={SCENE}
          brand={ours ? undefined : { name: `${shown} Code`, initial: shown.charAt(0).toUpperCase() }}
          palette={!custom && preset === VIOLET ? 'ultra' : 'normal'}
          user={ui.you}
          className={tinted ? 'is-tinted' : ''}
          style={{
            ['--gc-a' as string]: theme.a,
            ['--gc-b' as string]: theme.b,
            ['--gc-on' as string]: theme.on,
            ['--gc-hue' as string]: `${Math.round(hue(theme.b) - GEEKO_HUE)}deg`,
          }}
        />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ui.points.map((point) => (
          <div key={point.t} className="card p-6">
            <h3 className="font-display text-lg font-semibold text-white">{point.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{point.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-base leading-relaxed text-slate-300">{ui.status}</p>
        <button
          type="button"
          data-booking="seo-cas-geeks-code-entreprise"
          onClick={() => book('seo-cas-geeks-code-entreprise')}
          className="btn btn-primary shrink-0 self-start md:self-auto"
        >
          {ui.cta} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Brand;
