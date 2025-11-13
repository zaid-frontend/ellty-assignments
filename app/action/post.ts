"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { posts, users } from "@/drizzle/schema";
import { verifySession } from "@/app/action/02-database-session";
import { eq } from "drizzle-orm";

export async function createStartingNumber(number: number) {
  try {
    // Get current user from session
    const session = await verifySession();

    // Insert into database
    await db.insert(posts).values({
      userId: session.userId,
      parentId: null,
      numberValue: number,
      operation: "start",
      rightOperand: null,
    });

    // Revalidate the page
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating starting number:", error);
    throw error;
  }
}

export async function addOperation(
  parentId: number,
  operation: "add" | "subtract" | "multiply" | "divide",
  rightNumber: number
) {
  try {
    // Get current user from session
    const session = await verifySession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    // Get parent post
    const parentPost = await db.query.posts.findFirst({
      where: eq(posts.id, parentId),
    });

    if (!parentPost) {
      throw new Error("Parent post not found");
    }

    // Calculate result
    let result: number;
    switch (operation) {
      case "add":
        result = parentPost.numberValue + rightNumber;
        break;
      case "subtract":
        result = parentPost.numberValue - rightNumber;
        break;
      case "multiply":
        result = parentPost.numberValue * rightNumber;
        break;
      case "divide":
        if (rightNumber === 0) {
          throw new Error("Cannot divide by zero");
        }
        result = parentPost.numberValue / rightNumber;
        break;
    }

    // Insert new post
    await db.insert(posts).values({
      userId: session.userId,
      parentId: parentId,
      numberValue: result,
      operation: operation,
      rightOperand: rightNumber,
    });

    // Revalidate the page
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error adding operation:", error);
    throw error;
  }
}

export async function getAllPosts() {
  try {
    // Fetch all posts with user information
    const allPosts = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        parentId: posts.parentId,
        numberValue: posts.numberValue,
        operation: posts.operation,
        rightOperand: posts.rightOperand,
        createdAt: posts.createdAt,
        username: users.name,
        avatarUrl: users.avatar,
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(posts.createdAt);

    return allPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function deletePost(postId: number) {
  try {
    const session = await verifySession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    // Check if user owns the post
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== session.userId) {
      throw new Error("Unauthorized");
    }

    // Delete post (cascades to children)
    await db.delete(posts).where(eq(posts.id, postId));

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
