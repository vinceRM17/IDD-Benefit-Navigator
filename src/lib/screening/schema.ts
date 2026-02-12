/**
 * Zod validation schemas for multi-step screening intake
 * Uses warm, plain-language error messages (INTK-02, PLAT-02)
 */

import { z } from 'zod';

/**
 * Step 1: Family Situation
 */
export const step1Schema = z.object({
  state: z.enum(['KY'], {
    errorMap: () => ({ message: 'Please select your state' }),
  }),
  householdSize: z.coerce
    .number({
      invalid_type_error: 'Please enter a number',
    })
    .int('Please enter a whole number')
    .min(1, 'Please enter your household size (1 or more)')
    .max(15, 'Please enter a household size under 15'),
});

export type Step1Data = z.infer<typeof step1Schema>;

/**
 * Step 2: Income & Benefits
 */
export const step2Schema = z.object({
  monthlyIncome: z.coerce
    .number({
      invalid_type_error: 'Please enter a number',
    })
    .nonnegative('Monthly income cannot be negative')
    .max(999999, 'Please enter a valid monthly income amount'),
  receivesSSI: z.boolean().default(false),
  receivesSNAP: z.boolean().default(false),
});

export type Step2Data = z.infer<typeof step2Schema>;

/**
 * Step 3: Diagnosis & Insurance (base schema without refinement)
 */
const step3BaseSchema = z.object({
  hasDisabilityDiagnosis: z.boolean(),
  age: z.coerce
    .number({
      invalid_type_error: 'Please enter a number',
    })
    .int('Please enter a whole number')
    .min(0, 'Age cannot be negative')
    .max(150, 'Please enter a valid age'),
  hasInsurance: z.boolean(),
  insuranceType: z
    .enum(['employer', 'marketplace', 'none'])
    .optional(),
});

/**
 * Step 3 with refinement validation
 */
export const step3Schema = step3BaseSchema.refine(
  (data) => {
    // If hasInsurance is true, insuranceType must be provided
    if (data.hasInsurance && !data.insuranceType) {
      return false;
    }
    return true;
  },
  {
    message: 'Please select your insurance type',
    path: ['insuranceType'],
  }
);

export type Step3Data = z.infer<typeof step3BaseSchema>;

/**
 * Complete screening data (all steps merged)
 * Use base schema for merging, then add refinements
 */
const fullBaseSchema = step1Schema.merge(step2Schema).merge(step3BaseSchema);

export const fullSchema = fullBaseSchema.refine(
  (data) => {
    // If hasInsurance is true, insuranceType must be provided
    if (data.hasInsurance && !data.insuranceType) {
      return false;
    }
    return true;
  },
  {
    message: 'Please select your insurance type',
    path: ['insuranceType'],
  }
);

export type FullScreeningData = z.infer<typeof fullBaseSchema>;
