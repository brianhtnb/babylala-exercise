'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProgressBar } from '@/app/components/common/ProgressBar';
import { SpeechButton } from '@/app/components/common/SpeechButton';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { vocabIntroItems } from '@/topics/jungle/games/vocab-intro';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface VocabIntroGameProps {
  onComplete: (score: number) => void;
}

export function VocabIntroGame({ onComplete }: VocabIntroGameProps) {
  const [index, setIndex] = useState(0);
  const total = vocabIntroItems.length;
  const item = vocabIntroItems[index];

  useEffect(() => {
    stopSpeaking();
    speak(item.word).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = useCallback(async () => {
    await playEffect('click');
    if (index + 1 >= total) {
      onComplete(total);
      return;
    }
    setIndex((i) => i + 1);
  }, [index, total, onComplete]);

  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={index} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={item.word}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
          className="mt-6 panel p-6 shadow-nexus-md"
        >
          <p className={cn(TYPOGRAPHY.label, 'text-content-muted text-center mb-4')}>
            Look at the picture. Read the word. Listen.
          </p>

          <div className="relative mx-auto mb-6 aspect-square max-w-[280px] rounded-2xl overflow-hidden border border-dm-border bg-surface-secondary shadow-nexus-sm">
            <Image
              src={item.image}
              alt={item.word}
              fill
              className="object-contain p-4"
              sizes="280px"
              priority={index === 0}
            />
          </div>

          <div className="flex flex-col items-center gap-3 mb-8">
            <p
              className={cn(
                TYPOGRAPHY.pageTitle,
                'text-4xl md:text-5xl font-bold capitalize tracking-tight text-content'
              )}
            >
              {item.word}
            </p>
            <SpeechButton
              text={item.word}
              className="rounded-xl border border-dm-border bg-surface-secondary px-4 py-2.5 hover:border-primary/35"
            >
              <span className={cn(TYPOGRAPHY.control, 'text-content')}>Listen again</span>
            </SpeechButton>
          </div>

          <button
            type="button"
            onClick={() => void goNext()}
            className={cn(
              TYPOGRAPHY.control,
              'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl',
              'bg-primary text-white shadow-nexus-sm hover:opacity-95 active:scale-[0.99] transition-all'
            )}
          >
            {index + 1 >= total ? 'Start games!' : 'Next word'}
            <ChevronRight className="w-5 h-5" strokeWidth={2} aria-hidden />
          </button>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-content-muted mt-4">
        {index + 1} / {total}
      </p>
    </div>
  );
}
