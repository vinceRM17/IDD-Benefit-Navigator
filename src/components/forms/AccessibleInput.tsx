'use client';

import React from 'react';
import { FormError } from './FormError';

interface AccessibleInputProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AccessibleInput({
  id,
  label,
  type = 'text',
  required = false,
  error,
  helpText,
  value,
  onChange,
  placeholder,
}: AccessibleInputProps) {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const describedBy = [
    helpText ? helpId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

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

      {helpText && (
        <span id={helpId} className="text-gray-600 text-sm">
          {helpText}
        </span>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />

      <FormError id={errorId} message={error} />
    </div>
  );
}
