# Invitation Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the baptismal invitation page from a plain card into a lively, modern, playful-yet-minimalist experience with richer colors, baby illustrations, confetti celebration, and polished animations while remaining fully responsive on mobile, tablet, and desktop.

**Architecture:** Extend the existing Tailwind + CSS animation foundation with new color tokens and keyframes, introduce lightweight custom SVG baby icons and decorative floating shapes, add `canvas-confetti` for the RSVP success moment, and refactor the invite page and RSVP form into clearly-sectioned components with orchestrated entrance/exit animations.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, TypeScript, `canvas-confetti`.

## Global Constraints

- Keep using Tailwind CSS utility classes; do not introduce CSS-in-JS.
- All new colors must come from CSS custom properties scoped to `[data-gender="boy"]` and `[data-gender="girl"]` in `globals.css`.
- Animations must respect `prefers-reduced-motion: reduce`.
- All interactive elements must maintain a minimum 44x44px touch target.
- Page must be mobile-first and scale gracefully to desktop.
- No new heavy animation libraries; prefer CSS keyframes and `canvas-confetti` only.
- Maintain TypeScript strict mode.
- Preserve existing admin/event/RSVP functionality.

---

## Task 1: Install celebration dependency

**Files:**
- Modify: `package.json` (dev/test only verify), `package-lock.json` / lockfile

**Interfaces:**
- Consumes: npm registry
- Produces: `canvas-confetti` and `@types/canvas-confetti` available to components

- [ ] **Step 1: Install canvas-confetti and types**

```bash
npm install canvas-confetti && npm install -D @types/canvas-confetti
```

- [ ] **Step 2: Verify installation**

Run: `npm ls canvas-confetti @types/canvas-confetti`
Expected: Both packages listed without `extraneous` or `missing`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add canvas-confetti for rsvp celebration"
```

---

## Task 2: Extend color tokens and animations

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing `[data-gender="boy"]` and `[data-gender="girl"]` selectors
- Produces: richer `--accent`, `--highlight`, `--soft` tokens; new keyframes for float, bob, pulse-soft, shimmer

- [ ] **Step 1: Add richer gender palettes and new tokens**

Add/overwrite the `[data-gender="boy"]` and `[data-gender="girl"]` blocks with deeper primary colors plus accent/highlight/soft surface tokens.

- [ ] **Step 2: Add reusable animation keyframes**

Add keyframes: `float`, `bob`, `pulse-soft`, `shimmer`, `pop`, `slide-up-fade`, `scale-in-bounce`, `twinkle`, `shake`.
Add utility classes mapping each keyframe to animation.

- [ ] **Step 3: Add reduced motion fallback**

Inside `@media (prefers-reduced-motion: reduce)` disable infinite and entrance animations, keep opacity-only state changes.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: extend gender color tokens and animation keyframes"
```

---

## Task 3: Create baby icon set

**Files:**
- Create: `src/components/invite/baby-icons.tsx`

**Interfaces:**
- Consumes: Tailwind className props
- Produces: `RattleIcon`, `BootiesIcon`, `BottleIcon`, `MoonIcon`, `CloudIcon`, `StarIcon`, `BabyFeetIcon` React components

- [ ] **Step 1: Create SVG icon components**

Each icon is a `React.FC<{ className?: string }>` returning a simple SVG with `currentColor` stroke/fill so color is controlled by parent Tailwind classes. Sizes default to `w-6 h-6` via className.

- [ ] **Step 2: Add a barrel export**

Export all icons from the file.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/invite/baby-icons.tsx
git commit -m "feat: add custom baby svg icons"
```

---

## Task 4: Create floating decorative shapes

**Files:**
- Create: `src/components/invite/floating-shapes.tsx`

**Interfaces:**
- Consumes: Tailwind classes, CSS animation classes from globals.css
- Produces: `<FloatingShapes gender="boy" | "girl" />` component

- [ ] **Step 1: Build decorative background component**

Render absolute-positioned soft circles, stars, and clouds using primary/soft/highlight colors. Use CSS keyframe classes `animate-float`, `animate-bob`, `animate-twinkle`. Accept `gender` prop to pick accent hues via Tailwind classes.

- [ ] **Step 2: Ensure reduced motion respect**

Static shapes when `prefers-reduced-motion` matches.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/invite/floating-shapes.tsx
git commit -m "feat: add floating decorative shapes"
```

---

## Task 5: Create confetti trigger

**Files:**
- Create: `src/components/invite/confetti.tsx`

**Interfaces:**
- Consumes: `canvas-confetti`
- Produces: `launchConfetti(origin?: { x: number; y: number })` function

- [ ] **Step 1: Wrap canvas-confetti in a reusable utility**

Export a function that fires a gender-aware burst: boy uses blue/cyan/yellow confetti; girl uses pink/rose/yellow. Defaults to center of viewport if no origin provided.

- [ ] **Step 2: Guard on window/document for SSR**

Only import/run confetti inside client event handlers, never during server render.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/invite/confetti.tsx
git commit -m "feat: add gender-aware confetti utility"
```

---

## Task 6: Create scroll reveal wrapper

**Files:**
- Create: `src/components/invite/scroll-reveal.tsx`

**Interfaces:**
- Consumes: `IntersectionObserver` browser API
- Produces: `<ScrollReveal children className delay />` client component

- [ ] **Step 1: Implement IntersectionObserver-based reveal**

On first intersection, add a CSS class that triggers the entrance animation. Use `once: true`. Support `delay` prop for staggered children. Respect `prefers-reduced-motion` by instantly showing content.

- [ ] **Step 2: Make SSR-safe**

Mark `"use client"` and only access `window` inside `useEffect`.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/invite/scroll-reveal.tsx
git commit -m "feat: add scroll reveal component"
```

---

## Task 7: Refactor the invite page layout

**Files:**
- Modify: `src/app/invite/[slug]/page.tsx`
- Create: `src/components/invite/invite-section.tsx`

**Interfaces:**
- Consumes: `FloatingShapes`, baby icons, `ScrollReveal`, existing `RsvpForm`, `Card`, `CardContent`
- Produces: redesigned invite page with hero, greeting, event details, rsvp sections

- [ ] **Step 1: Create reusable section wrapper**

`InviteSection` accepts `title`, `icon`, `children`, and optional animation delay. It renders a bordered/surface card with consistent padding and spacing.

- [ ] **Step 2: Rewrite page sections**

- Hero: badge, squircle baby photo frame, display name, subheading
- Greeting: personalized "Dear [name]" card with custom admin message
- Event Details: three icon cards (when, where, dress code) using `InviteSection`
- Custom message block: styled as a centered quote/banner
- RSVP area: wraps existing `RsvpForm` with new heading and background

- [ ] **Step 3: Apply orchestrated animations**

Use `ScrollReveal` for each section. Add animation delay classes to decorative elements. Ensure reduced-motion fallback.

- [ ] **Step 4: Verify TypeScript and build**

Run: `npx tsc --noEmit && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/invite/\[slug\]/page.tsx src/components/invite/invite-section.tsx
git commit -m "feat: redesign invite page layout"
```

---

## Task 8: Improve RSVP form with animations and celebration

**Files:**
- Modify: `src/components/invite/rsvp-form.tsx`

**Interfaces:**
- Consumes: `launchConfetti`, existing `submitRsvp` server action
- Produces: animated radio option cards, loading state, success thank-you state

- [ ] **Step 1: Add confetti on successful submission**

When `state.success` becomes true, call `launchConfetti()` from `useEffect`.

- [ ] **Step 2: Add selection animations to option cards**

Selected option card scales slightly and changes border/bg. Add checkmark icon when selected. Add hover/focus states.

- [ ] **Step 3: Animate conditional fields**

When attendance questions appear/disappear, use CSS transition on max-height/opacity.

- [ ] **Step 4: Improve success state**

Add animated heart pulse and "Thank you!" text with a subtle scale-in.

- [ ] **Step 5: Improve error state**

Add a gentle shake animation to the form if `state.error` is set.

- [ ] **Step 6: Verify TypeScript and build**

Run: `npx tsc --noEmit && npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/invite/rsvp-form.tsx
git commit -m "feat: animate rsvp form and add confetti celebration"
```

---

## Task 9: Responsive testing and visual QA

**Files:**
- N/A (verification only)

**Interfaces:**
- Consumes: dev server, browser preview
- Produces: screenshots or confirmation of working layouts

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Check key viewports**

Manually verify at 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop).

- [ ] **Step 3: Verify reduced motion**

Enable `prefers-reduced-motion` in DevTools and confirm animations disable but content remains visible.

- [ ] **Step 4: Verify RSVP success confetti**

Submit a test RSVP and confirm confetti fires.

- [ ] **Step 5: Run production build**

Run: `npm run build`
Expected: Build completes without errors.

- [ ] **Step 6: Commit any final tweaks**

```bash
git commit -m "fix: responsive and motion qa tweaks"
```

---

## Spec Coverage Check

| Spec Requirement | Implementing Task |
|---|---|
| Richer gender-based colors | Task 2 |
| Baby-related illustrations | Task 3 |
| More/livelier animations | Tasks 2, 4, 6, 7, 8 |
| Confetti celebration | Tasks 5, 8 |
| Mobile-first responsive | Tasks 7, 9 |
| Modern minimalist vibe | Tasks 2, 3, 7 |
| Reduced motion support | Tasks 2, 4, 6, 7 |
| Preserved RSVP functionality | Task 8 |

---

## Placeholder Scan

- No `TODO` or `TBD` items.
- No vague error-handling placeholders.
- All file paths are exact.
- All dependencies named.
