'use client';

import { motion } from 'framer-motion';
import { speak } from '@/lib/audio';
import { cn } from '@/lib/utils';

interface SpeechButtonProps {
  text: string;
  className?: string;
  children: React.ReactNode;
}

export function SpeechButton({ text, className, children }: SpeechButtonProps) {
  const handleClick = async () => {
    await speak(text);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn("flex items-center gap-2 text-left cursor-pointer", className)}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
      <span className="text-2xl" role="img" aria-label="speaker">🔊</span>
    </motion.button>
  );
}
