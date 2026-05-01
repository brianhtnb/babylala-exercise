'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProgressData } from '@/types';
import { Header } from './components/layout/Header';
import { TopicGrid } from './components/layout/TopicGrid';
import { loadProgress, defaultProgressData, getTotalStars } from '@/lib/storage';
import { getAllTopics } from '@/topics';
import { speak } from '@/lib/audio';

export default function Home() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgressData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    setIsLoading(false);
    speak('Welcome to Babylala! Choose a topic to start learning!');
  }, []);

  const topics = getAllTopics();
  const totalStars = getTotalStars(progress);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-6xl"
        >
          🔄
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Babylala Exercise" />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            What would you like to learn today?
          </h1>
          <p className="text-xl text-gray-600">
            Total Stars Earned: <span className="text-yellow-500 font-bold text-2xl">{totalStars} ★</span>
          </p>
        </motion.div>

        <TopicGrid topics={topics} progress={progress} />
      </main>

      <footer className="text-center py-8 text-gray-500">
        <p>Have fun learning! 🌟</p>
      </footer>
    </div>
  );
}
