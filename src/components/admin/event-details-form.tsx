"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { upsertEventDetails } from "@/app/actions/event-details";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventDetail } from "@/db/schema";

interface EventDetailsFormProps {
  details?: EventDetail;
}

export function EventDetailsForm({
  details,
}: EventDetailsFormProps) {
  const [state, formAction, isPending] = useActionState(
    upsertEventDetails,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Details saved!", {
        description: "Event details have been updated.",
      });
    } else if (state.error) {
      toast.error("Something went wrong", {
        description: state.error,
      });
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Baptism Details</CardTitle>
        <CardDescription>
          This information appears on every invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} key={details?.updatedAt} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Child Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="childName">Child Name</Label>
                <Input
                  id="childName"
                  name="childName"
                  defaultValue={details?.childName ?? ""}
                  placeholder="e.g. Juan dela Cruz"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  name="gender"
                  defaultValue={details?.gender ?? "boy"}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boy">Boy</SelectItem>
                    <SelectItem value="girl">Girl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="baptismDate">Baptism Date</Label>
                <Input
                  id="baptismDate"
                  name="baptismDate"
                  type="date"
                  defaultValue={details?.baptismDate ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baptismTime">Baptism Time</Label>
                <Input
                  id="baptismTime"
                  name="baptismTime"
                  type="time"
                  defaultValue={details?.baptismTime ?? ""}
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                name="venueName"
                defaultValue={details?.venueName ?? ""}
                placeholder="e.g. St. Michael's Parish Church"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input
                id="venueAddress"
                name="venueAddress"
                defaultValue={details?.venueAddress ?? ""}
                placeholder="e.g. 123 Main St, Makati City"
              />
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Dress Code</h3>
            <div className="space-y-2">
              <Input
                id="dressCode"
                name="dressCode"
                defaultValue={details?.dressCode ?? ""}
                placeholder="e.g. Semi-formal, pastel colors"
              />
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Invitation Message</h3>
            <div className="space-y-2">
              <Textarea
                id="message"
                name="message"
                rows={4}
                defaultValue={
                  details?.message ??
                  "We would be honored if you could stand as a {godparent} for our child."
                }
                placeholder="Write a personal invitation message..."
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
