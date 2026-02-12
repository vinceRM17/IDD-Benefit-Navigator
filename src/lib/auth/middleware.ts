import { NextResponse } from 'next/server';
import { getCurrentUser } from './session';

/**
 * Higher-order function that protects API routes requiring authentication.
 * Returns 401 if no valid session exists, otherwise calls handler with user info.
 */
export function requireAuth(
  handler: (user: { userId: number; email: string }, request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(user, request);
  };
}
