import cron from 'node-cron';
import { checkAndSendReminders } from './reminders';
import { cleanupExpiredAccounts } from './cleanup';

/**
 * Initialize the daily cron job scheduler
 * Runs at 9:00 AM UTC daily — sends reminders and cleans up expired accounts
 */
export function initializeReminderScheduler(): void {
  cron.schedule('0 9 * * *', async () => {
    console.log('[scheduler] Starting daily jobs...');

    try {
      const reminderStats = await checkAndSendReminders();
      console.log(
        `[scheduler] Reminders complete — sent: ${reminderStats.sent}, skipped: ${reminderStats.skipped}, errors: ${reminderStats.errors}`
      );
    } catch (error) {
      console.error('[scheduler] Reminder job failed:', error);
    }

    try {
      const deletedCount = await cleanupExpiredAccounts();
      console.log(`[scheduler] Cleanup complete — deleted: ${deletedCount} expired accounts`);
    } catch (error) {
      console.error('[scheduler] Cleanup job failed:', error);
    }

    console.log('[scheduler] Daily jobs complete.');
  });

  console.log('[scheduler] Reminder scheduler initialized (daily at 9:00 AM UTC)');
}
