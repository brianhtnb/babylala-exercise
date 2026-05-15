/** Lily Pad Count — count critters and pick the right number. */

export const LILY_PAD_ROUND_COUNT = 5;

/** Emoji shown in the “pond” for each round (repeat same char `count` times). */
export interface LilyPadRound {
  count: number;
  emoji: string;
  label: string;
}

export const LILY_PAD_ROUNDS: LilyPadRound[] = [
  { count: 3, emoji: '🐸', label: 'frogs' },
  { count: 2, emoji: '🐊', label: 'crocodiles' },
  { count: 4, emoji: '🐸', label: 'frogs' },
  { count: 1, emoji: '🐊', label: 'crocodile' },
  { count: 5, emoji: '🐸', label: 'frogs' },
];
