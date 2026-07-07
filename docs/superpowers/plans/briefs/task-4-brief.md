# Task 4: Create SparkleDecoration component for baby photo

**Files:**
- Create: `src/components/invite/sparkle-decoration.tsx`

**Interfaces:**
- Consumes: `className`
- Produces: `<SparkleDecoration className="..." />`

## Steps

1. **Create the component file**

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

2. **Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

3. **Commit**

```bash
git add src/components/invite/sparkle-decoration.tsx
git commit -m "feat: add sparkle decoration component"
```

## Acceptance Criteria

- Component renders 4 small star icons positioned around its container.
- Stars twinkle using `animate-sparkle` from Task 1.
- `className` prop is merged for layout placement.
- No emojis, no new dependencies.
