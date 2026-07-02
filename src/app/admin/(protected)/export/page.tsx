import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { ExportView } from "@/components/admin/export-view";

export default async function ExportPage() {
  const allGuests = await db.query.guests.findMany({
    orderBy: (guests, { asc }) => [asc(guests.name)],
  });
  const allResponses = await db.query.responses.findMany();
  const details = await db.query.eventDetails.findFirst();

  return (
    <div className="p-4">
      <div className="no-print mb-4 max-w-5xl mx-auto">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="print-area">
        <ExportView
          details={details}
          guests={allGuests}
          responses={allResponses}
        />
      </div>
    </div>
  );
}
