import React, { useEffect, useRef, useState } from 'react';

export interface LoopVideoSources {
  poster: string;
  /** Large screens (1024 px and up), in order of preference: MP4 first (Chrome on Windows froze on WebM). */
  wide: Array<{ src: string; type: string }>;
  /** Phones and tablets: a lighter 720p MP4. */
  narrow: string;
}

/**
 * A muted, looping product video in a card (the Workspace login loop, the SonorStudio demo). The poster
 * shows first (and in the prerendered HTML); the video plays only while on screen, never with "reduce
 * motion" or data saver. iOS Safari only autoplays a video muted before play(), so it is forced here.
 * On large screens the column can be taller than the 16:9 video: its top and bottom fade into the card.
 */
const LoopVideo: React.FC<{ sources: LoopVideoSources; className?: string }> = ({ sources, className = '' }) => {
  const [allowed, setAllowed] = useState(false);
  const [wide, setWide] = useState(false);
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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

  useEffect(() => setReady(false), [sources, wide]);

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
  }, [allowed, sources, wide]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 flex items-center justify-center bg-[#08090d] ${className}`} aria-hidden="true">
      <div className="relative aspect-video w-full lg:[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]">
        <img src={sources.poster} alt="" width={1280} height={720} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        {allowed && (
          <video
            key={`${sources.poster}-${wide ? 'hd' : 'sd'}`}
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={sources.poster}
            onPlaying={() => setReady(true)}
          >
            {wide ? (
              sources.wide.map((source) => <source key={source.src} src={source.src} type={source.type} />)
            ) : (
              <source src={sources.narrow} type="video/mp4" />
            )}
          </video>
        )}
      </div>
    </div>
  );
};

export default LoopVideo;
