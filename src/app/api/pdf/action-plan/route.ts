import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { ActionPlanDocument } from '@/components/pdf/ActionPlanDocument';
import { EnrichedResult, BenefitInteraction } from '@/lib/results/types';
import { withAuditLog } from '@/lib/audit/middleware';

interface RequestBody {
  results: EnrichedResult[];
  interactions: BenefitInteraction[];
}

/**
 * POST /api/pdf/action-plan
 *
 * Generates a PDF action plan from screening results
 *
 * Security:
 * - POST method (results data in body, not URL)
 * - No caching (PHI)
 * - Audit logged
 *
 * @returns PDF file stream with Content-Disposition: attachment
 */
async function handler(request: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await request.json();
    const { results, interactions } = body;

    // Validate required data
    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: results array is required' },
        { status: 400 }
      );
    }

    // Generate PDF
    const generatedAt = new Date().toISOString();
    const stream = await renderToStream(
      ActionPlanDocument({
        results,
        interactions: interactions || [],
        generatedAt,
      })
    );

    // Convert Node.js ReadableStream to Web ReadableStream
    const webStream = new ReadableStream({
      async start(controller) {
        stream.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        stream.on('end', () => {
          controller.close();
        });
        stream.on('error', (err) => {
          controller.error(err);
        });
      },
    });

    // Return PDF with proper headers
    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="benefit-action-plan.pdf"',
        'Cache-Control': 'no-store', // Don't cache PHI
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Unable to generate PDF. Please try again.' },
      { status: 500 }
    );
  }
}

// Wrap with audit logging for HIPAA compliance
export const POST = withAuditLog(handler);
