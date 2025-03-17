"use server";

import { SignupFormSchema, FormState } from "@/lib/definitions";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

export async function register(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate form data
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

    // Try to insert new user
    await db.insert(users).values({
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      password: hashedPassword,
    });

    return {
      message: "Registration Successful",
    };
  } catch (error) {
    // Check if error is due to unique constraint violation
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed: users.email")
    ) {
      return {
        errors: {
          email: ["The Email is already registered."],
        },
      };
    }

    return {
      message: "Database error. Please try again.",
    };
  }
}
