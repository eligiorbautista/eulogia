"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth";
import { createSession, clearSession } from "@/lib/session";

export async function loginAdmin(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.username, username),
  });

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return { error: "Invalid username or password" };
  }

  await createSession(admin.id);
  redirect("/admin/dashboard");
}

export async function logoutAdmin(): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}
