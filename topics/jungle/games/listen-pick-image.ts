import type { ListenPickQuestion } from '@/types';

const BASE = '/images/jungle/listen-pick';

export const listenPickQuestions: ListenPickQuestion[] = [
  {
    question: 'Where is the monkey?',
    script: 'I see a monkey! Look up! The monkey is on the tree. Can you see it?',
    choices: [
      { id: 'a', image: `${BASE}/q01-a.png`, label: 'Monkey in the water' },
      { id: 'b', image: `${BASE}/q01-b.png`, label: 'Monkey on the tree' },
      { id: 'c', image: `${BASE}/q01-c.png`, label: 'Monkey eating a banana' },
    ],
    correctId: 'b',
  },
  {
    question: 'Where is the frog?',
    script: 'Shh... listen. The frog is sitting on the lily pad. It is very quiet.',
    choices: [
      { id: 'a', image: `${BASE}/q02-a.png`, label: 'Frog on a lily pad' },
      { id: 'b', image: `${BASE}/q02-b.png`, label: 'Frog under a leaf' },
      { id: 'c', image: `${BASE}/q02-c.png`, label: 'Frog jumping' },
    ],
    correctId: 'a',
  },
  {
    question: 'What is the tiger doing?',
    script: 'The tiger is thirsty. It goes to the water. The tiger is drinking at the river.',
    choices: [
      { id: 'a', image: `${BASE}/q03-a.png`, label: 'Tiger sleeping' },
      { id: 'b', image: `${BASE}/q03-b.png`, label: 'Tiger drinking at the river' },
      { id: 'c', image: `${BASE}/q03-c.png`, label: 'Tiger running' },
    ],
    correctId: 'b',
  },
  {
    question: 'Where is the bee?',
    script: 'Buzz, buzz! The bee likes the red flower. The bee is on the flower now.',
    choices: [
      { id: 'a', image: `${BASE}/q04-a.png`, label: 'Bee on a flower' },
      { id: 'b', image: `${BASE}/q04-b.png`, label: 'Bee near the beehive' },
      { id: 'c', image: `${BASE}/q04-c.png`, label: 'Bee flying high' },
    ],
    correctId: 'a',
  },
  {
    question: 'Where is the crocodile?',
    script: 'Splash! The crocodile loves the water. The crocodile is in the river.',
    choices: [
      { id: 'a', image: `${BASE}/q05-a.png`, label: 'Crocodile on the grass' },
      { id: 'b', image: `${BASE}/q05-b.png`, label: 'Crocodile in the river' },
      { id: 'c', image: `${BASE}/q05-c.png`, label: 'Crocodile in a tree' },
    ],
    correctId: 'b',
  },
  {
    question: 'Where is the spider?',
    script: 'Look between the trees. The spider made a web. The spider is on the big web.',
    choices: [
      { id: 'a', image: `${BASE}/q06-a.png`, label: 'Spider on a web' },
      { id: 'b', image: `${BASE}/q06-b.png`, label: 'Spider on a tail' },
      { id: 'c', image: `${BASE}/q06-c.png`, label: 'Spider in the water' },
    ],
    correctId: 'a',
  },
  {
    question: 'What is the lizard doing?',
    script: 'The sun is warm. The lizard likes the rock. The lizard is on the rock in the sun.',
    choices: [
      { id: 'a', image: `${BASE}/q07-a.png`, label: 'Lizard on a rock' },
      { id: 'b', image: `${BASE}/q07-b.png`, label: 'Lizard in shallow water' },
      { id: 'c', image: `${BASE}/q07-c.png`, label: 'Lizard on a vine' },
    ],
    correctId: 'a',
  },
];
