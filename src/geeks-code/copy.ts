/**
 * Texts of the animated blocks of /realisations/geeks-code (the page's own texts are in src/content/pages.ts).
 * Same rules as the rest of the site: facts we can prove, and no name of an internal tool. Geeko's animations
 * are listed here with the site's own words (the engine's labels are written for the team).
 */
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

export const HERO: L<{ hello: string }> = {
  fr: { hello: 'Bonjour ! Moi, c’est Geeko.' },
  en: { hello: 'Hi! I’m Geeko.' },
};

// ---- Behind the tick: the chain one request goes through, with the real counts of the project ---------------------
// Counts from the Geeks Code repository: agents from the agents' logs (28 Oct – 17 Nov 2026, one computer, the
// security audit left out), "not checked" and approvals counted in the project plan on 17 Nov 2026. Recount there
// before changing them (promo/src/derriere/tokens.json and chiffres.json in the Geeks Code repository).
export const CHAIN_COUNTS = { stations: [13, 37, 40, 22, 13], unchecked: 49, approvals: 22 };

export const CHAIN: L<{
  request: string;
  condition: string;
  stations: Array<{ name: string; done: string; line: string }>;
  notes: string[];
  remark: string;
  failing: string;
  passing: string;
  inApp: string;
  human: string;
  humanLead: string;
  humanWho: string;
  approved: string;
  onProject: string;
  total: { value: string; label: string; sub: string };
  unchecked: { label: string; sub: string; lines: string[] };
  approvals: { label: string; sub: string };
  source: string;
  film: { title: string; sub: string; note: string };
  pause: string;
  play: string;
}> = {
  fr: {
    request: 'la demande · J3 Le paiement',
    condition: 'un refus est bien expliqué',
    stations: [
      { name: 'Étudier', done: 'ont étudié', line: 'Un premier agent lit le projet et note où intervenir.' },
      { name: 'Écrire', done: 'ont écrit', line: 'Un deuxième écrit le code, et rien d’autre.' },
      { name: 'Relire', done: 'ont relu', line: 'Un troisième le relit, sans l’avoir écrit.' },
      { name: 'Corriger', done: 'ont corrigé', line: 'Un quatrième corrige : d’abord un test qui échoue, ensuite le correctif.' },
      { name: 'Vérifier', done: 'ont vérifié', line: 'Un cinquième vérifie, condition par condition, dans le vrai logiciel.' },
    ],
    notes: ['où     la page de paiement', 'quoi   le message de refus', 'test   une carte refusée'],
    remark: 'relecture : le refus n’est pas testé',
    failing: 'refus.test · échoue',
    passing: 'refus.test · passe',
    inApp: 'dans le logiciel compilé',
    human: 'La dernière coche : un humain.',
    humanLead: 'La dernière coche :',
    humanWho: 'un humain.',
    approved: 'validé',
    onProject: 'agents, sur notre propre projet',
    total: { value: 'agents', label: 'ont tenu cette chaîne', sub: 'Jamais le même agent deux fois de suite : chaque maillon repart d’un contexte neuf.' },
    unchecked: {
      label: '« pas vérifié » ou « pas vu »',
      sub: 'écrits dans le plan du projet. On préfère un aveu à une fausse coche.',
      lines: ['Pas vu à deux PC.', 'Pas vérifié : les patchs appliqués.', 'Pas vu dans une version compilée.'],
    },
    approvals: { label: 'validations humaines', sub: 'notées et datées dans le plan : la dernière coche ne se délègue pas.' },
    source: 'Chiffres relevés dans le dépôt de Geeks Code : journaux des agents du 28 octobre au 17 novembre 2026 (un poste, audit de sécurité à part) et plan du projet au 17 novembre.',
    film: {
      title: 'Le film : derrière la coche, en une minute',
      sub: 'La même histoire, racontée par Geeko, pour celles et ceux qui veulent voir le détail.',
      note: 'Voix off générée par IA (ElevenLabs).',
    },
    pause: 'Mettre la chaîne en pause',
    play: 'Relancer la chaîne',
  },
  en: {
    request: 'the request · M3 Payment',
    condition: 'a refusal is clearly explained',
    stations: [
      { name: 'Study', done: 'studied', line: 'A first agent reads the project and notes where to work.' },
      { name: 'Write', done: 'wrote', line: 'A second one writes the code, and nothing else.' },
      { name: 'Review', done: 'reviewed', line: 'A third one reviews it, without having written it.' },
      { name: 'Fix', done: 'fixed', line: 'A fourth one fixes it: first a failing test, then the fix.' },
      { name: 'Verify', done: 'verified', line: 'A fifth one verifies, condition by condition, in the real software.' },
    ],
    notes: ['where  the payment page', 'what   the refusal message', 'test   a declined card'],
    remark: 'review: the refusal is not tested',
    failing: 'refusal.test · fails',
    passing: 'refusal.test · passes',
    inApp: 'in the compiled software',
    human: 'The last tick: a human.',
    humanLead: 'The last tick:',
    humanWho: 'a human.',
    approved: 'approved',
    onProject: 'agents, on our own project',
    total: { value: 'agents', label: 'went through this chain', sub: 'Never the same agent twice in a row: each link starts from a fresh context.' },
    unchecked: {
      label: '“not checked” or “not seen”',
      sub: 'written in the project plan. We would rather admit it than tick a false box.',
      lines: ['Not seen on two computers.', 'Not checked: the patches applied.', 'Not seen in a compiled build.'],
    },
    approvals: { label: 'human approvals', sub: 'written and dated in the plan: the last tick is never delegated.' },
    source: 'Counts taken from the Geeks Code repository: the agents’ logs from 28 October to 17 November 2026 (one computer, security audit left out) and the project plan on 17 November.',
    film: {
      title: 'The film: behind the tick, in one minute',
      sub: 'The same story, told by Geeko, for those who want the detail.',
      note: 'Voice-over generated by AI (ElevenLabs). In French.',
    },
    pause: 'Pause the chain',
    play: 'Play the chain',
  },
};
