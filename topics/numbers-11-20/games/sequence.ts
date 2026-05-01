import { SequenceProblem } from '@/types';

export function generateSequenceProblems(count: number = 8): SequenceProblem[] {
  const problems: SequenceProblem[] = [];

  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * 7) + 11;
    const missingIndex = Math.floor(Math.random() * 4);
    const sequence: (number | null)[] = [];

    for (let j = 0; j < 5; j++) {
      if (j === missingIndex) {
        sequence.push(null);
      } else {
        sequence.push(start + j);
      }
    }

    const correctAnswer = start + missingIndex;

    const options = new Set<number>([correctAnswer]);
    while (options.size < 4) {
      const wrong = Math.floor(Math.random() * 10) + 11;
      if (wrong !== correctAnswer) {
        options.add(wrong);
      }
    }

    problems.push({
      id: `seq-${i}`,
      sequence,
      missingIndex,
      correctAnswer,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }

  return problems;
}
