'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="py-section">
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-card-padding text-center">
          <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Could not load your dashboard
          </h2>
          <p className="text-muted-foreground mb-6">
            We had trouble loading your account data. This is usually temporary.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Try again
            </Button>
            <Button variant="secondary" asChild>
              <a href="/">
                Go home
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </div>
          {error.digest && (
            <p className="mt-6 text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
