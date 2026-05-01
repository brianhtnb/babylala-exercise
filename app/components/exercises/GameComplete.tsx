'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { StarDisplay } from '../common/StarDisplay';
import { speak, playEffect } from '@/lib/audio';

interface GameCompleteProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onBackToTopic: () => void;
  onNextGame: () => void;
  hasNextGame: boolean;
}

export function GameComplete({
  score,
  totalQuestions,
  onPlayAgain,
  onBackToTopic,
  onNextGame,
  hasNextGame,
}: GameCompleteProps) {
  const percentage = (score / totalQuestions) * 100;
  
  let stars = 0;
  if (percentage >= 80) stars = 3;
  else if (percentage >= 60) stars = 2;
  else if (percentage >= 40) stars = 1;

  useEffect(() => {
    playEffect('celebration');
    speak(`Great job! You got ${score} out of ${totalQuestions}! You earned ${stars} stars!`);
  }, [score, stars, totalQuestions]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-8xl mb-6"
      >
        🎉
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Game Complete!
      </h2>

      <p className="text-2xl text-gray-600 mb-6">
        You got <span className="font-bold text-blue-600">{score}</span> out of{' '}
        <span className="font-bold">{totalQuestions}</span> correct!
      </p>

      <div className="mb-8">
        <StarDisplay stars={stars} size="lg" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="secondary" onClick={onPlayAgain}>
          Play Again
        </Button>
        
        {hasNextGame && (
          <Button onClick={onNextGame}>Next Game →</Button>
        )}
        
        <Button variant="secondary" onClick={onBackToTopic}>
          Back to Topic
        </Button>
      </div>
    </motion.div>
  );
}
