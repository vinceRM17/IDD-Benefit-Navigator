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
      <legend className="font-medium text-gray-900 mb-2">
        {legend}
        {required && (
          <span aria-label="required" className="text-red-700 ml-1">
            *
          </span>
        )}
      </legend>

      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              aria-required={required}
              className="w-4 h-4 text-blue-700 focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px]"
            />
            <span className="text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>

      <FormError id={errorId} message={error} />
    </fieldset>
  );
}
