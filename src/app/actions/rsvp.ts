"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guests, responses } from "@/db/schema";

export async function submitRsvp(
  slug: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const guest = await db.query.guests.findFirst({
    where: eq(guests.slug, slug),
  });

  if (!guest) {
    return { error: "Invitation not found" };
  }

  const willBe = formData.get("willBeGodparent")?.toString();
  const canAttend = formData.get("canAttendBaptism")?.toString();
  const message = formData.get("messageForBaby")?.toString();

  if (!willBe) {
    return { error: "Please answer all required questions" };
  }

  const existing = await db.query.responses.findFirst({
    where: eq(responses.guestId, guest.id),
  });

  const values = {
    guestId: guest.id,
    willBeGodparent: willBe === "yes",
    canAttendBaptism: willBe === "yes" ? canAttend === "yes" : false,
    messageForBaby: message?.trim() || null,
    updatedAt: Date.now(),
  };

  if (existing) {
    await db
      .update(responses)
      .set(values)
      .where(eq(responses.id, existing.id));
  } else {
    await db.insert(responses).values({
      ...values,
      createdAt: Date.now(),
    });
  }

  revalidatePath(`/invite/${slug}`);
  return { success: true };
}
