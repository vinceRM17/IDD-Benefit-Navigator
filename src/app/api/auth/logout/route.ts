import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/session';
import { withAuditLog } from '@/lib/audit/middleware';

async function logoutHandler(_request: NextRequest): Promise<NextResponse> {
  await clearAuthCookie();
  return NextResponse.json({ success: true }, { status: 200 });
}

export const POST = withAuditLog(logoutHandler);
