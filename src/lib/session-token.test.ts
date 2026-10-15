import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createToken,
  safeEqual,
  sign,
  verifyToken,
  type SessionPayload,
} from "./session-token.ts";

const SECRET = "test-secret";

function makePayload(expiresAt: number): SessionPayload {
  return { adminId: 7, expiresAt };
}

test("round-trips a valid token", () => {
  const token = createToken(makePayload(Date.now() + 60_000), SECRET);

  const payload = verifyToken(token, SECRET);

  assert.deepEqual(payload, makePayload(payload!.expiresAt));
  assert.equal(payload?.adminId, 7);
});

test("rejects a token signed with a different secret", () => {
  const token = createToken(makePayload(Date.now() + 60_000), SECRET);

  assert.equal(verifyToken(token, "other-secret"), null);
});

test("rejects an expired token", () => {
  const token = createToken(makePayload(Date.now() - 1), SECRET);

  assert.equal(verifyToken(token, SECRET), null);
});

test("returns null instead of throwing when the signature length is wrong", () => {
  // A tampered cookie can contain a signature of any length. Comparing buffers
  // of different lengths with crypto.timingSafeEqual throws a RangeError, so a
  // malformed signature must be rejected without throwing.
  assert.doesNotThrow(() => verifyToken("abc.eyJhZG1pbklkIjo3fQ", SECRET));
  assert.equal(verifyToken("abc.eyJhZG1pbklkIjo3fQ", SECRET), null);
});

test("rejects a token without a signature separator", () => {
  assert.equal(verifyToken("no-dot-here", SECRET), null);
});

test("rejects a token with a corrupted signature of the correct length", () => {
  const token = createToken(makePayload(Date.now() + 60_000), SECRET);
  const [signature, encoded] = token.split(".");
  const flipped = (signature[0] === "a" ? "b" : "a") + signature.slice(1);

  assert.equal(verifyToken(`${flipped}.${encoded}`, SECRET), null);
});

test("rejects a token whose payload is not valid JSON", () => {
  const encoded = Buffer.from("not json").toString("base64url");
  const token = `${sign(encoded, SECRET)}.${encoded}`;

  assert.equal(verifyToken(token, SECRET), null);
});

test("safeEqual compares equal strings and rejects different ones", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
});

test("safeEqual returns false for different lengths without throwing", () => {
  assert.doesNotThrow(() => safeEqual("abc", "abcd"));
  assert.equal(safeEqual("abc", "abcd"), false);
});
