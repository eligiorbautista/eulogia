import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyInviteUrl } from "./copy-invite-url";
import { getResponseStatus } from "./response-status";
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
        const status = getResponseStatus(response, guest.role);
        return (
          <Card key={guest.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{guest.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="capitalize">
                    {guest.role}
                  </Badge>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CopyInviteUrl slug={guest.slug} />
                <Button asChild variant="outline" size="icon">
                  <Link href={`/admin/guests/${guest.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {guest.name}</span>
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
