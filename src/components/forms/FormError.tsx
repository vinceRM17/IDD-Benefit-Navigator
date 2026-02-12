'use client';

import React from 'react';

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
      className="text-red-700 text-sm mt-1 font-medium"
    >
      {message}
    </div>
  );
}
