# Task 3 Fix Report

## Commit

`941d0b1746b60b7d9acb71e571b0eb03c31949f1`

## What Changed

### `src/components/admin/guest-filters.tsx`

- Replaced `router.push(..., { scroll: false })` with `router.replace(..., { scroll: false })` in `updateParams` so URL updates from filters no longer pollute browser history.
- Converted the search `<Input>` from an uncontrolled `defaultValue` + direct `onChange` update into a controlled input with a 300 ms debounce:
  - Added `inputValue` state initialized from the current URL `?q=` value.
  - Synced `inputValue` back to the URL query when it changes, but only after the user pauses typing for 300 ms.
  - Used render-time state synchronization (`query !== prevQuery`) to keep the input value in sync with external URL changes (e.g., back/forward navigation) without using an effect that triggers the `react-hooks/set-state-in-effect` lint rule.
- Wrapped `updateParams` in `useCallback` so it can be safely listed in the debounce effect dependency array.

### `src/components/admin/guests-list.tsx`

- Updated the edit button screen-reader label from `Edit` to `Edit {guest.name}` to match the accessible label used in `guests-table.tsx`.

## Test Commands and Results

```bash
npm run build
```

Result: Build succeeded with zero TypeScript errors.

```
> eulogia@0.1.0 build
> next build

▲ Next.js 16.2.10 (Turbopack)
- Environments: .env

  Creating an optimized production build ...
✓ Compiled successfully in 8.8s
  Running TypeScript ...
  Finished TypeScript in 9.1s ...
  Collecting page data using 11 workers ...
  Generating static pages using 11 workers (0/8) ...
  Generating static pages using 11 workers (2/8)
  Generating static pages using 11 workers (4/8)
  Generating static pages using 11 workers (6/8)
✓ Generating static pages using 11 workers (8/8) in 2.3s
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /admin/dashboard
├ ƒ /admin/guests
├ ƒ /admin/guests/[id]/edit
├ ƒ /admin/guests/new
├ ○ /admin/login
└ ƒ /invite/[slug]
```

```bash
npx eslint src/components/admin/guest-filters.tsx src/components/admin/guests-list.tsx
```

Result: No errors or warnings.

## Remaining Concerns

None. All three review findings have been addressed, and both the production build and lint checks pass cleanly.
