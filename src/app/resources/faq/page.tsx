'use client';

import React from 'react';
import { getFAQByCategory, getCategoryLabel } from '@/content/resources/faq';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const grouped = getFAQByCategory();
  const categories = ['general', 'eligibility', 'application', 'privacy'];

  return (
    <div className="py-section">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Frequently Asked Questions
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Answers to common questions about the IDD Benefits Navigator, eligibility, and how to apply for programs.
        </p>

        <div className="space-y-10">
          {categories.map((category) => {
            const entries = grouped[category];
            if (!entries || entries.length === 0) return null;
            return (
              <section key={category}>
                <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                  {getCategoryLabel(category)}
                </h2>
                <div className="space-y-3">
                  {entries.map((entry, index) => (
                    <details
                      key={index}
                      className="group border border-border rounded-lg"
                    >
                      <summary className="flex items-center justify-between gap-4 px-4 py-3 cursor-pointer text-foreground font-medium hover:bg-muted/50 rounded-lg transition-colors">
                        <span>{entry.question}</span>
                        <span className="text-muted-foreground text-lg group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                      </summary>
                      <div className="px-4 pb-4 pt-1 text-foreground/80 leading-relaxed">
                        {entry.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
