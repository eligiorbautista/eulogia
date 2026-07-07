# Task 3: Create the StorybookPage wrapper component

**Files:**
- Create: `src/components/invite/storybook-page.tsx`

**Interfaces:**
- Consumes: `children`, `label`, `icon`, `delay`, `className`
- Produces: `<StorybookPage label="The Invitation" icon={Heart} delay={200}>{children}</StorybookPage>`

## Steps

1. **Create the component file**

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

2. **Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

3. **Commit**

```bash
git add src/components/invite/storybook-page.tsx
git commit -m "feat: add storybook page wrapper component"
```

## Acceptance Criteria

- Component accepts `children`, optional `label`, optional `icon`, optional `delay`, and `className`.
- Wraps content in a rounded page-like card with a decorative corner icon and chapter label.
- Uses existing `ScrollReveal` for entrance animation with delay.
- Padding is smaller on very small screens via `small-mobile:p-3` utility from Task 1.
- No emojis, no new dependencies.
