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
  const handleClick = () => {
    if (!disabled && !locked && onClick) {
      onClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <motion.button
      type="button"
      whileHover={!disabled && !locked ? { scale: 1.02 } : {}}
      whileTap={!disabled && !locked ? { scale: 0.98 } : {}}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      disabled={disabled || locked}
      className={cn(
        'bg-white rounded-[30px] shadow-lg p-6 border-4 border-purple-200',
        'transition-all duration-200 w-full text-left',
        'focus:outline-none focus:ring-4 focus:ring-blue-300',
        !disabled && !locked && 'cursor-pointer hover:border-blue-300 hover:shadow-xl',
        (disabled || locked) && 'opacity-60 cursor-not-allowed',
        locked && 'grayscale',
        className
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </motion.button>
  );
}
