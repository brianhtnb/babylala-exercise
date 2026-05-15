# Jungle Explorer Journey — implementation spec

**Status:** Design → implementation handoff.  
**Audience:** Engineers + asset pipeline.  
**Related:** `topics/jungle/config.ts`, `docs/superpowers/specs/2026-05-13-jungle-explorer-design.md`, `docs/superpowers/specs/2026-05-13-jungle-image-prompts.md`.

---

## 1. Goals

1. Replace (or supplement) the flat topic card list with a **single adventure map** where the child progresses along a path with **5 regions + temple finale**.
2. Introduce **Milo** (mouse companion) for **intro TTS**, **success/fail feedback**, and **Logbook** vocabulary replay.
3. Persist **region unlock**, **badges**, **inventory tools**, and **per-word mastery** in `localStorage`, integrated with existing `ProgressData` where possible.
4. Ship **visual assets** under `public/images/jungle/adventure/` with predictable filenames (see §8).

**Non-goals (v1):** Full 3D engine; multiplayer; server-side progress.

---

## 2. Alignment with current jungle topic

Today, jungle uses `TopicConfig.games[]` with `dependsOn` and `ExercisePageClient` routes like `/topic/jungle/exercise/{gameId}`. Existing types include `listen-pick`, `spelling`, `final-checkpoint`, etc.

**Adventure v1 mapping (product decision — implement as below unless PM changes):**

| Region ID | Adventure label | Primary experience | Reuse existing game ID / notes |
|-----------|-----------------|-------------------|--------------------------------|
| `meadow` | Honey Meadow | **Honey Bridge** — build a “word ladder” / letter bridge (new mini-game or thin wrapper around spelling-like mechanics). | New route e.g. `jungle-honey-bridge` **or** first visit = redirect to extended spelling UI with Milo shell. |
| `cave` | Tiger's Cave | **Shadow Match** — flashlight reveals silhouette → pick animal (new). | New `shadow-match` type. |
| `swamp` | Crocodile Swamp | **Lily Pad Count** — count / drag fish to crocodile (new or adapt `count-complete`). | Prefer new focused mini-game; can reuse counting assets from `count-complete` topic data. |
| `treehouse` | Monkey Tree | **Fruit Catch** — tap fruits Milo names (new). | New `fruit-catch` type. |
| `temple` | Ancient Temple | **Final Checkpoint** — existing mixed review. | Existing `jungle-checkpoint` + `FinalCheckpointGame`. Unlock when **4 region badges** collected. |

**Legacy games** (vocab-intro, listen-pick, reading-quiz, scene-reading, speaking-present) can either:

- **Option A (recommended):** Stay reachable from Logbook / “Practice” submenu while map is the **main** path; map regions host **new** shorter games that reference same vocabulary.
- **Option B:** Embed existing games inside region shells (larger scope).

This spec assumes **Option A** unless you explicitly merge routes.

---

## 3. User flows

### 3.1 First visit

1. User opens jungle topic → **Adventure Map** (new page or `TopicPageClient` mode).
2. Milo plays short **TTS intro** (“Welcome explorer! Tap Honey Meadow.”).
3. Only `meadow` is interactable; others show lock overlay.

### 3.2 Complete a region

1. Tap region → navigate to region game route.
2. On success: Milo **celebration** animation + TTS; grant **badge**; append **inventory** item if first clear; set `unlockedRegions` to include next region; `currentRegion` advances.
3. Return to map with **path segment** animating on (CSS or Lottie).

### 3.3 Temple

1. When `badges.length >= 4` (bee, tiger, croc, monkey — see §8), **Ancient Temple** unlocks.
2. Entering temple runs existing **final-checkpoint** flow (13 steps) inside Milo-framed layout optional.

### 3.4 Logbook

- Always accessible (FAB or header icon).
- **Tab Badges:** grid of 4 badges; tap → Milo line + TTS (e.g. “You are a Spelling Hero!” — copy per badge).
- **Tab Tools:** binoculars + compass; tap → keyword TTS (`explore`, `direction` — define in content JSON).
- **Tab Word Bank:** list of jungle words + image thumb + **1–5 star** mastery; stars updated from mini-game scores / replay (define rule in §6).

---

## 4. Routes & components (suggested)

| Route | Purpose |
|-------|---------|
| `/topic/jungle` | Either redirect to `/topic/jungle/explore` or show map as default topic view. |
| `/topic/jungle/explore` | **AdventureMapPage** — panorama, hotspots, Milo, path SVG. |
| `/topic/jungle/explore/[regionId]` | Optional hub before mini-game. |
| `/topic/jungle/exercise/[gameId]` | Keep existing exercises for practice / deep links. |
| New game types | Register in `types/index.ts` `GameConfig['type']`, `ExercisePageClient`, and `TopicPageClient` GAME_VISUALS if needed. |

**New components (minimal set):**

- `AdventureMap.tsx` — layout, hotspots, lock state, Milo anchor.
- `MiloCompanion.tsx` — props: `mood: 'neutral' \| 'happy' \| 'think' \| 'talk'`, `pose` image key, optional `lineId` for TTS.
- `ExplorerLogbook.tsx` — tabs + panels.
- `HoneyBridgeGame`, `ShadowMatchGame`, `LilyPadCountGame`, `FruitCatchGame` — or staged behind feature flags.

---

## 5. Data model (TypeScript)

Place in `types/adventure.ts` (or extend `types/index.ts`).

```typescript
export type JungleRegionId = 'meadow' | 'cave' | 'swamp' | 'treehouse' | 'temple';

export type JungleBadgeId = 'bee' | 'tiger' | 'crocodile' | 'monkey';

export type JungleToolId = 'binoculars' | 'compass';

export interface JungleExplorerProgress {
  version: 1;
  /** Last region the child was guided to (for Milo / map focus). */
  currentRegion: JungleRegionId;
  /** Unlocked regions (always includes `meadow` after onboarding). */
  unlockedRegions: JungleRegionId[];
  /** Collected badges (max 4 before temple). */
  badges: JungleBadgeId[];
  toolsUnlocked: JungleToolId[];
  /** Mastery 1–5 per lemma (lowercase key). */
  wordMastery: Record<string, 1 | 2 | 3 | 4 | 5>;
  /** First-time region clears (for one-shot rewards). */
  regionFirstClear: Partial<Record<JungleRegionId, boolean>>;
}

// Merge into ProgressData:
// progressData.topics.jungle.explorer?: JungleExplorerProgress
```

**Migration:** On first load after deploy, if `explorer` missing but existing `TopicProgress.games` shows `jungle-vocab` completed, optionally seed `unlockedRegions: ['meadow','cave']` etc. — define conservative default: **only `meadow` unlocked**.

---

## 6. Progress rules (v1 defaults)

| Event | Update |
|-------|--------|
| Region game completed (first time) | `badges` += corresponding badge; `regionFirstClear[region]=true`; unlock next region in chain. |
| Region game replay | Increment `wordMastery` for words used in that session (+1 star cap per play, max 5) — tune later. |
| Temple completed | `badges` may add `explorer_master` optional fifth cosmetic OR mark `temple` cleared only; do not duplicate 4 biome badges. |
| Logbook tool tap | Play TTS only (no state change). |

**Integration with existing `GameProgress`:** Completing a region mini-game should **also** call existing `updateGameProgress` for a synthetic or linked `gameId` if you need stars on the old topic card view.

---

## 7. Milo (companion) — behaviour contract

- **Intro:** On map load and on first entry to each region, play one line from `adventureCopy.intro[regionId]` (JSON in `topics/jungle/adventure/copy.json` or TS module).
- **Correct:** Switch sprite to `milo-happy`, play `adventureCopy.successShort`.
- **Wrong:** `milo-think`, play `adventureCopy.encourageRetry` (no shaming).
- **Logbook:** Badge tap uses badge-specific praise string (English UI strings).

TTS: reuse `speak()` from `@/lib/audio`; Milo mouth animation optional v1 = bounce scale only.

---

## 8. Asset manifest — filenames, size, prompts

**Root folder:** `public/images/jungle/adventure/`

**Global style line** (prepend to every prompt; matches existing jungle pipeline):

```
Flat vector cartoon illustration, vibrant saturated colors, clean bold outlines,
cute rounded characters, large friendly eyes, no photorealism, no text or letters
on the image, no watermarks, child-friendly ESL app, square or noted aspect ratio, PNG.
```

### Background / alpha policy (read before generating)

| Output | Background | Why |
|--------|------------|-----|
| **Milo** (all poses), **region thumbs**, **lock icon**, **badges**, **tools**, **shadow silhouettes** | **Transparent PNG (alpha)** | Overlays on map, gradients, dark mode; avoids white halos in UI. |
| **Map panorama**, **mini-game hero plates**, **logbook cover** | **Opaque full-bleed** (sky, paper, scene fill edge-to-edge) | Background layers; no alpha needed. |
| **Path grass strip** (if raster) | **Transparent** preferred so it tiles over the path; if export has soft dirt edge only, **opaque** matching map ground color is acceptable. |

**Prompt suffix for alpha assets** — append to every row in §8.1, §8.2 (thumbs only), §8.3–8.5, §8.8:

`Export as PNG with transparent background (full alpha); subject only, no solid color backdrop, no drop-shadow plate behind the character or icon.`

**Prompt suffix for opaque assets** — append to map, heroes, logbook in §8.2 (panorama), §8.6–8.7:

`Full-bleed opaque illustration; edge-to-edge scene or paper; no transparency required.`

### 8.1 Milo (companion)

| File | Size | Prompt (append after global style) |
|------|------|-------------------------------------|
| `milo-neutral.png` | 512×512 | Milo the explorer mouse: small gray mouse, khaki vest with pockets, tiny safari hat, small satchel bag, standing facing camera slight 3/4 view, gentle smile. **Alpha:** transparent background, subject only. |
| `milo-happy.png` | 512×512 | Same Milo design; jumping or both paws up, big delighted smile, small sparkles or motion lines (no text). **Alpha:** transparent background. |
| `milo-think.png` | 512×512 | Same Milo design; one paw on chin, curious / pondering expression, small question mark shape as soft graphic element (no letter glyph). **Alpha:** transparent background. |
| `milo-talk.png` | 512×512 | Same Milo design; mouth a bit more open as if speaking, one paw gesturing forward, friendly. **Alpha:** transparent background. |

### 8.2 Map & regions (map UI)

| File | Size | Prompt |
|------|------|--------|
| `map-panorama-wide.png` | 1920×720 (or 2400×800) | Wide horizontal jungle adventure map; soft dirt path winding left to right; zones clearly readable: sunny meadow with beehives and flowers; rocky tiger cave entrance; green swamp with lily pads and reeds; tall tree with rope bridge / treehouse; small stone temple at far right; bright sky; empty path (no characters) so UI can overlay Milo and markers. **Opaque:** full-bleed scene, no transparency. |
| `region-meadow-thumb.png` | 256×256 | Circular or rounded icon: meadow with beehives and honey tones, cute, readable at small size. **Alpha:** transparent outside the icon shape. |
| `region-cave-thumb.png` | 256×256 | Icon: dark cave mouth shaped a bit like a friendly tiger silhouette, torches optional, not scary. **Alpha:** transparent. |
| `region-swamp-thumb.png` | 256×256 | Icon: swamp, lily pads, cute crocodile eyes peeking from water. **Alpha:** transparent. |
| `region-tree-thumb.png` | 256×256 | Icon: big tree + bananas + small wooden platform / rope ladder. **Alpha:** transparent. |
| `region-temple-thumb.png` | 256×256 | Icon: small ancient stone temple with vines, gem sparkle, inviting not creepy. **Alpha:** transparent. |

### 8.3 Locks & path (optional — can be SVG/CSS instead)

| File | Size | Prompt |
|------|------|--------|
| `icon-lock-region.png` | 128×128 | Simple padlock with leaf shape, flat icon, soft gray-green. **Alpha:** transparent background. |
| `path-segment-grass.png` | 256×64 | Short grass strip segment to tile under path line; seamless left-right edges if possible. **Alpha:** preferred (transparent between grass tufts); if opaque, use dirt/ground color matching `map-panorama-wide` so no white rim. |

### 8.4 Badges (Logbook + map reward burst)

| File | Size | Prompt |
|------|------|--------|
| `badge-bee.png` | 512×512 | Golden shiny badge shape, center icon: cute bee with small crown, simple rim. **Alpha:** transparent outside the badge rim (no white square). |
| `badge-tiger.png` | 512×512 | Badge: tiger paw print in center, orange and black, friendly not aggressive. **Alpha:** transparent. |
| `badge-crocodile.png` | 512×512 | Badge: stylized crocodile head side view, green scales shimmer, friendly eyes. **Alpha:** transparent. |
| `badge-monkey.png` | 512×512 | Badge: monkey face with explorer bandana, grin, banana motif small in corner. **Alpha:** transparent. |

### 8.5 Explorer tools (Logbook)

| File | Size | Prompt |
|------|------|--------|
| `tool-binoculars.png` | 512×512 | Cute golden binoculars, slightly oversized, soft highlights, a few jungle leaves tucked behind. **Alpha:** transparent background. |
| `tool-compass.png` | 512×512 | Cute vintage compass with warm brass tones, small vine wrap, clear readable needle (no letters on dial — use N/E/S/W as simple colored triangles only if needed, or blank dial). **Alpha:** transparent background. |

### 8.6 Logbook shell (optional)

| File | Size | Prompt |
|------|------|--------|
| `logbook-cover.png` | 800×600 | Open explorer journal with blank pages visible, leather corners, small Milo sticker on cover, no text on page, warm paper tone. **Opaque:** full-bleed illustration. |

### 8.7 Mini-game hero plates (v1 placeholders — gen when building each game)

| File | Size | Prompt |
|------|------|--------|
| `honey-bridge-hero.png` | 1024×576 | Meadow stream with stepping stones; beehive on left bank; small wooden bridge incomplete; fireflies; no characters so Milo can overlay. **Opaque:** full-bleed scene. |
| `shadow-cave-hero.png` | 1024×576 | Cave interior soft blue-gray; wall with round spotlight area empty (for silhouette asset); shiny flashlight beam as soft cone; friendly not dark horror. **Opaque:** full-bleed scene. |
| `swamp-lily-hero.png` | 1024×576 | Swamp top view or slight angle; lily pads; cute crocodile at bottom waiting; water sparkles. **Opaque:** full-bleed scene. |
| `fruit-tree-hero.png` | 1024×576 | Monkey tree canopy; hanging bananas, mangoes, coconuts clearly separated clusters; bright sky. **Opaque:** full-bleed scene. |

### 8.8 Shadow Match — silhouette pack (one per animal used in v1)

Reuse animal identity with **silhouette only** (same global style):

| File | Size | Prompt |
|------|------|--------|
| `shadow-bee.png` | 512×512 | Solid dark silhouette of cute bee, recognizable shape, centered. **Alpha:** transparent background; only the silhouette shape is opaque black or very dark green. |
| `shadow-frog.png` | 512×512 | Silhouette cute frog sitting. **Alpha:** transparent. |
| `shadow-tiger.png` | 512×512 | Silhouette baby tiger standing. **Alpha:** transparent. |
| `shadow-crocodile.png` | 512×512 | Silhouette friendly crocodile. **Alpha:** transparent. |
| `shadow-monkey.png` | 512×512 | Silhouette monkey with tail curled. **Alpha:** transparent. |

*(Add spider/lizard if Shadow Match difficulty expands.)*

---

## 9. Content JSON (suggested)

`topics/jungle/adventure/milo-lines.ts` — keys: `mapWelcome`, `regionEnter.{id}`, `badgePraise.{badgeId}`, `toolExplain.{toolId}`, `templeUnlock`.

English strings only (product rule).

---

## 10. Implementation phases

| Phase | Deliverable |
|-------|-------------|
| P0 | Asset folder + static map page + hotspots + `JungleExplorerProgress` load/save stub. |
| P1 | Milo component + TTS hooks + lock/unlock from progress. |
| P2 | One mini-game (e.g. Shadow Match) end-to-end + badge grant. |
| P3 | Remaining regions + temple link to `final-checkpoint`. |
| P4 | Logbook tabs + word bank wired to mastery updates. |
| P5 | Migrate / sync old `dependsOn` card topic view (optional coexist). |

---

## 11. QA checklist

- [ ] All new images under `public/images/jungle/adventure/` referenced by constant map in code.
- [ ] `localStorage` version bump if `ProgressData` shape changes.
- [ ] Temple only unlocks with 4 badges; final checkpoint still scores 13 steps.
- [ ] `npm run lint` && `npm run build` green.
- [ ] Dark mode: map overlay and logbook readable per `docs/DESIGN-SYSTEM.md`.

---

## 12. Original reference prompts (from design draft — optional variant)

If art direction later switches to **3D / Pixar** (not default for this repo):

- **Milo (3D):** `A cute, friendly little mouse named Milo, wearing a khaki explorer vest and a small safari hat. Pixar animation style, 3D render, vibrant colors, white background.`
- **Map (3D):** `A panoramic 3D adventure map for kids, isometric view. A dirt path leads through a sunny meadow with beehives, a tiger-shaped cave, a swamp with lily pads, and a giant treehouse. Paper-cut craft style, bright and cheerful.`
- **Badge sheet (3D):** `Set of 4 shiny 3D game badges for kids: a golden bee, a tiger paw, a green crocodile scale, and a monkey face. Glossy finish, vibrant colors, white background.`
- **Tools (3D):** `A golden magnifying glass and a vintage compass wrapped in jungle vines. 3D cute toy style, high detail, white background.`

Use **flat vector** prompts in §8 for consistency with existing jungle worksheets unless product explicitly approves 3D.
