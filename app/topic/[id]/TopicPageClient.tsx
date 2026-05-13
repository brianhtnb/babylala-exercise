'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calculator,
  ChevronLeft,
  Hash,
  Headphones,
  Images,
  Languages,
  Map,
  MessageCircle,
  Pencil,
  SpellCheck,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/app/components/common/Card';
import { StarDisplay } from '@/app/components/common/StarDisplay';

import { getTopicById } from '@/topics';
import { loadProgress, getGameProgress } from '@/lib/storage';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import type { GameConfig, ProgressData } from '@/types';
import { cn } from '@/lib/utils';
import { PAGE_CONTAINER, TYPOGRAPHY, ANIMATION_DURATIONS, SETTLE_IN } from '@/lib/design-tokens';

/** Jungle-only decorative card backgrounds (public paths). */
const JUNGLE_GAME_CARD_BACKGROUNDS: Partial<Record<GameConfig['type'], string>> = {
  'vocab-intro': '/images/jungle/animals/monkey.png',
  'listen-pick': '/images/jungle/animals/scene-frogs-crocodiles.png',
  spelling: '/images/jungle/animals/bee.png',
  'reading-quiz': '/images/jungle/animals/scene-bees-monkeys.png',
  'count-complete': '/images/jungle/animals/panorama-counting.png',
  'scene-reading': '/images/jungle/animals/panorama-yesno.png',
};

const GAME_VISUALS: Record<
  GameConfig['type'],
  { shell: string; iconWrap: string; iconClass: string; Icon: LucideIcon }
> = {
  counting: {
    shell: 'bg-warning-light border-warning/40',
    iconWrap: 'border-warning/35 bg-warning-light',
    iconClass: 'text-warning',
    Icon: Calculator,
  },
  sequence: {
    shell: 'bg-primary/10 border-primary/35',
    iconWrap: 'border-primary/30 bg-primary/10',
    iconClass: 'text-primary',
    Icon: BarChart3,
  },
  writing: {
    shell: 'bg-info-light border-info/40',
    iconWrap: 'border-info/35 bg-info-light',
    iconClass: 'text-info',
    Icon: Pencil,
  },
  dialogue: {
    shell: 'bg-danger-light border-danger/35',
    iconWrap: 'border-danger/30 bg-danger-light',
    iconClass: 'text-danger',
    Icon: MessageCircle,
  },
  'vocab-intro': {
    shell: 'bg-info-light border-info/40',
    iconWrap: 'border-info/35 bg-info-light',
    iconClass: 'text-info',
    Icon: Languages,
  },
  'listen-pick': {
    shell: 'bg-primary/[0.09] border-primary/32',
    iconWrap: 'border-primary/28 bg-primary/[0.08]',
    iconClass: 'text-primary',
    Icon: Headphones,
  },
  spelling: {
    shell: 'bg-secondary/10 border-secondary/40',
    iconWrap: 'border-secondary/35 bg-secondary/10',
    iconClass: 'text-secondary',
    Icon: SpellCheck,
  },
  'reading-quiz': {
    shell: 'bg-primary/[0.08] border-primary/30',
    iconWrap: 'border-primary/25 bg-primary/[0.08]',
    iconClass: 'text-primary',
    Icon: Images,
  },
  'count-complete': {
    shell: 'bg-warning-light border-warning/38',
    iconWrap: 'border-warning/32 bg-warning-light',
    iconClass: 'text-warning',
    Icon: Hash,
  },
  'scene-reading': {
    shell: 'bg-success-light border-success/45',
    iconWrap: 'border-success/40 bg-success-light',
    iconClass: 'text-success',
    Icon: Map,
  },
};

export default function TopicPageClient() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const topic = getTopicById(topicId);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  const isJungleTopic = topicId === 'jungle';

  useEffect(() => {
    setProgress(loadProgress());
    stopSpeaking(); // cancel anything still playing from previous page
    if (topic) {
      speak(`Welcome to ${topic.title}! Choose a game to play!`);
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <p className={TYPOGRAPHY.pageTitle}>Topic not found!</p>
      </div>
    );
  }

  const handleGameClick = async (gameId: string) => {
    await playEffect('click');
    router.push(`/topic/${topicId}/exercise/${gameId}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-app',
        isJungleTopic &&
          'bg-gradient-to-br from-success/[0.11] via-app via-45% to-primary/[0.07] dark:from-success/[0.14] dark:via-app dark:to-primary/[0.09]'
      )}
    >
      <main className={PAGE_CONTAINER}>
        {/* Inline back nav */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleBack}
            aria-label="Back to topics"
            className="w-9 h-9 rounded-lg bg-surface-secondary border border-dm-border flex items-center justify-center text-content-muted hover:text-content hover:border-primary/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={cn(TYPOGRAPHY.label, 'text-content-muted')}>All Topics</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: ANIMATION_DURATIONS.slow, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          {topic.heroImage ? (
            <div className="relative mb-8 max-w-3xl mx-auto h-40 sm:h-44 md:h-52 rounded-2xl overflow-hidden border border-dm-border shadow-nexus-md isolate">
              <Image
                src={topic.heroImage}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-app via-app/55 to-transparent dark:from-app dark:via-app/50 dark:to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]"
                aria-hidden
              />
            </div>
          ) : null}

          {!topic.heroImage ? (
            <div
              className={cn(
                'inline-flex items-center justify-center w-32 h-32 rounded-xl text-7xl mb-4 shadow-nexus-md ring-1 ring-black/[0.04] dark:ring-white/[0.08]',
                topic.color
              )}
            >
              {topic.icon}
            </div>
          ) : null}
          <h1 className={cn(TYPOGRAPHY.pageTitle, 'text-3xl md:text-4xl mb-3')}>{topic.title}</h1>
          <p className={cn(TYPOGRAPHY.pageSubtitle, 'max-w-2xl mx-auto text-base')}>
            Learn {topic.vocabulary.length} new words and practice {topic.sentences.length} sentence
            patterns!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {topic.games.map((game, index) => {
            const gameProgress = progress
              ? getGameProgress(progress, topicId, game.id)
              : { completed: false, stars: 0 };

            const isLocked = false;
            const visual = GAME_VISUALS[game.type];
            const GameIcon = visual.Icon;
            const cardBg =
              isJungleTopic ? JUNGLE_GAME_CARD_BACKGROUNDS[game.type] : undefined;

            return (
              <motion.div
                key={game.id}
                className="h-full min-h-[308px] md:min-h-[328px]"
                initial={SETTLE_IN.initial}
                animate={SETTLE_IN.animate}
                transition={{ ...SETTLE_IN.transition, delay: index * ANIMATION_DURATIONS.stagger }}
              >
                <Card
                  asDiv
                  onClick={() => handleGameClick(game.id)}
                  locked={isLocked}
                  className={cn(
                    'h-full min-h-[inherit] overflow-hidden flex flex-col rounded-2xl',
                    cardBg
                      ? 'border border-dm-border shadow-nexus-md !p-0 ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
                      : cn('border-2', visual.shell)
                  )}
                >
                  {cardBg ? (
                    <>
                      {/* Hero strip: full-color art, no heavy wash */}
                      <div className="relative h-[9.5rem] sm:h-40 md:h-44 w-full shrink-0 overflow-hidden bg-surface-secondary">
                        <Image
                          src={cardBg}
                          alt=""
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, 448px"
                          priority={index < 2}
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/[0.12] to-transparent dark:from-black/[0.28]"
                          aria-hidden
                        />
                      </div>
                      {/* Content block: readable surface, icon overlaps hero */}
                      <div className="relative flex flex-1 flex-col min-h-0 bg-surface px-4 pb-4 pt-0 sm:px-5 sm:pb-5 border-t border-dm-border/60">
                        <div className="flex justify-center -mt-8 mb-2 relative z-10">
                          <div
                            className={cn(
                              'flex h-14 w-14 items-center justify-center rounded-2xl border-2 shadow-nexus-md',
                              'bg-surface ring-[3px] ring-surface',
                              visual.iconWrap
                            )}
                            aria-hidden
                          >
                            <GameIcon className={cn('h-7 w-7', visual.iconClass)} strokeWidth={2} />
                          </div>
                        </div>
                        <h2
                          className={cn(
                            TYPOGRAPHY.cardTitle,
                            'text-center text-lg sm:text-xl mb-1.5 line-clamp-2'
                          )}
                        >
                          {game.title}
                        </h2>
                        <p
                          className={cn(
                            TYPOGRAPHY.body,
                            'text-center text-content-secondary text-sm sm:text-base leading-snug line-clamp-3 text-balance grow mb-3'
                          )}
                        >
                          {game.description}
                        </p>
                        <div className="mt-auto flex items-center justify-center gap-2 pt-1">
                          {gameProgress.completed ? (
                            <>
                              <StarDisplay stars={gameProgress.stars} size="sm" />
                              <span className="text-success text-2xl" aria-label="Completed">
                                ✓
                              </span>
                            </>
                          ) : isLocked ? (
                            <span className={cn(TYPOGRAPHY.body, 'text-content-muted')}>🔒 Locked</span>
                          ) : (
                            <span
                              className={cn(
                                TYPOGRAPHY.control,
                                'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl',
                                'bg-primary text-white text-sm shadow-nexus-sm'
                              )}
                            >
                              Play Now!
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col h-full min-h-0 items-center text-center">
                      <div
                        className={cn(
                          'mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 shadow-nexus-sm shrink-0',
                          visual.iconWrap
                        )}
                        aria-hidden
                      >
                        <GameIcon className={cn('h-8 w-8', visual.iconClass)} strokeWidth={2} />
                      </div>
                      <h2 className={cn(TYPOGRAPHY.cardTitle, 'text-xl mb-2 line-clamp-2')}>
                        {game.title}
                      </h2>
                      <p
                        className={cn(
                          TYPOGRAPHY.body,
                          'mb-4 line-clamp-3 text-balance text-content-secondary flex-1'
                        )}
                      >
                        {game.description}
                      </p>
                      <div className="mt-auto flex items-center justify-center gap-2 shrink-0 w-full pt-2">
                        {gameProgress.completed ? (
                          <>
                            <StarDisplay stars={gameProgress.stars} size="sm" />
                            <span className="text-success text-2xl" aria-label="Completed">
                              ✓
                            </span>
                          </>
                        ) : isLocked ? (
                          <span className={cn(TYPOGRAPHY.body, 'text-content-muted')}>🔒 Locked</span>
                        ) : (
                          <span
                            className={cn(
                              TYPOGRAPHY.control,
                              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                              'bg-primary text-white text-sm shadow-nexus-sm'
                            )}
                          >
                            Play Now!
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
