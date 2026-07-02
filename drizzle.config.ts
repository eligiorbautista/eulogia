import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.TURSO_DATABASE_URL || "file:./local.db";
const isLocalFile = databaseUrl.startsWith("file:");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: isLocalFile ? "sqlite" : "turso",
  dbCredentials: {
    url: databaseUrl,
    authToken: isLocalFile ? undefined : process.env.TURSO_AUTH_TOKEN,
  },
});
