'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { countCompleteQuestions } from '@/topics/jungle/games/count-complete';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface CountAndCompleteGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  currentIndex: number;
  score: number;
  selected: string | null;
  isCorrect: boolean | null;
  wrongOption: string | null;
  isTransitioning: boolean;
  filledWord: string | null; // the word that animated into the blank
}

export function CountAndCompleteGame({ onComplete }: CountAndCompleteGameProps) {
  const [state, setState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    selected: null,
    isCorrect: null,
    wrongOption: null,
    isTransitioning: false,
    filledWord: null,
  });

  const q = countCompleteQuestions[state.currentIndex];
  const total = countCompleteQuestions.length;
  const [sentenceParts, setSentenceParts] = useState<[string, string]>(['', '']);

  useEffect(() => {
    const parts = q.sentence.split('___') as [string, string];
    setSentenceParts(parts);
  }, [q.sentence]);

  useEffect(() => {
    if (!state.isTransitioning && state.selected === null) {
      stopSpeaking();
      speak(q.sentence.replace('___', '...')).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.isTransitioning]);

  const handleAnswer = useCallback(
    (option: string) => {
      if (state.isTransitioning) return;

      const correct = option === q.answer;
      playEffect(correct ? 'correct' : 'incorrect').catch(() => {});

      if (correct) {
        const newScore = state.score + 1;
        setState((prev) => ({
          ...prev,
          selected: option,
          isCorrect: true,
          filledWord: option,
          isTransitioning: true,
          score: newScore,
        }));
        // Read the completed sentence
        speak(q.sentence.replace('___', option)).catch(() => {});
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
            wrongOption: null,
            isTransitioning: false,
            filledWord: null,
          });
        }, 2000);
      } else {
        setState((prev) => ({ ...prev, wrongOption: option }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, wrongOption: null }));
        }, 500);
      }
    },
    [state, q, total, onComplete]
  );

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
          {/* Count the animals */}
          <div className="text-center mb-5">
            <p className="text-xs text-content-muted uppercase tracking-wider font-semibold mb-3">
              Count the animals!
            </p>
            <motion.div
              className="flex flex-wrap justify-center gap-1 mb-4 min-h-[3.5rem]"
              aria-label={`${q.count} ${q.emojiChar}`}
            >
              {Array.from({ length: q.count }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
                  className="text-4xl leading-none"
                  aria-hidden
                >
                  {q.emojiChar}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Sentence with blank */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <p className={cn(TYPOGRAPHY.sectionTitle, 'text-center leading-relaxed')}>
              {sentenceParts[0]}
              <AnimatePresence mode="wait">
                {state.filledWord ? (
                  <motion.span
                    key="filled"
                    initial={{ scale: 0.4, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                    className="inline-block px-2 py-0.5 rounded-lg bg-success/20 text-success font-bold border border-success/40 mx-1"
                  >
                    {state.filledWord}
                  </motion.span>
                ) : (
                  <motion.span
                    key="blank"
                    className="inline-block w-20 border-b-2 border-primary border-dashed mx-1 align-bottom"
                    aria-label="blank"
                  />
                )}
              </AnimatePresence>
              {sentenceParts[1]}
            </p>
            <SpeechButton
              text={state.filledWord ? q.sentence.replace('___', state.filledWord) : q.sentence.replace('___', '...')}
            />
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((option) => {
              const isSelected = state.selected === option;
              const isWrong = state.wrongOption === option;

              return (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={state.isTransitioning}
                  animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  className={cn(
                    'py-3 px-4 rounded-xl text-base font-semibold border-2 transition-all duration-200 select-none capitalize',
                    isSelected && state.isCorrect
                      ? 'bg-success border-success text-white scale-105'
                      : isWrong
                      ? 'bg-danger/20 border-danger text-danger'
                      : state.isTransitioning
                      ? 'bg-surface-secondary border-dm-border text-content-muted opacity-50 cursor-default'
                      : 'bg-info-light border-info/40 text-content hover:bg-info/20 hover:border-info/60 active:scale-95 cursor-pointer'
                  )}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Correct feedback */}
          <AnimatePresence>
            {state.isCorrect && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm font-semibold mt-4 text-success"
              >
                🌟 Excellent! You got it!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-content-muted mt-4">
        Score: {state.score} / {state.currentIndex + (state.isCorrect ? 1 : 0)}
      </p>
    </div>
  );
}
