import { ProgressData, TopicProgress, GameProgress, AppSettings } from '@/types';

const STORAGE_KEY = 'babylala-progress';
const STORAGE_VERSION = 1;

export const defaultSettings: AppSettings = {
  soundEnabled: true,
  musicEnabled: false,
};

export const defaultProgressData: ProgressData = {
  version: STORAGE_VERSION,
  topics: {},
  lastPlayed: '',
  settings: defaultSettings,
};

export function loadProgress(): ProgressData {
  if (typeof window === 'undefined') {
    return defaultProgressData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultProgressData;
    }

    const parsed = JSON.parse(stored);
    
    if (parsed.version !== STORAGE_VERSION) {
      return defaultProgressData;
    }

    return { ...defaultProgressData, ...parsed };
  } catch (error) {
    console.error('Error loading progress:', error);
    return defaultProgressData;
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function getTopicProgress(
  data: ProgressData,
  topicId: string
): TopicProgress {
  return (
    data.topics[topicId] || {
      completed: false,
      totalStars: 0,
      games: {},
    }
  );
}

export function getGameProgress(
  data: ProgressData,
  topicId: string,
  gameId: string
): GameProgress {
  const topic = getTopicProgress(data, topicId);
  return (
    topic.games[gameId] || {
      completed: false,
      highScore: 0,
      stars: 0,
      lastPlayed: null,
      attempts: 0,
    }
  );
}

export function updateGameProgress(
  data: ProgressData,
  topicId: string,
  gameId: string,
  progress: Partial<GameProgress>
): ProgressData {
  const topic = getTopicProgress(data, topicId);
  const game = getGameProgress(data, topicId, gameId);

  const updatedGame: GameProgress = {
    ...game,
    ...progress,
    lastPlayed: new Date().toISOString(),
  };

  const updatedTopic: TopicProgress = {
    ...topic,
    games: {
      ...topic.games,
      [gameId]: updatedGame,
    },
  };

  updatedTopic.totalStars = Object.values(updatedTopic.games).reduce(
    (sum, g) => sum + g.stars,
    0
  );

  updatedTopic.completed = Object.values(updatedTopic.games).every(
    (g) => g.stars > 0
  );

  return {
    ...data,
    topics: {
      ...data.topics,
      [topicId]: updatedTopic,
    },
    lastPlayed: topicId,
  };
}

export function updateSettings(
  data: ProgressData,
  settings: Partial<AppSettings>
): ProgressData {
  return {
    ...data,
    settings: {
      ...data.settings,
      ...settings,
    },
  };
}

export function getTotalStars(data: ProgressData): number {
  return Object.values(data.topics).reduce(
    (sum, topic) => sum + topic.totalStars,
    0
  );
}
