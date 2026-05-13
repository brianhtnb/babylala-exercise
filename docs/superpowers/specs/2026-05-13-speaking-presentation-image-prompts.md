# Speaking Presentation — image generation prompts (3 scenarios)

**Purpose:** Hero art for the final jungle game (`SpeakingPresentationGame`). One image per scenario, shown beside the script.

**Output folder:** `public/images/jungle/speaking-present/`  
**Filenames (required):** `scenario-1.png`, `scenario-2.png`, `scenario-3.png`

**Format:** PNG, **1200 × 900 px** (4:3), no text on the image.

---

## Variety rule (read this first)

The three images must **not** look like the same template with one animal swapped out. Aim for **three clearly different “posters”** at thumbnail size:

| | **Scenario 1** | **Scenario 2** | **Scenario 3** |
|---|----------------|----------------|----------------|
| **Layout** | Wide layered panorama, lots of depth | Strong diagonal or asymmetric crop; fewer props | Bold split (land vs water) or tall framing (vines/waterfall) |
| **Colour story** | Warm daylight: yellow-greens, cyan water | High pop contrast: hot yellows, deep violets, punchy accents | Cool dusk or mist: teals, blues, orange rim-light on fur |
| **Illustration treatment** | Soft rounded vector / storybook flat | Geometric cutouts or paper-craft look with hard shadow shapes | Ink line + limited flats, or soft watercolor wash under lines |
| **Animal mood** | Busy, playful, **mixed** expressions OK | Size contrast first; tiger cool or unimpressed, frog tiny and alert, bees **neutral busy** | Majestic or **alert** tigers; crocs patient and still (not “evil”, not gore); frogs optional, small |

**Mood:** Animals do **not** all need to look cuddly or smiling. Use **curious, focused, sleepy, annoyed, proud, sneaky, startled** — still **non-scary** for ages 5–6 (no blood, no horror faces, no “attack” poses).

**Script alignment (in-app):** Copy lives in `topics/jungle/games/speaking-presentation.ts` and follows the shipped PNGs — e.g. night / sad tigers / quiet jungle for scenario 3, not “cute and friendly.” Regenerate art to match that file if you change pictures again.

---

## Explorer kids (same characters, different framing each time)

Optional but good for continuity with your worksheet:

- **Same outfit identity** across all three (tan safari hat, tan shirt/shorts, small colourful backpack).
- **Change how they appear each time** so layouts stay fresh: e.g. (1) full figures bottom corner watching the chaos, (2) seen from behind or cropped at waist, looking up the diagonal, (3) small figures on a grassy ledge, silhouetted slightly against water mist.
- **No** speech bubbles, captions, logos, or readable text on clothes.

**Short explorer add-on (trim or rewrite per scenario):**

```
Same two child explorers in tan safari outfits and small backpacks; placement and
scale differ from other slides—no speech bubbles or written text.
```

---

## Technical baseline (prepend if your model needs a single safety line)

```
Cartoon illustration for children, not photorealistic, no text or letters anywhere,
no watermarks, 1200x900 landscape 4:3.
```

Do **not** reuse one identical “flat vector + happy faces” block for all three; each scenario below carries its **own** style and composition instructions.

---

## Scenario 1 — `scenario-1.png` (“Busy jungle”)

**Must match the script:** monkeys (one can jump), frogs, tiger, bees, spiders, crocodiles — all **readable** and findable.

**Direction — “layered festival panorama”**

```
1200x900 landscape. Wide busy jungle panorama with clear depth layers: back trees,
mid vines and webs, front pond edge. Warm golden-daylight palette (yellow-greens,
sunlit leaves, cyan-blue water). Soft rounded vector or gentle storybook-flat look,
clean shapes, not hyper-cute on every face.

Include: several monkeys (one mid-jump or landing), frogs on lily pads, one young
tiger on the grass (curious or playful, not a sticker-smile required), small bees
in motion streaks, purple spiders on webs, a crocodile partly in water (calm,
watchful). Mix expressions: some animals busy, one distracted, one looking at the
viewer.

Optional: two child explorers bottom foreground, small-to-medium, watching the scene.
No text. No elephant or rabbit needed; do not center a random new large mammal.
```

---

## Scenario 2 — `scenario-2.png` (“Bees & friends”)

**Must match the script:** small bees flying, **big** tiger + **little** frog, monkey **in a tree**. **No elephant, no rabbit, no snake.**

**Direction — “pop poster diagonal”**

```
1200x900 landscape. NOT a centered clearing postcard. Use a bold diagonal: thick
tree branch enters from upper corner; monkey sits along that diagonal; bees form
a swooping line or cluster that leads the eye; big tiger and tiny frog sit off-center
for strong size contrast (frog could be on a pebble, tiger on grass).

Palette: high pop contrast—hot yellow or pale lemon sky band, deep violet or
indigo shadows, saturated orange tiger, mint or lime frog. Illustration: geometric
cutout shapes, paper-craft feel, or simplified poster-flat art with hard shadow
shapes (different from Scenario 1’s soft rounds).

Moods: tiger cool, bored, or mildly skeptical; frog very small and alert; monkey
curious or mischievous; bees neutral, busy, not “kawaii swarms”. Optional beehive
silhouette in background. Optional explorers: cropped or from behind along the
bottom edge. No text. Absolutely no elephant, rabbit, or snake.
```

---

## Scenario 3 — `scenario-3.png` (“Tigers & crocs”)

**Must match the script:** tigers on grass, crocodiles in river; optional small frogs for “Frogs live here too”.

**Direction — “misty river split”**

```
1200x900 landscape. Strong composition change from 1 and 2: horizontal band split
between sunlit grass bank and wide cool river, OR vertical frame with hanging vines
and a waterfall mist wedge. Twilight, overcast, or “blue hour” colour story: teals,
blue-greens, cool grey mist; warm orange rim-light on tiger stripes only.

Illustration: ink outlines with flat limited colours, OR line art with soft
watercolor washes—visibly different technique from Scenarios 1 and 2.

Tigers on grass: proud, alert, or resting with sharp eyes—not required to grin.
Crocodiles in water: still, patient, slightly mysterious; friendly enough for kids
but not baby-talk cute. Optional small frogs on rocks or pads, subdued. Optional
explorers small on the bank with wind-tossed leaves. No text.
```

---

## Checklist after generation

- [ ] Exact filenames: `scenario-1.png`, `scenario-2.png`, `scenario-3.png`
- [ ] **At a glance**, the three thumbnails look like **different layouts and colour stories**, not one base art file
- [ ] Scenario 2 contains **no elephant, no rabbit, no snake**
- [ ] All required animals for that scenario’s script are still easy to point at
- [ ] No on-image text, bubbles, or UI chrome; explorers optional but consistent outfit if used
