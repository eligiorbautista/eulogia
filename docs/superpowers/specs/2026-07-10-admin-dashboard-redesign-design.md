# Admin Dashboard Redesign Design

## Overview

Redesign the Eulogia admin area from a single-page dashboard into a proper multi-page admin interface with persistent navigation, cleaner layout, and polished UI.

## Goals

- Split the monolithic dashboard into focused, separate pages.
- Add persistent hybrid navigation (sidebar on desktop, drawer on mobile).
- Polish the UI to look professional and consistent with the existing design system.
- Preserve all existing server actions and auth/session behavior.
- Remove the Export/Print to PDF feature completely.

## Constraints

- Next.js 16 App Router, React 19, TypeScript strict mode.
- Tailwind CSS 4 and shadcn/ui components already installed.
- Use `lucide-react` for icons.
- No new animation libraries; rely on Tailwind transitions and CSS.
- Respect `prefers-reduced-motion: reduce`.
- Mobile-first responsive design.

## Information Architecture

| Route | Page Purpose |
| --- | --- |
| `/admin/dashboard` | Overview: stats, quick actions, recent guests. |
| `/admin/guests` | Full guest list with search, filters, and row actions. |
| `/admin/guests/new` | Add new guest form (existing functionality). |
| `/admin/guests/[id]/edit` | Edit existing guest (existing functionality). |
| `/admin/event-details` | Baptism event details form (moved from dashboard). |

Removed: `/admin/export` and all Print/Export to PDF functionality.

## Navigation

### Desktop (`lg` and up)

- Fixed vertical sidebar on the left.
- Width: `240px`.
- Background: card/surface color with a subtle right border.
- Nav items show icon + label.
- Active item: filled muted background and primary text color.
- Hover item: muted background.
- Bottom of sidebar shows admin brand name "Eulogia Admin" and a Logout button.

### Mobile (below `lg`)

- Top header with hamburger menu button and "Eulogia Admin" title.
- Hamburger opens a Sheet/drawer from the left containing the same nav list.
- Sheet closes on item selection, outside click, or Escape.

### Nav Items

| Icon | Label | Route |
| --- | --- | --- |
| LayoutDashboard | Dashboard | `/admin/dashboard` |
| Users | Guests | `/admin/guests` |
| CalendarHeart | Event Details | `/admin/event-details` |

Logout action is placed separately at the bottom of the sidebar/drawer.

## Page Layouts

### Dashboard (`/admin/dashboard`)

- Page header: child name as title and a short subtitle (e.g., "Baptism admin").
- Quick action row: "Add Guest" primary button and optional secondary action.
- Stats grid: 4 cards on desktop, 2 on tablet, 1 on mobile.
  - Total Guests
  - Answered
  - Attending
  - Willing Godparent
- Recent Guests section: last 5 added guests in a compact list with status badges.
- Empty state when no guests exist with a clear "Add your first guest" CTA.

### Guests (`/admin/guests`)

- Page header with title and "Add Guest" primary button.
- Search input to filter guests by name.
- Filter dropdown or badge pills: All, Godfather, Godmother, Attending, Not Attending, No Response.
- Desktop: data table with columns Name, Role, Response Status, Actions.
- Mobile: card-style list showing the same information.
- Per-row actions: Copy invite URL, Edit guest.
- Empty state and no-search-results state.

### Event Details (`/admin/event-details`)

- Single form card grouped into clear sections:
  - Child Information
  - Date & Time
  - Location
  - Dress Code
  - Invitation Message
- Save button at the bottom of the form.
- Sticky or easily reachable save button on mobile.
- Success and error toast notifications via Sonner.

## Visual Design

- Clean, professional admin aesthetic. Avoid generic AI look (no excessive gradients, purple palettes, or oversized rounded cards).
- Use the project's existing Tailwind tokens: `bg-background`, `text-foreground`, `text-primary`, `text-muted-foreground`, `border-border`, `bg-muted`.
- Cards use subtle borders and consistent spacing from the Tailwind scale.
- Badges indicate guest role and response status.
- Consistent icon sizing (`h-4 w-4` for inline, `h-5 w-5` for nav).

## Responsive & Accessibility

- Sidebar collapses to a hamburger menu below `lg`.
- Main content uses full width on mobile with `p-4`, wider padding on `lg`.
- Stats grid: 1 col mobile → 2 cols `sm` → 4 cols `lg`.
- Guest table switches to card list below `md`.
- Navigation uses `<nav aria-label="Admin navigation">`.
- Active route marked with `aria-current="page"`.
- Sheet/drawer traps focus and closes on Escape.
- Respect `prefers-reduced-motion` for sidebar transitions.

## Behavior

- Preserve existing auth/session flow (`requireAdmin`, `logoutAdmin`).
- Preserve existing server actions: add guest, edit guest, delete guest, upsert event details.
- Preserve Sonner toast notifications.
- Add loading skeletons for async data on dashboard and guests pages.
- Add empty states for no guests and no search results.
- Redirect or keep existing routes for `/admin/guests/new` and `/admin/guests/[id]/edit`.

## Out of Scope

- Charts, graphs, or analytics visualizations.
- Bulk guest actions.
- CSV or PDF export.
- Multi-user roles or permissions beyond a single admin.
- Invitation preview page (can be added later as a separate feature).

## Open Questions

None. All major design decisions have been confirmed.
