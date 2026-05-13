import type { SpellingQuestion } from '@/types';

/**
 * Each word has its correct letters plus one or two redundant letters inserted
 * at semi-random positions. Players must identify and tap the extra letters.
 */
export const spellingQuestions: SpellingQuestion[] = [
  {
    word: 'bee',
    emoji: '🐝',
    letters: [
      { char: 'B', isRedundant: false },
      { char: 'E', isRedundant: false },
      { char: 'X', isRedundant: true },
      { char: 'E', isRedundant: false },
    ],
  },
  {
    word: 'frog',
    emoji: '🐸',
    letters: [
      { char: 'F', isRedundant: false },
      { char: 'R', isRedundant: false },
      { char: 'P', isRedundant: true },
      { char: 'O', isRedundant: false },
      { char: 'G', isRedundant: false },
    ],
  },
  {
    word: 'tiger',
    emoji: '🐯',
    letters: [
      { char: 'T', isRedundant: false },
      { char: 'X', isRedundant: true },
      { char: 'I', isRedundant: false },
      { char: 'G', isRedundant: false },
      { char: 'E', isRedundant: false },
      { char: 'R', isRedundant: false },
    ],
  },
  {
    word: 'snake',
    emoji: '🐍',
    letters: [
      { char: 'S', isRedundant: false },
      { char: 'N', isRedundant: false },
      { char: 'A', isRedundant: false },
      { char: 'K', isRedundant: false },
      { char: 'B', isRedundant: true },
      { char: 'E', isRedundant: false },
    ],
  },
  {
    word: 'monkey',
    emoji: '🐒',
    letters: [
      { char: 'M', isRedundant: false },
      { char: 'O', isRedundant: false },
      { char: 'N', isRedundant: false },
      { char: 'T', isRedundant: true },
      { char: 'K', isRedundant: false },
      { char: 'E', isRedundant: false },
      { char: 'Y', isRedundant: false },
    ],
  },
  {
    word: 'spider',
    emoji: '🕷️',
    letters: [
      { char: 'S', isRedundant: false },
      { char: 'P', isRedundant: false },
      { char: 'I', isRedundant: false },
      { char: 'D', isRedundant: false },
      { char: 'Q', isRedundant: true },
      { char: 'E', isRedundant: false },
      { char: 'R', isRedundant: false },
    ],
  },
  {
    word: 'rabbit',
    emoji: '🐰',
    letters: [
      { char: 'R', isRedundant: false },
      { char: 'A', isRedundant: false },
      { char: 'B', isRedundant: false },
      { char: 'B', isRedundant: false },
      { char: 'W', isRedundant: true },
      { char: 'I', isRedundant: false },
      { char: 'T', isRedundant: false },
    ],
  },
  {
    word: 'lizard',
    emoji: '🦎',
    letters: [
      { char: 'L', isRedundant: false },
      { char: 'I', isRedundant: false },
      { char: 'Z', isRedundant: false },
      { char: 'V', isRedundant: true },
      { char: 'A', isRedundant: false },
      { char: 'R', isRedundant: false },
      { char: 'D', isRedundant: false },
    ],
  },
  {
    word: 'elephant',
    emoji: '🐘',
    letters: [
      { char: 'E', isRedundant: false },
      { char: 'L', isRedundant: false },
      { char: 'E', isRedundant: false },
      { char: 'P', isRedundant: false },
      { char: 'H', isRedundant: false },
      { char: 'A', isRedundant: false },
      { char: 'Z', isRedundant: true },
      { char: 'N', isRedundant: false },
      { char: 'T', isRedundant: false },
    ],
  },
  {
    word: 'crocodile',
    emoji: '🐊',
    letters: [
      { char: 'C', isRedundant: false },
      { char: 'R', isRedundant: false },
      { char: 'O', isRedundant: false },
      { char: 'C', isRedundant: false },
      { char: 'H', isRedundant: true },
      { char: 'O', isRedundant: false },
      { char: 'D', isRedundant: false },
      { char: 'I', isRedundant: false },
      { char: 'L', isRedundant: false },
      { char: 'E', isRedundant: false },
    ],
  },
];
