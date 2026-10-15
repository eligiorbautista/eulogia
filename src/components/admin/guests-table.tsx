import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyInviteUrl } from "./copy-invite-url";
import { getResponseStatus } from "./response-status";
import type { Guest, Response } from "@/db/schema";

interface GuestsTableProps {
  guests: Guest[];
  responseByGuestId: Map<number, Response>;
}

export function GuestsTable({ guests, responseByGuestId }: GuestsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Response</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            const response = responseByGuestId.get(guest.id);
            const status = getResponseStatus(response);
            return (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell className="capitalize">{guest.role}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CopyInviteUrl slug={guest.slug} />
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/admin/guests/${guest.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit {guest.name}</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
