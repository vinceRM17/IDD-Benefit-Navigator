'use client';

import React from 'react';
import { FormError } from './FormError';

interface CheckboxOption {
  value: string;
  label: string;
}

interface AccessibleCheckboxGroupProps {
  name: string;
  legend: string;
  options: CheckboxOption[];
  required?: boolean;
  helpText?: string;
  error?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export function AccessibleCheckboxGroup({
  name,
  legend,
  options,
  required = false,
  helpText,
  error,
  value,
  onChange,
}: AccessibleCheckboxGroupProps) {
  const errorId = `${name}-error`;
  const describedBy = error ? errorId : undefined;

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="font-medium text-foreground mb-1">
        {legend}
        {required && (
          <span aria-label="required" className="text-destructive ml-1">
            *
          </span>
        )}
      </legend>
      {helpText && (
        <p className="text-sm text-muted-foreground mb-2">{helpText}</p>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-colors ${
              value.includes(option.value)
                ? 'border-primary bg-primary/5'
                : 'border-input hover:border-primary/40'
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="w-4 h-4 text-primary accent-primary focus:ring-2 focus:ring-ring rounded"
            />
            <span className="text-foreground">{option.label}</span>
          </label>
        ))}
      </div>

      <FormError id={errorId} message={error} />
    </fieldset>
  );
}
