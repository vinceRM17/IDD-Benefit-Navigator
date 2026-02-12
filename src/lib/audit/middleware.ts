/**
 * Audit logging middleware for Next.js API routes
 * Wraps handlers to automatically log request/response audit events
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { logAuditEvent, logAuditError } from './logger';

/**
 * Extract client IP from Next.js request
 * Handles X-Forwarded-For and X-Real-IP headers
 */
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Extract user ID from request cookie
 * Returns 'anonymous' if no valid session exists
 */
function getUserId(request: NextRequest): string {
  const cookie = request.cookies.get('idd_auth_session');
  if (!cookie?.value) {
    return 'anonymous';
  }
  // JWT payload is base64url in the second segment — decode for userId
  try {
    const payload = JSON.parse(atob(cookie.value.split('.')[1]));
    return payload.userId ? String(payload.userId) : 'anonymous';
  } catch {
    return 'anonymous';
  }
}

/**
 * Audit logging middleware wrapper for API route handlers
 *
 * Usage:
 * ```typescript
 * export const GET = withAuditLog(async (request: NextRequest) => {
 *   // Your handler logic
 *   return NextResponse.json({ data: 'example' });
 * });
 * ```
 */
export function withAuditLog(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const correlationId = uuidv4();
    const ip = getClientIp(request);
    const userId = getUserId(request);
    const method = request.method;
    const path = new URL(request.url).pathname;

    // Log request start
    logAuditEvent({
      who: userId,
      what: `${method} ${path} - START`,
      where: `${ip} - ${path}`,
      result: 'PENDING',
      correlationId,
    });

    let response: NextResponse;
    let statusCode = 200;

    try {
      // Execute the handler
      response = await handler(request);
      statusCode = response.status;

      // Add correlation ID to response headers
      response.headers.set('X-Correlation-ID', correlationId);
    } catch (error) {
      // Log error
      statusCode = 500;
      const err = error instanceof Error ? error : new Error(String(error));

      logAuditError(err, {
        who: userId,
        what: `${method} ${path} - ERROR`,
        where: `${ip} - ${path}`,
        result: statusCode,
        correlationId,
        duration: Date.now() - startTime,
      });

      // Return error response
      response = NextResponse.json(
        { error: 'Internal server error', correlationId },
        { status: 500 }
      );
      response.headers.set('X-Correlation-ID', correlationId);
    }

    // Log request completion
    const duration = Date.now() - startTime;
    logAuditEvent({
      who: userId,
      what: `${method} ${path} - COMPLETE`,
      where: `${ip} - ${path}`,
      result: statusCode,
      correlationId,
      duration,
    });

    return response;
  };
}
