import React, { useEffect, useRef, useState } from 'react';

// Bump when a file in public/videos/workspace changes: the CDN keeps the old copy otherwise.
const VIDEO_VERSION = '1';
const DIR = '/videos/workspace';

/**
 * The login loop of workspace.3geeks.fr (25 s, copied into public/videos/workspace so the site does not
 * depend on Workspace being up): project cards that fill up, in the visitor's language. The poster shows
 * first (and in the prerendered HTML); the video plays only while on screen, never with "reduce motion"
 * or data saver, and in 720p on screens under 1024 px. Same autoplay rules as HeroVideoCard for iOS.
 */
const WorkspaceLoop: React.FC<{ lang: 'fr' | 'en'; className?: string }> = ({ lang, className = '' }) => {
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

  const poster = `${DIR}/loop-${lang}-poster.jpg?v=${VIDEO_VERSION}`;
  return (
    <div ref={wrapRef} className={`absolute inset-0 flex items-center justify-center bg-[#08090d] ${className}`} aria-hidden="true">
      {/* On large screens the column is taller than the 16:9 video: its top and bottom fade into the card. */}
      <div className="relative aspect-video w-full lg:[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]">
        <img src={poster} alt="" width={1280} height={720} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        {allowed && (
          <video
            key={`${lang}-${wide ? 'hd' : 'sd'}`}
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onPlaying={() => setReady(true)}
          >
            {wide ? (
              <>
                {/* MP4 first, as on Workspace: Chrome on Windows froze on the first frame of the WebM. */}
                <source src={`${DIR}/loop-${lang}.mp4?v=${VIDEO_VERSION}`} type="video/mp4" />
                <source src={`${DIR}/loop-${lang}.webm?v=${VIDEO_VERSION}`} type="video/webm" />
              </>
            ) : (
              <source src={`${DIR}/loop-${lang}-720.mp4?v=${VIDEO_VERSION}`} type="video/mp4" />
            )}
          </video>
        )}
      </div>
    </div>
  );
};

export default WorkspaceLoop;
