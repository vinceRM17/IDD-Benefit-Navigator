'use client';

import React, { useEffect, useState } from 'react';
import { getProgramDisplayName } from '@/content/programs/recertification';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('dashboard.settings');
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
        setMessage(t('preferencesUpdated'));
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
    return (
      <p className="text-muted-foreground text-sm flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t('loadingReminders')}
      </p>
    );
  }

  if (preferences.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {t('noScreenings')}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div role="status" className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
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
          : t('notSet');

        return (
          <Card key={pref.programId}>
            <CardContent className="p-card-padding">
              <h3 className="font-heading font-semibold text-foreground mb-1">
                {getProgramDisplayName(pref.programId)}
              </h3>

              <p className="text-sm text-muted-foreground mb-3">
                {t('recertDate')} <strong className="text-foreground">{formattedDate}</strong>{' '}
                <span className="text-muted-foreground">
                  {isUserDate ? t('yourDate') : t('estimated')}
                </span>
              </p>
              {!isUserDate && (
                <p className="text-xs text-muted-foreground mb-3">
                  {t('basedOnTypical', { programName: getProgramDisplayName(pref.programId) })}
                </p>
              )}

              {/* Date override */}
              <div className="mb-4">
                <label
                  htmlFor={`recert-date-${pref.programId}`}
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  {t('setActualDate')}
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
                  className="px-3 py-2 border border-input rounded-lg text-sm focus:ring-2 focus:ring-ring focus:outline-none bg-background"
                />
              </div>

              {/* Reminder toggles */}
              <fieldset className="mb-4">
                <legend className="text-sm font-medium text-foreground mb-2">
                  {t('sendReminders')}
                </legend>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                      type="checkbox"
                      checked={pref.reminderEnabled60}
                      onChange={(e) =>
                        updatePref(pref.programId, { reminderEnabled60: e.target.checked })
                      }
                      className="w-4 h-4 border-input rounded focus:ring-ring accent-primary"
                    />
                    {t('daysBefore60')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                      type="checkbox"
                      checked={pref.reminderEnabled30}
                      onChange={(e) =>
                        updatePref(pref.programId, { reminderEnabled30: e.target.checked })
                      }
                      className="w-4 h-4 border-input rounded focus:ring-ring accent-primary"
                    />
                    {t('daysBefore30')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                      type="checkbox"
                      checked={pref.reminderEnabled7}
                      onChange={(e) =>
                        updatePref(pref.programId, { reminderEnabled7: e.target.checked })
                      }
                      className="w-4 h-4 border-input rounded focus:ring-ring accent-primary"
                    />
                    {t('daysBefore7')}
                  </label>
                </div>
              </fieldset>

              <Button
                size="sm"
                onClick={() => handleSave(pref)}
                disabled={saving === pref.programId}
              >
                {saving === pref.programId ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                {saving === pref.programId ? t('saving') : t('savePreferences')}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
