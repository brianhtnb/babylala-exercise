import { RolePlayDialogue } from '@/types';

const objectTypes = [
  { type: 'apples', emoji: '🍎' },
  { type: 'bananas', emoji: '🍌' },
  { type: 'cats', emoji: '🐱' },
  { type: 'dogs', emoji: '🐶' },
  { type: 'books', emoji: '📚' },
  { type: 'toys', emoji: '🧸' },
  { type: 'birds', emoji: '🐦' },
  { type: 'flowers', emoji: '🌸' },
];

export function generateDialogues(count: number = 5): RolePlayDialogue[] {
  const dialogues: RolePlayDialogue[] = [];
  const usedCounts = new Set<number>();

  for (let i = 0; i < count; i++) {
    let countNum: number;
    do {
      countNum = Math.floor(Math.random() * 10) + 11;
    } while (usedCounts.has(countNum));
    usedCounts.add(countNum);

    const objectInfo = objectTypes[Math.floor(Math.random() * objectTypes.length)];

    const options = new Set<string>([`There are ${countNum}.`]);
    while (options.size < 3) {
      const wrongCount = Math.floor(Math.random() * 10) + 11;
      if (wrongCount !== countNum) {
        options.add(`There are ${wrongCount}.`);
      }
    }

    dialogues.push({
      id: `dialogue-${i}`,
      question: `How many ${objectInfo.type} are there?`,
      answer: `There are ${countNum}.`,
      count: countNum,
      objectType: objectInfo.type,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }

  return dialogues;
}
