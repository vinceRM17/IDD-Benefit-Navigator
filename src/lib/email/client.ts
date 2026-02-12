import { ServerClient } from 'postmark';
import { render } from '@react-email/components';
import { ReminderEmail } from './templates/reminder-email';
import { ReferralEmail } from './templates/referral-email';
import { ReferralConfirmationEmail } from './templates/referral-confirmation-email';

let _client: ServerClient | null = null;

function getClient(): ServerClient | null {
  if (!process.env.POSTMARK_SERVER_TOKEN) {
    console.warn('POSTMARK_SERVER_TOKEN not set — email sending disabled');
    return null;
  }
  if (!_client) {
    _client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);
  }
  return _client;
}

interface SendReminderParams {
  to: string;
  programName: string;
  recertDate: Date;
  daysUntil: number;
  actionUrl: string;
}

/**
 * Send a recertification reminder email via Postmark
 * Returns true on success, false on failure (never throws)
 */
export async function sendReminderEmail(params: SendReminderParams): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const fromEmail = process.env.POSTMARK_FROM_EMAIL;
  if (!fromEmail) {
    console.warn('POSTMARK_FROM_EMAIL not set — email sending disabled');
    return false;
  }

  try {
    const html = await render(
      ReminderEmail({
        programName: params.programName,
        recertDate: params.recertDate,
        daysUntil: params.daysUntil,
        actionUrl: params.actionUrl,
        settingsUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings`,
      })
    );

    await client.sendEmail({
      From: fromEmail,
      To: params.to,
      Subject: `Your ${params.programName} recertification is coming up in ${params.daysUntil} days`,
      HtmlBody: html,
      MessageStream: 'outbound',
    });

    return true;
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return false;
  }
}

interface SendReferralEmailParams {
  to: string;
  partnerName: string;
  familyName: string;
  familyEmail: string;
  familyPhone?: string;
  eligiblePrograms: string[];
  familyNote?: string;
  referralId: number;
}

/**
 * Send a referral email to a partner organization via Postmark
 * Returns true on success, false on failure (never throws)
 */
export async function sendReferralEmail(params: SendReferralEmailParams): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const fromEmail = process.env.POSTMARK_FROM_EMAIL;
  if (!fromEmail) {
    console.warn('POSTMARK_FROM_EMAIL not set — email sending disabled');
    return false;
  }

  try {
    const html = await render(
      ReferralEmail({
        partnerName: params.partnerName,
        familyName: params.familyName,
        familyEmail: params.familyEmail,
        familyPhone: params.familyPhone,
        eligiblePrograms: params.eligiblePrograms,
        familyNote: params.familyNote,
      })
    );

    await client.sendEmail({
      From: fromEmail,
      To: params.to,
      Subject: 'New referral from IDD Benefits Navigator',
      HtmlBody: html,
      MessageStream: 'outbound',
      TrackOpens: true, // Enable open tracking for webhook
      Metadata: {
        referralId: String(params.referralId),
        type: 'referral',
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to send referral email:', error);
    return false;
  }
}

interface SendReferralConfirmationParams {
  to: string;
  familyName: string;
  partnerNames: string[];
}

/**
 * Send a referral confirmation email to family via Postmark
 * Returns true on success, false on failure (never throws)
 */
export async function sendReferralConfirmation(params: SendReferralConfirmationParams): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const fromEmail = process.env.POSTMARK_FROM_EMAIL;
  if (!fromEmail) {
    console.warn('POSTMARK_FROM_EMAIL not set — email sending disabled');
    return false;
  }

  try {
    const html = await render(
      ReferralConfirmationEmail({
        familyName: params.familyName,
        partnerNames: params.partnerNames,
      })
    );

    await client.sendEmail({
      From: fromEmail,
      To: params.to,
      Subject: 'Your referral has been sent - IDD Benefits Navigator',
      HtmlBody: html,
      MessageStream: 'outbound',
      TrackOpens: false, // No need to track family opens
    });

    return true;
  } catch (error) {
    console.error('Failed to send referral confirmation email:', error);
    return false;
  }
}
