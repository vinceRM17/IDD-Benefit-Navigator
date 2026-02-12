import { ProgramContent } from './types';

export const michellePWaiverContent: ProgramContent = {
  programId: 'ky-michelle-p-waiver',
  name: 'Michelle P Waiver',
  description:
    'This waiver helps young people under age 21 with disabilities get services at home. It adds extra help on top of Medicaid. You need Medicaid first to use this waiver.',
  whatItCovers: [
    'Respite care (breaks for caregivers)',
    'Personal care services',
    'Adult day services',
    'Supported employment',
    'Residential support',
    'Case management',
  ],
  nextSteps: [
    'Make sure you have Medicaid first',
    'Get a disability diagnosis',
    'Call 1-800-635-2570 to ask for a form',
    'Fill out the form',
    'Do a needs check',
    'Join the waitlist if needed',
    'Once approved, work with your helper',
  ],
  requiredDocuments: [
    'Proof of Medicaid eligibility',
    'Diagnosis of intellectual or developmental disability',
    'Proof of age (birth certificate)',
    'Kentucky residency verification',
  ],
  applicationUrl: 'https://chfs.ky.gov/agencies/dms/dca/Pages/default.aspx',
  applicationPhone: '1-800-635-2570',
  interactsWith: ['ky-medicaid'],
  interactionNotes:
    'You need Medicaid to use the Michelle P Waiver. The waiver adds extra services on top of what Medicaid covers for children with disabilities. Apply for Medicaid first, then apply for the waiver.',
  waitlistInfo:
    'This program has a waitlist. Getting on the list as early as possible is important. Once your name comes up, services can start quickly.',
};
