import { NextRequest, NextResponse } from 'next/server';
import { withAuditLog } from '@/lib/audit/middleware';
import { personalizeExplanation, PersonalizationParams } from '@/lib/ai/prompts';
import { shouldShowAIExplanation } from '@/lib/ai/fallback';

/**
 * POST /api/ai/explain
 *
 * Generates personalized AI explanation for a benefit program.
 * Returns null if AI unavailable or response fails safety checks.
 *
 * Request body: PersonalizationParams (program content + family context)
 * Response: { explanation: string | null }
 */
async function explainHandler(request: NextRequest): Promise<NextResponse> {
  let body: Partial<PersonalizationParams>;

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
  const requiredFields: Array<keyof PersonalizationParams> = [
    'programName',
    'expertDescription',
    'expertNextSteps',
    'whatItCovers',
    'familyContext',
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

  const params = body as PersonalizationParams;

  try {
    // Generate personalized explanation
    const aiResponse = await personalizeExplanation(params);

    // Check if response passes safety checks
    if (shouldShowAIExplanation(aiResponse)) {
      // Return successful personalization
      // Note: Do NOT include sensitive family data in response
      return NextResponse.json(
        { explanation: aiResponse },
        { status: 200 }
      );
    } else {
      // AI unavailable or response failed checks - return null
      // Client will silently omit AI section, showing only expert content
      return NextResponse.json(
        { explanation: null },
        { status: 200 }
      );
    }
  } catch (error) {
    // Log error but don't leak internals to client
    console.error('[AI] Explanation generation error:', error);

    // Return null for graceful degradation
    return NextResponse.json(
      { explanation: null },
      { status: 200 }
    );
  }
}

// Export with audit logging for HIPAA compliance
export const POST = withAuditLog(explainHandler);
