import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { saveScreening } from '@/lib/db/queries';

const AUTH_COOKIE = 'idd_auth_session';
const AUTH_TTL = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Create an authenticated JWT session token
 */
export async function createAuthSession(userId: number, email: string): Promise<string> {
  return new SignJWT({ userId, email, type: 'authenticated' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(getSecret());
}

/**
 * Verify a JWT session token and extract payload
 * Returns null on any error (expired, invalid, etc.) — never throws
 */
export async function verifySession(token: string): Promise<{ userId: number; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as number,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

/**
 * Set the authenticated session cookie (httpOnly, secure in production)
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_TTL,
  });
}

/**
 * Clear the authenticated session cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

/**
 * Migrate anonymous screening data to a new account on signup.
 * Auto-attaches screening data — UI shows confirmation of what was saved.
 */
export async function migrateSessionOnSignup(
  userId: number,
  screeningData: unknown,
  screeningResults: unknown
): Promise<void> {
  if (screeningData && screeningResults) {
    await saveScreening(userId, screeningData, screeningResults);
  }
}

/**
 * Get the current authenticated user from the session cookie
 * Returns null if no valid session exists
 */
export async function getCurrentUser(): Promise<{ userId: number; email: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE);

  if (!cookie?.value) {
    return null;
  }

  return verifySession(cookie.value);
}
