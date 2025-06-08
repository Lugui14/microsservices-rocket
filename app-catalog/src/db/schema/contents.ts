import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { authors } from "./authors.ts";

export const contentStatusEnum = pgEnum("content_status", [
  "waiting_processment",
  "waiting_classification",
  "available",
  "unavailable",
]);

export const contents = pgTable("contents", {
  id: text().primaryKey(),
  title: text().notNull(),
  description: text(),
  authorId: text()
    .notNull()
    .references(() => authors.id),
  status: contentStatusEnum().notNull().default("waiting_processment"),
  createdAt: timestamp().defaultNow().notNull(),
});
