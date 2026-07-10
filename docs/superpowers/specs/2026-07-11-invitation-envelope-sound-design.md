# Invitation Envelope Sound Effects

## Overview
Add synchronized sound effects to the baptism invitation envelope opening animation. The sound will play only when the user explicitly interacts with the envelope, solving browser autoplay restrictions while creating a more delightful reveal experience.

## Goals
- Make the envelope opening feel more tactile and celebratory.
- Respect browser autoplay policies by requiring a user click/tap.
- Keep the implementation lightweight and maintainable.
- Honor accessibility preferences (`prefers-reduced-motion`).

## Non-Goals
- Background music or looping ambient sound.
- Advanced audio mixing or user volume controls.
- Support for outdated browsers without the Web Audio API.

## User Flow
1. Guest visits `/invite/[slug]`.
2. A sealed envelope is displayed with a subtle "Tap to open" cue.
3. Guest clicks or taps the envelope.
4. The combined rustle + chime sound begins to play.
5. Simultaneously, the envelope flap opens and the invitation card slides out.
6. The envelope overlay fades away, revealing the full invitation page.

## Audio Design
- **Format:** WAV (`public/sounds/envelope-open.wav`)
- **Length:** ~1.0 second
- **Layers:**
  1. **Paper page-turn rustle** — white noise shaped by a quick burst envelope and modulated with slower crinkle texture to mimic a page being turned or paper being handled.
- **Source:** Generated locally via a Node.js script using raw audio synthesis. This avoids copyright issues and external dependencies. The file can be replaced later with a professionally produced sound.

## Technical Design

### State Machine Changes (`EnvelopeOpening`)
The component currently auto-advances through phases using `setTimeout`. It will be updated to:
- Start in a new `"ready"` phase showing the sealed envelope and tap cue.
- Transition to `"opening"` only after a user click/tap event.
- Continue through `"revealing"` and `"done"` as before.
- Play audio immediately when transitioning from `"ready"` to `"opening"`.

### Audio Playback
- Use the standard HTML5 `<audio>` element or `Audio()` object.
- Trigger playback inside the click/tap event handler so it is allowed by autoplay policies.
- If audio fails to play (e.g., device muted, unsupported), swallow the error and continue the animation silently.
- If `prefers-reduced-motion` is enabled, skip both animation and sound and jump straight to `"done"`.

### Accessibility
- The envelope wrapper must be a `<button>` or have `role="button"`, `tabIndex={0}`, and keyboard support (`Enter` / `Space`).
- Add an `aria-label` such as "Open invitation".
- Respect `prefers-reduced-motion` by disabling the full animation and sound for users who request reduced motion.

### Files to Create/Modify
- **New generated asset:** `public/sounds/envelope-open.wav`
- **New dev script:** `scripts/generate-envelope-sound.js` (Node.js script to synthesize the WAV)
- **Modify:** `src/components/invite/envelope-opening.tsx` — user-initiated open + audio
- **Modify:** `src/app/invite/[slug]/page.tsx` — adjust `onOpenComplete` timing if needed
- **Modify:** `package.json` — optional script entry to regenerate the sound asset

## Performance Considerations
- Preload the audio file so playback starts immediately on interaction.
- Keep the WAV file small (~50-150 KB) to avoid delaying the page load.
- Clean up timers and audio references on unmount to prevent memory leaks.

## Browser Compatibility
- Works on all modern browsers with Web Audio API / HTMLMediaElement support.
- Autoplay restriction handled by user gesture.
- Falls back silently if audio playback is not possible.

## Success Criteria
- [ ] Envelope does not auto-open on page load.
- [ ] A clear tap/click cue invites interaction.
- [ ] Sound plays reliably on user interaction.
- [ ] Animation and sound stay in sync.
- [ ] Reduced-motion users get a silent, instant reveal.
- [ ] No console errors when audio is blocked or unsupported.
- [ ] Build and lint pass.
