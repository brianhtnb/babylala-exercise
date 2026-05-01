'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speak, playEffect } from '@/lib/audio';
import { ProgressBar } from '../common/ProgressBar';

interface TraceGameProps {
  onComplete: (score: number) => void;
}

const NUMBERS_TO_TRACE = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function TraceGame({ onComplete }: TraceGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [, setIsTracing] = useState(false);

  const currentNumber = NUMBERS_TO_TRACE[currentIndex];

  const handleStart = () => {
    setIsTracing(true);
  };

  const handleEnd = async () => {
    setIsTracing(false);
    await playEffect('correct');
    await speak(`${currentNumber}! Excellent!`);
    const newScore = score + 1;
    setScore(newScore);

    setTimeout(() => {
      if (currentIndex < NUMBERS_TO_TRACE.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete(newScore);
      }
    }, 1500);
  };

  useEffect(() => {
    speak(`Trace the number ${currentNumber}`);
  }, [currentNumber]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={currentIndex}
        total={NUMBERS_TO_TRACE.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Trace the number {currentNumber}
        </h2>
      </div>

      <div className="relative bg-white rounded-3xl shadow-xl p-4 mb-8">
        <div
          className="border-2 border-gray-200 rounded-2xl flex items-center justify-center"
          style={{ width: '300px', height: '200px' }}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
        >
          <span className="text-9xl font-bold text-gray-300 select-none">
            {currentNumber}
          </span>
        </div>

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute top-4 left-4 w-4 h-4 bg-green-400 rounded-full"
        />
      </div>

      <div className="text-lg text-gray-600 text-center max-w-md">
        Tap and hold the number, then release when done!
      </div>

      <div className="mt-4 text-xl font-semibold text-gray-600">
        Score: {score} / {NUMBERS_TO_TRACE.length}
      </div>
    </div>
  );
}
