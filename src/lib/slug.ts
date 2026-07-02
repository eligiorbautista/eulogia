import { db } from "@/db";
import { guests } from "@/db/schema";
import { eq } from "drizzle-orm";

const SLUG_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomSlug(length: number): string {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)];
  }
  return slug;
}

export async function generateUniqueSlug(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = randomSlug(8);
    const existing = await db.query.guests.findFirst({
      where: eq(guests.slug, slug),
    });
    if (!existing) return slug;
  }
  return randomSlug(12);
}
