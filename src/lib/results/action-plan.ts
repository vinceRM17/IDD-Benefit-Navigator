import { EligibilityResult } from '@/lib/rules/types';
import { getProgramContent, medicaidContent } from '@/content/programs';
import { EnrichedResult, BenefitInteraction } from './types';
import { rankPrograms } from './ranking';
import type { StateConfig } from '@/lib/rules/types';

/**
 * Map program names from rules engine to programId format
 * @param programName - Program name from rules engine (e.g., "Medicaid")
 * @param stateCode - State code (e.g., "KY")
 * @returns programId (e.g., "ky-medicaid")
 */
export function mapProgramNameToId(programName: string, stateCode: string): string {
  return `${stateCode.toLowerCase()}-${programName.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Enrich eligibility results with program content and ranking
 * @param results - Raw eligibility results from rules engine
 * @param stateCode - State code used for evaluation
 * @param config - Optional state config for priority-based ranking
 * @returns Enriched and ranked results
 */
export function enrichResults(
  results: EligibilityResult[],
  stateCode: string,
  config?: StateConfig
): EnrichedResult[] {
  // Rank programs by confidence and priority
  const ranked = rankPrograms(results, stateCode, config);

  // Enrich with content
  return ranked.map((result, index) => {
    const programId = mapProgramNameToId(result.program, stateCode);
    const content = getProgramContent(programId);

    if (!content) {
      throw new Error(`Program content not found for programId: ${programId}`);
    }

    return {
      ...result,
      programId,
      content,
      rank: index + 1,
      interactionNotes: [],
    };
  });
}

/**
 * Get benefit interactions between eligible programs using config-driven rules
 * @param eligibleProgramIds - Array of program IDs user is eligible for
 * @param hasInsurance - Whether user has private insurance (ELIG-06)
 * @param config - Optional state config with interaction rules
 * @param stateCode - State code for programId resolution
 * @returns Array of benefit interactions
 */
export function getBenefitInteractions(
  eligibleProgramIds: string[],
  hasInsurance: boolean,
  config?: StateConfig,
  stateCode: string = 'KY'
): BenefitInteraction[] {
  // If config has interaction rules, use them
  if (config?.benefitInteractions) {
    const interactions: BenefitInteraction[] = [];

    for (const rule of config.benefitInteractions) {
      // Handle insurance-conditional interactions
      if (rule.requiresInsurance && !hasInsurance) continue;

      // Resolve program names to IDs for matching
      const resolvedProgramIds = rule.programs.map(name => {
        if (name === 'private-insurance') return 'private-insurance';
        return mapProgramNameToId(name, stateCode);
      });

      // Check if all required programs are eligible (or insurance condition met)
      const allPresent = resolvedProgramIds.every(id => {
        if (id === 'private-insurance') return hasInsurance;
        return eligibleProgramIds.includes(id);
      });

      if (allPresent) {
        // For insurance coordination, use medicaid content if available
        let description = rule.description;
        if (rule.requiresInsurance && medicaidContent.insuranceCoordination) {
          description = medicaidContent.insuranceCoordination;
        }

        interactions.push({
          programs: resolvedProgramIds,
          description,
          recommendation: rule.recommendation,
        });
      }
    }

    return interactions;
  }

  // Fallback: no config interactions available
  return [];
}

/**
 * Generate a combined action plan across all eligible programs
 * Uses config-driven action plan order when available
 * @param results - Enriched eligibility results
 * @param config - Optional state config with action plan rules
 * @param stateCode - State code for programId resolution
 * @returns Ordered action steps
 */
export function generateActionPlan(
  results: EnrichedResult[],
  config?: StateConfig,
  stateCode: string = 'KY'
): string[] {
  const eligibleProgramIds = results
    .filter((r) => r.confidence === 'likely' || r.confidence === 'possible')
    .map((r) => r.programId);

  // If config has action plan rules, use them
  if (config?.actionPlanOrder) {
    const steps: string[] = [];
    const processedWaivers: string[] = [];

    for (const rule of config.actionPlanOrder) {
      const programId = mapProgramNameToId(rule.programName, stateCode);

      if (!eligibleProgramIds.includes(programId)) continue;

      // Skip waiver programs that are handled as a group
      if (rule.step === '_waiver') {
        processedWaivers.push(rule.programName);
        continue;
      }

      // Check for combined step (e.g., SSI + SSDI)
      if (rule.combinedWith) {
        const combinedId = mapProgramNameToId(rule.combinedWith, stateCode);
        if (eligibleProgramIds.includes(combinedId) && rule.combinedStep) {
          steps.push(rule.combinedStep);
          continue;
        }
      }

      // Check for Medicaid-conditional step (e.g., SNAP + Medicaid)
      if (rule.withMedicaidStep) {
        const medicaidId = mapProgramNameToId('Medicaid', stateCode);
        if (eligibleProgramIds.includes(medicaidId)) {
          steps.push(rule.withMedicaidStep);
          continue;
        }
      }

      steps.push(rule.step);
    }

    return steps;
  }

  // Fallback: no config action plan
  return [];
}
