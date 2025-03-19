// app/actions/userActions.js
"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function blockUsers(userIds) {
  try {
    await db
      .update(users)
      .set({ status: "blocked" })
      .where(inArray(users.id, userIds));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to block users." };
  }
}

async function unblockUsers(userIds) {
  try {
    await db
      .update(users)
      .set({ status: "active" })
      .where(inArray(users.id, userIds));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to unblock users." };
  }
}

async function deleteUsers(userIds) {
  try {
    await db.delete(users).where(inArray(users.id, userIds));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete users." };
  }
}

export { blockUsers, unblockUsers, deleteUsers };
