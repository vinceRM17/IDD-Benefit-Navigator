/**
 * Recertification cycle data for Kentucky benefit programs
 * Used to estimate when users need to renew their benefits
 */

/** Months between recertification for each program */
export const programRecertCycles: Record<string, number> = {
  'ky-medicaid': 12,
  'ky-snap': 12,
  'ky-ssi': 12,
  'ky-ssdi': 12,
  'ky-michelle-p-waiver': 12,
  'ky-hcb-waiver': 12,
  'ky-scl-waiver': 12,
};

/** Friendly display names for program IDs */
const programNames: Record<string, string> = {
  'ky-medicaid': 'Kentucky Medicaid',
  'ky-snap': 'SNAP (Food Assistance)',
  'ky-ssi': 'Supplemental Security Income (SSI)',
  'ky-ssdi': 'Social Security Disability Insurance (SSDI)',
  'ky-michelle-p-waiver': 'Michelle P. Waiver',
  'ky-hcb-waiver': 'Home and Community Based (HCB) Waiver',
  'ky-scl-waiver': 'Supports for Community Living (SCL) Waiver',
};

/**
 * Get estimated recertification date from enrollment/screening date
 */
export function getEstimatedRecertDate(programId: string, enrollmentDate: Date): Date {
  const months = programRecertCycles[programId] ?? 12;
  const date = new Date(enrollmentDate);
  date.setMonth(date.getMonth() + months);
  return date;
}

/**
 * Get human-friendly program name
 */
export function getProgramDisplayName(programId: string): string {
  return programNames[programId] ?? programId;
}
