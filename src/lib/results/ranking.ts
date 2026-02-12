import { EligibilityResult } from '@/lib/rules/types';

/**
 * Program priority map for ranking within same confidence level
 * Lower number = higher priority
 */
const PROGRAM_PRIORITY: Record<string, number> = {
  'ky-medicaid': 1, // Unlocks other programs like waivers
  'ky-michelle-p-waiver': 2, // High value, often unknown to families
  'ky-hcb-waiver': 3,
  'ky-scl-waiver': 4,
  'ky-ssi': 5, // Monthly income + auto Medicaid
  'ky-ssdi': 6, // Work-history based disability income
  'ky-snap': 7, // Food assistance
};

/** Default priority for programs not in the map */
const DEFAULT_PRIORITY = 99;

/**
 * Confidence level order (for sorting)
 */
const CONFIDENCE_ORDER: Record<string, number> = {
  likely: 1,
  possible: 2,
  unlikely: 3,
};

/**
 * Map program name to programId for priority lookup
 */
function getProgramId(programName: string, stateCode: string = 'KY'): string {
  return `${stateCode.toLowerCase()}-${programName.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Rank programs by confidence and priority
 * @param results - Eligibility results to rank
 * @param stateCode - State code (default: 'KY')
 * @returns Sorted array with rank field added (1-indexed)
 */
export function rankPrograms(
  results: EligibilityResult[],
  stateCode: string = 'KY'
): EligibilityResult[] {
  // Sort by confidence first, then by program priority
  const sorted = [...results].sort((a, b) => {
    // Compare confidence levels
    const confidenceA = CONFIDENCE_ORDER[a.confidence] || 99;
    const confidenceB = CONFIDENCE_ORDER[b.confidence] || 99;

    if (confidenceA !== confidenceB) {
      return confidenceA - confidenceB;
    }

    // Within same confidence, compare program priority
    const programIdA = getProgramId(a.program, stateCode);
    const programIdB = getProgramId(b.program, stateCode);
    const priorityA = PROGRAM_PRIORITY[programIdA] || DEFAULT_PRIORITY;
    const priorityB = PROGRAM_PRIORITY[programIdB] || DEFAULT_PRIORITY;

    return priorityA - priorityB;
  });

  return sorted;
}
