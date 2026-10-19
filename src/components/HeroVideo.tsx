import { Pause, Play } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  lang: 'fr' | 'en';
  className?: string;
}

// Bump when a video file changes: the CDN keeps the old copy otherwise.
const VIDEO_VERSION = '3';
const POSTER = '/videos/hero-poster.jpg';

/** Autoplay is skipped with "reduce motion" or data saver; the poster stays instead. */
function useVideoPolicy() {
  const [allowed, setAllowed] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const wideQuery = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const sync = () => {
      setAllowed(!reduce.matches && !connection?.saveData);
      setWide(wideQuery.matches);
    };
    sync();
    wideQuery.addEventListener?.('change', sync);
    reduce.addEventListener?.('change', sync);
    return () => {
      wideQuery.removeEventListener?.('change', sync);
      reduce.removeEventListener?.('change', sync);
    };
  }, []);

  return { allowed, wide };
}

/**
 * The full 16:9 brand film in its own frame, next to the hero text on large screens
 * and under it on phones. 720p on large screens, a lighter 540p encode on phones.
 *
 * Plays only while on screen. iOS Safari only autoplays a video that is muted before
 * play() is called; React does not reliably set the muted attribute, so it is forced here.
 */
export const HeroVideoCard: React.FC<HeroVideoProps> = ({ lang, className = '' }) => {
  const { allowed, wide } = useVideoPolicy();
  const [ready, setReady] = useState(false);
  // Moving content that lasts more than 5 s must be pausable (RGAA 13.8): the visitor's choice wins
  // over the on-screen autoplay below.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setReady(false), [lang, wide]);

  const togglePause = () => {
    const video = videoRef.current;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (!video) return;
    if (next) video.pause();
    else video.play().catch(() => undefined);
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!allowed || !wrap || !video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    if (typeof IntersectionObserver === 'undefined') {
      if (!pausedRef.current) video.play().catch(() => undefined);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !pausedRef.current) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [allowed, lang, wide]);

  const fr = lang === 'fr';

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-[0_30px_80px_-30px_rgba(10,239,187,0.45)] lg:rounded-3xl lg:shadow-[0_40px_120px_-40px_rgba(10,239,187,0.55)] ${className}`}
    >
      <div className="absolute inset-0" aria-hidden="true">
      <img src={POSTER} alt="" width={1280} height={720} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {allowed && (
        <video
          key={`${lang}-${wide ? 'hd' : 'sd'}`}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
          autoPlay={!paused}
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          onPlaying={() => setReady(true)}
        >
          {wide ? (
            <>
              <source src={`/videos/hero-${lang}.mp4?v=${VIDEO_VERSION}`} type="video/mp4" />
              <source src={`/videos/hero-${lang}.webm?v=${VIDEO_VERSION}`} type="video/webm" />
            </>
          ) : (
            <source src={`/videos/hero-${lang}-540.mp4?v=${VIDEO_VERSION}`} type="video/mp4" />
          )}
        </video>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-brand-mint/20" />
      </div>
      {allowed && (
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={paused}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink/85 text-white backdrop-blur transition-colors hover:border-brand-mint/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint"
          aria-label={paused ? (fr ? 'Lire la vidéo' : 'Play the video') : (fr ? 'Mettre la vidéo en pause' : 'Pause the video')}
        >
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
};

export default HeroVideoCard;
