import type { Response } from "@/db/schema";

export type ResponseStatusVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

export interface ResponseStatus {
  label: string;
  variant: ResponseStatusVariant;
}

/**
 * Maps a guest's RSVP to a dashboard badge.
 *
 * Declining the role is distinct from accepting it but being unable to attend,
 * so the two are reported separately instead of both reading "Not attending".
 */
export function getResponseStatus(response?: Response): ResponseStatus {
  if (!response) {
    return { label: "No response", variant: "outline" };
  }

  if (!response.willBeGodparent) {
    return { label: "Declined", variant: "secondary" };
  }

  return response.canAttendBaptism
    ? { label: "Attending", variant: "default" }
    : { label: "Not attending", variant: "destructive" };
}
