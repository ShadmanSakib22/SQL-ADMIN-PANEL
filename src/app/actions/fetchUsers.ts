"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

export async function fetchUsers(limit: number, offset: number) {
  try {
    const fetchedUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        // password: users.password,
        registration_time: users.registrationTime,
        last_login_time: users.lastLoginTime,
        last_activity_time: users.lastActivityTime,
        status: users.status,
      })
      .from(users)
      .orderBy(desc(users.lastLoginTime))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql`count(*)` }).from(users);

    const formattedUsers = fetchedUsers.map((user) => ({
      ...user,
      registration_time: user.registration_time || null,
      last_login_time: user.last_login_time || null,
      last_activity_time: user.last_activity_time || null,
    }));

    // console.log(formattedUsers);
    return {
      users: formattedUsers,
      totalCount: count,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      users: [],
      totalCount: 0,
    };
  }
}
