'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { readingSceneQuestions } from '@/topics/jungle/games/reading-quiz';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface ReadingQuizGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  currentIndex: number;
  score: number;
  selected: string | null;   // the sentence string that was tapped
  isTransitioning: boolean;
}

/** Shuffle an array in place — used to randomise option order */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ReadingQuizGame({ onComplete }: ReadingQuizGameProps) {
  const [state, setState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    selected: null,
    isTransitioning: false,
  });

  const q = readingSceneQuestions[state.currentIndex];
  const total = readingSceneQuestions.length;

  // Shuffle options once per question
  const options = useMemo(
    () => shuffle([q.correct, q.wrong]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.currentIndex]
  );

  useEffect(() => {
    if (!state.isTransitioning && state.selected === null) {
      stopSpeaking();
      speak('Look at the picture. Which sentence is correct?').catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.isTransitioning]);

  const handleSelect = useCallback(
    async (sentence: string) => {
      if (state.selected !== null || state.isTransitioning) return;
      const correct = sentence === q.correct;
      const newScore = correct ? state.score + 1 : state.score;

      playEffect(correct ? 'correct' : 'incorrect').catch(() => {});

      setState((prev) => ({
        ...prev,
        selected: sentence,
        isTransitioning: true,
        score: newScore,
      }));

      // Always speak the correct sentence so the student hears the right answer
      try {
        await speak(q.correct);
      } catch { /* ignore */ }

      // Short pause after speaking before advancing
      await new Promise<void>((r) => setTimeout(r, 450));

      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= total) {
        onComplete(newScore);
        return;
      }
      setState({
        currentIndex: nextIndex,
        score: newScore,
        selected: null,
        isTransitioning: false,
      });
    },
    [state, q, total, onComplete]
  );

  const optionStyle = (sentence: string) => {
    if (state.selected === null) {
      return 'bg-surface border-dm-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer active:scale-[0.98]';
    }
    if (sentence === q.correct) {
      return 'bg-success/15 border-success text-success font-semibold scale-[1.02]';
    }
    if (sentence === state.selected) {
      // wrong choice
      return 'bg-danger/15 border-danger text-danger opacity-80';
    }
    return 'bg-surface-secondary border-dm-border opacity-40 cursor-default';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={state.currentIndex} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentIndex}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28 }}
          className="mt-4 space-y-4"
        >
          {/* Scene image */}
          <div className="rounded-2xl overflow-hidden border border-dm-border shadow-nexus-sm">
            <Image
              src={q.image}
              alt="Jungle scene"
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Instruction */}
          <p className={cn(TYPOGRAPHY.label, 'text-content-muted text-center')}>
            Which sentence correctly describes this scene?
          </p>

          {/* Sentence options */}
          <div className="space-y-3">
            {options.map((sentence) => (
              <button
                key={sentence}
                onClick={() => handleSelect(sentence)}
                disabled={state.selected !== null}
                className={cn(
                  'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 select-none',
                  TYPOGRAPHY.body,
                  optionStyle(sentence)
                )}
              >
                {sentence}
              </button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {state.selected !== null && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'text-center text-sm font-semibold',
                  state.selected === q.correct ? 'text-success' : 'text-danger'
                )}
              >
                {state.selected === q.correct
                  ? '🎉 Correct!'
                  : `❌ The correct answer: "${q.correct}"`}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-content-muted mt-4">
        Score: {state.score} / {state.currentIndex + (state.selected !== null ? 1 : 0)}
      </p>
    </div>
  );
}
