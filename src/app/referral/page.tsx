'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPartnersByState } from '@/content/resources/partners';
import { useScreeningStore } from '@/lib/screening/store';
import type { ReferralResult } from '@/lib/referrals/types';
import { getProgramContent } from '@/content/programs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Send,
  Loader2,
  AlertCircle,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

function ReferralFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { results, formData } = useScreeningStore();
  const t = useTranslations('referral.form');

  const referralFormSchema = z.object({
    familyName: z.string().min(1, t('nameRequired')),
    familyEmail: z.string().email(t('emailRequired')),
    familyPhone: z.string().optional(),
    familyNote: z.string().max(500, t('noteMaxLength')).optional(),
    selectedPartners: z.array(z.string()).min(1, t('selectAtLeastOne')),
    consent: z.boolean().refine((val) => val === true, {
      message: t('mustAgree'),
    }),
  });

  type ReferralFormData = z.infer<typeof referralFormSchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showDataPreview, setShowDataPreview] = useState(false);

  const stateCode = formData?.state || results?.state || 'KY';
  const allPartners = getPartnersByState(stateCode);
  const availablePartners = allPartners.filter((partner) => partner.email);

  const eligiblePrograms =
    results?.programs
      .filter((p) => p.eligible && (p.confidence === 'likely' || p.confidence === 'possible'))
      .map((p) => p.programId) || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      familyName: '',
      familyEmail: '',
      familyPhone: '',
      familyNote: '',
      selectedPartners: [],
      consent: false,
    },
  });

  const watchedNote = watch('familyNote') || '';
  const watchedPartners = watch('selectedPartners') || [];

  useEffect(() => {
    fetch('/api/screenings')
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data[0]?.screeningData?.email) {
          const email = data[0].screeningData.email;
          setUserEmail(email);
          setValue('familyEmail', email);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [setValue]);

  useEffect(() => {
    const partnerParam = searchParams.get('partner');
    if (partnerParam && availablePartners.some((p) => p.id === partnerParam)) {
      setValue('selectedPartners', [partnerParam]);
    }
  }, [searchParams, setValue, availablePartners]);

  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/referrals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          eligiblePrograms,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t('submitFailed'));
      }

      const { results } = await response.json() as { results: ReferralResult[] };

      sessionStorage.setItem('referralResults', JSON.stringify(results));
      sessionStorage.setItem('familyEmail', data.familyEmail);

      router.push('/referral/confirmation');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t('unexpectedError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgramName = (programId: string): string => {
    const content = getProgramContent(programId);
    return content?.name || programId;
  };

  return (
    <div className="py-section">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Partner Selection */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('selectOrgs')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('selectOrgsDescription')}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {availablePartners.map((partner) => (
                <label
                  key={partner.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={partner.id}
                    {...register('selectedPartners')}
                    className="mt-1 h-4 w-4 border-input rounded focus:ring-ring accent-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{partner.name}</div>
                    <div className="text-sm text-muted-foreground">{partner.description}</div>
                  </div>
                </label>
              ))}

              {errors.selectedPartners && (
                <p className="mt-2 text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.selectedPartners.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('contactInfo')}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="familyName" className="block text-sm font-medium text-foreground mb-1">
                  {t('yourName')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="familyName"
                  {...register('familyName')}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  placeholder={t('namePlaceholder')}
                />
                {errors.familyName && (
                  <p className="mt-1 text-sm text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.familyName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="familyEmail" className="block text-sm font-medium text-foreground mb-1">
                  {t('yourEmail')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="familyEmail"
                  {...register('familyEmail')}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  placeholder={t('emailPlaceholder')}
                />
                {errors.familyEmail && (
                  <p className="mt-1 text-sm text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.familyEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="familyPhone" className="block text-sm font-medium text-foreground mb-1">
                  {t('yourPhone')}
                </label>
                <input
                  type="tel"
                  id="familyPhone"
                  {...register('familyPhone')}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  placeholder={t('phonePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="familyNote" className="block text-sm font-medium text-foreground mb-1">
                  {t('noteToOrg')}
                </label>
                <textarea
                  id="familyNote"
                  {...register('familyNote')}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  placeholder={t('notePlaceholder')}
                  maxLength={500}
                />
                <div className="mt-1 flex justify-between items-center">
                  <div>
                    {errors.familyNote && (
                      <p className="text-sm text-destructive">{errors.familyNote.message}</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{watchedNote.length}/500</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligible Programs */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('programsEligible')}
              </h2>
            </CardHeader>
            <CardContent>
              {eligiblePrograms.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('programsShared')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80">
                    {eligiblePrograms.map((programId) => (
                      <li key={programId}>{getProgramName(programId)}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    {t('completeScreening')}
                  </p>
                  <a
                    href="/screening"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    {t('startScreening')}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consent */}
          <Card className="bg-secondary border-2 border-border">
            <CardHeader>
              <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t('privacyConsent')}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('consent')}
                    className="mt-1 h-4 w-4 border-input rounded focus:ring-ring accent-primary"
                  />
                  <span className="text-foreground/80">
                    {t('consentText')}
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.consent.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowDataPreview(!showDataPreview)}
                className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center gap-1"
              >
                {t('whatGetsShared')}
                {showDataPreview ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showDataPreview && (
                <div className="bg-card rounded-md border border-border p-4 text-sm">
                  <p className="font-medium text-foreground mb-2">{t('infoShared')}</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80 mb-3">
                    <li>{t('nameAndContact')}</li>
                    {eligiblePrograms.length > 0 && (
                      <li>
                        {t('programsList', {
                          programs: eligiblePrograms.map(getProgramName).join(', '),
                        })}
                      </li>
                    )}
                    {watchedNote && <li>{t('optionalNote')}</li>}
                  </ul>
                  <p className="text-muted-foreground italic">
                    {t('noSensitiveData')}
                  </p>
                </div>
              )}

              <div className="text-sm text-muted-foreground space-y-2">
                <p>{t('informationalReferral')}</p>
                <p>{t('changeYourMind')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1.5" />
              )}
              {isSubmitting ? t('sending') : t('sendReferral')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  const t = useTranslations('referral.form');

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('loading')}
        </p>
      </div>
    }>
      <ReferralFormContent />
    </Suspense>
  );
}
