export interface FAQEntry {
  question: string;
  answer: string;
  category: 'eligibility' | 'application' | 'general' | 'privacy';
}

export const faqEntries: FAQEntry[] = [
  { category: 'general', question: 'What is the IDD Benefits Navigator?', answer: 'The IDD Benefits Navigator is a free tool that helps families of people with intellectual and developmental disabilities understand which benefit programs they may qualify for. It asks a few questions about your family and gives you personalized results with step-by-step guidance.' },
  { category: 'general', question: 'Is this tool really free?', answer: 'Yes, the IDD Benefits Navigator is completely free. You do not need to create an account, pay anything, or provide personal information like your name or Social Security number.' },
  { category: 'privacy', question: 'Is my information safe?', answer: 'Yes. We do not collect your name, address, or Social Security number. Your screening answers are stored only in your browser and are not sent to any third parties. You can clear all your data at any time.' },
  { category: 'privacy', question: 'Do you sell my data?', answer: 'No. We never sell, share, or give your information to anyone. Your privacy is very important to us.' },
  { category: 'eligibility', question: 'Does this tool determine my eligibility?', answer: 'No. This tool gives you an estimate of which programs you may qualify for based on general eligibility rules. Only the program administrators (like Social Security, Medicaid, or your state benefits office) can make official eligibility decisions.' },
  { category: 'eligibility', question: 'What does "likely eligible" mean?', answer: 'Likely eligible means that based on what you told us, you appear to meet the main requirements for this program. However, the actual program may have additional requirements we did not ask about. We recommend applying to find out for sure.' },
  { category: 'eligibility', question: 'What does "may be eligible" mean?', answer: 'May be eligible means you could qualify for this program, but we need more information than our screening provides. We recommend contacting the program directly to learn more about your specific situation.' },
  { category: 'application', question: 'How do I apply for these programs?', answer: 'Each program has its own application process. Your results page includes specific next steps and application links for each program you may qualify for. Many programs let you apply online, by phone, or in person.' },
  { category: 'application', question: 'Can I apply for multiple programs at once?', answer: 'In many states, you can apply for Medicaid and SNAP at the same time through your state benefits portal. SSI and SSDI are separate applications through Social Security. Waiver programs typically require a separate application process.' },
  { category: 'application', question: 'What if my application is denied?', answer: 'If your application is denied, you usually have the right to appeal. The denial letter will explain how to appeal and the deadline. Many of the partner organizations listed in our Resources section can help you with appeals for free.' },
  { category: 'general', question: 'What states does this tool cover?', answer: 'The IDD Benefits Navigator works in all 50 states. Federal programs like SSI, SSDI, and SNAP are available nationwide. Some states have additional state-specific programs with detailed local information.' },
  { category: 'eligibility', question: 'My family member is a child. Can we still use this tool?', answer: 'Yes. Many programs serve children with disabilities, including SSI, Medicaid, IDEA/Special Education, and childcare assistance. The tool will ask about age and provide results appropriate for your family member.' },
];

export function getFAQByCategory(): Record<string, FAQEntry[]> {
  const grouped: Record<string, FAQEntry[]> = {};
  for (const entry of faqEntries) {
    if (!grouped[entry.category]) grouped[entry.category] = [];
    grouped[entry.category].push(entry);
  }
  return grouped;
}

const categoryLabels: Record<string, string> = {
  eligibility: 'Eligibility Questions',
  application: 'Application Questions',
  general: 'General Questions',
  privacy: 'Privacy & Security',
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}
