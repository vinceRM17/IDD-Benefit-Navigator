import { NextRequest, NextResponse } from 'next/server';
import { markReferralViewed } from '@/lib/db/queries';

/**
 * Postmark open tracking webhook
 *
 * Receives webhook notifications when partner organizations open referral emails.
 * Updates referral status from 'sent' to 'viewed' for engagement tracking.
 *
 * IMPORTANT: This endpoint is called by Postmark (third-party), NOT authenticated.
 * Always returns 200 to prevent Postmark retries on errors.
 *
 * No webhook signature verification for v1 (per research - low risk, add if abuse occurs).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is an Open event
    if (body.RecordType !== 'Open') {
      return NextResponse.json(
        { message: 'Not an open event' },
        { status: 200 }
      );
    }

    // Extract referralId from metadata
    const referralId = body.Metadata?.referralId;
    if (!referralId) {
      console.warn('Postmark webhook received without referralId in metadata');
      return NextResponse.json(
        { message: 'No referralId in metadata' },
        { status: 200 }
      );
    }

    // Verify this is a referral email (not other email types)
    if (body.Metadata?.type !== 'referral') {
      return NextResponse.json(
        { message: 'Not a referral email' },
        { status: 200 }
      );
    }

    // Parse ReceivedAt timestamp
    const viewedAt = new Date(body.ReceivedAt);

    // Update referral status
    await markReferralViewed(parseInt(referralId, 10), viewedAt);

    return NextResponse.json(
      { message: 'Webhook processed' },
      { status: 200 }
    );
  } catch (error) {
    // Log error but still return 200 to prevent Postmark retries
    console.error('Error processing Postmark webhook:', error);
    return NextResponse.json(
      { message: 'Error processing webhook' },
      { status: 200 }
    );
  }
}
