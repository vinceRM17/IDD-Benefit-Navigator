'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth.login');

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
            {t('title')}
          </h1>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
