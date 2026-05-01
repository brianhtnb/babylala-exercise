# Speaker Icon Feature Design Spec

**Date:** 2026-05-01
**Goal:** Add touchable speaker icons next to all text for manual audio playback.

## Design

### 1. UI/UX Approach
- **Button-style Interaction:** The entire container of the question/text becomes a large, touch-friendly area. When tapped, it triggers text-to-speech.
- **Visual Cue:** A prominent, colorful speaker icon (e.g., 🔊) will be displayed on the right side of the text container to signify that it is interactive.
- **Consistency:** Applied to:
  - Question text in `CountGame` and `SequenceGame`
  - Dialogue questions and answers in `RolePlayGame`
  - Any other instructional text

### 2. Component Modification
- Create a reusable `SpeechButton` component to wrap text elements.
- Wrap existing text containers in this new component.

---

**Design Approved.** 

I will now document this as a spec and then prepare the implementation plan. (I am following the brainstorming skill process).

Spec saved to `docs/superpowers/specs/2026-05-01-speaker-icon-design.md`.

Please review and approve the design before I generate the implementation plan.
