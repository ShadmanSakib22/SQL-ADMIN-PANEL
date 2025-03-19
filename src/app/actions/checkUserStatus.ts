// src/app/actions/checkUserStatus.ts
"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";

export async function checkUserStatus() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { status: "unauthenticated" };
  }

  const results = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (results.length === 0) {
    return { status: "userNotFound" };
  }

  const user = results[0];

  if (user.status === "blocked") {
    return { status: "blocked" };
  }

  return { status: "active" };
}
