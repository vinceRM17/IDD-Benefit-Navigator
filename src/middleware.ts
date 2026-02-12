/**
 * Next.js middleware for security headers and rate limiting
 * Runs on every request before reaching the application
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from './lib/security/helmet-config';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from './lib/security/rate-limit';

/**
 * Extract client IP from request headers
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

  // Fallback to a default for local development
  return '127.0.0.1';
}

/**
 * Determine if path should be rate limited
 */
function shouldRateLimit(pathname: string): boolean {
  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    return true;
  }
  return false;
}

/**
 * Determine rate limit configuration based on path
 */
function getRateLimitConfig(pathname: string) {
  // Stricter limits for auth endpoints
  if (pathname.startsWith('/api/auth/')) {
    return RATE_LIMIT_CONFIGS.auth;
  }
  // General limits for other API routes
  return RATE_LIMIT_CONFIGS.general;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to API routes
  if (shouldRateLimit(pathname)) {
    const ip = getClientIp(request);
    const config = getRateLimitConfig(pathname);
    const rateLimitResult = checkRateLimit(ip, config);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: new Date(rateLimitResult.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
            'X-RateLimit-Limit': config.maxRequests?.toString() || '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }
  }

  // Continue to the application
  const response = NextResponse.next();

  // Apply security headers to all responses
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Configure which routes the middleware should run on
 * Exclude static files and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
