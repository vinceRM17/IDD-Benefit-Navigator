import { EligibilityResult } from '@/lib/rules/types';
import { getProgramContent, medicaidContent } from '@/content/programs';
import { EnrichedResult, BenefitInteraction } from './types';
import { rankPrograms } from './ranking';

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
 * @returns Enriched and ranked results
 */
export function enrichResults(
  results: EligibilityResult[],
  stateCode: string
): EnrichedResult[] {
  // Rank programs by confidence and priority
  const ranked = rankPrograms(results, stateCode);

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
      interactionNotes: [], // Will be populated by caller based on eligible programs
    };
  });
}

/**
 * Get benefit interactions between eligible programs
 * @param eligibleProgramIds - Array of program IDs user is eligible for
 * @param hasInsurance - Whether user has private insurance (ELIG-06)
 * @returns Array of benefit interactions
 */
export function getBenefitInteractions(
  eligibleProgramIds: string[],
  hasInsurance: boolean
): BenefitInteraction[] {
  const interactions: BenefitInteraction[] = [];

  // ELIG-06: Insurance coordination flag
  // If user has private insurance AND qualifies for Medicaid, flag the interaction
  if (hasInsurance && eligibleProgramIds.includes('ky-medicaid')) {
    interactions.push({
      programs: ['private-insurance', 'ky-medicaid'],
      description:
        medicaidContent.insuranceCoordination ||
        'Your private insurance and Medicaid can work together.',
      recommendation:
        'Keep your private insurance. Medicaid will work alongside it to reduce your out-of-pocket costs. Tell both your insurance company and Medicaid that you have dual coverage.',
    });
  }

  // Helper to check if both programs are eligible
  const bothEligible = (prog1: string, prog2: string) =>
    eligibleProgramIds.includes(prog1) && eligibleProgramIds.includes(prog2);

  // Medicaid + SSI
  if (bothEligible('ky-medicaid', 'ky-ssi')) {
    interactions.push({
      programs: ['ky-medicaid', 'ky-ssi'],
      description:
        'Getting SSI in Kentucky usually means you automatically qualify for Medicaid.',
      recommendation:
        'Apply for SSI first — Medicaid may follow automatically without a separate application.',
    });
  }

  // Medicaid + SSDI
  if (bothEligible('ky-medicaid', 'ky-ssdi')) {
    interactions.push({
      programs: ['ky-medicaid', 'ky-ssdi'],
      description:
        'After receiving SSDI for 24 months, you automatically qualify for Medicare. If you also qualify for Medicaid, you can have both.',
      recommendation:
        'Apply for both Medicaid and SSDI. After 2 years on SSDI, Medicare will be added automatically.',
    });
  }

  // Medicaid + Michelle P Waiver
  if (bothEligible('ky-medicaid', 'ky-michelle-p-waiver')) {
    interactions.push({
      programs: ['ky-medicaid', 'ky-michelle-p-waiver'],
      description:
        'You need Medicaid to use the Michelle P Waiver. The waiver adds extra services on top of what Medicaid covers.',
      recommendation:
        'Apply for Medicaid first, then apply for the Michelle P Waiver. Get on the waitlist as early as possible.',
    });
  }

  // Medicaid + HCB Waiver
  if (bothEligible('ky-medicaid', 'ky-hcb-waiver')) {
    interactions.push({
      programs: ['ky-medicaid', 'ky-hcb-waiver'],
      description:
        'You need Medicaid to use the HCB Waiver. The waiver provides services in your home and community.',
      recommendation:
        'Apply for Medicaid first, then get on the HCB Waiver waitlist. The wait can be long, so apply early.',
    });
  }

  // Medicaid + SCL Waiver
  if (bothEligible('ky-medicaid', 'ky-scl-waiver')) {
    interactions.push({
      programs: ['ky-medicaid', 'ky-scl-waiver'],
      description:
        'You need Medicaid to use the SCL Waiver. SCL provides comprehensive community living supports.',
      recommendation:
        'Apply for Medicaid first, then get on the SCL Waiver waitlist. You can be on multiple waiver waitlists.',
    });
  }

  // SSI + SSDI
  if (bothEligible('ky-ssi', 'ky-ssdi')) {
    interactions.push({
      programs: ['ky-ssi', 'ky-ssdi'],
      description:
        'SSI and SSDI are different programs. You may qualify for one or both depending on work history and income.',
      recommendation: 'Apply for both programs. They serve different purposes and can stack.',
    });
  }

  // Medicaid + SNAP
  if (bothEligible('ky-medicaid', 'ky-snap')) {
    interactions.push({
      programs: ['ky-medicaid', 'ky-snap'],
      description:
        'You can apply for both Medicaid and SNAP at the same time through kynect.',
      recommendation:
        'One application at kynect.ky.gov can start both programs. This saves time.',
    });
  }

  // SSI + SNAP
  if (bothEligible('ky-ssi', 'ky-snap')) {
    interactions.push({
      programs: ['ky-ssi', 'ky-snap'],
      description: 'SSI income counts toward SNAP eligibility. You may still qualify for SNAP.',
      recommendation:
        'Apply for SNAP even if you receive SSI. Your SSI income will be counted, but you may still qualify.',
    });
  }

  return interactions;
}

/**
 * Generate a combined action plan across all eligible programs
 * @param results - Enriched eligibility results
 * @returns Ordered action steps
 */
export function generateActionPlan(results: EnrichedResult[]): string[] {
  const steps: string[] = [];
  const eligibleProgramIds = results
    .filter((r) => r.confidence === 'likely' || r.confidence === 'possible')
    .map((r) => r.programId);

  // Step 1: Apply for Medicaid first (if eligible — it unlocks waiver programs)
  if (eligibleProgramIds.includes('ky-medicaid')) {
    steps.push(
      'Apply for Medicaid first. Many other programs require Medicaid, and it unlocks waiver services.'
    );
  }

  // Step 2: Apply for SSI/SSDI (if eligible — SSI may auto-qualify for Medicaid)
  const ssiEligible = eligibleProgramIds.includes('ky-ssi');
  const ssdiEligible = eligibleProgramIds.includes('ky-ssdi');

  if (ssiEligible && ssdiEligible) {
    steps.push(
      'Apply for both SSI and SSDI through Social Security. They are different programs and you may qualify for both.'
    );
  } else if (ssiEligible) {
    steps.push(
      'Apply for SSI (Supplemental Security Income). In Kentucky, SSI often comes with automatic Medicaid.'
    );
  } else if (ssdiEligible) {
    steps.push(
      'Apply for SSDI (Social Security Disability Insurance). After 24 months, you will automatically get Medicare.'
    );
  }

  // Step 3: Get on waiver waitlists (if eligible — earlier is better)
  const waiverPrograms = eligibleProgramIds.filter((id) =>
    ['ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'].includes(id)
  );

  if (waiverPrograms.length > 0) {
    const waiverNames = waiverPrograms
      .map((id) => {
        if (id === 'ky-michelle-p-waiver') return 'Michelle P';
        if (id === 'ky-hcb-waiver') return 'HCB';
        if (id === 'ky-scl-waiver') return 'SCL';
        return '';
      })
      .filter(Boolean)
      .join(', ');

    steps.push(
      `Get on the ${waiverNames} waiver waitlist(s). These programs often have long waits, so apply as early as possible. You can be on multiple lists.`
    );
  }

  // Step 4: Apply for SNAP (if eligible — can apply with Medicaid through kynect)
  if (eligibleProgramIds.includes('ky-snap')) {
    if (eligibleProgramIds.includes('ky-medicaid')) {
      steps.push(
        'Apply for SNAP (food assistance). You can apply for SNAP and Medicaid together at kynect.ky.gov.'
      );
    } else {
      steps.push('Apply for SNAP (food assistance) at kynect.ky.gov or by calling 1-855-459-6328.');
    }
  }

  return steps;
}
