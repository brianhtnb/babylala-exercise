'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { ProgressBar } from '@/app/components/common/ProgressBar';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { buildListenPickGameSession, LISTEN_PICK_GAME_ROUND_COUNT } from '@/topics/jungle/games/listen-pick-image';
import type { ListenPickQuestion } from '@/types';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface ListenPickGameProps {
  onComplete: (score: number) => void;
}

export function ListenPickGame({ onComplete }: ListenPickGameProps) {
  const [session] = useState<ListenPickQuestion[]>(() => buildListenPickGameSession());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<'a' | 'b' | 'c' | null>(null);
  const [wrongId, setWrongId] = useState<'a' | 'b' | 'c' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const total = LISTEN_PICK_GAME_ROUND_COUNT;
  const q = session[index]!;

  useEffect(() => {
    stopSpeaking();
    setSelected(null);
    setWrongId(null);
    setIsTransitioning(false);
    speak(session[index]!.question).catch(() => {});
  }, [index, session]);

  const handlePlayQuestion = useCallback(() => {
    if (isTransitioning) return;
    stopSpeaking();
    void speak(session[index]!.question);
  }, [session, index, isTransitioning]);

  const handlePlayScript = useCallback(() => {
    if (isTransitioning) return;
    stopSpeaking();
    void speak(session[index]!.script);
  }, [session, index, isTransitioning]);

  const handlePick = useCallback(
    async (choiceId: 'a' | 'b' | 'c') => {
      if (selected !== null || isTransitioning) return;
      const current = session[index]!;
      const correct = choiceId === current.correctId;

      if (correct) {
        playEffect('correct').catch(() => {});
        const newScore = score + 1;
        setSelected(choiceId);
        setIsTransitioning(true);
        setScore(newScore);

        await new Promise<void>((r) => setTimeout(r, 900));

        if (index + 1 >= total) {
          onComplete(newScore);
          return;
        }
        setIndex((i) => i + 1);
      } else {
        playEffect('incorrect').catch(() => {});
        setWrongId(choiceId);
        setTimeout(() => setWrongId(null), 550);
      }
    },
    [selected, isTransitioning, session, index, score, total, onComplete]
  );

  const roundKey = `${q.id}-v${q.scriptVariantIndex}`;

  return (
    <div className="max-w-3xl mx-auto">
      <ProgressBar current={index} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={roundKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="mt-5 space-y-5"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 flex-wrap">
              <h2
                className={cn(
                  TYPOGRAPHY.sectionTitle,
                  'text-2xl md:text-3xl text-center max-w-[min(100%,28rem)]'
                )}
              >
                {q.question}
              </h2>
              <button
                type="button"
                onClick={handlePlayQuestion}
                disabled={isTransitioning}
                aria-label="Play question again"
                className={cn(
                  'shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl',
                  'border-2 border-dm-border bg-surface-secondary text-primary',
                  'hover:border-primary/40 hover:bg-primary/[0.06] transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  isTransitioning && 'opacity-50 pointer-events-none'
                )}
              >
                <Volume2 className="w-6 h-6" strokeWidth={2} aria-hidden />
              </button>
            </div>
            <p className={cn(TYPOGRAPHY.caption, 'text-content-muted max-w-xl mx-auto')}>
              The question is read for you. Tap the speaker to hear it again. Then tap the story to
              listen, and pick the right picture.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePlayScript}
            disabled={isTransitioning}
            className={cn(
              'w-full text-left rounded-xl border-2 border-dm-border bg-surface p-4 md:p-5',
              'shadow-nexus-sm transition-colors',
              'hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              isTransitioning && 'opacity-60 pointer-events-none'
            )}
            aria-label="Play story audio"
          >
            <span className="flex items-start gap-3">
              <Volume2
                className="w-6 h-6 shrink-0 text-primary mt-0.5"
                strokeWidth={2}
                aria-hidden
              />
              <span className={cn(TYPOGRAPHY.body, 'text-content text-base md:text-lg leading-relaxed')}>
                {q.script}
              </span>
            </span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {q.choices.map((ch) => {
              const isCorrectPick = selected === ch.id && ch.id === q.correctId;
              const isWrongPick = wrongId === ch.id;
              return (
                <motion.button
                  key={ch.id}
                  type="button"
                  disabled={selected !== null || isTransitioning}
                  onClick={() => void handlePick(ch.id)}
                  aria-label={`Picture ${ch.id.toUpperCase()}: ${ch.label}`}
                  animate={isWrongPick ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  className={cn(
                    'relative rounded-2xl border-2 overflow-hidden bg-surface-secondary',
                    'aspect-square max-h-[220px] sm:max-h-none w-full max-w-[280px] mx-auto sm:max-w-none',
                    'transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    selected === null && !isTransitioning && 'hover:border-primary/45 hover:shadow-nexus-md cursor-pointer',
                    isCorrectPick && 'border-success ring-2 ring-success/40 scale-[1.02]',
                    isWrongPick && 'border-danger bg-danger/10',
                    (selected !== null || isTransitioning) && !isCorrectPick && !isWrongPick && 'opacity-45 cursor-default'
                  )}
                >
                  <Image
                    src={ch.image}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="(max-width:640px) 280px, 33vw"
                  />
                  <span className="absolute bottom-2 left-2 rounded-md bg-app/90 border border-dm-border px-2 py-0.5 text-xs font-semibold text-content tabular-nums">
                    {ch.id.toUpperCase()}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-content-muted mt-4">
        Score: {score} / {total}
      </p>
    </div>
  );
}
