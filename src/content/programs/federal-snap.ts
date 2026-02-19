import { ProgramContent } from './types';

export const federalSNAPContent: ProgramContent = {
  programId: 'federal-snap',
  name: 'SNAP (Food Assistance)',
  description:
    'SNAP helps families buy food. You get a card that works like a debit card at grocery stores. The amount depends on your household size and income. SNAP is available nationwide.',
  whatItCovers: [
    'Groceries and food at most stores',
    'Fruits and vegetables',
    'Meat, bread, and dairy products',
    'Seeds and plants that grow food',
  ],
  nextSteps: [
    'Contact your state\'s SNAP office or Department of Social Services',
    'Gather the documents listed below',
    'Fill out the application form',
    'Submit your documents',
    'Complete an interview if required',
    'You should hear back in 30 days',
  ],
  requiredDocuments: [
    'Proof of income (pay stubs, tax return, or benefit letters)',
    'Proof of identity for household members',
    'Proof of residency (utility bill or lease)',
    'Information about household expenses (rent, utilities)',
  ],
  applicationUrl: 'https://www.fns.usda.gov/snap/state-directory',
  applicationPhone: '1-800-221-5689',
  interactsWith: ['federal-ssi'],
  interactionNotes:
    'If you qualify for SNAP, you may also qualify for other benefits in your state. Contact your local social services office to learn more.',
};
