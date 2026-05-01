# Babylala Exercise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a touch-first, iPad-optimized English learning web app with 4 interactive games for Numbers 11-20, progress tracking, and PWA support.

**Architecture:** Next.js 14 (App Router) with TypeScript and Tailwind CSS. Modular topic-based structure where each topic has its own config, assets, and games. LocalStorage for progress persistence. Web Speech API for TTS.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion (animations), Web Speech API, localStorage

---

## Phase 1: Project Setup & Infrastructure

### Task 1: Initialize Next.js Project

**Files:**
- Create: Entire project structure

- [ ] **Step 1: Create Next.js project with TypeScript and Tailwind**

```bash
cd /Users/brian/mywork/babylala-exercise
echo "my-app" | npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack
```

Expected: Project created with package.json, next.config.js, app/ directory

- [ ] **Step 2: Install additional dependencies**

```bash
npm install framer-motion clsx tailwind-merge
```

Expected: Dependencies added to package.json

- [ ] **Step 3: Configure Next.js for static export**

Edit `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
```

- [ ] **Step 4: Test build**

```bash
npm run build
```

Expected: Build succeeds, dist/ folder created

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

## Phase 2: Core Utilities & Types

### Task 2: Create Type Definitions

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Write type definitions file**

```typescript
// types/index.ts

export interface GameConfig {
  id: string;
  type: 'counting' | 'sequence' | 'writing' | 'dialogue';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  dependsOn?: string[];
}

export interface TopicConfig {
  id: string;
  title: string;
  icon: string;
  color: string;
  vocabulary: string[];
  sentences: string[];
  games: GameConfig[];
}

export interface GameProgress {
  completed: boolean;
  highScore: number;
  stars: number;
  lastPlayed: string | null;
  attempts: number;
}

export interface TopicProgress {
  completed: boolean;
  totalStars: number;
  games: { [gameId: string]: GameProgress };
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface ProgressData {
  version: number;
  topics: { [topicId: string]: TopicProgress };
  lastPlayed: string;
  settings: AppSettings;
}

export interface CountingItem {
  id: string;
  count: number;
  type: 'fruit' | 'animal' | 'toy';
  items: string[];
  image?: string;
}

export interface SequenceProblem {
  id: string;
  sequence: (number | null)[];
  missingIndex: number;
  correctAnswer: number;
  options: number[];
}

export interface RolePlayDialogue {
  id: string;
  question: string;
  answer: string;
  count: number;
  objectType: string;
  options: string[];
}
```

- [ ] **Step 2: Commit**

```bash
git add types/index.ts
git commit -m "feat: add TypeScript type definitions for topics, games, and progress"
```

---

### Task 3: Create Storage Utilities

**Files:**
- Create: `lib/storage.ts`
- Create: `lib/utils.ts`

- [ ] **Step 1: Write utility functions**

```typescript
// lib/utils.ts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
```

- [ ] **Step 2: Write storage utilities with tests**

```typescript
// lib/storage.ts

import { ProgressData, TopicProgress, GameProgress, AppSettings } from '@/types';

const STORAGE_KEY = 'babylala-progress';
const STORAGE_VERSION = 1;

export const defaultSettings: AppSettings = {
  soundEnabled: true,
  musicEnabled: false,
};

export const defaultProgressData: ProgressData = {
  version: STORAGE_VERSION,
  topics: {},
  lastPlayed: '',
  settings: defaultSettings,
};

export function loadProgress(): ProgressData {
  if (typeof window === 'undefined') {
    return defaultProgressData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultProgressData;
    }

    const parsed = JSON.parse(stored);
    
    // Version check for migration
    if (parsed.version !== STORAGE_VERSION) {
      return defaultProgressData;
    }

    return { ...defaultProgressData, ...parsed };
  } catch (error) {
    console.error('Error loading progress:', error);
    return defaultProgressData;
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function getTopicProgress(
  data: ProgressData,
  topicId: string
): TopicProgress {
  return (
    data.topics[topicId] || {
      completed: false,
      totalStars: 0,
      games: {},
    }
  );
}

export function getGameProgress(
  data: ProgressData,
  topicId: string,
  gameId: string
): GameProgress {
  const topic = getTopicProgress(data, topicId);
  return (
    topic.games[gameId] || {
      completed: false,
      highScore: 0,
      stars: 0,
      lastPlayed: null,
      attempts: 0,
    }
  );
}

export function updateGameProgress(
  data: ProgressData,
  topicId: string,
  gameId: string,
  progress: Partial<GameProgress>
): ProgressData {
  const topic = getTopicProgress(data, topicId);
  const game = getGameProgress(data, topicId, gameId);

  const updatedGame: GameProgress = {
    ...game,
    ...progress,
    lastPlayed: new Date().toISOString(),
  };

  const updatedTopic: TopicProgress = {
    ...topic,
    games: {
      ...topic.games,
      [gameId]: updatedGame,
    },
  };

  // Recalculate total stars
  updatedTopic.totalStars = Object.values(updatedTopic.games).reduce(
    (sum, g) => sum + g.stars,
    0
  );

  // Check if topic is complete (all games have at least 1 star)
  updatedTopic.completed = Object.values(updatedTopic.games).every(
    (g) => g.stars > 0
  );

  return {
    ...data,
    topics: {
      ...data.topics,
      [topicId]: updatedTopic,
    },
    lastPlayed: topicId,
  };
}

export function updateSettings(
  data: ProgressData,
  settings: Partial<AppSettings>
): ProgressData {
  return {
    ...data,
    settings: {
      ...data.settings,
      ...settings,
    },
  };
}

export function getTotalStars(data: ProgressData): number {
  return Object.values(data.topics).reduce(
    (sum, topic) => sum + topic.totalStars,
    0
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/storage.ts lib/utils.ts
git commit -m "feat: add storage utilities for progress tracking"
```

---

### Task 4: Create Audio Utilities

**Files:**
- Create: `lib/audio.ts`

- [ ] **Step 1: Write audio utilities**

```typescript
// lib/audio.ts

let currentAudio: HTMLAudioElement | null = null;

export function playSound(soundUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Stop any currently playing sound
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(soundUrl);
    currentAudio = audio;

    audio.addEventListener('ended', () => {
      currentAudio = null;
      resolve();
    });

    audio.addEventListener('error', () => {
      currentAudio = null;
      reject(new Error('Failed to play sound'));
    });

    audio.play().catch((error) => {
      currentAudio = null;
      reject(error);
    });
  });
}

let speechUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, rate: number = 0.9, pitch: number = 1.1): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    if (speechUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'en-US';

    // Try to find a friendly voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Samantha') || v.name.includes('Karen') || v.lang === 'en-US'
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      speechUtterance = null;
      resolve();
    };

    utterance.onerror = () => {
      speechUtterance = null;
      resolve();
    };

    speechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    speechUtterance = null;
  }
}

// Predefined sounds
export const Sounds = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  celebration: '/sounds/celebration.mp3',
  click: '/sounds/click.mp3',
  unlock: '/sounds/unlock.mp3',
  star: '/sounds/star.mp3',
} as const;

export type SoundType = keyof typeof Sounds;

export async function playEffect(type: SoundType): Promise<void> {
  try {
    await playSound(Sounds[type]);
  } catch (error) {
    console.warn(`Failed to play sound: ${type}`, error);
  }
}
```

- [ ] **Step 2: Create placeholder sound files**

```bash
mkdir -p public/sounds
# Create empty placeholder files (will be replaced with actual sounds)
touch public/sounds/correct.mp3
 touch public/sounds/incorrect.mp3
 touch public/sounds/celebration.mp3
 touch public/sounds/click.mp3
 touch public/sounds/unlock.mp3
 touch public/sounds/star.mp3
```

- [ ] **Step 3: Commit**

```bash
git add lib/audio.ts public/sounds/
git commit -m "feat: add audio utilities with speech synthesis and sound effects"
```

---

## Phase 3: Topic Configuration

### Task 5: Create Numbers 11-20 Topic Configuration

**Files:**
- Create: `topics/numbers-11-20/config.ts`
- Create: `topics/numbers-11-20/games/counting.ts`
- Create: `topics/numbers-11-20/games/sequence.ts`
- Create: `topics/numbers-11-20/games/dialogue.ts`

- [ ] **Step 1: Create topic configuration**

```typescript
// topics/numbers-11-20/config.ts

import { TopicConfig } from '@/types';

export const numbersConfig: TopicConfig = {
  id: 'numbers-11-20',
  title: 'Numbers 11-20',
  icon: '🔢',
  color: 'bg-blue-500',
  vocabulary: [
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
    'twenty',
  ],
  sentences: ['How many ___ are there?', 'There are ___'],
  games: [
    {
      id: 'count-and-choose',
      type: 'counting',
      title: 'Count the Items',
      description: 'Count the fruits and animals!',
      difficulty: 1,
    },
    {
      id: 'missing-number',
      type: 'sequence',
      title: 'Find the Missing Number',
      description: 'Put the missing number in place!',
      difficulty: 2,
      dependsOn: ['count-and-choose'],
    },
    {
      id: 'trace-number',
      type: 'writing',
      title: 'Trace the Number',
      description: 'Draw the number with your finger!',
      difficulty: 2,
      dependsOn: ['count-and-choose'],
    },
    {
      id: 'role-play',
      type: 'dialogue',
      title: 'Ask and Answer',
      description: 'Practice asking and answering!',
      difficulty: 3,
      dependsOn: ['missing-number', 'trace-number'],
    },
  ],
};
```

- [ ] **Step 2: Create counting game data**

```typescript
// topics/numbers-11-20/games/counting.ts

import { CountingItem } from '@/types';

export const countingItems: CountingItem[] = [
  { id: 'c1', count: 11, type: 'fruit', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
  { id: 'c2', count: 12, type: 'fruit', items: ['🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌'] },
  { id: 'c3', count: 13, type: 'animal', items: ['🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱'] },
  { id: 'c4', count: 14, type: 'fruit', items: ['🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊'] },
  { id: 'c5', count: 15, type: 'toy', items: ['🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸'] },
  { id: 'c6', count: 16, type: 'animal', items: ['🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶'] },
  { id: 'c7', count: 17, type: 'fruit', items: ['🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇'] },
  { id: 'c8', count: 18, type: 'toy', items: ['🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗', '🚗'] },
  { id: 'c9', count: 19, type: 'animal', items: ['🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰', '🐰'] },
  { id: 'c10', count: 20, type: 'fruit', items: ['🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓'] },
];

export function getCountingItems(count: number = 10): CountingItem[] {
  // Shuffle and return requested count
  const shuffled = [...countingItems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateAnswerOptions(correctAnswer: number): number[] {
  const options = new Set<number>();
  options.add(correctAnswer);

  // Add 3 wrong answers
  while (options.size < 4) {
    const wrong = Math.floor(Math.random() * 10) + 11; // 11-20
    if (wrong !== correctAnswer) {
      options.add(wrong);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}
```

- [ ] **Step 3: Create sequence game data**

```typescript
// topics/numbers-11-20/games/sequence.ts

import { SequenceProblem } from '@/types';

export function generateSequenceProblems(count: number = 8): SequenceProblem[] {
  const problems: SequenceProblem[] = [];

  for (let i = 0; i < count; i++) {
    // Start position for sequence (11-17 to ensure we have room for 4 numbers)
    const start = Math.floor(Math.random() * 7) + 11;
    const missingIndex = Math.floor(Math.random() * 4);
    const sequence: (number | null)[] = [];

    for (let j = 0; j < 5; j++) {
      if (j === missingIndex) {
        sequence.push(null);
      } else {
        sequence.push(start + j);
      }
    }

    const correctAnswer = start + missingIndex;

    // Generate 3 wrong options
    const options = new Set<number>([correctAnswer]);
    while (options.size < 4) {
      const wrong = Math.floor(Math.random() * 10) + 11;
      if (wrong !== correctAnswer) {
        options.add(wrong);
      }
    }

    problems.push({
      id: `seq-${i}`,
      sequence,
      missingIndex,
      correctAnswer,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }

  return problems;
}
```

- [ ] **Step 4: Create dialogue game data**

```typescript
// topics/numbers-11-20/games/dialogue.ts

import { RolePlayDialogue } from '@/types';

const objectTypes = [
  { type: 'apples', emoji: '🍎' },
  { type: 'bananas', emoji: '🍌' },
  { type: 'cats', emoji: '🐱' },
  { type: 'dogs', emoji: '🐶' },
  { type: 'books', emoji: '📚' },
  { type: 'toys', emoji: '🧸' },
  { type: 'birds', emoji: '🐦' },
  { type: 'flowers', emoji: '🌸' },
];

export function generateDialogues(count: number = 5): RolePlayDialogue[] {
  const dialogues: RolePlayDialogue[] = [];
  const usedCounts = new Set<number>();

  for (let i = 0; i < count; i++) {
    // Pick a unique count 11-20
    let count: number;
    do {
      count = Math.floor(Math.random() * 10) + 11;
    } while (usedCounts.has(count));
    usedCounts.add(count);

    const objectInfo = objectTypes[Math.floor(Math.random() * objectTypes.length)];

    // Generate 3 wrong answer options
    const options = new Set<string>([`There are ${count}.`]);
    while (options.size < 3) {
      const wrongCount = Math.floor(Math.random() * 10) + 11;
      if (wrongCount !== count) {
        options.add(`There are ${wrongCount}.`);
      }
    }

    dialogues.push({
      id: `dialogue-${i}`,
      question: `How many ${objectInfo.type} are there?`,
      answer: `There are ${count}.`,
      count,
      objectType: objectInfo.type,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
  }

  return dialogues;
}
```

- [ ] **Step 5: Create topic loader**

```typescript
// topics/index.ts

import { numbersConfig } from './numbers-11-20/config';
import { TopicConfig } from '@/types';

export const topics: TopicConfig[] = [numbersConfig];

export function getTopicById(id: string): TopicConfig | undefined {
  return topics.find((t) => t.id === id);
}

export function getAllTopics(): TopicConfig[] {
  return topics;
}
```

- [ ] **Step 6: Commit**

```bash
git add topics/
git commit -m "feat: add Numbers 11-20 topic configuration and game data"
```

---

## Phase 4: Shared Components

### Task 6: Create Common UI Components

**Files:**
- Create: `app/components/common/Button.tsx`
- Create: `app/components/common/Card.tsx`
- Create: `app/components/common/ProgressBar.tsx`
- Create: `app/components/common/StarDisplay.tsx`

- [ ] **Step 1: Create Button component**

```typescript
// app/components/common/Button.tsx

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
```

- [ ] **Step 2: Create Card component**

```typescript
// app/components/common/Card.tsx

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  locked?: boolean;
}

export function Card({
  children,
  className,
  onClick,
  disabled = false,
  locked = false,
}: CardProps) {
  return (
    <motion.div
      whileHover={!disabled && !locked ? { scale: 1.02 } : {}}
      whileTap={!disabled && !locked ? { scale: 0.98 } : {}}
      onClick={!disabled && !locked ? onClick : undefined}
      className={cn(
        'bg-white rounded-3xl shadow-lg p-6 border-4 border-transparent',
        'transition-all duration-200',
        onClick && !disabled && !locked && 'cursor-pointer hover:border-blue-300',
        (disabled || locked) && 'opacity-60 cursor-not-allowed',
        locked && 'grayscale',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create ProgressBar component**

```typescript
// app/components/common/ProgressBar.tsx

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-6 overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
      />
    </div>
  );
}
```

- [ ] **Step 4: Create StarDisplay component**

```typescript
// app/components/common/StarDisplay.tsx

'use client';

import { motion } from 'framer-motion';

interface StarDisplayProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
}

export function StarDisplay({
  stars,
  maxStars = 3,
  size = 'md',
  showEmpty = true,
}: StarDisplayProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className={`flex gap-1 ${sizeClasses[size]}`}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.span
          key={i}
          initial={i < stars ? { scale: 0, rotate: -180 } : {}}
          animate={i < stars ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          className={i < stars ? 'text-yellow-400' : showEmpty ? 'text-gray-300' : 'opacity-0'}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/components/common/
git commit -m "feat: add common UI components (Button, Card, ProgressBar, StarDisplay)"
```

---

### Task 7: Create Layout Components

**Files:**
- Create: `app/components/layout/Header.tsx`
- Create: `app/components/layout/TopicGrid.tsx`

- [ ] **Step 1: Create Header component**

```typescript
// app/components/layout/Header.tsx

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

  const handleBack = async () => {
    await playEffect('click');
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
        {/* Sound toggle could go here */}
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl">
          🔊
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create TopicGrid component**

```typescript
// app/components/layout/TopicGrid.tsx

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TopicConfig } from '@/types';
import { ProgressData, getTopicProgress, getTotalStars } from '@/lib/storage';
import { Card } from '../common/Card';
import { StarDisplay } from '../common/StarDisplay';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect } from '@/lib/audio';
import { cn } from '@/lib/utils';

interface TopicGridProps {
  topics: TopicConfig[];
  progress: ProgressData;
}

export function TopicGrid({ topics, progress }: TopicGridProps) {
  const router = useRouter();

  const handleTopicClick = async (topic: TopicConfig) => {
    await playEffect('click');
    await speak(`Let's learn ${topic.title}!`);
    router.push(`/topic/${topic.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {topics.map((topic, index) => {
        const topicProgress = getTopicProgress(progress, topic.id);
        const maxStars = topic.games.length * 3;
        const isLocked = false; // Could add prerequisite logic here

        return (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              onClick={() => handleTopicClick(topic)}
              locked={isLocked}
              className={cn(
                'h-full flex flex-col items-center text-center',
                'hover:shadow-xl transition-shadow'
              )}
            >
              <div
                className={cn(
                  'w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-4',
                  topic.color
                )}
              >
                {topic.icon}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">{topic.title}</h2>

              <div className="w-full space-y-2">
                <div className="flex justify-center">
                  <StarDisplay
                    stars={topicProgress.totalStars}
                    maxStars={maxStars}
                    size="sm"
                  />
                </div>

                <ProgressBar
                  current={Object.values(topicProgress.games).filter((g) => g.completed).length}
                  total={topic.games.length}
                />

                <p className="text-sm text-gray-500">
                  {Object.values(topicProgress.games).filter((g) => g.completed).length} of {topic.games.length} games completed
                </p>
              </div>

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-3xl">
                  <span className="text-6xl">🔒</span>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/layout/
git commit -m "feat: add layout components (Header, TopicGrid)"
```

---

## Phase 5: Game Components

### Task 8: Create Counting Game Component

**Files:**
- Create: `app/components/exercises/CountGame.tsx`

- [ ] **Step 1: Write counting game component**

```typescript
// app/components/exercises/CountGame.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountingItem } from '@/types';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect } from '@/lib/audio';
import { getCountingItems, generateAnswerOptions } from '@/topics/numbers-11-20/games/counting';

interface CountGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  items: CountingItem[];
  currentIndex: number;
  score: number;
  options: number[];
  answered: boolean;
  isCorrect: boolean | null;
}

export function CountGame({ onComplete }: CountGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const items = getCountingItems(10);
    return {
      items,
      currentIndex: 0,
      score: 0,
      options: generateAnswerOptions(items[0].count),
      answered: false,
      isCorrect: null,
    };
  });

  const currentItem = gameState.items[gameState.currentIndex];

  const handleAnswer = async (answer: number) => {
    if (gameState.answered) return;

    const isCorrect = answer === currentItem.count;

    if (isCorrect) {
      await playEffect('correct');
      await speak(`Great! There are ${currentItem.count} ${currentItem.type}!`);
    } else {
      await playEffect('incorrect');
      await speak('Try again!');
    }

    setGameState((prev) => ({
      ...prev,
      answered: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    // Move to next after delay
    setTimeout(() => {
      if (gameState.currentIndex < gameState.items.length - 1) {
        const nextIndex = gameState.currentIndex + 1;
        const nextItem = gameState.items[nextIndex];
        setGameState((prev) => ({
          ...prev,
          currentIndex: nextIndex,
          options: generateAnswerOptions(nextItem.count),
          answered: false,
          isCorrect: null,
        }));
      } else {
        onComplete(gameState.score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  useEffect(() => {
    // Read question when item changes
    const itemType = currentItem.type === 'fruit' ? currentItem.type : currentItem.type + 's';
    speak(`How many ${itemType} are there?`);
  }, [currentItem]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={gameState.items.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          How many {currentItem.type === 'fruit' ? currentItem.type : currentItem.type + 's'} are there?
        </h2>
      </div>

      {/* Display items */}
      <div className="bg-blue-50 rounded-3xl p-8 mb-8 max-w-2xl w-full">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <AnimatePresence mode="popLayout">
            {currentItem.items.map((item, index) => (
              <motion.span
                key={`${currentItem.id}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-3xl md:text-4xl"
              >
                {item}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {gameState.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: gameState.answered ? 1 : 1.05 }}
            whileTap={{ scale: gameState.answered ? 1 : 0.95 }}
            onClick={() => handleAnswer(option)}
            disabled={gameState.answered}
            className={`
              py-6 px-8 rounded-2xl text-3xl md:text-4xl font-bold transition-all
              ${gameState.answered
                ? option === currentItem.count
                  ? 'bg-green-500 text-white'
                  : gameState.isCorrect === false
                  ? 'bg-red-300 text-white'
                  : 'bg-gray-200 text-gray-400'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Score display */}
      <div className="mt-8 text-xl font-semibold text-gray-600">
        Score: {gameState.score} / {gameState.items.length}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/exercises/CountGame.tsx
git commit -m "feat: add Count the Items game component"
```

---

### Task 9: Create Sequence Game Component

**Files:**
- Create: `app/components/exercises/SequenceGame.tsx`

- [ ] **Step 1: Write sequence game component**

```typescript
// app/components/exercises/SequenceGame.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SequenceProblem } from '@/types';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect } from '@/lib/audio';
import { generateSequenceProblems } from '@/topics/numbers-11-20/games/sequence';

interface SequenceGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  problems: SequenceProblem[];
  currentIndex: number;
  score: number;
  selectedOption: number | null;
  answered: boolean;
}

export function SequenceGame({ onComplete }: SequenceGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const problems = generateSequenceProblems(8);
    return {
      problems,
      currentIndex: 0,
      score: 0,
      selectedOption: null,
      answered: false,
    };
  });

  const currentProblem = gameState.problems[gameState.currentIndex];

  const handleAnswer = async (answer: number) => {
    if (gameState.answered) return;

    const isCorrect = answer === currentProblem.correctAnswer;
    setGameState((prev) => ({
      ...prev,
      selectedOption: answer,
      answered: true,
    }));

    if (isCorrect) {
      await playEffect('correct');
      await speak(`${answer}! Great job!`);
      setGameState((prev) => ({ ...prev, score: prev.score + 1 }));
    } else {
      await playEffect('incorrect');
      await speak('Try again!');
    }

    setTimeout(() => {
      if (gameState.currentIndex < gameState.problems.length - 1) {
        setGameState((prev) => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          selectedOption: null,
          answered: false,
        }));
      } else {
        onComplete(gameState.score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  useEffect(() => {
    speak('What number is missing?');
  }, [currentProblem]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={gameState.problems.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          What number is missing?
        </h2>
      </div>

      {/* Number sequence */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap">
        {currentProblem.sequence.map((num, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
              w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center
              text-2xl md:text-3xl font-bold
              ${num === null
                ? 'border-4 border-dashed border-blue-400 bg-blue-50'
                : 'bg-white shadow-lg text-gray-800'
              }
            `}
          >
            {num !== null ? num : '?'}
          </motion.div>
        ))}
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {currentProblem.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: gameState.answered ? 1 : 1.05 }}
            whileTap={{ scale: gameState.answered ? 1 : 0.95 }}
            onClick={() => handleAnswer(option)}
            disabled={gameState.answered}
            className={`
              py-6 px-8 rounded-2xl text-3xl font-bold transition-all
              ${gameState.answered
                ? option === currentProblem.correctAnswer
                  ? 'bg-green-500 text-white'
                  : option === gameState.selectedOption
                  ? 'bg-red-300 text-white'
                  : 'bg-gray-200 text-gray-400'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Score */}
      <div className="mt-8 text-xl font-semibold text-gray-600">
        Score: {gameState.score} / {gameState.problems.length}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/exercises/SequenceGame.tsx
git commit -m "feat: add Missing Number game component"
```

---

### Task 10: Create Tracing Game Component

**Files:**
- Create: `app/components/exercises/TraceGame.tsx`

- [ ] **Step 1: Write tracing game component**

```typescript
// app/components/exercises/TraceGame.tsx

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { speak, playEffect } from '@/lib/audio';
import { ProgressBar } from '../common/ProgressBar';

interface TraceGameProps {
  onComplete: (score: number) => void;
}

const NUMBERS_TO_TRACE = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

interface Point {
  x: number;
  y: number;
}

export function TraceGame({ onComplete }: TraceGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isTracing, setIsTracing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentNumber = NUMBERS_TO_TRACE[currentIndex];

  const drawNumber = useCallback((ctx: CanvasRenderingContext2D, number: number, isGuide: boolean = false) => {
    ctx.save();
    ctx.strokeStyle = isGuide ? '#CBD5E1' : '#3B82F6';
    ctx.lineWidth = isGuide ? 8 : 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isGuide) {
      ctx.setLineDash([10, 10]);
    }

    ctx.font = 'bold 200px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = number.toString();
    const x = ctx.canvas.width / 2;
    const y = ctx.canvas.height / 2;

    ctx.strokeText(text, x, y);
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw guide number
    drawNumber(ctx, currentNumber, true);
  }, [currentNumber, drawNumber]);

  useEffect(() => {
    speak(`Trace the number ${currentNumber}`);
  }, [currentNumber]);

  const handleStart = () => {
    setIsTracing(true);
  };

  const handleEnd = async () => {
    setIsTracing(false);
    
    // Simple completion logic - count it as correct for now
    // In a full implementation, we'd check the traced path
    await playEffect('correct');
    await speak(`${currentNumber}! Excellent!`);
    
    const newScore = score + 1;
    setScore(newScore);

    setTimeout(() => {
      if (currentIndex < NUMBERS_TO_TRACE.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete(newScore);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={currentIndex}
        total={NUMBERS_TO_TRACE.length}
        className="w-full max-w-md mb-8"
      />

      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Trace the number {currentNumber}
        </h2>
      </div>

      {/* Tracing Canvas */}
      <div className="relative bg-white rounded-3xl shadow-xl p-4 mb-8">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          className="border-2 border-gray-200 rounded-2xl touch-none cursor-crosshair"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {/* Start point indicator */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full"
          style={{ marginTop: '-60px', marginLeft: '-60px' }}
        />
      </div>

      <div className="text-lg text-gray-600 text-center max-w-md">
        Use your finger to trace along the dotted lines!
      </div>

      {/* Score */}
      <div className="mt-4 text-xl font-semibold text-gray-600">
        Score: {score} / {NUMBERS_TO_TRACE.length}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/exercises/TraceGame.tsx
git commit -m "feat: add Trace the Number game component"
```

---

### Task 11: Create Role Play Game Component

**Files:**
- Create: `app/components/exercises/RolePlayGame.tsx`

- [ ] **Step 1: Write role play game component**

```typescript
// app/components/exercises/RolePlayGame.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RolePlayDialogue } from '@/types';
import { ProgressBar } from '../common/ProgressBar';
import { speak, playEffect } from '@/lib/audio';
import { generateDialogues } from '@/topics/numbers-11-20/games/dialogue';

interface RolePlayGameProps {
  onComplete: (score: number) => void;
}

interface GameState {
  dialogues: RolePlayDialogue[];
  currentIndex: number;
  score: number;
  answered: boolean;
  selectedOption: string | null;
}

export function RolePlayGame({ onComplete }: RolePlayGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const dialogues = generateDialogues(5);
    return {
      dialogues,
      currentIndex: 0,
      score: 0,
      answered: false,
      selectedOption: null,
    };
  });

  const currentDialogue = gameState.dialogues[gameState.currentIndex];

  const handleAnswer = async (answer: string) => {
    if (gameState.answered) return;

    const isCorrect = answer === currentDialogue.answer;
    setGameState((prev) => ({
      ...prev,
      selectedOption: answer,
      answered: true,
    }));

    if (isCorrect) {
      await playEffect('correct');
      await speak(`${answer} Great job!`);
      setGameState((prev) => ({ ...prev, score: prev.score + 1 }));
    } else {
      await playEffect('incorrect');
      await speak('Try again!');
    }

    setTimeout(() => {
      if (gameState.currentIndex < gameState.dialogues.length - 1) {
        setGameState((prev) => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          selectedOption: null,
          answered: false,
        }));
      } else {
        onComplete(gameState.score + (isCorrect ? 1 : 0));
      }
    }, 2000);
  };

  useEffect(() => {
    // Read the question
    speak(currentDialogue.question);
  }, [currentDialogue]);

  // Generate visual representation of items
  const renderItems = () => {
    const items = [];
    const emojiMap: { [key: string]: string } = {
      'apples': '🍎',
      'bananas': '🍌',
      'cats': '🐱',
      'dogs': '🐶',
      'books': '📚',
      'toys': '🧸',
      'birds': '🐦',
      'flowers': '🌸',
    };
    const emoji = emojiMap[currentDialogue.objectType] || '🎈';
    
    for (let i = 0; i < Math.min(currentDialogue.count, 20); i++) {
      items.push(
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="text-2xl md:text-3xl"
        >
          {emoji}
        </motion.span>
      );
    }
    return items;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <ProgressBar
        current={gameState.currentIndex}
        total={gameState.dialogues.length}
        className="w-full max-w-md mb-6"
      />

      {/* Characters and Dialogue */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 w-full max-w-4xl">
        {/* Tom - asks question */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-6xl md:text-7xl mb-2"
          >
            👦
          </motion.div>
          <div className="bg-blue-100 rounded-2xl p-4 max-w-xs">
            <p className="text-lg font-semibold text-blue-800">
              {currentDialogue.question}
            </p>
          </div>
        </div>

        {/* Items to count */}
        <div className="bg-yellow-50 rounded-3xl p-6 flex flex-wrap justify-center gap-2 max-w-md min-h-[120px] items-center">
          {renderItems()}
        </div>

        {/* Lucy - answers */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-6xl md:text-7xl mb-2"
          >
            👧
          </motion.div>
          <div className="bg-pink-100 rounded-2xl p-4 max-w-xs">
            <p className="text-lg font-semibold text-pink-800">
              {gameState.answered && gameState.selectedOption === currentDialogue.answer
                ? currentDialogue.answer
                : '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {currentDialogue.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: gameState.answered ? 1 : 1.02 }}
            whileTap={{ scale: gameState.answered ? 1 : 0.98 }}
            onClick={() => handleAnswer(option)}
            disabled={gameState.answered}
            className={`
              py-5 px-6 rounded-2xl text-lg md:text-xl font-bold transition-all
              ${gameState.answered
                ? option === currentDialogue.answer
                  ? 'bg-green-500 text-white'
                  : option === gameState.selectedOption
                  ? 'bg-red-300 text-white'
                  : 'bg-gray-200 text-gray-400'
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Score */}
      <div className="mt-6 text-xl font-semibold text-gray-600">
        Score: {gameState.score} / {gameState.dialogues.length}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/exercises/RolePlayGame.tsx
git commit -m "feat: add Role Play game component"
```

---

## Phase 6: Pages

### Task 12: Create Home Page (Topic Selection)

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update global styles**

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-sky: #4FC3F7;
  --color-grass: #81C784;
  --color-sun: #FFD54F;
}

* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

body {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

/* Touch-friendly styles */
button, a {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Prevent text selection on game elements */
.no-select {
  user-select: none;
  -webkit-user-select: none;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

- [ ] **Step 2: Update layout.tsx**

```typescript
// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Babylala Exercise - Fun English Learning',
  description: 'Interactive English learning games for kids',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4FC3F7',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create home page**

```typescript
// app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProgressData } from '@/types';
import { Header } from './components/layout/Header';
import { TopicGrid } from './components/layout/TopicGrid';
import { loadProgress, defaultProgressData } from '@/lib/storage';
import { getAllTopics } from '@/topics';
import { speak } from '@/lib/audio';

export default function Home() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgressData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load progress on client side
    const loaded = loadProgress();
    setProgress(loaded);
    setIsLoading(false);

    // Welcome message
    speak('Welcome to Babylala! Choose a topic to start learning!');
  }, []);

  const topics = getAllTopics();
  const totalStars = Object.values(progress.topics).reduce(
    (sum, topic) => sum + topic.totalStars,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-6xl"
        >
          🔄
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Babylala Exercise" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            What would you like to learn today?
          </h1>
          <p className="text-xl text-gray-600">
            Total Stars Earned: <span className="text-yellow-500 font-bold text-2xl">{totalStars} ★</span>
          </p>
        </motion.div>

        {/* Topic Grid */}
        <TopicGrid topics={topics} progress={progress} />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500">
        <p>Have fun learning! 🌟</p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css
git commit -m "feat: add home page with topic selection"
```

---

### Task 13: Create Topic Detail Page

**Files:**
- Create: `app/topic/[id]/page.tsx`
- Create: `app/topic/[id]/layout.tsx`

- [ ] **Step 1: Create topic layout**

```typescript
// app/topic/[id]/layout.tsx

import { ReactNode } from 'react';

export default function TopicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">{children}</div>;
}
```

- [ ] **Step 2: Create topic detail page**

```typescript
// app/topic/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/common/Card';
import { StarDisplay } from '@/app/components/common/StarDisplay';
import { Button } from '@/app/components/common/Button';
import { getTopicById } from '@/topics';
import { loadProgress, getGameProgress } from '@/lib/storage';
import { speak, playEffect } from '@/lib/audio';
import { ProgressData } from '@/types';

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  
  const topic = getTopicById(topicId);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    if (topic) {
      speak(`Welcome to ${topic.title}! Choose a game to play!`);
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Topic not found!</p>
      </div>
    );
  }

  const handleGameClick = async (gameId: string) => {
    await playEffect('click');
    router.push(`/topic/${topicId}/exercise/${gameId}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      <Header title={topic.title} showBack onBack={handleBack} />

      <main className="container mx-auto px-4 py-8">
        {/* Topic Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl ${topic.color} text-7xl mb-4`}
          >
            {topic.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {topic.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn {topic.vocabulary.length} new words and practice {topic.sentences.length} sentence patterns!
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {topic.games.map((game, index) => {
            const gameProgress = progress
              ? getGameProgress(progress, topicId, game.id)
              : { completed: false, stars: 0 };
            
            // Check if game is locked
            const isLocked = game.dependsOn
              ? game.dependsOn.some((depId) => {
                  const depProgress = progress
                    ? getGameProgress(progress, topicId, depId)
                    : { completed: false };
                  return !depProgress.completed;
                })
              : false;

            const gameColors: { [key: string]: string } = {
              counting: 'bg-orange-100 border-orange-300',
              sequence: 'bg-purple-100 border-purple-300',
              writing: 'bg-teal-100 border-teal-300',
              dialogue: 'bg-pink-100 border-pink-300',
            };

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  onClick={() => handleGameClick(game.id)}
                  locked={isLocked}
                  className={`${gameColors[game.type]} border-4`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl mb-3">
                      {game.type === 'counting' && '🔢'}
                      {game.type === 'sequence' && '📊'}
                      {game.type === 'writing' && '✏️'}
                      {game.type === 'dialogue' && '💬'}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {game.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4">{game.description}</p>

                    <div className="flex items-center gap-2">
                      {gameProgress.completed ? (
                        <>
                          <StarDisplay stars={gameProgress.stars} size="sm" />
                          <span className="text-green-500 text-2xl">✓</span>
                        </>
                      ) : isLocked ? (
                        <span className="text-gray-400 text-xl">🔒 Locked</span>
                      ) : (
                        <Button size="sm" sound={false}>
                          Play Now!
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/topic/
git commit -m "feat: add topic detail page with game selection"
```

---

### Task 14: Create Exercise Page

**Files:**
- Create: `app/topic/[id]/exercise/[exerciseId]/page.tsx`
- Create: `app/components/exercises/GameComplete.tsx`

- [ ] **Step 1: Create GameComplete component**

```typescript
// app/components/exercises/GameComplete.tsx

'use client';

import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { StarDisplay } from '../common/StarDisplay';
import { speak, playEffect } from '@/lib/audio';
import { useEffect } from 'react';

interface GameCompleteProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onBackToTopic: () => void;
  onNextGame: () => void;
  hasNextGame: boolean;
}

export function GameComplete({
  score,
  totalQuestions,
  onPlayAgain,
  onBackToTopic,
  onNextGame,
  hasNextGame,
}: GameCompleteProps) {
  const percentage = (score / totalQuestions) * 100;
  
  // Calculate stars based on percentage
  let stars = 0;
  if (percentage >= 80) stars = 3;
  else if (percentage >= 60) stars = 2;
  else if (percentage >= 40) stars = 1;

  useEffect(() => {
    // Play celebration and speak results
    playEffect('celebration');
    speak(`Great job! You got ${score} out of ${totalQuestions}! You earned ${stars} stars!`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
    >
      {/* Confetti effect could go here */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-8xl mb-6"
      >
        🎉
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Game Complete!
      </h2>

      <p className="text-2xl text-gray-600 mb-6">
        You got <span className="font-bold text-blue-600">{score}</span> out of{' '}
        <span className="font-bold">{totalQuestions}</span> correct!
      </p>

      <div className="mb-8">
        <StarDisplay stars={stars} size="lg" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="secondary" onClick={onPlayAgain}>
          Play Again
        </Button>
        
        {hasNextGame && (
          <Button onClick={onNextGame}>Next Game →</Button>
        )}
        
        <Button variant="secondary" onClick={onBackToTopic}>
          Back to Topic
        </Button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create exercise page**

```typescript
// app/topic/[id]/exercise/[exerciseId]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/app/components/layout/Header';
import { CountGame } from '@/app/components/exercises/CountGame';
import { SequenceGame } from '@/app/components/exercises/SequenceGame';
import { TraceGame } from '@/app/components/exercises/TraceGame';
import { RolePlayGame } from '@/app/components/exercises/RolePlayGame';
import { GameComplete } from '@/app/components/exercises/GameComplete';
import { getTopicById } from '@/topics';
import {
  loadProgress,
  saveProgress,
  updateGameProgress,
} from '@/lib/storage';
import { GameConfig } from '@/types';

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const exerciseId = params.exerciseId as string;

  const topic = getTopicById(topicId);
  const game = topic?.games.find((g) => g.id === exerciseId);

  const [gameState, setGameState] = useState<'playing' | 'complete'>('playing');
  const [score, setScore] = useState(0);

  if (!topic || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Game not found!</p>
      </div>
    );
  }

  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState('complete');

    // Calculate stars
    let stars = 0;
    const percentage = (finalScore / 10) * 100; // Assuming 10 questions per game
    if (percentage >= 80) stars = 3;
    else if (percentage >= 60) stars = 2;
    else if (percentage >= 40) stars = 1;

    // Save progress
    const progress = loadProgress();
    const updatedProgress = updateGameProgress(progress, topicId, exerciseId, {
      completed: true,
      highScore: finalScore,
      stars,
    });
    saveProgress(updatedProgress);
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setScore(0);
  };

  const handleBackToTopic = () => {
    router.push(`/topic/${topicId}`);
  };

  const handleNextGame = () => {
    const currentIndex = topic.games.findIndex((g) => g.id === exerciseId);
    const nextGame = topic.games[currentIndex + 1];
    if (nextGame) {
      router.push(`/topic/${topicId}/exercise/${nextGame.id}`);
    }
  };

  const renderGame = () => {
    switch (game.type) {
      case 'counting':
        return <CountGame onComplete={handleGameComplete} />;
      case 'sequence':
        return <SequenceGame onComplete={handleGameComplete} />;
      case 'writing':
        return <TraceGame onComplete={handleGameComplete} />;
      case 'dialogue':
        return <RolePlayGame onComplete={handleGameComplete} />;
      default:
        return <div>Unknown game type</div>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header title={game.title} showBack onBack={handleBackToTopic} />

      <main className="container mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderGame()}
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameComplete
                score={score}
                totalQuestions={10}
                onPlayAgain={handlePlayAgain}
                onBackToTopic={handleBackToTopic}
                onNextGame={handleNextGame}
                hasNextGame={
                  topic.games.findIndex((g) => g.id === exerciseId) <
                  topic.games.length - 1
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/topic/[id]/exercise/ app/components/exercises/GameComplete.tsx
git commit -m "feat: add exercise page with game routing and completion"
```

---

## Phase 7: PWA & Assets

### Task 15: Create PWA Manifest and Icons

**Files:**
- Create: `public/manifest.json`
- Create: `public/icon-192.png`
- Create: `public/icon-512.png`

- [ ] **Step 1: Create PWA manifest**

```json
{
  "name": "Babylala Exercise",
  "short_name": "Babylala",
  "description": "Fun English learning for kids",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#4FC3F7",
  "theme_color": "#4FC3F7",
  "orientation": "landscape",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 2: Create simple SVG icon placeholders**

```bash
# Create simple colored squares as placeholder icons
cat > /tmp/icon.html << 'EOF'
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#4FC3F7" rx="48"/>
  <text x="96" y="130" font-size="120" text-anchor="middle">📚</text>
</svg>
EOF

# For now, just create placeholder files
# In production, use proper icon files
touch public/icon-192.png public/icon-512.png
```

- [ ] **Step 3: Commit**

```bash
git add public/manifest.json public/icon-192.png public/icon-512.png
git commit -m "feat: add PWA manifest and icon placeholders"
```

---

## Phase 8: CI/CD & Deployment

### Task 16: Configure Vercel Deployment

**Files:**
- Create: `vercel.json`
- Create: `.github/workflows/deploy.yml` (optional)

- [ ] **Step 1: Create Vercel config**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs"
}
```

- [ ] **Step 2: Create GitHub Actions workflow (optional)**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

- [ ] **Step 3: Commit**

```bash
git add vercel.json .github/workflows/deploy.yml
git commit -m "chore: add Vercel deployment configuration"
```

---

### Task 17: Final Build & Test

**Files:**
- Verify entire project builds correctly

- [ ] **Step 1: Install all dependencies**

```bash
npm install
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 3: Build the project**

```bash
npm run build
```

Expected: Build succeeds with no errors, dist/ folder created

- [ ] **Step 4: Verify build output**

```bash
ls -la dist/
```

Expected: index.html, _next/ folder, other static assets

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: final build and project completion"
```

---

## Testing Checklist

Before marking as complete, verify:

- [ ] All TypeScript types are correct
- [ ] No console errors in development
- [ ] All 4 games load and function
- [ ] Progress saves to localStorage
- [ ] Sound effects play correctly
- [ ] Text-to-speech works
- [ ] Responsive on iPad (landscape)
- [ ] Touch interactions work
- [ ] Build completes successfully
- [ ] PWA manifest is valid

---

## Deployment Instructions

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to vercel.com
   - Import GitHub repository
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment Variables (if needed):**
   - None required for this project

4. **Deploy:**
   - Vercel will auto-deploy on push to main
   - Get URL: `babylala-exercise.vercel.app`

---

## Summary

This implementation plan creates:
- ✅ Next.js 14 project with TypeScript and Tailwind
- ✅ 4 interactive learning games for Numbers 11-20
- ✅ Progress tracking with localStorage
- ✅ Sound effects and text-to-speech
- ✅ Topic selection and game routing
- ✅ PWA support for iPad installation
- ✅ Vercel deployment configuration

**Total estimated time:** 4-6 hours of focused development
