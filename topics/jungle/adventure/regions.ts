import type { JungleExplorerBadgeId, JungleRegionId } from '@/types';

export interface JungleAdventureRegion {
  id: JungleRegionId;
  title: string;
  shortLabel: string;
  /** Linked jungle exercise (existing game) */
  exerciseId: string;
  badge: JungleExplorerBadgeId | null;
  /** Position on wide map (percent of container width/height) */
  leftPct: number;
  topPct: number;
  /** Milo stands here while this stop is the active journey goal (map %). */
  miloLeftPct: number;
  miloTopPct: number;
}

/**
 * Region → adventure mini-game exercise id (see `syncJungleExplorerProgress`).
 */
export const JUNGLE_ADVENTURE_REGIONS: JungleAdventureRegion[] = [
  {
    id: 'meadow',
    title: 'Honey Meadow',
    shortLabel: 'Meadow',
    exerciseId: 'jungle-honey-bridge',
    badge: 'bee',
    leftPct: 10,
    topPct: 52,
    miloLeftPct: 10,
    miloTopPct: 36,
  },
  {
    id: 'cave',
    title: "Tiger's Cave",
    shortLabel: 'Cave',
    exerciseId: 'jungle-shadow-match',
    badge: 'tiger',
    leftPct: 28,
    topPct: 46,
    miloLeftPct: 28,
    miloTopPct: 30,
  },
  {
    id: 'swamp',
    title: 'Crocodile Swamp',
    shortLabel: 'Swamp',
    exerciseId: 'jungle-lily-pad-count',
    badge: 'crocodile',
    leftPct: 50,
    topPct: 56,
    miloLeftPct: 50,
    miloTopPct: 40,
  },
  {
    id: 'treehouse',
    title: 'Monkey Tree',
    shortLabel: 'Tree',
    exerciseId: 'jungle-fruit-catch',
    badge: 'monkey',
    leftPct: 72,
    topPct: 40,
    miloLeftPct: 72,
    miloTopPct: 26,
  },
  {
    id: 'temple',
    title: 'Ancient Temple',
    shortLabel: 'Temple',
    exerciseId: 'jungle-checkpoint',
    badge: null,
    leftPct: 88,
    topPct: 36,
    miloLeftPct: 88,
    miloTopPct: 22,
  },
];
