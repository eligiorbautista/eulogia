"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { eventDetails } from "@/db/schema";
import { requireAdmin } from "@/lib/session";

export async function upsertEventDetails(
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();

  const childName = formData.get("childName")?.toString();
  const gender = formData.get("gender")?.toString();
  const baptismDate = formData.get("baptismDate")?.toString();
  const baptismTime = formData.get("baptismTime")?.toString();
  const venueName = formData.get("venueName")?.toString();
  const venueAddress = formData.get("venueAddress")?.toString();
  const dressCode = formData.get("dressCode")?.toString();
  const message = formData.get("message")?.toString();

  if (!childName || !gender || (gender !== "boy" && gender !== "girl")) {
    return { error: "Child name and gender are required" };
  }

  const existingRows = await db.query.eventDetails.findMany();
  const now = Date.now();

  if (existingRows.length > 0) {
    const primary = existingRows[0];
    await db
      .update(eventDetails)
      .set({
        childName,
        gender,
        baptismDate: baptismDate || null,
        baptismTime: baptismTime || null,
        venueName: venueName || null,
        venueAddress: venueAddress || null,
        dressCode: dressCode || null,
        message: message || null,
        updatedAt: now,
      })
      .where(eq(eventDetails.id, primary.id));

    for (const extra of existingRows.slice(1)) {
      await db.delete(eventDetails).where(eq(eventDetails.id, extra.id));
    }
  } else {
    await db.insert(eventDetails).values({
      childName,
      gender,
      baptismDate: baptismDate || null,
      baptismTime: baptismTime || null,
      venueName: venueName || null,
      venueAddress: venueAddress || null,
      dressCode: dressCode || null,
      message: message || null,
      createdAt: now,
      updatedAt: now,
    });
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/export");
  revalidatePath("/invite");
  return { success: true };
}
