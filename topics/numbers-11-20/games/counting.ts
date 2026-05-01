import { CountingItem } from '@/types';

export const countingItems: CountingItem[] = [
  // Regular items
  { id: 'c1', count: 11, name: 'apples', items: ['🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎'] },
  { id: 'c2', count: 12, name: 'bananas', items: ['🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌','🍌'] },
  { id: 'c3', count: 13, name: 'cats', items: ['🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱','🐱'] },
  { id: 'c4', count: 14, name: 'oranges', items: ['🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊','🍊'] },
  { id: 'c5', count: 15, name: 'teddy bears', items: ['🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸','🧸'] },
  { id: 'c6', count: 16, name: 'dogs', items: ['🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶','🐶'] },
  { id: 'c7', count: 17, name: 'grapes', items: ['🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇'] },
  { id: 'c8', count: 18, name: 'cars', items: ['🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗','🚗'] },
  { id: 'c9', count: 19, name: 'rabbits', items: ['🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰','🐰'] },
  { id: 'c10', count: 20, name: 'strawberries', items: ['🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓','🍓'] },
  // Sea creatures from previous topic
  { id: 's1', count: 11, name: 'starfish', items: ['⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐'] },
  { id: 's2', count: 12, name: 'octopuses', items: ['🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙'] },
  { id: 's3', count: 13, name: 'sharks', items: ['🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈'] },
  { id: 's4', count: 14, name: 'clownfish', items: ['🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠'] },
  { id: 's5', count: 15, name: 'dolphins', items: ['🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬'] },
  { id: 's6', count: 16, name: 'whales', items: ['🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋'] },
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
