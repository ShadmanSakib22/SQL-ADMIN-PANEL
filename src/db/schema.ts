import { sql, SQL } from "drizzle-orm";
import { sqliteTable, text, integer, check } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    registrationTime: text("registration_time").default(
      sql`(CURRENT_TIMESTAMP)`
    ),
    lastLoginTime: text("last_login_time"),
    lastActivityTime: text("last_activity_time"),
    status: text("status", { enum: ["active", "blocked"] }).default("active"),
  },
  (table) => [
    check("status_check", sql`${table.status} IN ('active', 'blocked')`),
  ]
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type UserUpdate = {
  name?: string;
  email?: string;
  password?: string;
  lastLoginTime?: string | SQL;
  lastActivityTime?: string | SQL;
  status?: "active" | "blocked";
};
