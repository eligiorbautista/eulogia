"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { generateUniqueSlug } from "@/lib/slug";

export async function createGuest(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();

  const name = formData.get("name")?.toString();
  const role = formData.get("role")?.toString();

  if (!name || !role || (role !== "godfather" && role !== "godmother")) {
    return { error: "Name and valid role are required" };
  }

  const slug = await generateUniqueSlug();
  const now = Date.now();

  await db.insert(guests).values({
    name,
    role,
    slug,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/guests");
  return { success: true };
}

export async function updateGuest(
  id: number,
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();

  const name = formData.get("name")?.toString();
  const role = formData.get("role")?.toString();

  if (!name || !role || (role !== "godfather" && role !== "godmother")) {
    return { error: "Name and valid role are required" };
  }

  await db
    .update(guests)
    .set({
      name,
      role,
      updatedAt: Date.now(),
    })
    .where(eq(guests.id, id));

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/guests");
  return { success: true };
}

export async function deleteGuest(id: number): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();

  await db.delete(guests).where(eq(guests.id, id));

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/guests");
  return { success: true };
}
