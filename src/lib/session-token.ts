import crypto from "crypto";

export interface SessionPayload {
  adminId: number;
  expiresAt: number;
}

export function sign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

/**
 * Constant-time string comparison that tolerates differing lengths.
 *
 * `crypto.timingSafeEqual` throws when the buffers differ in size, so a
 * tampered cookie with a short signature would otherwise crash the request.
 */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createToken(payload: SessionPayload, secret: string): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${sign(encoded, secret)}.${encoded}`;
}

export function verifyToken(
  token: string,
  secret: string,
  now: number = Date.now()
): SessionPayload | null {
  const [signature, encoded] = token.split(".");
  if (!signature || !encoded) return null;

  if (!safeEqual(signature, sign(encoded, secret))) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString()
    ) as SessionPayload;

    if (
      typeof payload?.adminId !== "number" ||
      typeof payload?.expiresAt !== "number"
    ) {
      return null;
    }

    if (now > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}
