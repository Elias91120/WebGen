/**
 * Les blocs animés de la page /realisations/geeks-code, rangés sous le nom que leur donne src/content/pages.ts
 * (les sections de type « custom », et « hero » pour le haut de page). Ils ont leur propre entrée
 * (src/pages/entries/geeks-code.tsx) : les autres pages de contenu ne les chargent pas.
 */
import React, { useEffect, useState } from 'react';

import type { ContentBlocks } from '../content/ContentPage';
import type { Lang } from '../i18n';
import Brand from './Brand';
import { HERO } from './copy';
import Demo from './Demo';
import Gallery from './Gallery';
import GeekoStage from './GeekoStage';
import './geeks-code.css';

const HELLO_MS = 4200;

/** Le haut de page : Geeko arrive à pied, se tourne vers nous, salue, puis sort son PC et se met au travail. */
const HeroGeeko: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [phase, setPhase] = useState<'wait' | 'walk' | 'hello' | 'work'>('wait');

  useEffect(() => {
    if (phase !== 'hello') return;
    const id = window.setTimeout(() => setPhase('work'), HELLO_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  return (
    <div
      className="gc-hero-geeko"
      data-phase={phase}
      // (ses propres animations remontent jusqu'ici : seule la fin de la marche compte)
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName.startsWith('gc-walk-in')) setPhase('hello');
      }}
    >
      <GeekoStage
        lang={lang}
        variant={phase === 'work' ? 'deux-doigts' : phase === 'hello' ? 'coucou' : 'marche'}
        secrets
        onLive={(live) => setPhase((now) => (live && now === 'wait' ? 'walk' : now))}
      />
      {phase === 'hello' && (
        <span className="gc-hello" aria-hidden="true">
          {HERO[lang].hello}
        </span>
      )}
    </div>
  );
};

export const GEEKS_CODE_BLOCKS: ContentBlocks = {
  hero: ({ lang }) => <HeroGeeko lang={lang} />,
  demo: ({ lang }) => <Demo lang={lang} />,
  geeko: ({ lang }) => <Gallery lang={lang} />,
  entreprise: ({ lang, book }) => <Brand lang={lang} book={book} />,
};
