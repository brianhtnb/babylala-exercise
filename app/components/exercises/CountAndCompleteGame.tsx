'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
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
  filledWord: string | null;
}

const ANIMAL_IMAGES: Record<string, string> = {
  bee:       '/images/jungle/animals/bee.png',
  frog:      '/images/jungle/animals/frog.png',
  tiger:     '/images/jungle/animals/tiger.png',
  snake:     '/images/jungle/animals/snake.png',
  monkey:    '/images/jungle/animals/monkey.png',
  spider:    '/images/jungle/animals/spider.png',
  rabbit:    '/images/jungle/animals/rabbit.png',
  lizard:    '/images/jungle/animals/lizard.png',
  elephant:  '/images/jungle/animals/elephant.png',
  crocodile: '/images/jungle/animals/crocodile.png',
};

const PANORAMA = '/images/jungle/animals/panorama-counting.png';

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
  const [before, after] = q.sentence.split('___') as [string, string];

  useEffect(() => {
    if (!state.isTransitioning && state.selected === null) {
      stopSpeaking();
      speak(`Count the ${q.animal}s. ${q.sentence.replace('___', '...')}`).catch(() => {});
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
        speak(q.sentence.replace('___', option)).catch(() => {});
        setTimeout(() => {
          const nextIndex = state.currentIndex + 1;
          if (nextIndex >= total) { onComplete(newScore); return; }
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
        setTimeout(() => setState((prev) => ({ ...prev, wrongOption: null })), 500);
      }
    },
    [state, q, total, onComplete]
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ProgressBar current={state.currentIndex} total={total} />

      {/* Panorama — always visible so students can count */}
      <div className="rounded-2xl overflow-hidden border border-dm-border shadow-nexus-sm">
        <Image
          src={PANORAMA}
          alt="Jungle scene — count the animals"
          width={1600}
          height={900}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="panel p-5 space-y-4"
        >
          {/* Which animal to count */}
          <div className="flex items-center gap-3">
            <Image
              src={ANIMAL_IMAGES[q.animal] ?? ''}
              alt={q.animal}
              width={56}
              height={56}
              className="object-contain drop-shadow"
            />
            <div>
              <p className="text-xs text-content-muted uppercase tracking-wider font-semibold">
                Count the {q.animal}s!
              </p>
              {/* Sentence with animated blank */}
              <p className={cn(TYPOGRAPHY.sectionTitle, 'text-base leading-snug mt-0.5')}>
                {before}
                <AnimatePresence mode="wait">
                  {state.filledWord ? (
                    <motion.span
                      key="filled"
                      initial={{ scale: 0.5, opacity: 0, y: 8 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                      className="inline-block px-2 py-0.5 rounded-lg bg-success/20 text-success font-bold border border-success/40 mx-1"
                    >
                      {state.filledWord}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="blank"
                      className="inline-block w-14 border-b-2 border-primary border-dashed mx-1 align-bottom"
                    />
                  )}
                </AnimatePresence>
                {after}
              </p>
            </div>
          </div>

          {/* Answer buttons */}
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
                    'py-3 px-4 rounded-xl text-base font-semibold border-2 transition-all duration-200 capitalize select-none',
                    isSelected && state.isCorrect
                      ? 'bg-success border-success text-white scale-105'
                      : isWrong
                      ? 'bg-danger/20 border-danger text-danger'
                      : state.isTransitioning
                      ? 'bg-surface-secondary border-dm-border text-content-muted opacity-40 cursor-default'
                      : 'bg-primary/8 border-primary/30 text-content hover:bg-primary/15 hover:border-primary/50 active:scale-95 cursor-pointer'
                  )}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {state.isCorrect && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm font-semibold text-success"
            >
              🌟 Well done!
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
