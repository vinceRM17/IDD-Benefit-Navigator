/**
 * Template for new state program content files
 *
 * Instructions:
 * 1. Copy this file and rename it (e.g., "ohio-medicaid.ts")
 * 2. Update all fields with state-specific information
 * 3. Register the content in src/content/programs/index.ts
 * 4. Add it to the programContentMap with the appropriate programId key
 *
 * Guidelines:
 * - Write at a 6th grade reading level
 * - Use plain language, no jargon
 * - Keep descriptions to 2-3 sentences
 * - Include encouragement messages
 * - List concrete next steps families can take
 */

import { ProgramContent } from './types';

export const templateContent: ProgramContent = {
  programId: 'xx-program-name', // e.g., "oh-medicaid"
  name: 'Program Name',
  description:
    'A 2-3 sentence plain-language description of what this program does and who it helps. Write at a 6th grade reading level.',
  whatItCovers: [
    'List of specific services or benefits covered',
    'Be concrete and specific',
    'Include the most important items first',
  ],
  nextSteps: [
    'Step 1: Gather documents',
    'Step 2: Where to apply (URL or phone)',
    'Step 3: What to expect after applying',
  ],
  requiredDocuments: [
    'Proof of income',
    'Proof of identity',
    'State-specific requirements',
  ],
  applicationUrl: 'https://example.gov/apply',
  applicationPhone: '1-800-XXX-XXXX',
  interactsWith: ['xx-other-program'], // programIds this interacts with
  interactionNotes:
    'How this program works with other programs the family might qualify for.',
  encouragement:
    'A supportive message validating the difficulty of navigating this program.',
};
