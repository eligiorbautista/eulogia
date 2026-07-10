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
