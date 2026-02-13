/**
 * Utility functions for screening form data
 */

import { HouseholdFacts } from '@/lib/rules/types';
import { FullScreeningData } from './schema';

/**
 * Converts form data to HouseholdFacts format for rules engine
 * Handles type conversions:
 * - Boolean radio values ("true"/"false" strings) parsed to actual booleans
 * - Number string inputs parsed to numbers
 * - Optional fields with defaults
 */
export function formDataToHouseholdFacts(
  formData: FullScreeningData
): HouseholdFacts {
  return {
    state: formData.state,
    householdSize: formData.householdSize,
    monthlyIncome: formData.monthlyIncome,
    hasDisabilityDiagnosis: formData.hasDisabilityDiagnosis,
    age: formData.age ?? 0,
    hasInsurance: formData.hasInsurance,
    receivesSSI: formData.receivesSSI ?? false,
    receivesSNAP: formData.receivesSNAP ?? false,
  };
}

/**
 * Generates a unique session ID for results
 */
export function generateSessionId(): string {
  return `screening-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
