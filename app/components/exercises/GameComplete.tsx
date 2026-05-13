'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { StarDisplay } from '../common/StarDisplay';
import { speak, playEffect } from '@/lib/audio';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
    >
      <motion.div
        initial={{ y: -24 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-8xl mb-6"
        aria-hidden
      >
        🎉
      </motion.div>

      <h2 className={cn(TYPOGRAPHY.pageTitle, 'text-3xl md:text-4xl mb-3')}>Game complete!</h2>

      <p className={cn(TYPOGRAPHY.body, 'text-lg md:text-xl mb-6 max-w-md')}>
        You got{' '}
        <span className={cn(TYPOGRAPHY.metric, 'text-primary inline')}>{score}</span> out of{' '}
        <span className="font-semibold text-content">{totalQuestions}</span> correct!
      </p>

      <div className="mb-8">
        <StarDisplay stars={stars} size="lg" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button variant="secondary" onClick={onPlayAgain}>
          Play again
        </Button>

        {hasNextGame && <Button onClick={onNextGame}>Next game →</Button>}

        <Button variant="secondary" onClick={onBackToTopic}>
          Back to topic
        </Button>
      </div>
    </motion.div>
  );
}
