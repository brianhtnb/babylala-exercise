'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardCheck, Headphones, Mic, PenLine, Square, Volume2 } from 'lucide-react';
import { ProgressBar } from '@/app/components/common/ProgressBar';
import { speak, stopSpeaking, playEffect, initAudio } from '@/lib/audio';
import { buildJungleCheckpointSession } from '@/topics/jungle/games/final-checkpoint';
import type {
  CheckpointItem,
  CheckpointListenItem,
  CheckpointReadItem,
  CheckpointSpeakItem,
  CheckpointWriteBuildItem,
  CheckpointWriteExtraItem,
} from '@/types';
import { TYPOGRAPHY } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface FinalCheckpointGameProps {
  onComplete: (score: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return undefined;
}

function skillLabel(skill: CheckpointItem['skill']): string {
  switch (skill) {
    case 'listen':
      return 'Listening';
    case 'read':
      return 'Reading';
    case 'write':
      return 'Writing';
    case 'speak':
      return 'Speaking';
    default:
      return '';
  }
}

function skillIcon(skill: CheckpointItem['skill']) {
  switch (skill) {
    case 'listen':
      return Headphones;
    case 'read':
      return ClipboardCheck;
    case 'write':
      return PenLine;
    case 'speak':
      return Mic;
    default:
      return ClipboardCheck;
  }
}

interface WriteTileState {
  char: string;
  isRedundant: boolean;
  found: boolean;
  wrongFlash: boolean;
}

function buildWriteTiles(q: CheckpointWriteExtraItem): WriteTileState[] {
  return q.letters.map((l) => ({ ...l, found: false, wrongFlash: false }));
}

export function FinalCheckpointGame({ onComplete }: FinalCheckpointGameProps) {
  const [items] = useState(() => buildJungleCheckpointSession());
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const item = items[index]!;
  const SkillIcon = skillIcon(item.skill);

  const [listenSelected, setListenSelected] = useState<'a' | 'b' | 'c' | null>(null);
  const [listenWrong, setListenWrong] = useState<'a' | 'b' | 'c' | null>(null);

  const [readSelected, setReadSelected] = useState<string | null>(null);

  const [writeTiles, setWriteTiles] = useState<WriteTileState[]>(() =>
    item.skill === 'write' && item.mode === 'extra-letter' ? buildWriteTiles(item) : []
  );
  const [writeComplete, setWriteComplete] = useState(false);

  const [buildPool, setBuildPool] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [buildPos, setBuildPos] = useState(0);
  const [buildWrongId, setBuildWrongId] = useState<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const readOptions = useMemo(() => {
    if (item.skill !== 'read') return [] as string[];
    const q = item as CheckpointReadItem;
    return shuffle([q.correct, q.wrong]);
  }, [item]);

  const revokeRecordedUrl = useCallback(() => {
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setRecordedBlob(null);
  }, []);

  useEffect(() => {
    const q = items[index]!;
    setListenSelected(null);
    setListenWrong(null);
    setReadSelected(null);
    setWriteComplete(false);
    setTransitioning(false);
    if (q.skill === 'write' && q.mode === 'extra-letter') {
      setWriteTiles(buildWriteTiles(q));
    } else {
      setWriteTiles([]);
    }
    if (q.skill === 'write' && q.mode === 'build-word') {
      setBuildPool(
        q.pool.map((char, i) => ({
          id: i,
          char: char.toLowerCase(),
          used: false,
        }))
      );
      setBuildPos(0);
      setBuildWrongId(null);
    } else {
      setBuildPool([]);
      setBuildPos(0);
      setBuildWrongId(null);
    }
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
  }, [index, items, revokeRecordedUrl]);

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

  useEffect(() => {
    if (transitioning) return;
    stopSpeaking();
    const q = items[index]!;
    if (q.skill === 'listen') {
      void speak(q.question);
    } else if (q.skill === 'read') {
      void speak(`${q.prompt} Look at the picture.`);
    } else if (q.skill === 'write' && q.mode === 'extra-letter') {
      void speak(`Find the extra letter in the word: ${q.word}`);
    } else if (q.skill === 'write' && q.mode === 'build-word') {
      void speak(`Tap the letters in order to spell the word: ${q.target}`);
    } else if (q.skill === 'speak') {
      void speak(`${q.title}. ${q.prompt}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items, transitioning]);

  const advance = useCallback(
    (newScore: number) => {
      setTransitioning(true);
      setTimeout(() => {
        if (index + 1 >= total) {
          onComplete(newScore);
          return;
        }
        setIndex((i) => i + 1);
        setScore(newScore);
        setTransitioning(false);
      }, 450);
    },
    [index, onComplete, total]
  );

  const handleListenPick = useCallback(
    async (choiceId: 'a' | 'b' | 'c') => {
      if (item.skill !== 'listen' || listenSelected !== null || transitioning) return;
      const q = item as CheckpointListenItem;
      const correct = choiceId === q.correctId;
      if (correct) {
        playEffect('correct').catch(() => {});
        setListenSelected(choiceId);
        const newScore = score + 1;
        await new Promise<void>((r) => setTimeout(r, 650));
        advance(newScore);
      } else {
        playEffect('incorrect').catch(() => {});
        setListenWrong(choiceId);
        setTimeout(() => setListenWrong(null), 550);
      }
    },
    [item, listenSelected, transitioning, score, advance]
  );

  const handleReadPick = useCallback(
    async (sentence: string) => {
      if (item.skill !== 'read' || readSelected !== null || transitioning) return;
      const q = item as CheckpointReadItem;
      const correct = sentence === q.correct;
      playEffect(correct ? 'correct' : 'incorrect').catch(() => {});
      setReadSelected(sentence);
      try {
        await speak(q.correct);
      } catch {
        /* ignore */
      }
      await new Promise<void>((r) => setTimeout(r, 400));
      const newScore = correct ? score + 1 : score;
      advance(newScore);
    },
    [item, readSelected, transitioning, score, advance]
  );

  const handleWriteTile = useCallback(
    (tileIndex: number) => {
      if (item.skill !== 'write' || item.mode !== 'extra-letter' || writeComplete || transitioning) return;
      const tile = writeTiles[tileIndex];
      if (tile.found) return;

      if (tile.isRedundant) {
        const newTiles = writeTiles.map((t, i) => (i === tileIndex ? { ...t, found: true } : t));
        setWriteTiles(newTiles);
        const allFound = newTiles.every((t) => !t.isRedundant || t.found);
        if (allFound) {
          setWriteComplete(true);
          playEffect('correct').catch(() => {});
          initAudio();
          const newScore = score + 1;
          setTimeout(() => advance(newScore), 700);
        }
      } else {
        playEffect('incorrect').catch(() => {});
        setWriteTiles((prev) =>
          prev.map((t, i) => (i === tileIndex ? { ...t, wrongFlash: true } : t))
        );
        setTimeout(() => {
          setWriteTiles((prev) => prev.map((t, i) => (i === tileIndex ? { ...t, wrongFlash: false } : t)));
        }, 400);
      }
    },
    [item, writeTiles, writeComplete, transitioning, score, advance]
  );

  const handleBuildTap = useCallback(
    (poolId: number) => {
      if (item.skill !== 'write' || item.mode !== 'build-word' || transitioning) return;
      const q = item as CheckpointWriteBuildItem;
      const target = q.target.toLowerCase();
      const entry = buildPool.find((p) => p.id === poolId);
      if (!entry || entry.used) return;

      const expected = target[buildPos];
      if (entry.char !== expected) {
        playEffect('incorrect').catch(() => {});
        setBuildWrongId(poolId);
        setTimeout(() => setBuildWrongId(null), 450);
        return;
      }

      const nextPool = buildPool.map((p) => (p.id === poolId ? { ...p, used: true } : p));
      setBuildPool(nextPool);
      const nextPos = buildPos + 1;
      setBuildPos(nextPos);

      if (nextPos >= target.length) {
        playEffect('correct').catch(() => {});
        initAudio();
        const newScore = score + 1;
        setTimeout(() => advance(newScore), 650);
      }
    },
    [item, transitioning, buildPool, buildPos, score, advance]
  );

  const startRecording = useCallback(async () => {
    if (item.skill !== 'speak' || transitioning) return;
    try {
      setRecordError(null);
      stopSpeaking();
      revokeRecordedUrl();
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
  }, [item.skill, transitioning, revokeRecordedUrl]);

  const stopRecording = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === 'recording') {
      rec.stop();
    }
  }, []);

  const handleSpeakSubmit = useCallback(async () => {
    if (item.skill !== 'speak' || transitioning) return;
    if (!recordedBlob || recordedBlob.size === 0) {
      setRecordError('Please record your voice first, then tap Submit.');
      return;
    }
    setRecordError(null);
    playEffect('correct').catch(() => {});
    const newScore = score + 1;
    await new Promise<void>((r) => setTimeout(r, 500));
    advance(newScore);
  }, [item.skill, transitioning, recordedBlob, score, advance]);

  const playListenQuestion = useCallback(() => {
    if (item.skill === 'listen') void speak((item as CheckpointListenItem).question);
  }, [item]);

  const playListenScript = useCallback(() => {
    if (item.skill === 'listen') void speak((item as CheckpointListenItem).script);
  }, [item]);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ProgressBar current={index} total={total} />

      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1',
          item.skill === 'listen' && 'border-primary/35 bg-primary/10 text-primary',
          item.skill === 'read' && 'border-info/40 bg-info-light text-info',
          item.skill === 'write' && 'border-secondary/40 bg-secondary/10 text-secondary',
          item.skill === 'speak' && 'border-success/40 bg-success-light text-success'
        )}
      >
        <SkillIcon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        <span className={cn(TYPOGRAPHY.label, 'text-xs')}>{skillLabel(item.skill)}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {item.skill === 'listen' && (
            <ListenPanel
              q={item}
              listenSelected={listenSelected}
              listenWrong={listenWrong}
              transitioning={transitioning}
              onPlayQuestion={playListenQuestion}
              onPlayScript={playListenScript}
              onPick={handleListenPick}
            />
          )}

          {item.skill === 'read' && (
            <ReadPanel
              q={item}
              readOptions={readOptions}
              readSelected={readSelected}
              transitioning={transitioning}
              onPick={handleReadPick}
            />
          )}

          {item.skill === 'write' && item.mode === 'extra-letter' && (
            <WriteExtraPanel q={item} tiles={writeTiles} transitioning={transitioning} onTileTap={handleWriteTile} />
          )}

          {item.skill === 'write' && item.mode === 'build-word' && (
            <WriteBuildPanel
              q={item}
              buildPool={buildPool}
              buildPos={buildPos}
              buildWrongId={buildWrongId}
              transitioning={transitioning}
              onPoolTap={handleBuildTap}
            />
          )}

          {item.skill === 'speak' && (
            <SpeakPanel
              q={item}
              isRecording={isRecording}
              recordedUrl={recordedUrl}
              recordError={recordError}
              transitioning={transitioning}
              onStartRecord={() => void startRecording()}
              onStopRecord={stopRecording}
              onSubmit={() => void handleSpeakSubmit()}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ListenPanel({
  q,
  listenSelected,
  listenWrong,
  transitioning,
  onPlayQuestion,
  onPlayScript,
  onPick,
}: {
  q: CheckpointListenItem;
  listenSelected: 'a' | 'b' | 'c' | null;
  listenWrong: 'a' | 'b' | 'c' | null;
  transitioning: boolean;
  onPlayQuestion: () => void;
  onPlayScript: () => void;
  onPick: (id: 'a' | 'b' | 'c') => void;
}) {
  return (
    <>
      <div className="text-center space-y-2">
        <h2 className={cn(TYPOGRAPHY.sectionTitle, 'text-xl md:text-2xl')}>{q.question}</h2>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onPlayQuestion}
            disabled={transitioning}
            className={cn(TYPOGRAPHY.control, 'inline-flex items-center gap-1.5 rounded-xl border border-dm-border px-3 py-2 text-sm')}
          >
            <Volume2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            Play question
          </button>
          <button
            type="button"
            onClick={onPlayScript}
            disabled={transitioning}
            className={cn(TYPOGRAPHY.control, 'inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary')}
          >
            <Volume2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            Play story
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {q.choices.map((c) => {
          const picked = listenSelected === c.id;
          const wrong = listenWrong === c.id;
          return (
            <button
              key={c.id}
              type="button"
              disabled={listenSelected !== null || transitioning}
              onClick={() => onPick(c.id)}
              className={cn(
                'rounded-xl border-2 overflow-hidden transition-all',
                picked && 'ring-2 ring-success border-success',
                wrong && 'ring-2 ring-danger border-danger animate-pulse',
                !picked && !wrong && 'border-dm-border hover:border-primary/40'
              )}
            >
              <div className="relative aspect-[4/3] w-full bg-surface-secondary">
                <Image src={c.image} alt={c.label} fill className="object-cover object-center" sizes="200px" />
              </div>
              <p className={cn(TYPOGRAPHY.caption, 'p-2 text-center text-xs')}>{c.label}</p>
            </button>
          );
        })}
      </div>
    </>
  );
}

function ReadPanel({
  q,
  readOptions,
  readSelected,
  transitioning,
  onPick,
}: {
  q: CheckpointReadItem;
  readOptions: string[];
  readSelected: string | null;
  transitioning: boolean;
  onPick: (s: string) => void;
}) {
  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-dm-border shadow-nexus-sm">
        <div className="relative aspect-[16/10] w-full max-h-72 mx-auto bg-surface-secondary">
          <Image src={q.image} alt="" fill className="object-contain object-center" sizes="(max-width:768px) 100vw, 640px" />
        </div>
      </div>
      <p className={cn(TYPOGRAPHY.body, 'text-center text-content-secondary')}>{q.prompt}</p>
      <div className="grid gap-3">
        {readOptions.map((sentence) => {
          const selected = readSelected === sentence;
          const isCorrectPick = selected && sentence === q.correct;
          return (
            <button
              key={sentence}
              type="button"
              disabled={readSelected !== null || transitioning}
              onClick={() => onPick(sentence)}
              className={cn(
                TYPOGRAPHY.body,
                'rounded-xl border-2 px-4 py-3 text-left transition-colors',
                isCorrectPick && 'border-success bg-success/15',
                selected && !isCorrectPick && 'border-danger bg-danger/10',
                !selected && 'border-dm-border hover:border-primary/35'
              )}
            >
              {sentence}
            </button>
          );
        })}
      </div>
    </>
  );
}

function WriteExtraPanel({
  q,
  tiles,
  transitioning,
  onTileTap,
}: {
  q: CheckpointWriteExtraItem;
  tiles: WriteTileState[];
  transitioning: boolean;
  onTileTap: (i: number) => void;
}) {
  return (
    <div className="panel p-5 text-center space-y-4">
      <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border border-dm-border bg-surface-secondary shadow-nexus-sm">
        <Image
          src={q.image}
          alt=""
          fill
          className="object-contain object-center p-2"
          sizes="200px"
        />
      </div>
      <p className={cn(TYPOGRAPHY.sectionTitle, 'text-lg')}>
        Find the extra letter in: <span className="text-primary font-bold">{q.word}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {tiles.map((t, i) => (
          <button
            key={`${q.id}-${i}-${t.char}`}
            type="button"
            disabled={t.found || transitioning}
            onClick={() => onTileTap(i)}
            className={cn(
              'min-w-[2.75rem] h-12 rounded-lg border-2 text-lg font-bold transition-all',
              t.found && t.isRedundant && 'bg-success/20 border-success text-success line-through',
              t.found && !t.isRedundant && 'opacity-40 border-dm-border',
              t.wrongFlash && 'border-danger bg-danger/15 animate-pulse',
              !t.found && !t.wrongFlash && 'border-dm-border bg-surface-secondary hover:border-primary/40'
            )}
          >
            {t.char}
          </button>
        ))}
      </div>
    </div>
  );
}

function WriteBuildPanel({
  q,
  buildPool,
  buildPos,
  buildWrongId,
  transitioning,
  onPoolTap,
}: {
  q: CheckpointWriteBuildItem;
  buildPool: { id: number; char: string; used: boolean }[];
  buildPos: number;
  buildWrongId: number | null;
  transitioning: boolean;
  onPoolTap: (id: number) => void;
}) {
  const target = q.target.toLowerCase();
  const letters = target.split('');

  return (
    <div className="panel p-5 space-y-5 text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border border-dm-border bg-surface-secondary shadow-nexus-sm">
        <Image
          src={q.image}
          alt=""
          fill
          className="object-contain object-center p-2"
          sizes="200px"
        />
      </div>
      <p className={cn(TYPOGRAPHY.sectionTitle, 'text-lg')}>Tap the letters in order</p>
      {q.hint ? (
        <p className={cn(TYPOGRAPHY.caption, 'text-content-muted max-w-md mx-auto')}>{q.hint}</p>
      ) : null}

      <div>
        <p className={cn(TYPOGRAPHY.label, 'text-content-muted mb-2')}>Your word</p>
        <div className="flex justify-center gap-1.5 flex-wrap">
          {letters.map((_, i) => (
            <div
              key={`slot-${q.id}-${i}`}
              className={cn(
                'flex h-12 min-w-[2.25rem] items-center justify-center rounded-lg border-2 text-lg font-bold uppercase',
                i < buildPos
                  ? 'border-success/50 bg-success/15 text-success'
                  : 'border-dashed border-primary/40 bg-surface-secondary text-content-muted'
              )}
            >
              {i < buildPos ? letters[i] : '—'}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={cn(TYPOGRAPHY.label, 'text-content-muted mb-2')}>Letter bank</p>
        <div className="flex flex-wrap justify-center gap-2">
          {buildPool.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={p.used || transitioning}
              onClick={() => onPoolTap(p.id)}
              className={cn(
                'min-w-[2.75rem] h-12 rounded-lg border-2 text-lg font-bold uppercase transition-all',
                p.used && 'opacity-35 border-dm-border scale-95',
                buildWrongId === p.id && 'border-danger bg-danger/15 animate-pulse',
                !p.used && buildWrongId !== p.id && 'border-dm-border bg-primary/8 hover:border-primary/45'
              )}
            >
              {p.char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpeakPanel({
  q,
  isRecording,
  recordedUrl,
  recordError,
  transitioning,
  onStartRecord,
  onStopRecord,
  onSubmit,
}: {
  q: CheckpointSpeakItem;
  isRecording: boolean;
  recordedUrl: string | null;
  recordError: string | null;
  transitioning: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onSubmit: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  return (
    <div className="panel p-5 space-y-4">
      <h2 className={cn(TYPOGRAPHY.sectionTitle, 'text-lg text-center')}>{q.title}</h2>
      <p className={cn(TYPOGRAPHY.body, 'text-center text-content-secondary')}>{q.prompt}</p>
      {q.image ? (
        <div className="relative mx-auto max-w-md aspect-[4/3] rounded-xl overflow-hidden border border-dm-border">
          <Image src={q.image} alt="" fill className="object-cover object-center" sizes="400px" />
        </div>
      ) : null}
      <p className={cn(TYPOGRAPHY.caption, 'text-center text-content-muted')}>
        Your teacher or parent can listen later. For now, tap Record, say your sentence, tap Stop, then
        Submit.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {!isRecording ? (
          <button
            type="button"
            onClick={onStartRecord}
            disabled={transitioning}
            className={cn(
              TYPOGRAPHY.control,
              'inline-flex items-center gap-2 rounded-xl border-2 border-secondary/40 bg-secondary/10 px-4 py-2.5 text-secondary'
            )}
          >
            <Mic className="h-5 w-5" strokeWidth={2} aria-hidden />
            Record
          </button>
        ) : (
          <button
            type="button"
            onClick={onStopRecord}
            className={cn(
              TYPOGRAPHY.control,
              'inline-flex items-center gap-2 rounded-xl border-2 border-danger/40 bg-danger/10 px-4 py-2.5 text-danger'
            )}
          >
            <Square className="h-5 w-5 fill-current" strokeWidth={2} aria-hidden />
            Stop
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            const el = audioRef.current;
            if (!el || !recordedUrl) return;
            el.pause();
            el.currentTime = 0;
            void el.play();
          }}
          disabled={!recordedUrl || transitioning}
          className={cn(
            TYPOGRAPHY.control,
            'inline-flex items-center gap-2 rounded-xl border border-dm-border px-4 py-2.5 disabled:opacity-45'
          )}
        >
          <Volume2 className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
          Play back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={transitioning}
          className={cn(
            TYPOGRAPHY.control,
            'inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white shadow-nexus-sm'
          )}
        >
          Submit
        </button>
      </div>
      {recordError ? (
        <p className="text-center text-sm text-danger font-medium" role="alert">
          {recordError}
        </p>
      ) : null}
      {recordedUrl ? <audio ref={audioRef} src={recordedUrl} className="w-full h-10" controls preload="metadata" /> : null}
    </div>
  );
}
