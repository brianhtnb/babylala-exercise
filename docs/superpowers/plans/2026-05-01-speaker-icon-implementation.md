# Speaker Icon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and apply a reusable `SpeechButton` component to make question/dialogue text interactive and audible when clicked.

**Architecture:** Create a new `SpeechButton` component that wraps text. It uses the existing `speak` utility. Replace text containers in game components with this new component.

**Tech Stack:** React, Tailwind CSS, Web Speech API

---

## Phase 1: Create Component

### Task 1: Create SpeechButton Component

**Files:**
- Create: `app/components/common/SpeechButton.tsx`

- [ ] **Step 1: Write `SpeechButton.tsx`**

```typescript
// app/components/common/SpeechButton.tsx
'use client';

import { motion } from 'framer-motion';
import { speak } from '@/lib/audio';
import { cn } from '@/lib/utils';

interface SpeechButtonProps {
  text: string;
  className?: string;
  children: React.ReactNode;
}

export function SpeechButton({ text, className, children }: SpeechButtonProps) {
  const handleClick = async () => {
    await speak(text);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn("flex items-center gap-2 text-left cursor-pointer", className)}
    >
      {children}
      <span className="text-2xl" role="img" aria-label="speaker">🔊</span>
    </motion.button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/common/SpeechButton.tsx
git commit -m "feat: add SpeechButton component for interactive text audio"
```

---

## Phase 2: Integration

### Task 2: Integrate SpeechButton into Games

**Files:**
- Modify: `app/components/exercises/CountGame.tsx`
- Modify: `app/components/exercises/SequenceGame.tsx`
- Modify: `app/components/exercises/RolePlayGame.tsx`

- [ ] **Step 1: Integrate into `CountGame.tsx`**

```typescript
// Modify CountGame.tsx
import { SpeechButton } from '../common/SpeechButton';

// ... inside return
<SpeechButton text={`How many ${currentItem.name} are there?`}>
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
    How many {currentItem.name} are there?
  </h2>
</SpeechButton>
```

- [ ] **Step 2: Integrate into `SequenceGame.tsx`**

```typescript
// Modify SequenceGame.tsx
import { SpeechButton } from '../common/SpeechButton';

// ... inside return
<SpeechButton text="What number is missing?">
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
    What number is missing?
  </h2>
</SpeechButton>
```

- [ ] **Step 3: Integrate into `RolePlayGame.tsx`**

```typescript
// Modify RolePlayGame.tsx
import { SpeechButton } from '../common/SpeechButton';

// ... inside return (Tom's dialogue)
<SpeechButton text={currentDialogue.question}>
  <p className="text-lg font-semibold text-blue-800">
    {currentDialogue.question}
  </p>
</SpeechButton>

// ... inside return (Lucy's dialogue - only if answered)
{gameState.answered && gameState.selectedOption === currentDialogue.answer ? (
    <SpeechButton text={currentDialogue.answer}>
        <p className="text-lg font-semibold text-pink-800">
            {currentDialogue.answer}
        </p>
    </SpeechButton>
) : (
    <p className="text-lg font-semibold text-pink-800">...</p>
)}
```

- [ ] **Step 4: Commit**

```bash
git add app/components/exercises/
git commit -m "feat: integrate SpeechButton in all games for text-to-speech interaction"
```

---

## Testing Checklist

Before marking as complete, verify:

- [ ] Clicking question text triggers audio playback
- [ ] Speaker icon is visible next to text
- [ ] Role-play dialogue triggers audio on question AND answer (after answer)
- [ ] Layout remains responsive on iPad

---

## Deployment Instructions

1. **GitHub:** `git push origin main`
2. **Vercel:** Auto-deploy will trigger.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-01-speaker-icon-implementation.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
