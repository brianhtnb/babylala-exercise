import type { SpellingQuestion } from '@/types';

/**
 * Jungle spelling (find extra letter): seven focus animals only.
 * Rabbit, elephant, and snake are excluded from this exercise.
 */
export const SPELLING_FOCUS_WORDS = [
  'bee',
  'frog',
  'tiger',
  'monkey',
  'spider',
  'lizard',
  'crocodile',
] as const;

export type SpellingFocusWord = (typeof SPELLING_FOCUS_WORDS)[number];

export const SPELLING_GAME_ROUND_COUNT = SPELLING_FOCUS_WORDS.length;

const WORD_EMOJI: Record<SpellingFocusWord, string> = {
  bee: '🐝',
  frog: '🐸',
  tiger: '🐯',
  monkey: '🐒',
  spider: '🕷️',
  lizard: '🦎',
  crocodile: '🐊',
};

export function getSpellingWordEmoji(word: string): string {
  return WORD_EMOJI[word as SpellingFocusWord] ?? '🐾';
}

function shuffleInPlace<T>(arr: T[], random: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Merge two sequences so each keeps its internal order; every interleaving is
 * equally likely (uniform among C(n+k, k) outcomes).
 */
function interleavePreserveOrder(
  correct: SpellingQuestion['letters'],
  extras: SpellingQuestion['letters'],
  random: () => number
): SpellingQuestion['letters'] {
  const out: SpellingQuestion['letters'] = [];
  let i = 0;
  let j = 0;
  while (i < correct.length || j < extras.length) {
    const remC = correct.length - i;
    const remE = extras.length - j;
    if (remE === 0) {
      out.push(correct[i]!);
      i += 1;
    } else if (remC === 0) {
      out.push(extras[j]!);
      j += 1;
    } else if (random() * (remC + remE) < remC) {
      out.push(correct[i]!);
      i += 1;
    } else {
      out.push(extras[j]!);
      j += 1;
    }
  }
  return out;
}

/**
 * Builds letter tiles: correct letters stay in spelling order left-to-right; 1–2 decoy
 * letters (not in the word) are interleaved at random slots. Decoys may be shuffled
 * among themselves before merging.
 */
export function generateSpellingLetters(
  word: string,
  random: () => number
): SpellingQuestion['letters'] {
  const w = word.toLowerCase();
  if (!/^[a-z]+$/.test(w)) {
    throw new Error(`Invalid spelling word: ${word}`);
  }

  const decoyPool = 'abcdefghijklmnopqrstuvwxyz'.split('').filter((c) => !w.includes(c));
  shuffleInPlace(decoyPool, random);

  let redundantCount = random() < 0.55 ? 1 : 2;
  const maxExtrasForBoard = Math.max(1, 12 - w.length);
  redundantCount = Math.min(redundantCount, maxExtrasForBoard, decoyPool.length);
  redundantCount = Math.max(1, redundantCount);

  const correct: SpellingQuestion['letters'] = w.split('').map((c) => ({
    char: c.toUpperCase(),
    isRedundant: false,
  }));

  const extras: SpellingQuestion['letters'] = [];
  for (let k = 0; k < redundantCount; k++) {
    const dec = decoyPool[k % decoyPool.length]!.toUpperCase();
    extras.push({ char: dec, isRedundant: true });
  }
  shuffleInPlace(extras, random);

  return interleavePreserveOrder(correct, extras, random);
}
