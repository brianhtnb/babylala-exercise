'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  locked?: boolean;
}

export function Card({
  children,
  className,
  onClick,
  disabled = false,
  locked = false,
}: CardProps) {
  return (
    <motion.div
      whileHover={!disabled && !locked ? { scale: 1.02 } : {}}
      whileTap={!disabled && !locked ? { scale: 0.98 } : {}}
      onClick={!disabled && !locked ? onClick : undefined}
      className={cn(
        'bg-white rounded-3xl shadow-lg p-6 border-4 border-transparent',
        'transition-all duration-200',
        onClick && !disabled && !locked && 'cursor-pointer hover:border-blue-300',
        (disabled || locked) && 'opacity-60 cursor-not-allowed',
        locked && 'grayscale',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
