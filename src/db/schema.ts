import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Demo product catalogue for Rajgharana Mega Mart - Nawada.
 * Products are clearly labelled as sample listings in the UI.
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  name: text("name").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  price: integer("price").notNull(),
  mrp: integer("mrp").notNull(),
  /** Rating stored in tenths (45 => 4.5) */
  rating: integer("rating").notNull().default(45),
  ratingCount: integer("rating_count").notNull().default(0),
  image: text("image").notNull(),
  description: text("description").notNull(),
  fabric: text("fabric"),
  occasion: text("occasion"),
  sizes: text("sizes").array().notNull(),
  isNew: boolean("is_new").notNull().default(false),
  isFestive: boolean("is_festive").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  playerName: varchar("player_name", { length: 24 }).notNull(),
  score: integer("score").notNull(),
  maxCombo: integer("max_combo").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type GameScore = typeof gameScores.$inferSelect;
