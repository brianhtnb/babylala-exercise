import type {
  CheckpointItem,
  CheckpointListenItem,
  CheckpointReadItem,
  CheckpointSpeakItem,
  CheckpointWriteBuildItem,
  CheckpointWriteExtraItem,
} from '@/types';
import {
  listenPickQuestionDefinitions,
  resolveListenPickQuestionForChoice,
} from '@/topics/jungle/games/listen-pick-image';
import { readingSceneQuestions } from '@/topics/jungle/games/reading-quiz';
import { SPELLING_FOCUS_WORDS, generateSpellingLetters } from '@/topics/jungle/games/spelling';

/** Fixed length of the jungle topic check (3 listen + 3 read + 3 write + 1 speak). */
export const JUNGLE_CHECKPOINT_ITEM_COUNT = 13;

function shuffleIndices(length: number, rnd: () => number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** Three listen rounds: random pick from 7 definitions, random script (A/B/C) each — same as Listen & Pick. */
function pickCheckpointListenItems(rnd: () => number): CheckpointListenItem[] {
  const n = listenPickQuestionDefinitions.length;
  const order = shuffleIndices(n, rnd).slice(0, 3);
  const choiceIds = ['a', 'b', 'c'] as const;
  return order.map((defIndex, slot) => {
    const def = listenPickQuestionDefinitions[defIndex]!;
    const pick = choiceIds[Math.floor(rnd() * 3)]!;
    const r = resolveListenPickQuestionForChoice(def, pick);
    return {
      id: `cp-l${slot + 1}`,
      skill: 'listen' as const,
      question: r.question,
      script: r.script,
      choices: r.choices,
      correctId: r.correctId,
    };
  });
}

/** One extra-letter round: random animal from the seven focus words + fresh tiles — same generator as Spelling. */
function pickCheckpointExtraLetter(rnd: () => number): CheckpointWriteExtraItem {
  const words = [...SPELLING_FOCUS_WORDS] as string[];
  const word = words[Math.floor(rnd() * words.length)]!;
  return {
    id: 'cp-w1',
    skill: 'write',
    mode: 'extra-letter',
    word,
    image: `/images/jungle/animals/${word}.png`,
    letters: generateSpellingLetters(word, rnd),
  };
}

/**
 * Full jungle topic check with randomized listen content and randomized extra-letter word/tiles.
 * Call once per visit (e.g. `useState(() => buildJungleCheckpointSession())`).
 */
export function buildJungleCheckpointSession(random: () => number = Math.random): CheckpointItem[] {
  const rnd = random;

  const listen = pickCheckpointListenItems(rnd);

  const read: CheckpointReadItem[] = [
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
  ];

  const writeExtra = pickCheckpointExtraLetter(rnd);

  const writeBuild: CheckpointWriteBuildItem[] = [
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
  ];

  const speak: CheckpointSpeakItem[] = [
    {
      id: 'cp-s1',
      skill: 'speak',
      title: 'Speaking',
      prompt:
        'Look at the jungle picture. Say one sentence you remember, for example: “I see a monkey.” Then tap Submit.',
      image: '/images/jungle/speaking-present/scenario-2.png',
    },
  ];

  return [...listen, ...read, writeExtra, ...writeBuild, ...speak];
}
