import { ApplicationPortal } from './types';

/**
 * National application portals available in all states
 */
const nationalPortals: ApplicationPortal[] = [
  {
    id: 'ssa-online',
    name: 'Social Security Online Application',
    description:
      'Apply for SSI or SSDI benefits directly through the Social Security Administration\'s website.',
    url: 'https://www.ssa.gov/benefits/disability/apply.html',
    programIds: ['federal-ssi', 'federal-ssdi'],
    notes: 'You can also call 1-800-772-1213 to apply by phone or schedule an appointment at a local office.',
  },
];

/**
 * Kentucky-specific portals
 */
const kentuckyPortals: ApplicationPortal[] = [
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
    id: 'ssa-online-ky',
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

/**
 * Portals organized by state code
 */
const portalsByState: Record<string, ApplicationPortal[]> = {
  KY: kentuckyPortals,
};

/**
 * Get application portals for a specific state
 * Returns state-specific portals, or national portals for federal-only states
 */
export function getPortalsByState(stateCode: string): ApplicationPortal[] {
  const statePortals = portalsByState[stateCode];
  if (statePortals) return statePortals;

  // Adapt national portal programIds to use state prefix
  return nationalPortals.map(portal => ({
    ...portal,
    programIds: portal.programIds.map(id =>
      id.startsWith('federal-')
        ? id.replace('federal-', `${stateCode.toLowerCase()}-`)
        : id
    ),
  }));
}

/**
 * @deprecated Use getPortalsByState() instead
 */
export const applicationPortals = kentuckyPortals;
