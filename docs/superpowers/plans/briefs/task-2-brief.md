# Task 2: Create the EnvelopeOpening overlay component

**Files:**
- Create: `src/components/invite/envelope-opening.tsx`

**Interfaces:**
- Consumes: CSS classes from Task 1, `gender` prop
- Produces: `<EnvelopeOpening gender="boy" | "girl" onOpenComplete={() => void} />`

## Steps

1. **Create the component file**

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

2. **Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

3. **Commit**

```bash
git add src/components/invite/envelope-opening.tsx
git commit -m "feat: add envelope opening overlay component"
```

## Acceptance Criteria

- Component renders a CSS-built envelope with front panel, side flaps, and top flap.
- On mount, automatically progresses through phases: sealed → opening → revealing → done.
- Top flap folds back with `animate-envelope-flap`.
- Invitation card rises with `animate-envelope-reveal`.
- Overlay fades out after reveal.
- If `prefers-reduced-motion` is set, component returns null immediately and calls `onOpenComplete`.
- Fully responsive: envelope width uses `min(80vw,320px)` on mobile and scales up on larger screens.
- No emojis, no new dependencies.
