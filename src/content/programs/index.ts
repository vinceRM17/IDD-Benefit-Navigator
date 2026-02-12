/**
 * Central export for all program content
 * Provides lookup by programId
 */

import { ProgramContent } from './types';
import { medicaidContent } from './medicaid';
import { snapContent } from './snap';
import { ssiContent } from './ssi';
import { ssdiContent } from './ssdi';
import { michellePWaiverContent } from './michelle-p-waiver';
import { hcbWaiverContent } from './hcb-waiver';
import { sclWaiverContent } from './scl-waiver';

// Re-export individual content
export { medicaidContent } from './medicaid';
export { snapContent } from './snap';
export { ssiContent } from './ssi';
export { ssdiContent } from './ssdi';
export { michellePWaiverContent } from './michelle-p-waiver';
export { hcbWaiverContent } from './hcb-waiver';
export { sclWaiverContent } from './scl-waiver';
export type { ProgramContent } from './types';

/**
 * Map of all program content keyed by programId
 */
export const programContentMap: Record<string, ProgramContent> = {
  'ky-medicaid': medicaidContent,
  'ky-snap': snapContent,
  'ky-ssi': ssiContent,
  'ky-ssdi': ssdiContent,
  'ky-michelle-p-waiver': michellePWaiverContent,
  'ky-hcb-waiver': hcbWaiverContent,
  'ky-scl-waiver': sclWaiverContent,
};

/**
 * Get program content by programId
 * @param programId - The unique program identifier (e.g., "ky-medicaid")
 * @returns Program content or undefined if not found
 */
export function getProgramContent(programId: string): ProgramContent | undefined {
  return programContentMap[programId];
}
