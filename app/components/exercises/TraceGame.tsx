'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { speak, playEffect, initAudio } from '@/lib/audio';
import { ProgressBar } from '../common/ProgressBar';

interface TraceGameProps {
  onComplete: (score: number) => void;
}

const WORDS_TO_TRACE = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

export function TraceGame({ onComplete }: TraceGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number, y: number } | null>(null);

  const currentWord = WORDS_TO_TRACE[currentIndex];

  const drawGuide = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#E2E8F0'; // Light gray
    ctx.lineWidth = 4;
    ctx.strokeText(currentWord, ctx.canvas.width / 2, ctx.canvas.height / 2);
  }, [currentWord]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGuide(ctx);
    speak(`Trace the word ${currentWord}`).catch(() => {});
  }, [currentWord, drawGuide]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    initAudio();
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    const rect = canvasRef.current!.getBoundingClientRect();
    lastPoint.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = '#3B82F6'; // Blue
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (lastPoint.current) {
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPoint.current = { x, y };
  };

  const endDrawing = async () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPoint.current = null;

    if (isTransitioning) return;
    setIsTransitioning(true);

    await playEffect('correct');
    await speak(`${currentWord}! Excellent!`);
    
    setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentIndex < WORDS_TO_TRACE.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      } else {
        onComplete(score + 1);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <ProgressBar
        current={currentIndex}
        total={WORDS_TO_TRACE.length}
        className="w-full max-w-lg mb-6"
      />

      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Trace the word: <span className="text-blue-500">{currentWord}</span>
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-2 mb-6 w-full max-w-2xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="touch-none cursor-crosshair w-full"
        />
      </div>

      <div className="text-lg text-gray-600 text-center mb-4">
        Use your finger to trace the word!
      </div>

      <div className="text-xl font-semibold text-gray-600">
        Score: {score} / {WORDS_TO_TRACE.length}
      </div>
    </div>
  );
}
