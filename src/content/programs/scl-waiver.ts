import { ProgramContent } from './types';

/**
 * Plain-language content for Kentucky SCL Waiver (Supports for Community Living)
 * Designed for 6th grade reading level with person-first language
 */
export const sclWaiverContent: ProgramContent = {
  programId: 'ky-scl-waiver',
  name: 'SCL Waiver (Supports for Community Living)',

  description:
    'This waiver helps adults with disabilities who need a lot of daily help. It provides more services than the HCB waiver. It covers housing support, day programs, and nursing care. You need Medicaid first.',

  whatItCovers: [
    'Residential services and housing support',
    'Day programs and activities',
    'Supported employment',
    'Nursing services',
    'Behavioral support services',
    'Personal care',
    'Transportation',
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
    'Level of care assessment showing need for comprehensive supports',
    'Proof of age (must be 18 or older)',
    'Kentucky residency verification',
  ],

  applicationUrl: 'https://chfs.ky.gov/agencies/dms/dca/Pages/default.aspx',
  applicationPhone: '1-800-635-2570',

  interactsWith: ['ky-medicaid', 'ky-hcb-waiver'],

  interactionNotes:
    'You need Medicaid to use the SCL Waiver. SCL provides more comprehensive services than the HCB waiver. You can be on waitlists for both SCL and HCB at the same time.',

  waitlistInfo:
    'This program has a waitlist. Getting on the list as early as possible is important. The wait can be several years, but being on the list means you are in line for services.',

  encouragement:
    'Getting on this list early matters, even if it feels far away. Many families plan ahead for the future while using other supports today. You are not alone in this.',

  whileYouWait: [
    'If you have the Michelle P waiver, use it — it can help with care and respite now',
    'Try local programs like sports, day groups, or social clubs in your area',
    'Start planning for adult services early — a case manager can help you get ready',
    'You can be on both the SCL and HCB lists at the same time',
  ],

  commonMisconceptions: [
    'SCL is not just more of Michelle P. SCL has housing support that Michelle P does not.',
    'Michelle P can have more hours for some services. One is not always better than the other.',
  ],
};
