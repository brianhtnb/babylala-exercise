'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playEffect } from '@/lib/audio';
import { TYPOGRAPHY } from '@/lib/design-tokens';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  sound?: boolean;
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'lg',
  className,
  sound = true,
}: ButtonProps) {
  const handleClick = () => {
    if (sound) {
      playEffect('click').catch(() => {});
    }
    onClick?.();
  };

  const variantStyles = {
    primary:
      'bg-primary text-white shadow-nexus-sm hover:bg-primary-700 border border-primary-600/30',
    secondary:
      'bg-secondary text-white shadow-nexus-sm hover:bg-secondary-700 border border-secondary-600/30',
    success:
      'bg-success text-white shadow-nexus-sm hover:bg-emerald-600 border border-emerald-600/30',
    danger:
      'bg-danger text-white shadow-nexus-sm hover:bg-rose-600 border border-rose-600/30',
  };

  const sizeStyles = {
    sm: cn('px-4 py-2 rounded-lg min-h-[48px]', TYPOGRAPHY.control),
    md: cn('px-6 py-3 rounded-xl min-h-[56px] text-base font-semibold'),
    lg: cn('px-8 py-4 rounded-xl min-h-[72px] text-xl font-semibold'),
    xl: cn('px-10 py-5 rounded-xl min-h-[88px] text-2xl font-semibold'),
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
