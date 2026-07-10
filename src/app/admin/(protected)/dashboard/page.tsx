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
