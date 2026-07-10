# Invitation Envelope Sound Effects + Favicon Update

> **For agentic workers:** REQUIRED SUB-AGENT SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user-initiated sound effects and looping background music to the baptism invitation envelope opening animation, and replace the default Vercel favicon with the app logo.

**Architecture:** Use user-supplied MP3 assets (`open-envelope.mp3`, `bg-music.mp3`) for audio, trigger playback from a user-initiated envelope open, and update `metadata.icons` in the root layout to point to generated favicon PNGs.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, native HTML `<audio>` API.

## Global Constraints
- No new animation libraries.
- Respect `prefers-reduced-motion: reduce`.
- Maintain mobile-first responsive design.
- Keep changes focused on `src/components/invite/envelope-opening.tsx`, `src/app/invite/[slug]/page.tsx`, `src/app/layout.tsx`, and `public/` assets.
- Run `npm run build` and `npm run lint` after all changes.

---

### Task 1: Use supplied MP3 sound assets

**Files:**
- Add to repo: `public/sounds/open-envelope.mp3`
- Add to repo: `public/sounds/bg-music.mp3`
- Delete: `public/sounds/envelope-open.wav`
- Delete: `scripts/generate-envelope-sound.js`

**Interfaces:**
- Consumes: user-supplied MP3 files.
- Produces: cleaned-up assets folder, no generated WAV or generation script.

- [x] **Step 1: Remove old generated sound asset and script**

- [x] **Step 2: Verify the new MP3 files exist in `public/sounds/`**

Expected: `public/sounds/open-envelope.mp3` and `public/sounds/bg-music.mp3` are present.

- [x] **Step 3: Commit**

```bash
git rm public/sounds/envelope-open.wav scripts/generate-envelope-sound.js
git add public/sounds/open-envelope.mp3 public/sounds/bg-music.mp3
git commit -m "chore(invite): replace generated WAV with supplied MP3 assets"
```

---

### Task 2: Make envelope opening play open sound and looping background music

**Files:**
- Modify: `src/components/invite/envelope-opening.tsx`

**Interfaces:**
- Consumes: `/sounds/open-envelope.mp3`, `/sounds/bg-music.mp3`.
- Produces: `EnvelopeOpening` component that plays the open sound immediately and background music after a delay on user interaction.

- [x] **Step 1: Update audio playback logic**

In `src/components/invite/envelope-opening.tsx`:
- Replace the single `audioRef` with `openSoundRef` and `bgMusicRef`.
- Preload both MP3 files on mount and set `bgMusicRef.current.loop = true`.
- On user gesture, play `open-envelope.mp3` immediately.
- Schedule `bg-music.mp3` to start after `BG_MUSIC_DELAY_MS` (default 2000 ms).
- Swallow playback errors and continue animation silently.
- Pause/reset both audio elements on unmount.

- [x] **Step 2: Keep user-initiated open and accessibility**

- Envelope remains a `<button>` with `aria-label="Open invitation"`.
- Keep keyboard support (`Enter` / `Space`).
- Keep `prefers-reduced-motion` handling (jump to `"done"`, no audio).

- [x] **Step 3: Test the component behavior**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

Run: `npm run lint`
Expected: No new lint errors in `envelope-opening.tsx`.

- [x] **Step 4: Commit**

```bash
git add src/components/invite/envelope-opening.tsx
git commit -m "feat(invite): play open sound and looping background music on envelope open"
```

---

### Task 3: Sync invitation page reveal timing with user-initiated open

**Files:**
- Modify: `src/app/invite/[slug]/page.tsx`

**Interfaces:**
- Consumes: `EnvelopeOpening` phase completion via `onOpenComplete`.
- Produces: First `StorybookPage` no longer relies on a hardcoded delay from page load.

- [x] **Step 1: Remove the hardcoded delay on the first storybook page**

In `src/app/invite/[slug]/page.tsx`:
- Change `<StorybookPage delay={2400} ...>` to `<StorybookPage ...>` (default delay `0`).
- This prevents the first page from revealing behind the envelope before the user opens it.

- [x] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds.

- [x] **Step 3: Commit**

```bash
git add src/app/invite/[slug]/page.tsx
git commit -m "fix(invite): remove hardcoded storybook delay tied to auto-open"
```

---

### Task 4: Generate proper favicon files from app logo

**Files:**
- Create: `scripts/generate-favicons.js`
- Create: `public/favicon-16x16.png`
- Create: `public/favicon-32x32.png`
- Create: `public/apple-touch-icon.png`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `public/app_logo.png`.
- Produces: Properly sized favicon PNGs and updated metadata in `src/app/layout.tsx`.

- [x] **Step 1: Create the favicon generation script**

Create `scripts/generate-favicons.js`:

```js
const fs = require("fs");
const path = require("path");

async function generateFavicons() {
  const sharp = require("sharp");
  const inputPath = path.join(__dirname, "..", "public", "app_logo.png");
  const outputDir = path.join(__dirname, "..", "public");

  const sizes = [
    { name: "favicon-16x16.png", width: 16, height: 16 },
    { name: "favicon-32x32.png", width: 32, height: 32 },
    { name: "apple-touch-icon.png", width: 180, height: 180 },
  ];

  for (const { name, width, height } of sizes) {
    await sharp(inputPath)
      .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, name));
    console.log("Generated:", name);
  }
}

generateFavicons().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [x] **Step 2: Run the generation script**

Run: `node scripts/generate-favicons.js`
Expected: Console outputs generated favicon files.

- [x] **Step 3: Update root metadata icons**

In `src/app/layout.tsx`, change the `metadata` export to include icons:

```ts
export const metadata: Metadata = {
  title: "Eulogia | Baptism Invitation",
  description: "You are lovingly invited to our child's baptism.",
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};
```

- [x] **Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds.

- [x] **Step 5: Commit**

```bash
git add scripts/generate-favicons.js public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png src/app/layout.tsx
git commit -m "fix: generate proper favicon sizes from app logo"
```

---

### Task 5: Final integration, build, and lint

**Files:**
- All files above.

- [x] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds.

- [x] **Step 2: Run linter**

Run: `npm run lint`
Expected: No new errors. Pre-existing errors in `envelope-opening.tsx` and `floating-shapes.tsx` may remain unless also fixed.

- [x] **Step 3: Manual QA checklist**

- Visit `/invite/<valid-slug>`.
- Confirm sealed envelope with "Tap to open" cue is visible.
- Click/tap the envelope.
- Confirm open sound plays immediately.
- Confirm animation runs and invitation content appears after envelope fades.
- Confirm background music starts after a short delay and loops.
- Confirm browser tab shows app logo favicon instead of Vercel icon.
- Test with `prefers-reduced-motion: reduce` (silent, instant reveal).

- [x] **Step 4: Final commit (if any integration tweaks were needed)**

```bash
git add .
git commit -m "chore: final integration for envelope sound and favicon"
```

## Self-Review

- **Spec coverage:**
  - User-initiated envelope open → Task 2
  - Open sound effect on open → Task 2
  - Looping background music after delay → Task 2
  - Accessibility → Task 2
  - Reduced motion → Task 2
  - Favicon update → Task 4
- **Placeholder scan:** No TBDs, TODOs, or vague steps.
- **Type consistency:** Component props remain unchanged. Audio paths are string constants.
