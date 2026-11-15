/**
 * Texts of the animated blocks of /realisations/geeks-code (the page's own texts are in src/content/pages.ts).
 * Same rules as the rest of the site: facts we can prove, and no name of an internal tool. Geeko's animations
 * are listed here with the site's own words (the engine's labels are written for the team).
 */
import type { GeekoActivity, GeekoEgg } from '../geeko/geeko';
import type { Lang } from '../i18n';

type L<T> = Record<Lang, T>;

// ---- The demo: one request followed from the prompt to the approved milestone -------------------------

export const DEMO: L<{
  steps: Array<{ t: string; d: string }>;
  project: string;
  milestone: string;
  next: string;
  doneWhen: string;
  conditions: string[];
  assistant: string;
  placeholder: string;
  prompt: string;
  /** What the assistant says it is doing, in the order of the story. */
  lines: string[];
  byAi: string;
  room: string;
  desks: Array<{ name: string; first: string; then: string }>;
  mail: { t: string; d: string };
  plan: string;
  approve: string;
  approved: string;
  running: string;
  ended: string;
  user: string;
  pause: string;
  play: string;
  note: string;
}> = {
  fr: {
    steps: [
      { t: 'On décrit ce qu’on veut', d: 'Une phrase suffit. La demande est rattachée au jalon en cours et à ses trois conditions « fini quand ».' },
      { t: 'L’IA travaille, Geeko le montre', d: 'Elle réfléchit, lit le projet, écrit le code. Pas de journal à déchiffrer : Geeko fait ce qu’elle fait.' },
      { t: 'Une équipe d’agents prend le relais', d: 'Pour les gros chantiers, plusieurs agents se répartissent le travail : l’un écrit, l’autre teste, un troisième relit.' },
      { t: 'On vérifie, condition par condition', d: 'Les tests passent, le reçu arrive : les coches se font une à une. La dernière, c’est une personne qui la pose.' },
      { t: 'Jalon validé', d: 'Trois coches, une validation humaine : le jalon est fini pour de bon. On passe au suivant.' },
    ],
    project: 'boutique',
    milestone: 'J3 — Le paiement',
    next: 'Suivant : J4 — La livraison',
    doneWhen: 'Fini quand',
    conditions: ['Un achat test passe', 'Le reçu arrive par e-mail', 'Un refus est bien expliqué'],
    assistant: 'Assistant IA',
    placeholder: 'Décrivez ce que vous voulez…',
    prompt: 'Ajoute le paiement au panier',
    lines: [
      'Je réfléchis au plan…',
      'Je lis PLAN.md et panier.ts',
      'J’écris paiement.ts',
      'Tests : 12 sur 12',
      'Je lance l’équipe : 3 agents',
      'Le reçu est parti par e-mail',
      'Dernier point : à vous de vérifier',
      'Jalon validé',
    ],
    byAi: 'Écrit par l’IA',
    room: 'Salle des agents',
    desks: [
      { name: 'Code', first: 'écrit recu.ts', then: 'écrit refus.ts' },
      { name: 'Tests', first: 'lance les tests', then: '12 sur 12' },
      { name: 'Relecture', first: 'attend le code', then: 'relit le paiement' },
    ],
    mail: { t: 'Le reçu est parti', d: 'E-mail de test bien reçu' },
    plan: 'Jalons',
    approve: 'Valider le jalon',
    approved: 'Jalon validé',
    running: 'en cours',
    ended: 'validé',
    user: 'Camille',
    pause: 'Mettre la démonstration en pause',
    play: 'Relancer la démonstration',
    note: 'Démonstration simplifiée, dessinée pour cette page. L’exemple (une boutique en ligne) est fictif.',
  },
  en: {
    steps: [
      { t: 'You describe what you want', d: 'One sentence is enough. The request is tied to the current milestone and its three “done when” conditions.' },
      { t: 'AI works, Geeko shows it', d: 'It thinks, reads the project, writes the code. No log to decipher: Geeko does what it does.' },
      { t: 'A team of agents takes over', d: 'For big jobs, several agents split the work: one writes, one tests, a third reviews.' },
      { t: 'You check, condition by condition', d: 'Tests pass, the receipt arrives: boxes get ticked one by one. The last one is ticked by a person.' },
      { t: 'Milestone approved', d: 'Three ticks, one human approval: the milestone is done for good. On to the next one.' },
    ],
    project: 'shop',
    milestone: 'M3 — Payment',
    next: 'Next: M4 — Delivery',
    doneWhen: 'Done when',
    conditions: ['A test purchase goes through', 'The receipt arrives by e-mail', 'A declined payment is explained'],
    assistant: 'AI assistant',
    placeholder: 'Describe what you want…',
    prompt: 'Add payment to the cart',
    lines: [
      'Thinking about the plan…',
      'Reading PLAN.md and cart.ts',
      'Writing payment.ts',
      'Tests: 12 out of 12',
      'Starting the team: 3 agents',
      'The receipt went out by e-mail',
      'Last point: yours to check',
      'Milestone approved',
    ],
    byAi: 'Written by AI',
    room: 'Agents room',
    desks: [
      { name: 'Code', first: 'writes receipt.ts', then: 'writes decline.ts' },
      { name: 'Tests', first: 'runs the tests', then: '12 out of 12' },
      { name: 'Review', first: 'waits for the code', then: 'reviews the payment' },
    ],
    mail: { t: 'The receipt went out', d: 'Test e-mail received' },
    plan: 'Milestones',
    approve: 'Approve the milestone',
    approved: 'Milestone approved',
    running: 'in progress',
    ended: 'approved',
    user: 'Camille',
    pause: 'Pause the demo',
    play: 'Play the demo again',
    note: 'Simplified demo, drawn for this page. The example (an online shop) is fictional.',
  },
};

/** The file on screen: what was there, then what the AI writes. */
export const CODE: L<{ file: string; other: string; head: string[]; ai: string[] }> = {
  fr: {
    file: 'paiement.ts',
    other: 'PLAN.md',
    head: [
      '// J3 — le paiement du panier',
      '// Fini quand : un achat test passe,',
      '// le reçu arrive, un refus est expliqué.',
      '',
      'export function total(panier: Panier) {',
      '  return panier.lignes',
      '    .reduce((s, l) => s + l.prix, 0);',
      '}',
      '',
    ],
    ai: [
      'export async function payer(panier: Panier) {',
      '  const recu = await caisse.encaisser({',
      '    montant: total(panier),',
      '    devise: "eur",',
      '  });',
      '  await envoyerRecu(panier.client, recu);',
      '  return recu;',
      '}',
    ],
  },
  en: {
    file: 'payment.ts',
    other: 'PLAN.md',
    head: [
      '// M3 — cart payment',
      '// Done when: a test purchase goes through,',
      '// the receipt arrives, a decline is explained.',
      '',
      'export function total(cart: Cart) {',
      '  return cart.lines',
      '    .reduce((s, l) => s + l.price, 0);',
      '}',
      '',
    ],
    ai: [
      'export async function pay(cart: Cart) {',
      '  const receipt = await checkout.charge({',
      '    amount: total(cart),',
      '    currency: "eur",',
      '  });',
      '  await sendReceipt(cart.customer, receipt);',
      '  return receipt;',
      '}',
    ],
  },
};

// ---- Geeko's library: the engine's variants (LIBRARY in src/geeko/geeko.ts), in the order of a work session ----

export interface GalleryVariant {
  id: string;
  /** Only played at full speed in the product (the engine's `in: ['turbo']`). */
  turbo?: boolean;
  name: L<string>;
  line: L<string>;
}

export const GALLERY: Array<{ activity: GeekoActivity; label: L<string>; variants: GalleryVariant[] }> = [
  {
    activity: 'hello',
    label: { fr: 'Vous arrivez', en: 'You arrive' },
    variants: [
      { id: 'coucou', name: { fr: 'Le coucou', en: 'The wave' }, line: { fr: 'Il vous fait signe de la main.', en: 'He waves at you.' } },
      { id: 'yo', name: { fr: 'Le saut', en: 'The jump' }, line: { fr: 'Il saute de joie en vous voyant.', en: 'He jumps for joy when he sees you.' } },
    ],
  },
  {
    activity: 'think',
    label: { fr: 'L’IA réfléchit', en: 'AI is thinking' },
    variants: [
      { id: 'menton', name: { fr: 'Le menton', en: 'Chin in hand' }, line: { fr: 'Il réfléchit, la main sous le menton.', en: 'He thinks, hand under his chin.' } },
      { id: 'ampoule', name: { fr: 'L’ampoule', en: 'The light bulb' }, line: { fr: 'Il cherche l’idée, puis l’ampoule s’allume.', en: 'He hunts for the idea, then the bulb lights up.' } },
      { id: 'engrenages', name: { fr: 'Les engrenages', en: 'The gears' }, line: { fr: 'Il se gratte la tête, les engrenages tournent.', en: 'He scratches his head while the gears turn.' } },
    ],
  },
  {
    activity: 'read',
    label: { fr: 'Elle lit', en: 'It reads' },
    variants: [
      { id: 'livre', name: { fr: 'Le livre', en: 'The book' }, line: { fr: 'Il lit ligne par ligne, lunettes sur le nez.', en: 'He reads line by line, glasses on.' } },
      { id: 'fichiers', name: { fr: 'Les fichiers', en: 'The files' }, line: { fr: 'Les fichiers défilent, il les attrape et les lit.', en: 'Files fly past; he catches them and reads.' } },
    ],
  },
  {
    activity: 'search',
    label: { fr: 'Elle cherche', en: 'It searches' },
    variants: [
      { id: 'loupe', name: { fr: 'La loupe', en: 'The magnifier' }, line: { fr: 'Il passe le code à la loupe.', en: 'He goes over the code with a magnifying glass.' } },
      { id: 'radar', name: { fr: 'Le radar', en: 'The radar' }, line: { fr: 'Il scrute le web, le radar tourne.', en: 'He scans the web as the radar spins.' } },
      { id: 'fouille', name: { fr: 'Le carton', en: 'The box' }, line: { fr: 'Il fouille le carton, les fichiers volent.', en: 'He digs through the box; files go flying.' } },
    ],
  },
  {
    activity: 'code',
    label: { fr: 'Elle écrit le code', en: 'It writes code' },
    variants: [
      { id: 'deux-doigts', name: { fr: 'À deux doigts', en: 'Two fingers' }, line: { fr: 'Il code à deux doigts, la langue sortie.', en: 'He types with two fingers, tongue out.' } },
      { id: 'casque', name: { fr: 'Le casque', en: 'Headphones' }, line: { fr: 'Il code au casque, la tête qui suit le son.', en: 'He codes with headphones on, nodding to the beat.' } },
      { id: 'pensif', name: { fr: 'La pause', en: 'The pause' }, line: { fr: 'Il tape, s’arrête pour réfléchir, puis repart.', en: 'He types, stops to think, then carries on.' } },
      { id: 'rafale', turbo: true, name: { fr: 'La rafale', en: 'The burst' }, line: { fr: 'De profil, il tape si vite que les touches volent.', en: 'Side on, he types so fast the keys fly off.' } },
      { id: 'turbo', turbo: true, name: { fr: 'Plein turbo', en: 'Full turbo' }, line: { fr: 'En bandeau, plein turbo : le bureau prend feu.', en: 'Headband on, full turbo: the desk catches fire.' } },
    ],
  },
  {
    activity: 'servers',
    label: { fr: 'Elle lance des commandes', en: 'It runs commands' },
    variants: [
      { id: 'ronde', name: { fr: 'La ronde', en: 'The rounds' }, line: { fr: 'Il fait sa ronde entre les serveurs.', en: 'He does his rounds between the servers.' } },
      { id: 'console', name: { fr: 'La console', en: 'The console' }, line: { fr: 'Il pilote les serveurs depuis la console.', en: 'He runs the servers from the console.' } },
      { id: 'surchauffe', turbo: true, name: { fr: 'La surchauffe', en: 'Overheating' }, line: { fr: 'Les serveurs chauffent : il les ventile en urgence.', en: 'The servers run hot: he fans them in a hurry.' } },
    ],
  },
  {
    activity: 'talk',
    label: { fr: 'Elle vous explique', en: 'It explains' },
    variants: [
      { id: 'explique', name: { fr: 'L’explication', en: 'The explanation' }, line: { fr: 'Il parle avec les mains.', en: 'He talks with his hands.' } },
      { id: 'tableau', name: { fr: 'Le tableau', en: 'The whiteboard' }, line: { fr: 'Il dessine un schéma au tableau.', en: 'He draws a diagram on the board.' } },
    ],
  },
  {
    activity: 'wait',
    label: { fr: 'Elle attend votre accord', en: 'It waits for your OK' },
    variants: [
      { id: 'cafe', name: { fr: 'Le café', en: 'The coffee' }, line: { fr: 'Il attend votre accord en buvant un café.', en: 'He waits for your go-ahead over a coffee.' } },
      { id: 'pancarte', name: { fr: 'La pancarte', en: 'The sign' }, line: { fr: 'Il brandit sa pancarte : votre OK ?', en: 'He holds up his sign: your OK?' } },
      { id: 'montre', name: { fr: 'La montre', en: 'The watch' }, line: { fr: 'Il regarde sa montre, puis vous regarde.', en: 'He checks his watch, then looks at you.' } },
    ],
  },
  {
    activity: 'party',
    label: { fr: 'C’est réussi', en: 'It worked' },
    variants: [
      { id: 'confettis', name: { fr: 'Les confettis', en: 'Confetti' }, line: { fr: 'Il fait la fête sous les confettis.', en: 'He celebrates under the confetti.' } },
      { id: 'disco', name: { fr: 'La boule disco', en: 'The disco ball' }, line: { fr: 'Il danse sous la boule disco.', en: 'He dances under the disco ball.' } },
    ],
  },
  {
    activity: 'oops',
    label: { fr: 'Une erreur', en: 'An error' },
    variants: [
      { id: 'aie', name: { fr: 'Aïe', en: 'Ouch' }, line: { fr: 'Il a vu une erreur.', en: 'He has spotted an error.' } },
      { id: 'fumee', name: { fr: 'La fumée', en: 'Smoke' }, line: { fr: 'Le PC fume, il chasse la fumée.', en: 'The laptop smokes; he waves the smoke away.' } },
    ],
  },
  {
    activity: 'sleep',
    label: { fr: 'Rien à faire', en: 'Nothing to do' },
    variants: [
      { id: 'sieste', name: { fr: 'La sieste', en: 'The nap' }, line: { fr: 'Il fait une sieste.', en: 'He takes a nap.' } },
      { id: 'couette', name: { fr: 'La couette', en: 'The duvet' }, line: { fr: 'Il dort sous sa couette, bonnet sur la tête.', en: 'He sleeps under his duvet, nightcap on.' } },
    ],
  },
  {
    activity: 'walk',
    label: { fr: 'Il va voir le chantier', en: 'He goes to check' },
    variants: [
      { id: 'marche', name: { fr: 'La marche', en: 'The walk' }, line: { fr: 'Il part à pied voir où en est le chantier.', en: 'He walks off to see how the job is going.' } },
    ],
  },
];

/** The hidden surprises (EGGS in the engine), with the moment each one comes out in the product. */
export const SURPRISES: Array<{ id: GeekoEgg; name: L<string>; line: L<string> }> = [
  { id: 'nuit', name: { fr: 'Le bonnet de nuit', en: 'The nightcap' }, line: { fr: 'Après 23 h, il sort le bonnet et le gros mug.', en: 'After 11 pm, out come the nightcap and the big mug.' } },
  { id: 'vendredi', name: { fr: 'Le vendredi', en: 'Friday' }, line: { fr: 'Le vendredi après 16 h : lunettes de soleil devant les serveurs.', en: 'On Fridays after 4 pm: sunglasses by the servers.' } },
  { id: 'pizza', name: { fr: 'La pizza', en: 'Pizza' }, line: { fr: 'Après un très long travail, il s’offre une pause pizza.', en: 'After a very long job, he treats himself to a pizza break.' } },
  { id: 'fusee', name: { fr: 'La fusée', en: 'The rocket' }, line: { fr: 'Mise en ligne réussie : la fusée décolle.', en: 'Successful release: the rocket lifts off.' } },
  { id: 'chatouille', name: { fr: 'La chatouille', en: 'The tickle' }, line: { fr: 'Trois clics sur lui : ça chatouille.', en: 'Three clicks on him: that tickles.' } },
  { id: 'tourne', name: { fr: 'Le tonneau', en: 'The barrel roll' }, line: { fr: 'Six clics : il fait un tonneau et voit des spirales.', en: 'Six clicks: he does a barrel roll and sees spirals.' } },
  { id: 'legende', name: { fr: 'Le mode légende', en: 'Legend mode' }, line: { fr: 'Le code Konami au clavier : il passe en doré.', en: 'The Konami code on the keyboard: he turns gold.' } },
];

export const GALLERY_UI: L<{
  pick: string;
  variants: string;
  count: (n: number, total: number) => string;
  surprise: string;
  surprises: string;
  surprisesHint: string;
  tempo: string;
  tempos: [string, string, string];
  colour: string;
  colours: [string, string];
  violetHint: string;
  start: string;
  reduced: string;
  facts: Array<{ t: string; d: string }>;
  yours: string;
}> = {
  fr: {
    pick: 'Que fait l’IA ?',
    variants: 'Ses animations',
    count: (n, total) => `${n} sur ${total}`,
    surprise: 'Surprise',
    surprises: '7 surprises cachées',
    surprisesHint: 'Dans l’outil, elles sortent toutes seules, au bon moment. Ici, vous pouvez les déclencher.',
    tempo: 'Son rythme',
    tempos: ['Calme', 'Normal', 'Turbo'],
    colour: 'Sa couleur',
    colours: ['Lime', 'Violet'],
    violetHint: 'Quand l’IA passe en mode intensif, tout l’éditeur vire au violet, lui compris.',
    start: 'Lancer l’animation',
    reduced: 'Vous avez réduit les animations : Geeko attend votre clic pour bouger.',
    facts: [
      { t: 'Dessiné par le code', d: 'Du pixel art calculé : aucune image, aucun fichier d’animation. Chaque pose est tracée à l’écran, au pixel près.' },
      { t: 'Jamais deux fois pareil', d: 'Plusieurs animations par activité, et une autre toutes les 9 à 15 secondes tant qu’elle dure.' },
      { t: 'Il suit l’effort', d: 'Trois rythmes : calme, normal, turbo. Quand l’IA travaille dur, il tape plus vite.' },
      { t: 'Il sait s’effacer', d: 'Il se pousse quand un menu s’ouvre sous lui, et disparaît si vous avez réduit les animations.' },
    ],
    yours: 'Un outil qu’on a envie d’ouvrir, c’est aussi ça : nous pouvons dessiner et animer la mascotte du vôtre.',
  },
  en: {
    pick: 'What is AI doing?',
    variants: 'His animations',
    count: (n, total) => `${n} of ${total}`,
    surprise: 'Surprise',
    surprises: '7 hidden surprises',
    surprisesHint: 'In the tool they come out by themselves, at the right moment. Here, you can trigger them.',
    tempo: 'His tempo',
    tempos: ['Calm', 'Normal', 'Turbo'],
    colour: 'His colour',
    colours: ['Lime', 'Violet'],
    violetHint: 'When AI switches to intensive mode, the whole editor turns violet, Geeko included.',
    start: 'Play the animation',
    reduced: 'You have reduced motion: Geeko waits for your click before moving.',
    facts: [
      { t: 'Drawn by code', d: 'Computed pixel art: no image, no animation file. Every pose is drawn on screen, pixel by pixel.' },
      { t: 'Never the same twice', d: 'Several animations per activity, and a new one every 9 to 15 seconds for as long as it lasts.' },
      { t: 'He follows the effort', d: 'Three tempos: calm, normal, turbo. When AI works hard, he types faster.' },
      { t: 'He knows when to step back', d: 'He moves aside when a menu opens under him, and disappears if you have reduced motion.' },
    ],
    yours: 'A tool people want to open is also this: we can design and animate the mascot of yours.',
  },
};

// ---- « À vos couleurs » : the same editor under another company's name --------------------------------

export const BRAND: L<{
  name: string;
  namePlaceholder: string;
  fallback: string;
  colour: string;
  custom: string;
  presets: string[];
  privacy: string;
  status: string;
  plugged: string;
  tools: string[];
  points: Array<{ t: string; d: string }>;
  cta: string;
  you: string;
}> = {
  fr: {
    name: 'Le nom de votre entreprise',
    namePlaceholder: 'Votre entreprise',
    fallback: 'Votre',
    colour: 'Votre couleur',
    custom: 'Une autre couleur',
    presets: ['3geeks', 'Bleu', 'Corail', 'Violet', 'Or'],
    privacy: 'Rien n’est envoyé : tout se passe dans votre navigateur.',
    status: 'Aujourd’hui, Geeks Code est notre outil interne. La version pour les entreprises se prépare sur le même socle : si vous voulez faire partie des premières équipes, parlons-en.',
    plugged: 'Branché sur',
    tools: ['Votre code', 'Vos tests', 'Votre mise en ligne', 'Votre documentation'],
    points: [
      { t: 'À vos couleurs', d: 'Votre nom, votre logo, votre thème, jusqu’à l’installeur. Et votre mascotte, si vous en voulez une.' },
      { t: 'Branché sur vos outils', d: 'Une seule connexion avec le compte de l’entreprise, et les outils de l’équipe sont reliés.' },
      { t: 'Avec vos modèles d’IA', d: 'Ceux que vous choisissez, selon vos règles de confidentialité.' },
    ],
    cta: 'Parler de votre version',
    you: 'Vous',
  },
  en: {
    name: 'Your company name',
    namePlaceholder: 'Your company',
    fallback: 'Your',
    colour: 'Your colour',
    custom: 'Another colour',
    presets: ['3geeks', 'Blue', 'Coral', 'Violet', 'Gold'],
    privacy: 'Nothing is sent: it all happens in your browser.',
    status: 'Today, Geeks Code is our internal tool. The version for companies is being prepared on the same base: if you want to be one of the first teams, let’s talk.',
    plugged: 'Plugged into',
    tools: ['Your code', 'Your tests', 'Your releases', 'Your documentation'],
    points: [
      { t: 'In your colours', d: 'Your name, your logo, your theme, down to the installer. And your own mascot, if you want one.' },
      { t: 'Plugged into your tools', d: 'One sign-in with the company account, and the team’s tools are connected.' },
      { t: 'With your AI models', d: 'The ones you choose, under your confidentiality rules.' },
    ],
    cta: 'Talk about your version',
    you: 'You',
  },
};

export const HERO: L<{ hello: string }> = {
  fr: { hello: 'Bonjour ! Moi, c’est Geeko.' },
  en: { hello: 'Hi! I’m Geeko.' },
};
