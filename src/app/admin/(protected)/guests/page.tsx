import Link from "next/link";
import { db } from "@/db";
import {
  GuestFilters,
  FILTER_VALUES,
  type FilterValue,
} from "@/components/admin/guest-filters";
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
  const filter = FILTER_VALUES.includes(params.filter as FilterValue)
    ? (params.filter as FilterValue)
    : "all";

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
          {allGuests.length === 0 ? (
            <>
              <p className="text-muted-foreground">No guests yet.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/guests/new">Add your first guest</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                No guests match your search.
              </p>
              {query || filter !== "all" ? (
                <Link
                  href="/admin/guests"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  Clear filters
                </Link>
              ) : null}
            </>
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
