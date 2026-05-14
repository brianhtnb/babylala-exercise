'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import {
  SPELLING_FOCUS_WORDS,
  SPELLING_GAME_ROUND_COUNT,
  generateSpellingLetters,
} from '@/topics/jungle/games/spelling';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

const ANIMAL_IMAGES: Record<string, string> = {
  bee: '/images/jungle/animals/bee.png',
  frog: '/images/jungle/animals/frog.png',
  tiger: '/images/jungle/animals/tiger.png',
  monkey: '/images/jungle/animals/monkey.png',
  spider: '/images/jungle/animals/spider.png',
  lizard: '/images/jungle/animals/lizard.png',
  crocodile: '/images/jungle/animals/crocodile.png',
};

interface SpellingGameProps {
  onComplete: (score: number) => void;
}

interface TileState {
  char: string;
  isRedundant: boolean;
  found: boolean;
  wrongFlash: boolean;
}

interface GameState {
  wordOrder: readonly string[];
  currentIndex: number;
  score: number;
  tiles: TileState[];
  wordComplete: boolean;
  isTransitioning: boolean;
}

function shuffleWordOrder(): string[] {
  const arr = [...SPELLING_FOCUS_WORDS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildTilesForWord(word: string): TileState[] {
  return generateSpellingLetters(word, Math.random).map((l) => ({
    ...l,
    found: false,
    wrongFlash: false,
  }));
}

export function SpellingGame({ onComplete }: SpellingGameProps) {
  const total = SPELLING_GAME_ROUND_COUNT;

  const [state, setState] = useState<GameState>(() => {
    const wordOrder = shuffleWordOrder();
    const first = wordOrder[0]!;
    return {
      wordOrder,
      currentIndex: 0,
      score: 0,
      tiles: buildTilesForWord(first),
      wordComplete: false,
      isTransitioning: false,
    };
  });

  const word = state.wordOrder[state.currentIndex]!;

  useEffect(() => {
    if (!state.isTransitioning && !state.wordComplete) {
      stopSpeaking();
      speak(`Find the extra letter in: ${word}`).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.isTransitioning]);

  const moveToNext = useCallback(
    (newScore: number) => {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= total) {
        onComplete(newScore);
        return;
      }
      const nextWord = state.wordOrder[nextIndex]!;
      setState({
        wordOrder: state.wordOrder,
        currentIndex: nextIndex,
        score: newScore,
        tiles: buildTilesForWord(nextWord),
        wordComplete: false,
        isTransitioning: false,
      });
    },
    [state.currentIndex, state.wordOrder, total, onComplete]
  );

  const handleTileTap = useCallback(
    (tileIndex: number) => {
      if (state.wordComplete || state.isTransitioning) return;
      const tile = state.tiles[tileIndex];
      if (tile.found) return;

      const currentWord = state.wordOrder[state.currentIndex]!;

      if (tile.isRedundant) {
        const newTiles = state.tiles.map((t, i) => (i === tileIndex ? { ...t, found: true } : t));
        playEffect('correct').catch(() => {});
        const allFound = newTiles.every((t) => !t.isRedundant || t.found);

        if (allFound) {
          playEffect('celebration').catch(() => {});
          const newScore = state.score + 1;
          setState((prev) => ({
            ...prev,
            tiles: newTiles,
            wordComplete: true,
            isTransitioning: true,
            score: newScore,
          }));
          (async () => {
            try {
              await speak(currentWord);
            } catch {
              /* ignore */
            }
            await new Promise<void>((r) => setTimeout(r, 450));
            moveToNext(newScore);
          })();
        } else {
          setState((prev) => ({ ...prev, tiles: newTiles }));
        }
      } else {
        playEffect('incorrect').catch(() => {});
        setState((prev) => ({
          ...prev,
          tiles: prev.tiles.map((t, i) => (i === tileIndex ? { ...t, wrongFlash: true } : t)),
        }));
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            tiles: prev.tiles.map((t, i) => (i === tileIndex ? { ...t, wrongFlash: false } : t)),
          }));
        }, 450);
      }
    },
    [state, moveToNext]
  );

  const redundantCount = state.tiles.filter((t) => t.isRedundant).length;
  const foundCount = state.tiles.filter((t) => t.isRedundant && t.found).length;

  const tileLayoutKey = useMemo(
    () => state.tiles.map((t) => `${t.char}${t.isRedundant ? 'x' : 'o'}`).join(''),
    [state.tiles]
  );

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={state.currentIndex} total={total} />

      <div className="panel p-6 mt-4 text-center">
        <motion.div
          key={`${state.currentIndex}-${word}`}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="mb-4"
        >
          <div className="flex justify-center mb-3">
            <Image
              src={ANIMAL_IMAGES[word] ?? '/images/jungle/animals/bee.png'}
              alt={word}
              width={160}
              height={160}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className={cn(TYPOGRAPHY.sectionTitle, 'capitalize')}>{word}</p>
            <SpeechButton text={word} />
          </div>
        </motion.div>

        <p className="text-sm text-content-muted mb-5">
          Tap the <span className="font-semibold text-danger">extra letter</span> that does not belong!
          {redundantCount > 1 && ` (${foundCount}/${redundantCount} found)`}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${state.currentIndex}-${tileLayoutKey}`}
            className="flex flex-wrap justify-center gap-2 mb-4"
          >
            {state.tiles.map((tile, i) => (
              <motion.button
                key={`${state.currentIndex}-${i}-${tile.char}-${tile.isRedundant}`}
                type="button"
                onClick={() => handleTileTap(i)}
                disabled={tile.found || state.wordComplete}
                animate={
                  tile.wrongFlash
                    ? { x: [0, -6, 6, -6, 6, 0], backgroundColor: '#FCA5A5' }
                    : {}
                }
                transition={{ duration: 0.35 }}
                className={cn(
                  'w-12 h-14 rounded-xl text-xl font-bold border-2 transition-all duration-200 select-none',
                  tile.found
                    ? 'bg-surface-secondary border-dm-border text-content-muted line-through opacity-50'
                    : tile.wrongFlash
                      ? 'bg-danger/20 border-danger text-danger'
                      : 'bg-warning-light border-warning/50 text-content hover:bg-warning/30 hover:border-warning active:scale-95 cursor-pointer'
                )}
                aria-label={tile.isRedundant ? `Extra letter ${tile.char}` : `Letter ${tile.char}`}
              >
                {tile.char}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {state.wordComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center gap-2 py-3"
            >
              <span className="text-4xl" aria-hidden>
                🎉
              </span>
              <p className={cn(TYPOGRAPHY.cardTitle, 'text-success')}>
                Great job! The word is <span className="capitalize">{word}</span>!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!state.wordComplete && (
          <p className="text-xs text-content-muted mt-3">
            Score {state.score} · Round {state.currentIndex + 1} of {total}
          </p>
        )}
      </div>
    </div>
  );
}
