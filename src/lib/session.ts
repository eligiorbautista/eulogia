import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7;

export interface SessionPayload {
  adminId: number;
  expiresAt: number;
}

function getSecret(): string {
  return process.env.SESSION_SECRET || "dev-secret-do-not-use-in-production";
}

function sign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export async function createSession(adminId: number): Promise<void> {
  const payload: SessionPayload = {
    adminId,
    expiresAt: Date.now() + SESSION_EXPIRY_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded, getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${signature}.${encoded}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_MS / 1000,
    path: "/",
  });
}

export async function getAdmin(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  const [signature, encoded] = cookie.split(".");
  if (!signature || !encoded) return null;

  const expected = sign(encoded, getSecret());
  if (
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(encoded, "base64url").toString()
  ) as SessionPayload;
  if (Date.now() > payload.expiresAt) return null;

  return payload;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getAdmin();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
