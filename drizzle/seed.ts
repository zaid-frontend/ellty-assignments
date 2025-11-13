import "@/drizzle/envConfig";
import { db } from "@/drizzle/db";
import { users, posts } from "@/drizzle/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...\n");

  try {
    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    const [user] = await db
      .insert(users)
      .values({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      })
      .returning();

    console.log("✅ Created test user:", {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    // Create sample posts
    const [post1] = await db
      .insert(posts)
      .values({
        userId: user.id,
        parentId: null,
        numberValue: 10,
        operation: "start",
        rightOperand: null,
      })
      .returning();

    console.log("✅ Created starting post:", post1.numberValue);

    const [post2] = await db
      .insert(posts)
      .values({
        userId: user.id,
        parentId: post1.id,
        numberValue: 15,
        operation: "add",
        rightOperand: 5,
      })
      .returning();

    console.log("✅ Created child post:", {
      parent: post1.numberValue,
      operation: "add",
      operand: 5,
      result: post2.numberValue,
    });

    const [post3] = await db
      .insert(posts)
      .values({
        userId: user.id,
        parentId: post2.id,
        numberValue: 30,
        operation: "multiply",
        rightOperand: 2,
      })
      .returning();

    console.log("✅ Created grandchild post:", {
      parent: post2.numberValue,
      operation: "multiply",
      operand: 2,
      result: post3.numberValue,
    });

    console.log("\n✨ Seeding completed successfully!\n");
    console.log("🔐 Test credentials:");
    console.log("   Email: test@example.com");
    console.log("   Password: password123\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
