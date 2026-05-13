'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { sceneReadingQuestions } from '@/topics/jungle/games/scene-reading';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface SceneReadingGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  currentIndex: number;
  score: number;
  selected: boolean | null;
  isTransitioning: boolean;
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

const PANORAMA = '/images/jungle/animals/panorama-yesno.png';

export function SceneReadingGame({ onComplete }: SceneReadingGameProps) {
  const [state, setState] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    selected: null,
    isTransitioning: false,
  });

  const q = sceneReadingQuestions[state.currentIndex];
  const total = sceneReadingQuestions.length;

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
        isTransitioning: true,
        score: newScore,
      }));

      setTimeout(() => {
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= total) { onComplete(newScore); return; }
        setState({
          currentIndex: nextIndex,
          score: newScore,
          selected: null,
          isTransitioning: false,
        });
      }, 1300);
    },
    [state, q, total, onComplete]
  );

  const isCorrect = state.selected !== null && state.selected === q.answer;

  const yesStyle =
    state.selected === null
      ? 'bg-success/10 border-success/40 text-success hover:bg-success/20 active:scale-95 cursor-pointer'
      : state.selected === true
      ? isCorrect
        ? 'bg-success border-success text-white scale-105'
        : 'bg-danger/20 border-danger text-danger opacity-80'
      : 'bg-surface-secondary border-dm-border text-content-muted opacity-40 cursor-default';

  const noStyle =
    state.selected === null
      ? 'bg-danger/10 border-danger/40 text-danger hover:bg-danger/20 active:scale-95 cursor-pointer'
      : state.selected === false
      ? isCorrect
        ? 'bg-success border-success text-white scale-105'
        : 'bg-danger/20 border-danger text-danger opacity-80'
      : 'bg-surface-secondary border-dm-border text-content-muted opacity-40 cursor-default';

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ProgressBar current={state.currentIndex} total={total} />

      {/* Panorama scene */}
      <div className="rounded-2xl overflow-hidden border border-dm-border shadow-nexus-sm">
        <Image
          src={PANORAMA}
          alt="Jungle scene"
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
          className="panel p-5"
        >
          {/* Animal + sentence */}
          <div className="flex items-center gap-4 mb-5">
            <Image
              src={ANIMAL_IMAGES[q.animal] ?? ''}
              alt={q.animal}
              width={72}
              height={72}
              className="object-contain drop-shadow shrink-0"
            />
            <div className="flex items-center gap-2 min-w-0">
              <p className={cn(TYPOGRAPHY.sectionTitle, 'text-lg leading-snug')}>{q.sentence}</p>
              <SpeechButton text={q.sentence} />
            </div>
          </div>

          {/* Yes / No buttons */}
          <div className="flex gap-4">
            <button
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 font-bold text-lg transition-all duration-200 select-none',
                yesStyle
              )}
              onClick={() => handleAnswer(true)}
              disabled={state.selected !== null}
              aria-label="Answer Yes"
            >
              <Check className="w-7 h-7" strokeWidth={3} />
              Yes
            </button>
            <button
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 font-bold text-lg transition-all duration-200 select-none',
                noStyle
              )}
              onClick={() => handleAnswer(false)}
              disabled={state.selected !== null}
              aria-label="Answer No"
            >
              <X className="w-7 h-7" strokeWidth={3} />
              No
            </button>
          </div>

          <AnimatePresence>
            {state.selected !== null && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'text-center text-sm font-semibold mt-4',
                  isCorrect ? 'text-success' : 'text-danger'
                )}
              >
                {isCorrect ? '🎉 Correct!' : `❌ The answer is ${q.answer ? 'Yes' : 'No'}.`}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-content-muted">
        Score: {state.score} / {state.currentIndex + (state.selected !== null ? 1 : 0)}
      </p>
    </div>
  );
}
