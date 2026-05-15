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
    | 'speaking-present'
    | 'final-checkpoint'
    /** Jungle Explorer map mini-games */
    | 'honey-bridge'
    | 'shadow-match'
    | 'lily-pad-count'
    | 'fruit-catch';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  dependsOn?: string[];
  /**
   * When true, the game is not shown as a card on the topic page (e.g. Jungle Explorer
   * map-only mini-games). Still routable via `/topic/.../exercise/{id}` from the map.
   */
  hideFromTopicList?: boolean;
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

/** One picture choice in listen-pick (A/B/C). */
export interface ListenPickChoice {
  id: 'a' | 'b' | 'c';
  /** Public path e.g. /images/jungle/listen-pick/q01-a.png */
  image: string;
  /** Short label for accessibility */
  label: string;
}

/**
 * Authoring shape: one listening script per picture (A / B / C).
 * Each line describes only that image — positive, kid-friendly wording.
 * Gameplay picks one script at random; `correctId` matches that choice.
 */
export interface ListenPickQuestionDefinition {
  id: string;
  question: string;
  scriptsByChoice: {
    a: string;
    b: string;
    c: string;
  };
  choices: ListenPickChoice[];
  /** Optional: extra vocabulary targets in these scripts (curriculum / authoring note). */
  vocabularyStretch?: string;
}

/** Resolved question for one play (one chosen script + matching correct image). */
export interface ListenPickQuestion {
  id: string;
  question: string;
  /** Full text under the question; user taps to speak via TTS */
  script: string;
  choices: ListenPickChoice[];
  correctId: 'a' | 'b' | 'c';
  /** 0 = script for A, 1 = B, 2 = C (matches which script was chosen). */
  scriptVariantIndex: 0 | 1 | 2;
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

/** One picture choice in a checkpoint listen task (same shape as listen-pick). */
export interface CheckpointListenChoice {
  id: 'a' | 'b' | 'c';
  image: string;
  label: string;
}

/** Listen: TTS question + optional script + pick A/B/C image. */
export interface CheckpointListenItem {
  id: string;
  skill: 'listen';
  question: string;
  script: string;
  choices: CheckpointListenChoice[];
  correctId: 'a' | 'b' | 'c';
}

/** Read: scene image + pick the correct sentence (vs one distractor). */
export interface CheckpointReadItem {
  id: string;
  skill: 'read';
  image: string;
  prompt: string;
  correct: string;
  wrong: string;
}

/** Write — find and tap the extra (wrong) letter among tiles. */
export interface CheckpointWriteExtraItem {
  id: string;
  skill: 'write';
  mode: 'extra-letter';
  word: string;
  /** Public path to illustration (match other jungle assets, e.g. animals/*.png) */
  image: string;
  letters: { char: string; isRedundant: boolean }[];
}

/**
 * Write — tap letters from a shuffled pool in the correct order to spell `target`.
 * `pool` must include every letter of `target` (with duplicates) plus 1–3 decoy letters.
 */
export interface CheckpointWriteBuildItem {
  id: string;
  skill: 'write';
  mode: 'build-word';
  /** Public path to illustration (same style as other checkpoint / jungle art) */
  image: string;
  /** Lowercase spelling target */
  target: string;
  /** Display order; include each character of target plus decoys (lowercase) */
  pool: string[];
  /** Optional short line under the title */
  hint?: string;
}

export type CheckpointWriteItem = CheckpointWriteExtraItem | CheckpointWriteBuildItem;

/** Speak: short prompt + record; scored on completion until STT exists. */
export interface CheckpointSpeakItem {
  id: string;
  skill: 'speak';
  title: string;
  prompt: string;
  /** Optional hero image (public path) */
  image?: string;
}

export type CheckpointItem =
  | CheckpointListenItem
  | CheckpointReadItem
  | CheckpointWriteItem
  | CheckpointSpeakItem;

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

export type JungleRegionId = 'meadow' | 'cave' | 'swamp' | 'treehouse' | 'temple';

export type JungleExplorerBadgeId = 'bee' | 'tiger' | 'crocodile' | 'monkey';

export type JungleExplorerToolId = 'binoculars' | 'compass';

export interface JungleExplorerProgress {
  version: 1;
  currentRegion: JungleRegionId;
  unlockedRegions: JungleRegionId[];
  badges: JungleExplorerBadgeId[];
  toolsUnlocked: JungleExplorerToolId[];
  /** Word (lowercase) → mastery stars 1–5 */
  wordMastery: Partial<Record<string, 1 | 2 | 3 | 4 | 5>>;
  regionFirstClear: Partial<Record<JungleRegionId, boolean>>;
}

export interface TopicProgress {
  completed: boolean;
  totalStars: number;
  games: { [gameId: string]: GameProgress };
  /** Jungle Explorer map / logbook state (optional; derived + merged from game progress). */
  explorer?: JungleExplorerProgress;
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
