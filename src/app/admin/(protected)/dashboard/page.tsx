import Link from "next/link";
import { db } from "@/db";
import { StatsCard } from "@/components/admin/stats-card";
import { EventDetailsForm } from "@/components/admin/event-details-form";
import { CopyInviteUrl } from "@/components/admin/copy-invite-url";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, FileText } from "lucide-react";

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
  const willingCount = allResponses.filter(
    (r) => r.willBeGodparent
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Guests" value={totalGuests} />
        <StatsCard title="Answered" value={answeredGuests} />
        <StatsCard title="Attending" value={attendingCount} />
        <StatsCard title="Willing Godparent" value={willingCount} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Guests</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="border-foreground/30 bg-white text-foreground hover:bg-foreground/5">
            <Link href="/admin/export">
              <FileText className="mr-2 h-4 w-4" />
              Print / Export
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/guests/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Guest
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guest List</CardTitle>
        </CardHeader>
        <CardContent>
          {allGuests.length === 0 ? (
            <p className="text-muted-foreground">
              No guests yet. Add one to generate an invite URL.
            </p>
          ) : (
            <ul className="space-y-3">
              {allGuests.map((guest) => {
                const response = responseByGuestId.get(guest.id);
                return (
                  <li
                    key={guest.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{guest.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="capitalize">
                          {guest.role}
                        </Badge>
                        <span className="truncate">/invite/{guest.slug}</span>
                        {response && (
                          <Badge
                            variant={
                              response.canAttendBaptism
                                ? "default"
                                : "destructive"
                            }
                          >
                            {response.canAttendBaptism
                              ? "Attending"
                              : "Not attending"}
                          </Badge>
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
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <EventDetailsForm
        details={details}
      />
    </div>
  );
}
