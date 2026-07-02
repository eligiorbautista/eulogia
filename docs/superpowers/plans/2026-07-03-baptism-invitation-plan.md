# Baptism Invitation & RSVP App — Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, mobile-first baptism invitation and RSVP app with Next.js, shadcn/ui, Turso, and Drizzle ORM.

**Architecture:** Next.js App Router with Server Components and Server Actions. Admin protected by bcrypt-verified session cookie. Public invite pages render from Turso via Drizzle. Theme driven by `CHILD_GENDER` env var using CSS variables.

**Tech Stack:** Next.js 14+ · TypeScript strict · Tailwind CSS · shadcn/ui · Turso (libSQL) · Drizzle ORM · lucide-react · bcryptjs

## Global Constraints

- No emojis anywhere in code, UI, text, buttons, or metadata.
- All icons from `lucide-react`; decorative cues from CSS.
- Mobile-first, responsive down to very small screens.
- Footer `Made with ♥ by Eli Bautista` on every page; heart is `lucide-react` `Heart` icon.
- Theme: `CHILD_GENDER=boy` light blue; `CHILD_GENDER=girl` light pink.
- Server Actions preferred for mutations.
- Admin defaults: username `elidev`, password `pwq123456` from env.
- Baby photo expected at `public/baby.png` (transparent).
- Build command: `next build` must pass for Vercel deployment.

---

## Task 1: Initialize Next.js Project with shadcn/ui

**Files:**
- Create: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `.env.example`, `.gitignore`
- Modify: none

**Interfaces:**
- Produces: runnable Next.js project with Tailwind and shadcn/ui base styles.

- [ ] **Step 1: Run shadcn/ui init**

```bash
echo "my-app" | npx shadcn@latest init --yes --template next --base-color slate
```

Expected: project scaffolded at current directory with `src/`, `components.json`, etc.

- [ ] **Step 2: Install dependencies**

```bash
npm install drizzle-orm @libsql/client bcryptjs lucide-react
npm install -D drizzle-kit @types/bcryptjs
```

- [ ] **Step 3: Initialize shadcn components**

```bash
npx shadcn add button card input label badge table dialog toast sonner alert sheet
```

- [ ] **Step 4: Configure strict TypeScript**

Modify `tsconfig.json` to ensure `strict: true` and `target: ES2022`.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: initialize next.js + shadcn/ui project"
```

---

## Task 2: Configure Drizzle ORM and Turso Schema

**Files:**
- Create: `src/db/index.ts`, `src/db/schema.ts`, `drizzle.config.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `db` Drizzle client, exported schemas `admins`, `eventDetails`, `guests`, `responses`.
- Produces: `drizzle-kit` config for migrations.

- [ ] **Step 1: Define Drizzle schema**

Create `src/db/schema.ts` with tables: `admins`, `eventDetails`, `guests`, `responses` using exact fields from design spec.

- [ ] **Step 2: Configure database client**

Create `src/db/index.ts` exporting `db` using `createClient` from `@libsql/client` with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.

- [ ] **Step 3: Configure drizzle-kit**

Create `drizzle.config.ts` with `schema`, `out`, `driver: "turso"`, and `dbCredentials`.

- [ ] **Step 4: Add migration scripts**

Modify `package.json`:

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:seed": "tsx src/db/seed.ts"
```

Install `tsx` if not present.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add drizzle schema and turso connection"
```

---

## Task 3: Theme, Layout, and Footer

**Files:**
- Create: `src/components/footer.tsx`, `src/components/theme-provider.tsx`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Produces: CSS variables `--theme-50`, `--theme-100`, `--theme-200`, `--theme-500`, `--theme-600`, `--theme-foreground`.
- Produces: `Footer` component and `RootLayout` wrapping children and footer.

- [ ] **Step 1: Add theme CSS variables**

In `globals.css`, set `:root` variables based on `CHILD_GENDER` using Tailwind plugin or conditional class on `<html>`. Use `data-gender="boy"` / `data-gender="girl"` and set colors.

- [ ] **Step 2: Create Footer component**

`src/components/footer.tsx` renders `Made with` + `Heart` icon + `by Eli Bautista`.

- [ ] **Step 3: Update layout**

`src/app/layout.tsx` reads `CHILD_GENDER` from env, applies `data-gender` to `<html>`, includes `<Footer />`.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add gender-based theme and footer"
```

---

## Task 4: Auth Utilities and Login Page

**Files:**
- Create: `src/lib/auth.ts`, `src/lib/session.ts`, `src/app/admin/login/page.tsx`, `src/app/actions/auth.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: `hashPassword(plain)`, `verifyPassword(plain, hash)`.
- Produces: `createSession(adminId)`, `getAdmin()`, `requireAdmin()`.
- Produces: login form action and logout action.

- [ ] **Step 1: Create password helpers**

`src/lib/auth.ts` uses `bcryptjs` for `hashPassword` and `verifyPassword`.

- [ ] **Step 2: Create session helpers**

`src/lib/session.ts` uses `cookies()` from `next/headers`, an env `SESSION_SECRET` (fallback to a constant in dev), and `JSON.stringify` + a simple signed token (HMAC via `crypto` if possible; otherwise encrypted cookie). Implement encode/decode functions.

- [ ] **Step 3: Create login page**

`src/app/admin/login/page.tsx` renders shadcn Card with username/password form. Calls `loginAdmin` server action. On success, redirect to `/admin/dashboard`.

- [ ] **Step 4: Create auth actions**

`src/app/actions/auth.ts` exports `loginAdmin(prevState, formData)` and `logoutAdmin()`.

- [ ] **Step 5: Redirect root**

`src/app/page.tsx` server component redirects to `/admin/login`.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: implement admin login and session auth"
```

---

## Task 5: Admin Dashboard Shell and Event Details

**Files:**
- Create: `src/app/admin/dashboard/page.tsx`, `src/app/admin/layout.tsx`, `src/components/admin/stats-card.tsx`, `src/app/actions/event-details.ts`
- Modify: none

**Interfaces:**
- Produces: `requireAdmin()` usage in admin layout.
- Produces: dashboard showing event details form and summary stats.

- [ ] **Step 1: Create admin layout**

`src/app/admin/layout.tsx` calls `requireAdmin()` and renders children plus a logout button.

- [ ] **Step 2: Create event details form action**

`src/app/actions/event-details.ts` exports `upsertEventDetails(formData)`.

- [ ] **Step 3: Create dashboard page**

`src/app/admin/dashboard/page.tsx` loads event details and renders an editable form for child name, gender, date, time, venue, address, dress code, message. Also renders summary stats (total guests, answered, attending, willing).

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: admin dashboard shell and event details form"
```

---

## Task 6: Guest CRUD and Invite URL Copy

**Files:**
- Create: `src/app/admin/guests/new/page.tsx`, `src/app/admin/guests/[id]/edit/page.tsx`, `src/components/admin/guest-form.tsx`, `src/app/actions/guests.ts`, `src/lib/slug.ts`
- Modify: `src/app/admin/dashboard/page.tsx`

**Interfaces:**
- Produces: `createGuest(formData)`, `updateGuest(id, formData)`, `deleteGuest(id)`.
- Produces: `generateUniqueSlug(name)` utility.
- Produces: invite URL `https://<host>/invite/<slug>` copy button.

- [ ] **Step 1: Create slug generator**

`src/lib/slug.ts` exports `slugify(name)` and `generateUniqueSlug(name)` that checks DB uniqueness.

- [ ] **Step 2: Create guest actions**

`src/app/actions/guests.ts` exports create/update/delete actions with revalidation.

- [ ] **Step 3: Create guest form component**

`src/components/admin/guest-form.tsx` with name input, role select (`ninong`/`ninang`), submit/delete buttons.

- [ ] **Step 4: Create new/edit pages**

`src/app/admin/guests/new/page.tsx` and `src/app/admin/guests/[id]/edit/page.tsx` use `GuestForm`.

- [ ] **Step 5: Add guest list to dashboard**

Modify dashboard to list guests with copy URL button (uses `lucide-react` `Clipboard` icon + `navigator.clipboard.writeText`).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: admin guest crud and invite url copy"
```

---

## Task 7: Public Invite and RSVP Pages

**Files:**
- Create: `src/app/invite/[slug]/page.tsx`, `src/components/invite/rsvp-form.tsx`, `src/app/actions/rsvp.ts`, `src/components/invite/hero-card.tsx`
- Modify: none

**Interfaces:**
- Produces: `submitRsvp(slug, formData)` server action.
- Produces: invite page with baby image, event details, guest name/role, RSVP form.

- [ ] **Step 1: Create RSVP action**

`src/app/actions/rsvp.ts` exports `submitRsvp(slug, willBeNinongOrNinang, canAttendBaptism, messageForBaby)`. Looks up guest by slug, upserts response, revalidates path.

- [ ] **Step 2: Create RSVP form component**

`src/components/invite/rsvp-form.tsx` renders radio groups in required order: 1) accept role, 2) attend baptism, 3) message. Uses shadcn `RadioGroup`. Shows success state after submit.

- [ ] **Step 3: Create invite page**

`src/app/invite/[slug]/page.tsx` loads guest + event details + existing response (if any). Renders baby image, greeting, event details, and `RsvpForm` pre-filled with prior response.

- [ ] **Step 4: Handle not found**

If guest not found, render simple not-found message (no admin info leaked).

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: public invite page and rsvp form"
```

---

## Task 8: Print / Export Page

**Files:**
- Create: `src/app/admin/export/page.tsx`, `src/components/admin/export-view.tsx`
- Modify: `src/app/admin/dashboard/page.tsx`

**Interfaces:**
- Produces: `/admin/export` page with print-friendly layout and `@media print` styles.

- [ ] **Step 1: Create export page**

`src/app/admin/export/page.tsx` protected by `requireAdmin()`. Loads all guests, responses, event details.

- [ ] **Step 2: Create export view component**

`src/components/admin/export-view.tsx` renders child name, baptism details, summary stats, table of guests with responses and messages. Includes a "Print / Save as PDF" button that calls `window.print()`.

- [ ] **Step 3: Add print CSS**

In component or page, add print styles that hide buttons and set page widths.

- [ ] **Step 4: Link from dashboard**

Add "Export / Print" button on dashboard linking to `/admin/export`.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: admin print and pdf export page"
```

---

## Task 9: Seed Script and README

**Files:**
- Create: `src/db/seed.ts`, `README.md`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run db:seed` that clears all tables and re-seeds admin + optional sample guests.
- Produces: README with setup, env, seeding, and deployment instructions.

- [ ] **Step 1: Write seed script**

`src/db/seed.ts` deletes in FK-safe order (responses → guests → eventDetails → admins), then inserts admin from env, and optionally sample guests if `SEED_SAMPLE_GUESTS=true`.

- [ ] **Step 2: Add seed script**

Add `"db:seed": "tsx src/db/seed.ts"` to `package.json`.

- [ ] **Step 3: Write README**

`README.md` covers: app purpose, env vars, setup, Turso connection, `db:generate`, `db:migrate`, `db:seed`, adding guests, print export, Vercel deployment, and baby image instructions.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "docs: add seed script and readme"
```

---

## Task 10: Build and Verify

**Files:**
- Modify: any files needed to fix build errors

**Interfaces:**
- Produces: successful `next build`.

- [ ] **Step 1: Run type check**

```bash
npx tsc --noEmit
```

Fix any errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Fix any errors.

- [ ] **Step 3: Verify lint**

```bash
npm run lint
```

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify build and final polish"
```

---

## Self-Review

- Spec coverage: each requirement from the design spec maps to at least one task (theme → Task 3, auth → Task 4, schema → Task 2, invite/RSVP → Task 7, admin CRUD → Task 6, export → Task 8, seed → Task 9).
- Placeholder scan: no TBD/TODO in plan; each step names concrete files and commands.
- Type consistency: schema names match actions; slug utility used in guest creation; session helpers reused across admin routes.
