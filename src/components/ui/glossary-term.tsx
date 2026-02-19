'use client';

import React from 'react';
import { findGlossaryTerm } from '@/content/resources/glossary';

interface GlossaryTermProps {
  term: string;
  children?: React.ReactNode;
}

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const entry = findGlossaryTerm(term);
  if (!entry) return <>{children || term}</>;

  return (
    <abbr
      title={entry.definition}
      className="no-underline border-b border-dotted border-muted-foreground cursor-help"
    >
      {children || term}
    </abbr>
  );
}
