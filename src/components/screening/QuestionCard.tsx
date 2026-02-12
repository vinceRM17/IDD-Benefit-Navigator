import React from 'react';

interface QuestionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function QuestionCard({ title, description, children }: QuestionCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl mx-auto bg-white">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
