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
      whileHover={!disabled && !locked ? { scale: 1.01 } : {}}
      whileTap={!disabled && !locked ? { scale: 0.99 } : {}}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      disabled={disabled || locked}
      className={cn(
        'panel relative p-6 w-full text-left overflow-hidden',
        'transition-shadow duration-200 shadow-nexus-sm',
        'hover:shadow-nexus-md',
        !disabled && !locked && onClick && 'cursor-pointer',
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
