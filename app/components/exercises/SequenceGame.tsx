'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect } from '@/lib/audio';
import { generateSequenceProblems } from '@/topics/numbers-11-20/games/sequence';

interface SequenceGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  currentIndex: number;
  score: number;
  selectedOption: number | null;
  answered: boolean;
}

export function SequenceGame({ onComplete }: SequenceGameProps) {
  const [problems] = useState(() => generateSequenceProblems(8));
  const [gameState, setGameState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    selectedOption: null,
    answered: false,
  });

  const currentProblem = problems[gameState.currentIndex];

  const handleAnswer = async (answer: number) => {
    if (gameState.answered) return;

    const isCorrect = answer === currentProblem.correctAnswer;
    setGameState((prev) => ({
      ...prev,
      selectedOption: answer,
      answered: true,
    }));

    if (isCorrect) {
      await playEffect('correct');
      await speak(`${answer}! Great job!`);
      setGameState((prev) => ({ ...prev, score: prev.score + 1 }));
    } else {
      await playEffect('incorrect');
      await speak('Try again!');
    }

    setTimeout(() => {
      if (gameState.currentIndex < problems.length - 1) {
        setGameState((prev) => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          selectedOption: null,
          answered: false,
        }));
      } else {
        onComplete(gameState.score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  useEffect(() => {
    speak('What number is missing?');
  }, [currentProblem]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={problems.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          What number is missing?
        </h2>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap">
        {currentProblem.sequence.map((num, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
              w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center
              text-2xl md:text-3xl font-bold
              ${num === null
                ? 'border-4 border-dashed border-blue-400 bg-blue-50'
                : 'bg-white shadow-lg text-gray-800'
              }
            `}
          >
            {num !== null ? num : '?'}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {currentProblem.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: gameState.answered ? 1 : 1.05 }}
            whileTap={{ scale: gameState.answered ? 1 : 0.95 }}
            onClick={() => handleAnswer(option)}
            disabled={gameState.answered}
            className={`
              py-6 px-8 rounded-2xl text-3xl font-bold transition-all
              ${gameState.answered
                ? option === currentProblem.correctAnswer
                  ? 'bg-green-500 text-white'
                  : option === gameState.selectedOption
                  ? 'bg-red-300 text-white'
                  : 'bg-gray-200 text-gray-400'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <div className="mt-8 text-xl font-semibold text-gray-600">
        Score: {gameState.score} / {problems.length}
      </div>
    </div>
  );
}
