import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const eventDetails = sqliteTable("event_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  childName: text("child_name").notNull(),
  gender: text("gender", { enum: ["boy", "girl"] }).notNull(),
  baptismDate: text("baptism_date"),
  baptismTime: text("baptism_time"),
  venueName: text("venue_name"),
  venueAddress: text("venue_address"),
  dressCode: text("dress_code"),
  message: text("message"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const guests = sqliteTable("guests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role", { enum: ["godfather", "godmother"] }).notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const responses = sqliteTable("responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestId: integer("guest_id")
    .notNull()
    .unique()
    .references(() => guests.id, { onDelete: "cascade" }),
  willBeGodparent: integer("will_be_godparent", {
    mode: "boolean",
  }).notNull(),
  canAttendBaptism: integer("can_attend_baptism", { mode: "boolean" }).notNull(),
  messageForBaby: text("message_for_baby"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type EventDetail = typeof eventDetails.$inferSelect;
export type NewEventDetail = typeof eventDetails.$inferInsert;

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;

export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
