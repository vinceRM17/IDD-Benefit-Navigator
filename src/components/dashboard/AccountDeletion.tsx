'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="border border-orange-200 bg-orange-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-2">
          Account Scheduled for Deletion
        </h3>
        <p className="text-orange-800 text-sm mb-4">
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
          <div role="status" className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mb-4">
            {message}
          </div>
        )}

        {error && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleCancelDeletion}
          disabled={isSubmitting}
          className="bg-white border border-orange-300 text-orange-800 font-medium px-4 py-2 rounded-lg hover:bg-orange-100 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 min-h-[44px]"
        >
          {isSubmitting ? 'Cancelling...' : 'Cancel Deletion'}
        </button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Delete Account
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        This will permanently delete your account, screening history, and all
        saved data after a 14-day grace period. You can cancel the deletion
        during that time.
      </p>

      {error && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
          {error}
        </div>
      )}

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px]"
        >
          Delete My Account
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
          <p className="text-red-900 font-medium text-sm">
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
              className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              aria-describedby="delete-help"
            />
            <p id="delete-help" className="text-xs text-red-700 mt-1">
              Type the word DELETE in all caps to enable the delete button.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || isSubmitting}
              className="bg-red-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isSubmitting ? 'Deleting...' : 'Permanently Delete'}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmText('');
              }}
              className="bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
