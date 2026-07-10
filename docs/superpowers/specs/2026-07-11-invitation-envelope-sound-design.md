# Invitation Envelope Sound Effects

## Overview
Add synchronized sound effects and background music to the baptism invitation envelope opening animation. Audio playback is tied to the user's explicit interaction with the envelope so it is allowed by browser autoplay policies.

## Goals
- Make the envelope opening feel more tactile and celebratory.
- Play a short envelope-opening sound effect on user click/tap.
- Start looping background music shortly after the envelope opens.
- Respect browser autoplay policies by requiring a user gesture.
- Keep the implementation lightweight and maintainable.
- Honor accessibility preferences (`prefers-reduced-motion`).

## Non-Goals
- Advanced audio mixing or user volume controls.
- Support for outdated browsers without the Web Audio API / HTMLMediaElement.

## User Flow
1. Guest visits `/invite/[slug]`.
2. A sealed envelope is displayed with a subtle "Tap to open" cue.
3. Guest clicks or taps the envelope.
4. `open-envelope.mp3` begins to play immediately.
5. Simultaneously, the envelope flap opens and the invitation card slides out.
6. After a short delay, `bg-music.mp3` begins to play and loops continuously.
7. The envelope overlay fades away, revealing the full invitation page while the music continues.

## Audio Design
- **Format:** MP3
- **Assets:**
  - `public/sounds/open-envelope.mp3` — short sound effect played when the envelope opens.
  - `public/sounds/bg-music.mp3` — looping background music that starts a few seconds after opening.
- **Source:** User-supplied MP3 files.

## Technical Design

### State Machine Changes (`EnvelopeOpening`)
The component starts in a `"ready"` phase showing the sealed envelope and tap cue. After the user interacts:
- Transition to `"opening"`.
- Continue through `"revealing"` and `"done"`.
- Audio is triggered from the same click/tap event handler.

### Audio Playback
- Use standard HTML5 `Audio()` objects.
- Preload both MP3 files on mount.
- Set `bg-music.mp3` to `loop = true`.
- Trigger `open-envelope.mp3` immediately inside the click/tap handler.
- Trigger `bg-music.mp3` after a short delay (`BG_MUSIC_DELAY_MS`, currently 2000 ms) using `setTimeout`.
- Swallow playback errors and continue animation silently if audio is blocked or unsupported.
- If `prefers-reduced-motion` is enabled, skip animation and audio and jump straight to `"done"`.
- Pause and reset both audio elements when the component unmounts.

### Accessibility
- The envelope wrapper is a `<button>` with an `aria-label="Open invitation"`.
- Keyboard support: `Enter` / `Space` opens the envelope.
- Respect `prefers-reduced-motion` by disabling the full animation and sound.

### Files to Create/Modify
- **Assets:** `public/sounds/open-envelope.mp3`, `public/sounds/bg-music.mp3`
- **Modify:** `src/components/invite/envelope-opening.tsx` — user-initiated open + audio + looping bg music
- **Modify:** `src/app/invite/[slug]/page.tsx` — adjust `onOpenComplete` timing if needed

## Performance Considerations
- Preload both MP3 files so playback starts immediately on interaction.
- Keep MP3 files reasonably small to avoid delaying page load.
- Clean up timers and audio references on unmount to prevent memory leaks.

## Browser Compatibility
- Works on all modern browsers with HTMLMediaElement support.
- Autoplay restriction handled by user gesture.
- Falls back silently if audio playback is not possible.

## Success Criteria
- [x] Envelope does not auto-open on page load.
- [x] A clear tap/click cue invites interaction.
- [x] `open-envelope.mp3` plays reliably on user interaction.
- [x] `bg-music.mp3` starts after a short delay and loops.
- [x] Animation and sound stay in sync.
- [x] Reduced-motion users get a silent, instant reveal.
- [x] No console errors when audio is blocked or unsupported.
- [x] Build and lint pass.
