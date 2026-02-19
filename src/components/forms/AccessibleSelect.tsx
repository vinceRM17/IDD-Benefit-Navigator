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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-medium text-foreground">
        {label}
        {required && (
          <span aria-label="required" className="text-destructive ml-1">
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
        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring min-h-[44px] transition-colors ${
          error ? 'border-destructive' : 'border-input'
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
