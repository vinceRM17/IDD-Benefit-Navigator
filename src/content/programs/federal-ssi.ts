import { ProgramContent } from './types';

export const federalSSIContent: ProgramContent = {
  programId: 'federal-ssi',
  name: 'SSI (Supplemental Security Income)',
  description:
    'SSI gives monthly cash to people with disabilities who have limited income and resources. Children and adults can both get SSI. The money helps pay for food, clothing, and housing.',
  whatItCovers: [
    'Monthly cash payments',
    'Help with basic needs (food, clothing, shelter)',
    'May qualify you for Medicaid in most states',
  ],
  nextSteps: [
    'Call 1-800-772-1213 (Social Security Administration)',
    'Or apply online at ssa.gov',
    'Gather your medical records and financial documents',
    'Submit your application',
    'SSA will review and decide in 3-5 months',
  ],
  requiredDocuments: [
    'Medical records and disability diagnosis',
    'Birth certificate or proof of age',
    'Information about income and assets (bank statements, pay stubs)',
    'Social Security numbers for household members',
    'Proof of living expenses (rent, utilities)',
  ],
  applicationUrl: 'https://www.ssa.gov/apply/ssi',
  applicationPhone: '1-800-772-1213',
  interactsWith: ['federal-ssdi', 'federal-snap'],
  interactionNotes:
    'In many states, getting SSI means you automatically get Medicaid too. SSI income also counts toward SNAP eligibility.',
};
