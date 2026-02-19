'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ReferralResult } from '@/lib/referrals/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Mail,
  Loader2,
  ArrowRight,
  ClipboardList,
  Home as HomeIcon,
  UserPlus,
  Send,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ReferralConfirmationPage() {
  const router = useRouter();
  const t = useTranslations('referral.confirmation');
  const [results, setResults] = useState<ReferralResult[]>([]);
  const [familyEmail, setFamilyEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResults = sessionStorage.getItem('referralResults');
    const storedEmail = sessionStorage.getItem('familyEmail');

    if (storedResults && storedEmail) {
      try {
        const parsedResults = JSON.parse(storedResults) as ReferralResult[];
        setResults(parsedResults);
        setFamilyEmail(storedEmail);

        sessionStorage.removeItem('referralResults');
        sessionStorage.removeItem('familyEmail');
      } catch (error) {
        console.error('Failed to parse referral results:', error);
      }
    }

    fetch('/api/screenings')
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('loading')}
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-section">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
              {t('noDataTitle')}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('noDataDescription')}
            </p>
            <Button asChild>
              <Link href="/referral">
                <Send className="h-4 w-4 mr-1.5" />
                {t('submitReferral')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-section">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              {t('sentTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('sentSubtitle')}
            </p>
          </div>

          {/* Partner List */}
          <div className="mb-8">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              {t('sentTo')}
            </h2>
            <ul className="space-y-2">
              {results.map((result) => (
                <li
                  key={result.referralId}
                  className="flex items-center space-x-3 p-3 bg-muted rounded-md"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-foreground font-medium">{result.partnerName}</span>
                  {result.sent && (
                    <span className="text-sm text-muted-foreground">{t('sentBadge')}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Confirmation Email */}
          <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mb-8 flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary shrink-0" />
            <p className="text-foreground/80">
              {t('confirmationEmail', { email: familyEmail })}
            </p>
          </div>

          {/* User-specific next steps */}
          {!isAuthenticated ? (
            <div className="bg-accent/10 border border-accent/30 rounded-md p-4 mb-8">
              <p className="text-foreground font-medium mb-2">
                {t('onlyRecord')}
              </p>
              <p className="text-foreground/80 text-sm mb-3">
                {t('trackFuture')}
              </p>
              <Button size="sm" asChild>
                <Link href="/auth/signup">
                  <UserPlus className="h-4 w-4 mr-1" />
                  {t('createAccount')}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mb-8">
              <p className="text-foreground/80 mb-3">
                {t('viewDashboard')}
              </p>
              <Button size="sm" asChild>
                <Link href="/dashboard/referrals">
                  {t('viewYourReferrals')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}

          {/* Privacy Notice */}
          <Separator className="mb-6" />
          <p className="text-sm text-muted-foreground mb-6">
            {t('changeYourMind')}
          </p>

          {/* Next Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" className="flex-1" asChild>
              <Link href="/screening">
                <ClipboardList className="h-4 w-4 mr-1.5" />
                {t('startNewScreening')}
              </Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/">
                <HomeIcon className="h-4 w-4 mr-1.5" />
                {t('returnHome')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
