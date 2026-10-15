import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createToken,
  verifyToken,
  type SessionPayload,
} from "./session-token";

const SESSION_COOKIE = "admin_session";
const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7;

export type { SessionPayload };

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[session] SESSION_SECRET is not set. Falling back to an insecure development secret; set SESSION_SECRET in production."
    );
  }

  return "dev-secret-do-not-use-in-production";
}

export async function createSession(adminId: number): Promise<void> {
  const token = createToken(
    {
      adminId,
      expiresAt: Date.now() + SESSION_EXPIRY_MS,
    },
    getSecret()
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
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

  return verifyToken(cookie, getSecret());
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
