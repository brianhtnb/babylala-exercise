'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { readingQuestions } from '@/topics/jungle/games/reading-quiz';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface ReadingQuizGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  currentIndex: number;
  score: number;
  selected: boolean | null;
  isCorrect: boolean | null;
  isTransitioning: boolean;
}

export function ReadingQuizGame({ onComplete }: ReadingQuizGameProps) {
  const [state, setState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    selected: null,
    isCorrect: null,
    isTransitioning: false,
  });

  const q = readingQuestions[state.currentIndex];
  const total = readingQuestions.length;

  useEffect(() => {
    if (!state.isTransitioning && state.selected === null) {
      stopSpeaking();
      speak(q.sentence).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.isTransitioning]);

  const handleAnswer = useCallback(
    (answer: boolean) => {
      if (state.selected !== null || state.isTransitioning) return;
      const correct = answer === q.answer;
      const newScore = correct ? state.score + 1 : state.score;

      playEffect(correct ? 'correct' : 'incorrect').catch(() => {});
      setState((prev) => ({
        ...prev,
        selected: answer,
        isCorrect: correct,
        isTransitioning: true,
        score: newScore,
      }));

      setTimeout(() => {
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= total) {
          onComplete(newScore);
          return;
        }
        setState({
          currentIndex: nextIndex,
          score: newScore,
          selected: null,
          isCorrect: null,
          isTransitioning: false,
        });
      }, 1200);
    },
    [state, q, total, onComplete]
  );

  const btnBase =
    'flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 text-2xl font-bold transition-all duration-200 select-none';

  const trueVariant =
    state.selected === null
      ? 'bg-success/10 border-success/40 text-success hover:bg-success/20 active:scale-95 cursor-pointer'
      : state.selected === true
      ? state.isCorrect
        ? 'bg-success border-success text-white scale-105'
        : 'bg-danger border-danger text-white scale-95 opacity-80'
      : 'bg-surface-secondary border-dm-border text-content-muted opacity-50 cursor-default';

  const falseVariant =
    state.selected === null
      ? 'bg-danger/10 border-danger/40 text-danger hover:bg-danger/20 active:scale-95 cursor-pointer'
      : state.selected === false
      ? state.isCorrect
        ? 'bg-success border-success text-white scale-105'
        : 'bg-danger border-danger text-white scale-95 opacity-80'
      : 'bg-surface-secondary border-dm-border text-content-muted opacity-50 cursor-default';

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={state.currentIndex} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="panel p-6 mt-4"
        >
          {/* Animal display */}
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 leading-none" aria-hidden>{q.emoji}</div>
            <div className="flex items-center justify-center gap-2">
              <p className={cn(TYPOGRAPHY.sectionTitle, 'text-lg leading-snug max-w-xs')}>{q.sentence}</p>
              <SpeechButton text={q.sentence} />
            </div>
          </div>

          {/* True / False buttons */}
          <div className="flex gap-4 mt-4">
            <button
              className={cn(btnBase, trueVariant)}
              onClick={() => handleAnswer(true)}
              disabled={state.selected !== null}
              aria-label="Answer True"
            >
              <Check className="w-8 h-8" strokeWidth={3} />
              <span className="text-base">True</span>
            </button>
            <button
              className={cn(btnBase, falseVariant)}
              onClick={() => handleAnswer(false)}
              disabled={state.selected !== null}
              aria-label="Answer False"
            >
              <X className="w-8 h-8" strokeWidth={3} />
              <span className="text-base">False</span>
            </button>
          </div>

          {/* Feedback message */}
          <AnimatePresence>
            {state.isCorrect !== null && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'text-center text-sm font-semibold mt-4',
                  state.isCorrect ? 'text-success' : 'text-danger'
                )}
              >
                {state.isCorrect ? '🎉 Correct! Well done!' : `❌ The answer is ${q.answer ? 'True' : 'False'}.`}
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
