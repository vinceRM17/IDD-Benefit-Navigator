import { PartnerOrganization } from '../types';

export const tennesseePartners: PartnerOrganization[] = [
  {
    id: 'tn-didd',
    name: 'Tennessee Department of Intellectual and Developmental Disabilities',
    description:
      'DIDD provides services and support for Tennesseans with intellectual and developmental disabilities, including waiver programs and community services.',
    services: [
      'Waiver program administration',
      'Community-based services',
      'Employment and day services',
      'Family support programs',
    ],
    phone: '1-615-532-6530',
    website: 'https://www.tn.gov/didd',
    servesArea: 'Statewide (Tennessee)',
    relevantPrograms: ['tn-medicaid', 'tn-ssi', 'tn-snap'],
    servicesOffered: ['case-management', 'application-assistance', 'community-integration'],
  },
  {
    id: 'the-arc-tennessee',
    name: 'The Arc Tennessee',
    description:
      'The Arc Tennessee advocates for people with intellectual and developmental disabilities. They provide resources, support, and advocacy at the state and local level.',
    services: [
      'Advocacy and public policy',
      'Information and referral',
      'Family support',
      'Community inclusion programs',
    ],
    phone: '1-615-248-5878',
    website: 'https://www.thearctn.org',
    servesArea: 'Statewide (Tennessee)',
    relevantPrograms: ['tn-medicaid', 'tn-ssi', 'tn-snap'],
    servicesOffered: ['advocacy', 'family-support', 'benefits-navigation'],
  },
  {
    id: 'disability-rights-tn',
    name: 'Disability Rights Tennessee',
    description:
      'Tennessee\'s Protection & Advocacy agency. They provide free legal help for people with disabilities on issues like benefits, education, housing, and employment.',
    services: [
      'Legal advocacy',
      'Benefits assistance',
      'Education rights',
      'Housing discrimination help',
    ],
    phone: '1-800-342-1660',
    website: 'https://www.disabilityrightstn.org',
    servesArea: 'Statewide (Tennessee)',
    relevantPrograms: ['tn-ssi', 'tn-ssdi', 'tn-medicaid'],
    servicesOffered: ['advocacy', 'benefits-navigation'],
  },
];
