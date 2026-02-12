'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const DISMISS_KEY = 'idd_account_prompt_dismissed';

/**
 * Gentle, dismissible card prompting anonymous users to create an account.
 * Stored in sessionStorage so it reappears on next visit but stays
 * dismissed during the current session.
 */
export function AccountPrompt() {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    setDismissed(wasDismissed);
  }, []);

  if (dismissed) return null;

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  }

  return (
    <aside
      role="complementary"
      aria-label="Account signup suggestion"
      className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8"
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">
          &#128278;
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Save your progress
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Create a free account to save your screening results, get reminders
            before benefits need renewal, and come back anytime to check your
            progress.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-block bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[36px]"
            >
              Create Account
            </Link>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss account prompt"
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Continue without an account
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Your screening results will be saved automatically.
          </p>
        </div>
      </div>
    </aside>
  );
}
