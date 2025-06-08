import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { authors } from "./authors.ts";

export const processmentStatusEnum = pgEnum("processment_status", [
  "pending",
  "in_progress",
  "completed",
  "failed",
]);

export const processments = pgTable("processments", {
  id: text().primaryKey(),
  title: text().notNull(),
  description: text(),
  authorId: text()
    .notNull()
    .references(() => authors.id),
  status: processmentStatusEnum().notNull().default("pending"),
  createdAt: timestamp().defaultNow().notNull(),
});
