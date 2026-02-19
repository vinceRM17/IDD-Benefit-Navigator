/**
 * TypeScript interfaces for benefit eligibility rules engine
 */

export interface HouseholdFacts {
  state: string;                    // e.g., "KY"
  householdSize: number;            // 1-10+
  monthlyIncome: number;            // gross monthly household income
  hasDisabilityDiagnosis: boolean;  // IDD diagnosis present
  age: number;                      // age of person with disability
  hasInsurance: boolean;            // private insurance
  insuranceType?: 'employer' | 'marketplace' | 'none';
  receivesSSI?: boolean;
  receivesSNAP?: boolean;
}

export interface EligibilityResult {
  program: string;                  // e.g., "Medicaid", "SNAP"
  eligible: boolean;
  confidence: 'likely' | 'possible' | 'unlikely';
  reasons: string[];                // why eligible/ineligible
  nextSteps?: string[];             // what to do if eligible
  requiredDocuments?: string[];     // docs needed to apply
}

export interface ProgramEnrichment {
  /** Reasons shown when eligible, keyed by condition type */
  eligibleReasons: EligibleReasonRule[];
  /** Reasons shown when ineligible, keyed by condition type */
  ineligibleReasons: IneligibleReasonRule[];
  /** Next steps when eligible */
  nextSteps: string[];
  /** Documents needed to apply */
  requiredDocuments: string[];
  /** Priority for ranking (lower = higher priority) */
  priority: number;
}

export interface EligibleReasonRule {
  condition: 'receivesSSI' | 'incomeAtLimit' | 'incomeBelowLimit' | 'hasDisability' | 'highIncome' | 'meetsAgeCriteria' | 'default';
  /** Which income limit key to check (e.g., "medicaid", "snap") */
  incomeLimitKey?: string;
  reason: string;
}

export interface IneligibleReasonRule {
  condition: 'incomeAboveLimit' | 'noDisability' | 'ageBelow' | 'default';
  incomeLimitKey?: string;
  /** Minimum age threshold for ageBelow check */
  minAge?: number;
  reason: string;
}

export interface BenefitInteractionRule {
  programs: string[];
  requiresInsurance?: boolean;
  description: string;
  recommendation: string;
}

export interface ActionPlanRule {
  programName: string;
  step: string;
  /** Combined step when both SSI and SSDI are eligible */
  combinedWith?: string;
  combinedStep?: string;
  /** Alternate step when Medicaid is also eligible */
  withMedicaidStep?: string;
}

export interface ProgramRule {
  programId: string;
  programName: string;
  conditions: object;               // json-rules-engine conditions
  event: object;                    // json-rules-engine event
  enrichment?: ProgramEnrichment;
}

export type CoverageLevel = 'full' | 'federal-only';

export interface StateConfig {
  stateCode: string;
  stateName: string;
  coverageLevel?: CoverageLevel;
  programs: ProgramRule[];
  incomeLimits: Record<string, Record<number, number>>; // program -> householdSize -> monthlyLimit
  benefitInteractions?: BenefitInteractionRule[];
  actionPlanOrder?: ActionPlanRule[];
  metadata: {
    lastUpdated: string;
    source: string;
    effectiveDate: string;
  };
}
