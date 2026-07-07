# Task 1: Extend animation tokens and keyframes in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing `[data-gender="boy"]` and `[data-gender="girl"]` selectors
- Produces: `.animate-envelope-flap`, `.animate-envelope-reveal`, `.animate-page-enter`, `.animate-sparkle`, `.small-mobile-hidden` utilities; reduced-motion overrides

## Steps

1. **Add envelope opening keyframes**

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

2. **Add utility classes for new animations**

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

3. **Extend reduced motion override block**

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

4. **Add small mobile utility**

Add at the end of the file:

```css
@media (max-width: 359px) {
  .small-mobile\:p-3 { padding: 0.75rem; }
  .small-mobile\:text-sm { font-size: 0.875rem; }
}
```

5. **Verify no syntax errors**

Run: `npx tsc --noEmit`
Expected: No errors.

6. **Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add envelope and storybook page animation keyframes"
```

## Acceptance Criteria

- New keyframes and utility classes exist in `globals.css`.
- Reduced motion block disables new animations.
- TypeScript check passes.
- No emojis, no new dependencies, no CSS-in-JS.
