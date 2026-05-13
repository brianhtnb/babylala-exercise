'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarDisplayProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
}

export function StarDisplay({
  stars,
  maxStars = 3,
  size = 'md',
  showEmpty = true,
}: StarDisplayProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className={cn('flex gap-1 tabular-nums', sizeClasses[size])}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.span
          key={i}
          initial={i < stars ? { scale: 0, rotate: -180 } : {}}
          animate={i < stars ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          className={cn(
            i < stars ? 'text-score-yellow drop-shadow-sm' : showEmpty ? 'text-content-muted/35' : 'opacity-0'
          )}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}
