import { test } from "node:test";
import assert from "node:assert/strict";

import { formatDate, formatTime } from "./format.ts";

test("formats a date-only string without shifting the day", () => {
  // `new Date("2026-10-15")` is parsed as UTC midnight and can render as
  // October 14 in negative-UTC timezones. The formatter must keep the day.
  assert.equal(
    formatDate("2026-10-15"),
    "Thursday, October 15, 2026"
  );
});

test("returns null for empty or missing dates", () => {
  assert.equal(formatDate(null), null);
  assert.equal(formatDate(undefined), null);
  assert.equal(formatDate(""), null);
});

test("returns the original value when the date cannot be parsed", () => {
  assert.equal(formatDate("not-a-date"), "not-a-date");
});

test("formats afternoon times as 12-hour", () => {
  assert.equal(formatTime("14:30"), "2:30 PM");
});

test("formats midnight and noon correctly", () => {
  assert.equal(formatTime("00:05"), "12:05 AM");
  assert.equal(formatTime("12:00"), "12:00 PM");
});

test("formats morning times without a leading zero", () => {
  assert.equal(formatTime("09:07"), "9:07 AM");
});

test("returns null for empty or missing times", () => {
  assert.equal(formatTime(null), null);
  assert.equal(formatTime(""), null);
});

test("returns the original value for an unparseable time", () => {
  assert.equal(formatTime("morning"), "morning");
});
