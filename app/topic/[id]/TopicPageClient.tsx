'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/common/Card';
import { StarDisplay } from '@/app/components/common/StarDisplay';
import { Button } from '@/app/components/common/Button';
import { getTopicById } from '@/topics';
import { loadProgress, getGameProgress } from '@/lib/storage';
import { speak, playEffect } from '@/lib/audio';
import { ProgressData } from '@/types';

export default function TopicPageClient() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  
  const topic = getTopicById(topicId);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    if (topic) {
      speak(`Welcome to ${topic.title}! Choose a game to play!`);
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Topic not found!</p>
      </div>
    );
  }

  const handleGameClick = async (gameId: string) => {
    await playEffect('click');
    router.push(`/topic/${topicId}/exercise/${gameId}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      <Header title={topic.title} showBack onBack={handleBack} />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl ${topic.color} text-7xl mb-4`}
          >
            {topic.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {topic.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn {topic.vocabulary.length} new words and practice {topic.sentences.length} sentence patterns!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {topic.games.map((game, index) => {
            const gameProgress = progress
              ? getGameProgress(progress, topicId, game.id)
              : { completed: false, stars: 0 };
            
            const isLocked = game.dependsOn
              ? game.dependsOn.some((depId) => {
                  const depProgress = progress
                    ? getGameProgress(progress, topicId, depId)
                    : { completed: false };
                  return !depProgress.completed;
                })
              : false;

            const gameColors: { [key: string]: string } = {
              counting: 'bg-orange-100 border-orange-300',
              sequence: 'bg-purple-100 border-purple-300',
              writing: 'bg-teal-100 border-teal-300',
              dialogue: 'bg-pink-100 border-pink-300',
            };

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  onClick={() => handleGameClick(game.id)}
                  locked={isLocked}
                  className={`${gameColors[game.type]} border-4`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-3">
                      {game.type === 'counting' && '🔢'}
                      {game.type === 'sequence' && '📊'}
                      {game.type === 'writing' && '✏️'}
                      {game.type === 'dialogue' && '💬'}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {game.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4">{game.description}</p>

                    <div className="flex items-center gap-2">
                      {gameProgress.completed ? (
                        <>
                          <StarDisplay stars={gameProgress.stars} size="sm" />
                          <span className="text-green-500 text-2xl">✓</span>
                        </>
                      ) : isLocked ? (
                        <span className="text-gray-400 text-xl">🔒 Locked</span>
                      ) : (
                        <Button size="sm" sound={false}>
                          Play Now!
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
