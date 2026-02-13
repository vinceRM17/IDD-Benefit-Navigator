import { ProgramContent } from './types';

export const michellePWaiverContent: ProgramContent = {
  programId: 'ky-michelle-p-waiver',
  name: 'Michelle P Waiver',
  description:
    'This waiver helps people with disabilities get services at home. It adds extra help on top of Medicaid. You need Medicaid first to use this waiver.',
  whatItCovers: [
    'Respite care (breaks for caregivers)',
    'Personal care services',
    'Adult day services',
    'Supported employment',
    'Residential support',
    'Case management',
  ],
  nextSteps: [
    'Get Medicaid first',
    'Call 1-800-635-2570 for the waiver form',
    'Fill it out with help if you need it',
    'Do the needs check they ask for',
    'Get on the waitlist',
    'Wait for your turn',
  ],
  requiredDocuments: [
    'Proof of Medicaid eligibility',
    'Diagnosis of intellectual or developmental disability',
    'Kentucky residency verification',
  ],
  applicationUrl: 'https://chfs.ky.gov/agencies/dms/dca/Pages/default.aspx',
  applicationPhone: '1-800-635-2570',
  interactsWith: ['ky-medicaid'],
  interactionNotes:
    'You need Medicaid to use the Michelle P Waiver. The waiver adds extra services on top of what Medicaid covers for people with disabilities. Apply for Medicaid first, then apply for the waiver.',
  waitlistInfo:
    'This program has a long waitlist — often around 10 years. Getting on the list as early as possible is important. You can use other programs while you wait. Once your name comes up, services can start quickly.',

  encouragement:
    'Navigating this waiver is hard, and the long wait can feel overwhelming. You are not the only family going through this. Take it one step at a time — you do not have to figure it all out today.',

  whileYouWait: [
    'Apply for the HCB waiver — it can help with care and support while you wait',
    'Get on the SCL list too — you can be on more than one list at a time',
    'Try local programs like swim classes, sports, or play groups in your area',
    'Ask for a case manager to help you track your place on the list',
  ],

  commonMisconceptions: [
    'You do not have to use every service you get. You pick what works for your family.',
    'The waitlist does not mean no help. You can use other programs like HCB while you wait.',
  ],
};
