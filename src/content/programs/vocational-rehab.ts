import { ProgramContent } from './types';

export const vocationalRehabContent: ProgramContent = {
  programId: 'federal-vocational-rehab',
  name: 'Vocational Rehabilitation (VR)',
  description:
    'Vocational Rehabilitation helps people with disabilities prepare for, find, and keep jobs. Services are free and based on what you need to work. Each state has a VR agency ready to help.',
  whatItCovers: [
    'Job training and skill building',
    'Help finding and keeping a job',
    'Job coaching and workplace support',
    'Assistive technology for work',
    'Resume writing and interview practice',
    'Transportation help for work',
  ],
  nextSteps: [
    'Contact your state VR agency',
    'Apply for VR services',
    'Meet with a VR counselor to discuss your goals',
    'Work together to create an Individualized Plan for Employment (IPE)',
    'Begin receiving services',
  ],
  requiredDocuments: [
    'Medical records documenting disability',
    'Work history (if any)',
    'School records (if applicable)',
    'Any current treatment plans',
    'Proof of identity',
  ],
  applicationUrl: 'https://rsa.ed.gov/about/states',
  applicationPhone: '1-800-872-5327',
  interactsWith: ['federal-ssi', 'federal-ssdi'],
  interactionNotes:
    'VR services can be used while receiving SSI or SSDI. Working through VR will not automatically affect your disability benefits. VR counselors can help you understand how earnings may affect benefits.',
};
