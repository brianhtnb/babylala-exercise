'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playEffect } from '@/lib/audio';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export function Header({ title, showBack = false, onBack, className }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    playEffect('click').catch(() => {});
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        'w-full px-6 py-4 flex items-center justify-between',
        'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showBack && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold"
          >
            ←
          </motion.button>
        )}
        {title && (
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl">
          🔊
        </div>
      </div>
    </header>
  );
}
