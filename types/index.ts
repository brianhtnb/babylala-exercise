export interface GameConfig {
  id: string;
  type:
    | 'counting'
    | 'sequence'
    | 'writing'
    | 'dialogue'
    | 'vocab-intro'
    | 'listen-pick'
    | 'spelling'
    | 'reading-quiz'
    | 'count-complete'
    | 'scene-reading'
    | 'speaking-present';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  dependsOn?: string[];
}

/* ── Jungle game data types ─────────────────────────────────── */

/** One screen in the “new words” intro carousel */
export interface VocabIntroItem {
  word: string;
  /** Public path under /public */
  image: string;
}

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

/** Listen to a short script, then pick the matching picture (A/B/C). */
export interface ListenPickQuestion {
  question: string;
  /** Full text under the question; user taps to speak via TTS */
  script: string;
  choices: {
    id: 'a' | 'b' | 'c';
    /** Public path e.g. /images/jungle/listen-pick/q01-a.png */
    image: string;
    /** Short label for accessibility */
    label: string;
  }[];
  correctId: 'a' | 'b' | 'c';
}

/** One line in a “speaking presentation” script (display + TTS text). */
export interface SpeakingPresentationLine {
  id: string;
  /** Shown in UI (can include line breaks via separate lines in data) */
  display: string;
  /** Spoken when the line is tapped or included in Play all */
  speak: string;
}

/** A full speaking scenario: big picture + script lines. */
export interface SpeakingPresentationScenario {
  id: string;
  shortTitle: string;
  /** Public path under /public */
  image: string;
  lines: SpeakingPresentationLine[];
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
