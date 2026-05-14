import type { CheckpointItem } from '@/types';
import { listenPickQuestions } from '@/topics/jungle/games/listen-pick-image';
import { readingSceneQuestions } from '@/topics/jungle/games/reading-quiz';
import { spellingQuestions } from '@/topics/jungle/games/spelling';

/**
 * End-of-topic mixed skills review (jungle). Order: listen → read → write → speak.
 * Write uses two modes: `extra-letter` (same as spelling game) and `build-word` (tap pool in order).
 */
export const jungleCheckpointItems: CheckpointItem[] = [
  {
    id: 'cp-l1',
    skill: 'listen',
    question: listenPickQuestions[0].question,
    script: listenPickQuestions[0].script,
    choices: listenPickQuestions[0].choices,
    correctId: listenPickQuestions[0].correctId,
  },
  {
    id: 'cp-l2',
    skill: 'listen',
    question: listenPickQuestions[2].question,
    script: listenPickQuestions[2].script,
    choices: listenPickQuestions[2].choices,
    correctId: listenPickQuestions[2].correctId,
  },
  {
    id: 'cp-l3',
    skill: 'listen',
    question: listenPickQuestions[4].question,
    script: listenPickQuestions[4].script,
    choices: listenPickQuestions[4].choices,
    correctId: listenPickQuestions[4].correctId,
  },
  {
    id: 'cp-r1',
    skill: 'read',
    image: readingSceneQuestions[0].image,
    prompt: 'Which sentence matches the picture?',
    correct: readingSceneQuestions[0].correct,
    wrong: readingSceneQuestions[0].wrong,
  },
  {
    id: 'cp-r2',
    skill: 'read',
    image: readingSceneQuestions[2].image,
    prompt: 'Which sentence matches the picture?',
    correct: readingSceneQuestions[2].correct,
    wrong: readingSceneQuestions[2].wrong,
  },
  {
    id: 'cp-r3',
    skill: 'read',
    image: readingSceneQuestions[4].image,
    prompt: 'Which sentence matches the picture?',
    correct: readingSceneQuestions[4].correct,
    wrong: readingSceneQuestions[4].wrong,
  },
  {
    id: 'cp-w1',
    skill: 'write',
    mode: 'extra-letter',
    word: spellingQuestions[0].word,
    image: '/images/jungle/animals/bee.png',
    letters: spellingQuestions[0].letters,
  },
  {
    id: 'cp-w2',
    skill: 'write',
    mode: 'build-word',
    image: '/images/jungle/animals/tiger.png',
    target: 'tiger',
    pool: ['r', 'x', 'e', 't', 'g', 'i', 'm', 'p'],
    hint: 'Extra letters are not part of the animal word. Tap in order.',
  },
  {
    id: 'cp-w3',
    skill: 'write',
    mode: 'build-word',
    image: '/images/jungle/animals/spider.png',
    target: 'spider',
    pool: ['r', 'e', 'd', 's', 'p', 'i', 'q', 'b', 'a'],
    hint: 'Spell the word in the empty boxes.',
  },
  {
    id: 'cp-s1',
    skill: 'speak',
    title: 'Speaking',
    prompt:
      'Look at the jungle picture. Say one sentence you remember, for example: “I see a monkey.” Then tap Submit.',
    image: '/images/jungle/speaking-present/scenario-2.png',
  },
];
