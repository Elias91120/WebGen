/**
 * The /17-octobre page: our video game, from the 3geeks lab. Trailer, what the game is, screenshots, how it was made,
 * and the beta download (free since 14/10, served by the game's file server on the Mac Mini:
 * services/17-octobre, routed by Traefik on /17-octobre/fichiers).
 */
import { Apple, ArrowRight, Dices, Download, Flag, Instagram, Moon, Play, Shield, Smile, Sparkles, Swords, X, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import Reveal from '../components/Reveal';
import type { Lang } from '../i18n';
import { GAME_COPY } from './copy';

// Absolute: the file server is routed on www.3geeks.fr, and the page is also served on 3geeks.fr (the canonical URL),
// where a relative path answered the site's own HTML and the download button never showed. The server allows any origin.
const FILES = 'https://www.3geeks.fr/17-octobre/fichiers';
// The backup site (3geeks-secours.vercel.app, scripts/secours.ps1) carries a snapshot of the last version and of the
// download count, with a mirror of the zip (a release of this repo): when the Mac Mini is down, the page still shows
// the version and its download button. Only the backup has it; on the main site the file server answers first.
const SNAPSHOT = '/secours/17-octobre.json';
// The mirror's downloads (GitHub counts them) are added to the server's: none is lost while the Mac Mini is down.
const MIRROR_RELEASES = 'https://api.github.com/repos/Elias91120/WebGen/releases?per_page=30';
const IMG = '/images/17-octobre';
const GAME_YELLOW = '#FCC200'; // the game's title colour (its own art direction)

const ICONS: Record<string, React.ElementType> = { flag: Flag, shield: Shield, dice: Dices, swords: Swords, moon: Moon, smile: Smile, zap: Zap };

interface VersionInfo {
  version: string;
  date?: string;
  size?: number;
  notes?: string[];
  titre?: string;
  video_mp4?: string; // the version's video on the file server ("actus/actus_0.12.0.mp4"), since 0.12.0
  // Both platforms, since the Mac release. "file" and "size" above stay the Windows zip, so a client from before
  // it (the 0.13.0 game's update notice, an old cached page) keeps working untouched.
  fichiers?: { windows?: { file: string; size: number }; macos?: { file: string; size: number } };
  miroir?: string; // the backup's snapshot only: the zip's mirror, a release of this repo on GitHub
  telechargements?: number; // the backup's snapshot only: the server's count when the snapshot was taken
}

/** Les quatre carreaux de Windows, dessinés : une forme géométrique, pas un logo repris d'ailleurs. */
const WindowsMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M3 5.6 10.4 4.5v7.2H3V5.6Zm0 12.8 7.4 1.1v-7.1H3v6Zm8.6-14 9.4-1.4v8.7h-9.4V4.4Zm9.4 9.3V22l-9.4-1.4v-6.9H21Z" />
  </svg>
);

/**
 * Une plateforme sur la page de téléchargement : sa marque, son nom, ce qu'il lui faut, son poids, son bouton, et
 * ce qui se passe au premier lancement — la question que tout le monde se pose avant de cliquer.
 */
const PlatformCard: React.FC<{
  mark: React.ReactNode; name: string; needs: string; size: number; href: string; cta: string; note: string; unit: string;
}> = ({ mark, name, needs, size, href, cta, note, unit }) => (
  <div className="flex flex-col rounded-xl border border-white/[0.09] bg-white/[0.02] p-5">
    <div className="flex items-center gap-3">
      <span className="text-white/90">{mark}</span>
      <span className="font-display text-xl font-semibold text-white">{name}</span>
    </div>
    <p className="mt-2 text-xs leading-relaxed text-slate-400">{needs}</p>
    <a href={href} className="btn btn-primary mt-4 w-full justify-center whitespace-normal text-center" download>
      <Download className="h-4 w-4" /> {cta}
      <span className="whitespace-nowrap opacity-70">· {Math.round(size / 1048576)} {unit}</span>
    </a>
    <p className="mt-3 text-xs leading-relaxed text-slate-500">{note}</p>
  </div>
);

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * A number that counts up to its target the first time it is known (1.6 s, eased), then glides to each new value
 * (the live download counter: each download moves it on). Null until the target is known.
 */
function useCountUp(target: number | null, ms = 1600): number | null {
  const [value, setValue] = useState<number | null>(null);
  const from = useRef(0);
  useEffect(() => {
    if (target === null) return;
    if (reducedMotion()) {
      from.current = target;
      setValue(target);
      return;
    }
    const a = from.current;
    const duration = a === 0 ? ms : 450;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(a + (target - a) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

/** One figure of the hero strip: a big number that counts up, and what it counts. */
const Stat: React.FC<{ n: number | null; label: string; lang: Lang; prefix?: string; suffix?: string; live?: boolean }> = ({
  n,
  label,
  lang,
  prefix = '',
  suffix = '',
  live = false,
}) => {
  const v = useCountUp(n);
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';
  return (
    <div className="stat-tile">
      <span className="flex items-center gap-2">
        <span className="font-display text-3xl font-bold tabular-nums sm:text-4xl" style={{ color: GAME_YELLOW }}>
          {v === null ? '…' : `${prefix}${v.toLocaleString(locale)}${suffix}`}
        </span>
        {live && (
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="live-ring absolute inset-0 rounded-full bg-brand-mint" />
            <span className="relative h-2 w-2 rounded-full bg-brand-mint" />
          </span>
        )}
      </span>
      <span className="mt-1 block text-xs uppercase tracking-wider text-slate-400">{label}</span>
    </div>
  );
};

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
    // (sans le direct, un navigateur qui le bloque, un proxy : le total une fois, quand même)
    fetch(`${FILES}/telechargements`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const n = Number(d?.total);
        if (Number.isFinite(n) && n >= 0) setCount((c) => (c === null ? n : c));
      })
      .catch(() => {});
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      close();
    };
  }, []);

  return count;
}

/** The downloads of the zip's mirror (the 17-octobre-* releases of this repo, counted by GitHub); 0 until known. */
function useMirrorCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch(MIRROR_RELEASES, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : []))
      .then((releases: Array<{ tag_name?: string; assets?: Array<{ name?: string; download_count?: number }> }>) => {
        let total = 0;
        for (const release of Array.isArray(releases) ? releases : []) {
          if (!release.tag_name?.startsWith('17-octobre-')) continue;
          for (const asset of release.assets ?? []) if (asset.name?.endsWith('.zip')) total += asset.download_count ?? 0;
        }
        setCount(total);
      })
      .catch(() => {});
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
  const server = useDownloadCount();
  const mirror = useMirrorCount();
  // (the server's live count; when it is down, the backup's snapshot of it; plus the mirror's downloads)
  const base = server ?? info?.telechargements ?? null;
  const downloads = base === null ? null : base + mirror;
  const count = downloads !== null && <DownloadCount n={downloads} lang={lang} words={c.downloads} title={c.downloadsLive} />;
  // the Mac package of this version, when there is one (versions up to 0.13.0 came out for Windows only)
  const mac = info?.fichiers?.macos ?? null;

  useEffect(() => {
    // the file server's version.json; if the Mac Mini does not answer, the backup's snapshot (absent from the main site)
    const snapshot = () =>
      fetch(SNAPSHOT, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
    fetch(`${FILES}/version.json`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : snapshot()))
      .catch(() => snapshot())
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
              className="hero-rise relative mt-4 inline-block font-display text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
              style={{ ['--rise-delay' as string]: '140ms' }}
            >
              <span className="title-shine">{c.title}</span>
              {/* « 2026 », tamponné de travers, comme sur l'écran titre du jeu */}
              <span className="stamp-2026 absolute -right-6 -top-5 font-display text-2xl font-bold sm:-right-10 sm:text-3xl" aria-hidden="true">
                2026
              </span>
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
          {/* les chiffres, qui montent jusqu'au vrai nombre (le compteur de téléchargements est en direct) */}
          <div className="hero-rise grid grid-cols-2 gap-3 md:grid-cols-4 lg:col-span-2" style={{ ['--rise-delay' as string]: '440ms' }}>
            <Stat n={downloads} label={c.statDownloads} lang={lang} live />
            <Stat n={c.statViews} label={c.statViewsLabel} lang={lang} prefix="+" />
            <Stat n={3} label={c.statGames} lang={lang} />
            <Stat n={0} label={c.statPrice} lang={lang} suffix=" €" />
          </div>
        </div>
      </section>

      {/* Les revendications de la Campagne, en bande qui défile, comme une banderole */}
      <div className="relative z-10 overflow-hidden py-6" aria-label={c.marqueeLabel}>
        <div className="marquee-band">
          <div className="marquee-track font-display">
            {[...c.marquee, ...c.marquee].map((t, i) => (
              <span key={i} className="flex items-center">
                {t}
                <span className="mx-6 inline-block h-2.5 w-2.5 rotate-45 bg-[#120d00]" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quoi de neuf : la dernière version, sa vidéo (la même que dans le menu du jeu), ce qu'elle change */}
      <section id="nouveautes" className="relative scroll-mt-20 border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
          <Reveal>
            <div className="card overflow-hidden p-0 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
              <video
                className="block aspect-video w-full bg-black"
                src={`/videos/17-octobre-nouveautes.mp4?v=${info?.version ?? '0.13.0'}c`}
                poster={`${IMG}/nouveautes-0130.jpg`}
                controls
                playsInline
                preload="metadata"
                aria-label={c.newsVideoLabel}
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">
                <Sparkles className="mr-1 inline h-3.5 w-3.5" /> {c.newsPath}
                {info ? ` · ${c.version} ${info.version}` : ''}
              </span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{info?.titre ?? c.newsTitle}</h2>
              {info?.date && <p className="mt-3 text-sm text-slate-400">{c.published} {formatDate(info.date, lang)}</p>}
              <p className="mt-4 text-base leading-relaxed text-slate-400">{c.newsSub}</p>
            </Reveal>
            {info?.notes && info.notes.length > 0 && (
              <Reveal className="mt-6" delay={80}>
                <ul className="space-y-2.5 text-sm leading-relaxed text-slate-300 md:text-base">
                  {info.notes.slice(0, 6).map((n) => (
                    <li key={n} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: GAME_YELLOW }} />
                      {n}
                    </li>
                  ))}
                </ul>
                <a href="#telecharger" className="btn btn-primary mt-8">
                  <Download className="h-4 w-4" /> {c.ctaDownload}
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Two games in one: Les Actes (the original) and the Manif (3D, online) */}
      <section id="deux-jeux" className="relative scroll-mt-20 border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Heading path={c.modesPath} title={c.modesTitle} sub={c.modesSub} />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.modes.map((m, i) => (
              <Reveal key={m.id} delay={i * 100}>
                <article className="card flex h-full flex-col overflow-hidden p-0">
                  <div className="relative bg-black">
                    {/* la boucle du mode, la même que sous sa carte dans le menu du jeu : muette, en boucle (Les Actes et la
                        Manif : des parties d'Elias ; la Campagne : son ouverture) */}
                    <video
                      className="block aspect-video w-full bg-black object-cover"
                      src={`/videos/17-octobre-mode-${m.id}.mp4?v=0120b`}
                      poster={m.id === 'actes' ? `${IMG}/melee-640.webp` : m.id === 'manif' ? `${IMG}/manif-horde-640.webp` : `${IMG}/campagne-mumie-640.webp`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={m.videoLabel}
                    />
                    <span
                      className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                      style={m.id !== 'actes' ? { background: GAME_YELLOW, color: '#1a1200' } : { background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
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
                      <a href={m.id === 'actes' ? '#bande-annonce' : '#videos'} className="btn btn-ghost">
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

      {/* L'équipe : Elias et Noam font le jeu, Eden le teste ; tous les trois sont dans la Campagne (leurs têtes modelées,
          rendues en jeu : jamais leurs photos), et le concours pour y entrer */}
      <section id="equipe" className="relative scroll-mt-20 overflow-hidden border-b border-white/5 py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_15%_20%,rgba(252,194,0,0.10),transparent_70%),radial-gradient(ellipse_50%_60%_at_100%_100%,rgba(255,140,38,0.08),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Heading path={c.teamPath} title={c.teamTitle} sub={c.teamSub} />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {c.team.map((t, i) => (
              <Reveal key={t.id} delay={i * 90}>
                <article className="team-card group card h-full overflow-hidden p-0">
                  <div className="relative overflow-hidden bg-[#0a0e1c]">
                    <img
                      src={`${IMG}/equipe-${t.id}.webp`}
                      alt={t.alt}
                      loading="lazy"
                      className="block aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider" style={{ background: GAME_YELLOW, color: '#1a1200' }}>
                      {t.role}
                    </span>
                    {t.note && <span className="absolute bottom-3 right-4 text-[11px] text-white/70">{t.note}</span>}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-3xl font-bold text-white">{t.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.d}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="card mt-8 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8" delay={120}>
            <div className="max-w-3xl">
              <h3 className="font-display text-2xl font-bold" style={{ color: GAME_YELLOW }}>{c.joinTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">{c.join}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{c.joinNote}</p>
            </div>
            <a href="https://www.instagram.com/dix.sept.octobre/" target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">
              <Instagram className="h-4 w-4" /> {c.joinCta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* Les vidéos, en vertical, comme sur un téléphone */}
      <section id="videos" className="relative scroll-mt-20 border-b border-white/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Heading path={c.videosPath} title={c.videosTitle} sub={c.videosSub} />
          <div className="mt-12 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-3">
            {c.videos.map((v, i) => (
              <Reveal key={v.src} delay={i * 90} className="w-full max-w-[300px]">
                <figure className="phone-frame">
                  <video className="block aspect-[9/16] w-full rounded-[1.6rem] bg-black object-cover" src={v.src} poster={v.poster} controls playsInline preload="metadata" aria-label={v.label} />
                </figure>
                <figcaption className="mt-3 text-center text-sm text-slate-300">{v.label}</figcaption>
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
              {info ? (
                <>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{c.pick}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <PlatformCard
                      mark={<WindowsMark className="h-6 w-6" />}
                      name={c.platWindows} needs={c.system} unit={c.size}
                      size={info.fichiers?.windows?.size ?? info.size ?? 0}
                      href={info.miroir ?? `${FILES}/telecharger`}
                      cta={c.download} note={c.openWindows}
                    />
                    {/* The Mac package, when the version has one. The backup site has no mirror of it: there, the
                        card only shows if the file server answered, which is also the only place it can be had. */}
                    {mac && (
                      <PlatformCard
                        mark={<Apple className="h-6 w-6" />}
                        name={c.platMac} needs={c.systemMac} unit={c.size} size={mac.size}
                        href={`${FILES}/telecharger?os=macos`}
                        cta={c.download} note={c.openMac}
                      />
                    )}
                  </div>
                  <div className="mt-5">{count}</div>
                </>
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
