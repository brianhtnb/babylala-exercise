'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/common/Card';
import { StarDisplay } from '@/app/components/common/StarDisplay';
import { Button } from '@/app/components/common/Button';
import { getTopicById } from '@/topics';
import { loadProgress, getGameProgress } from '@/lib/storage';
import { speak, playEffect } from '@/lib/audio';
import { ProgressData } from '@/types';
import { cn } from '@/lib/utils';
import { PAGE_CONTAINER, TYPOGRAPHY, ANIMATION_DURATIONS, SETTLE_IN } from '@/lib/design-tokens';

export default function TopicPageClient() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const topic = getTopicById(topicId);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
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

  const gameShell: { [key: string]: string } = {
    counting: 'bg-warning-light border-warning/40',
    sequence: 'bg-primary/10 border-primary/35',
    writing: 'bg-info-light border-info/40',
    dialogue: 'bg-danger-light border-danger/35',
  };

  return (
    <div className="min-h-screen bg-app">
      <Header title={topic.title} showBack onBack={handleBack} />

      <main className={PAGE_CONTAINER}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: ANIMATION_DURATIONS.slow, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <div
            className={cn(
              'inline-flex items-center justify-center w-32 h-32 rounded-xl text-7xl mb-4 shadow-nexus-md',
              topic.color
            )}
          >
            {topic.icon}
          </div>
          <h1 className={cn(TYPOGRAPHY.pageTitle, 'text-3xl md:text-4xl mb-3')}>{topic.title}</h1>
          <p className={cn(TYPOGRAPHY.pageSubtitle, 'max-w-2xl mx-auto text-base')}>
            Learn {topic.vocabulary.length} new words and practice {topic.sentences.length} sentence
            patterns!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {topic.games.map((game, index) => {
            const gameProgress = progress
              ? getGameProgress(progress, topicId, game.id)
              : { completed: false, stars: 0 };

            const isLocked = false;

            return (
              <motion.div
                key={game.id}
                initial={SETTLE_IN.initial}
                animate={SETTLE_IN.animate}
                transition={{ ...SETTLE_IN.transition, delay: index * ANIMATION_DURATIONS.stagger }}
              >
                <Card
                  onClick={() => handleGameClick(game.id)}
                  locked={isLocked}
                  className={cn('border-2', gameShell[game.type] ?? 'border-dm-border')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-3" aria-hidden>
                      {game.type === 'counting' && '🔢'}
                      {game.type === 'sequence' && '📊'}
                      {game.type === 'writing' && '✏️'}
                      {game.type === 'dialogue' && '💬'}
                    </div>

                    <h2 className={cn(TYPOGRAPHY.cardTitle, 'text-xl mb-2')}>{game.title}</h2>

                    <p className={cn(TYPOGRAPHY.body, 'mb-4')}>{game.description}</p>

                    <div className="flex items-center gap-2">
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
                        <Button size="sm" sound={false}>
                          Play Now!
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
