import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { evaluateEligibility } from '@/lib/rules/engine';
import { HouseholdFacts } from '@/lib/rules/types';
import { enrichResults, getBenefitInteractions } from '@/lib/results/action-plan';
import { ScreeningResults } from '@/lib/results/types';
import { withAuditLog } from '@/lib/audit/middleware';
import { createSession, updateSession } from '@/lib/security/session';

/**
 * POST /api/screening/evaluate
 * Evaluates household facts against eligibility rules and returns ranked, enriched results
 */
async function evaluateHandler(request: NextRequest): Promise<NextResponse> {
  let body: Partial<HouseholdFacts>;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid JSON in request body',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }

  // Validate required fields
  const requiredFields: Array<keyof HouseholdFacts> = [
    'state',
    'householdSize',
    'monthlyIncome',
    'hasDisabilityDiagnosis',
    'age',
    'hasInsurance',
  ];

  const missingFields = requiredFields.filter((field) => body[field] === undefined);

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        error: 'Missing required fields',
        missingFields,
        requiredFields,
      },
      { status: 400 }
    );
  }

  const facts = body as HouseholdFacts;

  try {
    // Evaluate eligibility using rules engine
    const rawResults = await evaluateEligibility(facts.state, facts);

    // Enrich results with program content and ranking
    const enriched = enrichResults(rawResults, facts.state);

    // Get benefit interactions (including ELIG-06 insurance coordination)
    const eligibleProgramIds = enriched.map((r) => r.programId);
    const benefitInteractions = getBenefitInteractions(
      eligibleProgramIds,
      facts.hasInsurance
    );

    // Generate unique session ID for results
    const sessionId = randomUUID();

    // Create screening results
    const results: ScreeningResults = {
      sessionId,
      evaluatedAt: new Date().toISOString(),
      state: facts.state,
      programs: enriched,
      benefitInteractions,
    };

    // Store results in session for later PDF generation
    const session = createSession();
    updateSession(session.id, {
      screeningResults: results,
      householdFacts: facts,
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    // Log error but don't leak internals to client
    console.error('Eligibility evaluation error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while evaluating eligibility',
      },
      { status: 500 }
    );
  }
}

// Export with audit logging
export const POST = withAuditLog(evaluateHandler);
