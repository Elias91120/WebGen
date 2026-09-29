import React, { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  lang: 'fr' | 'en';
}

/**
 * Vidéo de marque 3geeks en fond du hero.
 * - Une version par langue (la boucle démarre et finit sur du noir : la reprise ne se voit pas).
 * - Occupe la moitié droite du hero (la vidéo contient son propre slogan : il ne doit pas
 *   se superposer au titre de la page) avec un fondu vers la gauche.
 * - Sur mobile/tablette, l'image d'attente remplit tout le hero (recadrée, centrée sur le logo).
 * - Chargée uniquement sur grand écran, sans « réduire les animations » ni économiseur de données.
 *   Ailleurs, l'image d'attente (poster) prend le relais.
 * - Mise en pause dès que le hero sort de l'écran.
 */
const HeroVideo: React.FC<HeroVideoProps> = ({ lang }) => {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const wide = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const sync = () => setAllowed(wide.matches && !reduce.matches && !connection?.saveData);
    sync();
    wide.addEventListener?.('change', sync);
    reduce.addEventListener?.('change', sync);
    return () => {
      wide.removeEventListener?.('change', sync);
      reduce.removeEventListener?.('change', sync);
    };
  }, []);

  useEffect(() => {
    setReady(false);
  }, [lang]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!allowed || !wrap || !video || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [allowed, lang]);

  return (
    <div ref={wrapRef} className="hero-media absolute inset-y-0 right-0 w-full overflow-hidden lg:-right-[3%] lg:w-[60%]" aria-hidden="true">
      <img
        src="/videos/hero-poster.jpg"
        alt=""
        width={1280}
        height={720}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[62%_50%] opacity-80 lg:object-contain lg:object-center lg:opacity-60"
      />
      {allowed && (
        <video
          key={lang}
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-1000 ${
            ready ? 'opacity-90' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
          onPlaying={() => setReady(true)}
        >
          <source src={`/videos/hero-${lang}.mp4`} type="video/mp4" />
          <source src={`/videos/hero-${lang}.webm`} type="video/webm" />
        </video>
      )}
    </div>
  );
};

export default HeroVideo;
