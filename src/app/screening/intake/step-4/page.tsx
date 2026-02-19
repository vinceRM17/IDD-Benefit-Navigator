'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useScreeningStore } from '@/lib/screening/store';
import { type Step4Data } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import {
  AccessibleRadioGroup,
  AccessibleCheckboxGroup,
} from '@/components/forms';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Step4Page() {
  const router = useRouter();
  const { formData, setStepData } = useScreeningStore();
  const t = useTranslations('screening');

  const workStatusOptions = [
    { value: 'employed', label: t('step4.employed') },
    { value: 'unemployed', label: t('step4.unemployed') },
    { value: 'unable-to-work', label: t('step4.unableToWork') },
    { value: 'student', label: t('step4.student') },
  ];

  const diagnosisOptions = [
    { value: 'autism', label: t('step4.autism') },
    { value: 'cerebral-palsy', label: t('step4.cerebralPalsy') },
    { value: 'down-syndrome', label: t('step4.downSyndrome') },
    { value: 'epilepsy', label: t('step4.epilepsy') },
    { value: 'mental-health', label: t('step4.mentalHealth') },
    { value: 'other', label: t('step4.otherDiagnosis') },
  ];

  const limitationOptions = [
    { value: 'daily-living', label: t('step4.dailyLiving') },
    { value: 'communication', label: t('step4.communication') },
    { value: 'mobility', label: t('step4.mobility') },
    { value: 'self-care', label: t('step4.selfCare') },
    { value: 'learning', label: t('step4.learning') },
    { value: 'social', label: t('step4.social') },
  ];

  const yesNo = [
    { value: 'true', label: t('review.yes') },
    { value: 'false', label: t('review.no') },
  ];

  const [workStatus, setWorkStatus] = React.useState<string>(formData.workStatus || '');
  const [hasGuardian, setHasGuardian] = React.useState<string>(
    formData.hasGuardian === true ? 'true' : formData.hasGuardian === false ? 'false' : ''
  );
  const [coOccurringDiagnoses, setCoOccurringDiagnoses] = React.useState<string[]>(
    formData.coOccurringDiagnoses || []
  );
  const [functionalLimitations, setFunctionalLimitations] = React.useState<string[]>(
    formData.functionalLimitations || []
  );

  const handleSubmit = () => {
    const data: Partial<Step4Data> = {};
    if (workStatus) data.workStatus = workStatus as Step4Data['workStatus'];
    if (hasGuardian) data.hasGuardian = hasGuardian === 'true';
    if (coOccurringDiagnoses.length > 0) data.coOccurringDiagnoses = coOccurringDiagnoses as Step4Data['coOccurringDiagnoses'];
    if (functionalLimitations.length > 0) data.functionalLimitations = functionalLimitations as Step4Data['functionalLimitations'];

    setStepData(data);
    router.push('/screening/intake/review');
  };

  const handleSkip = () => {
    router.push('/screening/intake/review');
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-3');
  };

  return (
    <QuestionCard
      title={t('step4.title')}
      description={t('step4.description')}
    >
      <div className="space-y-6">
        <AccessibleRadioGroup
          name="workStatus"
          legend={t('step4.workStatusLabel')}
          options={workStatusOptions}
          value={workStatus}
          onChange={setWorkStatus}
          helpText={t('step4.workStatusHelp')}
        />

        <AccessibleRadioGroup
          name="hasGuardian"
          legend={t('step4.guardianLabel')}
          options={yesNo}
          value={hasGuardian}
          onChange={setHasGuardian}
        />

        <AccessibleCheckboxGroup
          name="coOccurringDiagnoses"
          legend={t('step4.diagnosesLabel')}
          options={diagnosisOptions}
          value={coOccurringDiagnoses}
          onChange={setCoOccurringDiagnoses}
          helpText={t('step4.diagnosesHelp')}
        />

        <AccessibleCheckboxGroup
          name="functionalLimitations"
          legend={t('step4.limitationsLabel')}
          options={limitationOptions}
          value={functionalLimitations}
          onChange={setFunctionalLimitations}
          helpText={t('step4.limitationsHelp')}
        />

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="secondary" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('common.previous')}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleSkip}>
              <SkipForward className="h-4 w-4 mr-1" />
              {t('common.skip')}
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {t('common.next')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </QuestionCard>
  );
}
