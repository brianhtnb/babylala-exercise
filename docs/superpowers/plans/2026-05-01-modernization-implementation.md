# Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the app's visual identity to the "Playful Pastel" theme.

**Architecture:** Use Tailwind CSS utility classes to update the visual design. Apply changes consistently across components using the approved color palette and spacing.

**Tech Stack:** Tailwind CSS, React/Next.js

---

## Phase 1: Global Theme Update

### Task 1: Update Tailwind Config & Globals

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Update `tailwind.config.ts` with new colors**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: { 100: '#B3E5FC', 500: '#4FC3F7' },
        green: { 50: '#E8F5E9', 500: '#81C784' },
        purple: { 200: '#E1BEE7' },
        orange: { 200: '#FFE0B2' },
        slate: { 800: '#37474F' },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Update `app/globals.css`**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: linear-gradient(135deg, #E8F5E9 0%, #B3E5FC 100%);
  font-family: 'Quicksand', sans-serif;
  color: #37474F;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "style: apply playful pastel theme colors"
```

---

## Phase 2: Component Refinement

### Task 2: Update Buttons and Cards

**Files:**
- Modify: `app/components/common/Button.tsx`
- Modify: `app/components/common/Card.tsx`

- [ ] **Step 1: Update Button styling**

```typescript
// app/components/common/Button.tsx
// ... inside Button component, update variantStyles
  const variantStyles = {
    primary: 'bg-orange-200 hover:bg-orange-300 text-slate-800',
    secondary: 'bg-green-500 hover:bg-green-600 text-white',
    // ... rest
  };
// ... inside Button component, update rounded class
  className={cn(
    // ...
    'rounded-[30px]',
    // ...
  )}
```

- [ ] **Step 2: Update Card styling**

```typescript
// app/components/common/Card.tsx
// ... inside Card component, update className
  className={cn(
    'bg-white rounded-[30px] shadow-lg p-6 border-4 border-purple-200',
    // ... rest
  )}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/common/Button.tsx app/components/common/Card.tsx
git commit -m "style: update buttons and cards with pastel styling"
```

---

## Phase 3: Layout and Spacing

### Task 3: Adjust Layout Components

**Files:**
- Modify: `app/components/layout/Header.tsx`
- Modify: `app/components/layout/TopicGrid.tsx`

- [ ] **Step 1: Update Header padding and background**

```typescript
// app/components/layout/Header.tsx
className={cn(
    'w-full px-8 py-6 flex items-center justify-between',
    'bg-sky-500', // Update to new color
    className
)}
```

- [ ] **Step 2: Update TopicGrid gap**

```typescript
// app/components/layout/TopicGrid.tsx
// ... change gap-6 to gap-8
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
```

- [ ] **Step 3: Commit**

```bash
git add app/components/layout/Header.tsx app/components/layout/TopicGrid.tsx
git commit -m "style: increase spacing and update header color"
```

---

## Testing Checklist

Before marking as complete, verify:

- [ ] Colors match the pastel palette
- [ ] Rounded corners look consistent (30px radius)
- [ ] Spacing feels increased (gap-8, p-8)
- [ ] Build passes: `npm run build`

---

## Deployment Instructions

1. **GitHub:** `git push origin main`
2. **Vercel:** Auto-deploy will trigger.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-01-modernization-implementation.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
