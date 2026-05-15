'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProgressBar } from '@/app/components/common/ProgressBar';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { FRUIT_CATCH_ROUND_COUNT, FRUIT_CATCH_ROUNDS } from '@/topics/jungle/games/fruit-catch';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface FruitCatchGameProps {
  onComplete: (score: number) => void;
}

export function FruitCatchGame({ onComplete }: FruitCatchGameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);

  const r = FRUIT_CATCH_ROUNDS[Math.min(round, FRUIT_CATCH_ROUNDS.length - 1)]!;

  useEffect(() => {
    stopSpeaking();
    void speak(r.prompt);
  }, [r.prompt, round]);

  const pick = useCallback(
    async (id: string) => {
      if (id === r.target) {
        await playEffect('click');
        const next = score + 1;
        setScore(next);
        if (round + 1 >= FRUIT_CATCH_ROUND_COUNT) {
          onComplete(next);
        } else {
          setRound((x) => x + 1);
          setWrong(null);
        }
      } else {
        setWrong(id);
        await playEffect('incorrect');
        setTimeout(() => setWrong(null), 450);
      }
    },
    [onComplete, r.target, round, score]
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <ProgressBar current={score} total={FRUIT_CATCH_ROUND_COUNT} />
      <p className={cn(TYPOGRAPHY.body, 'text-center text-content-secondary')}>
        Monkeys toss fruit from the tree — tap only the one Milo asks for!
      </p>
      <div className="grid grid-cols-3 gap-3">
        {r.choices.map((id) => (
          <motion.button
            key={`${round}-${id}`}
            type="button"
            onClick={() => void pick(id)}
            className={cn(
              'relative aspect-square rounded-2xl border-2 overflow-hidden bg-warning/10 shadow-nexus-sm',
              wrong === id ? 'border-danger ring-2 ring-danger/35' : 'border-warning/40 hover:border-primary/45'
            )}
            whileTap={{ scale: 0.95 }}
          >
            <Image src={`/images/jungle/animals/${id}.png`} alt="" fill className="object-contain p-2" sizes="120px" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
