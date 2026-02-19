import { ProgramContent } from './types';

export const federalSSDIContent: ProgramContent = {
  programId: 'federal-ssdi',
  name: 'SSDI (Social Security Disability Insurance)',
  description:
    'SSDI provides monthly income to people with disabilities who have worked and paid Social Security taxes. The amount depends on your work history. After 24 months on SSDI, you automatically get Medicare.',
  whatItCovers: [
    'Monthly disability income payments',
    'Automatic Medicare coverage after 24 months',
    'Payments to dependents in some cases',
  ],
  nextSteps: [
    'Call 1-800-772-1213 (Social Security Administration)',
    'Or apply online at ssa.gov',
    'Gather your medical records and work history',
    'Submit your application',
    'SSA will review and decide in 3-5 months',
  ],
  requiredDocuments: [
    'Medical records and disability diagnosis',
    'Work history and employment records',
    'Social Security statement',
    'Proof of income',
    'Birth certificate or proof of age',
  ],
  applicationUrl: 'https://www.ssa.gov/benefits/disability/apply.html',
  applicationPhone: '1-800-772-1213',
  interactsWith: ['federal-ssi', 'federal-snap'],
  interactionNotes:
    'SSDI and SSI are different programs. You may qualify for one or both. After 24 months on SSDI, you automatically get Medicare.',
};
