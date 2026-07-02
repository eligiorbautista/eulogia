"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { submitRsvp } from "@/app/actions/rsvp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Heart } from "lucide-react";
import type { Guest, Response } from "@/db/schema";

interface RsvpFormProps {
  guest: Guest;
  existing?: Response;
}

interface OptionProps {
  id: string;
  value: string;
  label: string;
  description?: string;
}

function OptionCard({ id, value, label, description }: OptionProps) {
  return (
    <Label
      htmlFor={id}
      className="group relative flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:bg-secondary/50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:shadow-md"
    >
      <RadioGroupItem value={value} id={id} className="shrink-0" />
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Label>
  );
}

export function RsvpForm({ guest, existing }: RsvpFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitRsvp.bind(null, guest.slug),
    {}
  );

  const roleLabel = guest.role === "godfather" ? "Godfather" : "Godmother";
  const [accepted, setAccepted] = useState(
    existing ? existing.willBeGodparent : false
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Response saved!", {
        description: "Thank you for your response.",
      });
    } else if (state.error) {
      toast.error("Something went wrong", {
        description: state.error,
      });
    }
  }, [state]);

  if (state.success || existing) {
    return (
      <div className="rounded-2xl bg-secondary/40 p-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-6 w-6 fill-primary text-primary" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">Thank you!</h3>
        <p className="text-muted-foreground">
          Your response has been saved.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 text-left">
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Will you accept being a {roleLabel}?
        </Label>
        <RadioGroup
          name="willBeGodparent"
          defaultValue={undefined}
          onValueChange={(value) => setAccepted(value === "yes")}
          required
          className="grid gap-3 sm:grid-cols-2"
        >
          <OptionCard
            id="will-yes"
            value="yes"
            label="Yes, I accept"
          />
          <OptionCard
            id="will-no"
            value="no"
            label="Respectfully decline"
          />
        </RadioGroup>
      </div>

      {accepted && (
        <>
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Will you attend the baptism?
            </Label>
            <RadioGroup
              name="canAttendBaptism"
              defaultValue={undefined}
              required
              className="grid gap-3 sm:grid-cols-2"
            >
              <OptionCard
                id="attend-yes"
                value="yes"
                label="Yes, I will attend"
              />
              <OptionCard
                id="attend-no"
                value="no"
                label="Unable to attend"
              />
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageForBaby" className="text-base font-medium">
              Message for baby{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="messageForBaby"
              name="messageForBaby"
              rows={4}
              defaultValue=""
              placeholder="Write a short blessing or message..."
              className="resize-none"
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? (
          "Saving..."
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Submit Response
          </>
        )}
      </Button>
    </form>
  );
}
