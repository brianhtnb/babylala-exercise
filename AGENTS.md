# Agent and contributor guide

*(Hướng dẫn cho contributor và AI agents: đọc các mục dưới trước khi chỉnh UI hoặc thêm màn hình.)*

## Start here

1. **`docs/DESIGN-SYSTEM.md`** — Full design system: tokens, file map, checklist, stack. **Read this before any UI work.**
2. **`.cursor/rules/design-system.mdc`** — Short mandatory rules; Cursor loads this for every session in this repo (`alwaysApply: true`).

## Project essentials

- **Next.js 14** App Router, **TypeScript**, **Tailwind 3.4**.
- **Paths:** `@/` → project root (see `tsconfig.json`).
- **Quality:** Run `npm run lint` and `npm run build` before submitting changes.

## When you change…

| Area | Follow |
|------|--------|
| Styling / new pages / components | `docs/DESIGN-SYSTEM.md` + `lib/design-tokens.ts` + `app/globals.css` |
| Shared utilities | `lib/utils.ts` (`cn`, ids) |
| Topics / games content | `topics/` and `types/` |

## Out of scope for drive-by edits

Do not change the design system files for unrelated bugfixes. Keep diffs focused; match existing patterns in the same file.
