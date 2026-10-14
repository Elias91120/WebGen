/**
 * The /17-octobre page: our video game, from the 3geeks lab. Trailer, what the game is, screenshots, how it was made,
 * and the private beta download (behind an access code, served by the game's file server on the Mac Mini:
 * services/17-octobre, routed by Traefik on /17-octobre/fichiers).
 */
import { ArrowRight, Dices, Download, Flag, Lock, Moon, Play, Shield, Smile, Swords, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import Reveal from '../components/Reveal';
import type { Lang } from '../i18n';
import { GAME_COPY } from './copy';

const FILES = '/17-octobre/fichiers';
const IMG = '/images/17-octobre';
const GAME_YELLOW = '#FCC200'; // the game's title colour (its own art direction)

const ICONS: Record<string, React.ElementType> = { flag: Flag, shield: Shield, dice: Dices, swords: Swords, moon: Moon, smile: Smile };

interface VersionInfo {
  version: string;
  date?: string;
  size?: number;
  notes?: string[];
}

const Heading: React.FC<{ path: string; title: string; sub?: string }> = ({ path, title, sub }) => (
  <Reveal className="max-w-2xl">
    <span className="eyebrow">{path}</span>
    <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{title}</h2>
    {sub && <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{sub}</p>}
  </Reveal>
);

function formatDate(iso: string | undefined, lang: Lang): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const GameSections: React.FC<{ lang: Lang; book: (source: string) => void }> = ({ lang, book }) => {
  const c = GAME_COPY[lang];
  const [shot, setShot] = useState<number | null>(null);
  const [info, setInfo] = useState<VersionInfo | null>(null);
  const [code, setCode] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'bad'>('idle');

  useEffect(() => {
    fetch(`${FILES}/version.json`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => v && setInfo(v))
      .catch(() => {});
    if (new URLSearchParams(window.location.search).get('code') === 'faux') setState('bad');
  }, []);

  useEffect(() => {
    if (shot === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShot(null);
      if (e.key === 'ArrowRight') setShot((s) => (s === null ? s : (s + 1) % c.gallery.length));
      if (e.key === 'ArrowLeft') setShot((s) => (s === null ? s : (s + c.gallery.length - 1) % c.gallery.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shot, c.gallery.length]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const value = code.trim();
      if (!value) return;
      setState('checking');
      try {
        const r = await fetch(`${FILES}/verifier?code=${encodeURIComponent(value)}`, { cache: 'no-store' });
        const ok = r.ok && (await r.json()).ok === true;
        if (!ok) {
          setState('bad');
          return;
        }
        setState('idle');
        window.location.href = `${FILES}/telecharger?code=${encodeURIComponent(value)}`;
      } catch {
        setState('bad');
      }
    },
    [code],
  );

  return (
    <>
      {/* Hero: the game, the trailer */}
      <section className="relative overflow-hidden border-b border-white/5 pb-14 pt-28 md:pb-20 md:pt-36">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_90%_10%,rgba(252,194,0,0.12),transparent_70%),radial-gradient(ellipse_50%_60%_at_0%_100%,rgba(10,239,187,0.08),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
          <div>
            <span className="eyebrow hero-rise" style={{ ['--rise-delay' as string]: '60ms' }}>{c.eyebrow}</span>
            <h1
              className="hero-rise mt-4 font-display text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
              style={{ ['--rise-delay' as string]: '140ms', color: GAME_YELLOW }}
            >
              {c.title}
            </h1>
            <p className="hero-rise mt-4 text-lg font-semibold text-white md:text-xl" style={{ ['--rise-delay' as string]: '200ms' }}>
              {c.tagline}
            </p>
            <p className="hero-rise mt-4 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg" style={{ ['--rise-delay' as string]: '260ms' }}>
              {c.lead}
            </p>
            <div className="hero-rise mt-8 flex flex-wrap gap-3" style={{ ['--rise-delay' as string]: '320ms' }}>
              <a href="#telecharger" className="btn btn-primary">
                <Download className="h-4 w-4" /> {c.ctaDownload}
              </a>
              <a href="#bande-annonce" className="btn btn-ghost lg:hidden">
                <Play className="h-4 w-4" /> {c.ctaTrailer}
              </a>
            </div>
            <ul className="hero-rise mt-8 flex flex-wrap gap-2" style={{ ['--rise-delay' as string]: '380ms' }}>
              {c.facts.map((f) => (
                <li key={f} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div id="bande-annonce" className="hero-rise scroll-mt-24" style={{ ['--rise-delay' as string]: '220ms' }}>
            <div className="card overflow-hidden p-0 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
              <video
                className="block aspect-video w-full bg-black"
                src="/videos/17-octobre-trailer.mp4"
                poster={`${IMG}/poster.jpg`}
                controls
                playsInline
                preload="metadata"
                aria-label={c.trailerLabel}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What the game is */}
      <section className="relative border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Heading path={c.featuresPath} title={c.featuresTitle} sub={c.featuresSub} />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.features.map((f, i) => {
              const Icon = ICONS[f.icon] ?? Flag;
              return (
                <Reveal key={f.t} delay={(i % 3) * 80}>
                  <article className="card flex h-full flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]" style={{ color: GAME_YELLOW }}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {'soon' in f && f.soon && (
                        <span className="rounded-full border border-brand-mint/30 bg-brand-mint/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-mint">
                          {c.soon}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-white">{f.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.d}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="relative border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Heading path={c.galleryPath} title={c.galleryTitle} />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.gallery.map((g, i) => (
              <Reveal key={g.src} delay={(i % 3) * 80}>
                <button
                  type="button"
                  onClick={() => setShot(i)}
                  className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-ink"
                  aria-label={g.alt}
                >
                  <img
                    src={`${IMG}/${g.src}-640.webp`}
                    srcSet={`${IMG}/${g.src}-640.webp 640w, ${IMG}/${g.src}.webp 1600w`}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    alt={g.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-left text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100">
                    {g.alt}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {shot !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={c.gallery[shot].alt}
          onClick={() => setShot(null)}
        >
          <figure className="relative max-h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <img src={`${IMG}/${c.gallery[shot].src}.webp`} alt={c.gallery[shot].alt} className="max-h-[82vh] w-full rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-slate-300">{c.gallery[shot].alt}</figcaption>
            <button
              type="button"
              onClick={() => setShot(null)}
              className="absolute -top-3 right-0 flex h-10 w-10 -translate-y-full items-center justify-center rounded-full border border-white/15 bg-ink/80 text-white"
              aria-label={c.close}
            >
              <X className="h-5 w-5" />
            </button>
          </figure>
        </div>
      )}

      {/* How it was made */}
      <section className="relative border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Heading path={c.labPath} title={c.labTitle} sub={c.labSub} />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {c.lab.map((l, i) => (
              <Reveal key={l.t} delay={(i % 4) * 80}>
                <article className="card h-full p-6">
                  <h3 className="font-display text-lg font-semibold text-white">{l.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{l.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 max-w-3xl border-l-2 border-[#FCC200]/60 pl-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">{c.tributeTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.tribute}</p>
          </Reveal>
        </div>
      </section>

      {/* Download */}
      <section id="telecharger" className="relative scroll-mt-20 border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading path={c.dlPath} title={c.dlTitle} sub={c.dlSub} />
            <Reveal className="card mt-8 p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-2xl font-semibold text-white">
                  {info ? `${c.version} ${info.version}` : c.version}
                </span>
                {info?.date && (
                  <span className="text-sm text-slate-400">
                    {c.published} {formatDate(info.date, lang)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {c.system}
                {info?.size ? ` · ${Math.round(info.size / 1048576)} ${c.size}` : ''}
              </p>
              {info ? (
                <form onSubmit={submit} className="mt-6">
                  <label htmlFor="code" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {c.codeLabel}
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        id="code"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                          if (state === 'bad') setState('idle');
                        }}
                        placeholder={c.codePlaceholder}
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        className="w-full rounded-xl border border-white/10 bg-ink py-3 pl-10 pr-4 text-sm uppercase tracking-wider text-white placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:border-brand-mint/60 focus:outline-none"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary justify-center" disabled={state === 'checking'}>
                      <Download className="h-4 w-4" /> {state === 'checking' ? c.checking : c.download}
                    </button>
                  </div>
                  {state === 'bad' && (
                    <p className="mt-3 text-sm text-rose-300" role="alert">
                      {c.badCode}
                    </p>
                  )}
                </form>
              ) : (
                <p className="mt-6 text-sm text-slate-400">{c.notYet}</p>
              )}
              {info?.notes && info.notes.length > 0 && (
                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.notes}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                    {info.notes.map((n) => (
                      <li key={n} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GAME_YELLOW }} />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>
          <div className="flex flex-col gap-5 lg:pt-24">
            <Reveal className="card p-6">
              <h3 className="font-display text-lg font-semibold text-white">{c.howTitle}</h3>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-400">
                {c.how.map((h, i) => (
                  <li key={h} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    {h}
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal className="card p-6" delay={80}>
              <h3 className="font-display text-lg font-semibold text-white">{c.steamTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{c.steam}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The studio */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-2xl">
              <h2 className="section-title text-2xl md:text-3xl">{c.studioTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{c.studioSub}</p>
            </div>
            <button type="button" data-booking="17-octobre" onClick={() => book('17-octobre')} className="btn btn-primary shrink-0">
              {c.studioCta} <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default GameSections;
