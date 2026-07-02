"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Guest } from "@/db/schema";

interface GuestFormProps {
  guest?: Guest;
  action: (
    prevState: unknown,
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean }>;
  deleteAction?: () => Promise<{ error?: string; success?: boolean }>;
}

export function GuestForm({ guest, action, deleteAction }: GuestFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(guest ? "Guest updated!" : "Guest added!", {
        description: guest
          ? `${guest.name} has been updated.`
          : "New guest has been added.",
      });
      setTimeout(() => router.push("/admin/dashboard"), 500);
    } else if (state.error) {
      toast.error("Something went wrong", {
        description: state.error,
      });
    }
  }, [state, guest, router]);

  const handleDelete = async () => {
    if (!deleteAction) return;
    const result = await deleteAction();
    if (result?.success) {
      toast.success("Guest deleted!", {
        description: `${guest?.name} has been removed.`,
      });
      setTimeout(() => router.push("/admin/dashboard"), 500);
    } else if (result?.error) {
      toast.error("Something went wrong", {
        description: result.error,
      });
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={guest?.name}
          placeholder="Guest full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select name="role" defaultValue={guest?.role ?? "godfather"} required>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="godfather">Godfather</SelectItem>
            <SelectItem value="godmother">Godmother</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : guest
            ? "Update Guest"
            : "Add Guest"}
        </Button>

        {guest && deleteAction && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete Guest
          </Button>
        )}
      </div>
    </form>
  );
}
