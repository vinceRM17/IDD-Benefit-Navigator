import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import React from 'react';

interface ReminderEmailProps {
  programName: string;
  recertDate: Date;
  daysUntil: number;
  actionUrl: string;
  settingsUrl: string;
}

export function ReminderEmail({
  programName,
  recertDate,
  daysUntil,
  actionUrl,
  settingsUrl,
}: ReminderEmailProps) {
  const formattedDate = recertDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>
        {`Your ${programName} recertification is coming up in ${daysUntil} days`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Recertification Reminder</Heading>

          <Text style={paragraph}>
            Hi there — this is a friendly reminder that your <strong>{programName}</strong>{' '}
            recertification is coming up on <strong>{formattedDate}</strong>{' '}
            ({daysUntil} days from now).
          </Text>

          <Text style={paragraph}>
            To make sure your benefits continue without interruption, here are
            your next steps:
          </Text>

          <Text style={listItem}>
            1. <strong>Gather your documents</strong> — income proof, ID, and
            any medical records related to your benefits.
          </Text>

          <Text style={listItem}>
            2. <strong>Contact your case worker or program office</strong> — they
            can walk you through what's needed for your specific situation.
          </Text>

          <Text style={listItem}>
            3. <strong>Submit your recertification before {formattedDate}</strong>{' '}
            — applying early gives you time to fix any issues.
          </Text>

          <Link href={actionUrl} style={button}>
            View your action plan
          </Link>

          <Hr style={divider} />

          <Text style={footer}>
            You're receiving this because you opted in to recertification
            reminders.{' '}
            <Link href={settingsUrl} style={footerLink}>
              Update your preferences
            </Link>
          </Text>

          <Text style={footer}>
            IDD Benefits Navigator — Helping families navigate benefit access
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  maxWidth: '580px',
  margin: '0 auto',
  padding: '32px 24px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#111827',
  marginBottom: '16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '16px',
};

const listItem = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '12px',
  paddingLeft: '8px',
};

const button = {
  display: 'inline-block',
  backgroundColor: '#1d4ed8',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  marginTop: '8px',
  marginBottom: '24px',
};

const divider = {
  borderColor: '#e5e7eb',
  marginTop: '24px',
  marginBottom: '16px',
};

const footer = {
  fontSize: '13px',
  color: '#6b7280',
  lineHeight: '1.5',
  marginBottom: '8px',
};

const footerLink = {
  color: '#2563eb',
  textDecoration: 'underline',
};

export default ReminderEmail;
