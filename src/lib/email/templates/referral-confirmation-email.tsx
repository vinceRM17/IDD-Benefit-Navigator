import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Hr,
} from '@react-email/components';
import React from 'react';

interface ReferralConfirmationEmailProps {
  familyName: string;
  partnerNames: string[];
}

export function ReferralConfirmationEmail({
  familyName,
  partnerNames,
}: ReferralConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your referral has been sent</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Referral Confirmation</Heading>

          <Text style={paragraph}>Hi {familyName},</Text>

          <Text style={paragraph}>
            Your referral has been sent to the following organization(s):
          </Text>

          <ul style={list}>
            {partnerNames.map((name, index) => (
              <li key={index} style={listItem}>
                {name}
              </li>
            ))}
          </ul>

          <Text style={paragraph}>
            They typically respond within 3-5 business days. If you don't hear
            back, you can contact them directly to follow up.
          </Text>

          <Text style={paragraph}>
            <strong>Note:</strong> If you change your mind, contact the
            organization directly to ask them not to use your information.
          </Text>

          <Hr style={divider} />

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

const list = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '16px',
  paddingLeft: '24px',
};

const listItem = {
  marginBottom: '8px',
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

export default ReferralConfirmationEmail;
