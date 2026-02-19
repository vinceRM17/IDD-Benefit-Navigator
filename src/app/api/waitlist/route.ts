import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { stateWaitlist } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const waitlistSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  stateCode: z.string().min(2).max(2),
});

/**
 * POST /api/waitlist
 * Sign up for state-specific coverage notifications
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, stateCode } = waitlistSchema.parse(body);

    // Check for existing signup
    const existing = await db
      .select()
      .from(stateWaitlist)
      .where(
        and(
          eq(stateWaitlist.email, email),
          eq(stateWaitlist.stateCode, stateCode)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'You are already on the waitlist for this state.' },
        { status: 200 }
      );
    }

    await db.insert(stateWaitlist).values({ email, stateCode });

    return NextResponse.json(
      { message: 'Successfully joined the waitlist.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
