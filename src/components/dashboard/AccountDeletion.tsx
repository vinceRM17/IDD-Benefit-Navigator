'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Trash2, X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AccountDeletionProps {
  deletedAt: string | null;
}

export function AccountDeletion({ deletedAt }: AccountDeletionProps) {
  const router = useRouter();
  const t = useTranslations('dashboard.settings');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isPendingDeletion = !!deletedAt;
  const deletionDate = deletedAt
    ? new Date(new Date(deletedAt).getTime() + 14 * 24 * 60 * 60 * 1000)
    : null;

  async function handleDelete() {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });

      if (res.ok) {
        router.push('/auth/login');
      } else {
        setError(t('genericError'));
      }
    } catch {
      setError(t('genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancelDeletion() {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/account/cancel-delete', { method: 'POST' });

      if (res.ok) {
        setMessage(t('deletionCancelled'));
        router.refresh();
      } else {
        setError(t('genericError'));
      }
    } catch {
      setError(t('genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPendingDeletion) {
    const formattedDate = deletionDate?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) ?? '';

    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-card-padding">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            {t('scheduledForDeletion')}
          </h3>
          <p className="text-foreground/80 text-sm mb-4">
            {t('scheduledDescription', { date: formattedDate })}
          </p>

          {message && (
            <div role="status" className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {message}
            </div>
          )}

          {error && (
            <div role="alert" className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            variant="secondary"
            onClick={handleCancelDeletion}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <X className="h-4 w-4 mr-1.5" />
            )}
            {isSubmitting ? t('cancelling') : t('cancelDeletion')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-card-padding">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          {t('deleteAccount')}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {t('deleteDescription')}
        </p>

        {error && (
          <div role="alert" className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!showConfirm ? (
          <Button
            variant="destructive"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            {t('deleteMyAccount')}
          </Button>
        ) : (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-4">
            <p className="text-destructive font-medium text-sm">
              {t('areYouSure')}
            </p>
            <div>
              <label htmlFor="delete-confirm" className="sr-only">
                {t('typeDeleteLabel')}
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={t('typeDeletePlaceholder')}
                className="w-full px-3 py-2 border border-destructive/30 rounded-lg text-sm focus:ring-2 focus:ring-ring focus:outline-none bg-background"
                aria-describedby="delete-help"
              />
              <p id="delete-help" className="text-xs text-destructive mt-1">
                {t('typeDeleteHelp')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-1.5" />
                )}
                {isSubmitting ? t('deleting') : t('permanentlyDelete')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText('');
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
