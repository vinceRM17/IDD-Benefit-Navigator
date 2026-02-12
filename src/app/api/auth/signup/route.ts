import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth/password';
import { createAuthSession, setAuthCookie, migrateSessionOnSignup } from '@/lib/auth/session';
import { getUserByEmail, createUser } from '@/lib/db/queries';
import { withAuditLog } from '@/lib/audit/middleware';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  screeningData: z.unknown().optional(),
  screeningResults: z.unknown().optional(),
});

async function signupHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, screeningData, screeningResults } = parsed.data;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash);

    // Migrate anonymous screening data if provided
    let screeningSaved = false;
    if (screeningData && screeningResults) {
      await migrateSessionOnSignup(user.id, screeningData, screeningResults);
      screeningSaved = true;
    }

    // Create new JWT session (session ID regeneration per OWASP)
    const token = await createAuthSession(user.id, user.email);
    await setAuthCookie(token);

    return NextResponse.json(
      { user: { id: user.id, email: user.email }, screeningSaved },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export const POST = withAuditLog(signupHandler);
