import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  phone: text("phone"),
  notificationPreferences: jsonb("notification_preferences").default({
    daily: true,
    weekly: true,
    critical: true
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const households = pgTable("households", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const householdMembers = pgTable("household_members", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").references(() => households.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").default("member").notNull(), // member, admin
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").references(() => households.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // indoor, outdoor
  parentZoneId: integer("parent_zone_id").references((): any => zones.id),
  isCustom: boolean("is_custom").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taskTemplates = pgTable("task_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // cleaning, maintenance, yardwork, seasonal
  defaultFrequency: text("default_frequency").notNull(), // daily, weekly, monthly, etc.
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  description: text("description"),
  isCustom: boolean("is_custom").default(false).notNull(),
  householdId: integer("household_id").references(() => households.id), // null for predefined tasks
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").references(() => households.id).notNull(),
  templateId: integer("template_id").references(() => taskTemplates.id).notNull(),
  zoneId: integer("zone_id").references(() => zones.id).notNull(),
  assignedTo: integer("assigned_to").references(() => users.id),
  frequency: text("frequency").notNull(),
  customInterval: integer("custom_interval"), // for custom frequencies in days
  lastCompleted: timestamp("last_completed"),
  nextDue: timestamp("next_due").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taskCompletions = pgTable("task_completions", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
  completedBy: integer("completed_by").references(() => users.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  notes: text("notes"),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHouseholdSchema = createInsertSchema(households).omit({
  id: true,
  inviteCode: true,
  createdAt: true,
});

export const insertHouseholdMemberSchema = createInsertSchema(householdMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertZoneSchema = createInsertSchema(zones).omit({
  id: true,
  createdAt: true,
});

export const insertTaskTemplateSchema = createInsertSchema(taskTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
}).extend({
  nextDue: z.union([z.date(), z.string().transform((str) => new Date(str))]),
  dueDate: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
});

export const insertTaskCompletionSchema = createInsertSchema(taskCompletions).omit({
  id: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Household = typeof households.$inferSelect;
export type InsertHousehold = z.infer<typeof insertHouseholdSchema>;

export type HouseholdMember = typeof householdMembers.$inferSelect;
export type InsertHouseholdMember = z.infer<typeof insertHouseholdMemberSchema>;

export type Zone = typeof zones.$inferSelect;
export type InsertZone = z.infer<typeof insertZoneSchema>;

export type TaskTemplate = typeof taskTemplates.$inferSelect;
export type InsertTaskTemplate = z.infer<typeof insertTaskTemplateSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type InsertTaskCompletion = z.infer<typeof insertTaskCompletionSchema>;
