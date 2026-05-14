# Topic Check (final-checkpoint) — optional image assets

Use this when you add **checkpoint-only** art. Listen/read already use existing scene assets; **write** steps use `image` on each item (currently `public/images/jungle/animals/*.png` — same style as the rest of the topic).

## Folder

Place files under:

`public/images/jungle/checkpoint/`

## Naming (suggested)

| Pattern | Use |
|--------|-----|
| `checkpoint-listen-01-a.png` … `-c.png` | Three choices for a custom listen item (match `CheckpointListenItem` choice `image` paths in data). |
| `checkpoint-read-01.png` | Scene for a custom read item (`CheckpointReadItem.image`). |
| `checkpoint-write-01.png` | Optional dedicated art for a write step (`CheckpointWriteExtraItem.image` or `CheckpointWriteBuildItem.image`); can also reuse `animals/<creature>.png`. |
| `checkpoint-speak-hero.png` | Optional hero for the speaking step (`CheckpointSpeakItem.image`). |

Use **PNG**, flat vector kid-friendly style consistent with `docs/DESIGN-SYSTEM.md` and existing `public/images/jungle/animals/`.

## Prompt starter (shared style)

```
Flat vector cartoon, bold outlines, cute friendly eyes, jungle ESL app for ages 5–6,
no text, no letters in the artwork, no watermarks, PNG transparent or simple background.
```

After exporting, **update** [`topics/jungle/games/final-checkpoint.ts`](topics/jungle/games/final-checkpoint.ts) (or listen/read data) with the new public paths.

## Write steps (`extra-letter` and `build-word`)

Both require **`image`** (public path). Prefer the same flat vector animal art as `public/images/jungle/animals/` (e.g. `bee.png`, `tiger.png`) so the checkpoint matches spelling/scene style.

`pool` must contain every character of `target` (including repeats) plus 1–3 decoy lowercase letters `a–z` not needed for spelling. Order in `pool` is the **display order** in the letter bank (children tap in **spelling order**, not left-to-right bank order).
