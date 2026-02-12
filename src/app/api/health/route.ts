/**
 * Health check endpoint for testing audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuditLog } from '@/lib/audit/middleware';

async function handler(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}

export const GET = withAuditLog(handler);
