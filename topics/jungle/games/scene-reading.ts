import type { SceneReadingQuestion } from '@/types';

/**
 * Questions about /public/images/jungle/animals/panorama-yesno.png.
 *
 * Animals VISIBLE in the scene (YES):
 *   elephant, tiger, crocodile, rabbit, bee (beehive), lizard
 *
 * Animals NOT in the scene (NO):
 *   frog, monkey, spider, snake
 */
export const sceneReadingQuestions: SceneReadingQuestion[] = [
  { animal: 'tiger',     sentence: 'Tigers live here.',        answer: true },
  { animal: 'elephant',  sentence: 'Elephants live here too.', answer: true },
  { animal: 'frog',      sentence: 'Frogs live here.',         answer: false },
  { animal: 'bee',       sentence: 'Bees live here too.',      answer: true },
  { animal: 'crocodile', sentence: 'Crocodiles live here.',    answer: true },
  { animal: 'monkey',    sentence: 'Monkeys live here too.',   answer: false },
  { animal: 'rabbit',    sentence: 'Rabbits live here.',       answer: true },
  { animal: 'spider',    sentence: 'Spiders live here too.',   answer: false },
];
