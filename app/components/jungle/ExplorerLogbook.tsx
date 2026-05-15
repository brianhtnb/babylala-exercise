'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Binoculars, Compass, X } from 'lucide-react';
import { speak, stopSpeaking } from '@/lib/audio';
import { adventureAssets } from '@/topics/jungle/adventure/assets';
import { jungleExploreCopy } from '@/topics/jungle/adventure/copy';
import type { JungleExplorerBadgeId, JungleExplorerProgress, JungleExplorerToolId } from '@/types';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import { StarDisplay } from '@/app/components/common/StarDisplay';

const BADGE_ORDER: JungleExplorerBadgeId[] = ['bee', 'tiger', 'crocodile', 'monkey'];

interface ExplorerLogbookProps {
  open: boolean;
  onClose: () => void;
  explorer: JungleExplorerProgress;
  vocabulary: string[];
}

type TabId = 'collection' | 'notes';

export function ExplorerLogbook({ open, onClose, explorer, vocabulary }: ExplorerLogbookProps) {
  const [tab, setTab] = useState<TabId>('collection');

  const handleClose = () => {
    stopSpeaking();
    onClose();
  };

  const praiseBadge = (id: JungleExplorerBadgeId) => {
    stopSpeaking();
    void speak(`${jungleExploreCopy.badgeFoundAt[id]} ${jungleExploreCopy.badgePraise[id]}`);
  };

  const speakTool = (id: JungleExplorerToolId) => {
    stopSpeaking();
    void speak(jungleExploreCopy.toolLine[id]);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="logbook"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/45 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          aria-modal
          role="dialog"
          aria-labelledby="logbook-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="panel w-full max-w-lg max-h-[85vh] overflow-hidden shadow-nexus-md border border-dm-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-dm-border px-4 py-3 bg-surface-secondary/80">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="h-5 w-5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                <h2 id="logbook-title" className={cn(TYPOGRAPHY.sectionTitle, 'text-lg truncate')}>
                  Explorer Logbook
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 rounded-lg border border-dm-border p-2 text-content-muted hover:bg-surface-secondary hover:text-content"
                aria-label="Close logbook"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="flex border-b border-dm-border px-2 pt-2 gap-1 bg-surface">
              {(
                [
                  { id: 'collection' as const, label: 'My Collection' },
                  { id: 'notes' as const, label: "Explorer's Notes" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    TYPOGRAPHY.control,
                    'flex-1 rounded-t-lg px-2 py-2 text-sm border-b-2 -mb-px transition-colors',
                    tab === t.id
                      ? 'border-primary text-primary bg-surface'
                      : 'border-transparent text-content-muted hover:text-content'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto p-4 space-y-4 flex-1 min-h-0 bg-surface">
              {tab === 'collection' && (
                <div className="space-y-6">
                  <div>
                    <p className={cn(TYPOGRAPHY.caption, 'text-content-muted mb-2')}>Badges</p>
                    <div className="grid grid-cols-2 gap-3">
                      {BADGE_ORDER.map((id) => {
                        const earned = explorer.badges.includes(id);
                        const src = adventureAssets.badge[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={!earned}
                            onClick={() => earned && praiseBadge(id)}
                            className={cn(
                              'rounded-xl border-2 p-3 text-center transition-all bg-transparent',
                              earned
                                ? 'border-primary/45 hover:border-primary/65 hover:bg-primary/[0.06]'
                                : 'border-dm-border opacity-45 cursor-not-allowed'
                            )}
                          >
                            <div className="relative mx-auto aspect-square w-20 mb-2 bg-transparent">
                              <Image
                                src={src}
                                alt=""
                                fill
                                className="object-contain drop-shadow-sm"
                                sizes="80px"
                              />
                            </div>
                            <p className={cn(TYPOGRAPHY.label, 'capitalize text-xs')}>{id}</p>
                            {!earned ? (
                              <p className={cn(TYPOGRAPHY.caption, 'text-content-muted mt-1')}>Locked</p>
                            ) : (
                              <p className={cn(TYPOGRAPHY.caption, 'text-primary mt-1')}>Tap — Milo remembers</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className={cn(TYPOGRAPHY.caption, 'text-content-muted mb-2')}>Treasures</p>
                    <div className="grid grid-cols-2 gap-4">
                      {(['binoculars', 'compass'] as const).map((toolId) => {
                        const unlocked = explorer.toolsUnlocked.includes(toolId);
                        return (
                          <button
                            key={toolId}
                            type="button"
                            disabled={!unlocked}
                            onClick={() => unlocked && speakTool(toolId)}
                            className={cn(
                              'rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all',
                              unlocked
                                ? 'border-secondary/40 bg-secondary/[0.08] hover:border-secondary/55'
                                : 'border-dm-border opacity-45 cursor-not-allowed'
                            )}
                          >
                            {toolId === 'binoculars' ? (
                              <Binoculars className="h-12 w-12 text-secondary" strokeWidth={1.75} aria-hidden />
                            ) : (
                              <Compass className="h-12 w-12 text-secondary" strokeWidth={1.75} aria-hidden />
                            )}
                            <span className={cn(TYPOGRAPHY.label, 'capitalize')}>{toolId}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className={cn(TYPOGRAPHY.caption, 'text-content-muted')}>
                    Tap a badge or tool. Milo tells you where you found it and what it does.
                  </p>
                </div>
              )}

              {tab === 'notes' && (
                <ul className="space-y-3">
                  {vocabulary.map((word) => {
                    const key = word.toLowerCase();
                    const stars = explorer.wordMastery[key] ?? 1;
                    const img = `/images/jungle/animals/${key}.png`;
                    return (
                      <li
                        key={word}
                        className="flex items-center gap-3 rounded-xl border border-dm-border px-3 py-2 bg-surface-secondary/60"
                      >
                        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-dm-border bg-surface">
                          <Image src={img} alt="" fill className="object-contain p-0.5" sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={cn(TYPOGRAPHY.body, 'capitalize font-medium block')}>{word}</span>
                          <p className={cn(TYPOGRAPHY.caption, 'text-content-muted')}>Practice more to fill the stars</p>
                        </div>
                        <StarDisplay stars={Math.min(stars, 5)} maxStars={5} size="sm" />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
