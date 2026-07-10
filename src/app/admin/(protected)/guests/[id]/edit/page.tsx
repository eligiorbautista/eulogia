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
