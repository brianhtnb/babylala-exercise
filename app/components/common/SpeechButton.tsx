'use client';

import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak } from '@/lib/audio';
import { cn } from '@/lib/utils';

interface SpeechButtonProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
}

export function SpeechButton({ text, className, children }: SpeechButtonProps) {
  const handleClick = async () => {
    await speak(text);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn('inline-flex items-center gap-2 text-left cursor-pointer group', className)}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
      <Volume2
        className="w-6 h-6 shrink-0 text-primary opacity-80 group-hover:opacity-100 transition-opacity"
        strokeWidth={2}
        aria-hidden
      />
      <span className="sr-only">Play audio</span>
    </motion.button>
  );
}
