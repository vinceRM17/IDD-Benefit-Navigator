/**
 * Benefit Interactions Component
 * Displays how multiple benefits work together
 * WCAG compliant with proper heading hierarchy
 */

import { BenefitInteraction } from '@/lib/results/types';

interface BenefitInteractionsProps {
  interactions: BenefitInteraction[];
}

export function BenefitInteractions({
  interactions,
}: BenefitInteractionsProps) {
  if (interactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        How Your Benefits Work Together
      </h2>

      <div className="space-y-4">
        {interactions.map((interaction, index) => (
          <div
            key={index}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            {/* Programs involved */}
            <div className="mb-2">
              <span className="text-sm font-medium text-blue-900">
                Programs: {interaction.programs.join(' + ')}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3">{interaction.description}</p>

            {/* Recommendation */}
            <div className="pt-3 border-t border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                What to do: {interaction.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
