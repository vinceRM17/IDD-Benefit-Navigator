/**
 * TypeScript types for multi-step screening intake form
 */

import { HouseholdFacts } from '@/lib/rules/types';

/**
 * Form-friendly version of HouseholdFacts
 * Uses strings for number inputs that get parsed via Zod coerce
 */
export interface ScreeningFormData {
  state: string;
  householdSize: number;
  monthlyIncome: number;
  hasDisabilityDiagnosis: boolean;
  age: number;
  hasInsurance: boolean;
  insuranceType?: 'employer' | 'marketplace' | 'none';
  receivesSSI?: boolean;
  receivesSNAP?: boolean;
}

/**
 * Step configuration for progress indicator
 */
export interface StepConfig {
  id: number;
  label: string;
  href: string;
}

/**
 * Multi-step intake flow configuration
 */
export const STEPS: StepConfig[] = [
  { id: 1, label: 'Family Situation', href: '/screening/intake/step-1' },
  { id: 2, label: 'Income & Benefits', href: '/screening/intake/step-2' },
  { id: 3, label: 'Diagnosis & Insurance', href: '/screening/intake/step-3' },
  { id: 4, label: 'Functional Needs', href: '/screening/intake/step-4' },
  { id: 5, label: 'Review', href: '/screening/intake/review' },
];
