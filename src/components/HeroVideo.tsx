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
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setReady(false), [lang, wide]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!allowed || !wrap || !video) return;
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
  }, [allowed, lang, wide]);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-[0_30px_80px_-30px_rgba(10,239,187,0.45)] lg:rounded-3xl lg:shadow-[0_40px_120px_-40px_rgba(10,239,187,0.55)] ${className}`}
      aria-hidden="true"
    >
      <img src={POSTER} alt="" width={1280} height={720} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {allowed && (
        <video
          key={`${lang}-${wide ? 'hd' : 'sd'}`}
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
  );
};

export default HeroVideoCard;
