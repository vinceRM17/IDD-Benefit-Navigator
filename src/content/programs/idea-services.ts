import { ProgramContent } from './types';

export const ideaServicesContent: ProgramContent = {
  programId: 'federal-idea-services',
  name: 'Special Education (IDEA)',
  description:
    'The Individuals with Disabilities Education Act (IDEA) ensures children with disabilities receive free, appropriate education. Schools must provide special education services through an IEP (Individualized Education Program). Services are available from birth through age 21.',
  whatItCovers: [
    'Individualized Education Program (IEP)',
    'Special education instruction',
    'Speech and language therapy',
    'Occupational and physical therapy',
    'Behavioral support',
    'Transition planning for life after school (starting at age 16)',
    'Early intervention services (birth to age 3)',
  ],
  nextSteps: [
    'Talk to your child\'s school about your concerns',
    'Request an evaluation in writing',
    'The school must evaluate within 60 days',
    'If eligible, the team will create an IEP',
    'For children under 3, contact your state early intervention program',
  ],
  requiredDocuments: [
    'Written request for evaluation',
    'Medical records and diagnoses',
    'Previous school records',
    'Any outside evaluations or assessments',
    'Parent observations and concerns',
  ],
  applicationUrl: 'https://sites.ed.gov/idea/parents-families/',
  applicationPhone: '1-800-695-0285',
  interactsWith: [],
  interactionNotes:
    'IDEA services are separate from Medicaid and SSI. However, Medicaid may cover some therapy services that complement your child\'s IEP. Children receiving IDEA services may also qualify for SSI based on their disability.',
};
