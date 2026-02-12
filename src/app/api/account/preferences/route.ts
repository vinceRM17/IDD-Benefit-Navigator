import { NextRequest, NextResponse } from 'next/server';
import { withAuditLog } from '@/lib/audit/middleware';
import { getCurrentUser } from '@/lib/auth/session';
import {
  getUserReminderPreferences,
  getLatestScreening,
  upsertReminderPreference,
} from '@/lib/db/queries';
import { getEstimatedRecertDate, programRecertCycles } from '@/content/programs/recertification';
import type { ScreeningResults } from '@/lib/results/types';

/**
 * GET /api/account/preferences — Get reminder preferences for eligible programs
 * Creates defaults for any eligible programs that don't have preferences yet
 */
export const GET = withAuditLog(async (_request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    ) as NextResponse;
  }

  // Get latest screening to determine eligible programs
  const latestScreening = await getLatestScreening(user.userId);
  const results = latestScreening?.results as ScreeningResults | null;

  const eligibleProgramIds = results?.programs
    ?.filter((p) => p.eligible && (p.confidence === 'likely' || p.confidence === 'possible'))
    .map((p) => p.programId) ?? [];

  // Ensure defaults exist for each eligible program
  const enrollmentDate = latestScreening?.completedAt
    ? new Date(latestScreening.completedAt)
    : new Date();

  for (const programId of eligibleProgramIds) {
    if (programId in programRecertCycles) {
      const estimatedDate = getEstimatedRecertDate(programId, enrollmentDate);
      await upsertReminderPreference(user.userId, programId, {
        estimatedRecertDate: estimatedDate,
      });
    }
  }

  const preferences = await getUserReminderPreferences(user.userId);

  return NextResponse.json({ preferences }) as NextResponse;
});

/**
 * PUT /api/account/preferences — Update reminder preference for a specific program
 * Body: { programId, reminderEnabled60?, reminderEnabled30?, reminderEnabled7?, recertificationDate? }
 */
export const PUT = withAuditLog(async (request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    ) as NextResponse;
  }

  const body = await request.json();
  const { programId, reminderEnabled60, reminderEnabled30, reminderEnabled7, recertificationDate } = body;

  if (!programId) {
    return NextResponse.json(
      { error: 'programId is required' },
      { status: 400 }
    ) as NextResponse;
  }

  const updates: Record<string, unknown> = {};
  if (typeof reminderEnabled60 === 'boolean') updates.reminderEnabled60 = reminderEnabled60;
  if (typeof reminderEnabled30 === 'boolean') updates.reminderEnabled30 = reminderEnabled30;
  if (typeof reminderEnabled7 === 'boolean') updates.reminderEnabled7 = reminderEnabled7;
  if (recertificationDate !== undefined) {
    updates.recertificationDate = recertificationDate ? new Date(recertificationDate) : null;
  }

  const preference = await upsertReminderPreference(user.userId, programId, updates);

  return NextResponse.json({ preference }) as NextResponse;
});
