'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '../common/ProgressBar';
import { SpeechButton } from '../common/SpeechButton';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { spellingQuestions } from '@/topics/jungle/games/spelling';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

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
  currentIndex: number;
  score: number;
  tiles: TileState[];
  wordComplete: boolean;
  isTransitioning: boolean;
}

function buildTiles(questionIndex: number): TileState[] {
  return spellingQuestions[questionIndex].letters.map((l) => ({
    ...l,
    found: false,
    wrongFlash: false,
  }));
}

export function SpellingGame({ onComplete }: SpellingGameProps) {
  const [state, setState] = useState<GameState>(() => ({
    currentIndex: 0,
    score: 0,
    tiles: buildTiles(0),
    wordComplete: false,
    isTransitioning: false,
  }));

  const q = spellingQuestions[state.currentIndex];
  const total = spellingQuestions.length;

  useEffect(() => {
    if (!state.isTransitioning && !state.wordComplete) {
      stopSpeaking();
      speak(`Find the extra letter in: ${q.word}`).catch(() => {});
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
      setState({
        currentIndex: nextIndex,
        score: newScore,
        tiles: buildTiles(nextIndex),
        wordComplete: false,
        isTransitioning: false,
      });
    },
    [state.currentIndex, total, onComplete]
  );

  const handleTileTap = useCallback(
    (tileIndex: number) => {
      if (state.wordComplete || state.isTransitioning) return;
      const tile = state.tiles[tileIndex];
      if (tile.found) return;

      if (tile.isRedundant) {
        // Mark tile as found
        const newTiles = state.tiles.map((t, i) =>
          i === tileIndex ? { ...t, found: true } : t
        );
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
          setTimeout(() => moveToNext(newScore), 1800);
        } else {
          setState((prev) => ({ ...prev, tiles: newTiles }));
        }
      } else {
        // Wrong tap — flash red briefly
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

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={state.currentIndex} total={total} />

      <div className="panel p-6 mt-4 text-center">
        {/* Animal emoji + name */}
        <motion.div
          key={state.currentIndex}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="mb-4"
        >
          <div className="text-7xl mb-3" aria-hidden>{q.emoji}</div>
          <div className="flex items-center justify-center gap-2">
            <p className={cn(TYPOGRAPHY.sectionTitle, 'capitalize')}>{q.word}</p>
            <SpeechButton text={q.word} />
          </div>
        </motion.div>

        <p className="text-sm text-content-muted mb-5">
          Tap the <span className="font-semibold text-danger">extra letter</span> that does not belong!
          {redundantCount > 1 && ` (${foundCount}/${redundantCount} found)`}
        </p>

        {/* Letter tiles */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentIndex}
            className="flex flex-wrap justify-center gap-2 mb-4"
          >
            {state.tiles.map((tile, i) => (
              <motion.button
                key={i}
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

        {/* Word complete celebration */}
        <AnimatePresence>
          {state.wordComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center gap-2 py-3"
            >
              <span className="text-4xl" aria-hidden>🎉</span>
              <p className={cn(TYPOGRAPHY.cardTitle, 'text-success')}>
                Great job! The word is <span className="capitalize">{q.word}</span>!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {!state.wordComplete && (
          <p className="text-xs text-content-muted mt-3">
            {state.score} / {state.currentIndex} correct so far
          </p>
        )}
      </div>
    </div>
  );
}
