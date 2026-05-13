'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProgressData } from '@/types';
import { TopicGrid } from './components/layout/TopicGrid';
import { loadProgress, defaultProgressData, getTotalStars } from '@/lib/storage';
import { getAllTopics } from '@/topics';
import { speak, stopSpeaking, initAudio } from '@/lib/audio';
import { PAGE_CONTAINER, TYPOGRAPHY, SETTLE_IN } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

export default function Home() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgressData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    setIsLoading(false);
  }, []);

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      initAudio();
      stopSpeaking(); // cancel any leftover speech from a previous page
      speak('Welcome to Babylala! Choose a topic to start learning!');
    }
  }, [hasInteracted]);

  const topics = getAllTopics();
  const totalStars = getTotalStars(progress);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-2 border-dm-border border-t-primary border-r-primary"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-app"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <main className={PAGE_CONTAINER}>
        <motion.div
          initial={SETTLE_IN.initial}
          animate={SETTLE_IN.animate}
          transition={SETTLE_IN.transition}
          className="text-center mb-10"
        >
          <h1 className={cn(TYPOGRAPHY.pageTitle, 'text-3xl md:text-4xl mb-2')}>
            What would you like to learn today?
          </h1>
          <p className={TYPOGRAPHY.pageSubtitle}>
            Total stars earned:{' '}
            <span className={cn(TYPOGRAPHY.metric, 'text-score-yellow inline-block ml-1')}>
              {totalStars} ★
            </span>
          </p>
        </motion.div>

        <TopicGrid topics={topics} progress={progress} />
      </main>

      <footer className="text-center py-8">
        <p className={TYPOGRAPHY.caption}>Have fun learning!</p>
      </footer>
    </div>
  );
}
