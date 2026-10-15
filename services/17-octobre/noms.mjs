// 17 OCTOBRE — the players' names (Manif mode online, leaderboard): everyone sees them, so they are checked.
// 2 to 16 letters, digits, spaces, dots, dashes or underscores; insults and slurs refused (a cheap filter: accents
// and separators ignored; a word that starts with a banned stem, or the whole name containing a long one).
// Moderation beyond that: DELETE /classement?nom=... (server.mjs).

const NAME_RE = /^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,15}$/u;
const BANNED = ['pute', 'putain', 'salope', 'encul', 'nique', 'fdp', 'ntm', 'connard', 'conasse', 'batard', 'negre',
  'negro', 'bougnoul', 'youpin', 'nazi', 'hitler', 'pd', 'tapette', 'bite', 'couille', 'chatte', 'merde'];

/** A name everyone may see, or '' if it can't be used. */
export function cleanName(raw) {
  const name = String(raw || '').trim().replace(/\s+/g, ' ');
  if (!NAME_RE.test(name)) return '';
  const words = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const flat = words.join('');
  if (BANNED.some((w) => words.some((x) => x.startsWith(w)) || (w.length >= 6 && flat.includes(w)))) return '';
  return name;
}
