/**
 * La fenêtre de Geeks Code, redessinée pour la page : barre de titre, conditions « fini quand », puis l'éditeur,
 * la salle des agents ou la page des jalons, le panneau de l'assistant avec Geeko, et la barre d'état.
 * C'est une maquette (l'exemple est fictif), pilotée par une « scène » : la démonstration en enchaîne plusieurs,
 * « à vos couleurs » en garde une seule sous un autre nom et d'autres couleurs (--gc-a et --gc-b, dans le CSS).
 */
import { ArrowUp, Check, Files, GitBranch, Mail, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import { Mark } from '../components/Logo';
import type { GeekoPalette } from '../geeko/geeko';
import type { Lang } from '../i18n';
import { CODE, DEMO } from './copy';
import GeekoStage from './GeekoStage';

export const EASE = [0.22, 1, 0.36, 1] as const;

export interface Scene {
  view: 'editor' | 'room' | 'plan' | 'done';
  /** Combien de conditions sont cochées. */
  ticks: number;
  prompt: 'empty' | 'typing' | 'sent';
  /** Combien de lignes l'assistant a dites ; la dernière tourne encore tant que `busy`. */
  said: number;
  busy?: boolean;
  /** Le bloc écrit par l'IA : absent, en train de s'écrire, ou déjà là. */
  code?: 'typing' | 'there';
  tested?: boolean;
  /** La variante de Geeko dans le panneau de l'assistant. */
  geeko: string;
  /** Salle des agents : la suite du travail. */
  later?: boolean;
  mail?: boolean;
  /** Page des jalons : où va le pointeur, et s'il clique. */
  pointer?: 'box' | 'button';
  click?: boolean;
}

export interface Brand {
  name: string;
  /** L'initiale dans la pastille ; sans elle, le « 3 » de 3geeks. */
  initial?: string;
}

const TickBox: React.FC = () => (
  <span className="gc-box">
    <Check strokeWidth={4} />
  </span>
);

// La coloration du code : commentaires, chaînes, mots-clés, nombres, types, appels. Le reste passe tel quel.
const SYNTAX = /(?<c>\/\/.*$)|(?<s>"[^"]*")|\b(?<k>export|async|function|const|await|return)\b|\b(?<n>\d+)\b|\b(?<t>[A-Z][A-Za-z]+)\b|\b(?<f>[a-zA-Z_]\w*)(?=\()/g;

function paint(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let at = 0;
  for (const match of line.matchAll(SYNTAX)) {
    const start = match.index ?? 0;
    if (start > at) out.push(line.slice(at, start));
    const kind = Object.keys(match.groups ?? {}).find((key) => match.groups?.[key] !== undefined);
    out.push(
      <span key={start} className={`gc-${kind}`}>
        {match[0]}
      </span>,
    );
    at = start + match[0].length;
  }
  if (at < line.length) out.push(line.slice(at));
  return out;
}

const Editor: React.FC<{ lang: Lang; scene: Scene }> = ({ lang, scene }) => {
  const code = CODE[lang];
  return (
    <div className="gc-editor">
      <div className="gc-tabs">
        <span className="gc-tab is-on">{code.file}</span>
        <span className="gc-tab">{code.other}</span>
      </div>
      <div className="gc-code">
        {code.head.map((line, i) => (
          <div key={i} className={`gc-line ${i < 4 ? 'gc-line-extra' : ''}`}>
            <span className="gc-no">{i + 5}</span>
            <span>{paint(line)}</span>
          </div>
        ))}
        {scene.code && (
          <div className={`gc-ai-block ${scene.code === 'typing' ? 'is-typing' : ''}`}>
            <span className="gc-ai-tag">{DEMO[lang].byAi}</span>
            {code.ai.map((line, i) => (
              <div key={i} className="gc-line" style={{ ['--i' as string]: i }}>
                <span className="gc-no">{i + 14}</span>
                <span className="gc-typed">{paint(line)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Trois bureaux : celui qui écrit, celui qui teste, celui qui relit. Chacun change de geste quand le travail avance.
const DESK_GEEKO: Array<[string, string]> = [
  ['deux-doigts', 'deux-doigts'],
  ['console', 'yo'],
  ['cafe', 'loupe'],
];

const Room: React.FC<{ lang: Lang; scene: Scene; palette: GeekoPalette }> = ({ lang, scene, palette }) => {
  const t = DEMO[lang];
  return (
    <div className="gc-room">
      <p className="gc-view-title">{t.room}</p>
      <div className="gc-desks">
        {t.desks.map((desk, i) => (
          <motion.div
            key={desk.name}
            className="gc-desk"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 + i * 0.08, ease: EASE }}
          >
            <span className="gc-desk-name">{desk.name}</span>
            <GeekoStage lang={lang} variant={DESK_GEEKO[i][scene.later ? 1 : 0]} palette={palette} className="gc-desk-geeko" />
            <span className="gc-desk-does">{scene.later ? desk.then : desk.first}</span>
          </motion.div>
        ))}
      </div>
      <div className="gc-toast-row">
        <AnimatePresence>
          {scene.mail && (
            <motion.div
              className="gc-toast"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="gc-toast-icon">
                <Mail />
              </span>
              <span>
                <b>{t.mail.t}</b>
                <small>{t.mail.d}</small>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Plan: React.FC<{ lang: Lang; scene: Scene }> = ({ lang, scene }) => {
  const t = DEMO[lang];
  const root = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);
  const ready = scene.ticks >= t.conditions.length;

  // Le pointeur va se poser pile sur la case, puis sur le bouton : leur place est mesurée, pas devinée.
  useEffect(() => {
    const frame = root.current;
    const target = frame?.querySelector<HTMLElement>(`[data-spot="${scene.pointer ?? 'rest'}"]`);
    if (!frame || !target) return;
    const from = frame.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    setSpot({ x: to.left - from.left + to.width / 2, y: to.top - from.top + to.height / 2 });
  }, [scene.pointer]);

  return (
    <div ref={root} className="gc-plan">
      <p className="gc-view-title">{t.plan}</p>
      <div className="gc-plan-card">
        <h4>{t.milestone}</h4>
        <p className="gc-plan-label">{t.doneWhen}</p>
        <ul>
          {t.conditions.map((condition, i) => (
            <li key={condition} data-on={i < scene.ticks ? '' : undefined}>
              <span data-spot={i === t.conditions.length - 1 ? 'box' : undefined} className="gc-spot">
                <TickBox />
              </span>
              {condition}
            </li>
          ))}
        </ul>
        <span
          className="gc-approve"
          data-spot="button"
          data-ready={ready ? '' : undefined}
          data-pressed={scene.pointer === 'button' && scene.click ? '' : undefined}
        >
          {t.approve}
        </span>
      </div>
      <span data-spot="rest" className="gc-pointer-rest" />
      {spot && (
        <motion.span className="gc-pointer" initial={false} animate={{ x: spot.x, y: spot.y }} transition={{ duration: 0.6, ease: EASE }}>
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 1.5v13l3.6-3.2 2.4 5 2.3-1.1-2.4-4.9h4.8z" fill="#f8fafc" stroke="#08090d" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          {scene.click && <span key={scene.pointer} className="gc-click" />}
        </motion.span>
      )}
    </div>
  );
};

// Des confettis en pixels : leur direction vient de leur rang, pour que le serveur et le navigateur dessinent les mêmes.
const CONFETTI = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 2) * 0.3;
  const reach = 70 + ((i * 37) % 60);
  return { dx: Math.round(Math.cos(angle) * reach), dy: Math.round(Math.sin(angle) * reach * 0.8), r: ((i * 53) % 180) - 90 };
});

const Done: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = DEMO[lang];
  return (
    <div className="gc-done">
      <span className="gc-confetti">
        {CONFETTI.map((piece, i) => (
          <i key={i} style={{ ['--i' as string]: i, ['--dx' as string]: `${piece.dx}px`, ['--dy' as string]: `${piece.dy}px`, ['--r' as string]: `${piece.r}deg` }} />
        ))}
      </span>
      <motion.span
        className="gc-done-check"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 17 }}
      >
        <Check strokeWidth={3.5} />
      </motion.span>
      <motion.strong initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15, ease: EASE }}>
        {t.approved}
      </motion.strong>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
        {t.milestone}
      </motion.span>
      <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.9 }}>
        {t.next}
      </motion.small>
    </div>
  );
};

const Assistant: React.FC<{ lang: Lang; scene: Scene; palette: GeekoPalette; typed: string }> = ({ lang, scene, palette, typed }) => {
  const t = DEMO[lang];
  // Comme une conversation qui défile : les quatre dernières lignes restent.
  const first = Math.max(0, scene.said - 4);
  const lines = t.lines.slice(first, scene.said);
  return (
    <div className="gc-ai">
      <p className="gc-ai-head">
        <span className="gc-dot" data-busy={scene.busy ? '' : undefined} />
        {t.assistant}
      </p>
      <div className="gc-ai-talk">
        <AnimatePresence initial={false} mode="popLayout">
          {scene.prompt === 'sent' && scene.said <= 4 && (
            <motion.p
              key="ask"
              layout
              className="gc-ask"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {t.prompt}
            </motion.p>
          )}
          {lines.map((line, i) => {
            const index = first + i;
            const busy = index === scene.said - 1 && scene.busy;
            return (
              <motion.p
                key={index}
                layout
                className="gc-said"
                data-state={busy ? 'busy' : 'done'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <i>{busy ? '●' : '✓'}</i>
                {line}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </div>
      <GeekoStage lang={lang} variant={scene.geeko} palette={palette} className="gc-ai-geeko" />
      <div className="gc-prompt" data-on={scene.prompt === 'typing' ? '' : undefined}>
        <span>
          {scene.prompt === 'typing' ? typed : t.placeholder}
          {scene.prompt === 'typing' && <span className="gc-caret" />}
        </span>
        <span className="gc-send">
          <ArrowUp strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
};

interface IdeMockProps {
  lang: Lang;
  scene: Scene;
  /** Sous un autre nom (« à vos couleurs ») ; sans elle, Geeks Code. */
  brand?: Brand;
  palette?: GeekoPalette;
  /** La demande en train de s'écrire. */
  typed?: string;
  user?: string;
  className?: string;
  style?: React.CSSProperties;
}

const IdeMock: React.FC<IdeMockProps> = ({ lang, scene, brand, palette = 'normal', typed = '', user, className = '', style }) => {
  const t = DEMO[lang];
  const done = scene.view === 'done';
  const short = t.milestone.split(' — ')[0];
  return (
    <div className={`gc-ide ${className}`} style={style} aria-hidden="true">
      <div className="gc-title">
        <span className="gc-lights">
          <i />
          <i />
          <i />
        </span>
        <span className="gc-brand">
          {brand?.initial ? <span className="gc-mark">{brand.initial}</span> : <Mark className="h-4" />}
          <b>{brand?.name ?? 'Geeks Code'}</b>
        </span>
        <span className="gc-project">{t.project}</span>
        <span className="gc-grow" />
        <span className="gc-milestone">◆ {t.milestone}</span>
      </div>

      <div className="gc-hud">
        <span className="gc-hud-label">{t.doneWhen}</span>
        <ul>
          {t.conditions.map((condition, i) => (
            <li key={condition} data-on={i < scene.ticks ? '' : undefined}>
              <TickBox />
              {condition}
            </li>
          ))}
        </ul>
      </div>

      <div className="gc-body">
        <div className="gc-side">
          <Files />
          <Search />
          <GitBranch />
          {brand?.initial ? <span className="gc-mark is-on">{brand.initial}</span> : <Mark className="h-4" />}
        </div>
        <div className="gc-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={scene.view}
              className="gc-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {scene.view === 'editor' && <Editor lang={lang} scene={scene} />}
              {scene.view === 'room' && <Room lang={lang} scene={scene} palette={palette} />}
              {scene.view === 'plan' && <Plan lang={lang} scene={scene} />}
              {scene.view === 'done' && <Done lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <Assistant lang={lang} scene={scene} palette={palette} typed={typed} />
      </div>

      <div className="gc-status">
        <span className="gc-status-item">
          <GitBranch /> main
        </span>
        {scene.tested && <span className="gc-status-item gc-status-ok">✓ 12/12</span>}
        <span className="gc-grow" />
        <span className="gc-status-chip">{done ? `✓ ${short} ${t.ended}` : `◆ ${short} ${t.running}`}</span>
        <span className="gc-status-item">{user ?? t.user}</span>
      </div>
    </div>
  );
};

export default IdeMock;
