import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface QuestionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function QuestionCard({ title, description, children }: QuestionCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-heading font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
