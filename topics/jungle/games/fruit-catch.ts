/** Fruit Catch — Milo names a word; tap the picture that matches. */

export const FRUIT_CATCH_ROUND_COUNT = 5;

export interface FruitCatchRound {
  target: string;
  /** TTS line */
  prompt: string;
  choices: [string, string, string];
}

export const FRUIT_CATCH_ROUNDS: FruitCatchRound[] = [
  {
    target: 'bee',
    prompt: 'Tap the bee!',
    choices: ['tiger', 'bee', 'frog'],
  },
  {
    target: 'monkey',
    prompt: 'Tap the monkey!',
    choices: ['monkey', 'snake', 'rabbit'],
  },
  {
    target: 'crocodile',
    prompt: 'Tap the crocodile!',
    choices: ['bee', 'frog', 'crocodile'],
  },
  {
    target: 'tiger',
    prompt: 'Tap the tiger!',
    choices: ['lizard', 'tiger', 'spider'],
  },
  {
    target: 'elephant',
    prompt: 'Tap the elephant!',
    choices: ['elephant', 'monkey', 'frog'],
  },
];
