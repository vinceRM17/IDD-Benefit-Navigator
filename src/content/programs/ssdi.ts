import { ProgramContent } from './types';

export const ssdiContent: ProgramContent = {
  programId: 'ky-ssdi',
  name: 'SSDI (Social Security Disability Insurance)',
  description:
    'SSDI gives monthly cash to people with disabilities who worked. Adult children with disabilities can get it based on a parent\'s work. After 2 years on SSDI, you get Medicare.',
  whatItCovers: [
    'Monthly cash benefits',
    'Medicare after 24 months',
    'Benefits for eligible family members',
  ],
  nextSteps: [
    'Call Social Security at 1-800-772-1213',
    'Or apply online at ssa.gov',
    'Gather your work papers and medical papers',
    'Send them in',
    'Wait for them to decide (3-5 months)',
    'You can appeal if denied',
  ],
  requiredDocuments: [
    'Medical records showing your disability',
    'Work history (jobs, dates, duties)',
    'Birth certificate',
    'Social Security number',
    'Information about income and assets',
  ],
  applicationUrl: 'https://www.ssa.gov/benefits/disability/',
  applicationPhone: '1-800-772-1213',
  interactsWith: ['ky-medicaid', 'ky-ssi'],
  interactionNotes:
    'SSDI and SSI are different programs. You may qualify for one or both. After 24 months on SSDI, you automatically get Medicare. If you also qualify for Medicaid, you can have both Medicare and Medicaid at the same time.',
};
