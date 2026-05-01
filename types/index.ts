export interface GameConfig {
  id: string;
  type: 'counting' | 'sequence' | 'writing' | 'dialogue';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  dependsOn?: string[];
}

export interface TopicConfig {
  id: string;
  title: string;
  icon: string;
  color: string;
  vocabulary: string[];
  sentences: string[];
  games: GameConfig[];
}

export interface GameProgress {
  completed: boolean;
  highScore: number;
  stars: number;
  lastPlayed: string | null;
  attempts: number;
}

export interface TopicProgress {
  completed: boolean;
  totalStars: number;
  games: { [gameId: string]: GameProgress };
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface ProgressData {
  version: number;
  topics: { [topicId: string]: TopicProgress };
  lastPlayed: string;
  settings: AppSettings;
}

export interface CountingItem {
  id: string;
  count: number;
  type: 'fruit' | 'animal' | 'toy';
  items: string[];
}

export interface SequenceProblem {
  id: string;
  sequence: (number | null)[];
  missingIndex: number;
  correctAnswer: number;
  options: number[];
}

export interface RolePlayDialogue {
  id: string;
  question: string;
  answer: string;
  count: number;
  objectType: string;
  options: string[];
}
