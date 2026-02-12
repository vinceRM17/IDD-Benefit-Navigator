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

interface ReferralEmailProps {
  partnerName: string;
  familyName: string;
  familyEmail: string;
  familyPhone?: string;
  eligiblePrograms: string[];
  familyNote?: string;
}

export function ReferralEmail({
  partnerName,
  familyName,
  familyEmail,
  familyPhone,
  eligiblePrograms,
  familyNote,
}: ReferralEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New referral from IDD Benefits Navigator - ${familyName}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>New Referral</Heading>

          <Text style={paragraph}>Hello {partnerName} team,</Text>

          <Text style={paragraph}>
            A family has requested a referral to your organization through the
            IDD Benefits Navigator. They are looking for help accessing benefits
            and services for a person with an intellectual or developmental
            disability.
          </Text>

          <Text style={paragraph}>
            <strong>Eligible programs:</strong>
          </Text>
          <ul style={list}>
            {eligiblePrograms.map((program, index) => (
              <li key={index} style={listItem}>
                {program}
              </li>
            ))}
          </ul>

          <Hr style={divider} />

          <Text style={sectionHeading}>Family Contact Information</Text>

          <Text style={paragraph}>
            <strong>Name:</strong> {familyName}
          </Text>

          <Text style={paragraph}>
            <strong>Email:</strong> {familyEmail}
          </Text>

          {familyPhone && (
            <Text style={paragraph}>
              <strong>Phone:</strong> {familyPhone}
            </Text>
          )}

          {familyNote && (
            <>
              <Hr style={divider} />

              <Text style={sectionHeading}>Message from Family</Text>

              <Text style={paragraph}>{familyNote}</Text>
            </>
          )}

          <Hr style={divider} />

          <Text style={footer}>
            This referral was sent from the IDD Benefits Navigator. The family
            has consented to share their contact information with your
            organization. Please contact them directly to offer assistance.
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

const sectionHeading = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#111827',
  marginBottom: '12px',
  marginTop: '4px',
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

export default ReferralEmail;
