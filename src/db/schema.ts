import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, check } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    registrationTime: integer("registration_time", {
      mode: "timestamp",
    }).default(sql`(CURRENT_TIMESTAMP)`),
    lastLoginTime: integer("last_login_time", { mode: "timestamp" }),
    lastActivityTime: integer("last_activity_time", { mode: "timestamp" }),
    status: text("status", { enum: ["active", "blocked"] }).default("active"),
  },
  (table) => [
    check("status_check", sql`${table.status} IN ('active', 'blocked')`),
  ]
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
