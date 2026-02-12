import { pgTable, serial, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';

/**
 * Users table
 * Supports optional accounts with soft delete (14-day grace period)
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'), // nullable for soft delete
});

/**
 * Screenings table
 * Stores full screening history with versioning
 */
export const screenings = pgTable('screenings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  screeningData: jsonb('screening_data').notNull(), // stores FullScreeningData
  results: jsonb('results').notNull(), // stores ScreeningResults
  completedAt: timestamp('completed_at').notNull().defaultNow(),
  version: integer('version').notNull().default(1), // track re-screenings
});

/**
 * Reminder Preferences table
 * Per-program reminder settings with hybrid deadline source
 */
export const reminderPreferences = pgTable('reminder_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  programId: text('program_id').notNull(), // e.g., 'ky-medicaid'
  reminderEnabled60: boolean('reminder_enabled_60').notNull().default(true),
  reminderEnabled30: boolean('reminder_enabled_30').notNull().default(true),
  reminderEnabled7: boolean('reminder_enabled_7').notNull().default(true),
  recertificationDate: timestamp('recertification_date'), // user override
  estimatedRecertDate: timestamp('estimated_recert_date'), // system calculated
  lastReminderSent: timestamp('last_reminder_sent'),
});

/**
 * Email Log table
 * Audit trail for all sent reminder emails
 */
export const emailLog = pgTable('email_log', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  emailType: text('email_type').notNull(), // e.g., 'reminder_60', 'reminder_30'
  sentAt: timestamp('sent_at').notNull().defaultNow(),
  programId: text('program_id').notNull(),
});

// Export types for use in application code
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Screening = typeof screenings.$inferSelect;
export type NewScreening = typeof screenings.$inferInsert;

export type ReminderPreference = typeof reminderPreferences.$inferSelect;
export type NewReminderPreference = typeof reminderPreferences.$inferInsert;

export type EmailLog = typeof emailLog.$inferSelect;
export type NewEmailLog = typeof emailLog.$inferInsert;
