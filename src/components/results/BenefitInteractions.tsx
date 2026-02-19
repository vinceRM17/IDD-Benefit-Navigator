/**
 * Benefit Interactions Component
 * Displays how multiple benefits work together
 * WCAG compliant with proper heading hierarchy
 */

import { BenefitInteraction } from '@/lib/results/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRightLeft } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          How Your Benefits Work Together
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {interactions.map((interaction, index) => (
          <div
            key={index}
            className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
          >
            {/* Programs involved */}
            <div className="mb-2 flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {interaction.programs.join(' + ')}
              </span>
            </div>

            {/* Description */}
            <p className="text-foreground/80 mb-3">{interaction.description}</p>

            {/* Recommendation */}
            <Separator className="mb-3" />
            <p className="text-sm font-medium text-primary">
              What to do: {interaction.recommendation}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
