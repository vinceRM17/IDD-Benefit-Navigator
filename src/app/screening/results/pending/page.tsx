import { Heart, Loader2 } from 'lucide-react';

export default function ResultsPendingPage() {
  return (
    <div className="max-w-3xl mx-auto py-section text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Heart className="h-8 w-8 text-primary animate-gentle-pulse" />
      </div>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
        Finding Your Benefits
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
        We&apos;re evaluating your information to find programs you may qualify
        for. This usually takes just a moment.
      </p>
      <div className="flex items-center justify-center gap-2 text-primary">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Analyzing your situation...</span>
      </div>
    </div>
  );
}
