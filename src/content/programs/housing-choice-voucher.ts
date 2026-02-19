import { ProgramContent } from './types';

export const housingChoiceVoucherContent: ProgramContent = {
  programId: 'federal-housing-choice-voucher',
  name: 'Housing Choice Voucher (Section 8)',
  description:
    'Housing Choice Vouchers help families with low income pay for safe housing. The program pays part of your rent directly to your landlord. People with disabilities get priority on many waiting lists.',
  whatItCovers: [
    'Part of monthly rent payment',
    'Can be used for apartments, houses, or townhomes',
    'You choose where you want to live',
    'Moves with you if you change homes',
  ],
  nextSteps: [
    'Contact your local Public Housing Authority (PHA)',
    'Ask to be placed on the waiting list',
    'Mention disability status for possible priority',
    'Gather income and household documents',
    'PHA will determine your eligibility and voucher amount',
  ],
  requiredDocuments: [
    'Proof of income for all household members',
    'Proof of disability (if requesting priority)',
    'Social Security numbers for all household members',
    'Birth certificates or proof of age',
    'Photo ID',
    'Proof of citizenship or eligible immigration status',
  ],
  applicationUrl: 'https://www.hud.gov/topics/housing_choice_voucher_program_section_8',
  applicationPhone: '1-800-955-2232',
  interactsWith: ['federal-ssi', 'federal-ssdi'],
  interactionNotes:
    'SSI and SSDI income counts when calculating your voucher amount. Lower income often means a larger voucher. People with disabilities may qualify for special accessible housing preferences.',
};
