'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mic, PlayCircle, Square, Volume2, X } from 'lucide-react';
import { speak, stopSpeaking } from '@/lib/audio';
import { speakingPresentationScenarios } from '@/topics/jungle/games/speaking-presentation';
import { FADE_IN, TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface SpeakingPresentationGameProps {
  onComplete: (score: number) => void;
}

function getRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return undefined;
}

export function SpeakingPresentationGame({ onComplete }: SpeakingPresentationGameProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [playingAll, setPlayingAll] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [imageLightboxOpen, setImageLightboxOpen] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenario = speakingPresentationScenarios[scenarioIndex];

  const revokeRecordedUrl = useCallback(() => {
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setRecordedBlob(null);
  }, []);

  useEffect(() => {
    stopSpeaking();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    revokeRecordedUrl();
    setRecordError(null);
    setImageLightboxOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioIndex]);

  useEffect(() => {
    if (!imageLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImageLightboxOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [imageLightboxOpen]);

  useEffect(() => {
    if (!imageLightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [imageLightboxOpen]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setRecordedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const playLine = useCallback(
    async (text: string) => {
      if (playingAll || isRecording) return;
      stopSpeaking();
      await speak(text);
    },
    [playingAll, isRecording]
  );

  const playAll = useCallback(async () => {
    if (playingAll || isRecording) return;
    setPlayingAll(true);
    stopSpeaking();
    try {
      for (const line of scenario.lines) {
        await speak(line.speak);
        await new Promise<void>((r) => setTimeout(r, 320));
      }
    } finally {
      setPlayingAll(false);
    }
  }, [scenario.lines, playingAll, isRecording]);

  const startRecording = useCallback(async () => {
    if (playingAll) return;
    try {
      setRecordError(null);
      stopSpeaking();
      setRecordedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setRecordedBlob(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime = getRecorderMimeType();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        setRecordedBlob(blob);
        setRecordedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);
      };
      rec.start(200);
      setIsRecording(true);
    } catch {
      setRecordError('We could not use the microphone. Please check permissions.');
      setIsRecording(false);
    }
  }, [playingAll]);

  const stopRecording = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === 'recording') {
      rec.stop();
    }
  }, []);

  const playRecording = useCallback(() => {
    const el = audioRef.current;
    if (!el || !recordedUrl) return;
    el.pause();
    el.currentTime = 0;
    void el.play();
  }, [recordedUrl]);

  const handleFinish = useCallback(() => {
    stopSpeaking();
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === 'recording') {
      rec.stop();
    }
    setIsRecording(false);
    onComplete(1);
  }, [onComplete]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-wrap gap-2 justify-center" role="tablist" aria-label="Choose a story">
        {speakingPresentationScenarios.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === scenarioIndex}
            onClick={() => setScenarioIndex(i)}
            disabled={playingAll || isRecording}
            className={cn(
              TYPOGRAPHY.control,
              'px-4 py-2 rounded-xl border-2 transition-colors text-sm',
              i === scenarioIndex
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-dm-border bg-surface hover:border-primary/30 text-content'
            )}
          >
            {s.shortTitle}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8 md:items-start">
        <motion.button
          layout
          type="button"
          onClick={() => setImageLightboxOpen(true)}
          className={cn(
            'group relative aspect-[4/3] w-full max-w-xl mx-auto md:mx-0 rounded-2xl overflow-hidden',
            'border border-dm-border shadow-nexus-md bg-surface-secondary text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45',
            'cursor-zoom-in disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-haspopup="dialog"
          aria-expanded={imageLightboxOpen}
          aria-label="View story picture full size"
          disabled={playingAll || isRecording}
        >
          <Image
            src={scenario.image}
            alt={`Jungle picture for ${scenario.shortTitle}`}
            fill
            className="object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 480px"
            priority={scenarioIndex === 0}
          />
        </motion.button>

        <div className="panel p-4 sm:p-5 flex flex-col gap-3 shadow-nexus-sm">
          <div>
            <p className={cn(TYPOGRAPHY.label, 'text-primary mb-1')}>Look and present</p>
            <p className={cn(TYPOGRAPHY.sectionTitle, 'text-lg sm:text-xl')}>
              Tell your jungle story
            </p>
            <p className={cn(TYPOGRAPHY.caption, 'text-content-muted mt-1')}>
              Tap the picture to see it full screen. Tap a line to hear it. Use Play all to hear the
              whole story. Then tap Start to record yourself and listen back.
            </p>
          </div>

          <div className="space-y-2 max-h-[min(52vh,28rem)] overflow-y-auto pr-1">
            {scenario.lines.map((line) => (
              <button
                key={`${scenario.id}-${line.id}`}
                type="button"
                disabled={playingAll || isRecording}
                onClick={() => void playLine(line.speak)}
                className={cn(
                  TYPOGRAPHY.body,
                  'w-full text-left rounded-xl border border-dm-border bg-surface-secondary px-3 py-2.5 sm:px-4 sm:py-3',
                  'hover:border-primary/40 hover:bg-primary/[0.04] transition-colors',
                  'disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45'
                )}
              >
                {line.display}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-dm-border">
            <button
              type="button"
              onClick={() => void playAll()}
              disabled={playingAll || isRecording}
              className={cn(
                TYPOGRAPHY.control,
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary/35 bg-primary/10 text-primary',
                'hover:bg-primary/15 disabled:opacity-50'
              )}
            >
              {playingAll ? (
                <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden />
              ) : (
                <PlayCircle className="w-5 h-5 shrink-0" strokeWidth={2} aria-hidden />
              )}
              {playingAll ? 'Playing…' : 'Play all'}
            </button>

            {!isRecording ? (
              <button
                type="button"
                onClick={() => void startRecording()}
                disabled={playingAll}
                className={cn(
                  TYPOGRAPHY.control,
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-secondary/40 bg-secondary/10 text-secondary',
                  'hover:bg-secondary/15 disabled:opacity-50'
                )}
              >
                <Mic className="w-5 h-5 shrink-0" strokeWidth={2} aria-hidden />
                Start
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className={cn(
                  TYPOGRAPHY.control,
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-danger/40 bg-danger/10 text-danger',
                  'hover:bg-danger/15'
                )}
              >
                <Square className="w-5 h-5 shrink-0 fill-current" strokeWidth={2} aria-hidden />
                Stop
              </button>
            )}

            <button
              type="button"
              onClick={playRecording}
              disabled={!recordedUrl || isRecording || playingAll}
              className={cn(
                TYPOGRAPHY.control,
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dm-border bg-surface',
                'hover:border-primary/35 disabled:opacity-45'
              )}
            >
              <Volume2 className="w-5 h-5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
              Listen to me
            </button>
          </div>

          {recordError ? (
            <p className="text-sm text-danger font-medium" role="alert">
              {recordError}
            </p>
          ) : null}

          {recordedUrl ? (
            <audio ref={audioRef} src={recordedUrl} className="w-full h-10" controls preload="metadata" />
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={handleFinish}
              disabled={playingAll}
              className={cn(
                TYPOGRAPHY.control,
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white shadow-nexus-sm',
                'hover:opacity-95 disabled:opacity-50'
              )}
            >
              Finish presentation
            </button>
            {recordedBlob ? (
              <button
                type="button"
                onClick={revokeRecordedUrl}
                disabled={isRecording || playingAll}
                className={cn(
                  TYPOGRAPHY.control,
                  'px-4 py-2.5 rounded-xl border border-dm-border text-content-muted hover:text-content'
                )}
              >
                Clear recording
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {imageLightboxOpen ? (
          <motion.div
            key="speaking-image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Full size story picture"
            initial={FADE_IN.initial}
            animate={FADE_IN.animate}
            exit={FADE_IN.initial}
            transition={FADE_IN.transition}
            className="fixed inset-0 z-[100]"
          >
            {/* Dim + blur entire viewport (sidebar included on md+) */}
            <div
              className="pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden
            />
            {/* Dismiss target: full screen so blurred sidebar taps still close */}
            <button
              type="button"
              className="absolute inset-0 z-[1]"
              aria-label="Close full screen picture"
              onClick={() => setImageLightboxOpen(false)}
            />
            {/* Picture + close control only in main column (matches AppShell md:pl-64) */}
            <div className="pointer-events-none absolute inset-0 left-0 z-[2] flex flex-col md:left-64">
              <div className="pointer-events-auto flex shrink-0 justify-end p-2 sm:p-3">
                <button
                  type="button"
                  onClick={() => setImageLightboxOpen(false)}
                  className={cn(
                    TYPOGRAPHY.control,
                    'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-dm-border bg-surface text-content shadow-nexus-sm',
                    'hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                  )}
                  aria-label="Close full screen picture"
                >
                  <X className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-6 sm:px-6">
                <div className="pointer-events-auto relative mx-auto h-[min(88dvh,56rem)] w-full max-w-6xl">
                  <Image
                    src={scenario.image}
                    alt={`Jungle picture for ${scenario.shortTitle}`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, calc(100vw - 16rem)"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
