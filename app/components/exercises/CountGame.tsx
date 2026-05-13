'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountingItem } from '@/types';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect, initAudio } from '@/lib/audio';
import { getCountingItems, generateAnswerOptions } from '@/topics/numbers-11-20/games/counting';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface CountGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  items: CountingItem[];
  currentIndex: number;
  score: number;
  options: number[];
  answered: boolean;
  isCorrect: boolean | null;
  isTransitioning: boolean;
}

export function CountGame({ onComplete }: CountGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const items = getCountingItems(10);
    return {
      items,
      currentIndex: 0,
      score: 0,
      options: generateAnswerOptions(items[0].count),
      answered: false,
      isCorrect: null,
      isTransitioning: false,
    };
  });

  const currentItem = gameState.items[gameState.currentIndex];

  useEffect(() => {
    if (!gameState.isTransitioning && !gameState.answered) {
      stopSpeaking();
      speak(`How many ${currentItem.name} are there?`).catch(() => {});
    }
  }, [currentItem, gameState.isTransitioning, gameState.answered]);

  const moveToNext = useCallback(() => {
    if (gameState.currentIndex < gameState.items.length - 1) {
      const nextIndex = gameState.currentIndex + 1;
      const nextItem = gameState.items[nextIndex];
      setGameState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        options: generateAnswerOptions(nextItem.count),
        answered: false,
        isCorrect: null,
        isTransitioning: false,
      }));
    } else {
      onComplete(gameState.score + (gameState.isCorrect ? 1 : 0));
    }
  }, [gameState, onComplete]);

  const handleAnswer = async (answer: number) => {
    if (gameState.answered || gameState.isTransitioning) return;

    initAudio();
    const isCorrect = answer === currentItem.count;

    setGameState((prev) => ({
      ...prev,
      answered: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      isTransitioning: true,
    }));

    if (isCorrect) {
      await playEffect('correct');
      await speak(`Great! There are ${currentItem.count} ${currentItem.name}!`);
    } else {
      await playEffect('incorrect');
      await speak('Try again!');
    }

    setTimeout(() => {
      moveToNext();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={gameState.items.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-8">
        <SpeechButton text={`How many ${currentItem.name} are there?`} className="w-full justify-center">
          <h2 className={cn(TYPOGRAPHY.sectionTitle, 'text-2xl md:text-3xl mb-4')}>
            How many {currentItem.name} are there?
          </h2>
        </SpeechButton>
      </div>

      <div className="bg-surface-secondary rounded-xl border border-dm-border p-6 mb-8 max-w-lg w-full shadow-nexus-sm">
        <div className="grid grid-cols-5 gap-2 md:gap-3 justify-items-center">
          <AnimatePresence mode="popLayout">
            {currentItem.items.map((item, index) => (
              <motion.span
                key={`${currentItem.id}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                className="text-3xl md:text-4xl"
              >
                {item}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {gameState.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: gameState.answered ? 1 : 1.05 }}
            whileTap={{ scale: gameState.answered ? 1 : 0.95 }}
            onClick={() => handleAnswer(option)}
            disabled={gameState.answered}
            className={cn(
              'py-6 px-8 rounded-xl text-3xl md:text-4xl font-semibold transition-all border border-transparent',
              gameState.answered
                ? option === currentItem.count
                  ? 'bg-success text-white border-success/40'
                  : gameState.isCorrect === false
                    ? 'bg-danger/80 text-white border-danger/30'
                    : 'bg-surface-secondary text-content-muted border-dm-border'
                : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/25'
            )}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <div className={cn(TYPOGRAPHY.metric, 'mt-8 text-lg tabular-nums')}>
        Score: {gameState.score} / {gameState.items.length}
      </div>
    </div>
  );
}
