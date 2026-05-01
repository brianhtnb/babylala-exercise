import { CountingItem } from '@/types';

export const countingItems: CountingItem[] = [
  { id: 'c1', count: 11, type: 'fruit', items: ['🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎'] },
  { id: 'c2', count: 12, type: 'fruit', items: ['🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌'] },
  { id: 'c3', count: 13, type: 'animal', items: ['🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱'] },
  { id: 'c4', count: 14, type: 'fruit', items: ['🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊'] },
  { id: 'c5', count: 15, type: 'toy', items: ['🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸'] },
  { id: 'c6', count: 16, type: 'animal', items: ['🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶'] },
  { id: 'c7', count: 17, type: 'fruit', items: ['🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇'] },
  { id: 'c8', count: 18, type: 'toy', items: ['🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗'] },
  { id: 'c9', count: 19, type: 'animal', items: ['🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰'] },
  { id: 'c10', count: 20, type: 'fruit', items: ['🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓'] },
];

export function getCountingItems(count: number = 10): CountingItem[] {
  const shuffled = [...countingItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateAnswerOptions(correctAnswer: number): number[] {
  const options = new Set<number>();
  options.add(correctAnswer);

  while (options.size < 4) {
    const wrong = Math.floor(Math.random() * 10) + 11;
    if (wrong !== correctAnswer) {
      options.add(wrong);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}
