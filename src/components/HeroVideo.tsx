import React, { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  lang: 'fr' | 'en';
}

// Bump when a video file changes: the CDN keeps the old copy otherwise.
const VIDEO_VERSION = '2';
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
 * Plays the video only while it is on screen. iOS Safari only autoplays a video that is
 * muted before play() is called; React does not reliably set the muted attribute, so it is
 * forced here.
 */
function useAutoplayWhenVisible(
  wrapRef: React.RefObject<HTMLDivElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  active: boolean,
  deps: unknown[],
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!active || !wrap || !video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    if (typeof IntersectionObserver === 'undefined') {
      video.play().catch(() => undefined);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(wrap);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ...deps]);
}

/**
 * Large screens: brand video in the right half of the hero (the video carries its own
 * slogan, so it must not sit under the page title), faded into the page on every edge.
 */
const HeroVideo: React.FC<HeroVideoProps> = ({ lang }) => {
  const { allowed, wide } = useVideoPolicy();
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = allowed && wide;

  useEffect(() => setReady(false), [lang]);
  useAutoplayWhenVisible(wrapRef, videoRef, active, [lang]);

  return (
    <div ref={wrapRef} className="hero-media absolute inset-y-0 -right-[3%] hidden w-[60%] overflow-hidden lg:block" aria-hidden="true">
      <img
        src={POSTER}
        alt=""
        width={1280}
        height={720}
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain object-center opacity-60"
      />
      {active && (
        <video
          key={lang}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ${ready ? 'opacity-90' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          onPlaying={() => setReady(true)}
        >
          <source src={`/videos/hero-${lang}.mp4?v=${VIDEO_VERSION}`} type="video/mp4" />
          <source src={`/videos/hero-${lang}.webm?v=${VIDEO_VERSION}`} type="video/webm" />
        </video>
      )}
    </div>
  );
};

/**
 * Phones and tablets: the full 16:9 brand video in its own frame under the hero text,
 * instead of a cropped background that cut words off behind the title.
 */
export const HeroVideoCard: React.FC<HeroVideoProps & { className?: string }> = ({ lang, className = '' }) => {
  const { allowed, wide } = useVideoPolicy();
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = allowed && !wide;

  useEffect(() => setReady(false), [lang]);
  useAutoplayWhenVisible(wrapRef, videoRef, active, [lang]);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-[0_30px_80px_-30px_rgba(10,239,187,0.45)] lg:hidden ${className}`}
      aria-hidden="true"
    >
      <img src={POSTER} alt="" width={1280} height={720} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {active && (
        <video
          key={lang}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          onPlaying={() => setReady(true)}
        >
          <source src={`/videos/hero-${lang}-540.mp4?v=${VIDEO_VERSION}`} type="video/mp4" />
        </video>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-mint/20" />
    </div>
  );
};

export default HeroVideo;
