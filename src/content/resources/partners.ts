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
    extendedDescription:
      'The Kentucky Association for Individuals with Autism (KAIA) is a statewide organization dedicated to supporting people with autism and their families. Our team provides expert guidance on navigating Kentucky\'s complex benefits system, including Medicaid, waiver programs, SSI, and SNAP. We understand that applying for benefits can feel overwhelming, especially for families in crisis. Our staff offers one-on-one consultations to help you understand which programs your family qualifies for and walk you through each step of the application process.\n\nKAIA also provides autism-specific resources, educational workshops, and family support groups across Kentucky. Whether you\'re just starting to explore benefits or need help with a renewal, our team is here to support families of people with autism and other developmental disabilities. All our services are free of charge.',
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
    hours: 'Monday-Friday 8:00 AM - 4:30 PM EST',
    relevantPrograms: [
      'ky-medicaid',
      'ky-michelle-p-waiver',
      'ky-hcb-waiver',
      'ky-scl-waiver',
      'ky-ssi',
      'ky-ssdi',
      'ky-snap',
    ],
    servicesOffered: ['benefits-navigation', 'advocacy', 'family-support', 'education'],
  },
  {
    id: 'southwest-cil',
    name: 'Southwest Center for Independent Living',
    description:
      'The Southwest Center helps people with disabilities live independently. They assist with benefit applications, home modifications, and community resources.',
    extendedDescription:
      'The Southwest Center for Independent Living is a consumer-controlled, community-based organization serving people with disabilities in Southwest Kentucky. Our philosophy is simple: people with disabilities have the right to live independently in their communities. We provide a range of services to make that possible, including independent living skills training, benefits counseling, home modification assistance, and peer support.\n\nOur benefits counseling team helps people with intellectual and developmental disabilities navigate Medicaid, waiver programs, SSI, SSDI, and SNAP applications. We take a person-centered approach, working with you to understand your goals and connect you with the benefits and services that support your independence. Whether you need help filling out an application, gathering required documentation, or understanding your options, our staff is here to help.',
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
    hours: 'Monday-Friday 8:00 AM - 4:30 PM CST',
    relevantPrograms: [
      'ky-medicaid',
      'ky-michelle-p-waiver',
      'ky-hcb-waiver',
      'ky-scl-waiver',
      'ky-ssi',
      'ky-ssdi',
      'ky-snap',
    ],
    servicesOffered: ['independent-living', 'advocacy', 'assistive-technology'],
  },
  {
    id: 'mattingly-edge',
    name: 'Mattingly Edge',
    description:
      'Mattingly Edge provides employment and community services for people with intellectual and developmental disabilities in the Louisville area.',
    extendedDescription:
      'Mattingly Edge has been supporting people with intellectual and developmental disabilities in the Louisville area for over 50 years. We believe everyone deserves meaningful employment and full participation in their community. Our employment programs provide job training, placement support, and ongoing coaching to help people with IDD succeed in competitive employment. We also offer community integration programs and day services that focus on skill development, social connections, and personal growth.\n\nOur benefits team helps families navigate the waiver application process, including the Michelle P. Waiver, HCB Waiver, and SCL Waiver. We understand how these programs work with employment and can help you understand what services are available. Located in Louisville, we serve families throughout the Metro area and surrounding counties.',
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
    hours: 'Monday-Friday 7:30 AM - 3:30 PM EST',
    relevantPrograms: ['ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver', 'ky-medicaid'],
    servicesOffered: ['employment', 'community-integration', 'job-training'],
  },
  {
    id: 'best-buddies-ky',
    name: 'Best Buddies Kentucky',
    description:
      'Best Buddies creates opportunities for friendship and employment for people with intellectual and developmental disabilities across Kentucky.',
    extendedDescription:
      'Best Buddies Kentucky is part of an international movement creating opportunities for one-to-one friendships, integrated employment, leadership development, and inclusive living for people with intellectual and developmental disabilities. We believe everyone deserves meaningful relationships and the chance to contribute to their community. Our programs are built on the simple idea that friendship and inclusion change lives.\n\nAcross Kentucky, we match people with IDD with peer buddies for one-to-one friendships, provide employment placement and job coaching, and create leadership development opportunities. While we don\'t directly assist with benefits applications, we can help families understand how waiver services support employment and community participation. Our programs are available statewide, with active chapters in Louisville, Lexington, and other communities.',
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
    hours: 'Monday-Friday 9:00 AM - 5:00 PM EST',
    relevantPrograms: ['ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'],
    servicesOffered: ['social-inclusion', 'peer-support', 'community-events'],
  },
  {
    id: 'ky-dcbs',
    name: 'Kentucky Department for Community Based Services (DCBS)',
    description:
      'DCBS administers Medicaid, SNAP, and other public benefits in Kentucky. They process applications and determine eligibility.',
    extendedDescription:
      'The Kentucky Department for Community Based Services (DCBS) is the state agency responsible for administering Medicaid, SNAP, and other public benefit programs. When you apply for Medicaid or SNAP in Kentucky, DCBS processes your application and determines whether you qualify. They also manage waiver program applications, including the Michelle P. Waiver, Home and Community Based Waiver, and Supports for Community Living Waiver.\n\nYou can apply for benefits through the kynect portal (benefind.ky.gov) or by visiting your local DCBS office. If you need help with your application or have questions about your eligibility, you can call their statewide helpline. DCBS also provides ongoing case management for people receiving benefits, helping with renewals and updates when your situation changes. Their services are available to all Kentucky residents.',
    services: [
      'Medicaid and SNAP application processing',
      'Eligibility determination',
      'Case management',
      'Benefit renewals and updates',
    ],
    phone: '1-855-306-8959',
    website: 'https://chfs.ky.gov/agencies/dcbs',
    servesArea: 'Statewide',
    hours: 'Monday-Friday 8:00 AM - 4:30 PM EST, Phone lines open 7:00 AM - 6:00 PM',
    relevantPrograms: ['ky-medicaid', 'ky-snap', 'ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'],
    servicesOffered: ['application-assistance', 'case-management'],
  },
  {
    id: 'ssa-kentucky',
    name: 'Social Security Administration (Kentucky offices)',
    description:
      'The Social Security Administration processes SSI and SSDI applications. You can apply online or visit a local office for help.',
    extendedDescription:
      'The Social Security Administration (SSA) is the federal agency that administers Supplemental Security Income (SSI) and Social Security Disability Insurance (SSDI) programs. These programs provide monthly cash benefits to people with disabilities who meet specific eligibility criteria. SSI is for people with limited income and resources, while SSDI is based on work history and Social Security contributions.\n\nYou can apply for SSI or SSDI online at ssa.gov, by phone, or by visiting your local Social Security office in Kentucky. The application process involves providing medical records, work history, and financial information. SSA will review your application and determine whether you meet the disability criteria. The process can take several months, and many applications are initially denied. If you need help with your application or an appeal, consider working with an advocacy organization that specializes in disability benefits. Social Security offices throughout Kentucky provide in-person assistance.',
    services: [
      'SSI and SSDI application processing',
      'Disability determination',
      'Benefit verification letters',
      'Medicare enrollment',
    ],
    phone: '1-800-772-1213',
    website: 'https://www.ssa.gov',
    servesArea: 'Statewide',
    hours: 'Monday-Friday 9:00 AM - 4:00 PM local time',
    relevantPrograms: ['ky-ssi', 'ky-ssdi'],
    servicesOffered: ['application-assistance', 'disability-determination'],
  },
];
