import type { Guest, Response } from "@/db/schema";

export type ResponseStatusVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

export type GuestRole = Guest["role"];

export interface ResponseStatus {
  label: string;
  variant: ResponseStatusVariant;
}

function roleLabel(role: GuestRole): string {
  return role === "godfather" ? "Godfather" : "Godmother";
}

/**
 * Maps a guest's RSVP to a dashboard badge.
 *
 * Declining the role is distinct from accepting it but being unable to attend,
 * so the two are reported separately instead of both reading "Not attending".
 * Acceptance names the role so the admin can tell godfather from godmother
 * without cross-referencing another column.
 */
export function getResponseStatus(
  response: Response | undefined,
  role: GuestRole
): ResponseStatus {
  if (!response) {
    return { label: "No response", variant: "outline" };
  }

  if (!response.willBeGodparent) {
    return { label: "Declined role", variant: "secondary" };
  }

  const accepted = `Accepted as ${roleLabel(role)}`;

  return response.canAttendBaptism
    ? { label: `${accepted} · Attending`, variant: "default" }
    : { label: `${accepted} · Not attending`, variant: "destructive" };
}
