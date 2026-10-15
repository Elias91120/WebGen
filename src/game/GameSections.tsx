/**
 * The /17-octobre page: our video game, from the 3geeks lab. Trailer, what the game is, screenshots, how it was made,
 * and the beta download (free since 14/10, served by the game's file server on the Mac Mini:
 * services/17-octobre, routed by Traefik on /17-octobre/fichiers).
 */
import { ArrowRight, Dices, Download, Flag, Moon, Play, Shield, Smile, Swords, X, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Reveal from '../components/Reveal';
import type { Lang } from '../i18n';
import { GAME_COPY } from './copy';

// Absolute: the file server is routed on www.3geeks.fr, and the page is also served on 3geeks.fr (the canonical URL),
// where a relative path answered the site's own HTML and the download button never showed. The server allows any origin.
const FILES = 'https://www.3geeks.fr/17-octobre/fichiers';
const IMG = '/images/17-octobre';
const GAME_YELLOW = '#FCC200'; // the game's title colour (its own art direction)

const ICONS: Record<string, React.ElementType> = { flag: Flag, shield: Shield, dice: Dices, swords: Swords, moon: Moon, smile: Smile, zap: Zap };

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

/**
 * The beta's download count, live: the file server pushes the total on connect and after each download
 * (Server-Sent Events). Closed while the tab is hidden, reopened when it comes back. Null until known.
 */
function useDownloadCount(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (typeof EventSource === 'undefined') return;
    let es: EventSource | null = null;
    let retry: number | undefined;
    const open = () => {
      if (es || document.hidden) return;
      const source = new EventSource(`${FILES}/telechargements/direct`);
      source.onmessage = (e) => {
        const n = Number(e.data);
        if (Number.isFinite(n) && n >= 0) setCount(n);
      };
      source.onerror = () => {
        // A dropped stream is retried by the browser itself; an error response (server redeploying) is not.
        if (source.readyState === EventSource.CLOSED && es === source) {
          es = null;
          retry = window.setTimeout(open, 30_000);
        }
      };
      es = source;
    };
    const close = () => {
      window.clearTimeout(retry);
      es?.close();
      es = null;
    };
    const onVisibility = () => (document.hidden ? close() : open());
    open();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      close();
    };
  }, []);

  return count;
}

const DownloadCount: React.FC<{ n: number; lang: Lang; words: string[]; title: string }> = ({ n, lang, words, title }) => {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';
  const word = new Intl.PluralRules(locale).select(n) === 'one' ? words[0] : words[1];
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-slate-400" title={title}>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="live-ring absolute inset-0 rounded-full bg-brand-mint" />
        <span className="relative h-2 w-2 rounded-full bg-brand-mint" />
      </span>
      <span>
        {/* keyed on the number: each new download replays the little rise */}
        <span key={n} className="count-bump font-semibold tabular-nums text-white">
          {n.toLocaleString(locale)}
        </span>{' '}
        {word}
      </span>
    </span>
  );
};

export const GameSections: React.FC<{ lang: Lang; book: (source: string) => void }> = ({ lang, book }) => {
  const c = GAME_COPY[lang];
  const [shot, setShot] = useState<number | null>(null);
  const [info, setInfo] = useState<VersionInfo | null>(null);
  const downloads = useDownloadCount();
  const count = downloads !== null && <DownloadCount n={downloads} lang={lang} words={c.downloads} title={c.downloadsLive} />;

  useEffect(() => {
    fetch(`${FILES}/version.json`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => v && setInfo(v))
      .catch(() => {});
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
            <div className="hero-rise mt-8 flex flex-wrap items-center gap-x-4 gap-y-3" style={{ ['--rise-delay' as string]: '320ms' }}>
              <a href="#telecharger" className="btn btn-primary">
                <Download className="h-4 w-4" /> {c.ctaDownload}
              </a>
              {count}
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
                src="/videos/17-octobre-bande-annonce.mp4"
                poster={`${IMG}/poster-2.jpg`}
                controls
                playsInline
                preload="metadata"
                aria-label={c.trailerLabel}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Two games in one: Les Actes (the original) and the Manif (3D, online) */}
      <section id="deux-jeux" className="relative scroll-mt-20 border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Heading path={c.modesPath} title={c.modesTitle} sub={c.modesSub} />
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {c.modes.map((m, i) => (
              <Reveal key={m.id} delay={i * 100}>
                <article className="card flex h-full flex-col overflow-hidden p-0">
                  <div className="relative bg-black">
                    {m.id === 'manif' ? (
                      <div className="flex items-center justify-center bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(252,194,0,0.16),transparent_70%)] px-6 pt-6">
                        {/* the vertical video, as on a phone: muted, loops, no controls needed */}
                        <video
                          className="block aspect-[9/16] w-full max-w-[280px] rounded-t-2xl border border-b-0 border-white/10 bg-black object-cover"
                          src="/videos/17-octobre-manif.mp4"
                          poster={`${IMG}/manif-poster.jpg`}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          aria-label={c.manifVideoLabel}
                        />
                      </div>
                    ) : (
                      <img
                        src={`${IMG}/melee.webp`}
                        alt={c.gallery.find((g) => g.src === 'melee')?.alt ?? m.title}
                        loading="lazy"
                        className="block aspect-video w-full object-cover"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                    <span
                      className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                      style={m.id === 'manif' ? { background: GAME_YELLOW, color: '#1a1200' } : { background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: GAME_YELLOW }}>{m.kind}</span>
                    <h3 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">{m.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{m.d}</p>
                    <ul className="mt-5 space-y-2 text-sm leading-relaxed text-slate-300">
                      {m.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GAME_YELLOW }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-3 pt-2">
                      <a href="#telecharger" className="btn btn-primary">
                        <Download className="h-4 w-4" /> {c.ctaDownload}
                      </a>
                      <a href={m.id === 'manif' ? '#deux-jeux' : '#bande-annonce'} className="btn btn-ghost">
                        <Play className="h-4 w-4" /> {m.cta}
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What Les Actes are */}
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
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a href={`${FILES}/telecharger`} className="btn btn-primary justify-center whitespace-normal text-center" download>
                    <Download className="h-4 w-4" /> {c.download}
                    {/* the size is also on the line above: dropped on phones, where it pushed the button past the card */}
                    {info.size ? <span className="hidden opacity-70 sm:inline">· {Math.round(info.size / 1048576)} {c.size}</span> : null}
                  </a>
                  {count}
                </div>
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
