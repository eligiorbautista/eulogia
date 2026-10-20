import { test } from "node:test";
import assert from "node:assert/strict";

import { getResponseStatus } from "./response-status.ts";
import type { Response } from "@/db/schema";

function makeResponse(overrides: Partial<Response> = {}): Response {
  return {
    id: 1,
    guestId: 1,
    willBeGodparent: true,
    canAttendBaptism: true,
    messageForBaby: null,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

test("reports no response when the guest has not answered", () => {
  assert.deepEqual(getResponseStatus(undefined, "godfather"), {
    label: "No response",
    variant: "outline",
  });
});

test("reports declined when the guest declined the role", () => {
  assert.deepEqual(
    getResponseStatus(
      makeResponse({ willBeGodparent: false, canAttendBaptism: false }),
      "godfather"
    ),
    { label: "Declined role", variant: "secondary" }
  );
});

test("names the accepted role when the guest accepts and can attend", () => {
  assert.deepEqual(
    getResponseStatus(
      makeResponse({ willBeGodparent: true, canAttendBaptism: true }),
      "godfather"
    ),
    { label: "Accepted as Godfather · Attending", variant: "default" }
  );
});

test("names the accepted role when the guest accepts but cannot attend", () => {
  assert.deepEqual(
    getResponseStatus(
      makeResponse({ willBeGodparent: true, canAttendBaptism: false }),
      "godmother"
    ),
    { label: "Accepted as Godmother · Not attending", variant: "destructive" }
  );
});
