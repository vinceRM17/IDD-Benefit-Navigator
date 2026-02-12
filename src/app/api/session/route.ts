import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/security/session';
import { auditLogger } from '@/lib/audit/logger';

/**
 * DELETE /api/session - Destroys the current session
 *
 * This is the endpoint for session cleanup:
 * - Removes session data from server-side store
 * - Clears the session cookie
 * - Logs the session destruction for audit purposes
 *
 * Returns:
 * - 200: Session destroyed successfully
 * - 400: No active session found
 */
export async function DELETE(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value;

  if (!sessionId) {
    auditLogger.warn({
      who: 'anonymous',
      what: 'DELETE /api/session - NO SESSION',
      where: `${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'} - /api/session`,
      result: 400,
    });

    return NextResponse.json(
      { error: 'No active session' },
      { status: 400 }
    );
  }

  // Destroy the session data
  destroySession(sessionId);

  auditLogger.info({
    who: 'anonymous',
    what: 'DELETE /api/session - DESTROYED',
    where: `${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'} - /api/session`,
    result: 200,
    sessionId,
  });

  // Create response with cleared cookie
  const response = NextResponse.json(
    { message: 'Session destroyed' },
    { status: 200 }
  );

  // Clear the session cookie
  response.cookies.set('sessionId', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Expire immediately
  });

  return response;
}

/**
 * POST /api/session - Creates a new session
 *
 * This endpoint can be called to create a new anonymous session
 * Session ID is set as an httpOnly cookie
 */
export async function POST(request: NextRequest) {
  const { createSession } = await import('@/lib/security/session');

  const session = createSession();

  auditLogger.info({
    who: 'anonymous',
    what: 'POST /api/session - CREATED',
    where: `${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'} - /api/session`,
    result: 201,
    sessionId: session.id,
  });

  const response = NextResponse.json(
    { message: 'Session created', expiresAt: session.expiresAt },
    { status: 201 }
  );

  // Set session cookie with security flags
  response.cookies.set('sessionId', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 10 * 60, // 10 minutes for anonymous sessions
  });

  return response;
}
