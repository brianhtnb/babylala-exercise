import type { CountCompleteQuestion } from '@/types';

/**
 * Animal counts visible in /public/images/jungle/animals/panorama-counting.png:
 * spider × 5  |  monkey × 3  |  lizard × 4  |  tiger × 1
 * bee × 4     |  frog × 4    |  crocodile × 2
 *
 * Students look at the panorama and tap the correct number word.
 */
export const countCompleteQuestions: CountCompleteQuestion[] = [
  {
    animal: 'monkey',
    sentence: 'There are ___ monkeys in the jungle.',
    options: ['two', 'three', 'four', 'five'],
    answer: 'three',
  },
  {
    animal: 'frog',
    sentence: 'There are ___ frogs in the jungle.',
    options: ['three', 'four', 'five', 'six'],
    answer: 'four',
  },
  {
    animal: 'crocodile',
    sentence: 'There are ___ crocodiles in the jungle.',
    options: ['one', 'two', 'three', 'four'],
    answer: 'two',
  },
  {
    animal: 'tiger',
    sentence: 'There is ___ tiger in the jungle.',
    options: ['one', 'two', 'three', 'four'],
    answer: 'one',
  },
  {
    animal: 'lizard',
    sentence: 'There are ___ lizards in the jungle.',
    options: ['two', 'three', 'four', 'five'],
    answer: 'five',
  },
  {
    animal: 'bee',
    sentence: 'There are ___ bees in the jungle.',
    options: ['seven', 'eight', 'nine', 'ten'],
    answer: 'ten',
  },
  {
    animal: 'spider',
    sentence: 'There are ___ spiders in the jungle.',
    options: ['three', 'four', 'five', 'six'],
    answer: 'six',
  },
];
