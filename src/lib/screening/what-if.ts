/**
 * Client-side "what if" income scenario comparison
 * Compares program eligibility at different income levels against program limits
 */

import type { EnrichedResult } from '@/lib/results/types';

export interface WhatIfResult {
  gained: string[];
  lost: string[];
  unchanged: string[];
}

interface ProgramIncomeThreshold {
  programId: string;
  programName: string;
  incomeLimit: number | null;
  requiresDisability: boolean;
}

/**
 * Extract income thresholds from current results
 * Programs without income-based eligibility get null limits
 */
export function extractThresholds(
  programs: EnrichedResult[],
  incomeLimits: Record<string, Record<number, number>>,
  householdSize: number
): ProgramIncomeThreshold[] {
  return programs.map((p) => {
    // Check if program has an income-based condition by looking at enrichment reasons
    let incomeLimit: number | null = null;

    if (p.reasons) {
      for (const reason of p.reasons) {
        // Check for income limit references in reasons
        for (const [limitKey, limits] of Object.entries(incomeLimits)) {
          const sizeKey = String(Math.min(householdSize, 8));
          if (limits[Number(sizeKey)] !== undefined) {
            // Check if this program uses this income limit
            const reasonLower = reason.toLowerCase();
            const limitKeyLower = limitKey.toLowerCase();
            if (
              limitKeyLower.includes(p.content.name.toLowerCase().replace(/\s+/g, '')) ||
              limitKeyLower.includes(p.programId.split('-').pop() || '')
            ) {
              incomeLimit = limits[Number(sizeKey)];
            }
          }
        }
      }
    }

    return {
      programId: p.programId,
      programName: p.content.name,
      incomeLimit,
      requiresDisability: p.reasons?.some(
        (r) =>
          r.toLowerCase().includes('disability') ||
          r.toLowerCase().includes('idd')
      ) ?? false,
    };
  });
}

/**
 * Compare eligibility at a new income level vs. current income
 */
export function compareEligibility(
  programs: EnrichedResult[],
  currentIncome: number,
  newIncome: number,
  incomeLimits: Record<string, Record<number, number>>,
  householdSize: number
): WhatIfResult {
  const gained: string[] = [];
  const lost: string[] = [];
  const unchanged: string[] = [];

  const thresholds = extractThresholds(programs, incomeLimits, householdSize);

  for (const threshold of thresholds) {
    if (threshold.incomeLimit === null) {
      // Non-income-based program — unchanged
      unchanged.push(threshold.programName);
      continue;
    }

    const currentEligible = currentIncome <= threshold.incomeLimit;
    const newEligible = newIncome <= threshold.incomeLimit;

    if (currentEligible && !newEligible) {
      lost.push(threshold.programName);
    } else if (!currentEligible && newEligible) {
      gained.push(threshold.programName);
    } else {
      unchanged.push(threshold.programName);
    }
  }

  return { gained, lost, unchanged };
}

/**
 * Simple comparison using program eligibility from results
 * More reliable approach: just compares which programs have income conditions
 */
export function simpleCompareEligibility(
  programs: EnrichedResult[],
  currentIncome: number,
  newIncome: number
): WhatIfResult {
  const gained: string[] = [];
  const lost: string[] = [];
  const unchanged: string[] = [];

  for (const program of programs) {
    const hasIncomeCondition = program.reasons?.some(
      (r) =>
        r.toLowerCase().includes('income') ||
        r.toLowerCase().includes('snap limit') ||
        r.toLowerCase().includes('medicaid limit')
    );

    if (!hasIncomeCondition) {
      unchanged.push(program.content.name);
      continue;
    }

    const wasEligible =
      program.confidence === 'likely' || program.confidence === 'possible';

    // Simple heuristic: if income goes up and program was income-based eligible
    if (newIncome > currentIncome && wasEligible) {
      // Might lose eligibility at significantly higher income
      if (newIncome > currentIncome * 1.5) {
        lost.push(program.content.name);
      } else {
        unchanged.push(program.content.name);
      }
    } else if (newIncome < currentIncome && !wasEligible) {
      // Lower income might gain income-based programs
      if (newIncome < currentIncome * 0.5) {
        gained.push(program.content.name);
      } else {
        unchanged.push(program.content.name);
      }
    } else {
      unchanged.push(program.content.name);
    }
  }

  return { gained, lost, unchanged };
}
