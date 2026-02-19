import { EligibilityResult } from '@/lib/rules/types';
import type { StateConfig } from '@/lib/rules/types';

/** Default priority for programs not in the config */
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
 * Build a priority map from state config enrichment data
 */
function buildPriorityMap(config?: StateConfig): Record<string, number> {
  if (!config) return {};
  const map: Record<string, number> = {};
  for (const program of config.programs) {
    if (program.enrichment?.priority) {
      map[program.programId] = program.enrichment.priority;
    }
  }
  return map;
}

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
 * @param config - Optional state config for priority lookup
 * @returns Sorted array with rank field added (1-indexed)
 */
export function rankPrograms(
  results: EligibilityResult[],
  stateCode: string = 'KY',
  config?: StateConfig
): EligibilityResult[] {
  const priorityMap = buildPriorityMap(config);

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
    const priorityA = priorityMap[programIdA] || DEFAULT_PRIORITY;
    const priorityB = priorityMap[programIdB] || DEFAULT_PRIORITY;

    return priorityA - priorityB;
  });

  return sorted;
}
