import type { ListenPickQuestion, ListenPickQuestionDefinition } from '@/types';

const BASE = '/images/jungle/listen-pick';

/** Original spec: which picture is “the lesson” when exporting stable `listenPickQuestions` (checkpoint). */
const LISTEN_PICK_SPEC_CORRECT_IDS: ReadonlyArray<'a' | 'b' | 'c'> = [
  'b',
  'a',
  'b',
  'a',
  'b',
  'a',
  'a',
];

/**
 * Seven jungle listen items. Each has `scriptsByChoice`: one short story per image (A/B/C),
 * medium rhythm, two sentences. Optional `vocabularyStretch` notes extra words to teach.
 * Session builder picks A/B/C at random and sets `correctId`.
 */
export const listenPickQuestionDefinitions: ListenPickQuestionDefinition[] = [
  {
    id: 'listen-q1',
    question: 'Where is the monkey?',
    vocabularyStretch: 'wet, long tail, favorite',
    scriptsByChoice: {
      a: 'Splash! The monkey is playing in the water. It is very wet and happy!',
      b: 'Look up! The monkey is on the tree. It has a long tail and likes to climb.',
      c: 'Yum! The monkey is eating a yellow banana. Bananas are its favorite snack!',
    },
    choices: [
      { id: 'a', image: `${BASE}/q01-a.png`, label: 'Monkey in the water' },
      { id: 'b', image: `${BASE}/q01-b.png`, label: 'Monkey on the tree' },
      { id: 'c', image: `${BASE}/q01-c.png`, label: 'Monkey eating a banana' },
    ],
  },
  {
    id: 'listen-q2',
    question: 'Where is the frog?',
    vocabularyStretch: 'still, eyes, catch a fly',
    scriptsByChoice: {
      a: 'Shh! The frog sits on a green leaf in the pond. The water is very still.',
      b: 'Peek-a-boo! The frog is hiding under the leaf. Can you see its little eyes?',
      c: 'Boing! The frog is jumping high. It wants to catch a fly for dinner!',
    },
    choices: [
      { id: 'a', image: `${BASE}/q02-a.png`, label: 'Frog on a lily pad' },
      { id: 'b', image: `${BASE}/q02-b.png`, label: 'Frog under a leaf' },
      { id: 'c', image: `${BASE}/q02-c.png`, label: 'Frog jumping' },
    ],
  },
  {
    id: 'listen-q3',
    question: 'What is the tiger doing?',
    vocabularyStretch: 'soft, cool/fresh, strong',
    scriptsByChoice: {
      a: 'Sleepy time! The tiger is sleeping under the tree. The grass is soft and warm.',
      b: 'Thirsty? The tiger is drinking water at the river. The water tastes cool and fresh.',
      c: 'Fast! The tiger is running on the grass. It is a very strong and brave tiger.',
    },
    choices: [
      { id: 'a', image: `${BASE}/q03-a.png`, label: 'Tiger sleeping' },
      { id: 'b', image: `${BASE}/q03-b.png`, label: 'Tiger drinking at the river' },
      { id: 'c', image: `${BASE}/q03-c.png`, label: 'Tiger running' },
    ],
  },
  {
    id: 'listen-q4',
    question: 'Where is the bee?',
    vocabularyStretch: 'pretty, honey, tiny dot',
    scriptsByChoice: {
      a: 'Buzz buzz! The bee is on a big flower. The flower is pretty and red.',
      b: 'Look! The bee is flying near the beehive. It is carrying honey for its friends.',
      c: 'Fly high! The bee is in the blue sky. It looks like a tiny gold dot!',
    },
    choices: [
      { id: 'a', image: `${BASE}/q04-a.png`, label: 'Bee on a flower' },
      { id: 'b', image: `${BASE}/q04-b.png`, label: 'Bee near the beehive' },
      { id: 'c', image: `${BASE}/q04-c.png`, label: 'Bee flying high' },
    ],
  },
  {
    id: 'listen-q5',
    question: 'Where is the crocodile?',
    vocabularyStretch: 'teeth, back, nap',
    scriptsByChoice: {
      a: 'Hello! The crocodile is standing on the grass. It is showing its big white teeth.',
      b: 'Watch out! The crocodile is swimming in the river. Only its back is above the water.',
      c: 'Silly crocodile! It is resting on a tree branch. It wants to take a nap in the sun.',
    },
    choices: [
      { id: 'a', image: `${BASE}/q05-a.png`, label: 'Crocodile on the grass' },
      { id: 'b', image: `${BASE}/q05-b.png`, label: 'Crocodile in the river' },
      { id: 'c', image: `${BASE}/q05-c.png`, label: 'Crocodile in a tree' },
    ],
  },
  {
    id: 'listen-q6',
    question: 'Where is the spider?',
    vocabularyStretch: 'sticky, wiggle, tiny splash',
    scriptsByChoice: {
      a: 'Look! The spider is on a big web. The web is sticky and very strong.',
      b: "Funny! The spider is on the monkey's tail. The monkey wants to wiggle it away!",
      c: 'Oh! The spider is falling into the water. It makes a very tiny splash!',
    },
    choices: [
      { id: 'a', image: `${BASE}/q06-a.png`, label: 'Spider on a web' },
      { id: 'b', image: `${BASE}/q06-b.png`, label: 'Spider on a tail' },
      { id: 'c', image: `${BASE}/q06-c.png`, label: 'Spider in the water' },
    ],
  },
  {
    id: 'listen-q7',
    question: 'What is the lizard doing?',
    vocabularyStretch: 'warm, swimmer, hide',
    scriptsByChoice: {
      a: "It's sunny! The lizard is on the brown rock. It loves to feel the warm sun.",
      b: 'Splash! The lizard is in the water. It is a very good swimmer.',
      c: 'Look! The lizard is climbing a green vine. It is looking for a place to hide.',
    },
    choices: [
      { id: 'a', image: `${BASE}/q07-a.png`, label: 'Lizard on a rock' },
      { id: 'b', image: `${BASE}/q07-b.png`, label: 'Lizard in shallow water' },
      { id: 'c', image: `${BASE}/q07-c.png`, label: 'Lizard on a vine' },
    ],
  },
];

export const LISTEN_PICK_GAME_ROUND_COUNT = listenPickQuestionDefinitions.length;

function choiceToVariantIndex(id: 'a' | 'b' | 'c'): 0 | 1 | 2 {
  if (id === 'a') return 0;
  if (id === 'b') return 1;
  return 2;
}

export function resolveListenPickQuestionForChoice(
  def: ListenPickQuestionDefinition,
  correctId: 'a' | 'b' | 'c'
): ListenPickQuestion {
  return {
    id: def.id,
    question: def.question,
    script: def.scriptsByChoice[correctId],
    choices: def.choices,
    correctId,
    scriptVariantIndex: choiceToVariantIndex(correctId),
  };
}

function shuffleIndices(length: number, random: () => number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** One full game: shuffled question order; each round picks one image script (A, B, or C) at random. */
export function buildListenPickGameSession(random: () => number = Math.random): ListenPickQuestion[] {
  const order = shuffleIndices(listenPickQuestionDefinitions.length, random);
  const choices = ['a', 'b', 'c'] as const;
  return order.map((defIndex) => {
    const def = listenPickQuestionDefinitions[defIndex]!;
    const pick = choices[Math.floor(random() * 3)]!;
    return resolveListenPickQuestionForChoice(def, pick);
  });
}

/** Stable “spec answer” scripts — used by `final-checkpoint` imports by index. */
export const listenPickQuestions: ListenPickQuestion[] = listenPickQuestionDefinitions.map((d, i) =>
  resolveListenPickQuestionForChoice(d, LISTEN_PICK_SPEC_CORRECT_IDS[i]!)
);
