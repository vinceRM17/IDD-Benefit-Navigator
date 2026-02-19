/**
 * Action Plan Component
 * Displays ordered list of action steps with numbered circles
 * WCAG compliant with ordered list semantics
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ActionPlanProps {
  steps: string[];
  title?: string;
}

export function ActionPlan({
  steps,
  title = 'Your Action Plan',
}: ActionPlanProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-heading font-semibold text-foreground">{title}</h2>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-foreground/80">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
