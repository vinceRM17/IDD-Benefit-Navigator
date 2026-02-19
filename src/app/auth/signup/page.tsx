import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create Account - IDD Benefits Navigator',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground text-center mb-6">
            Create Account
          </h1>
          <SignupForm />
        </CardContent>
      </Card>
    </main>
  );
}
