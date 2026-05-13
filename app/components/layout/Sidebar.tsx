'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { getAllTopics } from '@/topics';
import { loadProgress, defaultProgressData, getTopicProgress } from '@/lib/storage';
import type { ProgressData } from '@/types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const topics = getAllTopics();
  const [progress, setProgress] = useState<ProgressData>(defaultProgressData);

  // Reload progress whenever the route changes
  useEffect(() => {
    setProgress(loadProgress());
  }, [pathname]);

  const navItemClass = (active: boolean) =>
    cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left',
      'border transition-colors duration-150',
      active
        ? 'bg-chrome-accent/20 text-white border-chrome-accent/40'
        : 'text-white/65 hover:bg-white/6 hover:text-white border-transparent'
    );

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 z-30 flex flex-col',
          'bg-chrome-sidebar border-r border-white/5',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/5 shrink-0">
          <span className="text-2xl leading-none" aria-hidden>🌟</span>
          <div>
            <p className="text-white font-semibold text-base leading-tight">Babylala</p>
            <p className="text-white/40 text-xs">Exercise</p>
          </div>
        </div>

        {/* Topics nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          <p className={cn(TYPOGRAPHY.eyebrow, 'text-white/30 px-3 py-2')}>Topics</p>
          {topics.map((topic) => {
            const tp = getTopicProgress(progress, topic.id);
            const completed = Object.values(tp.games).filter((g) => g.completed).length;
            const isActive = pathname.startsWith(`/topic/${topic.id}`);

            return (
              <Link
                key={topic.id}
                href={`/topic/${topic.id}`}
                onClick={onClose}
                className={navItemClass(isActive)}
              >
                <span className="text-xl shrink-0 leading-none" aria-hidden>
                  {topic.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight truncate">{topic.title}</p>
                  <p className="text-xs text-white/35 mt-0.5">
                    {completed}/{topic.games.length} games
                  </p>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-chrome-accent" aria-hidden />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <Link
            href="/settings"
            onClick={onClose}
            className={navItemClass(pathname === '/settings')}
          >
            <Settings className="w-4.5 h-4.5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
