/**
 * Canonical list of all 50 US states + DC with coverage level
 */

import type { CoverageLevel } from '@/lib/rules/types';

export interface USState {
  code: string;
  name: string;
  coverageLevel: CoverageLevel;
}

export const US_STATES: USState[] = [
  { code: 'AL', name: 'Alabama', coverageLevel: 'federal-only' },
  { code: 'AK', name: 'Alaska', coverageLevel: 'federal-only' },
  { code: 'AZ', name: 'Arizona', coverageLevel: 'federal-only' },
  { code: 'AR', name: 'Arkansas', coverageLevel: 'federal-only' },
  { code: 'CA', name: 'California', coverageLevel: 'federal-only' },
  { code: 'CO', name: 'Colorado', coverageLevel: 'federal-only' },
  { code: 'CT', name: 'Connecticut', coverageLevel: 'federal-only' },
  { code: 'DE', name: 'Delaware', coverageLevel: 'federal-only' },
  { code: 'DC', name: 'District of Columbia', coverageLevel: 'federal-only' },
  { code: 'FL', name: 'Florida', coverageLevel: 'federal-only' },
  { code: 'GA', name: 'Georgia', coverageLevel: 'federal-only' },
  { code: 'HI', name: 'Hawaii', coverageLevel: 'federal-only' },
  { code: 'ID', name: 'Idaho', coverageLevel: 'federal-only' },
  { code: 'IL', name: 'Illinois', coverageLevel: 'federal-only' },
  { code: 'IN', name: 'Indiana', coverageLevel: 'federal-only' },
  { code: 'IA', name: 'Iowa', coverageLevel: 'federal-only' },
  { code: 'KS', name: 'Kansas', coverageLevel: 'federal-only' },
  { code: 'KY', name: 'Kentucky', coverageLevel: 'full' },
  { code: 'LA', name: 'Louisiana', coverageLevel: 'federal-only' },
  { code: 'ME', name: 'Maine', coverageLevel: 'federal-only' },
  { code: 'MD', name: 'Maryland', coverageLevel: 'federal-only' },
  { code: 'MA', name: 'Massachusetts', coverageLevel: 'federal-only' },
  { code: 'MI', name: 'Michigan', coverageLevel: 'federal-only' },
  { code: 'MN', name: 'Minnesota', coverageLevel: 'federal-only' },
  { code: 'MS', name: 'Mississippi', coverageLevel: 'federal-only' },
  { code: 'MO', name: 'Missouri', coverageLevel: 'federal-only' },
  { code: 'MT', name: 'Montana', coverageLevel: 'federal-only' },
  { code: 'NE', name: 'Nebraska', coverageLevel: 'federal-only' },
  { code: 'NV', name: 'Nevada', coverageLevel: 'federal-only' },
  { code: 'NH', name: 'New Hampshire', coverageLevel: 'federal-only' },
  { code: 'NJ', name: 'New Jersey', coverageLevel: 'federal-only' },
  { code: 'NM', name: 'New Mexico', coverageLevel: 'federal-only' },
  { code: 'NY', name: 'New York', coverageLevel: 'federal-only' },
  { code: 'NC', name: 'North Carolina', coverageLevel: 'federal-only' },
  { code: 'ND', name: 'North Dakota', coverageLevel: 'federal-only' },
  { code: 'OH', name: 'Ohio', coverageLevel: 'federal-only' },
  { code: 'OK', name: 'Oklahoma', coverageLevel: 'federal-only' },
  { code: 'OR', name: 'Oregon', coverageLevel: 'federal-only' },
  { code: 'PA', name: 'Pennsylvania', coverageLevel: 'federal-only' },
  { code: 'RI', name: 'Rhode Island', coverageLevel: 'federal-only' },
  { code: 'SC', name: 'South Carolina', coverageLevel: 'federal-only' },
  { code: 'SD', name: 'South Dakota', coverageLevel: 'federal-only' },
  { code: 'TN', name: 'Tennessee', coverageLevel: 'federal-only' },
  { code: 'TX', name: 'Texas', coverageLevel: 'federal-only' },
  { code: 'UT', name: 'Utah', coverageLevel: 'federal-only' },
  { code: 'VT', name: 'Vermont', coverageLevel: 'federal-only' },
  { code: 'VA', name: 'Virginia', coverageLevel: 'federal-only' },
  { code: 'WA', name: 'Washington', coverageLevel: 'federal-only' },
  { code: 'WV', name: 'West Virginia', coverageLevel: 'federal-only' },
  { code: 'WI', name: 'Wisconsin', coverageLevel: 'federal-only' },
  { code: 'WY', name: 'Wyoming', coverageLevel: 'federal-only' },
];

/** All valid state codes */
export const STATE_CODES = US_STATES.map(s => s.code) as [string, ...string[]];

/** Get state info by code */
export function getStateByCode(code: string): USState | undefined {
  return US_STATES.find(s => s.code === code);
}

/** Get state name by code */
export function getStateName(code: string): string {
  return getStateByCode(code)?.name ?? code;
}

/** Get coverage level by state code */
export function getCoverageLevel(code: string): CoverageLevel {
  return getStateByCode(code)?.coverageLevel ?? 'federal-only';
}

/** Get states with full coverage */
export function getFullCoverageStates(): USState[] {
  return US_STATES.filter(s => s.coverageLevel === 'full');
}

/** Get coverage summary stats */
export function getCoverageSummary(): { total: number; full: number; federalOnly: number } {
  const full = US_STATES.filter(s => s.coverageLevel === 'full').length;
  return {
    total: US_STATES.length,
    full,
    federalOnly: US_STATES.length - full,
  };
}
