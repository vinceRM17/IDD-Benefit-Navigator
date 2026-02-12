/**
 * Prompt scaffolding for AI personalization
 *
 * Enforces strict grounding in expert-curated content while adapting tone
 * and examples to family-specific context.
 */

import { getAnthropicClient } from './client';

/**
 * Family context for AI personalization
 *
 * Derived from screening form data to provide context-specific examples
 * and tone without modifying eligibility rules.
 */
export interface FamilyContext {
  householdSize: number;
  monthlyIncome: number;
  hasDisabilityDiagnosis: boolean;
  age: number;
  hasInsurance: boolean;
  insuranceType?: string;
  receivesSSI?: boolean;
  receivesSNAP?: boolean;
  state: string;
}

/**
 * Parameters for personalized explanation generation
 */
export interface PersonalizationParams {
  programName: string;
  expertDescription: string;
  expertNextSteps: string[];
  whatItCovers: string[];
  familyContext: FamilyContext;
}

/**
 * Convert family context to human-readable summary
 *
 * Transforms structured screening data into narrative form for AI context.
 */
export function buildContextSummary(context: FamilyContext): string {
  const parts: string[] = [];

  // Household composition
  parts.push(`Family of ${context.householdSize} in ${context.state}`);

  // Income situation
  const monthlyFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(context.monthlyIncome);
  parts.push(`with a monthly income of ${monthlyFormatted}`);

  // Child with disability
  if (context.hasDisabilityDiagnosis) {
    parts.push(
      `Family member aged ${context.age} with an intellectual or developmental disability diagnosis`
    );
  } else {
    parts.push(`Family member aged ${context.age}`);
  }

  // Current benefits
  const benefits: string[] = [];
  if (context.receivesSSI) benefits.push('SSI');
  if (context.receivesSNAP) benefits.push('SNAP');
  if (benefits.length > 0) {
    parts.push(`Currently receives ${benefits.join(' and ')}`);
  }

  // Insurance status
  if (context.hasInsurance && context.insuranceType) {
    const insuranceDescriptions: Record<string, string> = {
      employer: 'employer-provided health insurance',
      marketplace: 'marketplace health insurance',
      none: 'no health insurance currently',
    };
    parts.push(
      `Currently has ${insuranceDescriptions[context.insuranceType] || 'health insurance'}`
    );
  } else if (!context.hasInsurance) {
    parts.push('Currently has no health insurance');
  }

  return parts.join('. ') + '.';
}

/**
 * Generate personalized explanation using Claude API
 *
 * Calls Anthropic Claude with strict system prompt that prevents hallucination
 * of eligibility criteria. Returns null on any error or if API is unavailable.
 *
 * @param params - Program content and family context
 * @returns Personalized explanation or null on failure
 */
export async function personalizeExplanation(
  params: PersonalizationParams
): Promise<string | null> {
  const client = getAnthropicClient();

  if (!client) {
    // API key not configured - silently fail
    return null;
  }

  try {
    const contextSummary = buildContextSummary(params.familyContext);

    const systemPrompt = `You are an expert at explaining government benefits to families with children with disabilities. Your role is to make expert-curated content more personal and easier to understand.

CRITICAL RULES - DO NOT VIOLATE:

1. Use 6th grade reading level language - short sentences, common words
2. Be warm and encouraging, never bureaucratic
3. Ground ALL explanations in the expert content provided - do NOT add any eligibility criteria, income thresholds, or requirements not explicitly stated
4. NEVER add eligibility criteria not in expert content
5. Personalize tone and examples to family context, NOT eligibility rules
6. Address the reader as "you" and "your family"
7. Use person-first language (e.g., "your child with a disability" not "your disabled child")
8. If uncertain, defer to expert content verbatim
9. Keep response under 200 words
10. Do NOT use markdown formatting - plain text only

Your job: Rewrite the expert explanation in warm, personalized language. Reference specific family details (household size, income, child's age) to make it relevant. Keep all eligibility facts identical. Only adapt tone, examples, and encouragement.`;

    const userMessage = `Expert explanation of ${params.programName}:
${params.expertDescription}

What this program covers:
${params.whatItCovers.join('\n')}

Next steps to apply:
${params.expertNextSteps.join('\n')}

Family context:
${contextSummary}

Task: Rewrite the expert explanation in warm, personalized language that speaks directly to this family's situation. Reference their specific details (household size, children's ages, income situation) to make the explanation feel relevant. Keep all eligibility facts identical. Only adapt tone, examples, and encouragement.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      console.warn('[AI] No text content in Claude response');
      return null;
    }

    return textContent.text;
  } catch (error) {
    // Log error but never throw - graceful degradation
    console.error('[AI] Failed to generate personalized explanation:', error);
    return null;
  }
}
