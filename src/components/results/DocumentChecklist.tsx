/**
 * Document Checklist Component
 * Interactive checklist for required documents
 * Uses client-side state for user convenience (not persisted)
 * WCAG compliant with proper checkbox labels and fieldset/legend pattern
 */

'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('results.documents');

  const handleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (documents.length === 0) {
    return null;
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="bg-muted rounded-lg p-4 border border-border">
      <fieldset>
        <legend className="font-heading font-semibold text-foreground mb-1 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          {t('documentsFor', { programName })}
        </legend>
        <p className="text-xs text-muted-foreground mb-3">
          {t('gathered', { checked: checkedCount, total: documents.length })}
        </p>

        <div className="space-y-2">
          {documents.map((document, index) => (
            <div key={index} className="flex items-start gap-3">
              <input
                type="checkbox"
                id={`doc-${programName}-${index}`}
                checked={checkedItems[index] || false}
                onChange={() => handleCheck(index)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring accent-primary"
              />
              <label
                htmlFor={`doc-${programName}-${index}`}
                className={`text-sm ${
                  checkedItems[index] ? 'text-muted-foreground line-through' : 'text-foreground'
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
