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

interface TopicGridProps {
  topics: TopicConfig[];
  progress: ProgressData;
}

export function TopicGrid({ topics, progress }: TopicGridProps) {
  const router = useRouter();

  const handleTopicClick = (topic: TopicConfig) => {
    // Don't await - let navigation happen immediately
    playEffect('click').catch(() => {});
    speak(`Let's learn ${topic.title}!`).catch(() => {});
    router.push(`/topic/${topic.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {topics.map((topic, index) => {
        const topicProgress = getTopicProgress(progress, topic.id);
        const maxStars = topic.games.length * 3;
        const isLocked = false;

        return (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              onClick={() => handleTopicClick(topic)}
              locked={isLocked}
              className={cn(
                'h-full flex flex-col items-center text-center',
                'hover:shadow-xl transition-shadow'
              )}
            >
              <div
                className={cn(
                  'w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-4',
                  topic.color
                )}
              >
                {topic.icon}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">{topic.title}</h2>

              <div className="w-full space-y-2">
                <div className="flex justify-center">
                  <StarDisplay
                    stars={topicProgress.totalStars}
                    maxStars={maxStars}
                    size="sm"
                  />
                </div>

                <ProgressBar
                  current={Object.values(topicProgress.games).filter((g) => g.completed).length}
                  total={topic.games.length}
                />

                <p className="text-sm text-gray-500">
                  {Object.values(topicProgress.games).filter((g) => g.completed).length} of {topic.games.length} games completed
                </p>
              </div>

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-3xl">
                  <span className="text-6xl">🔒</span>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
