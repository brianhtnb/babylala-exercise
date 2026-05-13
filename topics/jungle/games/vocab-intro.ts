import type { VocabIntroItem } from '@/types';

const BASE = '/images/jungle/animals';

/**
 * Order matches topic vocabulary — listen, read, and match the picture
 * before other jungle games.
 */
export const vocabIntroItems: VocabIntroItem[] = [
  { word: 'bee', image: `${BASE}/bee.png` },
  { word: 'tiger', image: `${BASE}/tiger.png` },
  { word: 'frog', image: `${BASE}/frog.png` },
  { word: 'lizard', image: `${BASE}/lizard.png` },
  { word: 'monkey', image: `${BASE}/monkey.png` },
  { word: 'spider', image: `${BASE}/spider.png` },
  { word: 'crocodile', image: `${BASE}/crocodile.png` },
  { word: 'elephant', image: `${BASE}/elephant.png` },
  { word: 'rabbit', image: `${BASE}/rabbit.png` },
  { word: 'snake', image: `${BASE}/snake.png` },
];
