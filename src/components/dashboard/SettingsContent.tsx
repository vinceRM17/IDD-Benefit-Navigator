'use client';

import React from 'react';
import { AccountDeletion } from '@/components/dashboard/AccountDeletion';
import { ReminderPreferences } from '@/components/dashboard/ReminderPreferences';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SettingsContentProps {
  email: string;
  deletedAt: string | null;
}

export function SettingsContent({ email, deletedAt }: SettingsContentProps) {
  const t = useTranslations('dashboard.settings');

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
        {t('title')}
      </h1>

      {/* Email Display */}
      <Card className="mb-6">
        <CardContent className="p-card-padding">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {t('email')}
          </h2>
          <p className="text-foreground/80">{email}</p>
        </CardContent>
      </Card>

      {/* Recertification Reminders */}
      <Card className="mb-6">
        <CardContent className="p-card-padding">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
            {t('reminders')}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            {t('remindersDescription')}
          </p>
          <ReminderPreferences />
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <AccountDeletion deletedAt={deletedAt} />
    </div>
  );
}
