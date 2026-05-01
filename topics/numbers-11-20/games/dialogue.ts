import { RolePlayDialogue } from '@/types';

const objectTypes = [
  { type: 'starfish', emoji: '⭐' },
  { type: 'octopuses', emoji: '🐙' },
  { type: 'sharks', emoji: '🦈' },
  { type: 'clownfish', emoji: '🐠' },
  { type: 'dolphins', emoji: '🐬' },
  { type: 'whales', emoji: '🐋' },
];

const numberWords: { [key: number]: string } = {
  11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
  16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
};

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
    const countWord = numberWords[countNum];

    const answer = `There are ${countWord}.`;
    const options = new Set<string>([answer]);
    
    while (options.size < 3) {
      const wrongCount = Math.floor(Math.random() * 10) + 11;
      const wrongWord = numberWords[wrongCount];
      if (wrongCount !== countNum) {
        options.add(`There are ${wrongWord}.`);
      }
    }

    dialogues.push({
      id: `dialogue-${i}`,
      question: `How many ${objectInfo.type} are there?`,
      answer: answer,
      count: countNum,
      objectType: objectInfo.type,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }

  return dialogues;
}
