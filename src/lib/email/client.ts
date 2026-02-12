import { ServerClient } from 'postmark';
import { render } from '@react-email/components';
import { ReminderEmail } from './templates/reminder-email';

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
