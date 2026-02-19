import { PartnerOrganization } from '../types';

export const ohioPartners: PartnerOrganization[] = [
  {
    id: 'oh-dd-council',
    name: 'Ohio Developmental Disabilities Council',
    description:
      'The Ohio DD Council works to improve the lives of Ohioans with developmental disabilities through advocacy, education, and policy change.',
    services: [
      'Advocacy and policy work',
      'Grants for disability programs',
      'Self-advocacy training',
      'Resource referrals',
    ],
    phone: '1-614-466-5205',
    website: 'https://ddc.ohio.gov',
    servesArea: 'Statewide (Ohio)',
    relevantPrograms: ['oh-medicaid', 'oh-ssi', 'oh-ssdi', 'oh-snap'],
    servicesOffered: ['advocacy', 'education'],
  },
  {
    id: 'ood',
    name: 'Opportunities for Ohioans with Disabilities (OOD)',
    description:
      'OOD is Ohio\'s vocational rehabilitation agency. They help people with disabilities find and keep meaningful jobs through training, coaching, and employer partnerships.',
    services: [
      'Vocational rehabilitation services',
      'Job placement and coaching',
      'Assistive technology',
      'Disability determination for Social Security',
    ],
    phone: '1-800-282-4536',
    website: 'https://ood.ohio.gov',
    servesArea: 'Statewide (Ohio)',
    relevantPrograms: ['oh-ssi', 'oh-ssdi', 'oh-vocational-rehab'],
    servicesOffered: ['employment', 'job-training', 'disability-determination'],
  },
  {
    id: 'the-arc-ohio',
    name: 'The Arc of Ohio',
    description:
      'The Arc of Ohio advocates for people with intellectual and developmental disabilities and their families. They provide information, referrals, and support statewide.',
    services: [
      'Disability rights advocacy',
      'Information and referral',
      'Family support',
      'Legislative advocacy',
    ],
    phone: '1-614-487-4720',
    website: 'https://thearcofohio.org',
    servesArea: 'Statewide (Ohio)',
    relevantPrograms: ['oh-medicaid', 'oh-ssi', 'oh-snap'],
    servicesOffered: ['advocacy', 'benefits-navigation', 'family-support'],
  },
];
