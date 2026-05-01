import { TopicConfig } from '@/types';

export const numbersConfig: TopicConfig = {
  id: 'numbers-11-20',
  title: 'Numbers 11-20',
  icon: '🔢',
  color: 'bg-blue-500',
  vocabulary: [
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  ],
  sentences: ['How many ___ are there?', 'There are ___'],
  games: [
    {
      id: 'count-and-choose',
      type: 'counting',
      title: 'Count the Items',
      description: 'Count the fruits and animals!',
      difficulty: 1,
    },
    {
      id: 'missing-number',
      type: 'sequence',
      title: 'Find the Missing Number',
      description: 'Put the missing number in place!',
      difficulty: 2,
      dependsOn: ['count-and-choose'],
    },
    {
      id: 'trace-number',
      type: 'writing',
      title: 'Trace the Number',
      description: 'Draw the number with your finger!',
      difficulty: 2,
      dependsOn: ['count-and-choose'],
    },
    {
      id: 'role-play',
      type: 'dialogue',
      title: 'Ask and Answer',
      description: 'Practice asking and answering!',
      difficulty: 3,
      dependsOn: ['missing-number', 'trace-number'],
    },
  ],
};
