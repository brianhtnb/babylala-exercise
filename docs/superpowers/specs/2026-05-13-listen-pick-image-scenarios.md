# Listen & pick the right picture — content spec (ages 5–6)

**Status:** Content locked to **7 jungle animals** (no elephant, rabbit, snake): bee, crocodile, frog, lizard, monkey, spider, tiger — one exercise item per animal.

**After image gen:** suggested folder `public/images/jungle/listen-pick/` — see prompts below for filenames.

---

## Exercise pattern

1. **On screen:** One short question + **three pictures** (A / B / C).  
2. **Audio:** Two–three short lines; one line states the answer clearly.  
3. **Child taps** the picture that matches what they heard.

**Design rules (5–6)**

- **4–10 words** per line; present tense; concrete places/actions.  
- **One** clear answer line; other lines are simple warm-up or context.

---

## Scenario list (7 items)

| # | Question | Picture A | Picture B | Picture C | Correct | Listening script |
|---|----------|-----------|-----------|-----------|---------|-------------------|
| 1 | Where is the monkey? | Monkey **in the water** (pond) | Monkey **on a tree branch** | Monkey **eating a banana** on the grass | **B** | “I see a monkey! Look up! The monkey is on the tree. Can you see it?” |
| 2 | Where is the frog? | Frog **on a lily pad** in the pond | Frog **under a big leaf** | Frog **jumping** in the air | **A** | “Shh… listen. The frog is sitting on the lily pad. It is very quiet.” |
| 3 | What is the tiger doing? | Tiger **sleeping** under a tree | Tiger **drinking** at the river | Tiger **running** fast | **B** | “The tiger is thirsty. It goes to the water. The tiger is drinking at the river.” |
| 4 | Where is the bee? | Bee **on a flower** | Bee **near the beehive** | Bee **flying** high in the sky | **A** | “Buzz, buzz! The bee likes the red flower. The bee is on the flower now.” |
| 5 | Where is the crocodile? | Crocodile **on the grass** | Crocodile **in the river** (head/eyes above water) | Crocodile **up in a tree** (silly wrong) | **B** | “Splash! The crocodile loves the water. The crocodile is in the river.” |
| 6 | Where is the spider? | Spider **on a big web** between trees | Spider **on a monkey’s tail** (cartoon) | Spider **in the water** | **A** | “Look between the trees. The spider made a web. The spider is on the big web.” |
| 7 | What is the lizard doing? | Lizard **on a rock** in the sun | Lizard **in shallow water** at the edge | Lizard **hanging from a vine** high up | **A** | “The sun is warm. The lizard likes the rock. The lizard is on the rock in the sun.” |

**Note:** Item 7 option C changed from “in the sky” to **hanging from a vine** — still wrong for the script but **realistic** jungle action (decoy).

---

## Vocabulary scope

Topic words for this game type: **bee, crocodile, frog, lizard, monkey, spider, tiger** (7).

---

## Next steps (implementation)

1. Drop generated files under `public/images/jungle/listen-pick/` using filenames below.  
2. Add `topics/jungle/games/listen-pick-image.ts` (or similar) + new `GameConfig` type + UI component.  
3. Wire TTS with the listening script per item.

---

## Optional UI titles

- **Working title:** “Listen and pick”  
- **Kid-friendly:** “Which picture?” / “Tap the right picture!”

---

# Image generation prompts (21 images)

Use the **same art style** as existing jungle assets (`docs/superpowers/specs/2026-05-13-jungle-image-prompts.md` — flat vector, vibrant, kid-friendly, bold outlines, **no text** on the image).

**Global rules for all 21 images**

- Flat vector cartoon, cute rounded shapes, big friendly eyes, bright jungle colors.  
- **No letters, numbers, watermarks, or UI** in the image.  
- **Square canvas:** **768 × 768 px**, PNG.  
- One focal animal per image; background simple so A/B/C stay easy to tell apart at thumbnail size.

**Suggested output paths** (rename if your pipeline differs):

```
public/images/jungle/listen-pick/q01-a.png … q01-c.png
public/images/jungle/listen-pick/q02-a.png … q02-c.png
… through q07-c.png
```

Below, each block is **one full prompt** you can paste into your image tool (prepend the global style line once if your tool supports a “style preset” instead).

**Style line (prepend or use as preset):**

```
Flat vector cartoon illustration, vibrant jungle colors, clean bold outlines,
cute rounded animal characters with large friendly eyes, no photorealism,
no text or letters on the image, child-friendly ESL app style,
768x768 square PNG, centered composition.
```

---

### Q1 — Monkey (Where is the monkey?) — correct **B**

**File `q01-a.png` — monkey in water**

```
Same style. A cute cartoon monkey half-submerged in a blue jungle pond,
only head and shoulders and arms visible above water, smiling, small
splashes. Green bank and one palm behind. Not on a tree. 768x768 square.
```

**File `q01-b.png` — monkey on tree (CORRECT)**

```
Same style. A cute cartoon monkey sitting on a thick brown tree branch,
holding the branch with hands and tail, happy face, blue sky and leaves
visible. Clearly on the tree, not in water, not eating. 768x768 square.
```

**File `q01-c.png` — monkey eating banana on grass**

```
Same style. A cute cartoon monkey sitting on green grass, holding and
eating a yellow banana, happy. Small flowers nearby. Not in water,
not on a tree branch. 768x768 square.
```

---

### Q2 — Frog (Where is the frog?) — correct **A**

**File `q02-a.png` — frog on lily pad (CORRECT)**

```
Same style. A cute green cartoon frog sitting on a round green lily pad
in calm blue pond water, front view, big smile. One or two extra empty
lily pads optional. 768x768 square.
```

**File `q02-b.png` — frog under leaf**

```
Same style. A cute green cartoon frog peeking out under a large tropical
leaf, mostly shaded, eyes visible, not on a lily pad. 768x768 square.
```

**File `q02-c.png` — frog jumping**

```
Same style. A cute green cartoon frog mid-jump above the pond, legs
stretched, happy, no lily pad under it. Simple blue water below.
768x768 square.
```

---

### Q3 — Tiger (What is the tiger doing?) — correct **B**

**File `q03-a.png` — tiger sleeping**

```
Same style. A cute cartoon baby tiger curled up sleeping under a tree,
eyes closed, peaceful. Not near water. 768x768 square.
```

**File `q03-b.png` — tiger drinking at river (CORRECT)**

```
Same style. A cute cartoon baby tiger at the edge of a blue river,
head lowered drinking water, eyes open, friendly. Clear drinking pose.
768x768 square.
```

**File `q03-c.png` — tiger running**

```
Same style. A cute cartoon baby tiger running fast on green grass,
dynamic pose, dust optional as soft shapes only. Not sleeping, not
at river. 768x768 square.
```

---

### Q4 — Bee (Where is the bee?) — correct **A**

**File `q04-a.png` — bee on flower (CORRECT)**

```
Same style. A cute cartoon bee resting on a large red or pink flower,
wings visible, smiling. Green jungle background soft blur. 768x768 square.
```

**File `q04-b.png` — bee near beehive**

```
Same style. A cute cartoon bee flying close to a yellow beehive hanging
from a branch, not touching a flower. Hive clearly visible. 768x768 square.
```

**File `q04-c.png` — bee high in sky**

```
Same style. A cute cartoon bee flying high with open blue sky and a few
soft clouds, far from flowers and beehive. 768x768 square.
```

---

### Q5 — Crocodile (Where is the crocodile?) — correct **B**

**File `q05-a.png` — crocodile on grass**

```
Same style. A cute friendly green cartoon crocodile standing on green
grass with simple jungle plants, full body visible, smiling. Not in
water. 768x768 square.
```

**File `q05-b.png` — crocodile in river (CORRECT)**

```
Same style. A cute friendly green cartoon crocodile mostly in blue river
water, head and back and eyes above water, smile, small ripples.
Clearly in the river. 768x768 square.
```

**File `q05-c.png` — crocodile in tree (silly)**

```
Same style. A cute friendly green cartoon crocodile awkwardly draped on
a thick tree branch, silly but harmless expression, cartoon logic.
768x768 square.
```

---

### Q6 — Spider (Where is the spider?) — correct **A**

**File `q06-a.png` — spider on web (CORRECT)**

```
Same style. A cute cartoon purple or green spider sitting in the center
of a large round web between two tree trunks, friendly face. Web clearly
visible. 768x768 square.
```

**File `q06-b.png` — spider on monkey tail**

```
Same style. A small cute cartoon spider on the tail of a happy cartoon
monkey; monkey looks surprised but friendly. Spider not on a web.
768x768 square.
```

**File `q06-c.png` — spider in water**

```
Same style. A cute cartoon spider floating or standing on water surface
unrealistically, silly splash, no web. 768x768 square.
```

---

### Q7 — Lizard (What is the lizard doing?) — correct **A**

**File `q07-a.png` — lizard on rock in sun (CORRECT)**

```
Same style. A cute cartoon green lizard or chameleon sitting on a warm
brown rock, sunny jungle light, happy eyes, tail curled on rock. Not in
water. 768x768 square.
```

**File `q07-b.png` — lizard in shallow water**

```
Same style. The same cute cartoon green lizard standing in shallow clear
water at pond edge, feet wet, small ripples. Not on a dry rock.
768x768 square.
```

**File `q07-c.png` — lizard on vine**

```
Same style. A cute cartoon green lizard climbing or hanging from a
jungle vine mid-air, playful pose. Not on a rock. 768x768 square.
```

---

## Checklist before you generate

- [ ] 21 files, naming `q01-a` … `q07-c` (or your convention).  
- [ ] Same aspect ratio and style across the set for UI grid consistency.  
- [ ] Re-run any image that looks too dark or too busy at small size.

After files are in place, implementation can map:

| Item | `a` | `b` | `c` | correct |
|------|-----|-----|-----|---------|
| 1 | A | **B** | C | b |
| 2 | **A** | B | C | a |
| 3 | A | **B** | C | b |
| 4 | **A** | B | C | a |
| 5 | A | **B** | C | b |
| 6 | **A** | B | C | a |
| 7 | **A** | B | C | a |
