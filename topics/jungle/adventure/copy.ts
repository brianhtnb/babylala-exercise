/** Milo / UI copy for Jungle Explorer (English, TTS-friendly). */

export const jungleExploreCopy = {
  mapWelcome:
    'Welcome, explorer! I am Milo. Tap a glowing place on the map to start your jungle adventure!',
  regionLocked: 'This area is still locked. Finish the previous adventure first!',
  logbookOpen: 'Open your explorer logbook.',
  badgePraise: {
    bee: 'Honey Bridge hero! You built every letter bridge. Buzz buzz!',
    tiger: 'Shadow cave hero! You matched every animal in the dark. Great roar!',
    crocodile: 'Swamp hero! You counted every lily pad friend. Snap!',
    monkey: 'Tree hero! You caught every fruit Milo asked for. Ooh ooh ah ah!',
  } as const,
  /** When tapping a badge in My Collection — where it was earned */
  badgeFoundAt: {
    bee: 'You earned this badge at Honey Meadow after Honey Bridge Builder!',
    tiger: 'You earned this badge in Tiger Cave after Shadow Match!',
    crocodile: 'You earned this badge at Crocodile Swamp after Lily Pad Count!',
    monkey: 'You earned this badge at Monkey Tree after Fruit Catch!',
  } as const,
  toolLine: {
    binoculars:
      'You found binoculars at Honey Meadow! They help you look far. Say look far!',
    compass:
      'You found a compass in Tiger Cave! It shows direction. Say north!',
  } as const,
};
