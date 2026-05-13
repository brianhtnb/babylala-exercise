export interface GameConfig {
  id: string;
  type: 'counting' | 'sequence' | 'writing' | 'dialogue' | 'spelling' | 'reading-quiz' | 'count-complete' | 'scene-reading';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  dependsOn?: string[];
}

/* ── Jungle game data types ─────────────────────────────────── */

export interface SpellingQuestion {
  word: string;
  emoji: string;
  /** Letters displayed to the player — some are correct, some redundant */
  letters: { char: string; isRedundant: boolean }[];
}

export interface ReadingQuestion {
  emoji: string;
  sentence: string;
  answer: boolean;
}

export interface CountCompleteQuestion {
  /** Animal name — used to derive the image path and highlight in the scene */
  animal: string;
  /** Sentence with "___" as the blank to fill */
  sentence: string;
  options: string[];
  answer: string;
}

export interface ReadingSceneQuestion {
  /** Relative path inside /public — e.g. /images/jungle/animals/scene-*.png */
  image: string;
  correct: string;
  wrong: string;
}

export interface SceneReadingQuestion {
  /** The animal being asked about */
  animal: string;
  sentence: string;
  answer: boolean;
}

export interface TopicConfig {
  id: string;
  title: string;
  icon: string;
  color: string;
  vocabulary: string[];
  sentences: string[];
  games: GameConfig[];
  /** Optional hero strip image (public path, e.g. /images/jungle/animals/...) */
  heroImage?: string;
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
  name: string; // e.g., "apples", "cats", "cars"
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
