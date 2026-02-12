import { NextRequest, NextResponse } from 'next/server';
import { withAuditLog } from '@/lib/audit/middleware';
import { getCurrentUser } from '@/lib/auth/session';
import { saveScreening } from '@/lib/db/queries';

/**
 * POST /api/screenings/save — Save a screening for the authenticated user
 * Body: { screeningData: object, results: object }
 */
export const POST = withAuditLog(async (request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    ) as NextResponse;
  }

  const body = await request.json();
  const { screeningData, results } = body;

  if (!screeningData || !results) {
    return NextResponse.json(
      { error: 'screeningData and results are required' },
      { status: 400 }
    ) as NextResponse;
  }

  const screening = await saveScreening(user.userId, screeningData, results);

  return NextResponse.json({ screening }, { status: 201 }) as NextResponse;
});
