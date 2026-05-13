'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TopicConfig, ProgressData } from '@/types';
import { getTopicProgress } from '@/lib/storage';
import { Card } from '../common/Card';
import { StarDisplay } from '../common/StarDisplay';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY, ANIMATION_DURATIONS, SETTLE_IN } from '@/lib/design-tokens';

interface TopicGridProps {
  topics: TopicConfig[];
  progress: ProgressData;
}

export function TopicGrid({ topics, progress }: TopicGridProps) {
  const router = useRouter();

  const handleTopicClick = (topic: TopicConfig) => {
    playEffect('click').catch(() => {});
    speak(`Let's learn ${topic.title}!`).catch(() => {});
    router.push(`/topic/${topic.id}`);
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3', TYPOGRAPHY.body, 'gap-6 md:gap-8')}>
      {topics.map((topic, index) => {
        const topicProgress = getTopicProgress(progress, topic.id);
        const maxStars = topic.games.length * 3;
        const isLocked = false;

        return (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SETTLE_IN.transition, delay: index * ANIMATION_DURATIONS.stagger }}
          >
            <Card
              onClick={() => handleTopicClick(topic)}
              locked={isLocked}
              className={cn('h-full flex flex-col items-center text-center')}
            >
              <div
                className={cn(
                  'w-24 h-24 rounded-xl flex items-center justify-center text-5xl mb-4 shadow-nexus-sm',
                  topic.color
                )}
              >
                {topic.icon}
              </div>

              <h2 className={cn(TYPOGRAPHY.cardTitle, 'text-xl mb-2')}>{topic.title}</h2>

              <div className="w-full space-y-3">
                <div className="flex justify-center">
                  <StarDisplay stars={topicProgress.totalStars} maxStars={maxStars} size="sm" />
                </div>

                <ProgressBar
                  current={Object.values(topicProgress.games).filter((g) => g.completed).length}
                  total={topic.games.length}
                />

                <p className={TYPOGRAPHY.caption}>
                  {Object.values(topicProgress.games).filter((g) => g.completed).length} of{' '}
                  {topic.games.length} games completed
                </p>
              </div>

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-content/25 rounded-xl backdrop-blur-[1px]">
                  <span className="text-6xl" aria-hidden>
                    🔒
                  </span>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
