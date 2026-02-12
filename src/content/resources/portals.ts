import { ApplicationPortal } from './types';

/**
 * Official application portals for Kentucky benefit programs
 *
 * These are the primary online portals where families can apply
 * for benefits and manage their applications.
 */
export const applicationPortals: ApplicationPortal[] = [
  {
    id: 'kynect',
    name: 'kynect',
    description:
      'Kentucky\'s official health and benefits portal. Apply for Medicaid, SNAP, and other benefits in one place.',
    url: 'https://kynect.ky.gov',
    programIds: ['ky-medicaid', 'ky-snap'],
    notes: 'You\'ll need to create an account to apply. Have your documents ready before starting.',
  },
  {
    id: 'ssa-online',
    name: 'Social Security Online Application',
    description:
      'Apply for SSI or SSDI benefits directly through the Social Security Administration\'s website.',
    url: 'https://www.ssa.gov/benefits/disability/apply.html',
    programIds: ['ky-ssi', 'ky-ssdi'],
    notes: 'You can also call 1-800-772-1213 to apply by phone or schedule an appointment at a local office.',
  },
  {
    id: 'ky-chfs-waivers',
    name: 'Kentucky CHFS Waiver Information',
    description:
      'Learn about Kentucky waiver programs (Michelle P, HCB, SCL) and how to get on the waitlist. Waiver applications go through DCBS.',
    url: 'https://chfs.ky.gov/agencies/dms/dpo/scb',
    programIds: ['ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'],
    notes: 'Waiver applications require a DCBS case manager. Contact DCBS at 1-855-306-8959 to start the process.',
  },
];
