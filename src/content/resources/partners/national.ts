import { PartnerOrganization } from '../types';

export const nationalPartners: PartnerOrganization[] = [
  {
    id: 'ssa',
    name: 'Social Security Administration',
    description:
      'The Social Security Administration processes SSI and SSDI applications. You can apply online or visit a local office for help.',
    extendedDescription:
      'The Social Security Administration (SSA) is the federal agency that administers Supplemental Security Income (SSI) and Social Security Disability Insurance (SSDI) programs. These programs provide monthly cash benefits to people with disabilities who meet specific eligibility criteria. SSI is for people with limited income and resources, while SSDI is based on work history and Social Security contributions.\n\nYou can apply for SSI or SSDI online at ssa.gov, by phone, or by visiting your local Social Security office. The application process involves providing medical records, work history, and financial information. SSA will review your application and determine whether you meet the disability criteria.',
    services: [
      'SSI and SSDI application processing',
      'Disability determination',
      'Benefit verification letters',
      'Medicare enrollment',
    ],
    phone: '1-800-772-1213',
    website: 'https://www.ssa.gov',
    servesArea: 'Nationwide',
    hours: 'Monday-Friday 9:00 AM - 4:00 PM local time',
    relevantPrograms: ['federal-ssi', 'federal-ssdi'],
    servicesOffered: ['application-assistance', 'disability-determination'],
  },
  {
    id: 'the-arc',
    name: 'The Arc',
    description:
      'The Arc is the largest national community-based organization for people with intellectual and developmental disabilities. They have state and local chapters across the country that provide advocacy, support, and services.',
    services: [
      'Disability rights advocacy',
      'Benefits assistance',
      'Family support programs',
      'Community inclusion',
      'Employment services',
    ],
    phone: '1-800-433-5255',
    website: 'https://thearc.org',
    servesArea: 'Nationwide (with state and local chapters)',
    relevantPrograms: ['federal-ssi', 'federal-ssdi', 'federal-snap'],
    servicesOffered: ['advocacy', 'benefits-navigation', 'family-support'],
  },
  {
    id: 'ndrn',
    name: 'National Disability Rights Network',
    description:
      'NDRN connects you with your state\'s Protection & Advocacy agency. These agencies provide free legal help for people with disabilities, including help with benefit denials and appeals.',
    services: [
      'Legal advocacy for disability rights',
      'Help with benefit denials and appeals',
      'Protection from abuse and neglect',
      'Access to services and supports',
    ],
    phone: '1-202-408-9514',
    website: 'https://www.ndrn.org',
    servesArea: 'Nationwide (through state P&A agencies)',
    relevantPrograms: ['federal-ssi', 'federal-ssdi'],
    servicesOffered: ['advocacy', 'benefits-navigation'],
  },
  {
    id: 'autism-society',
    name: 'Autism Society of America',
    description:
      'The Autism Society provides information, support, and advocacy for people with autism and their families. They have local chapters that offer programs and connect families with resources.',
    services: [
      'Information and referral',
      'Support groups',
      'Advocacy',
      'Education and awareness',
      'Local chapter programs',
    ],
    phone: '1-800-328-8476',
    website: 'https://autismsociety.org',
    servesArea: 'Nationwide (with local chapters)',
    relevantPrograms: ['federal-ssi', 'federal-ssdi'],
    servicesOffered: ['family-support', 'advocacy', 'education'],
  },
  {
    id: 'united-way-211',
    name: 'United Way 211',
    description:
      'Dial 2-1-1 to connect with local resources for food, housing, health care, childcare, and more. Available 24/7 in most areas with multilingual support.',
    services: [
      'Referral to local services',
      'Crisis support',
      'Housing assistance referrals',
      'Food assistance referrals',
      'Health care referrals',
    ],
    phone: '211',
    website: 'https://www.211.org',
    servesArea: 'Nationwide',
    relevantPrograms: ['federal-ssi', 'federal-snap', 'federal-housing-choice-voucher'],
    servicesOffered: ['benefits-navigation', 'family-support'],
  },
  {
    id: 'nami',
    name: 'NAMI (National Alliance on Mental Illness)',
    description:
      'NAMI provides support, education, and advocacy for people affected by mental illness. They have local chapters with support groups and programs across the country.',
    services: [
      'Support groups for families',
      'Mental health education programs',
      'Crisis support and referrals',
      'Advocacy for mental health services',
    ],
    phone: '1-800-950-6264',
    website: 'https://www.nami.org',
    servesArea: 'Nationwide (with state and local chapters)',
    relevantPrograms: ['federal-ssi', 'federal-ssdi'],
    servicesOffered: ['family-support', 'peer-support', 'advocacy'],
  },
  {
    id: 'easter-seals',
    name: 'Easterseals',
    description:
      'Easterseals provides services for people with disabilities and their families, including early intervention, employment, and community programs. Services vary by location.',
    services: [
      'Early intervention services',
      'Employment and job training',
      'Day programs and activities',
      'Therapy services',
      'Assistive technology',
    ],
    phone: '1-800-221-6827',
    website: 'https://www.easterseals.com',
    servesArea: 'Nationwide (with local affiliates)',
    relevantPrograms: ['federal-ssi', 'federal-vocational-rehab', 'federal-supported-employment'],
    servicesOffered: ['employment', 'family-support', 'community-integration'],
  },
  {
    id: 'goodwill',
    name: 'Goodwill Industries',
    description:
      'Goodwill provides job training, employment services, and community programs for people with disabilities. They help people build skills and find meaningful employment.',
    services: [
      'Job training programs',
      'Employment placement',
      'Career counseling',
      'Computer skills training',
      'Financial literacy education',
    ],
    phone: '1-800-466-3945',
    website: 'https://www.goodwill.org',
    servesArea: 'Nationwide (with local organizations)',
    relevantPrograms: ['federal-vocational-rehab', 'federal-supported-employment'],
    servicesOffered: ['employment', 'job-training'],
  },
];
