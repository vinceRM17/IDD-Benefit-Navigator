import { ProgramContent } from './types';

export const supportedEmploymentContent: ProgramContent = {
  programId: 'federal-supported-employment',
  name: 'Supported Employment',
  description:
    'Supported Employment helps people with significant disabilities work in regular jobs in their community. A job coach provides ongoing support to help you succeed at work. Services are often available through Medicaid waiver programs.',
  whatItCovers: [
    'One-on-one job coaching',
    'Help learning job tasks',
    'Workplace support and advocacy',
    'Communication with employers',
    'Ongoing support as long as needed',
    'Help with workplace social skills',
  ],
  nextSteps: [
    'Contact your state Vocational Rehabilitation agency',
    'Ask about Supported Employment services',
    'If on a Medicaid waiver, ask your case manager about employment supports',
    'Work with your team to find the right job match',
    'Receive job coaching to help you succeed',
  ],
  requiredDocuments: [
    'Documentation of disability',
    'Vocational Rehabilitation eligibility (if applying through VR)',
    'Medicaid waiver enrollment (if applicable)',
    'Interest in working in the community',
  ],
  applicationUrl: 'https://rsa.ed.gov/about/states',
  applicationPhone: '1-800-872-5327',
  interactsWith: ['federal-vocational-rehab', 'federal-ssi'],
  interactionNotes:
    'Supported Employment works with VR services and Medicaid waivers. Earning wages may affect SSI benefits, but SSI has work incentives that protect some income. A benefits counselor can help you understand the impact.',
};
