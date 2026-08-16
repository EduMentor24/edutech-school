import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Configuration unique du fournisseur Mentor IA.
 * La clé reste chiffrée et n'est jamais envoyée au client.
 */
export const mentorSettings = mysqlTable("mentor_settings", {
  id: int("id").primaryKey(),
  provider: varchar("provider", { length: 64 }).notNull().default("Google Gemini"),
  model: varchar("model", { length: 128 }).notNull().default("gemini-2.5-flash-lite"),
  apiKeyCiphertext: text("apiKeyCiphertext").notNull(),
  encryptionIv: varchar("encryptionIv", { length: 64 }).notNull(),
  encryptionAuthTag: varchar("encryptionAuthTag", { length: 64 }).notNull(),
  keySuffix: varchar("keySuffix", { length: 12 }).notNull(),
  status: mysqlEnum("status", ["unknown", "valid", "quota", "invalid", "unavailable"]).notNull().default("unknown"),
  lastCheckedAt: timestamp("lastCheckedAt"),
  updatedBy: varchar("updatedBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MentorSettings = typeof mentorSettings.$inferSelect;
