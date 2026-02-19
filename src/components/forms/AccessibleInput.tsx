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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-medium text-foreground">
        {label}
        {required && (
          <span aria-label="required" className="text-destructive ml-1">
            *
          </span>
        )}
      </label>

      {helpText && (
        <span id={helpId} className="text-muted-foreground text-sm">
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
        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring min-h-[44px] transition-colors ${
          error ? 'border-destructive' : 'border-input'
        }`}
      />

      <FormError id={errorId} message={error} />
    </div>
  );
}
