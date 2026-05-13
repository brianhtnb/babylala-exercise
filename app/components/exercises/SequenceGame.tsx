'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect, initAudio } from '@/lib/audio';
import { generateSequenceProblems } from '@/topics/numbers-11-20/games/sequence';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface SequenceGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  currentIndex: number;
  score: number;
  selectedOption: number | null;
  answered: boolean;
  isTransitioning: boolean;
}

export function SequenceGame({ onComplete }: SequenceGameProps) {
  const [problems] = useState(() => generateSequenceProblems(8));
  const [gameState, setGameState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    selectedOption: null,
    answered: false,
    isTransitioning: false,
  });

  const currentProblem = problems[gameState.currentIndex];

  // Speak the question when a new problem is shown
  useEffect(() => {
    if (!gameState.isTransitioning && !gameState.answered) {
      stopSpeaking();
      speak('What number is missing?').catch(() => {});
    }
  }, [currentProblem, gameState.isTransitioning, gameState.answered]);

  const moveToNext = useCallback(() => {
    if (gameState.currentIndex < problems.length - 1) {
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
  }, [gameState, problems.length, onComplete]);

  const handleAnswer = async (answer: number) => {
    if (gameState.answered || gameState.isTransitioning) return;

    initAudio();
    const isCorrect = answer === currentProblem.correctAnswer;
    
    setGameState((prev) => ({
      ...prev,
      selectedOption: answer,
      answered: true,
      isTransitioning: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    if (isCorrect) {
      await playEffect('correct');
      await speak(`${answer}! Great job!`);
    } else {
      await playEffect('incorrect');
      await speak('Try again!');
    }

    // Wait before moving to next question
    setTimeout(() => {
      moveToNext();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={problems.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-8">
        <SpeechButton text="What number is missing?" className="w-full justify-center">
          <h2 className={cn(TYPOGRAPHY.sectionTitle, 'text-2xl md:text-3xl')}>
            What number is missing?
          </h2>
        </SpeechButton>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap">
        {currentProblem.sequence.map((num, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center',
              'text-2xl md:text-3xl font-semibold tabular-nums border-2',
              num === null
                ? 'border-dashed border-info bg-info-light text-content'
                : 'bg-surface text-content shadow-nexus-md border-dm-border'
            )}
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
            className={cn(
              'py-6 px-8 rounded-xl text-3xl font-semibold transition-all border border-transparent',
              gameState.answered
                ? option === currentProblem.correctAnswer
                  ? 'bg-success text-white border-success/40'
                  : option === gameState.selectedOption
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
        Score: {gameState.score} / {problems.length}
      </div>
    </div>
  );
}
