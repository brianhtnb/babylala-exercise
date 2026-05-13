import type { SpeakingPresentationScenario } from '@/types';

/** Hero images: `public/images/jungle/speaking-present/scenario-*.png` */
const IMG = '/images/jungle/speaking-present';

/**
 * Three “Look and present” scripts (ages 5–6).
 * Copy matches the scenario art (river, moods, night). Tap line → TTS; Play all → full script.
 */
export const speakingPresentationScenarios: SpeakingPresentationScenario[] = [
  {
    id: 'busy-jungle',
    shortTitle: 'Busy jungle',
    image: `${IMG}/scenario-1.png`,
    lines: [
      { id: '1', display: 'Hello! I want to tell you about the jungle.', speak: 'Hello! I want to tell you about the jungle.' },
      { id: '2', display: 'Look. This is the jungle.', speak: 'Look. This is the jungle.' },
      { id: '3', display: 'I see monkeys, frogs, and a tiger.', speak: 'I see monkeys, frogs, and a tiger.' },
      { id: '4', display: 'I see bees, spiders, and a crocodile.', speak: 'I see bees, spiders, and a crocodile.' },
      { id: '5', display: 'Monkeys can jump.', speak: 'Monkeys can jump.' },
      { id: '6', display: 'The tiger looks sad.', speak: 'The tiger looks sad.' },
      { id: '7', display: 'Monkeys live here.', speak: 'Monkeys live here.' },
      { id: '8', display: 'Frogs live here.', speak: 'Frogs live here.' },
      { id: '9', display: 'Bees live here too!', speak: 'Bees live here too!' },
      { id: '10', display: 'Thanks for listening.', speak: 'Thanks for listening.' },
    ],
  },
  {
    id: 'bees-and-friends',
    shortTitle: 'Bees & friends',
    image: `${IMG}/scenario-2.png`,
    lines: [
      { id: '1', display: 'Hello! I am ready to present.', speak: 'Hello! I am ready to present.' },
      { id: '2', display: 'Look. This is the jungle.', speak: 'Look. This is the jungle.' },
      { id: '3', display: 'I see bees flying. The bees are small.', speak: 'I see bees flying. The bees are small.' },
      { id: '4', display: 'I see a big tiger and a little frog.', speak: 'I see a big tiger and a little frog.' },
      { id: '5', display: 'I see a monkey in a tree.', speak: 'I see a monkey in a tree.' },
      {
        id: '6',
        display: 'The tiger looks sad. The frog is happy. The monkey looks surprised.',
        speak: 'The tiger looks sad. The frog is happy. The monkey looks surprised.',
      },
      { id: '7', display: 'Bees live here.', speak: 'Bees live here.' },
      { id: '8', display: 'Tigers live here.', speak: 'Tigers live here.' },
      { id: '9', display: 'Monkeys live here too!', speak: 'Monkeys live here too!' },
      { id: '10', display: 'Thanks for listening.', speak: 'Thanks for listening.' },
    ],
  },
  {
    id: 'tigers-crocs',
    shortTitle: 'Tigers & crocs',
    image: `${IMG}/scenario-3.png`,
    lines: [
      { id: '1', display: 'Hello! This is my jungle story.', speak: 'Hello! This is my jungle story.' },
      { id: '2', display: 'Look. This is the jungle.', speak: 'Look. This is the jungle.' },
      { id: '3', display: 'It is night in the jungle.', speak: 'It is night in the jungle.' },
      { id: '4', display: 'I see tigers on the grass.', speak: 'I see tigers on the grass.' },
      { id: '5', display: 'I see crocodiles in the river.', speak: 'I see crocodiles in the river.' },
      { id: '6', display: 'The tigers look sad.', speak: 'The tigers look sad.' },
      { id: '7', display: 'The jungle is quiet.', speak: 'The jungle is quiet.' },
      { id: '8', display: 'Tigers live here.', speak: 'Tigers live here.' },
      { id: '9', display: 'Crocodiles live here.', speak: 'Crocodiles live here.' },
      { id: '10', display: 'Frogs live here too!', speak: 'Frogs live here too!' },
      { id: '11', display: 'Thanks for listening.', speak: 'Thanks for listening.' },
    ],
  },
];
