/**
 * Pure conditional logic functions for screening form
 * Determines which fields to show/hide based on user answers
 */

import { FullScreeningData } from './schema';

/**
 * Determines if insurance type field should be shown
 */
export function shouldShowInsuranceType(hasInsurance: boolean): boolean {
  return hasInsurance === true;
}

/**
 * Determines if SSI details should be shown
 */
export function shouldShowSSIDetails(receivesSSI: boolean): boolean {
  return receivesSSI === true;
}

/**
 * Calculates next step number based on current step and form data
 * Simple linear progression for now, can add skip logic later
 */
export function getNextStep(
  currentStep: number,
  formData: Partial<FullScreeningData>
): number {
  return currentStep + 1;
}

/**
 * Calculates previous step number
 */
export function getPrevStep(currentStep: number): number {
  return Math.max(1, currentStep - 1);
}
