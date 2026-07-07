# Task 6: Enhance floating shapes and polish background

**Files:**
- Modify: `src/components/invite/floating-shapes.tsx`

**Interfaces:**
- Consumes: existing baby icons, CSS animation classes
- Produces: richer floating background with more movement

## Steps

1. **Add more floating elements and improve motion**

Edit `src/components/invite/floating-shapes.tsx` to add 2–3 additional soft blobs. Keep existing elements; add:

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

2. **Add reduced-motion awareness**

Wrap the component output so that on `prefers-reduced-motion: reduce`, shapes render statically without animation classes. The component can use a client-side media query hook or passively let the CSS `@media` block handle it. The existing CSS already disables animations, but ensure animation class names are not applied conditionally in a way that fights CSS.

3. **Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors.

4. **Commit**

```bash
git add src/components/invite/floating-shapes.tsx
git commit -m "feat: enhance floating shapes background"
```

## Acceptance Criteria

- More floating soft blobs appear in the background.
- Existing animations still work on non-reduced-motion devices.
- Reduced motion still disables continuous animations.
- TypeScript check passes.
- No emojis, no new dependencies.
