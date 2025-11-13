import {
  serial,
  text,
  pgTable,
  uniqueIndex,
  integer,
  timestamp,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (sessions) => {
    return {
      userIdIdx: index("sessions_user_id_idx").on(sessions.userId),
      expiresAtIdx: index("sessions_expires_at_idx").on(sessions.expiresAt),
    };
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const posts:any = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    parentId: integer("parent_id").references(() => posts.id, {
      onDelete: "cascade",
    }),
    numberValue: doublePrecision("number_value").notNull(),
    operation: text("operation").notNull(), // 'start', 'add', 'subtract', 'multiply', 'divide'
    rightOperand: doublePrecision("right_operand"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (posts) => {
    return {
      userIdIdx: index("posts_user_id_idx").on(posts.userId),
      parentIdIdx: index("posts_parent_id_idx").on(posts.parentId),
      createdAtIdx: index("posts_created_at_idx").on(posts.createdAt),
    };
  }
);

// Type exports
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
