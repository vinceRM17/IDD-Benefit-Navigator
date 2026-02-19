import { ProgramContent } from './types';

export const childcareAssistanceContent: ProgramContent = {
  programId: 'federal-childcare-assistance',
  name: 'Childcare Assistance (CCDF)',
  description:
    'The Child Care and Development Fund helps families with low income pay for childcare. It covers childcare for children up to age 13, or up to age 19 for children with disabilities. Each state runs its own program.',
  whatItCovers: [
    'Childcare center costs',
    'Family childcare home costs',
    'Before and after school care',
    'Summer care programs',
    'Care for children with special needs (may include higher payment rates)',
  ],
  nextSteps: [
    'Contact your state childcare assistance office',
    'Apply through your state benefits portal',
    'Provide income and household information',
    'Choose a licensed childcare provider',
    'Your state will pay the provider directly or reimburse you',
  ],
  requiredDocuments: [
    'Proof of income',
    'Proof of need for childcare (work, school, or training)',
    'Birth certificates for children',
    'Proof of residency',
    'Childcare provider information',
  ],
  applicationUrl: 'https://www.childcare.gov/consumer-education/get-help-paying-for-child-care',
  applicationPhone: '1-800-616-2242',
  interactsWith: ['federal-snap'],
  interactionNotes:
    'Families receiving SNAP may also qualify for childcare assistance. Children with disabilities may qualify for extended age coverage up to 19 and additional support services from their childcare provider.',
};
