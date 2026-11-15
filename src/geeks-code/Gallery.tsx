/**
 * La galerie de Geeko : ses 30 animations rangées par activité de l'IA, ses 7 surprises, son rythme et sa couleur.
 * C'est le vrai moteur de Geeks Code (src/geeko/geeko.ts) qui joue, pas une vidéo. Tant qu'on n'y touche pas, la
 * galerie fait le tour toute seule ; au premier clic, elle rend la main. Avec « réduire les animations », Geeko
 * attend qu'on le lui demande pour bouger.
 */
import { Sparkles } from 'lucide-react';
import { useInView, useReducedMotion } from 'motion/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { GeekoEgg, GeekoInfo, GeekoIntensity } from '../geeko/geeko';
import type { Lang } from '../i18n';
import { GALLERY, GALLERY_UI, SURPRISES } from './copy';
import GeekoStage from './GeekoStage';

const TOUR_MS = 5200;
// La marche du moteur avance de 14 unités en 260 ms : à cette vitesse, ses pieds ne glissent pas.
const WALK_UNITS_PER_S = 14 / 0.26;
const TEMPOS: GeekoIntensity[] = ['calme', 'normal', 'turbo'];

const FLAT = GALLERY.flatMap((group, g) => group.variants.map((variant) => ({ ...variant, group: g })));

const chip = (on: boolean) =>
  `inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint ${
    on ? 'border-brand-mint/60 bg-brand-mint/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
  }`;

const Gallery: React.FC<{ lang: Lang }> = ({ lang }) => {
  const ui = GALLERY_UI[lang];
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [tempo, setTempo] = useState<GeekoIntensity>('normal');
  const [ultra, setUltra] = useState(false);
  const [egg, setEgg] = useState<{ name: GeekoEgg; at: number }>();
  const [again, setAgain] = useState(0);
  const [touched, setTouched] = useState(false);
  const [force, setForce] = useState(false);
  // Ce que Geeko joue vraiment (une surprise prend sa place, puis la rend).
  const [playing, setPlaying] = useState<{ variant?: string; egg?: GeekoEgg }>({});
  const [walkSeconds, setWalkSeconds] = useState(5);

  const chosen = FLAT[index];
  const group = GALLERY[chosen.group];
  const surprise = playing.egg ? SURPRISES.find((s) => s.id === playing.egg) : undefined;
  const walking = !surprise && chosen.id === 'marche';
  const still = Boolean(reduce) && !force;

  const show = (next: number) => {
    const variant = FLAT[next];
    setIndex(next);
    setAgain((n) => n + 1);
    // Les variantes « turbo » ne sortent qu'à plein régime dans l'outil : le rythme suit.
    setTempo((now) => (variant.turbo ? 'turbo' : now === 'turbo' ? 'normal' : now));
  };
  const choose = (next: number) => {
    setTouched(true);
    show(next);
  };

  // Le tour tout seul, tant que personne n'y touche.
  useEffect(() => {
    if (touched || still || reduce || !inView) return;
    const id = window.setTimeout(() => show((index + 1) % FLAT.length), TOUR_MS);
    return () => window.clearTimeout(id);
  }, [touched, still, reduce, inView, index]);

  // Il traverse la scène à la vitesse de ses pas.
  useEffect(() => {
    const stage = stageRef.current;
    const host = stage?.querySelector<HTMLElement>('.gc-geeko');
    if (!walking || !stage || !host) return;
    const unit = host.getBoundingClientRect().width / 116;
    if (unit > 0) setWalkSeconds((stage.clientWidth + 116 * unit) / (WALK_UNITS_PER_S * unit));
  }, [walking]);

  const onInfo = useMemo(() => (info: GeekoInfo) => setPlaying(info.egg ? { egg: info.egg } : { variant: info.variant }), []);

  return (
    <div ref={ref}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
        {/* La scène */}
        <div className="min-w-0">
          <div
            ref={stageRef}
            className="gc-stage"
            data-ultra={ultra ? '' : undefined}
            data-walk={walking ? '' : undefined}
            style={{ ['--gc-walk' as string]: `${walkSeconds.toFixed(2)}s` }}
          >
            <div className="gc-stage-top">
              <span className="gc-stage-doing">
                {surprise ? <Sparkles className="h-3.5 w-3.5" /> : <span className="gc-stage-dot" />}
                {surprise ? ui.surprise : group.label[lang]}
              </span>
              <span className="gc-stage-count">
                {surprise
                  ? ui.count(SURPRISES.indexOf(surprise) + 1, SURPRISES.length)
                  : ui.count(index + 1, FLAT.length)}
              </span>
            </div>
            <div className="gc-stage-floor">
              <div className="gc-stage-pace">
                <GeekoStage
                  lang={lang}
                  variant={chosen.id}
                  decor
                  secrets
                  palette={ultra ? 'ultra' : 'normal'}
                  intensity={tempo}
                  egg={egg}
                  again={again}
                  force={force}
                  onInfo={onInfo}
                  className="gc-stage-geeko"
                />
              </div>
            </div>
            {/* (annoncée aux lecteurs d'écran seulement quand c'est la personne qui choisit, pas pendant le tour tout seul) */}
            <div className="gc-stage-caption" aria-live={touched ? 'polite' : 'off'}>
              <p className="font-display text-lg font-semibold text-white">{(surprise ?? chosen).name[lang]}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{(surprise ?? chosen).line[lang]}</p>
              {still && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => setForce(true)} className="btn btn-ghost !px-4 !py-2.5 !text-sm">
                    {ui.start}
                  </button>
                  <span className="text-xs text-slate-500">{ui.reduced}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">{ui.variants}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.variants.map((variant) => {
                const at = FLAT.findIndex((v) => v.id === variant.id);
                return (
                  <button key={variant.id} type="button" onClick={() => choose(at)} aria-pressed={at === index && !surprise} className={chip(at === index && !surprise)}>
                    {variant.name[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Les commandes */}
        <div className="min-w-0 space-y-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">{ui.pick}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {GALLERY.map((item, g) => {
                const on = g === chosen.group && !surprise;
                return (
                  <button
                    key={item.activity}
                    type="button"
                    onClick={() => choose(FLAT.findIndex((v) => v.group === g))}
                    aria-pressed={on}
                    className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint ${
                      on ? 'border-brand-mint/60 bg-brand-mint/10 text-white' : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <span className="leading-snug">{item.label[lang]}</span>
                    <span className={`shrink-0 font-mono text-[11px] ${on ? 'text-brand-mint' : 'text-slate-600'}`}>{item.variants.length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-500">{ui.tempo}</p>
              <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                {TEMPOS.map((value, i) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setTouched(true);
                      setTempo(value);
                    }}
                    aria-pressed={tempo === value}
                    className={`min-h-8 rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint ${
                      tempo === value ? 'bg-brand-gradient text-ink' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {ui.tempos[i]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{ui.colour}</p>
              <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                {[false, true].map((value, i) => (
                  <button
                    key={ui.colours[i]}
                    type="button"
                    onClick={() => {
                      setTouched(true);
                      setUltra(value);
                    }}
                    aria-pressed={ultra === value}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint ${
                      ultra === value ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: value ? '#B57BFF' : '#C3FB05' }} />
                    {ui.colours[i]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {ultra && <p className="-mt-2 text-xs leading-relaxed text-slate-500">{ui.violetHint}</p>}

          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-brand-lime" /> {ui.surprises}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SURPRISES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTouched(true);
                    setEgg({ name: item.id, at: Date.now() });
                  }}
                  aria-pressed={playing.egg === item.id}
                  disabled={still}
                  className={`${chip(playing.egg === item.id)} disabled:opacity-40`}
                >
                  {item.name[lang]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{ui.surprisesHint}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ui.facts.map((fact) => (
          <div key={fact.t} className="card p-5">
            <h3 className="font-display text-base font-semibold text-white">{fact.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{fact.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300">{ui.yours}</p>
    </div>
  );
};

export default Gallery;
