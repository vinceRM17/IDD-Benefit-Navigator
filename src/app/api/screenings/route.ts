import { NextRequest, NextResponse } from 'next/server';
import { withAuditLog } from '@/lib/audit/middleware';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserScreeningHistory } from '@/lib/db/queries';

/**
 * GET /api/screenings — Returns authenticated user's screening history
 */
export const GET = withAuditLog(async (_request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    ) as NextResponse;
  }

  const screenings = await getUserScreeningHistory(user.userId);

  return NextResponse.json({ screenings }) as NextResponse;
});
