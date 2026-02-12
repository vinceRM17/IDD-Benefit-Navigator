import { PartnerOrganization } from './types';

/**
 * Partner organizations in Kentucky that assist with IDD benefit applications
 *
 * These organizations provide free assistance with navigating benefits,
 * completing applications, and understanding eligibility.
 */
export const partnerOrganizations: PartnerOrganization[] = [
  {
    id: 'kaia',
    name: 'Kentucky Association for Individuals with Autism (KAIA)',
    description:
      'KAIA helps families navigate benefits for people with autism and other developmental disabilities. They offer free guidance on Medicaid, waivers, and SSI applications.',
    services: [
      'Benefits navigation and application assistance',
      'Autism-specific resources and support',
      'Family support groups',
      'Educational workshops on benefits',
    ],
    phone: '502-223-1885',
    email: 'info@kyautism.org',
    website: 'https://kyautism.org',
    servesArea: 'Statewide',
    relevantPrograms: [
      'ky-medicaid',
      'ky-michelle-p-waiver',
      'ky-hcb-waiver',
      'ky-scl-waiver',
      'ky-ssi',
      'ky-ssdi',
      'ky-snap',
    ],
  },
  {
    id: 'southwest-cil',
    name: 'Southwest Center for Independent Living',
    description:
      'The Southwest Center helps people with disabilities live independently. They assist with benefit applications, home modifications, and community resources.',
    services: [
      'Independent living skills training',
      'Benefits counseling and application help',
      'Home modification assistance',
      'Peer support and advocacy',
    ],
    phone: '270-796-2030',
    email: 'info@swcil.org',
    website: 'https://swcil.org',
    servesArea: 'Southwest Kentucky (Bowling Green area)',
    relevantPrograms: [
      'ky-medicaid',
      'ky-michelle-p-waiver',
      'ky-hcb-waiver',
      'ky-scl-waiver',
      'ky-ssi',
      'ky-ssdi',
      'ky-snap',
    ],
  },
  {
    id: 'mattingly-edge',
    name: 'Mattingly Edge',
    description:
      'Mattingly Edge provides employment and community services for people with intellectual and developmental disabilities in the Louisville area.',
    services: [
      'Employment support and job training',
      'Community integration programs',
      'Day services and activities',
      'Benefits assistance for employment programs',
    ],
    phone: '502-895-5959',
    email: 'info@mattinglyedge.org',
    website: 'https://mattinglyedge.org',
    address: '3941 Dutchmans Lane, Louisville, KY 40207',
    servesArea: 'Louisville Metro and surrounding counties',
    relevantPrograms: ['ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver', 'ky-medicaid'],
  },
  {
    id: 'best-buddies-ky',
    name: 'Best Buddies Kentucky',
    description:
      'Best Buddies creates opportunities for friendship and employment for people with intellectual and developmental disabilities across Kentucky.',
    services: [
      'One-to-one friendship matching',
      'Employment placement and support',
      'Leadership development',
      'Social inclusion programs',
    ],
    phone: '502-587-5502',
    email: 'kentucky@bestbuddies.org',
    website: 'https://www.bestbuddies.org/kentucky',
    servesArea: 'Statewide',
    relevantPrograms: ['ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'],
  },
  {
    id: 'ky-dcbs',
    name: 'Kentucky Department for Community Based Services (DCBS)',
    description:
      'DCBS administers Medicaid, SNAP, and other public benefits in Kentucky. They process applications and determine eligibility.',
    services: [
      'Medicaid and SNAP application processing',
      'Eligibility determination',
      'Case management',
      'Benefit renewals and updates',
    ],
    phone: '1-855-306-8959',
    website: 'https://chfs.ky.gov/agencies/dcbs',
    servesArea: 'Statewide',
    relevantPrograms: ['ky-medicaid', 'ky-snap', 'ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'],
  },
  {
    id: 'ssa-kentucky',
    name: 'Social Security Administration (Kentucky offices)',
    description:
      'The Social Security Administration processes SSI and SSDI applications. You can apply online or visit a local office for help.',
    services: [
      'SSI and SSDI application processing',
      'Disability determination',
      'Benefit verification letters',
      'Medicare enrollment',
    ],
    phone: '1-800-772-1213',
    website: 'https://www.ssa.gov',
    servesArea: 'Statewide',
    relevantPrograms: ['ky-ssi', 'ky-ssdi'],
  },
];
