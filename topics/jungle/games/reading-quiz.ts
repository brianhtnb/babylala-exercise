import type { ReadingSceneQuestion } from '@/types';

const BASE = '/images/jungle/animals';

/**
 * Each question shows a scene image with exactly 2 animals.
 * The student picks the sentence that correctly describes what is in the image.
 * The "wrong" option mentions an animal that is NOT in the scene.
 */
export const readingSceneQuestions: ReadingSceneQuestion[] = [
  {
    image: `${BASE}/scene-frogs-crocodiles.png`,
    correct: 'Frogs live here. Crocodiles live here too.',
    wrong: 'Bees live here. Frogs live here too.',
  },
  {
    image: `${BASE}/scene-bees-monkeys.png`,
    correct: 'Bees live here. Monkeys live here too.',
    wrong: 'Bees live here. Tigers live here too.',
  },
  {
    image: `${BASE}/scene-spiders-lizards.png`,
    correct: 'Spiders live here. Lizards live here too.',
    wrong: 'Frogs live here. Spiders live here too.',
  },
  {
    image: `${BASE}/scene-bees-lizards.png`,
    correct: 'Lizards live here. Bees live here too.',
    wrong: 'Crocodiles live here. Lizards live here too.',
  },
  {
    image: `${BASE}/scene-tigers-crocodiles.png`,
    correct: 'Tigers live here. Crocodiles live here too.',
    wrong: 'Tigers live here. Monkeys live here too.',
  },
];
