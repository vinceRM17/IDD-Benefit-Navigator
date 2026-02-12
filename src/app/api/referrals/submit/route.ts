import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createReferral } from '@/lib/db/queries';
import { sendReferralEmail, sendReferralConfirmation } from '@/lib/email/client';
import { partnerOrganizations } from '@/content/resources/partners';
import type { ReferralResult } from '@/lib/referrals/types';

// Zod schema for request validation
const referralSubmissionSchema = z.object({
  familyName: z.string().min(1, 'Name is required'),
  familyEmail: z.string().email('Valid email is required'),
  familyPhone: z.string().optional(),
  familyNote: z.string().optional(),
  selectedPartners: z.array(z.string()).min(1, 'At least one partner must be selected'),
  eligiblePrograms: z.array(z.string()).min(1, 'At least one eligible program is required'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Consent must be given',
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = referralSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check authentication (optional - null for anonymous users)
    const user = await getCurrentUser();
    const userId = user?.userId || null;

    // Process each selected partner
    const results: ReferralResult[] = [];
    const emailPromises: Promise<boolean>[] = [];

    for (const partnerId of data.selectedPartners) {
      // Look up partner organization
      const partner = partnerOrganizations.find((p) => p.id === partnerId);

      // Skip if partner not found or has no email
      if (!partner || !partner.email) {
        continue;
      }

      // Create referral record in database
      const referral = await createReferral({
        userId,
        partnerOrgId: partner.id,
        partnerEmail: partner.email,
        familyName: data.familyName,
        familyEmail: data.familyEmail,
        familyPhone: data.familyPhone || null,
        eligiblePrograms: data.eligiblePrograms,
        familyNote: data.familyNote || null,
        status: 'sent',
      });

      // Queue email send (fire-and-forget)
      emailPromises.push(
        sendReferralEmail({
          to: partner.email,
          partnerName: partner.name,
          familyName: data.familyName,
          familyEmail: data.familyEmail,
          familyPhone: data.familyPhone,
          eligiblePrograms: data.eligiblePrograms,
          familyNote: data.familyNote,
          referralId: referral.id,
        })
      );

      results.push({
        partnerId: partner.id,
        partnerName: partner.name,
        sent: true,
        referralId: referral.id,
      });
    }

    // Wait for all emails to complete (fire-and-forget pattern)
    await Promise.allSettled(emailPromises);

    // Send confirmation email to family
    const partnerNames = results.map((r) => r.partnerName);
    await sendReferralConfirmation({
      to: data.familyEmail,
      familyName: data.familyName,
      partnerNames,
    });

    // Return success with results
    return NextResponse.json(
      { results },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing referral submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your referral' },
      { status: 500 }
    );
  }
}
