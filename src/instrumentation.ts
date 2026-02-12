/**
 * Next.js instrumentation hook
 * Runs once when the server starts — used for env validation and scheduled jobs
 */

export async function register() {
  // Only run on the server (not during edge middleware)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('./lib/env');
    validateEnv();

    // Start cron jobs (reminders + expired account cleanup)
    const { initializeReminderScheduler } = await import('./lib/jobs/scheduler');
    initializeReminderScheduler();
  }
}
