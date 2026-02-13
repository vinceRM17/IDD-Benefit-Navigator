import { ProgramContent } from './types';

export const medicaidContent: ProgramContent = {
  programId: 'ky-medicaid',
  name: 'Medicaid',
  description:
    'Medicaid helps pay for health care. It covers doctor visits and medicines. Many families with children with disabilities can get it. It is free.',
  whatItCovers: [
    'Doctor and specialist visits',
    'Hospital stays',
    'Prescription medicines',
    'Therapy services (physical, occupational, speech)',
    'Mental health services',
    'Medical equipment and supplies',
  ],
  nextSteps: [
    'Gather the papers listed below',
    'Go to kynect.ky.gov or call 1-855-459-6328',
    'Fill out the form online or by phone',
    'Send in your papers',
    'Do a phone interview if asked',
    'You should hear back in 45 days',
  ],
  requiredDocuments: [
    'Proof of income (pay stubs or tax return)',
    'Proof of identity (birth certificate or ID)',
    'Social Security numbers for household members',
    'Proof of Kentucky residency (utility bill or lease)',
    'Disability diagnosis documentation',
  ],
  applicationUrl: 'https://kynect.ky.gov',
  applicationPhone: '1-855-459-6328',
  interactsWith: ['ky-ssi', 'ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'],
  interactionNotes:
    'If you also qualify for Supplemental Security Income (SSI), you may automatically qualify for Medicaid. Medicaid can also work alongside waiver programs to cover more services for people with disabilities.',
  insuranceCoordination:
    'If your family member has private insurance AND qualifies for Medicaid, both can work together. Your private insurance pays first (it is the "primary" plan). Then Medicaid helps cover what is left over — like copays, deductibles, or services private insurance does not cover. This is called "coordination of benefits." You do not have to choose one or the other. Having both means less out-of-pocket cost for your family.',

  encouragement:
    'Medicaid is a big system and it can be hard to figure out — that is not your fault. Many families feel lost in the process. You are not the only one, and you do not have to do it alone.',

  commonMisconceptions: [
    'A denial is not the end. If you were told no due to income, that can help you get waiver services for people with disabilities.',
    'You can have both private insurance and Medicaid. You do not have to pick one.',
    'It takes work to apply. But you can call for help and they will walk you through it.',
  ],
};
