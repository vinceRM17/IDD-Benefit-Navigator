import { ProgramContent } from './types';

export const snapContent: ProgramContent = {
  programId: 'ky-snap',
  name: 'SNAP (Food Assistance)',
  description:
    'SNAP helps families buy food. You get a card that works like a debit card at grocery stores. The amount you receive depends on your household size and income. Many families with children with disabilities can get SNAP.',
  whatItCovers: [
    'Groceries and food at most stores',
    'Fruits and vegetables',
    'Meat, bread, and dairy products',
    'Seeds and plants that grow food',
  ],
  nextSteps: [
    'Gather the papers listed below',
    'Go to kynect.ky.gov or call 1-855-459-6328',
    'Fill out the form',
    'Send in your papers',
    'Do a phone interview (required)',
    'You should hear back in 30 days',
  ],
  requiredDocuments: [
    'Proof of income (pay stubs, tax return, or benefit letters)',
    'Proof of identity for household members',
    'Proof of Kentucky residency (utility bill or lease)',
    'Information about household expenses (rent, utilities)',
  ],
  applicationUrl: 'https://kynect.ky.gov',
  applicationPhone: '1-855-459-6328',
  interactsWith: ['ky-medicaid', 'ky-ssi'],
  interactionNotes:
    'If you qualify for SNAP, you may also qualify for Medicaid. You can apply for both at the same time through kynect. One application can start both.',
};
