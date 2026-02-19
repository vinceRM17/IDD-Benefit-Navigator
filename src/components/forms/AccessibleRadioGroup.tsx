'use client';

import React from 'react';
import { FormError } from './FormError';

interface RadioOption {
  value: string;
  label: string;
}

interface AccessibleRadioGroupProps {
  name: string;
  legend: string;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

export function AccessibleRadioGroup({
  name,
  legend,
  options,
  required = false,
  error,
  value,
  onChange,
}: AccessibleRadioGroupProps) {
  const errorId = `${name}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="font-medium text-foreground mb-2">
        {legend}
        {required && (
          <span aria-label="required" className="text-destructive ml-1">
            *
          </span>
        )}
      </legend>

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-colors ${
              value === option.value
                ? 'border-primary bg-primary/5'
                : 'border-input hover:border-primary/40'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              aria-required={required}
              className="w-4 h-4 text-primary accent-primary focus:ring-2 focus:ring-ring"
            />
            <span className="text-foreground">{option.label}</span>
          </label>
        ))}
      </div>

      <FormError id={errorId} message={error} />
    </fieldset>
  );
}
