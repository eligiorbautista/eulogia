"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { submitRsvp } from "@/app/actions/rsvp";
import { launchConfetti } from "./confetti";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Heart, Check } from "lucide-react";
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
  checked?: boolean;
}

function OptionCard({ id, value, label, description, checked }: OptionProps) {
  return (
    <Label
      htmlFor={id}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${
        checked
          ? "border-primary bg-primary/5 shadow-md"
          : "border-input bg-card hover:border-primary/40 hover:bg-secondary/50"
      }`}
    >
      <RadioGroupItem value={value} id={id} className="sr-only" />
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 bg-transparent"
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-foreground">{label}</p>
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
  const [willValue, setWillValue] = useState<string | undefined>(undefined);
  const [attendValue, setAttendValue] = useState<string | undefined>(undefined);
  const accepted = willValue === "yes";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      launchConfetti({ gender: guest.role === "godfather" ? "boy" : "girl" });
      toast.success("Response saved!", {
        description: "Thank you for your response.",
      });
    }
  }, [state, guest.role]);

  const handleWillChange = (value: string) => {
    setWillValue(value);
  };

  if (state.success || existing) {
    return (
      <div className="rounded-3xl bg-secondary/50 p-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-8 w-8 animate-heart-pulse fill-primary text-primary" />
        </div>
        <h3 className="mb-1 font-heading text-2xl font-semibold text-foreground">
          Thank you!
        </h3>
        <p className="text-muted-foreground">
          Your response has been saved. We are so grateful.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 text-left"
    >
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Will you accept being a {roleLabel}?
        </Label>
        <RadioGroup
          name="willBeGodparent"
          defaultValue={undefined}
          onValueChange={handleWillChange}
          required
          className="grid gap-3 sm:grid-cols-2"
        >
          <OptionCard
            id="will-yes"
            value="yes"
            label="Yes, I accept"
            description="I would be honored"
            checked={willValue === "yes"}
          />
          <OptionCard
            id="will-no"
            value="no"
            label="Respectfully decline"
            description="With gratitude for the invite"
            checked={willValue === "no"}
          />
        </RadioGroup>
      </div>

      {accepted && (
        <div className="animate-slide-up-fade space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Will you attend the baptism?
            </Label>
            <RadioGroup
              name="canAttendBaptism"
              defaultValue={undefined}
              onValueChange={setAttendValue}
              required
              className="grid gap-3 sm:grid-cols-2"
            >
              <OptionCard
                id="attend-yes"
                value="yes"
                label="Yes, I will attend"
                description="I will be there to celebrate"
                checked={attendValue === "yes"}
              />
              <OptionCard
                id="attend-no"
                value="no"
                label="Unable to attend"
                description="But I am with you in spirit"
                checked={attendValue === "no"}
              />
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageForBaby" className="text-base font-semibold">
              Message for baby{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="messageForBaby"
              name="messageForBaby"
              rows={4}
              defaultValue=""
              placeholder="Write a short blessing or message..."
              className="resize-none rounded-xl border-2 border-input bg-card transition-colors focus:border-primary"
            />
          </div>
        </div>
      )}

      {state.error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full transition-transform duration-150 active:scale-[0.98]"
        size="lg"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Saving...
          </span>
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
