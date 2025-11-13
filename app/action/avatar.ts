"use server";

import { put, del } from "@vercel/blob";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "@/app/action/02-database-session";
import { revalidatePath } from "next/cache";
import { AVATAR_ALLOWED_TYPES, AVATAR_MAX_SIZE } from "@/constants";
import { getUserAvatarById } from "./user";

export type AvatarUploadState = {
  success?: boolean;
  error?: string;
  avatarUrl?: string;
};

export async function uploadAvatar(
  prevState: AvatarUploadState,
  formData: FormData
): Promise<AvatarUploadState> {
  try {
    const session = await verifySession();
    if (!session) {
      return { error: "Unauthorized. Please login." };
    }

    const file = formData.get("avatar") as File;
    if (!file) {
      return { error: "No file provided." };
    }

    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      return {
        error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
      };
    }

    if (file.size > AVATAR_MAX_SIZE) {
      return { error: "File too large. Maximum size is 5MB." };
    }

    // Get current user's avatar to delete old one
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { avatar: true },
    });

    // Upload new avatar
    const blob = await put(
      `avatars/${session.userId}-${Date.now()}-${file.name}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
      }
    );

    // Update database with new avatar URL
    await db
      .update(users)
      .set({ avatar: blob.url })
      .where(eq(users.id, session.userId));

    // Delete old avatar if exists
    if (currentUser?.avatar?.includes("vercel-storage.com")) {
      try {
        await del(currentUser.avatar);
      } catch (error) {
        console.error("Failed to delete old avatar:", error);
      }
    }

    revalidatePath("/profile");
    revalidatePath("/");

    return {
      success: true,
      avatarUrl: blob.url,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    return {
      error: "Failed to upload avatar. Please try again.",
    };
  }
}

export async function deleteAvatar(): Promise<AvatarUploadState> {
  try {
    const session = await verifySession();
    if (!session) {
      return { error: "Unauthorized. Please login." };
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { avatar: true },
    });

    if (!currentUser?.avatar) {
      return { error: "No avatar to delete." };
    }

    // Delete from Vercel Blob
    if (currentUser.avatar.includes("vercel-storage.com")) {
      try {
        await del(currentUser.avatar);
      } catch (error) {
        console.error("Failed to delete avatar from blob:", error);
      }
    }

    // Remove avatar from database
    await db
      .update(users)
      .set({ avatar: null })
      .where(eq(users.id, session.userId));

    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Avatar deletion error:", error);
    return {
      error: "Failed to delete avatar. Please try again.",
    };
  }
}

export async function fetchUserAvatar(userId: number) {
  return await getUserAvatarById(userId);
}
