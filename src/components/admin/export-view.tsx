"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer } from "lucide-react";
import type { Guest, Response, EventDetail } from "@/db/schema";

interface ExportViewProps {
  details?: EventDetail;
  guests: Guest[];
  responses: Response[];
}

function formatDate(date?: string | null) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export function ExportView({
  details,
  guests,
  responses,
}: ExportViewProps) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    window.print();
    setTimeout(() => setPrinting(false), 500);
  };

  const responseByGuestId = new Map(responses.map((r) => [r.guestId, r]));

  const answeredCount = responses.length;
  const attendingCount = responses.filter((r) => r.canAttendBaptism).length;
  const willingCount = responses.filter(
    (r) => r.willBeGodparent
  ).length;

  const childName = details?.childName ?? "our baby";

  return (
    <div className="mx-auto max-w-4xl space-y-6 print:max-w-none print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold">Print / Export</h1>
        <Button onClick={handlePrint} disabled={printing}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>

      <Card className="print:border-0 print:shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {childName}&apos;s Baptism
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold">{guests.length}</p>
              <p className="text-sm text-muted-foreground">Total Guests</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold">{answeredCount}</p>
              <p className="text-sm text-muted-foreground">Answered</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold">{attendingCount}</p>
              <p className="text-sm text-muted-foreground">Attending</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold">{willingCount}</p>
              <p className="text-sm text-muted-foreground">
                Willing Godparent
              </p>
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            {details?.baptismDate && (
              <p>
                <span className="font-medium">Date:</span>{" "}
                {formatDate(details.baptismDate)}
              </p>
            )}
            {details?.baptismTime && (
              <p>
                <span className="font-medium">Time:</span> {details.baptismTime}
              </p>
            )}
            {details?.venueName && (
              <p>
                <span className="font-medium">Venue:</span> {details.venueName}
              </p>
            )}
            {details?.venueAddress && (
              <p>
                <span className="font-medium">Address:</span>{" "}
                {details.venueAddress}
              </p>
            )}
            {details?.dressCode && (
              <p>
                <span className="font-medium">Dress Code:</span>{" "}
                {details.dressCode}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="print:border-0 print:shadow-none">
        <CardHeader>
          <CardTitle>Guest Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {guests.length === 0 ? (
            <p className="text-muted-foreground">No guests to display.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Accepting</TableHead>
                    <TableHead>Attending</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => {
                    const response = responseByGuestId.get(guest.id);
                    return (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">
                          {guest.name}
                        </TableCell>
                        <TableCell className="capitalize">
                          {guest.role}
                        </TableCell>
                        <TableCell>
                          {response
                            ? response.willBeGodparent
                              ? "Yes"
                              : "No"
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {response
                            ? response.canAttendBaptism
                              ? "Yes"
                              : "No"
                            : "-"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {response?.messageForBaby || "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="hidden print:block">
        <p className="text-center text-sm text-muted-foreground">
          Generated from Eulogia
        </p>
      </div>
    </div>
  );
}
