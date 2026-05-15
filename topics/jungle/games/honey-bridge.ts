/** Honey Bridge Builder — tap letters in order to spell the word (vertical “bridge”). */

export const HONEY_BRIDGE_ROUND_COUNT = 5;

/** Short jungle words (lowercase) for letter-by-letter bridge rounds. */
export const HONEY_BRIDGE_WORDS = ['bee', 'frog', 'tiger', 'monkey', 'snake', 'rabbit'] as const;

export type HoneyBridgeWord = (typeof HONEY_BRIDGE_WORDS)[number];
