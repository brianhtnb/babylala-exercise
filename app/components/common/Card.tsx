'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  locked?: boolean;
  /**
   * Render as a `div` instead of a `button`.
   * Use this when the card contains interactive elements (e.g. buttons)
   * to avoid invalid `<button>` inside `<button>` HTML.
   */
  asDiv?: boolean;
}

export function Card({
  children,
  className,
  onClick,
  disabled = false,
  locked = false,
  asDiv = false,
}: CardProps) {
  const isInteractive = !disabled && !locked && !!onClick;

  const handleClick = () => {
    if (isInteractive) onClick?.();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleClick();
  };

  const sharedClassName = cn(
    'panel relative p-6 w-full text-left overflow-hidden',
    'transition-shadow duration-200 shadow-nexus-sm',
    isInteractive && 'cursor-pointer hover:shadow-nexus-md',
    (disabled || locked) && 'opacity-60 cursor-not-allowed',
    locked && 'grayscale',
    className
  );

  const motionProps = {
    whileHover: isInteractive ? { scale: 1.01 } : {},
    whileTap: isInteractive ? { scale: 0.99 } : {},
    onClick: handleClick,
    onTouchStart: handleTouchStart,
    className: sharedClassName,
    style: { WebkitTapHighlightColor: 'transparent' } as React.CSSProperties,
  };

  if (asDiv) {
    return <motion.div {...motionProps}>{children}</motion.div>;
  }

  return (
    <motion.button type="button" disabled={disabled || locked} {...motionProps}>
      {children}
    </motion.button>
  );
}
