# Admin Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single-page admin dashboard into a multi-page admin interface with hybrid sidebar navigation, polished UI, and focused pages for dashboard, guests, and event details. Remove the export/print feature.

**Architecture:** Use a shared `AdminShell` component that renders a fixed sidebar on desktop and a Sheet drawer on mobile. Each protected admin page becomes a focused route. Existing server actions and forms are preserved; only layout, navigation, and page composition change.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, `lucide-react`, Sonner.

## Global Constraints

- Next.js 16 App Router with async server components by default.
- Use existing shadcn/ui components in `src/components/ui/*`.
- Use `lucide-react` for icons.
- Tailwind CSS 4 utility classes only; no arbitrary values unless necessary.
- Respect `prefers-reduced-motion: reduce`.
- Mobile-first responsive.
- No new animation libraries.
- Preserve existing server actions and auth/session behavior.

---

## Task 1: Create Admin Navigation Shell

**Files:**
- Create: `src/components/admin/admin-shell.tsx`
- Modify: `src/app/admin/(protected)/layout.tsx`
- Delete: `src/app/admin/(protected)/export/page.tsx`
- Delete: `src/components/admin/export-view.tsx`

**Interfaces:**
- Consumes: `children: React.ReactNode` from protected admin routes.
- Produces: A persistent sidebar on desktop, hamburger + Sheet on mobile, active route highlighting, logout button.

- [ ] **Step 1: Create `src/components/admin/admin-shell.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarHeart, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAdmin } from "@/app/actions/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/guests", label: "Guests", icon: Users },
  { href: "/admin/event-details", label: "Event Details", icon: CalendarHeart },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-lg font-semibold text-primary">Eulogia</span>
      <span className="text-xs text-muted-foreground">Admin</span>
    </div>
  );
}

function LogoutForm() {
  return (
    <form action={logoutAdmin}>
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
      >
        <LogOut className="mr-2 h-5 w-5" />
        Logout
      </Button>
    </form>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:bg-card lg:px-3 lg:py-4">
        <div className="mb-6 px-3">
          <Brand />
        </div>
        <div className="flex-1">
          <NavList />
        </div>
        <div className="border-t pt-4">
          <LogoutForm />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
        <Brand />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-60 flex-col p-4">
            <SheetHeader className="text-left">
              <SheetTitle>
                <Brand />
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 py-6">
              <SheetClose asChild>
                <NavList />
              </SheetClose>
            </div>
            <div className="border-t pt-4">
              <LogoutForm />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Modify `src/app/admin/(protected)/layout.tsx`**

Replace the inline header with `AdminShell`.

```tsx
import { requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
```

- [ ] **Step 3: Delete export files**

Remove:
- `src/app/admin/(protected)/export/page.tsx`
- `src/components/admin/export-view.tsx`

Run:
```bash
git rm src/app/admin/\(protected\)/export/page.tsx src/components/admin/export-view.tsx
```

Expected: Files removed from working tree.

- [ ] **Step 4: Manual test navigation**

Run:
```bash
npm run dev
```

Open `http://localhost:3000/admin/dashboard` after logging in.
Expected:
- Sidebar visible on desktop with Dashboard, Guests, Event Details.
- Mobile shows hamburger icon that opens drawer.
- Active route highlighted.
- Logout button present.
- No Export link.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/admin-shell.tsx src/app/admin/\(protected\)/layout.tsx
git commit -m "feat(admin): add hybrid sidebar navigation shell"
```

---

## Task 2: Build Dashboard Page

**Files:**
- Modify: `src/app/admin/(protected)/dashboard/page.tsx`
- Modify: `src/components/admin/stats-card.tsx`
- Create: `src/components/admin/dashboard-stats.tsx`

**Interfaces:**
- Consumes: `Guest[]`, `Response[]`, `EventDetail | undefined`.
- Produces: Stats grid + recent guests section.

- [ ] **Step 1: Modify `src/components/admin/stats-card.tsx`**

```tsx
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "blue" | "green" | "amber";
}

const variantClasses = {
  default: "bg-muted text-foreground",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

export function StatsCard({ title, value, icon: Icon, variant = "default" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", variantClasses[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create `src/components/admin/dashboard-stats.tsx`**

```tsx
import { Users, MessageCircle, CheckCircle, Heart } from "lucide-react";
import { StatsCard } from "./stats-card";

interface DashboardStatsProps {
  totalGuests: number;
  answeredGuests: number;
  attendingCount: number;
  willingCount: number;
}

export function DashboardStats({
  totalGuests,
  answeredGuests,
  attendingCount,
  willingCount,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Guests" value={totalGuests} icon={Users} variant="blue" />
      <StatsCard title="Answered" value={answeredGuests} icon={MessageCircle} variant="default" />
      <StatsCard title="Attending" value={attendingCount} icon={CheckCircle} variant="green" />
      <StatsCard title="Willing Godparent" value={willingCount} icon={Heart} variant="amber" />
    </div>
  );
}
```

- [ ] **Step 3: Modify `src/app/admin/(protected)/dashboard/page.tsx`**

```tsx
import Link from "next/link";
import { db } from "@/db";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";

export default async function DashboardPage() {
  const allGuests = await db.query.guests.findMany({
    orderBy: (guests, { desc }) => [desc(guests.createdAt)],
  });

  const allResponses = await db.query.responses.findMany();
  const details = await db.query.eventDetails.findFirst();

  const responseByGuestId = new Map(allResponses.map((r) => [r.guestId, r]));

  const totalGuests = allGuests.length;
  const answeredGuests = allResponses.length;
  const attendingCount = allResponses.filter((r) => r.canAttendBaptism).length;
  const willingCount = allResponses.filter((r) => r.willBeGodparent).length;

  const recentGuests = allGuests.slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {details?.childName ? `${details.childName}'s Baptism` : "Admin Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage invitations, guests, and event details.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/guests/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Link>
        </Button>
      </div>

      <DashboardStats
        totalGuests={totalGuests}
        answeredGuests={answeredGuests}
        attendingCount={attendingCount}
        willingCount={willingCount}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Guests</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGuests.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No guests yet.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/guests/new">Add your first guest</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {recentGuests.map((guest) => {
                const response = responseByGuestId.get(guest.id);
                return (
                  <li
                    key={guest.id}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{guest.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="capitalize">
                          {guest.role}
                        </Badge>
                        {response ? (
                          <Badge
                            variant={
                              response.canAttendBaptism ? "default" : "destructive"
                            }
                          >
                            {response.canAttendBaptism ? "Attending" : "Not attending"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No response</Badge>
                        )}
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/guests/${guest.id}/edit`}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Manual test dashboard**

Run dev server, open `/admin/dashboard`.
Expected:
- Page title shows child name if event details exist.
- 4 stat cards in responsive grid.
- Recent guests list with edit links.
- Empty state with CTA when no guests.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/stats-card.tsx src/components/admin/dashboard-stats.tsx src/app/admin/\(protected\)/dashboard/page.tsx
git commit -m "feat(admin): redesign dashboard with stats and recent guests"
```

---

## Task 3: Build Guests List Page

**Files:**
- Create: `src/app/admin/(protected)/guests/page.tsx`
- Create: `src/components/admin/guests-table.tsx`
- Create: `src/components/admin/guests-list.tsx`
- Create: `src/components/admin/guest-filters.tsx`
- Modify: `src/components/admin/copy-invite-url.tsx` (no change needed, keep as-is)

**Interfaces:**
- Consumes: `Guest[]`, `Response[]`, search/filter params via URL.
- Produces: Searchable, filterable guest list with table (desktop) and cards (mobile).

- [ ] **Step 1: Create `src/components/admin/guest-filters.tsx`**

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterValue = "all" | "godfather" | "godmother" | "attending" | "not-attending" | "no-response";

export function GuestFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const filter = (searchParams.get("filter") as FilterValue) ?? "all";

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search guests by name..."
          defaultValue={query}
          onChange={(e) => updateParams({ q: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select
        value={filter}
        onValueChange={(value) => updateParams({ filter: value })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All guests</SelectItem>
          <SelectItem value="godfather">Godfather</SelectItem>
          <SelectItem value="godmother">Godmother</SelectItem>
          <SelectItem value="attending">Attending</SelectItem>
          <SelectItem value="not-attending">Not attending</SelectItem>
          <SelectItem value="no-response">No response</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/admin/guests-table.tsx`**

```tsx
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyInviteUrl } from "./copy-invite-url";
import type { Guest, Response } from "@/db/schema";

interface GuestsTableProps {
  guests: Guest[];
  responseByGuestId: Map<number, Response>;
}

export function GuestsTable({ guests, responseByGuestId }: GuestsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Response</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            const response = responseByGuestId.get(guest.id);
            return (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell className="capitalize">{guest.role}</TableCell>
                <TableCell>
                  {response ? (
                    <Badge variant={response.canAttendBaptism ? "default" : "destructive"}>
                      {response.canAttendBaptism ? "Attending" : "Not attending"}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No response</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CopyInviteUrl slug={guest.slug} />
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/admin/guests/${guest.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit {guest.name}</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/admin/guests-list.tsx`**

```tsx
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyInviteUrl } from "./copy-invite-url";
import type { Guest, Response } from "@/db/schema";

interface GuestsListProps {
  guests: Guest[];
  responseByGuestId: Map<number, Response>;
}

export function GuestsList({ guests, responseByGuestId }: GuestsListProps) {
  return (
    <div className="space-y-3">
      {guests.map((guest) => {
        const response = responseByGuestId.get(guest.id);
        return (
          <Card key={guest.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{guest.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="capitalize">
                    {guest.role}
                  </Badge>
                  {response ? (
                    <Badge variant={response.canAttendBaptism ? "default" : "destructive"}>
                      {response.canAttendBaptism ? "Attending" : "Not attending"}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No response</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CopyInviteUrl slug={guest.slug} />
                <Button asChild variant="outline" size="icon">
                  <Link href={`/admin/guests/${guest.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/admin/(protected)/guests/page.tsx`**

```tsx
import Link from "next/link";
import { db } from "@/db";
import { GuestFilters, type FilterValue } from "@/components/admin/guest-filters";
import { GuestsTable } from "@/components/admin/guests-table";
import { GuestsList } from "@/components/admin/guests-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GuestsPageProps {
  searchParams: Promise<{ q?: string; filter?: string }>;
}

function matchesFilter(
  filter: FilterValue,
  role: string,
  hasResponse: boolean,
  canAttend: boolean
): boolean {
  switch (filter) {
    case "godfather":
      return role === "godfather";
    case "godmother":
      return role === "godmother";
    case "attending":
      return hasResponse && canAttend;
    case "not-attending":
      return hasResponse && !canAttend;
    case "no-response":
      return !hasResponse;
    default:
      return true;
  }
}

export default async function GuestsPage({ searchParams }: GuestsPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").toLowerCase();
  const filter = (params.filter as FilterValue) ?? "all";

  const allGuests = await db.query.guests.findMany({
    orderBy: (guests, { desc }) => [desc(guests.createdAt)],
  });

  const allResponses = await db.query.responses.findMany();
  const responseByGuestId = new Map(allResponses.map((r) => [r.guestId, r]));

  const filteredGuests = allGuests.filter((guest) => {
    const matchesQuery = guest.name.toLowerCase().includes(query);
    const response = responseByGuestId.get(guest.id);
    const matchesFilterValue = matchesFilter(
      filter,
      guest.role,
      Boolean(response),
      response?.canAttendBaptism ?? false
    );
    return matchesQuery && matchesFilterValue;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guests</h1>
          <p className="text-sm text-muted-foreground">
            Manage guests, copy invite links, and view responses.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/guests/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Link>
        </Button>
      </div>

      <GuestFilters />

      {filteredGuests.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground">No guests match your search.</p>
          {query || filter !== "all" ? (
            <Link
              href="/admin/guests"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Clear filters
            </Link>
          ) : (
            <Button asChild className="mt-4">
              <Link href="/admin/guests/new">Add your first guest</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <GuestsTable guests={filteredGuests} responseByGuestId={responseByGuestId} />
          </div>
          <div className="md:hidden">
            <GuestsList guests={filteredGuests} responseByGuestId={responseByGuestId} />
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Manual test guests page**

Open `/admin/guests`.
Expected:
- Search filters by name.
- Dropdown filters by role/response.
- Desktop table shown above `md`.
- Mobile card list shown below `md`.
- Empty state when no matches.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/guest-filters.tsx src/components/admin/guests-table.tsx src/components/admin/guests-list.tsx src/app/admin/\(protected\)/guests/page.tsx
git commit -m "feat(admin): add searchable and filterable guests page"
```

---

## Task 4: Create Event Details Page

**Files:**
- Create: `src/app/admin/(protected)/event-details/page.tsx`
- Modify: `src/components/admin/event-details-form.tsx` (cosmetic spacing only)

**Interfaces:**
- Consumes: `EventDetail | undefined`.
- Produces: Event details form page.

- [ ] **Step 1: Create `src/app/admin/(protected)/event-details/page.tsx`**

```tsx
import { db } from "@/db";
import { EventDetailsForm } from "@/components/admin/event-details-form";

export default async function EventDetailsPage() {
  const details = await db.query.eventDetails.findFirst();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Event Details</h1>
        <p className="text-sm text-muted-foreground">
          Update baptism information shown on every invitation.
        </p>
      </div>
      <EventDetailsForm details={details} />
    </div>
  );
}
```

- [ ] **Step 2: Verify `src/components/admin/event-details-form.tsx`**

No logic changes needed. The existing form already uses shadcn/ui Card, Input, Select, Textarea, and Button. Ensure the outer Card renders correctly within the new page container.

- [ ] **Step 3: Manual test event details page**

Open `/admin/event-details`.
Expected:
- Form loads with existing event details.
- Sections render cleanly.
- Save button works and shows Sonner toast.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/\(protected\)/event-details/page.tsx
git commit -m "feat(admin): add dedicated event details page"
```

---

## Task 5: Update Add/Edit Guest Pages

**Files:**
- Modify: `src/app/admin/(protected)/guests/new/page.tsx`
- Modify: `src/app/admin/(protected)/guests/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: Existing server actions.
- Produces: Consistent page header + back link to `/admin/guests`.

- [ ] **Step 1: Modify `src/app/admin/(protected)/guests/new/page.tsx`**

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createGuest } from "@/app/actions/guests";
import { GuestForm } from "@/components/admin/guest-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NewGuestPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/admin/guests">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guests
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Add Guest</CardTitle>
        </CardHeader>
        <CardContent>
          <GuestForm action={createGuest} />
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Modify `src/app/admin/(protected)/guests/[id]/edit/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { guests } from "@/db/schema";
import { updateGuest, deleteGuest } from "@/app/actions/guests";
import { GuestForm } from "@/components/admin/guest-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EditGuestPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGuestPage({ params }: EditGuestPageProps) {
  const { id } = await params;
  const guestId = Number(id);

  const guest = await db.query.guests.findFirst({
    where: eq(guests.id, guestId),
  });

  if (!guest) {
    notFound();
  }

  const updateAction = updateGuest.bind(null, guest.id);
  const deleteAction = deleteGuest.bind(null, guest.id);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/admin/guests">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guests
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Guest</CardTitle>
        </CardHeader>
        <CardContent>
          <GuestForm guest={guest} action={updateAction} deleteAction={deleteAction} />
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Manual test add/edit guest pages**

Open `/admin/guests/new` and `/admin/guests/1/edit`.
Expected:
- Back link goes to `/admin/guests`.
- Form renders properly.
- Submit redirects to `/admin/dashboard` after success.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/\(protected\)/guests/new/page.tsx src/app/admin/\(protected\)/guests/\[id\]/edit/page.tsx
git commit -m "feat(admin): align add/edit guest pages with new navigation"
```

---

## Task 6: Build, Lint, and Manual QA

**Files:**
- All modified files.

- [ ] **Step 1: Run TypeScript and build**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors.

- [ ] **Step 3: Manual QA checklist**

Run dev server and verify:
- [ ] Login works.
- [ ] Sidebar shows Dashboard, Guests, Event Details; no Export.
- [ ] Active route highlighted correctly on all 3 pages.
- [ ] Mobile hamburger opens/closes drawer.
- [ ] Dashboard stats responsive (1/2/4 columns).
- [ ] Recent guests list displays last 5 with edit links.
- [ ] Guests page search filters by name.
- [ ] Guests page dropdown filters by role and response.
- [ ] Guests table visible on desktop; card list on mobile.
- [ ] Copy invite URL works.
- [ ] Edit guest redirects back correctly.
- [ ] Event details page loads and saves.
- [ ] Add guest works and redirects to dashboard.
- [ ] Logout works.
- [ ] `prefers-reduced-motion` disables sidebar animations.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat(admin): complete admin dashboard redesign"
```

---

## Self-Review Checklist

- [x] Spec coverage: Sidebar navigation, separate pages, dashboard polish, guest search/filter, event details page, export removal all have tasks.
- [x] Placeholder scan: No TBD/TODO placeholders.
- [x] Type consistency: Uses existing `Guest`, `Response`, `EventDetail` types; server components use async params/searchParams.
- [x] No contradictions: Export removed in Task 1 and not referenced elsewhere.
