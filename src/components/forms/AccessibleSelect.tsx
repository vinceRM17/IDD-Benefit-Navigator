'use client';

import React from 'react';
import { FormError } from './FormError';

interface SelectOption {
  value: string;
  label: string;
}

interface AccessibleSelectProps {
  id: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AccessibleSelect({
  id,
  label,
  options,
  required = false,
  error,
  value,
  onChange,
  placeholder,
}: AccessibleSelectProps) {
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium text-gray-900">
        {label}
        {required && (
          <span aria-label="required" className="text-red-700 ml-1">
            *
          </span>
        )}
      </label>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <FormError id={errorId} message={error} />
    </div>
  );
}
