'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div
      className={cn(
        'w-full rounded-full h-3 overflow-hidden bg-surface-secondary border border-dm-border',
        className
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
      />
    </div>
  );
}
