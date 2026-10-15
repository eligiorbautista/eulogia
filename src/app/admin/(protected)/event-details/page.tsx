import { db } from "@/db";
import { EventDetailsForm } from "@/components/admin/event-details-form";
import { CopyInviteUrl } from "@/components/admin/copy-invite-url";

export default async function EventDetailsPage() {
  const details = await db.query.eventDetails.findFirst();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Details</h1>
          <p className="text-sm text-muted-foreground">
            Update baptism information shown on every invitation.
          </p>
        </div>
        <CopyInviteUrl path="/celebration" label="Copy celebration link" />
      </div>
      <EventDetailsForm details={details} />
    </div>
  );
}
