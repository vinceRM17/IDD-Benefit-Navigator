/**
 * Resource directory types for partner organizations and application portals
 *
 * Helps families connect with organizations that can assist with applications
 * and access official portals for benefit programs.
 */

export interface PartnerOrganization {
  /** Unique identifier for the organization */
  id: string;

  /** Organization name */
  name: string;

  /** Plain language description of what they do and how they help */
  description: string;

  /** List of services provided */
  services: string[];

  /** Contact phone number */
  phone: string;

  /** Email address (if available) */
  email?: string;

  /** Website URL */
  website: string;

  /** Physical address (if available) */
  address?: string;

  /** Geographic coverage area (e.g., "Statewide", "Louisville Metro") */
  servesArea: string;

  /** Program IDs they can help with */
  relevantPrograms: string[];

  /** Specific service categories offered */
  servicesOffered?: string[];
}

export interface ApplicationPortal {
  /** Unique identifier for the portal */
  id: string;

  /** Portal name */
  name: string;

  /** Plain language description of what you can do on this portal */
  description: string;

  /** Portal URL */
  url: string;

  /** Program IDs that can be applied for through this portal */
  programIds: string[];

  /** Additional notes (e.g., "You'll need to create an account") */
  notes?: string;
}
