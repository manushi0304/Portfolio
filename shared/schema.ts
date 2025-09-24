// shared/schema.ts
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Zod schema with your constraints
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3).max(50),
  password: (schema) => schema.min(6).max(128),
}).pick({ username: true, password: true });

// TS types
export type User = InferSelectModel<typeof users>;   // row returned from SELECT
export type NewUser = InferInsertModel<typeof users>; // shape for INSERT (optional)
export type InsertUser = z.infer<z.ZodType<any, any, any>>; // validated input
