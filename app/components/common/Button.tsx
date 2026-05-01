'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playEffect } from '@/lib/audio';

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
  const handleClick = async () => {
    if (sound) {
      await playEffect('click');
    }
    onClick?.();
  };

  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-green-500 hover:bg-green-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-lg rounded-lg min-h-[48px]',
    md: 'px-6 py-3 text-xl rounded-xl min-h-[60px]',
    lg: 'px-8 py-4 text-2xl rounded-2xl min-h-[72px]',
    xl: 'px-10 py-5 text-3xl rounded-2xl min-h-[88px]',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
