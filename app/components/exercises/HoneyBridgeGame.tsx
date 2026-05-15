'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ProgressBar } from '@/app/components/common/ProgressBar';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { HONEY_BRIDGE_ROUND_COUNT, HONEY_BRIDGE_WORDS } from '@/topics/jungle/games/honey-bridge';
import { adventureAssets } from '@/topics/jungle/adventure/assets';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface HoneyBridgeGameProps {
  onComplete: (score: number) => void;
}

function shuffleOrder<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function buildRound(word: string) {
  const letters = word.split('').map((char, index) => ({ id: index, char: char.toUpperCase() }));
  const order = letters.map((l) => l.id);
  const shuffled = shuffleOrder(order, Math.random);
  return { word, letters, displayOrder: shuffled };
}

type Phase = 'playing' | 'victory';

export function HoneyBridgeGame({ onComplete }: HoneyBridgeGameProps) {
  const wordOrder = useMemo(() => shuffleOrder([...HONEY_BRIDGE_WORDS], Math.random), []);
  const wordsForSession = useMemo(
    () => wordOrder.slice(0, HONEY_BRIDGE_ROUND_COUNT),
    [wordOrder]
  );
  const totalPlanks = useMemo(
    () => wordsForSession.reduce((acc, w) => acc + w.length, 0),
    [wordsForSession]
  );

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [tapped, setTapped] = useState<number[]>([]);
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [planksFilled, setPlanksFilled] = useState(0);
  const [phase, setPhase] = useState<Phase>('playing');

  const word = wordOrder[round]!;
  const { letters, displayOrder } = useMemo(() => buildRound(word), [word]);
  const expected = letters.map((l) => l.id);

  useEffect(() => {
    if (phase === 'victory') return;
    stopSpeaking();
    void speak(
      `The crocodiles are in the river! Spell ${word} one letter at a time. Each right letter drops a plank for the bridge so Milo can cross.`
    );
  }, [word, phase]);

  const finishVictory = useCallback(
    (finalScore: number) => {
      setPhase('victory');
      void playEffect('celebration');
      void speak('You did it! The bridge is ready — Milo is crossing!');
      window.setTimeout(() => {
        onComplete(finalScore);
      }, 2200);
    },
    [onComplete]
  );

  const handleTap = useCallback(
    async (letterId: number) => {
      if (phase === 'victory') return;
      const nextIndex = tapped.length;
      if (expected[nextIndex] !== letterId) {
        setWrongId(letterId);
        setShake(true);
        await playEffect('incorrect');
        window.setTimeout(() => {
          setWrongId(null);
          setShake(false);
          setTapped([]);
        }, 450);
        return;
      }
      await playEffect('click');
      const next = [...tapped, letterId];
      setTapped(next);
      setPlanksFilled((p) => Math.min(p + 1, totalPlanks));

      if (next.length === letters.length) {
        const newScore = score + 1;
        setScore(newScore);
        setTapped([]);
        if (round + 1 >= HONEY_BRIDGE_ROUND_COUNT) {
          finishVictory(newScore);
        } else {
          setRound((r) => r + 1);
        }
      }
    },
    [expected, finishVictory, letters.length, phase, round, score, tapped, totalPlanks]
  );

  const img = `/images/jungle/animals/${word}.png`;
  const compactBridge = totalPlanks > 16;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ProgressBar current={score} total={HONEY_BRIDGE_ROUND_COUNT} />
      <p className={cn(TYPOGRAPHY.body, 'text-center text-content-secondary px-1')}>
        Tap letters in order. Each correct letter drops a wooden plank. When the bridge is complete, Milo runs
        to the honey meadow!
      </p>

      {/* Scene: sky → bridge → river → crocs */}
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border-2 border-success/35 shadow-nexus-md',
          'min-h-[300px] sm:min-h-[340px]',
          'bg-gradient-to-b from-info/25 via-success/[0.12] to-app',
          'dark:from-info/20 dark:via-success/15 dark:to-app',
          shake && 'ring-2 ring-danger/40'
        )}
      >
        {/* Sun glow */}
        <div
          className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-warning/25 blur-2xl dark:bg-warning/15"
          aria-hidden
        />

        {/* Goal bank (right) */}
        <div className="absolute right-3 top-6 z-10 flex flex-col items-center gap-1 sm:right-5 sm:top-8">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border-2 border-warning/50 bg-warning/15 shadow-nexus-sm overflow-hidden">
            <Image src="/images/jungle/animals/bee.png" alt="" fill className="object-contain p-1" sizes="64px" />
          </div>
          <span className={cn(TYPOGRAPHY.caption, 'text-warning font-semibold')}>Honey</span>
        </div>

        {/* Bridge deck */}
        <div
          className={cn(
            'absolute left-[10%] right-[18%] top-[32%] z-20 flex h-10 max-w-full flex-wrap items-end justify-center px-0.5',
            compactBridge ? 'gap-px sm:gap-0.5' : 'gap-0.5 sm:gap-1'
          )}
        >
          {Array.from({ length: totalPlanks }, (_, i) => {
            const active = i < planksFilled;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={
                  active
                    ? { y: 0, opacity: 1, rotate: 0, scaleY: 1 }
                    : { y: 14, opacity: 0.12, rotate: -2, scaleY: 0.35 }
                }
                transition={{ type: 'spring', stiffness: 420, damping: 22, delay: active ? i * 0.015 : 0 }}
                className={cn(
                  'shrink-0 rounded-sm border border-content/15 shadow-nexus-sm',
                  compactBridge ? 'h-2.5 w-3.5 sm:h-3 sm:w-5' : 'h-3 w-5 sm:h-3.5 sm:w-7',
                  active
                    ? 'bg-gradient-to-b from-warning/90 to-warning/50 dark:from-warning/70 dark:to-warning/40'
                    : 'bg-surface-secondary/80'
                )}
                aria-hidden
              />
            );
          })}
        </div>

        {/* Milo — runs along the bridge on victory */}
        <motion.div
          className="absolute bottom-[46%] z-30 h-[4.5rem] w-[4.5rem] sm:h-24 sm:w-24"
          style={{ left: '8%' }}
          initial={false}
          animate={{ left: phase === 'victory' ? '72%' : '8%' }}
          transition={
            phase === 'victory'
              ? { duration: 1.35, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.25 }
          }
        >
          <div className="relative h-full w-full -translate-x-1/2 drop-shadow-lg">
            <Image
              src={phase === 'victory' ? adventureAssets.milo.happy : adventureAssets.milo.talk}
              alt=""
              fill
              className="object-contain object-bottom"
              sizes="96px"
            />
          </div>
        </motion.div>

        {/* Ripples on water */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] overflow-hidden" aria-hidden>
          <motion.div
            className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-info/45 via-primary/35 to-primary/55 dark:from-info/35 dark:via-primary/40 dark:to-primary/60"
            animate={{ opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-6 bg-info/20 blur-md"
            animate={{ x: ['-5%', '5%', '-5%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Crocodiles */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex h-[38%] items-end justify-around pb-2 px-2 sm:pb-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2.1 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.12,
              }}
            >
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 opacity-95 drop-shadow-md">
                <Image
                  src="/images/jungle/animals/crocodile.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
              <span className={cn(TYPOGRAPHY.caption, 'text-white/90 text-[10px] font-semibold drop-shadow-sm')}>
                snap
              </span>
            </motion.div>
          ))}
        </div>

        {/* Word hint */}
        <div className="absolute left-3 right-[22%] top-3 z-20 flex items-center gap-2 sm:left-4 sm:top-4">
          <div className="relative h-12 w-12 shrink-0 rounded-xl border border-success/40 bg-surface/90 shadow-nexus-sm overflow-hidden">
            <Image src={img} alt="" fill className="object-contain p-0.5" sizes="48px" />
          </div>
          <p className={cn(TYPOGRAPHY.sectionTitle, 'text-lg sm:text-xl tracking-wide text-content drop-shadow-sm')}>
            {word.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Letter pool */}
      <div className="panel rounded-2xl border border-dm-border p-4 shadow-nexus-sm">
        <p className={cn(TYPOGRAPHY.caption, 'text-content-muted text-center mb-3')}>Letters — tap in order</p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <AnimatePresence mode="popLayout">
            {displayOrder.map((letterId) => {
              const L = letters[letterId]!;
              const placed = tapped.indexOf(letterId) >= 0;
              return (
                <motion.button
                  key={`${round}-${letterId}`}
                  type="button"
                  layout
                  disabled={placed || phase === 'victory'}
                  onClick={() => void handleTap(letterId)}
                  className={cn(
                    TYPOGRAPHY.control,
                    'relative min-w-[3rem] h-14 px-3 rounded-xl border-2 text-xl font-bold transition-all',
                    placed
                      ? 'border-success bg-success/15 text-success scale-95 opacity-60 cursor-default'
                      : 'border-primary/45 bg-primary/10 text-primary hover:bg-primary/18 shadow-nexus-sm',
                    wrongId === letterId && 'border-danger bg-danger/15 ring-2 ring-danger/40'
                  )}
                  whileTap={{ scale: placed || phase === 'victory' ? 1 : 0.9 }}
                >
                  {L.char}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
