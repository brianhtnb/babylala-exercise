'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Lock, Map } from 'lucide-react';
import { ExplorerLogbook } from '@/app/components/jungle/ExplorerLogbook';
import { speak, stopSpeaking, playEffect } from '@/lib/audio';
import { loadProgress, saveProgress } from '@/lib/storage';
import {
  syncJungleExplorerProgress,
  getJungleExplorerOrDefault,
  isJungleRegionOnOrBeforeJourney,
} from '@/lib/jungle-explorer';
import { adventureAssets } from '@/topics/jungle/adventure/assets';
import { JUNGLE_ADVENTURE_REGIONS } from '@/topics/jungle/adventure/regions';
import { jungleExploreCopy } from '@/topics/jungle/adventure/copy';
import { getTopicById } from '@/topics';
import type { GameProgress, JungleExplorerProgress, JungleRegionId } from '@/types';
import { TYPOGRAPHY, SETTLE_IN } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

export default function JungleExplorePageClient() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const topicId = params.id as string;

  const [explorer, setExplorer] = useState<JungleExplorerProgress | null>(null);
  const [jungleGames, setJungleGames] = useState<Record<string, GameProgress>>({});
  const [logbookOpen, setLogbookOpen] = useState(false);

  const topic = topicId === 'jungle' ? getTopicById('jungle') : undefined;

  useLayoutEffect(() => {
    if (topicId !== 'jungle') return;
    const raw = loadProgress();
    const synced = syncJungleExplorerProgress(raw);
    saveProgress(synced);
    setExplorer(getJungleExplorerOrDefault(synced));
    setJungleGames(synced.topics.jungle?.games ?? {});
  }, [pathname, topicId]);

  useEffect(() => {
    stopSpeaking();
    void speak(jungleExploreCopy.mapWelcome);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (topicId !== 'jungle' || !topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app gap-4 p-6">
        <p className={TYPOGRAPHY.pageTitle}>Explorer map is only for the Jungle topic.</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className={cn(TYPOGRAPHY.control, 'rounded-xl bg-primary px-5 py-2.5 text-white shadow-nexus-sm')}
        >
          Home
        </button>
      </div>
    );
  }

  if (!explorer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <p className={TYPOGRAPHY.body}>Loading…</p>
      </div>
    );
  }

  const goRegion = async (regionId: JungleRegionId) => {
    if (!isJungleRegionOnOrBeforeJourney(jungleGames, regionId)) {
      void speak(jungleExploreCopy.regionLocked);
      return;
    }
    const region = JUNGLE_ADVENTURE_REGIONS.find((r) => r.id === regionId);
    if (!region) return;
    await playEffect('click');
    router.push(`/topic/jungle/exercise/${region.exerciseId}`);
  };

  const miloStop = JUNGLE_ADVENTURE_REGIONS.find((r) => r.id === explorer.currentRegion);

  return (
    <div className="min-h-screen min-h-dvh bg-app bg-gradient-to-b from-success/15 via-surface-secondary/35 to-primary/12 dark:from-success/14 dark:via-surface-secondary/25 dark:to-primary/18">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push(`/topic/${topicId}`)}
              aria-label="Back to games"
              className="w-9 h-9 rounded-lg bg-surface-secondary border border-dm-border flex items-center justify-center text-content-muted hover:text-content hover:border-primary/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={cn(TYPOGRAPHY.label, 'text-content-muted')}>Games list</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void speak(jungleExploreCopy.logbookOpen);
                setLogbookOpen(true);
              }}
              className={cn(
                TYPOGRAPHY.control,
                'inline-flex items-center gap-2 rounded-xl border-2 border-primary/35 bg-primary/10 px-4 py-2 text-primary shadow-nexus-sm hover:bg-primary/[0.14]'
              )}
            >
              <BookOpen className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Logbook
            </button>
          </div>
        </div>

        <motion.div {...SETTLE_IN} className="text-center mb-2 md:mb-3 shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/45 bg-success/15 px-3 py-1 mb-1.5 shadow-nexus-sm">
            <Map className="h-4 w-4 text-success" strokeWidth={2} aria-hidden />
            <span className={cn(TYPOGRAPHY.label, 'text-success text-xs font-semibold')}>Jungle Explorer</span>
          </div>
          <h1 className={cn(TYPOGRAPHY.pageTitle, 'text-2xl md:text-3xl text-content')}>{topic.title}</h1>
          <p className={cn(TYPOGRAPHY.caption, 'text-content-secondary max-w-md mx-auto mt-0.5')}>
            Tap the glowing stop to play. Milo stands at your current step — tap him for tips.
          </p>
        </motion.div>

        <div className="w-full">
          <div className="rounded-2xl border-2 border-success/35 dark:border-success/45 shadow-nexus-md bg-surface overflow-hidden ring-1 ring-content/5 dark:ring-white/10">
            <div className="overflow-x-auto overflow-y-hidden overscroll-x-contain">
              <div className="relative mx-auto aspect-[2400/800] h-[min(72vh,760px)] min-h-[280px] w-auto shrink-0">
                <Image
                  src={adventureAssets.map}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:768px) 1200px, min(2200px, 95vw)"
                  priority
                  aria-hidden
                />
              {JUNGLE_ADVENTURE_REGIONS.map((r) => {
                const isPlayable = isJungleRegionOnOrBeforeJourney(jungleGames, r.id);
                const isCurrentStop = explorer.currentRegion === r.id;
                const thumb = adventureAssets.regionThumb[r.id];
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => void goRegion(r.id)}
                    className={cn(
                      'absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-transform',
                      isPlayable ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-80'
                    )}
                    style={{ left: `${r.leftPct}%`, top: `${r.topPct}%` }}
                    aria-label={`${r.title}${isPlayable ? '' : ', locked'}`}
                  >
                    <span
                      className={cn(
                        'relative flex h-[4.25rem] w-[4.25rem] sm:h-20 sm:w-20 md:h-[5.25rem] md:w-[5.25rem] items-center justify-center rounded-2xl border-[3px] shadow-nexus-md overflow-hidden bg-transparent',
                        !isPlayable
                          ? 'border-dm-border drop-shadow-md'
                          : isCurrentStop
                            ? 'border-primary ring-4 ring-primary/30 drop-shadow-lg'
                            : 'border-success/45 ring-2 ring-success/15 drop-shadow-md'
                      )}
                    >
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        className="object-contain p-0.5 drop-shadow-sm"
                        sizes="(max-width:768px) 96px, 120px"
                      />
                      {!isPlayable ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                          <Lock className="h-7 w-7 text-white drop-shadow-md" strokeWidth={2} aria-hidden />
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        TYPOGRAPHY.label,
                        'max-w-[6rem] text-center text-[10px] md:text-xs leading-tight px-2 py-0.5 rounded-full font-semibold shadow-nexus-sm',
                        !isPlayable
                          ? 'bg-content/55 text-app/90 border border-transparent'
                          : isCurrentStop
                            ? 'bg-content text-app border border-content/20'
                            : 'bg-success/20 text-content border border-success/35'
                      )}
                    >
                      {r.shortLabel}
                    </span>
                  </button>
                );
              })}
              {miloStop ? (
                  <button
                    type="button"
                    className="absolute z-30 w-[4.75rem] h-[4.75rem] sm:w-[5.25rem] sm:h-[5.25rem] md:w-24 md:h-24 -translate-x-1/2 -translate-y-[92%] drop-shadow-lg hover:scale-105 transition-transform"
                    style={{ left: `${miloStop.miloLeftPct}%`, top: `${miloStop.miloTopPct}%` }}
                    onClick={() => void speak(jungleExploreCopy.mapWelcome)}
                    aria-label="Hear Milo explain the map again"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={adventureAssets.milo.talk}
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="96px"
                      />
                    </div>
                  </button>
              ) : null}
              </div>
            </div>
          </div>
        </div>

      </main>

      <ExplorerLogbook
        open={logbookOpen}
        onClose={() => setLogbookOpen(false)}
        explorer={explorer}
        vocabulary={topic.vocabulary}
      />
    </div>
  );
}
