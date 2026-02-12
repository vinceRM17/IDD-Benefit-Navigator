import { EligibilityResult } from '@/lib/rules/types';
import { ProgramContent } from '@/content/programs/types';

/**
 * Enriched eligibility result with program content and ranking
 */
export interface EnrichedResult extends EligibilityResult {
  /** Program ID in standardized format (e.g., "ky-medicaid") */
  programId: string;

  /** Human-friendly program content */
  content: ProgramContent;

  /** Rank (1 = most relevant) */
  rank: number;

  /** Notes about how this program interacts with other eligible programs */
  interactionNotes: string[];
}

/**
 * Complete screening results with ranked programs and benefit interactions
 */
export interface ScreeningResults {
  /** Unique session identifier for results URL */
  sessionId: string;

  /** ISO timestamp of evaluation */
  evaluatedAt: string;

  /** State code used for evaluation */
  state: string;

  /** Ranked and enriched program results */
  programs: EnrichedResult[];

  /** Benefit interaction guidance */
  benefitInteractions: BenefitInteraction[];
}

/**
 * Describes how two or more programs interact
 */
export interface BenefitInteraction {
  /** Program IDs that interact (e.g., ['ky-medicaid', 'ky-ssi']) */
  programs: string[];

  /** Plain language description of the interaction */
  description: string;

  /** Recommendation for what user should do */
  recommendation: string;
}
