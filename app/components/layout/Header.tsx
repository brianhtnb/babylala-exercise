'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playEffect } from '@/lib/audio';
import { TYPOGRAPHY } from '@/lib/design-tokens';

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
        'w-full px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between',
        'bg-chrome-sidebar text-white border-b border-dm-border/40',
        className
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {showBack && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            aria-label="Go back"
            className={cn(
              'shrink-0 w-11 h-11 rounded-xl flex items-center justify-center',
              'bg-chrome-sidebar-elevated text-white border border-dm-border/50',
              'hover:border-chrome-accent/80 hover:shadow-nexus-sm transition-colors'
            )}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.25} aria-hidden />
          </motion.button>
        )}
        {title && (
          <h1 className={cn(TYPOGRAPHY.pageTitle, 'text-white truncate tracking-tight')}>
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"
          aria-hidden
        >
          <Volume2 className="w-5 h-5 text-white/90" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
}
