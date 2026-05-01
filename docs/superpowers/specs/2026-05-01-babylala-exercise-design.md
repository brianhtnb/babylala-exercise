# Babylala Exercise - English Learning Website for Kids

**Date:** 2026-05-01  
**Status:** Design Approved  
**Tech Stack:** Next.js 14 + TypeScript + Tailwind CSS

## Overview

A touch-first, iPad-optimized learning web application for children ages 4-6 learning English through the Babylala curriculum. The app features topic-based exercises with interactive games, sound effects, text-to-speech, and progress tracking.

### Key Features
- Topic selection hub (modular for adding new topics)
- 4-5 interactive games per topic
- Progress tracking with localStorage
- Sound effects and text-to-speech
- Large touch targets for children
- PWA support for "install as app" experience on iPad

---

## Architecture

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Storage:** Browser localStorage (no backend)

### Directory Structure

```
/
├── app/
│   ├── page.tsx                    # Topic selection hub
│   ├── layout.tsx                  # Root layout with global styles
│   ├── globals.css                 # Global styles + animations
│   ├── topic/[id]/                 # Dynamic topic routes
│   │   ├── page.tsx                # Topic intro screen
│   │   ├── exercise/[exerciseId]/  # Exercise screens
│   │   └── layout.tsx              # Topic-specific layout
│   └── components/
│       ├── common/                 # Reusable UI components
│       │   ├── Button.tsx          # Large touch-friendly buttons
│       │   ├── Card.tsx            # Game/exercise cards
│       │   ├── Modal.tsx           # Celebration modals
│       │   ├── ProgressBar.tsx     # Progress indicators
│       │   └── StarDisplay.tsx     # Star rating display
│       ├── exercises/              # Exercise-specific components
│       │   ├── CountGame.tsx       # Count items game
│       │   ├── SequenceGame.tsx    # Missing number game
│       │   ├── TraceGame.tsx       # Number tracing game
│       │   └── RolePlayGame.tsx    # Dialogue practice game
│       ├── layout/                 # Navigation components
│       │   ├── Header.tsx          # App header with back button
│       │   ├── TopicGrid.tsx       # Topic selection grid
│       │   └── Navigation.tsx      # Bottom navigation
│       └── games/                  # Shared game logic
│           ├── CountDisplay.tsx    # Visual counter component
│           ├── DragDropZone.tsx    # Drag and drop container
│           └── TracingCanvas.tsx   # Canvas for tracing
├── topics/                         # Topic data & configurations
│   └── numbers-11-20/
│       ├── config.json             # Topic metadata, games list
│       ├── assets/                 # Images for this topic
│       │   ├── fruits/             # Fruit counting images
│       │   ├── animals/            # Animal counting images
│       │   └── backgrounds/        # Scene backgrounds
│       └── games/
│           ├── count-and-choose.ts # Game configurations
│           ├── trace-the-number.ts
│           ├── missing-number.ts
│           └── role-play.ts
├── lib/
│   ├── storage.ts                  # localStorage wrapper with types
│   ├── audio.ts                    # Audio & Speech synthesis utilities
│   ├── progress.ts                 # Progress tracking logic
│   └── utils.ts                    # Helper utilities
├── public/
│   ├── sounds/                     # Sound effect files
│   │   ├── correct.mp3             # Success sound
│   │   ├── incorrect.mp3           # Try again sound
│   │   ├── celebration.mp3         # Game complete fanfare
│   │   ├── click.mp3               # Button tap sound
│   │   └── background.mp3          # Optional background music
│   ├── images/                     # Static images
│   └── manifest.json               # PWA manifest
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Component Design Principles

1. **Touch-First**: Minimum 80x80px tap targets, no hover-dependent interactions
2. **Stateless where possible**: Use React hooks for state, lift state when shared
3. **Accessible**: High contrast, screen reader support, keyboard navigation
4. **Animated**: CSS transitions for feedback, Framer Motion for complex animations

---

## Data Model

### Topic Configuration Schema

```typescript
interface TopicConfig {
  id: string;                    // URL-friendly ID
  title: string;                 // Display name
  icon: string;                  // Emoji or icon path
  color: string;                 // Tailwind color class
  vocabulary: string[];          // New words to learn
  sentences: string[];           // Sentence patterns
  games: GameConfig[];           // List of games in this topic
}

interface GameConfig {
  id: string;                    // Unique game ID
  type: 'counting' | 'sequence' | 'writing' | 'dialogue';
  title: string;                 // Display title
  description: string;           // Brief description for kids
  difficulty: 1 | 2 | 3;         // Difficulty level
  dependsOn?: string[];          // Prerequisites (game IDs)
}
```

### Example: Numbers 11-20 Config

```json
{
  "id": "numbers-11-20",
  "title": "Numbers 11-20",
  "icon": "🔢",
  "color": "bg-blue-500",
  "vocabulary": ["eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
  "sentences": ["How many ___ are there?", "There are ___"],
  "games": [
    {
      "id": "count-and-choose",
      "type": "counting",
      "title": "Count the Items",
      "description": "Count the fruits and animals!",
      "difficulty": 1
    },
    {
      "id": "missing-number",
      "type": "sequence",
      "title": "Find the Missing Number",
      "description": "Put the missing number in place!",
      "difficulty": 2,
      "dependsOn": ["count-and-choose"]
    },
    {
      "id": "trace-number",
      "type": "writing",
      "title": "Trace the Number",
      "description": "Draw the number with your finger!",
      "difficulty": 2,
      "dependsOn": ["count-and-choose"]
    },
    {
      "id": "role-play",
      "type": "dialogue",
      "title": "Ask and Answer",
      "description": "Practice asking and answering!",
      "difficulty": 3,
      "dependsOn": ["missing-number", "trace-number"]
    }
  ]
}
```

### Progress Tracking Schema

```typescript
interface ProgressData {
  version: number;               // For migration if needed
  topics: {
    [topicId: string]: TopicProgress;
  };
  lastPlayed: string;            // Last topic played
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
  };
}

interface TopicProgress {
  completed: boolean;            // All games completed
  totalStars: number;            // 0-12 stars (3 per game x 4 games)
  games: {
    [gameId: string]: GameProgress;
  };
}

interface GameProgress {
  completed: boolean;
  highScore: number;             // Best score out of 10
  stars: number;                 // 0-3 stars
  lastPlayed: string;            // ISO timestamp
  attempts: number;              // Number of tries
}
```

### Example Progress Entry

```json
{
  "version": 1,
  "topics": {
    "numbers-11-20": {
      "completed": false,
      "totalStars": 5,
      "games": {
        "count-and-choose": {
          "completed": true,
          "highScore": 8,
          "stars": 2,
          "lastPlayed": "2026-05-01T10:30:00Z",
          "attempts": 3
        },
        "missing-number": {
          "completed": false,
          "highScore": 0,
          "stars": 0,
          "lastPlayed": null,
          "attempts": 0
        }
      }
    }
  },
  "lastPlayed": "numbers-11-20",
  "settings": {
    "soundEnabled": true,
    "musicEnabled": false
  }
}
```

---

## Game Designs - Numbers 11-20

### Game 1: Count the Items

**Type:** Multiple choice counting  
**Objective:** Count objects in an image and select the correct number

**Flow:**
1. Display colorful scene with X objects (fruits, animals, toys)
2. Text: "How many [objects] are there?"
3. TTS reads the question
4. Show 3-4 answer buttons with numbers (11-20 range)
5. Child taps answer
6. Feedback:
   - Correct: Green highlight, celebration sound, TTS: "Great! There are fifteen apples!"
   - Incorrect: Shake animation, "Try again!" sound, keep trying
7. After 10 rounds, show score and stars earned

**Visual:**
- Scene background (sky/grass)
- Objects arranged in groups for easy counting
- Answer buttons: Large circles with numbers
- Progress bar at top showing X/10

**Assets Needed:**
- Background images (park, classroom, etc.)
- Object sprites (apples, bananas, cats, dogs, etc.)
- Sound: correct.mp3, incorrect.mp3

---

### Game 2: Missing Number

**Type:** Sequence completion with drag-and-drop  
**Objective:** Identify and place the missing number in a sequence

**Flow:**
1. Display number sequence with one blank: 11, 12, __, 14, 15
2. Show draggable number options at bottom (3 numbers, 1 correct)
3. Child drags number to blank space
4. On drop:
   - Correct: Number snaps in place, success sound, next sequence
   - Incorrect: Bounces back, "Try again!" sound
5. Complete 8 sequences to finish

**Visual:**
- Number line displayed horizontally
- Blank space highlighted with pulsing border
- Draggable numbers in colorful circles
- Drop zone with dashed border

**Interactions:**
- Touch drag with visual follow
- Snap-to-grid when near correct position
- Haptic feedback on supported devices

**Assets Needed:**
- Number sprites (colorful, kid-friendly font)
- Sound: correct.mp3, incorrect.mp3, snap.mp3

---

### Game 3: Trace the Number

**Type:** Writing practice with touch tracing  
**Objective:** Trace numbers following a guide path

**Flow:**
1. Display large number with dotted outline
2. Starting point highlighted (glowing dot)
3. Child traces along the path with finger
4. Real-time feedback:
   - Following path: Green line drawn
   - Off path: Line turns red, gentle vibration
5. Complete the number to proceed
6. TTS announces the number when completed

**Technical:**
- HTML5 Canvas for drawing
- Path detection algorithm (distance from center line)
- Bezier curves for smooth number shapes

**Visual:**
- Large number takes up 60% of screen
- Dotted guide path in light gray
- Active drawing line in bright color
- Celebration animation on completion

**Assets Needed:**
- Sound: trace-complete.mp3, encouragement.mp3

---

### Game 4: Role Play

**Type:** Dialogue practice with split screen  
**Objective:** Learn and practice "How many..." / "There are..." patterns

**Flow:**
1. Split screen: Question side (left) and Answer side (right)
2. Display image with objects (e.g., 15 dolls)
3. Question side: "How many dolls are there?" with TTS
4. Child taps answer from options: "There are eleven" / "There are fifteen" / "There are twenty"
5. Correct answer triggers:
   - TTS reads full dialogue
   - Characters animate (Tom asks, Lucy answers)
   - Celebration
6. 5 rounds per play

**Visual:**
- Left character (Tom) - asks questions
- Right character (Lucy) - provides answers
- Center: Image to count
- Bottom: Answer options as speech bubbles

**Assets Needed:**
- Character sprites (Tom, Lucy)
- Background images for scenes
- Sound: dialogue-complete.mp3

---

## User Flow

### 1. Topic Selection (Home Screen)
- Grid of available topics
- Each topic card shows:
  - Icon and title
  - Progress bar
  - Star count (0-12)
  - Lock status (if prerequisites not met)
- Locked topics grayed out with lock icon
- Tap to enter topic

### 2. Topic Intro Screen
- Large topic icon and title
- "Start Learning" button
- Display of all games in topic
- Game cards show:
  - Game icon
  - Title
  - Star rating (if played)
  - Lock status
  - Checkmark if completed
- Tap game to start

### 3. Exercise Screen
- Full-screen game experience
- Top bar: Back button, progress, settings (sound toggle)
- Main area: Game content
- Bottom: Navigation or game controls

### 4. Completion Screen
- Celebration animation (confetti, stars)
- Score display: "You got 8/10!"
- Stars earned: 3 gold stars animation
- Buttons: "Play Again" / "Next Game" / "Back to Topic"
- Unlocks next game if applicable

---

## UI/UX Design

### Color Palette

```css
/* Primary Colors */
--color-sky: #4FC3F7;           /* Background - bright cyan */
--color-grass: #81C784;         /* Secondary - lime green */
--color-sun: #FFD54F;           /* Accent - warm yellow */

/* Game Colors */
--color-counting: #FF8A65;      /* Coral for counting */
--color-sequence: #9575CD;      /* Purple for sequence */
--color-writing: #4DB6AC;       /* Teal for writing */
--color-dialogue: #F06292;      /* Pink for dialogue */

/* Feedback Colors */
--color-success: #66BB6A;       /* Green for correct */
--color-error: #EF5350;         /* Red for incorrect */
--color-neutral: #BDBDBD;       /* Gray for neutral */

/* Text */
--color-text-dark: #37474F;     /* Dark slate */
--color-text-light: #FFFFFF;    /* White */
```

### Typography

- **Headings**: Rounded, bold, sans-serif (Comic Neue or similar)
- **Body**: Clear, readable, sans-serif
- **Numbers**: Extra large (72px+), kid-friendly rounded font
- **Minimum Sizes**: 24px for body, 48px for buttons, 72px for numbers

### Touch Target Guidelines

- Minimum tap target: 80x80px
- Button padding: 16px minimum
- Spacing between buttons: 16px minimum
- No gestures requiring fine motor control

### Animation Guidelines

**Timing:**
- Quick feedback: 150ms
- Transitions: 300ms
- Celebrations: 600ms
- Use ease-out for UI, ease-in-out for movement

**Effects:**
- Bounce on correct answer
- Shake on incorrect (subtle, not scary)
- Scale up on tap
- Fade transitions between screens

### Accessibility

- **Contrast**: 4.5:1 minimum for text
- **Touch**: All interactions work with touch only
- **Sound**: Visual cues match audio cues
- **Mute**: App works fully muted
- **Focus**: Clear focus indicators if using keyboard

---

## Audio System

### Sound Effects

| Sound | Usage |
|-------|-------|
| correct.mp3 | Correct answer feedback |
| incorrect.mp3 | Wrong answer feedback (gentle) |
| celebration.mp3 | Game completion fanfare |
| click.mp3 | Button tap feedback |
| unlock.mp3 | New game unlocked |
| star.mp3 | Individual star earned |

### Text-to-Speech

- Use Web Speech API (SpeechSynthesis)
- Voice: Prefer child-friendly, clear English voice
- Rate: 0.9 (slightly slower than normal)
- Pitch: 1.1 (slightly higher, friendly)
- Queue management: Cancel previous speech on new interaction

### Audio Settings

- Global sound on/off toggle in header
- Separate TTS on/off toggle
- Volume control (if needed)
- Persist settings in localStorage

---

## Storage & Progress

### localStorage Keys

```typescript
const STORAGE_KEY = 'babylala-progress';
const SETTINGS_KEY = 'babylala-settings';
```

### Data Operations

```typescript
// Load progress
const progress = loadProgress(); // Returns ProgressData or default

// Save progress
saveProgress(progress); // JSON.stringify + localStorage.setItem

// Update game progress
updateGameProgress(topicId, gameId, { completed: true, stars: 3 });

// Get topic completion
isTopicComplete(topicId); // boolean

// Get overall stats
getTotalStars(); // Sum across all topics
```

### Data Integrity

- Version number for migration if schema changes
- Graceful handling of corrupted data (reset to defaults)
- No sensitive data stored (no PII)

---

## PWA Configuration

### Manifest (manifest.json)

```json
{
  "name": "Babylala Exercise",
  "short_name": "Babylala",
  "description": "Fun English learning for kids",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#4FC3F7",
  "theme_color": "#4FC3F7",
  "orientation": "landscape",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" }
  ]
}
```

### Features

- Installable from Safari "Add to Home Screen"
- Runs in landscape mode (optimal for iPad)
- Offline support with service worker
- No browser UI (standalone mode)

---

## CI/CD & Deployment

### GitHub Repository Structure

```
main branch (production)
  ↓
develop branch (staging)
  ↓
feature/* branches
```

### Vercel Configuration

**Production Deployments:**
- Auto-deploy on push to `main`
- Domain: babylala-exercise.vercel.app (or custom)

**Preview Deployments:**
- Auto-deploy for PRs
- Unique URL per PR for testing

### Build Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',           // Static export for simple hosting
  distDir: 'dist',
  images: {
    unoptimized: true         // Required for static export
  }
};
```

### GitHub Actions (Optional Enhancements)

- Lint on PR
- Type check on PR
- Build verification on PR

---

## Future Topics

The architecture supports adding new topics easily. Future topics might include:

1. **Colors** - Red, blue, yellow, etc.
2. **Animals** - Cat, dog, bird, etc.
3. **Food** - Apple, banana, rice, etc.
4. **Family** - Mother, father, sister, brother

Each topic needs:
- `topics/[topic-id]/config.json`
- `topics/[topic-id]/assets/` folder
- Game configurations in `topics/[topic-id]/games/`
- Optional: Custom game components if needed

---

## Open Questions / Decisions

1. **Images:** Use emoji initially, replace with custom illustrations later?
   - **Decision:** Start with emoji + simple SVGs, can upgrade assets later

2. **Sound files:** Use free sound effects or generate?
   - **Decision:** Use free sound effects from sites like freesound.org

3. **Characters:** Create custom characters or use existing?
   - **Decision:** Use simple emoji characters initially (🦉, 🐿️)

4. **Offline support:** Full offline or just basic caching?
   - **Decision:** Basic service worker for offline access to visited pages

---

## Success Criteria

- [ ] Child can navigate topics independently
- [ ] All 4 games for Numbers 11-20 work correctly
- [ ] Progress persists across sessions
- [ ] Sound and TTS work on iPad Safari
- [ ] Touch interactions work smoothly
- [ ] Deployed and accessible via URL
- [ ] PWA installable on iPad
