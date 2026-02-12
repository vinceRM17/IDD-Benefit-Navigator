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
};
