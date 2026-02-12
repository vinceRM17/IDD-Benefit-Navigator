'use client';

import React, { useEffect, useState } from 'react';
import { getProgramDisplayName } from '@/content/programs/recertification';

interface ReminderPref {
  id: number;
  programId: string;
  reminderEnabled60: boolean;
  reminderEnabled30: boolean;
  reminderEnabled7: boolean;
  recertificationDate: string | null;
  estimatedRecertDate: string | null;
}

export function ReminderPreferences() {
  const [preferences, setPreferences] = useState<ReminderPref[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/account/preferences')
      .then((res) => res.json())
      .then((data) => setPreferences(data.preferences || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(pref: ReminderPref) {
    setSaving(pref.programId);
    setMessage(null);

    try {
      const res = await fetch('/api/account/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: pref.programId,
          reminderEnabled60: pref.reminderEnabled60,
          reminderEnabled30: pref.reminderEnabled30,
          reminderEnabled7: pref.reminderEnabled7,
          recertificationDate: pref.recertificationDate,
        }),
      });

      if (res.ok) {
        setMessage('Reminder preferences updated');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      // Silently handle
    } finally {
      setSaving(null);
    }
  }

  function updatePref(programId: string, updates: Partial<ReminderPref>) {
    setPreferences((prev) =>
      prev.map((p) => (p.programId === programId ? { ...p, ...updates } : p))
    );
  }

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading reminder settings...</p>;
  }

  if (preferences.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Complete a screening to set up recertification reminders for your eligible programs.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div role="status" className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {message}
        </div>
      )}

      {preferences.map((pref) => {
        const displayDate = pref.recertificationDate || pref.estimatedRecertDate;
        const isUserDate = !!pref.recertificationDate;
        const formattedDate = displayDate
          ? new Date(displayDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Not set';

        return (
          <div
            key={pref.programId}
            className="border border-gray-200 rounded-lg p-5 bg-white"
          >
            <h3 className="font-semibold text-gray-900 mb-1">
              {getProgramDisplayName(pref.programId)}
            </h3>

            {/* Recert date display */}
            <p className="text-sm text-gray-600 mb-3">
              Recertification date: <strong>{formattedDate}</strong>{' '}
              <span className="text-gray-400">
                {isUserDate ? '(Your date)' : '(Estimated)'}
              </span>
            </p>
            {!isUserDate && (
              <p className="text-xs text-gray-400 mb-3">
                Based on typical {getProgramDisplayName(pref.programId)} recertification cycle
              </p>
            )}

            {/* Date override */}
            <div className="mb-4">
              <label
                htmlFor={`recert-date-${pref.programId}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Set your actual recertification date
              </label>
              <input
                id={`recert-date-${pref.programId}`}
                type="date"
                value={
                  pref.recertificationDate
                    ? new Date(pref.recertificationDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  updatePref(pref.programId, {
                    recertificationDate: e.target.value || null,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Reminder toggles */}
            <fieldset className="mb-4">
              <legend className="text-sm font-medium text-gray-700 mb-2">
                Send reminders
              </legend>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={pref.reminderEnabled60}
                    onChange={(e) =>
                      updatePref(pref.programId, { reminderEnabled60: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  60 days before
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={pref.reminderEnabled30}
                    onChange={(e) =>
                      updatePref(pref.programId, { reminderEnabled30: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  30 days before
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={pref.reminderEnabled7}
                    onChange={(e) =>
                      updatePref(pref.programId, { reminderEnabled7: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  7 days before
                </label>
              </div>
            </fieldset>

            {/* Save button */}
            <button
              onClick={() => handleSave(pref)}
              disabled={saving === pref.programId}
              className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 min-h-[36px]"
            >
              {saving === pref.programId ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
