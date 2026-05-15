/**
 * Public paths for Jungle Explorer art under `/public/images/jungle/adventure/`.
 * Badges use animal portraits until `badge-*.png` exist in the adventure folder.
 */

const ADV = '/images/jungle/adventure';
const AN = '/images/jungle/animals';

export const adventureAssets = {
  map: `${ADV}/map-panorama-wide.png`,
  milo: {
    neutral: `${ADV}/milo-neutral.png`,
    happy: `${ADV}/milo-happy.png`,
    think: `${ADV}/milo-think.png`,
    talk: `${ADV}/milo-talk.png`,
  },
  regionThumb: {
    meadow: `${ADV}/region-meadow-thumb.png`,
    cave: `${ADV}/region-cave-thumb.png`,
    swamp: `${ADV}/region-swamp-thumb.png`,
    treehouse: `${ADV}/region-tree-thumb.png`,
    temple: `${ADV}/region-temple-thumb.png`,
  },
  /** Replace with `${ADV}/badge-bee.png` etc. when generated */
  badge: {
    bee: `${AN}/bee.png`,
    tiger: `${AN}/tiger.png`,
    crocodile: `${AN}/crocodile.png`,
    monkey: `${AN}/monkey.png`,
  } as const,
} as const;
