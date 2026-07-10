# Invitation Envelope Sound Effects + Favicon Update

> **For agentic workers:** REQUIRED SUB-AGENT SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user-initiated sound effects to the baptism invitation envelope opening animation and replace the default Vercel favicon with the app logo.

**Architecture:** Use a locally generated WAV asset for the sound, trigger playback from a user-initiated envelope open, and update `metadata.icons` in the root layout to point to `public/app_logo.png`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, native HTML `<audio>` API, Node.js buffer-based WAV synthesis.

## Global Constraints
- No new animation libraries.
- No external copyrighted audio files.
- Respect `prefers-reduced-motion: reduce`.
- Maintain mobile-first responsive design.
- Keep changes focused on `src/components/invite/envelope-opening.tsx`, `src/app/invite/[slug]/page.tsx`, `src/app/layout.tsx`, and `public/` assets.
- Run `npm run build` and `npm run lint` after all changes.

---

### Task 1: Generate the envelope sound WAV file

**Files:**
- Create: `scripts/generate-envelope-sound.js`
- Create: `public/sounds/envelope-open.wav`

**Interfaces:**
- Produces: `public/sounds/envelope-open.wav` (~1.5s, rustling noise + chime)

- [ ] **Step 1: Create the generation script**

```js
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const BITS_PER_SAMPLE = 16;
const BYTES_PER_SAMPLE = BITS_PER_SAMPLE / 8;
const CHANNELS = 1;

function writeWav(filename, samples) {
  const byteLength = samples.length * BYTES_PER_SAMPLE;
  const buffer = Buffer.alloc(44 + byteLength);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + byteLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * CHANNELS * BYTES_PER_SAMPLE, 28);
  buffer.writeUInt16LE(CHANNELS * BYTES_PER_SAMPLE, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(byteLength, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * BYTES_PER_SAMPLE);
  }

  fs.writeFileSync(filename, buffer);
}

function generateEnvelopeSound() {
  const totalDuration = 1.5;
  const totalSamples = Math.floor(SAMPLE_RATE * totalDuration);
  const samples = new Float32Array(totalSamples).fill(0);

  // Rustling noise (0 - 0.6s)
  const rustleDuration = 0.6;
  const rustleSamples = Math.floor(SAMPLE_RATE * rustleDuration);
  for (let i = 0; i < rustleSamples; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.min(1, t / 0.1) * Math.min(1, (rustleDuration - t) / 0.15);
    samples[i] += (Math.random() * 2 - 1) * envelope * 0.4;
  }

  // Magical chime (0.3s - 1.2s, 880Hz A5 with decay)
  const chimeStart = 0.3;
  const chimeDuration = 0.9;
  const chimeSamples = Math.floor(SAMPLE_RATE * chimeDuration);
  const frequency = 880;
  for (let i = 0; i < chimeSamples; i++) {
    const t = i / SAMPLE_RATE;
    const sampleIndex = Math.floor((chimeStart + t) * SAMPLE_RATE);
    if (sampleIndex >= totalSamples) break;
    const decay = Math.exp(-t * 4);
    samples[sampleIndex] += Math.sin(2 * Math.PI * frequency * t) * decay * 0.5;
  }

  return samples;
}

const outputPath = path.join(__dirname, "..", "public", "sounds", "envelope-open.wav");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
writeWav(outputPath, generateEnvelopeSound());
console.log("Generated:", outputPath);
```

- [ ] **Step 2: Generate the file**

Run: `node scripts/generate-envelope-sound.js`
Expected: Console outputs `Generated: .../public/sounds/envelope-open.wav`

- [ ] **Step 3: Verify the file exists and is reasonable size**

Run: `ls -lh public/sounds/envelope-open.wav`
Expected: File exists, size ~50-200 KB.

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-envelope-sound.js public/sounds/envelope-open.wav
git commit -m "feat(invite): generate envelope opening sound asset"
```

---

### Task 2: Make envelope opening user-initiated with audio

**Files:**
- Modify: `src/components/invite/envelope-opening.tsx`

**Interfaces:**
- Consumes: `/sounds/envelope-open.wav` from the public folder.
- Produces: `EnvelopeOpening` component that waits for user interaction before opening and plays audio on open.

- [ ] **Step 1: Replace auto-start timers with user-initiated handlers**

In `src/components/invite/envelope-opening.tsx`:
- Add a new phase `"ready"` before `"opening"`.
- Remove the auto-start `setTimeout` chain from the initial `useEffect`.
- Keep the `setTimeout` chain but trigger it only after the user clicks/taps.
- Create an `<audio>` element via `useRef` pointing to `/sounds/envelope-open.wav`.
- On user gesture, call `audioRef.current.play()` and start the animation.
- Respect `prefers-reduced-motion` by jumping straight to `"done"`.

- [ ] **Step 2: Add tap cue and keyboard accessibility**

- Wrap the envelope in a `<button>` or add `role="button"`, `tabIndex={0}`, and `aria-label="Open invitation"`.
- Add a visible "Tap to open" cue (text + gentle pulse animation).
- Support `Enter` and `Space` keys.

- [ ] **Step 3: Test the component behavior**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

Run: `npm run lint`
Expected: No new lint errors in `envelope-opening.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/invite/envelope-opening.tsx
git commit -m "feat(invite): make envelope opening user-initiated with sound"
```

---

### Task 3: Sync invitation page reveal timing with user-initiated open

**Files:**
- Modify: `src/app/invite/[slug]/page.tsx`

**Interfaces:**
- Consumes: `EnvelopeOpening` phase completion via `onOpenComplete`.
- Produces: First `StorybookPage` no longer relies on a hardcoded delay from page load.

- [ ] **Step 1: Remove the hardcoded delay on the first storybook page**

In `src/app/invite/[slug]/page.tsx`:
- Change `<StorybookPage delay={2400} ...>` to `<StorybookPage ...>` (default delay `0`).
- This prevents the first page from revealing behind the envelope before the user opens it.

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

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

- [ ] **Step 1: Create the favicon generation script**

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

- [ ] **Step 2: Run the generation script**

Run: `node scripts/generate-favicons.js`
Expected: Console outputs generated favicon files.

- [ ] **Step 3: Update root metadata icons**

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

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-favicons.js public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png src/app/layout.tsx
git commit -m "fix: generate proper favicon sizes from app logo"
```

---

### Task 5: Final integration, build, and lint

**Files:**
- All files above.

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No new errors. Pre-existing errors in `envelope-opening.tsx` and `floating-shapes.tsx` may remain unless also fixed.

- [ ] **Step 3: Manual QA checklist**

- Visit `/invite/<valid-slug>`.
- Confirm sealed envelope with "Tap to open" cue is visible.
- Click/tap the envelope.
- Confirm sound plays and animation runs.
- Confirm invitation content appears after envelope fades.
- Confirm browser tab shows `app_logo.png` instead of Vercel icon.
- Test with `prefers-reduced-motion: reduce` (silent, instant reveal).

- [ ] **Step 4: Final commit (if any integration tweaks were needed)**

```bash
git add .
git commit -m "chore: final integration for envelope sound and favicon"
```

## Self-Review

- **Spec coverage:**
  - User-initiated envelope open → Task 2
  - Rustle + chime sound → Task 1
  - Accessibility → Task 2
  - Reduced motion → Task 2
  - Favicon update → Task 4
- **Placeholder scan:** No TBDs, TODOs, or vague steps.
- **Type consistency:** Component props remain unchanged. Audio path is a string constant.
