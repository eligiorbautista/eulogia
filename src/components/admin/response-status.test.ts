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
  assert.deepEqual(getResponseStatus(undefined), {
    label: "No response",
    variant: "outline",
  });
});

test("reports declined when the guest declined the role", () => {
  assert.deepEqual(
    getResponseStatus(makeResponse({ willBeGodparent: false, canAttendBaptism: false })),
    { label: "Declined", variant: "secondary" }
  );
});

test("reports attending when the guest accepted and can attend", () => {
  assert.deepEqual(
    getResponseStatus(makeResponse({ willBeGodparent: true, canAttendBaptism: true })),
    { label: "Attending", variant: "default" }
  );
});

test("reports not attending when the guest accepted but cannot attend", () => {
  assert.deepEqual(
    getResponseStatus(makeResponse({ willBeGodparent: true, canAttendBaptism: false })),
    { label: "Not attending", variant: "destructive" }
  );
});
