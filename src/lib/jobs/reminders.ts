import { db } from '@/lib/db/client';
import { reminderPreferences, users, emailLog } from '@/lib/db/schema';
import { eq, and, isNull, gte } from 'drizzle-orm';
import { sendReminderEmail } from '@/lib/email/client';
import { logReminderEmail } from '@/lib/db/queries';
import { getProgramDisplayName } from '@/content/programs/recertification';

interface ReminderStats {
  sent: number;
  skipped: number;
  errors: number;
}

/**
 * Check all reminder preferences and send due reminders
 * Runs daily via cron — idempotent via emailLog dedup
 */
export async function checkAndSendReminders(): Promise<ReminderStats> {
  const stats: ReminderStats = { sent: 0, skipped: 0, errors: 0 };

  try {
    // Get all preferences with user info (excluding soft-deleted users)
    const prefs = await db
      .select({
        userId: reminderPreferences.userId,
        programId: reminderPreferences.programId,
        reminderEnabled60: reminderPreferences.reminderEnabled60,
        reminderEnabled30: reminderPreferences.reminderEnabled30,
        reminderEnabled7: reminderPreferences.reminderEnabled7,
        recertificationDate: reminderPreferences.recertificationDate,
        estimatedRecertDate: reminderPreferences.estimatedRecertDate,
        userEmail: users.email,
      })
      .from(reminderPreferences)
      .innerJoin(users, eq(reminderPreferences.userId, users.id))
      .where(isNull(users.deletedAt));

    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const twentyFourHoursAgo = new Date(now.getTime() - oneDayMs);

    for (const pref of prefs) {
      // Determine effective recert date (user override > estimated)
      const effectiveDate = pref.recertificationDate ?? pref.estimatedRecertDate;
      if (!effectiveDate) {
        stats.skipped++;
        continue;
      }

      const daysUntil = Math.ceil(
        (effectiveDate.getTime() - now.getTime()) / oneDayMs
      );

      // Determine which reminder type to send based on day window
      let emailType: string | null = null;
      if (daysUntil >= 54 && daysUntil <= 66 && pref.reminderEnabled60) {
        emailType = 'reminder_60';
      } else if (daysUntil >= 24 && daysUntil <= 36 && pref.reminderEnabled30) {
        emailType = 'reminder_30';
      } else if (daysUntil >= 1 && daysUntil <= 13 && pref.reminderEnabled7) {
        emailType = 'reminder_7';
      }

      if (!emailType) {
        stats.skipped++;
        continue;
      }

      // Check for recent send (idempotency — no duplicates within 24h)
      const recentSends = await db
        .select()
        .from(emailLog)
        .where(
          and(
            eq(emailLog.userId, pref.userId),
            eq(emailLog.programId, pref.programId),
            eq(emailLog.emailType, emailType),
            gte(emailLog.sentAt, twentyFourHoursAgo)
          )
        )
        .limit(1);

      if (recentSends.length > 0) {
        stats.skipped++;
        continue;
      }

      // Send email
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const success = await sendReminderEmail({
        to: pref.userEmail,
        programName: getProgramDisplayName(pref.programId),
        recertDate: effectiveDate,
        daysUntil,
        actionUrl: `${appUrl}/dashboard`,
      });

      if (success) {
        await logReminderEmail(pref.userId, emailType, pref.programId);
        stats.sent++;
      } else {
        stats.errors++;
      }
    }
  } catch (error) {
    console.error('Error in checkAndSendReminders:', error);
    stats.errors++;
  }

  return stats;
}
