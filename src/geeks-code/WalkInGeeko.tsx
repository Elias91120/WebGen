/**
 * Geeko arrive à pied, se tourne vers nous, salue, puis sort son PC et se met au travail : en haut de la page
 * Geeks Code, et dans la carte Geeks Code de l'accueil. Chaque endroit donne en CSS sa place, sa taille et sa marche
 * (une animation dont le nom commence par « gc-walk-in », à 54 unités par seconde) ; le reste est dans geeko-stage.css.
 */
import React, { useEffect, useState } from 'react';

import type { Lang } from '../i18n';
import GeekoStage from './GeekoStage';

const HELLO_MS = 4200;

const WalkInGeeko: React.FC<{ lang: Lang; hello: string; className: string }> = ({ lang, hello, className }) => {
  const [phase, setPhase] = useState<'wait' | 'walk' | 'hello' | 'work'>('wait');

  useEffect(() => {
    if (phase !== 'hello') return;
    const id = window.setTimeout(() => setPhase('work'), HELLO_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  return (
    <div
      className={`gc-walker ${className}`}
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
          {hello}
        </span>
      )}
    </div>
  );
};

export default WalkInGeeko;
