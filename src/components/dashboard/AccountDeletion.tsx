'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Trash2, X, Loader2 } from 'lucide-react';

interface AccountDeletionProps {
  deletedAt: string | null;
}

export function AccountDeletion({ deletedAt }: AccountDeletionProps) {
  const router = useRouter();
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
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
        setMessage('Account deletion cancelled. Your data is safe.');
        router.refresh();
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPendingDeletion) {
    return (
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-card-padding">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Account Scheduled for Deletion
          </h3>
          <p className="text-foreground/80 text-sm mb-4">
            Your account is scheduled for deletion on{' '}
            <strong>
              {deletionDate?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
            . Your data will be permanently removed after this date.
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
            {isSubmitting ? 'Cancelling...' : 'Cancel Deletion'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-card-padding">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Delete Account
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          This will permanently delete your account, screening history, and all
          saved data after a 14-day grace period. You can cancel the deletion
          during that time.
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
            Delete My Account
          </Button>
        ) : (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-4">
            <p className="text-destructive font-medium text-sm">
              Are you sure? Type <strong>DELETE</strong> to confirm.
            </p>
            <div>
              <label htmlFor="delete-confirm" className="sr-only">
                Type DELETE to confirm account deletion
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3 py-2 border border-destructive/30 rounded-lg text-sm focus:ring-2 focus:ring-ring focus:outline-none bg-background"
                aria-describedby="delete-help"
              />
              <p id="delete-help" className="text-xs text-destructive mt-1">
                Type the word DELETE in all caps to enable the delete button.
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
                {isSubmitting ? 'Deleting...' : 'Permanently Delete'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
