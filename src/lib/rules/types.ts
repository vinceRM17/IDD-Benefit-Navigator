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

export interface ProgramRule {
  programId: string;
  programName: string;
  conditions: object;               // json-rules-engine conditions
  event: object;                    // json-rules-engine event
}

export interface StateConfig {
  stateCode: string;
  stateName: string;
  programs: ProgramRule[];
  incomeLimits: Record<string, Record<number, number>>; // program -> householdSize -> monthlyLimit
  metadata: {
    lastUpdated: string;
    source: string;
    effectiveDate: string;
  };
}
