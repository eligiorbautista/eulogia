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
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <Button asChild variant="ghost" size="sm" className="w-fit">
            <Link href="/admin/guests">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guests
            </Link>
          </Button>
          <CardTitle>Add Guest</CardTitle>
        </CardHeader>
        <CardContent>
          <GuestForm action={createGuest} />
        </CardContent>
      </Card>
    </div>
  );
}
