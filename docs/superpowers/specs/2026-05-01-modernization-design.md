# Modernization Update: "Playful Pastel" Design Spec

**Date:** 2026-05-01  
**Goal:** Transition current UI to a "Playful Pastel" aesthetic.

## Design Specification

### 1. Color Palette (Tailwind)
- **Backgrounds:** `bg-sky-100` (soft sky blue) or `bg-green-50` (mint green)
- **Cards/Containers:** `bg-white` with `border-purple-200` (soft lavender)
- **Primary Buttons/Actions:** `bg-orange-200` (peach)
- **Text:** `text-slate-800` (dark slate gray)

### 2. Styling Improvements
- **Corner Radii:** Increase `rounded-3xl` to `rounded-[30px]` or `rounded-[40px]` on all UI components.
- **Shadows:** Use `shadow-md` or `shadow-lg` with `shadow-purple-100` for a soft, floating effect.
- **Spacing:** Apply `p-8`, `gap-8` for more breathing room on all screens.

### 3. Feedback & Animation
- **Transitions:** Use `framer-motion` `spring` physics for button interactions (bouncy effect).
- **Soft Feedback:** Change error states to use soft coral (`text-rose-400`) rather than harsh reds.

---

**Design Approved.** Please review these changes before I invoke the `writing-plans` skill to generate the implementation plan.
