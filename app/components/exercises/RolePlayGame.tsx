'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect, initAudio } from '@/lib/audio';
import { generateDialogues } from '@/topics/numbers-11-20/games/dialogue';

interface RolePlayGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  currentIndex: number;
  score: number;
  answered: boolean;
  selectedOption: string | null;
  isTransitioning: boolean;
}

export function RolePlayGame({ onComplete }: RolePlayGameProps) {
  const [dialogues] = useState(() => generateDialogues(5));
  const [gameState, setGameState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    answered: false,
    selectedOption: null,
    isTransitioning: false,
  });

  const currentDialogue = dialogues[gameState.currentIndex];

  // Speak the question when a new dialogue is shown
  useEffect(() => {
    if (!gameState.isTransitioning && !gameState.answered) {
      speak(currentDialogue.question).catch(() => {});
    }
  }, [currentDialogue, gameState.isTransitioning, gameState.answered]);

  const moveToNext = useCallback(() => {
    if (gameState.currentIndex < dialogues.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedOption: null,
        answered: false,
        isTransitioning: false,
      }));
    } else {
      onComplete(gameState.score);
    }
  }, [gameState, dialogues.length, onComplete]);

  const handleAnswer = async (answer: string) => {
    if (gameState.answered || gameState.isTransitioning) return;

    initAudio();
    const isCorrect = answer === currentDialogue.answer;
    
    setGameState((prev) => ({
      ...prev,
      selectedOption: answer,
      answered: true,
      isTransitioning: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    if (isCorrect) {
      await playEffect('correct');
      await speak(`${answer} Great job!`);
    } else {
      await playEffect('incorrect');
      await speak('Try again!');
    }

    // Wait before moving to next question
    setTimeout(() => {
      moveToNext();
    }, 2000);
  };

  const renderItems = () => {
    const items = [];
    const emojiMap: { [key: string]: string } = {
      'apples': '🍎',
      'bananas': '🍌',
      'cats': '🐱',
      'dogs': '🐶',
      'books': '📚',
      'toys': '🧸',
      'birds': '🐦',
      'flowers': '🌸',
      // Sea creatures
      'starfish': '⭐',
      'octopuses': '🐙',
      'sharks': '🦈',
      'clownfish': '🐠',
      'dolphins': '🐬',
      'whales': '🐋',
    };
    const emoji = emojiMap[currentDialogue.objectType] || '🎈';
    
    for (let i = 0; i < Math.min(currentDialogue.count, 20); i++) {
      items.push(
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="text-2xl md:text-3xl"
        >
          {emoji}
        </motion.span>
      );
    }
    return items;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={dialogues.length}
        className="w-full max-w-md mb-6"
      />

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 w-full max-w-4xl">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-6xl md:text-7xl mb-2"
          >
            👦
          </motion.div>
          <div className="bg-blue-100 rounded-2xl p-4 max-w-xs">
            <p className="text-lg font-semibold text-blue-800">
              {currentDialogue.question}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-3xl p-6 flex flex-wrap justify-center gap-2 max-w-md min-h-[120px] items-center">
          {renderItems()}
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-6xl md:text-7xl mb-2"
          >
            👧
          </motion.div>
          <div className="bg-pink-100 rounded-2xl p-4 max-w-xs">
            <p className="text-lg font-semibold text-pink-800">
              {gameState.answered && gameState.selectedOption === currentDialogue.answer
                ? currentDialogue.answer
                : '...'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {currentDialogue.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: gameState.answered ? 1 : 1.02 }}
            whileTap={{ scale: gameState.answered ? 1 : 0.98 }}
            onClick={() => handleAnswer(option)}
            disabled={gameState.answered}
            className={`
              py-5 px-6 rounded-2xl text-lg md:text-xl font-bold transition-all
              ${gameState.answered
                ? option === currentDialogue.answer
                  ? 'bg-green-500 text-white'
                  : option === gameState.selectedOption
                  ? 'bg-red-300 text-white'
                  : 'bg-gray-200 text-gray-400'
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 text-xl font-semibold text-gray-600">
        Score: {gameState.score} / {dialogues.length}
      </div>
    </div>
  );
}
