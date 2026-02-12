import { NextRequest, NextResponse } from 'next/server';
import { withAuditLog } from '@/lib/audit/middleware';
import { getCurrentUser } from '@/lib/auth/session';
import { cancelDeletion } from '@/lib/db/queries';

/**
 * POST /api/account/cancel-delete — Cancel pending account deletion
 * Clears deletedAt timestamp during grace period
 */
export const POST = withAuditLog(async (_request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    ) as NextResponse;
  }

  const restoredUser = await cancelDeletion(user.userId);

  if (!restoredUser) {
    return NextResponse.json(
      { error: 'Account not found' },
      { status: 404 }
    ) as NextResponse;
  }

  return NextResponse.json({
    message: 'Account deletion cancelled',
  }) as NextResponse;
});
