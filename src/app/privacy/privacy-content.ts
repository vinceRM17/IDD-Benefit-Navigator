/**
 * Privacy policy content
 * Structured data for maintainability and potential future translations
 */

export interface PolicySection {
  id: string;
  title: string;
  content: string;
}

export const privacyPolicy: PolicySection[] = [
  {
    id: 'what-we-collect',
    title: 'What We Collect',
    content:
      'During the benefits screening process, we ask about your household size, income, diagnosis information, insurance status, and state of residence. This information helps us determine which benefit programs may be available to your family.\n\nWe do NOT collect names, Social Security numbers, or addresses unless you choose to create an account. You can complete the entire screening process anonymously.',
  },
  {
    id: 'how-we-use-data',
    title: 'How We Use Your Data',
    content:
      'Your information is used solely to determine which benefits programs may apply to your family. We match your situation against eligibility criteria for various federal, state, and local programs.\n\nWe do not sell, share, or use your data for advertising purposes. Your screening information is never shared with third parties without your explicit consent.',
  },
  {
    id: 'anonymous-screening',
    title: 'Anonymous Screening',
    content:
      'If you use the benefits screener without creating an account, your data exists only during your active session. When you close your browser or your session expires (after 10 minutes of inactivity), all screening data is permanently deleted from our servers.\n\nThis means your answers, eligibility results, and any other information you provided are completely removed. We cannot recover this information once your session ends.',
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content:
      'We take the security of your information seriously. All data is protected using industry-standard encryption:\n\n• Data in transit: All communications use HTTPS encryption (TLS 1.3)\n• Data at rest: Sensitive information is encrypted using AES-256 encryption\n• Sessions: Session data is stored server-side (not in your browser) and encrypted\n\nWe follow HIPAA-adjacent security standards to protect health-related information, even though we are not a covered entity under HIPAA.',
  },
  {
    id: 'account-data',
    title: 'If You Create an Account',
    content:
      'Account holders benefit from saved screening results and personalized benefit recommendations. If you create an account:\n\n• Your data is encrypted and stored securely\n• Your password is hashed using bcrypt (one-way encryption - we cannot see your password)\n• Session timeout extends to 15 minutes of inactivity\n• You can view your saved screenings and track application progress\n\nYou have the right to delete your account and all associated data at any time. Account deletion is permanent and cannot be undone.',
  },
  {
    id: 'audit-logging',
    title: 'Audit Logging',
    content:
      'For security and compliance purposes, we log access events such as:\n\n• Who accessed what information (user ID or "anonymous")\n• When the access occurred\n• IP address of the request\n• Success or failure of the action\n\nThese audit logs do NOT contain your screening answers or eligibility results - only metadata about system access. Logs are retained for 90 days for security analysis and then permanently deleted.',
  },
  {
    id: 'referrals',
    title: 'Referrals',
    content:
      'When you submit a referral, we share your name, email, phone number (if provided), and a summary of programs you may be eligible for with the selected partner organization(s).\n\nWe do not share raw income figures, diagnosis details, or other sensitive screening data with partner organizations. The referral includes only high-level eligibility information to help partners understand how they can assist you.\n\nEach partner organization has their own privacy practices. We recommend reviewing their policies directly before submitting a referral.\n\nReferral emails are sent via Postmark, our email service provider. We track whether the partner organization has opened the email to provide you with status updates (shown as "Sent" or "Viewed" in your dashboard).\n\nFor authenticated users, referral history is stored in your account and deleted when you delete your account. For anonymous users, referral records are stored temporarily and are not linked to any persistent account.',
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content:
      'You have the right to:\n\n• Know what data we hold about you\n• Request a copy of your data\n• Correct inaccurate information\n• Delete your account and all associated data\n• Opt out of data collection by using the anonymous screening option\n• Withdraw consent for data processing at any time\n\nTo exercise any of these rights, please contact us using the information below.',
  },
  {
    id: 'contact',
    title: 'Questions About Privacy',
    content:
      'If you have questions or concerns about how we handle your data, please contact us:\n\nEmail: privacy@benefits-navigator.example.com\n\nWe will respond to privacy inquiries within 2 business days.',
  },
];

export const lastUpdated = '2026-02-12';
