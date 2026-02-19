import { EligibilityResult } from '@/lib/rules/types';
import { getProgramContent, medicaidContent } from '@/content/programs';
import { EnrichedResult, BenefitInteraction } from './types';
import { rankPrograms } from './ranking';
import type { StateConfig } from '@/lib/rules/types';

/**
 * Load translated results messages for a given locale
 */
function loadResultsMessages(locale: string): Record<string, unknown> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`@/messages/${locale}/results.json`);
  } catch {
    return null;
  }
}

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
 * Map program pair to interaction translation key
 */
function getInteractionKey(programs: string[]): string {
  const names = programs.map(p => {
    if (p === 'private-insurance') return 'insurance';
    // Extract program name from ID (e.g., "ky-medicaid" → "medicaid")
    const parts = p.split('-');
    return parts.slice(1).join('');
  });

  // Normalize to known keys
  const sorted = names.sort().join('');
  const keyMap: Record<string, string> = {
    'insurancemedicaid': 'insuranceMedicaid',
    'medicaidssi': 'medicaidSsi',
    'medicaidssdi': 'medicaidSsdi',
    'medicaidmichelle-p-waiver': 'medicaidMichelleP',
    'medicaidhcb-waiver': 'medicaidHcb',
    'medicaidscl-waiver': 'medicaidScl',
    'ssdiSSI': 'ssiSsdi',
    'medicaidsnap': 'medicaidSnap',
    'snapSSI': 'ssiSnap',
  };

  // Try various key formats
  const programParts = programs.map(p => {
    if (p === 'private-insurance') return 'insurance';
    const parts = p.split('-');
    return parts.slice(1).join('-');
  });

  // Direct mapping based on program names
  if (programParts.includes('insurance') && programParts.some(p => p.includes('medicaid'))) return 'insuranceMedicaid';
  if (programParts.some(p => p.includes('medicaid')) && programParts.some(p => p === 'ssi')) return 'medicaidSsi';
  if (programParts.some(p => p.includes('medicaid')) && programParts.some(p => p === 'ssdi')) return 'medicaidSsdi';
  if (programParts.some(p => p.includes('medicaid')) && programParts.some(p => p.includes('michelle'))) return 'medicaidMichelleP';
  if (programParts.some(p => p.includes('medicaid')) && programParts.some(p => p.includes('hcb'))) return 'medicaidHcb';
  if (programParts.some(p => p.includes('medicaid')) && programParts.some(p => p.includes('scl'))) return 'medicaidScl';
  if (programParts.some(p => p === 'ssi') && programParts.some(p => p === 'ssdi')) return 'ssiSsdi';
  if (programParts.some(p => p.includes('medicaid')) && programParts.some(p => p === 'snap')) return 'medicaidSnap';
  if (programParts.some(p => p === 'ssi') && programParts.some(p => p === 'snap')) return 'ssiSnap';

  return sorted;
}

/**
 * Get benefit interactions between eligible programs using config-driven rules
 * @param eligibleProgramIds - Array of program IDs user is eligible for
 * @param hasInsurance - Whether user has private insurance (ELIG-06)
 * @param config - Optional state config with interaction rules
 * @param stateCode - State code for programId resolution
 * @param locale - Locale for translated content
 * @returns Array of benefit interactions
 */
export function getBenefitInteractions(
  eligibleProgramIds: string[],
  hasInsurance: boolean,
  config?: StateConfig,
  stateCode: string = 'KY',
  locale: string = 'en'
): BenefitInteraction[] {
  const messages = locale !== 'en' ? loadResultsMessages(locale) : null;
  const interactionMessages = messages?.interactionDescriptions as Record<string, { description: string; recommendation: string }> | undefined;

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
        let recommendation = rule.recommendation;

        // Try to use translated content
        if (interactionMessages) {
          const key = getInteractionKey(resolvedProgramIds);
          const translated = interactionMessages[key];
          if (translated) {
            description = translated.description;
            recommendation = translated.recommendation;
          }
        }

        interactions.push({
          programs: resolvedProgramIds,
          description,
          recommendation,
        });
      }
    }

    return interactions;
  }

  // Fallback: no config interactions available
  return [];
}

/**
 * Map a program name to its action plan translation key
 */
function getActionPlanKey(programName: string, variant?: string): string {
  const nameMap: Record<string, string> = {
    'Medicaid': 'medicaid',
    'SSI': 'ssi',
    'SSDI': 'ssdi',
    'SNAP': 'snap',
    'Michelle P Waiver': 'waivers',
    'HCB Waiver': 'waivers',
    'SCL Waiver': 'waivers',
  };

  if (variant === 'combined') return 'ssiSsdiCombined';
  if (variant === 'withMedicaid' && programName === 'SNAP') return 'snapWithMedicaid';

  return nameMap[programName] || programName.toLowerCase().replace(/\s+/g, '');
}

/**
 * Generate a combined action plan across all eligible programs
 * Uses config-driven action plan order when available
 * @param results - Enriched eligibility results
 * @param config - Optional state config with action plan rules
 * @param stateCode - State code for programId resolution
 * @param locale - Locale for translated content
 * @returns Ordered action steps
 */
export function generateActionPlan(
  results: EnrichedResult[],
  config?: StateConfig,
  stateCode: string = 'KY',
  locale: string = 'en'
): string[] {
  const eligibleProgramIds = results
    .filter((r) => r.confidence === 'likely' || r.confidence === 'possible')
    .map((r) => r.programId);

  const messages = locale !== 'en' ? loadResultsMessages(locale) : null;
  const stepMessages = messages?.actionPlanSteps as Record<string, string> | undefined;

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
          const key = getActionPlanKey(rule.programName, 'combined');
          steps.push(stepMessages?.[key] || rule.combinedStep);
          continue;
        }
      }

      // Check for Medicaid-conditional step (e.g., SNAP + Medicaid)
      if (rule.withMedicaidStep) {
        const medicaidId = mapProgramNameToId('Medicaid', stateCode);
        if (eligibleProgramIds.includes(medicaidId)) {
          const key = getActionPlanKey(rule.programName, 'withMedicaid');
          steps.push(stepMessages?.[key] || rule.withMedicaidStep);
          continue;
        }
      }

      const key = getActionPlanKey(rule.programName);
      steps.push(stepMessages?.[key] || rule.step);
    }

    return steps;
  }

  // Fallback: no config action plan
  return [];
}
