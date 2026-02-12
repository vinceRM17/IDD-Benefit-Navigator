import { eq, and, isNull, isNotNull, desc, lte, sql } from 'drizzle-orm';
import { db } from './client';
import { users, screenings, reminderPreferences, emailLog, referrals } from './schema';
import type { NewUser, NewScreening, NewReminderPreference, NewEmailLog, NewReferral, Referral } from './schema';

/**
 * User CRUD Operations
 */

/**
 * Get user by email (excludes soft-deleted users)
 */
export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  return result[0] || null;
}

/**
 * Create new user
 */
export async function createUser(email: string, passwordHash: string) {
  const newUser: NewUser = {
    email,
    passwordHash,
  };

  const result = await db.insert(users).values(newUser).returning();
  return result[0];
}

/**
 * Soft delete user (sets deletedAt timestamp)
 */
export async function softDeleteUser(userId: number) {
  const result = await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  return result[0] || null;
}

/**
 * Cancel deletion (clears deletedAt timestamp)
 */
export async function cancelDeletion(userId: number) {
  const result = await db
    .update(users)
    .set({ deletedAt: null })
    .where(eq(users.id, userId))
    .returning();

  return result[0] || null;
}

/**
 * Hard delete user (cascades to all related records)
 */
export async function hardDeleteUser(userId: number) {
  const result = await db.delete(users).where(eq(users.id, userId)).returning();
  return result[0] || null;
}

/**
 * Get users with expired soft delete grace period (14 days)
 */
export async function getExpiredSoftDeletes() {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  return await db
    .select()
    .from(users)
    .where(
      and(
        isNotNull(users.deletedAt),
        lte(users.deletedAt, fourteenDaysAgo)
      )
    );
}

/**
 * Screening Operations
 */

/**
 * Save screening for user with automatic versioning
 */
export async function saveScreening(
  userId: number,
  screeningData: unknown,
  results: unknown
) {
  // Count existing screenings to determine version number
  const existingScreenings = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(screenings)
    .where(eq(screenings.userId, userId));

  const version = (existingScreenings[0]?.count || 0) + 1;

  const newScreening: NewScreening = {
    userId,
    screeningData,
    results,
    version,
  };

  const result = await db.insert(screenings).values(newScreening).returning();
  return result[0];
}

/**
 * Get all screenings for user ordered by most recent first
 */
export async function getUserScreeningHistory(userId: number) {
  return await db
    .select()
    .from(screenings)
    .where(eq(screenings.userId, userId))
    .orderBy(desc(screenings.completedAt));
}

/**
 * Get most recent screening for user
 */
export async function getLatestScreening(userId: number) {
  const result = await db
    .select()
    .from(screenings)
    .where(eq(screenings.userId, userId))
    .orderBy(desc(screenings.completedAt))
    .limit(1);

  return result[0] || null;
}

/**
 * Reminder Preference Operations
 */

/**
 * Get all reminder preferences for user
 */
export async function getUserReminderPreferences(userId: number) {
  return await db
    .select({
      id: reminderPreferences.id,
      userId: reminderPreferences.userId,
      programId: reminderPreferences.programId,
      reminderEnabled60: reminderPreferences.reminderEnabled60,
      reminderEnabled30: reminderPreferences.reminderEnabled30,
      reminderEnabled7: reminderPreferences.reminderEnabled7,
      recertificationDate: reminderPreferences.recertificationDate,
      estimatedRecertDate: reminderPreferences.estimatedRecertDate,
      lastReminderSent: reminderPreferences.lastReminderSent,
      userEmail: users.email,
    })
    .from(reminderPreferences)
    .innerJoin(users, eq(reminderPreferences.userId, users.id))
    .where(eq(reminderPreferences.userId, userId));
}

/**
 * Upsert reminder preference for user+program combination
 */
export async function upsertReminderPreference(
  userId: number,
  programId: string,
  prefs: Partial<Omit<NewReminderPreference, 'userId' | 'programId'>>
) {
  // Check if preference already exists
  const existing = await db
    .select()
    .from(reminderPreferences)
    .where(
      and(
        eq(reminderPreferences.userId, userId),
        eq(reminderPreferences.programId, programId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing preference
    const result = await db
      .update(reminderPreferences)
      .set(prefs)
      .where(
        and(
          eq(reminderPreferences.userId, userId),
          eq(reminderPreferences.programId, programId)
        )
      )
      .returning();

    return result[0];
  } else {
    // Insert new preference
    const newPref: NewReminderPreference = {
      userId,
      programId,
      ...prefs,
    };

    const result = await db
      .insert(reminderPreferences)
      .values(newPref)
      .returning();

    return result[0];
  }
}

/**
 * Email Log Operations
 */

/**
 * Log sent reminder email
 */
export async function logReminderEmail(
  userId: number,
  emailType: string,
  programId: string
) {
  const newLog: NewEmailLog = {
    userId,
    emailType,
    programId,
  };

  const result = await db.insert(emailLog).values(newLog).returning();
  return result[0];
}

/**
 * Get email log for user
 */
export async function getUserEmailLog(userId: number) {
  return await db
    .select()
    .from(emailLog)
    .where(eq(emailLog.userId, userId))
    .orderBy(desc(emailLog.sentAt));
}

/**
 * Referral Operations
 */

/**
 * Create a new referral record
 */
export async function createReferral(data: NewReferral): Promise<Referral> {
  const result = await db.insert(referrals).values(data).returning();
  return result[0];
}

/**
 * Get all referrals for a user ordered by most recent first
 */
export async function getUserReferrals(userId: number): Promise<Referral[]> {
  return await db
    .select()
    .from(referrals)
    .where(eq(referrals.userId, userId))
    .orderBy(desc(referrals.sentAt));
}

/**
 * Mark referral as viewed (called by webhook on email open)
 * Only updates if current status is 'sent' to prevent overwriting
 */
export async function markReferralViewed(referralId: number, viewedAt: Date): Promise<void> {
  await db
    .update(referrals)
    .set({
      status: 'viewed',
      viewedAt
    })
    .where(
      and(
        eq(referrals.id, referralId),
        eq(referrals.status, 'sent')
      )
    );
}
