/**
 * Program content structure for enriched eligibility results
 * Provides plain-language descriptions, next steps, and required documents
 */

export interface ProgramContent {
  /** Unique identifier matching rules engine programId (e.g., "ky-medicaid") */
  programId: string;

  /** Display name for the program */
  name: string;

  /** Plain language description of what the program is (2-3 sentences, 6th grade reading level) */
  description: string;

  /** Bullet points of what the program covers */
  whatItCovers: string[];

  /** Ordered action steps to apply for the program */
  nextSteps: string[];

  /** Documents needed for application */
  requiredDocuments: string[];

  /** Official portal URL for application */
  applicationUrl: string;

  /** Phone number for application help */
  applicationPhone: string;

  /** Program IDs this program interacts with */
  interactsWith: string[];

  /** Plain language explanation of how this program works with others */
  interactionNotes: string;

  /** Explains primary/secondary insurance structure when private insurance + Medicaid apply (ELIG-06) */
  insuranceCoordination?: string;

  /** Information about waitlists for waiver programs */
  waitlistInfo?: string;

  /** Common misconceptions families have about this program (from therapist input) */
  commonMisconceptions?: string[];

  /** What families can do while waiting for this program (waitlist guidance) */
  whileYouWait?: string[];

  /** Supportive message validating the difficulty of navigating this program */
  encouragement?: string;
}
