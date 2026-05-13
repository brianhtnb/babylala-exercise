import { TopicConfig } from '@/types';

export const jungleConfig: TopicConfig = {
  id: 'jungle',
  title: "Let's Go to the Jungle",
  icon: '🌴',
  color: 'bg-success text-white',
  vocabulary: ['bee', 'tiger', 'frog', 'lizard', 'monkey', 'spider', 'crocodile', 'elephant', 'rabbit', 'snake'],
  sentences: [
    'There are ___ ___ in the jungle.',
    'I can see a ___ in the jungle.',
  ],
  games: [
    {
      id: 'jungle-spelling',
      type: 'spelling',
      title: 'Spelling Master',
      description: 'Find the extra letter hiding in the word!',
      difficulty: 1,
    },
    {
      id: 'jungle-reading',
      type: 'reading-quiz',
      title: 'Look & Read',
      description: 'Look at the scene and tick the correct sentence!',
      difficulty: 2,
      dependsOn: ['jungle-spelling'],
    },
    {
      id: 'jungle-count',
      type: 'count-complete',
      title: 'Count & Complete',
      description: 'Count the animals in the jungle and fill in the sentence!',
      difficulty: 3,
      dependsOn: ['jungle-reading'],
    },
    {
      id: 'jungle-scene',
      type: 'scene-reading',
      title: 'Who Lives Here?',
      description: 'Look at the jungle and write yes or no!',
      difficulty: 3,
      dependsOn: ['jungle-reading'],
    },
  ],
};
