'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect, initAudio } from '@/lib/audio';
import { generateDialogues } from '@/topics/numbers-11-20/games/dialogue';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if (!gameState.isTransitioning && !gameState.answered) {
      stopSpeaking();
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

    setTimeout(() => {
      moveToNext();
    }, 2000);
  };

  const renderItems = () => {
    const items = [];
    const emojiMap: { [key: string]: string } = {
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
          <div className="bg-info-light rounded-xl p-4 max-w-xs border border-info/25 shadow-nexus-sm">
            <SpeechButton text={currentDialogue.question} className="w-full justify-center">
              <p className={cn(TYPOGRAPHY.body, 'text-base font-semibold text-content')}>
                {currentDialogue.question}
              </p>
            </SpeechButton>
          </div>
        </div>

        <div className="bg-warning-light rounded-xl p-6 flex flex-wrap justify-center gap-2 max-w-md min-h-[120px] items-center border border-warning/25 shadow-nexus-sm">
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
          <div className="bg-danger-light rounded-xl p-4 max-w-xs border border-danger/25 shadow-nexus-sm">
            {gameState.answered && gameState.selectedOption === currentDialogue.answer ? (
              <SpeechButton text={currentDialogue.answer} className="w-full justify-center">
                <p className={cn(TYPOGRAPHY.body, 'text-base font-semibold text-content')}>
                  {currentDialogue.answer}
                </p>
              </SpeechButton>
            ) : (
              <p className={cn(TYPOGRAPHY.body, 'text-base font-semibold text-content-muted')}>…</p>
            )}
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
            className={cn(
              'py-5 px-6 rounded-xl text-lg md:text-xl font-semibold transition-all border border-transparent',
              gameState.answered
                ? option === currentDialogue.answer
                  ? 'bg-success text-white border-success/40'
                  : option === gameState.selectedOption
                    ? 'bg-danger/80 text-white border-danger/30'
                    : 'bg-surface-secondary text-content-muted border-dm-border'
                : 'bg-secondary/15 text-secondary hover:bg-secondary/25 border-secondary/30'
            )}
          >
            {option}
          </motion.button>
        ))}
      </div>

      <div className={cn(TYPOGRAPHY.metric, 'mt-6 text-lg tabular-nums')}>
        Score: {gameState.score} / {dialogues.length}
      </div>
    </div>
  );
}
