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
    <>
      <div className="no-print mb-4 max-w-5xl mx-auto">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <GuestForm
              guest={guest}
              action={updateAction}
              deleteAction={deleteAction}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
