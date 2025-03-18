// app/actions/userActions.js
"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

async function getCurrentUserEmail() {
  const session = await getServerSession();
  return session?.user?.email || null;
}

async function blockUsers(emails) {
  const currentUserEmail = await getCurrentUserEmail();
  if (!currentUserEmail) {
    return { success: false, error: " User not authenticated." };
  }

  try {
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.email, currentUserEmail))
      .get();
    if (currentUser && currentUser.status === "blocked") {
      return {
        success: false,
        error: " Blocked users cannot perform this action.",
      };
    }

    await db
      .update(users)
      .set({ status: "blocked" })
      .where(inArray(users.email, emails));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: " Failed to block users." };
  }
}

async function unblockUsers(emails) {
  const currentUserEmail = await getCurrentUserEmail();
  if (!currentUserEmail) {
    return { success: false, error: " User not authenticated." };
  }

  try {
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.email, currentUserEmail))
      .get();
    if (currentUser && currentUser.status === "blocked") {
      return {
        success: false,
        error: " Blocked users cannot perform this action.",
      };
    }

    await db
      .update(users)
      .set({ status: "active" })
      .where(inArray(users.email, emails));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: " Failed to unblock users." };
  }
}

async function deleteUsers(emails) {
  const currentUserEmail = await getCurrentUserEmail();
  if (!currentUserEmail) {
    return { success: false, error: " User not authenticated." };
  }

  try {
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.email, currentUserEmail))
      .get();
    if (currentUser && currentUser.status === "blocked") {
      return {
        success: false,
        error: " Blocked users cannot perform this action.",
      };
    }

    await db.delete(users).where(inArray(users.email, emails));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: " Failed to delete users." };
  }
}

export { blockUsers, unblockUsers, deleteUsers };
