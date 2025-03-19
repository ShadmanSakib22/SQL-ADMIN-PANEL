"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function fetchUsers() {
  try {
    const fetchedUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        registration_time: users.registrationTime,
        last_login_time: users.lastLoginTime,
        last_activity_time: users.lastActivityTime,
        status: users.status,
      })
      .from(users)
      .orderBy(desc(users.lastLoginTime));

    // TODO: When Users > 200. Limit the fetch to 200. Setup Button to load more on usersTable.

    const formattedUsers = fetchedUsers.map((user) => ({
      ...user,
      registration_time: user.registration_time || null,
      last_login_time: user.last_login_time || null,
      last_activity_time: user.last_activity_time || null,
    }));

    return {
      users: formattedUsers,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      users: [],
    };
  }
}
