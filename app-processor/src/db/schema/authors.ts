import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const authors = pgTable("authors", {
  id: text().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
