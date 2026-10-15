# Eulogia

A cute, minimal, and elegant mobile-first web app for inviting Godfathers and Godmothers to your child's baptism and collecting their RSVPs.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Turso**, and **Drizzle ORM**.

---

## Features

- Personalized public invite pages at `/invite/[slug]`
- Public celebration page at `/celebration` for guests who aren't godparents
- RSVP form with three ordered questions
- Admin dashboard with guest CRUD, copy invite URL, and statistics
- Gender-based theme (blue for boy, pink for girl) controlled from admin dashboard
- Separate ceremony and celebration (reception) venues shown on the invitation
- Encrypted admin session cookie with bcrypt password hashing
- Database seed/reset script that clears data without dropping tables
- Reusable via seed data

---

## Prerequisites

- Node.js 20+
- npm
- A [Turso](https://turso.tech) database
- A baby photo saved as `public/images/leo_new.JPG`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

For **local development**, use a local SQLite file:

```env
TURSO_DATABASE_URL=file:./local.db
ADMIN_USERNAME=elidev
ADMIN_PASSWORD=pwq123456
SESSION_SECRET=change-me-to-a-long-random-string
```

For **production**, use your real Turso credentials:

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
ADMIN_USERNAME=elidev
ADMIN_PASSWORD=pwq123456
SESSION_SECRET=change-me-to-a-long-random-string
```

- `ADMIN_USERNAME` and `ADMIN_PASSWORD` default to `elidev` / `pwq123456`.
- `SESSION_SECRET` should be a strong random string in production.
- `SITE_URL` is the public origin used to build social share (Open Graph) links. It defaults to `http://localhost:3000`; set it to your deployed URL in production. This is a server-side variable, so it deliberately has no `NEXT_PUBLIC_` prefix.

---

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run Drizzle migrations to create the schema:

```bash
npm run db:generate
npm run db:migrate
```

4. Seed the admin and default event details:

```bash
npm run db:seed
```

5. Place your baby's photo at:

```
public/images/leo_new.JPG
```

6. Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`. The root path redirects to the admin login page.

---

## Adding Guests

1. Log in at `/admin/login` using your admin credentials.
2. On the dashboard, click **Add Guest**.
3. Enter the guest's name and select their role (Godfather or Godmother).
4. A unique slug is generated automatically.
5. Click the clipboard icon next to the guest to copy their unique invite URL.

---

## Public Celebration Page

Share `/celebration` with friends and family who aren't godparents. It shows the baby's photo and name, the date, and the celebration venue (plus the ceremony venue and dress code when set). It has no RSVP form and no per-guest personalization.

1. Set the event details in the admin (**Event Details**).
2. Click **Copy celebration link** to copy the public URL.
3. Share it with your guests.

---

## Resetting the Database

The seed script clears all table rows (without dropping tables) and re-creates the admin and default event row:

```bash
npm run db:seed
```

To also add sample guests, set `SEED_SAMPLE_GUESTS=true`:

```bash
SEED_SAMPLE_GUESTS=true npm run db:seed
```

---

## Deployment to Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. The child name and gender are set from the admin dashboard (Event Details section).
4. Deploy.
5. After the database is created, run `npm run db:seed` locally (pointing to production Turso credentials) or via a CI step to seed the admin.

---

## Project Structure

```
src/
  app/              # Next.js App Router pages and server actions
  components/       # Reusable UI components
  db/               # Drizzle schema, client, and seed script
  lib/              # Utilities (auth, session, slug helpers)
public/
  images/leo_new.JPG   # Baby photo
```

---

## Notes

- No emojis are used anywhere in the app. Icons come from `lucide-react`.
- The footer `Made with <3 by Eli Bautista` is shown on every page, using a Lucide heart icon.
- The theme color is driven by the gender set in the admin dashboard.

---

Made with love by Eli Bautista.
