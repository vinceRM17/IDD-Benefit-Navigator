import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPassword } from '@/lib/auth/password';
import { createAuthSession, setAuthCookie } from '@/lib/auth/session';
import { getUserByEmail } from '@/lib/db/queries';
import { withAuditLog } from '@/lib/audit/middleware';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function loginHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Get user (excludes soft-deleted)
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create NEW JWT — session ID regeneration per OWASP (new token = new session)
    const token = await createAuthSession(user.id, user.email);
    await setAuthCookie(token);

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export const POST = withAuditLog(loginHandler);
