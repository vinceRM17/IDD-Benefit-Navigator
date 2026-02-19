export interface GlossaryEntry {
  term: string;
  definition: string;
  relatedPrograms?: string[];
  seeAlso?: string[];
}

export const glossaryEntries: GlossaryEntry[] = [
  { term: 'SSI', definition: 'Supplemental Security Income — a monthly cash benefit from the federal government for people with disabilities who have limited income and resources.', relatedPrograms: ['federal-ssi'], seeAlso: ['SSDI'] },
  { term: 'SSDI', definition: 'Social Security Disability Insurance — a monthly cash benefit for people who have worked and paid Social Security taxes before becoming disabled.', relatedPrograms: ['federal-ssdi'], seeAlso: ['SSI'] },
  { term: 'SNAP', definition: 'Supplemental Nutrition Assistance Program — a federal program that provides money on an EBT card to help buy food. Sometimes called food stamps.', relatedPrograms: ['federal-snap'], seeAlso: ['EBT'] },
  { term: 'Medicaid', definition: 'A government health insurance program for people with low income. It covers doctor visits, hospital stays, prescriptions, therapy, and other medical care.', relatedPrograms: ['ky-medicaid'], seeAlso: ['Waiver'] },
  { term: 'Waiver', definition: 'A Medicaid waiver program that provides extra services beyond regular Medicaid. These services help people with disabilities live at home or in the community instead of in an institution.', relatedPrograms: ['ky-michelle-p-waiver', 'ky-hcb-waiver', 'ky-scl-waiver'], seeAlso: ['HCB', 'SCL', 'MPW'] },
  { term: 'IDD', definition: 'Intellectual and Developmental Disabilities — a group of conditions that affect how a person learns, communicates, or handles daily activities. These conditions begin before age 22 and are expected to last throughout life.' },
  { term: 'IEP', definition: 'Individualized Education Program — a written plan that describes the special education services a child with a disability will receive at school. Parents are part of the team that creates the IEP.', relatedPrograms: ['federal-idea-services'] },
  { term: 'ABLE Account', definition: 'A special tax-free savings account for people whose disability began before age 26. You can save up to $100,000 without losing SSI or Medicaid benefits.', relatedPrograms: ['federal-able-account'] },
  { term: 'FPL', definition: 'Federal Poverty Level — an income amount set by the government each year. Many benefit programs use the FPL to decide who qualifies. For example, a family of 4 at 100% FPL earns about $31,200 per year.', seeAlso: ['Medicaid', 'SNAP'] },
  { term: 'EBT', definition: 'Electronic Benefits Transfer — a card that works like a debit card. SNAP benefits and some cash assistance are loaded onto this card each month.', seeAlso: ['SNAP'] },
  { term: 'HCB', definition: 'Home and Community Based Waiver — a Medicaid waiver program that provides services to help adults with disabilities live in their home and community.', relatedPrograms: ['ky-hcb-waiver'], seeAlso: ['Waiver', 'SCL', 'MPW'] },
  { term: 'SCL', definition: 'Supports for Community Living Waiver — a comprehensive Medicaid waiver for people with intellectual or developmental disabilities. Provides residential support, day services, and more.', relatedPrograms: ['ky-scl-waiver'], seeAlso: ['Waiver', 'HCB', 'MPW'] },
  { term: 'MPW', definition: 'Michelle P. Waiver — a Kentucky Medicaid waiver named after Michelle P., who advocated for community-based services for people with disabilities. It provides services to help people live independently.', relatedPrograms: ['ky-michelle-p-waiver'], seeAlso: ['Waiver', 'HCB', 'SCL'] },
  { term: 'Vocational Rehabilitation', definition: 'A state program that helps people with disabilities prepare for, find, and keep jobs. Services include job training, coaching, and workplace support at no cost to you.', relatedPrograms: ['federal-vocational-rehab'], seeAlso: ['Supported Employment'] },
  { term: 'Section 8', definition: 'Another name for the Housing Choice Voucher program. It helps families with low income pay for safe, decent housing in the private market.', relatedPrograms: ['federal-housing-choice-voucher'], seeAlso: ['Housing Choice Voucher'] },
  { term: 'CCDF', definition: 'Child Care and Development Fund — a federal program that helps families with low income pay for childcare so parents can work or go to school.', relatedPrograms: ['federal-childcare-assistance'] },
];

export function getGlossaryByLetter(): Record<string, GlossaryEntry[]> {
  const grouped: Record<string, GlossaryEntry[]> = {};
  const sorted = [...glossaryEntries].sort((a, b) => a.term.localeCompare(b.term));
  for (const entry of sorted) {
    const letter = entry.term[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(entry);
  }
  return grouped;
}

export function findGlossaryTerm(term: string): GlossaryEntry | undefined {
  return glossaryEntries.find(e => e.term.toLowerCase() === term.toLowerCase());
}
