# Storybook Scroll Invitation Page Redesign — Design Spec

## 1. Overview

Transform the baptismal invitation page from a single dense card into a **playful, storybook-like experience** with an automatic **envelope opening effect** and a narrative scroll flow. The goal is to make the page feel less generic and more like a personalized digital invitation that unfolds.

**Target devices:** All mobile sizes (small 320px up to large phones ~430px), tablets, and desktop. Mobile-first design is mandatory.

## 2. Goals

- Create a memorable "opening invitation" moment on page load.
- Reduce visual clutter by splitting content into storybook-style pages/sections.
- Make the page feel playful, baby-themed, and polished.
- Preserve all existing RSVP and event functionality.
- Ensure full responsiveness across small, standard, and large mobile screens.
- Respect `prefers-reduced-motion` for accessibility.

## 3. User Experience Flow

1. **Page load:** A sealed envelope appears centered on a soft gendered background.
2. **Auto-open (~2.5s):** The envelope flaps fold back and an invitation card rises out.
3. **Reveal:** The envelope fades into the background; the storybook card becomes the invitation.
4. **Scroll story:** The user scrolls through narrative pages:
   - Page 1 — Cover (photo, name, occasion)
   - Page 2 — The Invitation (personalized greeting)
   - Page 3 — The Day (event details)
   - Page 4 — Blessings (icons + blessing line)
   - Page 5 — Your Response (RSVP form)
5. **Closing:** Family sign-off at the bottom.

## 4. Tech Stack

- Next.js 16 App Router
- React 19 Server/Client Components
- Tailwind CSS 4
- shadcn/ui primitives (`Card`, `Button`, `Label`, `Textarea`, `RadioGroup`)
- CSS keyframe animations (no new animation libraries)
- Lucide icons
- Existing `canvas-confetti` for RSVP success

## 5. Visual Direction

### 5.1 Vibe

Playful, soft, baby-themed, and celebratory. Avoid generic flat card look.

### 5.2 Color Usage

- Keep existing gender palettes in `globals.css`:
  - `boy`: cyan/blue tones
  - `girl`: pink/rose tones
- Use `--accent` (soft yellow) for highlights and seals.
- Use `--highlight` and `--soft` for floating shape backgrounds.
- Cards remain white/cream (`--card`) with subtle shadow.

### 5.3 Typography

- Headings: existing `font-heading` (Playfair + fallback).
- Baby name: largest type scale, possibly with soft text shadow or gradient overlay.
- Chapter labels: small uppercase tracking-wide, muted-foreground color.
- Body: readable `text-base`/`text-lg` with comfortable line-height.

### 5.4 Decorative Elements

- Larger floating baby icons (rattle, booties, bottle, feet, moon, stars, clouds).
- Soft blurred blobs in background.
- Sparkle/twinkle effects around baby photo.
- Corner decorations on storybook page cards.

## 6. Page Sections

### 6.1 Opening Envelope Scene

**Layout:**
- Full-viewport overlay (`fixed inset-0 z-50`) or top section.
- Centered envelope built with CSS (front panel, side panels, top flap, back panel).
- Seal: small star/heart icon in gender primary color.

**Animation Sequence:**

| Time | Action |
|------|--------|
| 0ms | Envelope bounces gently into place |
| 400ms | Seal pulses once |
| 800ms | Top flap folds back (`rotateX(-180deg)`, `transform-origin: top`, `perspective: 1000px`) |
| 1200ms | Side flaps fold slightly outward |
| 1500ms | Invitation card rises (`translateY`) and scales up from inside |
| 1900ms | Envelope fades/blurs into background |
| 2200ms | Cover page fully visible, scroll begins |

### 6.2 Page 1 — Cover

**Content:**
- Chapter label: "Baptismal Invitation"
- Baby photo in a large decorative frame.
- Child's name as hero heading.
- Subheading: "Holy Baptism".

**Style:**
- Centered, plenty of vertical padding.
- Photo frame: thick white border, soft shadow, rounded-3xl or squircle.
- Sparkle icons around frame.

### 6.3 Page 2 — The Invitation

**Content:**
- Chapter label: "The Invitation"
- "Dear [guest.name],"
- Custom message from admin (with `{godparent}` replacement) or default message.

**Style:**
- Storybook page card.
- Decorative quote/book corner icon.
- Personalized name highlighted in primary color.

### 6.4 Page 3 — The Day

**Content:**
- Chapter label: "The Day"
- Event details as three icon rows: When, Where, What to Wear.

**Style:**
- Each detail in a rounded sub-card with icon.
- Icons scale slightly on hover.
- Clear hierarchy: label muted, value prominent.

### 6.5 Page 4 — Blessings

**Content:**
- Chapter label: "Blessings"
- Row of baby icons.
- Short blessing line, e.g. "May your love and guidance bless our child always."

**Style:**
- Banner-like card.
- Gentle bobbing animation on icons.

### 6.6 Page 5 — Your Response

**Content:**
- Chapter label: "Your Response"
- Existing RSVP form.

**Style:**
- Styled as a reply card.
- Distinct border or background tint to separate from story pages.
- Confetti on successful submission.

## 7. Responsiveness Requirements

### 7.1 Mobile (< 640px)

- Envelope scales to ~80% viewport width.
- Storybook cards use nearly full width (`mx-4` or `max-w-xl`).
- Baby photo frame: `h-44 w-44` on smallest screens, `h-52 w-52` on larger phones.
- Font sizes scale down slightly but remain readable.
- RSVP option cards stack vertically.
- Touch targets remain ≥ 44px.

### 7.2 Tablet (640px–1024px)

- Envelope ~60% viewport width.
- Cards use `max-w-2xl`.
- RSVP option cards can be 2-column.

### 7.3 Desktop (> 1024px)

- Envelope ~500px max width.
- Cards use `max-w-3xl`.
- Floating shapes spread wider.

### 7.4 Small Mobile Safeguards (< 360px)

- Reduce envelope size to ~75% viewport width.
- Reduce section padding slightly.
- Ensure baby photo frame never exceeds screen width.
- Stack all form options; no 2-column layouts.

## 8. Animation Specifications

### 8.1 New Keyframes

- `envelope-flap-open`: top flap folds from 0deg to -180deg.
- `envelope-reveal`: card rises from inside with opacity + translateY + scale.
- `page-enter`: storybook page slides up and fades in.
- `sparkle`: gentle opacity + scale twinkle.

### 8.2 Existing Keyframes to Keep/Refine

- `float`, `bob`, `twinkle` for background shapes.
- `scale-in-bounce` for main card entrance.
- `slide-up-fade` for conditional form fields.
- `heart-pulse` and `shake` for form states.

### 8.3 Timing Rules

- Envelope sequence: ~2.5s total.
- Page entrance: 400–600ms.
- Micro-interactions (hover, tap): 150–200ms.
- Stagger between sections: 80–120ms.

### 8.4 Reduced Motion

- All keyframe animations disabled via `@media (prefers-reduced-motion: reduce)`.
- Envelope overlay hidden immediately; invitation shown directly.
- Continuous floating animations disabled.
- State changes still use instant opacity/color transitions.

## 9. Accessibility

- `prefers-reduced-motion` respected globally.
- No auto-playing distracting motion after envelope opening.
- Form labels, focus rings, and touch targets preserved.
- No emojis anywhere in code or UI (per project rule).
- Semantic HTML maintained.

## 10. Constraints

- No new heavy animation libraries. Use CSS transforms only.
- No CSS-in-JS. Extend Tailwind utilities and CSS custom properties.
- Preserve existing gender color tokens in `globals.css`.
- Preserve footer requirement: "Made with Heart icon by Eli Bautista" on every page.
- Preserve TypeScript strict mode.
- Preserve existing admin/event/RSVP functionality.

## 11. Open Questions

None. All major design decisions confirmed with user.

## 12. Approval

Design approved by user on 2026-07-07.

- Envelope opening effect: automatic, CSS 3D fold
- Storytelling style: Storybook Scroll with page-like sections
- Visual vibe: playful & baby-themed
- Priority: full responsiveness on all mobile device sizes
