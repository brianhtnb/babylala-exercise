/**
 * Design tokens aligned with Oliver AI frontend patterns (typography classes,
 * motion hints, layout, score semantics). Pair with `type-*` utilities in globals.css.
 */

export const TYPOGRAPHY = {
  pageTitle: 'type-page-title',
  pageSubtitle: 'type-page-subtitle',
  sectionTitle: 'type-section-title',
  sectionSubtitle: 'type-section-subtitle',
  cardTitle: 'type-card-title',
  body: 'type-card-body',
  caption: 'type-caption',
  eyebrow: 'type-eyebrow',
  metric: 'type-metric',
  control: 'type-control',
} as const;

/** Section header stack: title + muted subtitle */
export const SECTION_STYLES = {
  title: TYPOGRAPHY.sectionTitle,
  subtitle: `${TYPOGRAPHY.sectionSubtitle} mt-1`,
} as const;

export const PAGE_CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';

export const SPACING = {
  cardPadding: 'p-6',
  sectionGap: 'gap-6',
  inlineGap: 'gap-3',
} as const;

export const ANIMATION_DURATIONS = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  stagger: 0.08,
} as const;

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: ANIMATION_DURATIONS.normal },
} as const;

export const SETTLE_IN = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATIONS.slow, ease: [0.25, 0.1, 0.25, 1] },
} as const;

export const STAGGER_CHILDREN = {
  animate: { transition: { staggerChildren: ANIMATION_DURATIONS.stagger } },
} as const;

/** Match Tailwind `score-*` and coaching-style thresholds */
export const SCORE_COLORS = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
} as const;

export const SCORE_THRESHOLDS = {
  good: 70,
  warning: 50,
} as const;
