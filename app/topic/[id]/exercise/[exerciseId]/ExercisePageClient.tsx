'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/app/components/layout/Header';
import { CountGame } from '@/app/components/exercises/CountGame';
import { SequenceGame } from '@/app/components/exercises/SequenceGame';
import { TraceGame } from '@/app/components/exercises/TraceGame';
import { RolePlayGame } from '@/app/components/exercises/RolePlayGame';
import { GameComplete } from '@/app/components/exercises/GameComplete';
import { getTopicById } from '@/topics';
import {
  loadProgress,
  saveProgress,
  updateGameProgress,
} from '@/lib/storage';

export default function ExercisePageClient() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const exerciseId = params.exerciseId as string;

  const topic = getTopicById(topicId);
  const game = topic?.games.find((g) => g.id === exerciseId);

  const [gameState, setGameState] = useState<'playing' | 'complete'>('playing');
  const [score, setScore] = useState(0);

  if (!topic || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Game not found!</p>
      </div>
    );
  }

  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState('complete');

    let stars = 0;
    const totalQuestions = game.type === 'dialogue' ? 5 : game.type === 'writing' ? 10 : game.type === 'sequence' ? 8 : 10;
    const percentage = (finalScore / totalQuestions) * 100;
    if (percentage >= 80) stars = 3;
    else if (percentage >= 60) stars = 2;
    else if (percentage >= 40) stars = 1;

    const progress = loadProgress();
    const updatedProgress = updateGameProgress(progress, topicId, exerciseId, {
      completed: true,
      highScore: finalScore,
      stars,
    });
    saveProgress(updatedProgress);
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setScore(0);
  };

  const handleBackToTopic = () => {
    router.push(`/topic/${topicId}`);
  };

  const handleNextGame = () => {
    const currentIndex = topic.games.findIndex((g) => g.id === exerciseId);
    const nextGame = topic.games[currentIndex + 1];
    if (nextGame) {
      router.push(`/topic/${topicId}/exercise/${nextGame.id}`);
    }
  };

  const renderGame = () => {
    switch (game.type) {
      case 'counting':
        return <CountGame onComplete={handleGameComplete} />;
      case 'sequence':
        return <SequenceGame onComplete={handleGameComplete} />;
      case 'writing':
        return <TraceGame onComplete={handleGameComplete} />;
      case 'dialogue':
        return <RolePlayGame onComplete={handleGameComplete} />;
      default:
        return <div>Unknown game type</div>;
    }
  };

  const getTotalQuestions = () => {
    switch (game.type) {
      case 'counting': return 10;
      case 'sequence': return 8;
      case 'writing': return 10;
      case 'dialogue': return 5;
      default: return 10;
    }
  };

  return (
    <div className="min-h-screen">
      <Header title={game.title} showBack onBack={handleBackToTopic} />

      <main className="container mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderGame()}
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameComplete
                score={score}
                totalQuestions={getTotalQuestions()}
                onPlayAgain={handlePlayAgain}
                onBackToTopic={handleBackToTopic}
                onNextGame={handleNextGame}
                hasNextGame={
                  topic.games.findIndex((g) => g.id === exerciseId) <
                  topic.games.length - 1
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
