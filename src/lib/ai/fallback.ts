/**
 * Fallback strategy for AI explanations
 *
 * Determines when to show AI-generated content to users.
 * Returns false if response is missing, empty, or shows signs of hallucination.
 */

/**
 * Check if AI explanation should be shown to user
 *
 * Returns false if:
 * - Response is null (API failure)
 * - Response is empty or only whitespace
 * - Response exceeds 500 words (potential hallucination/verbosity)
 *
 * @param aiResponse - Generated explanation from Claude API
 * @returns true if safe to show, false otherwise
 */
export function shouldShowAIExplanation(aiResponse: string | null): boolean {
  if (!aiResponse) {
    return false;
  }

  const trimmed = aiResponse.trim();

  if (trimmed.length === 0) {
    return false;
  }

  // Check word count - excessive length may indicate hallucination
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount > 500) {
    console.warn(
      `[AI] Response exceeds 500 words (${wordCount} words). Possible hallucination - hiding from user.`
    );
    return false;
  }

  return true;
}
