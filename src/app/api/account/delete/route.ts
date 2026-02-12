import { NextRequest, NextResponse } from 'next/server';
import { withAuditLog } from '@/lib/audit/middleware';
import { getCurrentUser, clearAuthCookie } from '@/lib/auth/session';
import { softDeleteUser } from '@/lib/db/queries';

/**
 * POST /api/account/delete — Soft-delete the authenticated user's account
 * Sets deletedAt timestamp, initiating 14-day grace period
 */
export const POST = withAuditLog(async (_request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    ) as NextResponse;
  }

  const deletedUser = await softDeleteUser(user.userId);

  if (!deletedUser) {
    return NextResponse.json(
      { error: 'Account not found' },
      { status: 404 }
    ) as NextResponse;
  }

  await clearAuthCookie();

  return NextResponse.json({
    message: 'Account scheduled for deletion in 14 days',
    deletedAt: deletedUser.deletedAt,
  }) as NextResponse;
});
