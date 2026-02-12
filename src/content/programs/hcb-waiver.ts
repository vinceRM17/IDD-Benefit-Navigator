import { ProgramContent } from './types';

export const hcbWaiverContent: ProgramContent = {
  programId: 'ky-hcb-waiver',
  name: 'HCB Waiver (Home and Community Based)',
  description:
    'This waiver helps adults with disabilities stay at home. It adds more services on top of Medicaid. You need Medicaid first.',
  whatItCovers: [
    'Personal care services',
    'Respite care for caregivers',
    'Day services and programs',
    'Supported employment',
    'Residential support',
    'Transportation',
  ],
  nextSteps: [
    'Get Medicaid first',
    'Call 1-800-635-2570 for the waiver form',
    'Fill it out with help if you need it',
    'Do the needs check they ask for',
    'Get on the waitlist (this can take years)',
    'Wait for your turn',
  ],
  requiredDocuments: [
    'Proof of Medicaid eligibility',
    'Documentation of disability or medical condition',
    'Level of care assessment showing need for services',
    'Proof of age (must be 18 or older)',
  ],
  applicationUrl: 'https://chfs.ky.gov/agencies/dms/dca/Pages/default.aspx',
  applicationPhone: '1-800-635-2570',
  interactsWith: ['ky-medicaid', 'ky-scl-waiver'],
  interactionNotes:
    'You need Medicaid to use the HCB Waiver. The waiver provides services in your home and community instead of a facility for adults with disabilities. You can be on waitlists for both HCB and SCL waivers at the same time.',
  waitlistInfo:
    'This program often has a long waitlist. Apply as early as possible. You can be on more than one waiver waitlist at a time.',
};
