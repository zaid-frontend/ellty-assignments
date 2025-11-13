import "@/drizzle/envConfig";
import { db } from "@/drizzle/db";
import { users, sessions, posts } from "@/drizzle/schema";

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...\n");

    // Test 1: Count users
    const userCount = await db.select().from(users);
    console.log(`✅ Users table: ${userCount.length} users found`);

    // Test 2: Count sessions
    const sessionCount = await db.select().from(sessions);
    console.log(`✅ Sessions table: ${sessionCount.length} sessions found`);

    // Test 3: Count posts
    const postCount = await db.select().from(posts);
    console.log(`✅ Posts table: ${postCount.length} posts found`);

    console.log("\n✨ Database connection successful!\n");

    // Show sample data if exists
    if (userCount.length > 0) {
      console.log("📊 Sample User:", {
        id: userCount[0].id,
        name: userCount[0].name,
        email: userCount[0].email,
      });
    }

    if (postCount.length > 0) {
      console.log("📊 Sample Post:", {
        id: postCount[0].id,
        userId: postCount[0].userId,
        numberValue: postCount[0].numberValue,
        operation: postCount[0].operation,
      });
    }
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

testDatabase();
