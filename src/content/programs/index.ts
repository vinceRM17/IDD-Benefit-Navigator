/**
 * Central export for all program content
 * Provides lookup by programId with state-specific → federal fallback
 */

import { ProgramContent } from './types';
import { medicaidContent } from './medicaid';
import { snapContent } from './snap';
import { ssiContent } from './ssi';
import { ssdiContent } from './ssdi';
import { michellePWaiverContent } from './michelle-p-waiver';
import { hcbWaiverContent } from './hcb-waiver';
import { sclWaiverContent } from './scl-waiver';
import { federalSSIContent } from './federal-ssi';
import { federalSSDIContent } from './federal-ssdi';
import { federalSNAPContent } from './federal-snap';

// Re-export individual content
export { medicaidContent } from './medicaid';
export { snapContent } from './snap';
export { ssiContent } from './ssi';
export { ssdiContent } from './ssdi';
export { michellePWaiverContent } from './michelle-p-waiver';
export { hcbWaiverContent } from './hcb-waiver';
export { sclWaiverContent } from './scl-waiver';
export { federalSSIContent } from './federal-ssi';
export { federalSSDIContent } from './federal-ssdi';
export { federalSNAPContent } from './federal-snap';
export type { ProgramContent } from './types';

/**
 * Map of all program content keyed by programId
 */
export const programContentMap: Record<string, ProgramContent> = {
  // Kentucky state-specific content
  'ky-medicaid': medicaidContent,
  'ky-snap': snapContent,
  'ky-ssi': ssiContent,
  'ky-ssdi': ssdiContent,
  'ky-michelle-p-waiver': michellePWaiverContent,
  'ky-hcb-waiver': hcbWaiverContent,
  'ky-scl-waiver': sclWaiverContent,
  // Federal content
  'federal-ssi': federalSSIContent,
  'federal-ssdi': federalSSDIContent,
  'federal-snap': federalSNAPContent,
};

/**
 * Get program content by programId
 * Tries state-specific first (e.g., "oh-ssi"), then falls back to federal (e.g., "federal-ssi")
 * @param programId - The unique program identifier (e.g., "ky-medicaid", "oh-ssi")
 * @returns Program content or undefined if not found
 */
export function getProgramContent(programId: string): ProgramContent | undefined {
  // Direct lookup first
  const direct = programContentMap[programId];
  if (direct) return direct;

  // Fall back to federal content: extract program name from ID
  // e.g., "oh-ssi" → try "federal-ssi"
  const parts = programId.split('-');
  if (parts.length >= 2) {
    const programPart = parts.slice(1).join('-'); // "ssi", "snap", "ssdi"
    const federalId = `federal-${programPart}`;
    const federal = programContentMap[federalId];
    if (federal) {
      // Return federal content but with the state-specific programId
      return { ...federal, programId };
    }
  }

  return undefined;
}
