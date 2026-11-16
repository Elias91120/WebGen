/**
 * Les blocs animés de la page /realisations/geeks-code, rangés sous le nom que leur donne src/content/pages.ts
 * (les sections de type « custom », et « hero » pour le haut de page). Ils ont leur propre entrée
 * (src/pages/entries/geeks-code.tsx) : les autres pages de contenu ne les chargent pas.
 */
import React from 'react';

import type { ContentBlocks } from '../content/ContentPage';
import Brand from './Brand';
import { HERO } from './copy';
import Demo from './Demo';
import Gallery from './Gallery';
import WalkInGeeko from './WalkInGeeko';
import './geeks-code.css';

export const GEEKS_CODE_BLOCKS: ContentBlocks = {
  // Le haut de page : Geeko arrive à pied, salue, puis se met au travail.
  hero: ({ lang }) => <WalkInGeeko lang={lang} hello={HERO[lang].hello} className="gc-hero-geeko" />,
  demo: ({ lang }) => <Demo lang={lang} />,
  geeko: ({ lang }) => <Gallery lang={lang} />,
  entreprise: ({ lang, book }) => <Brand lang={lang} book={book} />,
};
