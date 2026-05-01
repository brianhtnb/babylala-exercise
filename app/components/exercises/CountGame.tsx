'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountingItem } from '@/types';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect, initAudio } from '@/lib/audio';
import { getCountingItems, generateAnswerOptions } from '@/topics/numbers-11-20/games/counting';

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
    };
  });

  const currentItem = gameState.items[gameState.currentIndex];

  const handleAnswer = (answer: number) => {
    if (gameState.answered) return;

    initAudio();
    const isCorrect = answer === currentItem.count;

    if (isCorrect) {
      playEffect('correct').catch(() => {});
      speak(`Great! There are ${currentItem.count} ${currentItem.type}s!`).catch(() => {});
    } else {
      playEffect('incorrect').catch(() => {});
      speak('Try again!').catch(() => {});
    }

    setGameState((prev) => ({
      ...prev,
      answered: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    setTimeout(() => {
      if (gameState.currentIndex < gameState.items.length - 1) {
        const nextIndex = gameState.currentIndex + 1;
        const nextItem = gameState.items[nextIndex];
        setGameState((prev) => ({
          ...prev,
          currentIndex: nextIndex,
          options: generateAnswerOptions(nextItem.count),
          answered: false,
          isCorrect: null,
        }));
      } else {
        onComplete(gameState.score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  useEffect(() => {
    const itemType = currentItem.type + 's';
    speak(`How many ${itemType} are there?`).catch(() => {});
  }, [currentItem]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={gameState.items.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          How many {currentItem.type}s are there?
        </h2>
      </div>

      <div className="bg-blue-50 rounded-3xl p-8 mb-8 max-w-2xl w-full">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <AnimatePresence mode="popLayout">
            {currentItem.items.map((item, index) => (
              <motion.span
                key={`${currentItem.id}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
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
            className={`
              py-6 px-8 rounded-2xl text-3xl md:text-4xl font-bold transition-all
              ${gameState.answered
                ? option === currentItem.count
                  ? 'bg-green-500 text-white'
                  : gameState.isCorrect === false
                  ? 'bg-red-300 text-white'
                  : 'bg-gray-200 text-gray-400'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <div className="mt-8 text-xl font-semibold text-gray-600">
        Score: {gameState.score} / {gameState.items.length}
      </div>
    </div>
  );
}
