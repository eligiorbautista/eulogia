import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { hashPassword } from "@/lib/auth";

const databaseUrl = process.env.TURSO_DATABASE_URL || "file:./local.db";
const isLocalFile = databaseUrl.startsWith("file:");

const client = createClient({
  url: databaseUrl,
  authToken: isLocalFile ? undefined : process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("Resetting database (keeping schema)...");

  await db.delete(schema.responses);
  await db.delete(schema.guests);
  await db.delete(schema.eventDetails);
  await db.delete(schema.admins);

  console.log("Seeding admin credentials...");
  const username = process.env.ADMIN_USERNAME || "elidev";
  const password = process.env.ADMIN_PASSWORD || "pwq123456";

  await db.insert(schema.admins).values({
    username,
    passwordHash: await hashPassword(password),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  console.log(`Admin created: ${username}`);

  const childName = "Our Baby";
  const childGender = "boy";

  await db.insert(schema.eventDetails).values({
    childName,
    gender: childGender,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  console.log(`Event details created for ${childName} (${childGender}).`);

  if (process.env.SEED_SAMPLE_GUESTS === "true") {
    console.log("Seeding sample guests...");
    const now = Date.now();
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randSlug = (len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    await db.insert(schema.guests).values([
      {
        name: "Charles Ian Lee",
        role: "godfather",
        slug: randSlug(8),
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Eunice Abela",
        role: "godmother",
        slug: randSlug(8),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  }

  console.log("Done.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
