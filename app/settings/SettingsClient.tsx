'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Check, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY, SETTLE_IN, FADE_IN } from '@/lib/design-tokens';
import {
  loadVoicePrefs,
  saveVoicePrefs,
  type VoiceInfo,
  type VoicePrefs,
} from '@/lib/voice-settings';
import { previewVoice, stopSpeaking } from '@/lib/audio';

/* ── Voice Card ─────────────────────────────────────────────── */

interface VoiceCardProps {
  voice: VoiceInfo;
  selected: boolean;
  previewing: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function VoiceCard({ voice, selected, previewing, onSelect, onPreview }: VoiceCardProps) {
  const tags = [voice.description, voice.accent, voice.age].filter(Boolean);

  return (
    <motion.div
      layout
      className={cn(
        'panel p-4 flex flex-col gap-3 cursor-pointer select-none',
        'border transition-colors duration-150',
        selected
          ? 'border-primary/60 bg-primary/5'
          : 'border-dm-border hover:border-primary/30'
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn(TYPOGRAPHY.label, 'text-content text-sm font-semibold truncate')}>
            {voice.displayName}
          </p>
          {tags.length > 0 && (
            <p className="text-xs text-content-muted mt-0.5 capitalize">
              {tags.join(' · ')}
            </p>
          )}
        </div>
        {selected && (
          <span className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold',
            'border transition-colors duration-150',
            previewing
              ? 'bg-primary/15 text-primary border-primary/40'
              : 'bg-surface-secondary text-content-muted border-dm-border hover:text-primary hover:border-primary/40'
          )}
          aria-label={previewing ? 'Stop preview' : `Preview ${voice.displayName}`}
        >
          {previewing ? (
            <>
              <Square className="w-3 h-3" strokeWidth={2} />
              Stop
            </>
          ) : (
            <>
              <Play className="w-3 h-3" strokeWidth={2} />
              Preview
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold',
            'border transition-colors duration-150',
            selected
              ? 'bg-primary text-white border-primary/40'
              : 'bg-surface-secondary text-content-secondary border-dm-border hover:bg-primary/10 hover:text-primary hover:border-primary/30'
          )}
        >
          {selected ? 'Selected' : 'Select'}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Voice Section ───────────────────────────────────────────── */

interface VoiceSectionProps {
  title: string;
  icon: string;
  voices: VoiceInfo[];
  selectedId: string | null;
  previewingId: string | null;
  onSelect: (id: string) => void;
  onPreview: (voice: VoiceInfo) => void;
}

function VoiceSection({
  title,
  icon,
  voices,
  selectedId,
  previewingId,
  onSelect,
  onPreview,
}: VoiceSectionProps) {
  if (voices.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className={cn(TYPOGRAPHY.sectionTitle, 'flex items-center gap-2 mb-4')}>
        <span aria-hidden>{icon}</span>
        {title}
        <span className="text-sm font-normal text-content-muted">({voices.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {voices.map((v) => (
          <VoiceCard
            key={v.id}
            voice={v}
            selected={selectedId === v.id}
            previewing={previewingId === v.id}
            onSelect={() => onSelect(v.id)}
            onPreview={() => onPreview(v)}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Main Settings Client ────────────────────────────────────── */

export function SettingsClient() {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<VoicePrefs>({ voiceId: null, speed: 1.0 });
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  useEffect(() => {
    setPrefs(loadVoicePrefs());

    fetch('/api/voices')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setVoices(data.voices ?? []))
      .catch(() => setFetchError('Could not load voices. Please check your connection.'))
      .finally(() => setLoadingVoices(false));

    return () => stopSpeaking();
  }, []);

  const updatePrefs = useCallback((patch: Partial<VoicePrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      saveVoicePrefs(next);
      return next;
    });
  }, []);

  const handlePreview = useCallback(
    async (voice: VoiceInfo) => {
      if (previewingId === voice.id) {
        stopSpeaking();
        setPreviewingId(null);
        return;
      }
      stopSpeaking();
      setPreviewingId(voice.id);
      try {
        await previewVoice(voice.id, prefs.speed);
      } finally {
        setPreviewingId(null);
      }
    },
    [previewingId, prefs.speed]
  );

  const handleSelect = useCallback(
    (id: string) => {
      updatePrefs({ voiceId: prefs.voiceId === id ? null : id });
    },
    [prefs.voiceId, updatePrefs]
  );

  const femaleVoices = voices.filter((v) => v.gender === 'female');
  const maleVoices = voices.filter((v) => v.gender === 'male');
  const otherVoices = voices.filter((v) => v.gender === 'other');

  return (
    <motion.div
      {...SETTLE_IN}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Page title */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="w-9 h-9 rounded-lg bg-surface-secondary border border-dm-border flex items-center justify-center text-content-muted hover:text-content hover:border-primary/30 transition-colors"
          aria-label="Back to home"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className={cn(TYPOGRAPHY.pageTitle)}>Voice Settings</h1>
          <p className={cn(TYPOGRAPHY.pageSubtitle, 'mt-0.5')}>
            Choose a voice and speaking speed for your lessons.
          </p>
        </div>
      </div>

      {/* Speed section */}
      <motion.section {...FADE_IN} className="panel p-6 mb-8">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className={cn(TYPOGRAPHY.sectionTitle)}>Speaking Speed</h2>
          <span className="text-primary font-semibold text-sm tabular-nums">
            {prefs.speed.toFixed(2)}×
          </span>
        </div>
        <p className="text-sm text-content-muted mb-5">
          Slower speeds can help beginners follow along more easily.
        </p>

        {/* Slider */}
        <div className="space-y-3">
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.05}
            value={prefs.speed}
            onChange={(e) => updatePrefs({ speed: parseFloat(e.target.value) })}
            style={{ '--fill': `${((prefs.speed - 0.5) / 1.5) * 100}%` } as React.CSSProperties}
            className="speed-slider"
            aria-label="Speaking speed"
          />
          {/* Tick labels — positioned to match actual slider stops */}
          <div className="relative h-4 select-none text-xs text-content-muted">
            <span className="absolute left-0">Slow (0.5×)</span>
            <span
              className="absolute -translate-x-1/2"
              style={{ left: `${((1.0 - 0.5) / 1.5) * 100}%` }}
            >
              Normal (1×)
            </span>
            <span className="absolute right-0">Fast (2×)</span>
          </div>
        </div>
      </motion.section>

      {/* Voice list */}
      {loadingVoices ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-content-muted">Loading voices…</p>
        </div>
      ) : fetchError ? (
        <div className="panel p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-danger shrink-0" />
          <p className="text-sm text-content">{fetchError}</p>
        </div>
      ) : (
        <>
          {prefs.voiceId === null && (
            <p className="text-sm text-content-muted mb-6 px-1">
              No voice selected — auto-detected voice will be used.
            </p>
          )}
          <VoiceSection
            title="Female Voices"
            icon="👩‍🏫"
            voices={femaleVoices}
            selectedId={prefs.voiceId}
            previewingId={previewingId}
            onSelect={handleSelect}
            onPreview={handlePreview}
          />
          <VoiceSection
            title="Male Voices"
            icon="👨‍🏫"
            voices={maleVoices}
            selectedId={prefs.voiceId}
            previewingId={previewingId}
            onSelect={handleSelect}
            onPreview={handlePreview}
          />
          <VoiceSection
            title="Other Voices"
            icon="🎙"
            voices={otherVoices}
            selectedId={prefs.voiceId}
            previewingId={previewingId}
            onSelect={handleSelect}
            onPreview={handlePreview}
          />
        </>
      )}
    </motion.div>
  );
}
