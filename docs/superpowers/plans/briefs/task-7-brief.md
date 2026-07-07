# Task 7: Responsive and reduced-motion QA

**Files:**
- N/A (verification only)

**Interfaces:**
- Consumes: dev server, browser preview
- Produces: verification notes and any final tweaks

## Steps

1. **Start dev server**

Run: `npm run dev`

2. **Test small mobile (320px–360px)**

Use DevTools device mode with iPhone SE / 320px width.
Expected:
- Envelope fits without horizontal scroll.
- Baby photo frame ≤ screen width.
- Storybook cards have comfortable padding.
- RSVP option cards are stacked.
- No text overlaps.

3. **Test standard mobile (375px–430px)**

Use iPhone 12/13/14 Pro, Pixel 5 device presets.
Expected:
- Same as small mobile but with slightly more breathing room.
- Photo frame is prominent but not oversized.

4. **Test tablet and desktop**

Use iPad and desktop presets.
Expected:
- Cards center with `max-w-2xl`/`max-w-3xl`.
- Envelope ~500px max width.
- RSVP option cards can be 2-column on tablet+.

5. **Test prefers-reduced-motion**

Enable `prefers-reduced-motion: reduce` in DevTools.
Expected:
- No envelope overlay.
- Invitation content visible immediately.
- No floating/bobbing animations.
- RSVP success still works.

6. **Test envelope auto-open**

Reload page on mobile and desktop.
Expected:
- Envelope appears, seal pulses, flap opens, card rises, overlay fades.
- User can scroll invitation after overlay disappears.

7. **Run production build**

Run: `npm run build`
Expected: Build completes without errors.

8. **Commit final tweaks**

If any tweaks were needed, commit them:

```bash
git add .
git commit -m "fix: responsive and reduced-motion qa tweaks"
```

## Acceptance Criteria

- Page looks good on small (320px), standard (375–430px), and large mobile screens.
- Tablet and desktop layouts are centered and readable.
- Reduced motion users see content immediately without animations.
- Envelope opening works on mobile and desktop.
- Production build succeeds.
- No emojis introduced.
