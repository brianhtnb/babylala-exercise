'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '@/app/components/common/ProgressBar';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { LILY_PAD_ROUND_COUNT, LILY_PAD_ROUNDS } from '@/topics/jungle/games/lily-pad-count';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface LilyPadCountGameProps {
  onComplete: (score: number) => void;
}

export function LilyPadCountGame({ onComplete }: LilyPadCountGameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);

  const r = LILY_PAD_ROUNDS[Math.min(round, LILY_PAD_ROUNDS.length - 1)]!;

  useEffect(() => {
    stopSpeaking();
    void speak(`Count the ${r.label}. How many do you see?`);
  }, [r.label, round]);

  const pick = useCallback(
    async (n: number) => {
      if (n === r.count) {
        await playEffect('click');
        const next = score + 1;
        setScore(next);
        if (round + 1 >= LILY_PAD_ROUND_COUNT) {
          onComplete(next);
        } else {
          setRound((x) => x + 1);
          setWrong(null);
        }
      } else {
        setWrong(n);
        await playEffect('incorrect');
        setTimeout(() => setWrong(null), 450);
      }
    },
    [onComplete, r.count, round, score]
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <ProgressBar current={score} total={LILY_PAD_ROUND_COUNT} />
      <p className={cn(TYPOGRAPHY.body, 'text-center text-content-secondary')}>
        Feed Milo a safe path: count the critters, then tap the right number.
      </p>
      <div
        className="panel rounded-2xl border border-info/35 bg-info/[0.06] p-6 min-h-[140px] flex flex-wrap items-center justify-center gap-2 content-center"
        aria-live="polite"
      >
        {Array.from({ length: r.count }, (_, i) => (
          <motion.span
            key={`${round}-${i}`}
            className="text-4xl sm:text-5xl select-none"
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            {r.emoji}
          </motion.span>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => void pick(n)}
            className={cn(
              TYPOGRAPHY.sectionTitle,
              'rounded-xl border-2 py-4 text-2xl transition-colors',
              wrong === n
                ? 'border-danger bg-danger/10 text-danger'
                : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/18'
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
