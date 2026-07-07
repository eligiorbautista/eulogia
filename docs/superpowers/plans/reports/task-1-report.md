# Task 1 Report: Extend animation tokens and keyframes in globals.css

## What I implemented

- Added four new CSS keyframe animations to `src/app/globals.css`, placed next to the existing invite-page animations:
  - `envelope-flap-open`
  - `envelope-reveal`
  - `page-enter`
  - `sparkle`
- Added corresponding utility classes:
  - `.animate-envelope-flap`
  - `.animate-envelope-reveal`
  - `.animate-page-enter`
  - `.animate-sparkle`
- Extended both existing `@media (prefers-reduced-motion: reduce)` blocks to disable the new animations and reset opacity/transform for users who prefer reduced motion. The file already contained two reduced-motion blocks, so the new classes were added to each to guarantee they are disabled regardless of which block a browser evaluates.
- Added small-mobile utilities at the end of the file:
  - `.small-mobile\:p-3`
  - `.small-mobile\:text-sm`
- Preserved all existing `[data-gender="boy"]`, `[data-gender="girl"]`, dark mode, base, print, and other animation styles.

## What I tested and test results

- Ran `npx tsc --noEmit` to verify TypeScript strict mode still passes with no errors.
- Result: exit code `0`, no errors.

## Files changed

- `src/app/globals.css`

## Self-review findings

- All requested keyframes and utility classes match the brief exactly.
- No new animation libraries or CSS-in-JS were introduced; only CSS keyframes and utility classes were used.
- Existing gender color tokens were not modified.
- `prefers-reduced-motion: reduce` now disables the new animations.
- During self-review I noticed the file was missing a trailing newline after appending the small-mobile block; I fixed that and amended the commit so the final change is clean.

## Issues or concerns

- The brief’s "Produces" line mentions `.small-mobile-hidden`, but the implementation steps only define `.small-mobile\:p-3` and `.small-mobile\:text-sm`. I implemented exactly what the steps specified and did not add an unrequested `.small-mobile-hidden` utility. If `.small-mobile-hidden` is needed, it should be defined in a subsequent task or brief update.
- Because the file contained two separate reduced-motion blocks, I added the new animation classes to both. This is slightly more than the brief’s literal "existing block" wording, but it is the safest way to ensure reduced-motion compliance across the whole stylesheet.
