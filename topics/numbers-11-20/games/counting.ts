import { CountingItem } from '@/types';

export const countingItems: CountingItem[] = [
  { id: 's1', count: 11, name: 'starfish', items: ['⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐'] },
  { id: 's2', count: 12, name: 'octopuses', items: ['🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙','🐙'] },
  { id: 's3', count: 13, name: 'sharks', items: ['🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈','🦈'] },
  { id: 's4', count: 14, name: 'clownfish', items: ['🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠'] },
  { id: 's5', count: 15, name: 'dolphins', items: ['🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬','🐬'] },
  { id: 's6', count: 16, name: 'whales', items: ['🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋','🐋'] },
];

export function getCountingItems(count: number = 6): CountingItem[] {
  const shuffled = [...countingItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, countingItems.length));
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
