# Design Spec: Let's go to the jungle (Level 4)

## Overview
Implement 4 mini-games for the "Let's go to the jungle" topic, aimed at 6-7 year old children. The design follows Babylala Pro style: vibrant, intuitive, and interactive.

## Data Architecture
- **Topic Configuration**: `topics/jungle/config.ts`
  - Vocabulary: bee, tiger, frog, lizard, monkey, spider, crocodile, elephant, rabbit, snake.
  - Scene Data: Scenes associated with each game to support visual counting/reading exercises.

## Game Components
### 1. Spelling Master (`SpellingGame.tsx`)
- **Interaction**: Display word with redundant letters. User taps redundant letter -> struck through. Tapping all redundant letters triggers word transformation to correct spelling.
- **UI**: Large, clear font, high-contrast, sound feedback on tap (correct/redundant).

### 2. Reading Quiz (`ReadingQuizGame.tsx`)
- **Interaction**:
  - Image scene shown.
  - Sentence shown ("Bees live here.").
  - User taps 'V' (True) or 'X' (False).
  - Feedback: Button colors indicate correctness, moves to next item after 1s.

### 3. Count & Complete (`CountAndCompleteGame.tsx`)
- **Interaction**:
  - Sentence with blank ("There are ___ monkeys in the jungle.").
  - List of answer buttons.
  - Tapping an answer button flies the word into the blank space.
  - Feedback: Correct/incorrect sound + animation.

## Technical Notes
- **Styling**: Tailwind, design tokens from `lib/design-tokens.ts`.
- **Animations**: Framer Motion for UI feedback (buttons, word flies).
- **Audio**: Integrate with `lib/audio.ts` (initAudio, playEffect, speak).
- **State Management**: React `useState` for local game state within each exercise component.

## Implementation Path (for next step)
- 1. Setup `topics/jungle/config.ts`.
- 2. Implement `SpellingGame`.
- 3. Implement `ReadingQuizGame`.
- 4. Implement `CountAndCompleteGame`.
- 5. Integrate into `app/topic/[id]/exercise/[exerciseId]`.
