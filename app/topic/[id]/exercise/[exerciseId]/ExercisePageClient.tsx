'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { CountGame } from '@/app/components/exercises/CountGame';
import { SequenceGame } from '@/app/components/exercises/SequenceGame';
import { TraceGame } from '@/app/components/exercises/TraceGame';
import { RolePlayGame } from '@/app/components/exercises/RolePlayGame';
import { SpellingGame } from '@/app/components/exercises/SpellingGame';
import { ReadingQuizGame } from '@/app/components/exercises/ReadingQuizGame';
import { CountAndCompleteGame } from '@/app/components/exercises/CountAndCompleteGame';
import { SceneReadingGame } from '@/app/components/exercises/SceneReadingGame';
import { VocabIntroGame } from '@/app/components/exercises/VocabIntroGame';
import { ListenPickGame } from '@/app/components/exercises/ListenPickGame';
import { SpeakingPresentationGame } from '@/app/components/exercises/SpeakingPresentationGame';
import { FinalCheckpointGame } from '@/app/components/exercises/FinalCheckpointGame';
import { GameComplete } from '@/app/components/exercises/GameComplete';
import { getTopicById } from '@/topics';
import { jungleCheckpointItems } from '@/topics/jungle/games/final-checkpoint';
import { SPELLING_GAME_ROUND_COUNT } from '@/topics/jungle/games/spelling';
import { loadProgress, saveProgress, updateGameProgress, getGameProgress } from '@/lib/storage';
import { PAGE_CONTAINER, TYPOGRAPHY, FADE_IN } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

export default function ExercisePageClient() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const exerciseId = params.exerciseId as string;

  const topic = getTopicById(topicId);
  const game = topic?.games.find((g) => g.id === exerciseId);

  const [gameState, setGameState] = useState<'playing' | 'complete'>('playing');
  const [score, setScore] = useState(0);

  if (!topic || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <p className={TYPOGRAPHY.pageTitle}>Game not found!</p>
      </div>
    );
  }

  const progressSnapshot = loadProgress();
  const prereqBlocked =
    Boolean(
      game.dependsOn &&
        game.dependsOn.length > 0 &&
        !game.dependsOn.every((depId) =>
          getGameProgress(progressSnapshot, topicId, depId).completed
        )
    );

  if (prereqBlocked) {
    return (
      <div className="min-h-screen bg-app">
        <main className={cn(PAGE_CONTAINER, 'py-8 max-w-lg mx-auto text-center space-y-4')}>
          <p className={cn(TYPOGRAPHY.pageTitle, 'text-xl')}>Not yet available</p>
          <p className={cn(TYPOGRAPHY.body, 'text-content-secondary')}>
            Finish the other games in this topic first, then come back here.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/topic/${topicId}`)}
            className={cn(TYPOGRAPHY.control, 'rounded-xl bg-primary px-5 py-2.5 text-white shadow-nexus-sm')}
          >
            Back to topic
          </button>
        </main>
      </div>
    );
  }

  const getTotalQuestions = () => {
    switch (game.type) {
      case 'counting':
        return 10;
      case 'sequence':
        return 8;
      case 'writing':
        return 10;
      case 'dialogue':
        return 5;
      case 'vocab-intro':
        return 10;
      case 'listen-pick':
        return 7;
      case 'spelling':
        return SPELLING_GAME_ROUND_COUNT;
      case 'reading-quiz':
        return 5;
      case 'count-complete':
        return 7;
      case 'scene-reading':
        return 8;
      case 'speaking-present':
        return 1;
      case 'final-checkpoint':
        return jungleCheckpointItems.length;
      default:
        return 10;
    }
  };

  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState('complete');

    let stars = 0;
    const totalQuestions = getTotalQuestions();
    const percentage = (finalScore / totalQuestions) * 100;
    if (percentage >= 80) stars = 3;
    else if (percentage >= 60) stars = 2;
    else if (percentage >= 40) stars = 1;

    const progress = loadProgress();
    const updatedProgress = updateGameProgress(progress, topicId, exerciseId, {
      completed: true,
      highScore: finalScore,
      stars,
    });
    saveProgress(updatedProgress);
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setScore(0);
  };

  const handleBackToTopic = () => {
    router.push(`/topic/${topicId}`);
  };

  const handleNextGame = () => {
    const currentIndex = topic.games.findIndex((g) => g.id === exerciseId);
    const nextGame = topic.games[currentIndex + 1];
    if (nextGame) {
      router.push(`/topic/${topicId}/exercise/${nextGame.id}`);
    }
  };

  const renderGame = () => {
    switch (game.type) {
      case 'counting':
        return <CountGame onComplete={handleGameComplete} />;
      case 'sequence':
        return <SequenceGame onComplete={handleGameComplete} />;
      case 'writing':
        return <TraceGame onComplete={handleGameComplete} />;
      case 'dialogue':
        return <RolePlayGame onComplete={handleGameComplete} />;
      case 'vocab-intro':
        return <VocabIntroGame onComplete={handleGameComplete} />;
      case 'listen-pick':
        return <ListenPickGame onComplete={handleGameComplete} />;
      case 'spelling':
        return <SpellingGame onComplete={handleGameComplete} />;
      case 'reading-quiz':
        return <ReadingQuizGame onComplete={handleGameComplete} />;
      case 'count-complete':
        return <CountAndCompleteGame onComplete={handleGameComplete} />;
      case 'scene-reading':
        return <SceneReadingGame onComplete={handleGameComplete} />;
      case 'speaking-present':
        return <SpeakingPresentationGame onComplete={handleGameComplete} />;
      case 'final-checkpoint':
        return <FinalCheckpointGame onComplete={handleGameComplete} />;
      default:
        return <div>Unknown game type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-app">
      <main className={cn(PAGE_CONTAINER, 'py-4')}>
        {/* Inline back nav */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={handleBackToTopic}
            aria-label="Back to topic"
            className="w-9 h-9 rounded-lg bg-surface-secondary border border-dm-border flex items-center justify-center text-content-muted hover:text-content hover:border-primary/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h1 className={cn(TYPOGRAPHY.pageTitle, 'text-xl md:text-2xl')}>{game.title}</h1>
        </div>
        <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
            <motion.div
              key="game"
              initial={FADE_IN.initial}
              animate={FADE_IN.animate}
              exit={{ opacity: 0 }}
              transition={FADE_IN.transition}
            >
              {renderGame()}
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={FADE_IN.initial}
              animate={FADE_IN.animate}
              exit={{ opacity: 0 }}
              transition={FADE_IN.transition}
            >
              <GameComplete
                score={score}
                totalQuestions={getTotalQuestions()}
                onPlayAgain={handlePlayAgain}
                onBackToTopic={handleBackToTopic}
                onNextGame={handleNextGame}
                hasNextGame={
                  topic.games.findIndex((g) => g.id === exerciseId) < topic.games.length - 1
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

