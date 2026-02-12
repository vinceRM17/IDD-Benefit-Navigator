/**
 * State-agnostic benefit eligibility rules engine
 */

import { Engine } from 'json-rules-engine';
import { loadStateConfig } from './loader';
import type { HouseholdFacts, EligibilityResult, StateConfig, ProgramRule } from './types';

/**
 * Eligibility evaluation engine
 *
 * Wraps json-rules-engine to evaluate household facts against state-specific
 * benefit program rules. The engine is state-agnostic - program rules are
 * loaded from JSON configuration files, not hardcoded.
 *
 * @example
 * ```typescript
 * const config = await loadStateConfig('KY');
 * const engine = new EligibilityEngine(config);
 * const results = await engine.evaluate({
 *   state: 'KY',
 *   householdSize: 4,
 *   monthlyIncome: 2000,
 *   hasDisabilityDiagnosis: true,
 *   age: 8,
 *   hasInsurance: false,
 * });
 * ```
 */
export class EligibilityEngine {
  private engine: Engine;
  private config: StateConfig;

  constructor(config: StateConfig) {
    this.config = config;
    this.engine = new Engine();

    // Add all program rules to the engine
    config.programs.forEach(program => {
      this.engine.addRule({
        conditions: program.conditions as any,
        event: program.event as any,
      });
    });

    // Add custom fact for income limits based on household size and program
    this.engine.addFact('incomeLimitMedicaid', (params, almanac) => {
      return almanac.factValue('householdSize').then((size) => {
        return this.config.incomeLimits.medicaid?.[size as number] || 0;
      });
    });

    this.engine.addFact('incomeLimitSNAP', (params, almanac) => {
      return almanac.factValue('householdSize').then((size) => {
        return this.config.incomeLimits.snap?.[size as number] || 0;
      });
    });

    this.engine.addFact('incomeLimitSSI', (params, almanac) => {
      return this.config.incomeLimits.ssi?.[1] || 0;
    });

    this.engine.addFact('incomeLimitTestBenefitA', (params, almanac) => {
      return almanac.factValue('householdSize').then((size) => {
        return this.config.incomeLimits['test-benefit-a']?.[size as number] || 0;
      });
    });
  }

  /**
   * Evaluate household facts against all program rules
   * @param facts - Household information
   * @returns Array of eligibility results for each program
   */
  async evaluate(facts: HouseholdFacts): Promise<EligibilityResult[]> {
    // Validate required facts
    this.validateFacts(facts);

    // Normalize facts by providing defaults for optional fields
    const normalizedFacts = {
      ...facts,
      receivesSSI: facts.receivesSSI ?? false,
      receivesSNAP: facts.receivesSNAP ?? false,
      insuranceType: facts.insuranceType ?? 'none',
    };

    // Run the rules engine
    const { events } = await this.engine.run(normalizedFacts);

    // Get programs that matched (eligible)
    const eligiblePrograms = new Set(
      events.map((e: any) => e.params.program)
    );

    // Build results for all programs
    const results: EligibilityResult[] = [];

    for (const program of this.config.programs) {
      const isEligible = eligiblePrograms.has(program.programName);
      const event = events.find((e: any) => e.params.program === program.programName);

      if (isEligible && event && event.params) {
        // Program is eligible
        results.push(
          this.buildEligibleResult(program, facts, event.params.confidence)
        );
      } else {
        // Program is not eligible
        results.push(this.buildIneligibleResult(program, facts));
      }
    }

    return results;
  }

  /**
   * Validate that all required facts are present
   */
  private validateFacts(facts: HouseholdFacts): void {
    const required: (keyof HouseholdFacts)[] = [
      'state',
      'householdSize',
      'monthlyIncome',
      'hasDisabilityDiagnosis',
      'age',
      'hasInsurance',
    ];

    for (const field of required) {
      if (facts[field] === undefined || facts[field] === null) {
        throw new Error(`Missing required fact: ${field}`);
      }
    }
  }

  /**
   * Build result for eligible program
   */
  private buildEligibleResult(
    program: ProgramRule,
    facts: HouseholdFacts,
    confidence: 'likely' | 'possible' | 'unlikely'
  ): EligibilityResult {
    const reasons: string[] = [];
    const nextSteps: string[] = [];
    const requiredDocuments: string[] = [];

    // Generate program-specific reasons
    if (program.programName === 'Medicaid') {
      if (facts.receivesSSI) {
        reasons.push('SSI recipients are categorically eligible');
      } else {
        const limit = this.config.incomeLimits.medicaid?.[facts.householdSize];
        if (facts.monthlyIncome <= limit) {
          if (facts.monthlyIncome === limit) {
            reasons.push('Income at or below Kentucky Medicaid limit');
          } else {
            reasons.push('Income below Kentucky Medicaid limit');
          }
        }
      }
      nextSteps.push('Apply through kynect.ky.gov or local DCBS office');
      requiredDocuments.push('Proof of income', 'Proof of residency', 'Social Security cards');
    } else if (program.programName === 'SNAP') {
      const limit = this.config.incomeLimits.snap?.[facts.householdSize];
      if (facts.monthlyIncome <= limit) {
        reasons.push('Income below Kentucky SNAP limit');
      }
      nextSteps.push('Apply through kynect.ky.gov or local DCBS office');
      requiredDocuments.push('Proof of income', 'Utility bills', 'Rent/mortgage statements');
    } else if (program.programName === 'SSI') {
      reasons.push('Disability diagnosis may qualify for SSI');
      if (facts.monthlyIncome > 2000) {
        reasons.push('High income may reduce SSI benefit amount');
      }
      nextSteps.push('Apply through Social Security Administration');
      requiredDocuments.push('Medical records', 'Proof of income', 'Work history');
    } else if (program.programName === 'Michelle P Waiver') {
      reasons.push('IDD diagnosis and age under 21');
      nextSteps.push('Contact Kentucky Department for Aging and Independent Living');
      requiredDocuments.push('IDD diagnosis documentation', 'Proof of Kentucky residency');
    } else {
      // Generic for TEST state or other programs
      reasons.push(`Meets eligibility criteria for ${program.programName}`);
    }

    return {
      program: program.programName,
      eligible: true,
      confidence,
      reasons,
      nextSteps: nextSteps.length > 0 ? nextSteps : undefined,
      requiredDocuments: requiredDocuments.length > 0 ? requiredDocuments : undefined,
    };
  }

  /**
   * Build result for ineligible program
   */
  private buildIneligibleResult(
    program: ProgramRule,
    facts: HouseholdFacts
  ): EligibilityResult {
    const reasons: string[] = [];

    // Generate program-specific reasons for ineligibility
    if (program.programName === 'Medicaid') {
      const limit = this.config.incomeLimits.medicaid?.[facts.householdSize];
      if (facts.monthlyIncome > limit) {
        reasons.push('Income above Kentucky Medicaid limit');
      }
    } else if (program.programName === 'SNAP') {
      const limit = this.config.incomeLimits.snap?.[facts.householdSize];
      if (facts.monthlyIncome > limit) {
        reasons.push('Income above Kentucky SNAP limit');
      }
    } else if (program.programName === 'SSI') {
      if (!facts.hasDisabilityDiagnosis) {
        reasons.push('No disability diagnosis documented');
      }
    } else if (program.programName === 'Michelle P Waiver') {
      if (!facts.hasDisabilityDiagnosis) {
        reasons.push('No IDD diagnosis documented');
      } else if (facts.age >= 21) {
        reasons.push('Age exceeds program limit (must be under 21)');
      }
    } else {
      reasons.push(`Does not meet eligibility criteria for ${program.programName}`);
    }

    return {
      program: program.programName,
      eligible: false,
      confidence: 'unlikely',
      reasons,
    };
  }
}

/**
 * Convenience function to evaluate eligibility for a state
 *
 * Loads the state configuration, creates an engine, and evaluates
 * household facts in one call.
 *
 * @param stateCode - State abbreviation (e.g., "KY", "TEST")
 * @param facts - Household information
 * @returns Array of eligibility results for all state programs
 * @throws Error if state configuration not found or facts are invalid
 *
 * @example
 * ```typescript
 * const results = await evaluateEligibility('KY', {
 *   state: 'KY',
 *   householdSize: 2,
 *   monthlyIncome: 1500,
 *   hasDisabilityDiagnosis: true,
 *   age: 25,
 *   hasInsurance: false,
 * });
 *
 * results.forEach(r => {
 *   console.log(`${r.program}: ${r.eligible ? 'eligible' : 'not eligible'}`);
 * });
 * ```
 */
export async function evaluateEligibility(
  stateCode: string,
  facts: HouseholdFacts
): Promise<EligibilityResult[]> {
  const config = await loadStateConfig(stateCode);
  const engine = new EligibilityEngine(config);
  return engine.evaluate(facts);
}
