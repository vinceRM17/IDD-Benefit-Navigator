/**
 * IDD Person-First Language Guide
 *
 * Default to person-first language in all user-facing content.
 * When referring to specific individuals, use their stated preference.
 *
 * Sources:
 * - https://guides.library.duq.edu/idd/language
 * - https://www.theautismclinic.org/hope-terminology-for-individuals-with-id-dd/
 * - Rosa's Law (2010) - replaced "mental retardation" with "intellectual disability"
 */

export const terminology = {
  /**
   * Preferred person-first terms
   */
  preferred: {
    'person with intellectual disability':
      'NOT: intellectually disabled person',
    'person with developmental disability':
      'NOT: developmentally disabled person',
    'person with autism':
      'NOT: autistic person (unless individual prefers identity-first)',
    'person who receives services': 'NOT: patient, client',
    'family member': 'NOT: caregiver (implies burden)',
    'has [condition]': 'NOT: suffers from, afflicted with, victim of',
    'uses a wheelchair': 'NOT: confined to a wheelchair, wheelchair-bound',
    'people with intellectual and developmental disabilities':
      'NOT: IDD individuals (puts disability before person)',
  },

  /**
   * Outdated terms to never use
   */
  outdated: {
    'mental retardation':
      'NEVER USE — replaced by "intellectual disability" in 2010',
    handicapped: 'NEVER USE — use "person with a disability"',
    'special needs':
      'AVOID — vague and patronizing, use specific terminology',
    'high/low functioning': 'AVOID — oversimplifies lived experience',
    'the disabled': 'NEVER USE — use "people with disabilities"',
    'wheelchair-bound': 'NEVER USE — use "person who uses a wheelchair"',
  },

  /**
   * Contextual guidance for specific communities
   */
  contextual: {
    autism: {
      personFirst: 'person with autism',
      identityFirst: 'autistic person',
      note: 'Both are acceptable. Many autistic self-advocates prefer identity-first. When in doubt, ask the individual.',
    },
  },

  /**
   * Good and bad examples
   */
  examples: {
    good: [
      'families of people with intellectual and developmental disabilities',
      'benefits for individuals with IDD',
      'person who has a diagnosis of autism',
      'family seeking disability benefits',
      'people with disabilities have the right to live independently',
      'services for people with intellectual disabilities',
    ],
    bad: [
      'IDD families (implies the family has the disability)',
      'the disabled',
      'autistic person suffers from symptoms',
      'special needs child',
      'handicapped parking',
      'wheelchair-bound individual',
    ],
  },
};

/**
 * Content review checklist:
 * - [ ] Person comes before disability in phrasing
 * - [ ] No outdated terms (mental retardation, handicapped, etc.)
 * - [ ] No "suffers from" or "afflicted with" language
 * - [ ] Specific terms used instead of vague "special needs"
 * - [ ] Identity-first language only when individual's preference is known
 * - [ ] "Family member" not "caregiver" unless in clinical context
 * - [ ] "Has" or "diagnosed with" instead of "victim of" or "afflicted with"
 */
