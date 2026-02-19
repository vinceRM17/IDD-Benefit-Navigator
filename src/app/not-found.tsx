import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-card-padding text-center">
          <p className="text-6xl font-heading font-bold text-primary mb-4">404</p>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Page not found
          </h2>
          <p className="text-muted-foreground mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/screening">
                <ClipboardList className="h-4 w-4 mr-1" />
                Start screening
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/">
                Go home
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
