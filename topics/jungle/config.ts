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
      id: 'jungle-reading',
      type: 'reading-quiz',
      title: 'True or False?',
      description: 'Read the sentence and decide if it is true or false!',
      difficulty: 1,
    },
    {
      id: 'jungle-spelling',
      type: 'spelling',
      title: 'Spelling Master',
      description: 'Find the extra letters hiding in the word!',
      difficulty: 2,
      dependsOn: ['jungle-reading'],
    },
    {
      id: 'jungle-count',
      type: 'count-complete',
      title: 'Count & Complete',
      description: 'Count the animals and fill in the sentence!',
      difficulty: 3,
      dependsOn: ['jungle-spelling'],
    },
  ],
};
