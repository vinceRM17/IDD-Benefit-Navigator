import { ProgramContent } from './types';

export const ableAccountContent: ProgramContent = {
  programId: 'federal-able-account',
  name: 'ABLE Account',
  description:
    'ABLE Accounts let people with disabilities save money without losing SSI, Medicaid, or other benefits. You can save up to $100,000 and still keep your benefits. The disability must have started before age 26.',
  whatItCovers: [
    'Tax-free savings account for disability-related expenses',
    'Housing costs',
    'Education and job training',
    'Health and wellness expenses',
    'Assistive technology',
    'Transportation',
    'Basic living expenses',
  ],
  nextSteps: [
    'Check if your state has an ABLE program (most do)',
    'Visit ablenrc.org to compare state programs',
    'Open an account online',
    'Start saving — you can contribute up to $18,000 per year',
    'Use funds for qualified disability expenses',
  ],
  requiredDocuments: [
    'Proof of disability diagnosis',
    'Proof that disability began before age 26',
    'Social Security number',
    'Proof of identity',
    'Bank account for initial deposit (optional)',
  ],
  applicationUrl: 'https://www.ablenrc.org',
  applicationPhone: '1-844-223-2253',
  interactsWith: ['federal-ssi'],
  interactionNotes:
    'ABLE accounts do not count as a resource for SSI up to $100,000. This means you can save money and still keep your SSI and Medicaid benefits. Contributions from SSI benefits are allowed.',
};
