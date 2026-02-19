'use client';

import React, { useState } from 'react';
import { getGlossaryByLetter, type GlossaryEntry } from '@/content/resources/glossary';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Search } from 'lucide-react';

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const grouped = getGlossaryByLetter();
  const letters = Object.keys(grouped).sort();

  const filteredGrouped: Record<string, GlossaryEntry[]> = {};
  if (search) {
    const lower = search.toLowerCase();
    for (const [letter, entries] of Object.entries(grouped)) {
      const filtered = entries.filter(
        (e) =>
          e.term.toLowerCase().includes(lower) ||
          e.definition.toLowerCase().includes(lower)
      );
      if (filtered.length > 0) filteredGrouped[letter] = filtered;
    }
  }

  const displayGrouped = search ? filteredGrouped : grouped;
  const displayLetters = Object.keys(displayGrouped).sort();

  return (
    <div className="py-section">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Glossary
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Common terms and abbreviations used in disability benefits. Written in plain language so everyone can understand.
        </p>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search glossary terms"
          />
        </div>

        {/* Letter navigation */}
        <nav aria-label="Glossary letters" className="flex flex-wrap gap-1 mb-8">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Terms */}
        {displayLetters.length > 0 ? (
          <div className="space-y-8">
            {displayLetters.map((letter) => (
              <section key={letter} id={`letter-${letter}`}>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4 border-b border-border pb-2">
                  {letter}
                </h2>
                <div className="space-y-4">
                  {displayGrouped[letter].map((entry) => (
                    <Card key={entry.term}>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                          {entry.term}
                        </h3>
                        <p className="text-foreground/80 mb-2">{entry.definition}</p>
                        {entry.seeAlso && entry.seeAlso.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            See also:{' '}
                            {entry.seeAlso.map((term, i) => (
                              <span key={term}>
                                {i > 0 && ', '}
                                <a href={`#letter-${term[0].toUpperCase()}`} className="text-primary hover:underline">
                                  {term}
                                </a>
                              </span>
                            ))}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No terms found matching &ldquo;{search}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
