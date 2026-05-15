'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProgressBar } from '@/app/components/common/ProgressBar';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { SHADOW_MATCH_ROUND_COUNT, SHADOW_MATCH_ROUNDS } from '@/topics/jungle/games/shadow-match';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface ShadowMatchGameProps {
  onComplete: (score: number) => void;
}

export function ShadowMatchGame({ onComplete }: ShadowMatchGameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);

  const r = SHADOW_MATCH_ROUNDS[Math.min(round, SHADOW_MATCH_ROUNDS.length - 1)]!;

  useEffect(() => {
    stopSpeaking();
    void speak(r.hint);
  }, [r.hint, round]);

  const pick = useCallback(
    async (id: string) => {
      if (id === r.correct) {
        await playEffect('click');
        const next = score + 1;
        setScore(next);
        if (round + 1 >= SHADOW_MATCH_ROUND_COUNT) {
          onComplete(next);
        } else {
          setRound((x) => x + 1);
          setWrong(null);
        }
      } else {
        setWrong(id);
        await playEffect('incorrect');
        setTimeout(() => setWrong(null), 500);
      }
    },
    [onComplete, r.correct, round, score]
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <ProgressBar current={score} total={SHADOW_MATCH_ROUND_COUNT} />
      <p className={cn(TYPOGRAPHY.body, 'text-center text-content-secondary')}>
        Listen to Milo. Tap the shadow that matches the animal he describes. Use your eyes like a flashlight!
      </p>
      <div className="grid grid-cols-3 gap-3">
        {r.choices.map((id) => (
          <motion.button
            key={`${round}-${id}`}
            type="button"
            onClick={() => void pick(id)}
            className={cn(
              'relative aspect-square rounded-2xl border-2 overflow-hidden transition-all',
              wrong === id ? 'border-danger ring-2 ring-danger/40' : 'border-dm-border hover:border-primary/45'
            )}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-black/88 flex items-center justify-center p-2">
              <div className="relative h-full w-full opacity-[0.22] contrast-125 brightness-150">
                <Image src={`/images/jungle/animals/${id}.png`} alt="" fill className="object-contain" sizes="120px" />
              </div>
            </div>
            <span className="sr-only">{id}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
