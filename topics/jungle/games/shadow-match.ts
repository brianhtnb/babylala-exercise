/** Shadow Match — listen to Milo’s hint, pick the correct animal silhouette. */

export const SHADOW_MATCH_ROUND_COUNT = 5;

export interface ShadowMatchRound {
  /** Correct animal (vocab key, image under /images/jungle/animals/) */
  correct: string;
  /** TTS hint (English) */
  hint: string;
  /** Three animal ids to show as choices (includes correct) */
  choices: [string, string, string];
}

export const SHADOW_MATCH_ROUNDS: ShadowMatchRound[] = [
  {
    correct: 'tiger',
    hint: 'Find the big cat with orange and black stripes.',
    choices: ['bee', 'tiger', 'frog'],
  },
  {
    correct: 'bee',
    hint: 'Find the tiny flyer that makes honey and goes buzz buzz.',
    choices: ['tiger', 'monkey', 'bee'],
  },
  {
    correct: 'crocodile',
    hint: 'Find the long green animal that lives in the swamp and snaps.',
    choices: ['rabbit', 'crocodile', 'spider'],
  },
  {
    correct: 'monkey',
    hint: 'Find the climber that loves bananas and says ooh ooh ah ah.',
    choices: ['monkey', 'snake', 'lizard'],
  },
  {
    correct: 'frog',
    hint: 'Find the hopper that says ribbit and likes lily pads.',
    choices: ['elephant', 'frog', 'bee'],
  },
];
