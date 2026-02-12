/**
 * Action Plan Component
 * Displays ordered list of action steps with numbered circles
 * WCAG compliant with ordered list semantics
 */

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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-4">
            {/* Numbered circle */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {index + 1}
            </div>

            {/* Step text */}
            <div className="flex-1 pt-1">
              <p className="text-gray-700">{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
