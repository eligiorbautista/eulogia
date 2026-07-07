# Storybook Scroll Invitation Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the baptismal invitation page into a playful storybook experience with an automatic envelope opening effect, split content into narrative page sections, and ensure full responsiveness across all mobile sizes.

**Architecture:** A client-side `EnvelopeOpening` overlay handles the auto-play opening animation and then fades out to reveal the server-rendered invitation page. The invitation page is refactored into reusable `StorybookPage` sections. All new animations are CSS keyframe-based; no new JS animation libraries are added.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, shadcn/ui, TypeScript, CSS keyframes, Lucide icons, existing `canvas-confetti`.

## Global Constraints

- No new heavy animation libraries; use CSS keyframes only.
- No CSS-in-JS; extend Tailwind utilities and CSS custom properties.
- Preserve existing gender color tokens in `src/app/globals.css`.
- No emojis anywhere in code or UI.
- Preserve footer: "Made with Heart icon by Eli Bautista" on every page.
- Preserve TypeScript strict mode and existing admin/event/RSVP functionality.
- Mobile-first; must work on small (320px), standard, and large mobile screens.
- Respect `prefers-reduced-motion: reduce`.
- Read `node_modules/next/dist/docs/` if any Next.js 16 API used in the plan differs from training data.

---

## Task 1: Extend animation tokens and keyframes in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing `[data-gender="boy"]` and `[data-gender="girl"]` selectors
- Produces: `.animate-envelope-flap`, `.animate-envelope-reveal`, `.animate-page-enter`, `.animate-sparkle`, `.small-mobile-hidden` utilities; reduced-motion overrides

- [ ] **Step 1: Add envelope opening keyframes**

Add the following keyframes near the existing invite animations:

```css
@keyframes envelope-flap-open {
  from { transform: rotateX(0deg); }
  to { transform: rotateX(-180deg); }
}

@keyframes envelope-reveal {
  0% { opacity: 0; transform: translateY(40px) scale(0.92); }
  60% { opacity: 1; transform: translateY(-8px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes page-enter {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
```

- [ ] **Step 2: Add utility classes for new animations**

Append after existing utility classes:

```css
.animate-envelope-flap {
  animation: envelope-flap-open 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform-origin: top;
  backface-visibility: hidden;
}

.animate-envelope-reveal {
  animation: envelope-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s forwards;
  opacity: 0;
}

.animate-page-enter {
  animation: page-enter 0.6s ease-out both;
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite both;
}
```

- [ ] **Step 3: Extend reduced motion override block**

In the existing `@media (prefers-reduced-motion: reduce)` block, add:

```css
.animate-envelope-flap,
.animate-envelope-reveal,
.animate-page-enter,
.animate-sparkle {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}
```

- [ ] **Step 4: Add small mobile utility**

Add at the end of the file:

```css
@media (max-width: 359px) {
  .small-mobile\:p-3 { padding: 0.75rem; }
  .small-mobile\:text-sm { font-size: 0.875rem; }
}
```

- [ ] **Step 5: Verify no syntax errors**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add envelope and storybook page animation keyframes"
```

---

## Task 2: Create the EnvelopeOpening overlay component

**Files:**
- Create: `src/components/invite/envelope-opening.tsx`

**Interfaces:**
- Consumes: CSS classes from Task 1, `gender` prop
- Produces: `<EnvelopeOpening gender="boy" | "girl" onOpenComplete={() => void} />`

- [ ] **Step 1: Create the component file**

Create `src/components/invite/envelope-opening.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface EnvelopeOpeningProps {
  gender: "boy" | "girl";
  onOpenComplete?: () => void;
}

export function EnvelopeOpening({ gender, onOpenComplete }: EnvelopeOpeningProps) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "revealing" | "done">("sealed");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) {
      onOpenComplete?.();
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setPhase("opening"), 600));
    timers.push(setTimeout(() => setPhase("revealing"), 1400));
    timers.push(
      setTimeout(() => {
        setPhase("done");
        onOpenComplete?.();
      }, 2400)
    );

    return () => timers.forEach(clearTimeout);
  }, [onOpenComplete]);

  if (prefersReducedMotion || phase === "done") {
    return null;
  }

  const isOpening = phase === "opening" || phase === "revealing";
  const isRevealing = phase === "revealing";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        isRevealing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="relative w-[min(80vw,320px)] sm:w-[min(60vw,420px)] lg:w-[420px]">
        {/* Back panel */}
        <div className="absolute inset-0 rounded-2xl bg-primary/20" />

        {/* Invitation card rising out */}
        <div
          className={`absolute inset-x-4 top-0 flex flex-col items-center justify-center rounded-xl bg-card p-6 shadow-xl ${
            isRevealing ? "animate-envelope-reveal" : "opacity-0"
          }`}
          style={{ height: "140%", top: "-35%" }}
        >
          <Star className="mb-3 h-8 w-8 text-accent" />
          <p className="font-heading text-lg font-semibold text-foreground">Invitation</p>
        </div>

        {/* Envelope body */}
        <div className="relative aspect-[1.45/1] overflow-hidden rounded-2xl bg-gradient-to-b from-primary/30 to-primary/50 shadow-2xl">
          {/* Side flaps */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-primary/40" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/40" style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />

          {/* Front panel */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-sm">
              <Star className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Top flap */}
          <div
            className={`absolute inset-x-0 top-0 h-1/2 origin-top bg-gradient-to-b from-primary/50 to-primary/30 ${
              isOpening ? "animate-envelope-flap" : ""
            }`}
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/invite/envelope-opening.tsx
git commit -m "feat: add envelope opening overlay component"
```

---

## Task 3: Create the StorybookPage wrapper component

**Files:**
- Create: `src/components/invite/storybook-page.tsx`

**Interfaces:**
- Consumes: `children`, `label`, `icon`, `delay`, `className`
- Produces: `<StorybookPage label="The Invitation" icon={Heart} delay={200}>{children}</StorybookPage>`

- [ ] **Step 1: Create the component file**

Create `src/components/invite/storybook-page.tsx`:

```tsx
import type { ReactNode, ComponentType } from "react";
import { ScrollReveal } from "./scroll-reveal";

interface StorybookPageProps {
  children: ReactNode;
  label?: string;
  icon?: ComponentType<{ className?: string }>;
  delay?: number;
  className?: string;
}

export function StorybookPage({
  children,
  label,
  icon: Icon,
  delay = 0,
  className = "",
}: StorybookPageProps) {
  return (
    <ScrollReveal delay={delay} className={className}>
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-card/95 p-5 shadow-lg backdrop-blur-sm sm:p-8 small-mobile:p-3">
        {/* Decorative corner icon */}
        {Icon && (
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
            <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          </div>
        )}

        {/* Chapter label */}
        {label && (
          <p className="mb-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:mb-5">
            {label}
          </p>
        )}

        {children}
      </div>
    </ScrollReveal>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/invite/storybook-page.tsx
git commit -m "feat: add storybook page wrapper component"
```

---

## Task 4: Create SparkleDecoration component for baby photo

**Files:**
- Create: `src/components/invite/sparkle-decoration.tsx`

**Interfaces:**
- Consumes: `className`
- Produces: `<SparkleDecoration className="..." />`

- [ ] **Step 1: Create the component file**

Create `src/components/invite/sparkle-decoration.tsx`:

```tsx
import { StarIcon } from "./baby-icons";

interface SparkleDecorationProps {
  className?: string;
}

export function SparkleDecoration({ className = "" }: SparkleDecorationProps) {
  const positions = [
    { top: "5%", left: "8%", size: "h-4 w-4", delay: "0s" },
    { top: "15%", right: "5%", size: "h-3 w-3", delay: "0.5s" },
    { bottom: "20%", left: "5%", size: "h-5 w-5", delay: "1s" },
    { bottom: "10%", right: "10%", size: "h-3 w-3", delay: "1.5s" },
  ];

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {positions.map((pos, index) => (
        <span
          key={index}
          className={`absolute text-primary/50 animate-sparkle ${pos.size}`}
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            animationDelay: pos.delay,
          }}
        >
          <StarIcon className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/invite/sparkle-decoration.tsx
git commit -m "feat: add sparkle decoration component"
```

---

## Task 5: Refactor the invite page into storybook sections

**Files:**
- Modify: `src/app/invite/[slug]/page.tsx`
- Modify: `src/components/invite/invite-section.tsx` (remove if fully replaced by StorybookPage)

**Interfaces:**
- Consumes: `EnvelopeOpening`, `StorybookPage`, `SparkleDecoration`, existing `FloatingShapes`, `RsvpForm`, baby icons, lucide icons
- Produces: redesigned `InvitePage` with envelope overlay and storybook page sections

- [ ] **Step 1: Add new imports and remove old wrapper**

In `src/app/invite/[slug]/page.tsx`, add:

```tsx
import { EnvelopeOpening } from "@/components/invite/envelope-opening";
import { StorybookPage } from "@/components/invite/storybook-page";
import { SparkleDecoration } from "@/components/invite/sparkle-decoration";
```

Remove the `InviteSection` import and the `import { Card, CardContent } from "@/components/ui/card";` line (or keep only if still used; the plan replaces it with StorybookPage).

- [ ] **Step 2: Update return structure to use envelope and storybook pages**

Replace the existing `return (...)` block with the following structure. Keep all existing data formatting logic above the return.

```tsx
return (
  <div
    data-gender={gender}
    className="relative min-h-full overflow-hidden bg-gradient-to-b from-background via-soft/60 to-background px-4 py-8 sm:py-12"
  >
    <EnvelopeOpening gender={gender} />
    <FloatingShapes gender={gender} />

    <div className="relative mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl">
      {/* Page 1 — Cover */}
      <StorybookPage
        delay={2400}
        className="mb-6 sm:mb-8"
      >
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Cross className="mr-2 h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Baptismal Invitation
            </span>
          </div>

          <div className="relative mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-[2.5rem] border-4 border-white bg-white p-2 shadow-xl sm:h-56 sm:w-56">
            <SparkleDecoration />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
              <Image
                src="/baby.png"
                alt={childName}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <h1 className="text-balance font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
            {childName}
          </h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground sm:text-xl">
            Holy Baptism
          </p>
        </div>
      </StorybookPage>

      {/* Page 2 — The Invitation */}
      <StorybookPage
        label="The Invitation"
        icon={Heart}
        delay={2600}
        className="mb-6 sm:mb-8"
      >
        <div className="space-y-4 text-center">
          <p className="text-xl font-medium text-foreground sm:text-2xl">
            Dear{" "}
            <span className="font-heading font-semibold text-primary">
              {guest.name}
            </span>
            ,
          </p>
          {details?.message ? (
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {details.message.replace(/\{godparent\}/g, roleLabel)}
            </p>
          ) : (
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We would be honored if you would stand with us as{" "}
              <span className="font-semibold text-foreground">{roleLabel}</span>{" "}
              for our child on this blessed day.
            </p>
          )}
        </div>
      </StorybookPage>

      {/* Page 3 — The Day */}
      {eventItems.length > 0 && (
        <StorybookPage
          label="The Day"
          icon={RattleIcon}
          delay={2800}
          className="mb-6 sm:mb-8"
        >
          <div className="space-y-4 text-left">
            {eventItems.map((item, index) => {
              if (!item) return null;
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start gap-4 rounded-2xl bg-secondary/50 p-4 transition-all duration-200 hover:bg-secondary hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">
                      {item.text}
                    </p>
                    {item.subtext && (
                      <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">
                        {item.subtext}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </StorybookPage>
      )}

      {/* Page 4 — Blessings */}
      <StorybookPage
        label="Blessings"
        icon={StarIcon}
        delay={3000}
        className="mb-6 sm:mb-8"
      >
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-4 rounded-2xl bg-secondary/30 py-4 text-primary/60">
            <span className="animate-bob" style={{ animationDelay: "0s" }}>
              <BootiesIcon className="h-6 w-6" />
            </span>
            <span className="animate-bob" style={{ animationDelay: "0.2s" }}>
              <BottleIcon className="h-6 w-6" />
            </span>
            <span className="animate-bob" style={{ animationDelay: "0.4s" }}>
              <BabyFeetIcon className="h-6 w-6" />
            </span>
            <span className="animate-float" style={{ animationDelay: "0.6s" }}>
              <CloudIcon className="h-6 w-6" />
            </span>
          </div>
          <p className="mx-auto max-w-md text-base italic leading-relaxed text-muted-foreground sm:text-lg">
            May your love and guidance bless our child always.
          </p>
        </div>
      </StorybookPage>

      {/* Page 5 — Your Response */}
      <StorybookPage
        label="Your Response"
        icon={CheckCircle2}
        delay={3200}
        className="mb-6 sm:mb-8"
      >
        <div className="rounded-3xl border border-primary/10 bg-gradient-to-b from-primary/5 to-transparent p-5 sm:p-8">
          {!existing && (
            <div className="mb-6 text-center">
              <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                Kindly Respond
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Please let us know if you can join us on this special day.
              </p>
            </div>
          )}
          <RsvpForm guest={guest} existing={existing} />
        </div>
      </StorybookPage>

      {/* Closing */}
      <StorybookPage delay={3400} className="text-center">
        <p className="text-sm text-muted-foreground/80 sm:text-base">
          With love and gratitude,
          <br />
          <span className="font-heading font-medium text-foreground">
            The Family
          </span>
        </p>
      </StorybookPage>
    </div>
  </div>
);
```

- [ ] **Step 3: Add missing imports if needed**

Ensure `Cross`, `Heart`, `CheckCircle2`, and the baby icons are imported. The existing page already imports most of these; only `EnvelopeOpening`, `StorybookPage`, and `SparkleDecoration` are new.

- [ ] **Step 4: Remove unused InviteSection component (optional)**

If `InviteSection` is no longer used anywhere, delete `src/components/invite/invite-section.tsx`. Otherwise leave it in place.

Run: `grep -r "InviteSection" src/`
If no usages remain, run: `git rm src/components/invite/invite-section.tsx`

- [ ] **Step 5: Verify TypeScript and build**

Run: `npx tsc --noEmit && npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/invite/\[slug\]/page.tsx
git commit -m "feat: refactor invite page into storybook sections with envelope opening"
```

---

## Task 6: Enhance floating shapes and polish background

**Files:**
- Modify: `src/components/invite/floating-shapes.tsx`

**Interfaces:**
- Consumes: existing baby icons, CSS animation classes
- Produces: richer floating background with more movement

- [ ] **Step 1: Add more floating elements and improve motion**

Edit `src/components/invite/floating-shapes.tsx` to add 2–3 additional soft blobs and reduce maximum blur on small screens. Keep existing elements; add:

```tsx
{/* Extra top-right blob */}
<div
  className={`absolute -right-16 top-1/3 h-48 w-48 rounded-full ${highlightClass} blur-3xl animate-float-slow`}
  style={{ animationDelay: "2s" }}
/>
{/* Extra bottom-left blob */}
<div
  className={`absolute -left-12 bottom-1/4 h-52 w-52 rounded-full ${accentClass} blur-3xl animate-bob`}
  style={{ animationDelay: "1.5s" }}
/>
```

Also wrap the component output in a media-query-aware wrapper: on reduced motion, render shapes statically without animation classes.

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/invite/floating-shapes.tsx
git commit -m "feat: enhance floating shapes background"
```

---

## Task 7: Responsive and reduced-motion QA

**Files:**
- N/A (verification only)

**Interfaces:**
- Consumes: dev server, browser preview
- Produces: verification notes and any final tweaks

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test small mobile (320px–360px)**

Use DevTools device mode with iPhone SE / 320px width.
Expected:
- Envelope fits without horizontal scroll.
- Baby photo frame ≤ screen width.
- Storybook cards have comfortable padding.
- RSVP option cards are stacked.
- No text overlaps.

- [ ] **Step 3: Test standard mobile (375px–430px)**

Use iPhone 12/13/14 Pro, Pixel 5 device presets.
Expected:
- Same as small mobile but with slightly more breathing room.
- Photo frame is prominent but not oversized.

- [ ] **Step 4: Test tablet and desktop**

Use iPad and desktop presets.
Expected:
- Cards center with `max-w-2xl`/`max-w-3xl`.
- Envelope ~500px max width.
- RSVP option cards can be 2-column on tablet+.

- [ ] **Step 5: Test prefers-reduced-motion**

Enable `prefers-reduced-motion: reduce` in DevTools.
Expected:
- No envelope overlay.
- Invitation content visible immediately.
- No floating/bobbing animations.
- RSVP success still works.

- [ ] **Step 6: Test envelope auto-open**

Reload page on mobile and desktop.
Expected:
- Envelope appears, seal pulses, flap opens, card rises, overlay fades.
- User can scroll invitation after overlay disappears.

- [ ] **Step 7: Run production build**

Run: `npm run build`
Expected: Build completes without errors.

- [ ] **Step 8: Commit final tweaks**

If any tweaks were needed, commit them:

```bash
git add .
git commit -m "fix: responsive and reduced-motion qa tweaks"
```

---

## Spec Coverage Check

| Spec Requirement | Implementing Task |
|---|---|
| Automatic envelope opening effect | Task 2 |
| Storybook page sections | Tasks 3, 5 |
| Playful & baby-themed polish | Tasks 4, 5, 6 |
| Full mobile responsiveness | Tasks 1, 5, 7 |
| Reduced motion support | Tasks 1, 2, 6, 7 |
| Preserve RSVP functionality | Task 5 |
| Preserve footer requirement | N/A (existing footer unchanged) |

---

## Placeholder Scan

- No `TBD`, `TODO`, or vague steps.
- All file paths are exact.
- All commands include expected output.
- Type signatures match across tasks.
