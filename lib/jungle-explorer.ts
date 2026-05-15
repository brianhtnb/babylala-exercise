import type {
  GameProgress,
  JungleExplorerBadgeId,
  JungleExplorerProgress,
  JungleExplorerToolId,
  JungleRegionId,
  ProgressData,
  TopicProgress,
} from '@/types';
import { JUNGLE_ADVENTURE_REGIONS } from '@/topics/jungle/adventure/regions';

/** Legacy topic games that count as clearing the same map stop (saved progress before adventure games). */
const ADVENTURE_LEGACY: Record<string, readonly string[]> = {
  'jungle-honey-bridge': ['jungle-vocab'],
  'jungle-shadow-match': ['jungle-spelling'],
  'jungle-lily-pad-count': ['jungle-count'],
  'jungle-fruit-catch': ['jungle-scene'],
  'jungle-checkpoint': [],
};

function gameDone(
  g: { [gameId: string]: GameProgress | undefined },
  primaryId: string,
  legacyIds: readonly string[]
): boolean {
  if (g[primaryId]?.completed) return true;
  return legacyIds.some((id) => g[id]?.completed);
}

function isJungleAdventureExerciseComplete(
  g: { [gameId: string]: GameProgress | undefined },
  exerciseId: string
): boolean {
  const legacy = ADVENTURE_LEGACY[exerciseId] ?? [];
  return gameDone(g, exerciseId, legacy);
}

/** Index of the first stop whose exercise is not completed yet, or `regions.length` if all done. */
export function getJungleFirstIncompleteRegionIndex(
  games: { [gameId: string]: GameProgress | undefined } | undefined
): number {
  const g = games ?? {};
  for (let i = 0; i < JUNGLE_ADVENTURE_REGIONS.length; i++) {
    const r = JUNGLE_ADVENTURE_REGIONS[i]!;
    if (!isJungleAdventureExerciseComplete(g, r.exerciseId)) return i;
  }
  return JUNGLE_ADVENTURE_REGIONS.length;
}

/** Active journey stop: first incomplete exercise, or temple after everything is cleared. */
export function getJungleMiloRegionId(
  games: { [gameId: string]: GameProgress | undefined } | undefined
): JungleRegionId {
  const idx = getJungleFirstIncompleteRegionIndex(games);
  if (idx >= JUNGLE_ADVENTURE_REGIONS.length) {
    return 'temple';
  }
  return JUNGLE_ADVENTURE_REGIONS[idx]!.id;
}

/** True if this region is at or before the journey frontier (playable / replayable). */
export function isJungleRegionOnOrBeforeJourney(
  games: { [gameId: string]: GameProgress | undefined } | undefined,
  regionId: JungleRegionId
): boolean {
  const frontier = getJungleFirstIncompleteRegionIndex(games);
  const idx = JUNGLE_ADVENTURE_REGIONS.findIndex((r) => r.id === regionId);
  if (idx < 0) return false;
  return idx <= frontier;
}

function uniqueRegions(ids: JungleRegionId[]): JungleRegionId[] {
  const seen = new Set<JungleRegionId>();
  const out: JungleRegionId[] = [];
  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function defaultExplorer(): JungleExplorerProgress {
  return {
    version: 1,
    currentRegion: 'meadow',
    unlockedRegions: ['meadow'],
    badges: [],
    toolsUnlocked: [],
    wordMastery: {},
    regionFirstClear: {},
  };
}

/**
 * Recompute jungle explorer unlocks and badges from completed topic games.
 * New adventure games are primary; legacy exercise ids still grant credit (migration).
 * Preserves `wordMastery` and `regionFirstClear` keys from the previous explorer object.
 */
export function syncJungleExplorerProgress(data: ProgressData): ProgressData {
  const jungle: TopicProgress =
    data.topics.jungle ?? {
      completed: false,
      totalStars: 0,
      games: {},
    };

  const g = jungle.games;

  const honey = isJungleAdventureExerciseComplete(g, 'jungle-honey-bridge');
  const shadow = isJungleAdventureExerciseComplete(g, 'jungle-shadow-match');
  const lily = isJungleAdventureExerciseComplete(g, 'jungle-lily-pad-count');
  const fruit = isJungleAdventureExerciseComplete(g, 'jungle-fruit-catch');
  const checkpoint = Boolean(g['jungle-checkpoint']?.completed);

  const badges: JungleExplorerBadgeId[] = [];
  if (honey) badges.push('bee');
  if (shadow) badges.push('tiger');
  if (lily) badges.push('crocodile');
  if (fruit) badges.push('monkey');

  const unlocked: JungleRegionId[] = ['meadow'];
  if (honey) unlocked.push('cave');
  if (shadow) unlocked.push('swamp');
  if (lily) unlocked.push('treehouse');
  if (badges.length >= 4) unlocked.push('temple');
  if (checkpoint) unlocked.push('temple');

  const toolsUnlocked: JungleExplorerToolId[] = [];
  if (honey) toolsUnlocked.push('binoculars');
  if (shadow) toolsUnlocked.push('compass');

  const prev = jungle.explorer;
  const wordMastery = prev?.wordMastery ? { ...prev.wordMastery } : {};
  const regionFirstClear = prev?.regionFirstClear ? { ...prev.regionFirstClear } : {};

  const currentRegion = getJungleMiloRegionId(g);

  const explorer: JungleExplorerProgress = {
    version: 1,
    currentRegion,
    unlockedRegions: uniqueRegions(unlocked),
    badges: Array.from(new Set(badges)),
    toolsUnlocked: Array.from(new Set(toolsUnlocked)),
    wordMastery,
    regionFirstClear,
  };

  return {
    ...data,
    topics: {
      ...data.topics,
      jungle: {
        ...jungle,
        explorer,
      },
    },
  };
}

export function getJungleExplorerOrDefault(data: ProgressData): JungleExplorerProgress {
  return data.topics.jungle?.explorer ?? defaultExplorer();
}
