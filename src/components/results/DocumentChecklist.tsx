/**
 * Document Checklist Component
 * Interactive checklist for required documents
 * Uses client-side state for user convenience (not persisted)
 * WCAG compliant with proper checkbox labels and fieldset/legend pattern
 */

'use client';

import { useState } from 'react';

interface DocumentChecklistProps {
  documents: string[];
  programName: string;
}

export function DocumentChecklist({
  documents,
  programName,
}: DocumentChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
    {}
  );

  const handleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <fieldset>
        <legend className="font-semibold text-gray-900 mb-3">
          Documents You&apos;ll Need for {programName}
        </legend>

        <div className="space-y-2">
          {documents.map((document, index) => (
            <div key={index} className="flex items-start gap-3">
              <input
                type="checkbox"
                id={`doc-${programName}-${index}`}
                checked={checkedItems[index] || false}
                onChange={() => handleCheck(index)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`doc-${programName}-${index}`}
                className={`text-sm ${
                  checkedItems[index] ? 'text-gray-500 line-through' : 'text-gray-700'
                }`}
              >
                {document}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
