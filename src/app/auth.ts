//src\app\auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, SelectUser, UserUpdate } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        // Use SelectUser type for the query result
        const results: SelectUser[] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email));

        if (!results.length) {
          throw new Error("No user found with this email");
        }

        const user: SelectUser = results[0];

        if (user.status === "blocked") {
          throw new Error(
            "Your account has been blocked. Please contact support."
          );
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        try {
          // Prepare update object with UserUpdate type
          const updateData: UserUpdate = {
            lastLoginTime: sql`(CURRENT_TIMESTAMP)`,
            lastActivityTime: sql`(CURRENT_TIMESTAMP)`,
          };

          await db.update(users).set(updateData).where(eq(users.id, user.id));
        } catch (updateError) {
          console.error("Error updating login/activity times:", updateError);
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/page/login" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.sub) {
        try {
          // Find the user by ID from the token
          const userResults = await db
            .select()
            .from(users)
            .where(eq(users.id, parseInt(token.sub)));

          if (userResults.length > 0) {
            const updateData: UserUpdate = {
              lastActivityTime: sql`(CURRENT_TIMESTAMP)`,
            };

            await db
              .update(users)
              .set(updateData)
              .where(eq(users.id, parseInt(token.sub)));
          }
        } catch (error) {
          console.error("Error updating logout time:", error);
        }
      }
    },
  },
};
