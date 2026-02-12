import { ProgramContent } from './types';

export const ssiContent: ProgramContent = {
  programId: 'ky-ssi',
  name: 'SSI (Supplemental Security Income)',
  description:
    'SSI gives monthly cash to people with disabilities. You must have low income to qualify. Children and adults can both get SSI. The money helps pay for food, clothing, and housing.',
  whatItCovers: [
    'Monthly cash payments',
    'Help with basic needs (food, clothing, shelter)',
    'Automatic Medicaid eligibility in Kentucky',
  ],
  nextSteps: [
    'Gather the papers listed below',
    'Call 1-800-772-1213 to set up a meeting',
    'Or apply online at ssa.gov/apply/ssi',
    'Bring your papers or upload them',
    'Share medical records',
    'This can take 3-5 months',
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
  interactsWith: ['ky-medicaid', 'ky-snap', 'ky-ssdi'],
  interactionNotes:
    'In Kentucky, getting SSI usually means you automatically get Medicaid too. This happens without a separate application. SSI income also counts toward SNAP eligibility.',
};
