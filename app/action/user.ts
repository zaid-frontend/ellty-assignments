"use server";

import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { users } from "@/drizzle/schema";
import { verifySession } from "@/app/action/02-database-session";

export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      columns: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    const user = data[0];
    return user;
  } catch (error) {
    console.log("Failed to fetch user", error);
    return null;
  }
});

export async function getUserAvatarById(userId: number) {
  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, userId),
      columns: {
        avatar: true,
      },
      limit: 1,
    });

    return data[0]?.avatar ?? null;
  } catch (error) {
    console.error("Failed to fetch avatar for user:", error);
    return null;
  }
}
