import { PartnerOrganization } from '../types';

export const indianaPartners: PartnerOrganization[] = [
  {
    id: 'in-fssa',
    name: 'Indiana FSSA Division of Disability and Rehabilitative Services',
    description:
      'Indiana\'s DDRS administers disability services including Medicaid waivers, vocational rehabilitation, and independent living programs.',
    services: [
      'Medicaid waiver administration',
      'Vocational rehabilitation',
      'Independent living services',
      'First Steps early intervention',
    ],
    phone: '1-800-545-7763',
    website: 'https://www.in.gov/fssa/ddrs',
    servesArea: 'Statewide (Indiana)',
    relevantPrograms: ['in-medicaid', 'in-ssi', 'in-snap'],
    servicesOffered: ['application-assistance', 'case-management', 'benefits-navigation'],
  },
  {
    id: 'the-arc-indiana',
    name: 'The Arc of Indiana',
    description:
      'The Arc of Indiana promotes and protects the rights of people with intellectual and developmental disabilities. They offer advocacy, education, and family support across the state.',
    services: [
      'Disability rights advocacy',
      'Guardianship services',
      'Employment programs',
      'Family and self-advocacy training',
    ],
    phone: '1-317-977-2375',
    website: 'https://www.arcind.org',
    servesArea: 'Statewide (Indiana)',
    relevantPrograms: ['in-medicaid', 'in-ssi', 'in-snap'],
    servicesOffered: ['advocacy', 'family-support', 'employment'],
  },
  {
    id: 'in-disability-rights',
    name: 'Indiana Disability Rights',
    description:
      'Indiana\'s Protection & Advocacy agency. They provide free legal help for people with disabilities, including help with benefit denials, abuse, and discrimination.',
    services: [
      'Legal advocacy',
      'Benefit denial appeals',
      'Abuse and neglect investigations',
      'Rights education',
    ],
    phone: '1-800-622-4845',
    website: 'https://www.indianadisabilityrights.org',
    servesArea: 'Statewide (Indiana)',
    relevantPrograms: ['in-ssi', 'in-ssdi', 'in-medicaid'],
    servicesOffered: ['advocacy', 'benefits-navigation'],
  },
];
