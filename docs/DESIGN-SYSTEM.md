# Design system and UI rules (Babylala Exercise)

This project follows a **token-based UI** aligned with the Oliver AI frontend patterns (colors, typography, motion, Tailwind setup). All contributors and coding agents should read this file before changing UI, styles, or layout.

---

## Source of truth

| Concern | Path |
|--------|------|
| Tailwind theme (colors, fonts, shadows, plugins, animations) | `tailwind.config.ts` |
| CSS variables (light / dark), base styles, `type-*` utilities, `.panel` | `app/globals.css` |
| TS tokens: typography class names, motion presets, spacing, scores | `lib/design-tokens.ts` |
| Font loading (Next.js) | `app/layout.tsx` (`Manrope`, `--font-manrope`) |
| Class merging | `lib/utils.ts` → `cn()` (`clsx` + `tailwind-merge`) |

---

## Stack (do not change casually)

- **Framework:** Next.js App Router, React 18.
- **Styling:** Tailwind CSS **3.4**, `darkMode: 'class'` (toggle via `class="dark"` on `<html>` when you add a theme switch).
- **Global CSS:** `app/globals.css` (imported from `app/layout.tsx`).
- **Font:** **Manrope** (Google via `next/font`), variable `--font-manrope`; body uses theme `font-body` / CSS variables in `:root`.
- **Icons:** **`lucide-react`** — outline style, consistent stroke; avoid mixing random emoji for chrome controls unless product explicitly wants playfulness (educational content may keep emoji where it helps children).
- **Motion:** **`framer-motion`**; prefer durations / presets from `lib/design-tokens.ts` (`ANIMATION_DURATIONS`, `FADE_IN`, `SETTLE_IN`, `STAGGER_CHILDREN`) for consistency.
- **Forms:** `@tailwindcss/forms` with **`strategy: 'class'`** — opt-in with classes such as `form-input`; do not rely on unscoped global form resets.
- **Prose:** `@tailwindcss/typography` — use `prose` / `prose-*` when you add long-form content; theme prose colors reference semantic tokens where configured.

---

## Non-negotiable UI rules

1. **Semantic colors first** — Prefer `bg-app`, `bg-surface`, `text-content`, `text-content-secondary`, `border-dm-border`, `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `score-*`, `chrome-*` over raw hex or default `gray-*` / `blue-*` unless there is a strong reason (e.g. canvas drawing APIs).
2. **Typography** — Prefer `TYPOGRAPHY` from `@/lib/design-tokens` combined with `cn()` rather than ad-hoc `text-gray-*` + arbitrary sizes. The matching CSS classes live in `app/globals.css` (`type-page-title`, `type-card-body`, etc.).
3. **Layout width** — Main page content should use `PAGE_CONTAINER` from `@/lib/design-tokens` unless a screen truly needs full bleed.
4. **Cards and elevated surfaces** — Prefer the **`.panel`** utility (or equivalent: `rounded-xl`, semantic border, `bg-surface`, `shadow-nexus-sm/md`) instead of heavy custom shadows and thick arbitrary borders.
5. **Class lists** — Always merge conditional Tailwind with **`cn()`** from `@/lib/utils` to avoid conflicting utilities.
6. **Accessibility** — Global `focus-visible` styles are defined in `globals.css`; do not strip focus rings without replacing them. Respect `prefers-reduced-motion` (already in global CSS).
7. **User-facing copy** — Keep **English** for UI strings in components (`lang="en"` on `<html>`).

---

## Color system (short reference)

### Brand and semantic (Tailwind)

- **Primary (purple):** `primary.DEFAULT` **#7C3AED** — main CTAs and brand accents; scale `primary.50`–`900`.
- **Secondary (teal):** `secondary.DEFAULT` **#0D9488**.
- **Semantic:** `success`, `danger`, `warning`, `info` (each includes `light` / `dark-light` tints where defined).
- **Scores / stars:** `score.green`, `score.yellow`, `score.red` — align with `SCORE_COLORS` and `SCORE_THRESHOLDS` in `lib/design-tokens.ts` when building progress or feedback UI.

### Surfaces (CSS variables)

Light and dark values are in **`app/globals.css`** (`:root` and `.dark`). Tailwind maps include:

- **Backgrounds:** `bg-app`, `bg-surface`, `bg-surface-secondary`
- **Text:** `text-content`, `text-content-secondary`, `text-content-subtle`, `text-content-muted`
- **Borders:** `border-dm-border`, `border-dm-border-light`

### Chrome (app shell)

- **`chrome-sidebar`**, **`chrome-sidebar-elevated`**, **`chrome-accent`** — used for top bar / nav-like areas; keep contrast with white or `text-content` on light surfaces as appropriate.

---

## Typography tokens

Use **`import { TYPOGRAPHY, SECTION_STYLES, ... } from '@/lib/design-tokens'`** and compose with `cn()`:

| Token | CSS utility class | Typical use |
|-------|-------------------|-------------|
| `TYPOGRAPHY.pageTitle` | `type-page-title` | Page headings |
| `TYPOGRAPHY.pageSubtitle` | `type-page-subtitle` | Subtitles under page title |
| `TYPOGRAPHY.sectionTitle` | `type-section-title` | Section headings |
| `TYPOGRAPHY.sectionSubtitle` | `type-section-subtitle` | Muted section lines |
| `TYPOGRAPHY.cardTitle` | `type-card-title` | Card titles |
| `TYPOGRAPHY.body` | `type-card-body` | Body on cards / dense UI |
| `TYPOGRAPHY.caption` | `type-caption` | Meta, hints |
| `TYPOGRAPHY.eyebrow` | `type-eyebrow` | Labels above titles |
| `TYPOGRAPHY.metric` | `type-metric` | Numbers, scores |
| `TYPOGRAPHY.control` | `type-control` | Button labels (small controls) |

**Section headers:** use `SECTION_STYLES.title` + `SECTION_STYLES.subtitle` when you need a title block with a muted second line.

---

## Spacing and radius

- **`SPACING`** in `lib/design-tokens.ts`: `cardPadding` (`p-6`), `sectionGap` (`gap-6`), `inlineGap` (`gap-3`).
- **`rounded-card`** in Tailwind theme: **8px**.
- Prefer **`rounded-xl`** for cards / panels unless a child-focused interaction needs a softer radius (then document why).

---

## Shadows and motion

- **Shadows:** `shadow-nexus-sm`, `shadow-nexus-md` for elevation.
- **CSS animations:** `animate-fade-in-up`, `animate-enter` (see `tailwind.config.ts`).
- **Framer Motion:** reuse `FADE_IN`, `SETTLE_IN`, `STAGGER_CHILDREN` and `ANIMATION_DURATIONS` instead of one-off magic numbers where possible.

---

## Dark mode

- Theme tokens in **`.dark`** are ready in `globals.css`.
- Until a user-facing toggle exists, the app may stay in light mode; new UI must still **work logically** if `dark` is added on `<html>` (no hard-coded light-only text on dark backgrounds without tokens).

---

## Checklist before merging UI changes

- [ ] No new raw hex colors in TSX unless required (e.g. canvas) — prefer tokens.
- [ ] Typography uses `TYPOGRAPHY` or intentional exception documented in PR.
- [ ] `cn()` used for conditional classes.
- [ ] New screens use `PAGE_CONTAINER` (or documented exception).
- [ ] Interactive elements remain keyboard-focusable with visible focus.
- [ ] Icons from `lucide-react` for UI chrome where it fits the design language.

---

## Related commands

- `npm run lint` — ESLint.
- `npm run build` — production build (catches Tailwind / type errors).

If you add a design-token audit script later (similar to Oliver’s `audit-design-tokens.ts`), document it here and run it in CI or before releases.
