/**
 * Recertification cycle data for benefit programs
 * Used to estimate when users need to renew their benefits
 * State-aware: looks up state-specific cycles, falls back to defaults
 */

import { getProgramContent } from './index';

/** Default recertification cycles (months) by program base name */
const defaultRecertCycles: Record<string, number> = {
  medicaid: 12,
  snap: 12,
  ssi: 12,
  ssdi: 12,
};

/** State-specific overrides (stateCode -> programBaseName -> months) */
const stateRecertCycles: Record<string, Record<string, number>> = {
  KY: {
    medicaid: 12,
    snap: 12,
    ssi: 12,
    ssdi: 12,
    'michelle-p-waiver': 12,
    'hcb-waiver': 12,
    'scl-waiver': 12,
  },
};

/**
 * Extract the program base name from a programId
 * e.g., "ky-medicaid" → "medicaid", "federal-ssi" → "ssi"
 */
function getBaseName(programId: string): string {
  const parts = programId.split('-');
  return parts.slice(1).join('-');
}

/**
 * Get recertification cycle in months for a program
 */
export function getRecertCycleMonths(programId: string): number {
  const parts = programId.split('-');
  const stateCode = parts[0]?.toUpperCase();
  const baseName = getBaseName(programId);

  // Check state-specific first
  const stateCycles = stateRecertCycles[stateCode];
  if (stateCycles && stateCycles[baseName] !== undefined) {
    return stateCycles[baseName];
  }

  // Fall back to defaults
  return defaultRecertCycles[baseName] ?? 12;
}

/** Legacy export for backward compatibility */
export const programRecertCycles: Record<string, number> = {
  'ky-medicaid': 12,
  'ky-snap': 12,
  'ky-ssi': 12,
  'ky-ssdi': 12,
  'ky-michelle-p-waiver': 12,
  'ky-hcb-waiver': 12,
  'ky-scl-waiver': 12,
};

/**
 * Get estimated recertification date from enrollment/screening date
 */
export function getEstimatedRecertDate(programId: string, enrollmentDate: Date): Date {
  const months = getRecertCycleMonths(programId);
  const date = new Date(enrollmentDate);
  date.setMonth(date.getMonth() + months);
  return date;
}

/**
 * Get human-friendly program name using content registry
 */
export function getProgramDisplayName(programId: string): string {
  const content = getProgramContent(programId);
  return content?.name ?? programId;
}
