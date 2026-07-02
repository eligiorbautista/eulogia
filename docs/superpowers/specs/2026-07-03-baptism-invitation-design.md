# Eulogia — Baptism Invitation & RSVP App — Design Spec

## 1. Overview

A production-ready, open-source-friendly, mobile-first web app for inviting Ninongs/Ninangs to a child's baptism and collecting their RSVPs.

- Reusable by changing environment variables and seed data.
- Theme driven by `CHILD_GENDER` (boy = light blue, girl = light pink).
- Baby photo placed in `public/baby.png` with transparent background.
- Every page includes a footer: `Made with ♥ by Eli Bautista` (Lucide `Heart` icon, no emoji).
- No emojis anywhere in code, UI, text, buttons, or metadata.

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Turso (libSQL) |
| ORM | Drizzle ORM |
| Icons | lucide-react |
| Auth | bcryptjs + encrypted `admin_session` cookie |

## 3. Theme

- `CHILD_GENDER=boy`: CSS variables set to light blue (`#e0f2fe`, `#38bdf8`, etc.).
- `CHILD_GENDER=girl`: CSS variables set to light pink (`#fce7f3`, `#f472b6`, etc.).
- Affects accents, buttons, badges, borders, backgrounds, and decorative elements.
- Stored in `globals.css` using CSS variables so all components consume them consistently.

## 4. Database Schema

### `admins`
- `id` integer primary key autoincrement
- `username` text not null unique
- `passwordHash` text not null
- `createdAt` integer (timestamp ms)
- `updatedAt` integer (timestamp ms)

### `eventDetails`
- `id` integer primary key autoincrement
- `childName` text not null
- `gender` text not null (`boy` | `girl`)
- `baptismDate` text (ISO date, e.g. `2026-07-15`)
- `baptismTime` text (e.g. `10:00 AM`)
- `venueName` text
- `venueAddress` text
- `dressCode` text
- `message` text (invitation body)
- `createdAt` integer
- `updatedAt` integer

### `guests`
- `id` integer primary key autoincrement
- `name` text not null
- `role` text not null (`ninong` | `ninang`)
- `slug` text not null unique
- `createdAt` integer
- `updatedAt` integer

### `responses`
- `id` integer primary key autoincrement
- `guestId` integer not null unique references `guests(id)` on delete cascade
- `willBeNinongOrNinang` integer not null (0/1)
- `canAttendBaptism` integer not null (0/1)
- `messageForBaby` text
- `createdAt` integer
- `updatedAt` integer

## 5. Routing

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Redirect to `/admin/login` | public |
| `/admin/login` | Admin login form | public |
| `/admin/dashboard` | Dashboard, stats, guest list, responses | admin only |
| `/admin/guests/new` | Add new guest | admin only |
| `/admin/guests/[id]/edit` | Edit or delete guest | admin only |
| `/admin/export` | Print-friendly summary | admin only |
| `/invite/[slug]` | Personalized invitation + RSVP | public |

## 6. Authentication

- Seed script creates admin with username from `ADMIN_USERNAME` (default `elidev`) and password from `ADMIN_PASSWORD` (default `pwq123456`), hashed with bcrypt.
- Login server action verifies bcrypt hash.
- On success, sets encrypted `admin_session` cookie containing admin id and expiry.
- `requireAdmin()` helper validates cookie on admin routes/server actions; redirects to `/admin/login` if invalid.
- Logout server action clears the cookie.

## 7. Data Flow

All mutations implemented as Next.js Server Actions in `app/actions/*.ts`:

- `submitRsvp(slug, formData)` — looks up guest by slug, upserts response.
- `loginAdmin(formData)` — verifies credentials, sets session cookie.
- `logoutAdmin()` — clears session cookie.
- `createGuest(...)`, `updateGuest(...)`, `deleteGuest(...)` — guest CRUD.
- `upsertEventDetails(...)` — update event details.

Server Components fetch data directly via Drizzle.

## 8. RSVP Form Questions (fixed order)

1. Will you accept being a ninong/ninang of our child? (yes/no)
2. Can you attend the baptism? (yes/no)
3. Message for baby (optional)

Each guest has one response row; updates overwrite previous response with new `updatedAt`.

## 9. Admin Dashboard

- Statistics cards: total guests, answered/unanswered, attending, willing to be ninong/ninang.
- Guest table with name, role, URL copy button, edit/delete buttons.
- Response table with answers and messages.
- Event details form for baptism info.
- Export button linking to `/admin/export`.
- Logout button.

## 10. Guest Management

- Guest fields: `name`, `role`.
- Slug auto-generated from name (URL-friendly, unique, de-duplicated if needed).
- Copy-to-clipboard for `https://<host>/invite/<slug>` using Lucide `Clipboard` icon.
- Edit and delete supported; deletion cascades to response.

## 11. Print / PDF Export

- `/admin/export` server-rendered page with child name, baptism details, summary stats, guest/response table, and messages.
- `@media print` CSS hides navigation/buttons and ensures readable layout.
- Export mechanism: browser print → Save as PDF.

## 12. Seed / Reset

`npm run db:seed` runs `src/db/seed.ts`:

1. Deletes responses → guests → eventDetails → admins (FK-safe order).
2. Does NOT drop tables or schema.
3. Inserts admin from env vars.
4. Optionally seeds sample guests if `SEED_SAMPLE_GUESTS=true`.

## 13. Environment Variables

```env
CHILD_NAME="Baby Name"
CHILD_GENDER=boy
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
ADMIN_USERNAME=elidev
ADMIN_PASSWORD=pwq123456
```

## 14. Deployment

- Target: Vercel.
- Set env vars in Vercel dashboard.
- Run `npm run db:seed` locally or via CI once after creating the Turso database.
- Ensure baby photo is committed to `public/baby.png`.

## 15. Open Questions / Future Extensions

- QR codes for invite URLs
- Countdown timer on invite
- Photo gallery / guest media

## 16. Footer Requirement

- Every page renders a footer with `Made with` + Lucide `Heart` icon + `by Eli Bautista`.
- Prominently yet subtly placed.
- No emojis used.
