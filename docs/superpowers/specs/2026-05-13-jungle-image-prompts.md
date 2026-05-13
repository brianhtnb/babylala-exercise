# Image Generation Prompts — Let's Go to the Jungle

## Context & Analysis

Bốn bài tập trong worksheet gốc đều dựa vào hình ảnh minh hoạ:

| Bài | Tên | Hình dùng |
|-----|-----|-----------|
| Ex 1 | Strike out redundant letters | 10 ảnh animal riêng lẻ (1 con/ảnh) |
| Ex 2 | Look & read, tick ✓ (2-sentence choice) | 5 ảnh scene nhỏ (mỗi scene 2 loài) |
| Ex 3 | Look at picture, write 1 word per blank | 1 ảnh panorama chứa TẤT CẢ động vật với số lượng cụ thể |
| Ex 4 | Look & read, write yes/no | 1 ảnh panorama khác (một số loài ẩn/vắng mặt) |

Sau khi có ảnh, các game sẽ được redesign thành:
- **SpellingGame** → dùng ảnh animal riêng lẻ (Category A)
- **ReadingQuizGame v2** → dùng ảnh scene 2 loài (Category B)
- **CountAndCompleteGame v2** → dùng ảnh panorama đếm (Category C)
- **Scene Reading game mới** → dùng ảnh panorama yes/no (Category D)

---

## Shared Art Style (áp dụng cho TẤT CẢ ảnh)

```
Art style: flat vector cartoon illustration, vibrant saturated colors,
clean bold outlines, no photorealism, no gradients (or very subtle).
Target audience: children 6–8 years old.
Characters: cute, rounded proportions, large expressive eyes, friendly expressions.
Inspired by: Babilala educational worksheet illustrations, slightly similar to
cartoon clip-art used in kids' ESL textbooks.
No text, no watermarks, no labels on the image itself.
```

---

## Category A — Individual Animal Illustrations (10 images)

**Purpose:** Dùng trong SpellingGame làm visual hint cho từng từ.  
**Style:** Animal đứng/ngồi trên nền trắng hoặc nền trong suốt.  
**Format:** PNG với nền trắng (hoặc transparent nếu công cụ hỗ trợ)  
**Size:** **800 × 800 px** (square)  
**File path sau khi gen:** `public/images/jungle/animals/`

---

### A-01 — bee
```
A single cheerful cartoon bee, flat vector illustration style.
Large round black-and-yellow striped body, small cute wings, big friendly eyes,
small smile. Slight side-facing pose showing wings. White background.
800x800px square.
```

---

### A-02 — tiger
```
A cute cartoon baby tiger, flat vector illustration style.
Orange fur with black stripes, white chest, round chubby body, big round eyes,
small fluffy tail curled up, friendly smile. Slight 3/4 angle pose.
White background. 800x800px square.
```

---

### A-03 — frog
```
A cute cartoon frog, flat vector illustration style.
Bright green round body, large round eyes on top of head, white belly,
wide friendly smile, sitting pose. Optional: small lily pad underneath.
White background. 800x800px square.
```

---

### A-04 — lizard
```
A cute cartoon chameleon/lizard, flat vector illustration style.
Bright green scaly body, curly tail, large round eyes, friendly expression,
walking or sitting pose. White background. 800x800px square.
```

---

### A-05 — monkey
```
A cute cartoon monkey, flat vector illustration style.
Brown body, lighter brown face and belly, long tail curling up,
big round eyes, wide smile showing teeth, one arm raised or holding a vine.
White background. 800x800px square.
```

---

### A-06 — spider
```
A cute cartoon spider (non-scary, friendly design for kids), flat vector
illustration style. Round purple or dark blue body, 8 short rounded legs,
big googly eyes, small smile. Optional: hanging from a tiny thread.
White background. 800x800px square.
```

---

### A-07 — crocodile
```
A cute cartoon crocodile, flat vector illustration style.
Green scaly body, wide toothy grin (friendly, not scary), stubby legs,
long tail, lying down or walking pose. White background. 800x800px square.
```

---

### A-08 — elephant
```
A cute cartoon elephant, flat vector illustration style.
Light grey round body, big ears, long trunk curling upward playfully,
small tail, big round friendly eyes, standing pose.
White background. 800x800px square.
```

---

### A-09 — rabbit
```
A cute cartoon rabbit, flat vector illustration style.
White fluffy body, long upright ears with pink inside, pink nose,
big round eyes, short fluffy tail, sitting pose.
White background. 800x800px square.
```

---

### A-10 — snake
```
A cute cartoon snake (friendly, non-threatening design for kids),
flat vector illustration style. Green scaly body coiled in a spiral or S-shape,
small forked tongue sticking out playfully, big round friendly eyes, small smile.
White background. 800x800px square.
```

---

## Category B — Small Scene Images (5 images)

**Purpose:** Dùng trong ReadingQuizGame — mỗi câu hỏi hiển thị 1 scene nhỏ với 2 loài động vật, học sinh chọn câu mô tả đúng.  
**Format:** JPG hoặc PNG  
**Size:** **1200 × 675 px** (16:9 landscape)  
**File path sau khi gen:** `public/images/jungle/scenes/`  
**Lưu ý:** Mỗi scene phải rõ ràng thể hiện ĐÚNG 2 loài động vật được yêu cầu (không thêm loài khác).

---

### B-01 — Frogs & Crocodiles scene
**Correct sentence:** "Frogs live here. Crocodiles live here too."  
**File name:** `scene-frogs-crocodiles.jpg`
```
A colorful cartoon jungle river/pond scene for children.
Setting: blue-green river or pond with lily pads, tropical plants,
lush green banks, bright sky.
Animals present (clearly visible, cute cartoon style):
- 3 green cartoon frogs sitting on lily pads in the water
- 2 cartoon crocodiles floating in the water showing their backs and eyes
No other animals. Flat vector cartoon illustration, vibrant colors, kid-friendly.
1200x675px landscape.
```

---

### B-02 — Bees & Monkeys scene
**Correct sentence:** "Bees live here. Monkeys live here too."  
**File name:** `scene-bees-monkeys.jpg`
```
A colorful cartoon jungle treetop scene for children.
Setting: tall green jungle trees with thick canopy, bright blue sky,
tropical flowers, hanging vines.
Animals present (clearly visible, cute cartoon style):
- 4 cartoon bees buzzing around yellow flowers or a hive
- 2 cute cartoon monkeys swinging on vines or sitting in tree branches
No other animals. Flat vector cartoon illustration, vibrant colors, kid-friendly.
1200x675px landscape.
```

---

### B-03 — Spiders & Lizards scene
**Correct sentence:** "Spiders live here. Lizards live here too."  
**File name:** `scene-spiders-lizards.jpg`
```
A colorful cartoon dense jungle/undergrowth scene for children.
Setting: large tree trunks, mossy rocks, green ferns and leaves,
thick jungle vegetation, dappled light.
Animals present (clearly visible, cute cartoon style):
- 3 cute cartoon spiders (purple/dark, friendly faces) hanging from silk threads between trees
- 3 colorful cartoon chameleon/lizards climbing on tree trunks or sitting on rocks
No other animals. Flat vector cartoon illustration, vibrant colors, kid-friendly.
1200x675px landscape.
```

---

### B-04 — Bees & Lizards scene
**Correct sentence:** "Lizards live here. Bees live here too."  
**File name:** `scene-bees-lizards.jpg`
```
A colorful cartoon sunny jungle meadow/garden scene for children.
Setting: grassy clearing with tropical flowers (daisies, sunflowers),
a large golden beehive hanging from a tree, green bushes, bright sunshine.
Animals present (clearly visible, cute cartoon style):
- 4 cute cartoon bees flying near the beehive and flowers
- 3 cartoon chameleon/lizards sitting on rocks and green leaves
No other animals. Flat vector cartoon illustration, vibrant colors, kid-friendly.
1200x675px landscape.
```

---

### B-05 — Tigers & Crocodiles scene
**Correct sentence:** "Tigers live here. Crocodiles live here too."  
**File name:** `scene-tigers-crocodiles.jpg`
```
A colorful cartoon jungle river bank scene for children.
Setting: muddy river bank with brown water, jungle trees and tall grass,
tropical plants, partly cloudy sky.
Animals present (clearly visible, cute cartoon style):
- 2 cute cartoon baby tigers standing or playing near the river bank
- 2 cartoon crocodiles half-submerged in the river showing eyes and back ridges
No other animals. Flat vector cartoon illustration, vibrant colors, kid-friendly.
1200x675px landscape.
```

---

## Category C — Panoramic Counting Scene (1 image)

**Purpose:** Dùng trong CountAndCompleteGame — học sinh nhìn ảnh và đếm số lượng từng loài để điền vào câu.  
**Format:** JPG  
**Size:** **1600 × 900 px** (16:9, wide panorama)  
**File path:** `public/images/jungle/panorama-counting.jpg`  
**⚠️ Quan trọng:** Số lượng mỗi loài phải chính xác, dễ đếm, không bị che khuất.

**Số lượng chính xác phải có trong ảnh:**
| Loài | Số lượng | Vị trí gợi ý |
|------|----------|--------------|
| spider | 6 | Treo trên mạng nhện từ cành cây |
| monkey | 3 | Đu dây/ngồi trên cành cây cao |
| lizard | 4 | Đứng trên đá/thân cây thấp |
| tiger | 1 | Nằm/ngồi giữa cảnh bụi cây |
| bee | 7 | Bay gần hoa/tổ ong |
| frog | 5 | Ngồi trên lá sen giữa hồ |
| crocodile | 2 | Nổi trong hồ nước |

```
A wide colorful cartoon jungle panoramic scene for children's educational game.
The scene must contain EXACTLY the following animal counts (no more, no less),
each clearly visible and individually countable:
- 6 cute cartoon spiders hanging from webs between tree branches (top area)
- 3 cute cartoon monkeys swinging on vines or sitting in treetops (upper middle)
- 4 cartoon chameleon/lizards on rocks and low tree trunks (middle ground)
- 1 cute cartoon tiger sitting or lying in the middle of the jungle (center)
- 7 cartoon bees flying near a beehive and tropical flowers (right side)
- 5 green cartoon frogs sitting on lily pads in a pond/river (lower middle)
- 2 cartoon crocodiles floating in the pond/river (lower area)

Scene composition: tall jungle trees in background, blue sky peeking through
canopy, a blue pond/river in the lower portion with lily pads, green grass
and rocks in the midground, colorful tropical flowers on the right side,
a large golden beehive hanging from a tree branch on the right.

Art style: flat vector cartoon illustration, vibrant saturated colors,
all animals cute and clearly distinguishable, no overlapping that hides animals,
each animal fully visible to allow counting. Very colorful, kid-friendly.
1600x900px landscape.
```

---

## Category D — Yes/No Scene (1 image)

**Purpose:** Dùng trong game "Who Lives Here?" mới — học sinh nhìn ảnh và trả lời yes/no cho từng câu.  
**Format:** JPG  
**Size:** **1600 × 900 px** (16:9, wide panorama)  
**File path:** `public/images/jungle/panorama-yesno.jpg`

**Động vật CÓ trong ảnh (YES):**
- tiger ✅
- crocodile ✅
- bee ✅ (+ beehive)
- rabbit ✅
- elephant ✅
- lizard ✅
- snake ✅

**Động vật KHÔNG có trong ảnh (NO):**
- frog ❌
- monkey ❌
- spider ❌

```
A wide colorful cartoon jungle scene for children's educational game.
The scene should clearly show ONLY the following animals (no others):
- 1 cute cartoon tiger standing near jungle bushes
- 1 cartoon crocodile in or near the water/river
- Several cartoon bees buzzing around a large golden beehive in a tree
- 1 cute white cartoon rabbit near some flowers or grass
- 1 big friendly cartoon elephant with trunk raised, standing prominently
- 2 cartoon lizards/chameleons on rocks or tree bark
- 1 cartoon snake coiled on a tree branch or rock

The following animals must NOT appear: no frogs, no monkeys, no spiders.

Scene setting: lush green jungle, a calm river/stream in the lower portion,
tall trees with vines, tropical flowers (especially daisies and sunflowers),
a golden beehive hanging from a branch, bright daylight sky visible through
the canopy, green grassy banks.

Art style: flat vector cartoon illustration, vibrant saturated colors,
all animals clearly visible and recognizable, cute friendly designs.
Kid-friendly educational illustration style.
1600x900px landscape.
```

---

## Tóm tắt file cần gen

| # | Category | File name | Size | Quantity |
|---|----------|-----------|------|----------|
| A-01 | Animal | `bee.png` | 800×800 | 1 |
| A-02 | Animal | `tiger.png` | 800×800 | 1 |
| A-03 | Animal | `frog.png` | 800×800 | 1 |
| A-04 | Animal | `lizard.png` | 800×800 | 1 |
| A-05 | Animal | `monkey.png` | 800×800 | 1 |
| A-06 | Animal | `spider.png` | 800×800 | 1 |
| A-07 | Animal | `crocodile.png` | 800×800 | 1 |
| A-08 | Animal | `elephant.png` | 800×800 | 1 |
| A-09 | Animal | `rabbit.png` | 800×800 | 1 |
| A-10 | Animal | `snake.png` | 800×800 | 1 |
| B-01 | Scene | `scene-frogs-crocodiles.jpg` | 1200×675 | 1 |
| B-02 | Scene | `scene-bees-monkeys.jpg` | 1200×675 | 1 |
| B-03 | Scene | `scene-spiders-lizards.jpg` | 1200×675 | 1 |
| B-04 | Scene | `scene-bees-lizards.jpg` | 1200×675 | 1 |
| B-05 | Scene | `scene-tigers-crocodiles.jpg` | 1200×675 | 1 |
| C | Panorama | `panorama-counting.jpg` | 1600×900 | 1 |
| D | Panorama | `panorama-yesno.jpg` | 1600×900 | 1 |

**Tổng: 17 ảnh**

---

## Sau khi gen xong

Đặt ảnh vào đúng folder:
```
public/
└── images/
    └── jungle/
        ├── animals/
        │   ├── bee.png
        │   ├── tiger.png
        │   ├── frog.png
        │   ├── lizard.png
        │   ├── monkey.png
        │   ├── spider.png
        │   ├── crocodile.png
        │   ├── elephant.png
        │   ├── rabbit.png
        │   └── snake.png
        ├── scenes/
        │   ├── scene-frogs-crocodiles.jpg
        │   ├── scene-bees-monkeys.jpg
        │   ├── scene-spiders-lizards.jpg
        │   ├── scene-bees-lizards.jpg
        │   └── scene-tigers-crocodiles.jpg
        ├── panorama-counting.jpg
        └── panorama-yesno.jpg
```

Sau đó sẽ implement:
1. **SpellingGame** redesign — thay emoji bằng `<Image>` component dùng ảnh animal
2. **ReadingQuizGame v2** — show scene image per question, chọn câu đúng trong 2 câu (thay vì True/False facts)
3. **CountAndCompleteGame v2** — show panorama-counting.jpg, đếm số loài trong ảnh để điền blank
4. **SceneReadingGame (mới)** — show panorama-yesno.jpg, answer YES/NO per animal
