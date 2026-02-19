'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  id: string;
  message?: string;
}

export function FormError({ id, message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className="flex items-center gap-1.5 text-destructive text-sm mt-1 font-medium"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </div>
  );
}
