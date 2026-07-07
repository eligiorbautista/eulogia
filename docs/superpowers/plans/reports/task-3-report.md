# Task 3 Report: StorybookPage Wrapper Component

## What I Implemented

Created `src/components/invite/storybook-page.tsx`, a reusable wrapper component for storybook-style page sections.

- Accepts `children`, optional `label`, optional `icon`, optional `delay`, and optional `className`.
- Wraps content in a rounded, page-like card with a decorative corner icon and a chapter label.
- Uses the existing `ScrollReveal` component for entrance animation, passing through `delay` and `className`.
- Applies smaller padding on very small screens via the `small-mobile:p-3` utility added in Task 1.
- No emojis, no CSS-in-JS, no new dependencies.

## What I Tested and Test Results

- Ran `npx tsc --noEmit` from the project root.
- Result: No TypeScript errors.

## Files Changed

- `src/components/invite/storybook-page.tsx` (created)

## Self-Review Findings

- Component matches the brief exactly.
- TypeScript interfaces are strict and align with the props specified.
- `Icon` is correctly destructured and rendered only when provided.
- `label` is rendered only when provided.
- `ScrollReveal` is used as the outer wrapper, preserving reduced-motion support.
- Tailwind utility classes match the brief, including the custom `small-mobile:` breakpoint.
- No emojis present in code or UI strings.

## Issues or Concerns

None.
