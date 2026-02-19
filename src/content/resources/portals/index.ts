import { ApplicationPortal } from '../types';

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

const ohioPortals: ApplicationPortal[] = [
  {
    id: 'oh-benefits',
    name: 'Ohio Benefits Portal',
    description:
      'Apply for Ohio Medicaid, SNAP, and other public assistance programs online.',
    url: 'https://benefits.ohio.gov',
    programIds: ['oh-medicaid', 'oh-snap'],
    notes: 'Create an account to apply. Processing typically takes 30-45 days.',
  },
];

const indianaPortals: ApplicationPortal[] = [
  {
    id: 'in-fssa-portal',
    name: 'Indiana FSSA Benefits Portal',
    description:
      'Apply for Indiana Medicaid, SNAP, and other benefits through the FSSA online portal.',
    url: 'https://fssabenefits.in.gov',
    programIds: ['in-medicaid', 'in-snap'],
    notes: 'You will need to create an account. Have income documents and IDs ready.',
  },
];

const tennesseePortals: ApplicationPortal[] = [
  {
    id: 'tn-one-dhs',
    name: 'Tennessee One DHS Portal',
    description:
      'Apply for TennCare (Medicaid), SNAP, and other Tennessee benefits online.',
    url: 'https://onedhs.tn.gov',
    programIds: ['tn-medicaid', 'tn-snap'],
    notes: 'TennCare is Tennessee\'s Medicaid program. Apply online or call 1-866-311-4287.',
  },
];

const portalsByState: Record<string, ApplicationPortal[]> = {
  KY: kentuckyPortals,
  OH: ohioPortals,
  IN: indianaPortals,
  TN: tennesseePortals,
};

export function getPortalsByState(stateCode: string): ApplicationPortal[] {
  const statePortals = portalsByState[stateCode];
  if (statePortals) return statePortals;

  return nationalPortals.map(portal => ({
    ...portal,
    programIds: portal.programIds.map(id =>
      id.startsWith('federal-')
        ? id.replace('federal-', `${stateCode.toLowerCase()}-`)
        : id
    ),
  }));
}
