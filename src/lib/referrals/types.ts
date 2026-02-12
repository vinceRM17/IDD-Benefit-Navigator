/**
 * Shared types for referral system
 */

/**
 * Data submitted from referral form
 */
export interface ReferralSubmission {
  familyName: string;
  familyEmail: string;
  familyPhone?: string;
  familyNote?: string;
  selectedPartners: string[];
  eligiblePrograms: string[];
  consent: boolean;
}

/**
 * Result of sending a referral to a single partner
 */
export interface ReferralResult {
  partnerId: string;
  partnerName: string;
  sent: boolean;
  referralId: number;
}
