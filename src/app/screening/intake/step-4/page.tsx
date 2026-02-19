'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useScreeningStore } from '@/lib/screening/store';
import { step4Schema, type Step4Data } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import {
  AccessibleRadioGroup,
  AccessibleCheckboxGroup,
} from '@/components/forms';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';

const workStatusOptions = [
  { value: 'employed', label: 'Currently employed' },
  { value: 'unemployed', label: 'Not currently employed' },
  { value: 'unable-to-work', label: 'Unable to work due to disability' },
  { value: 'student', label: 'Student' },
];

const diagnosisOptions = [
  { value: 'autism', label: 'Autism spectrum disorder' },
  { value: 'cerebral-palsy', label: 'Cerebral palsy' },
  { value: 'down-syndrome', label: 'Down syndrome' },
  { value: 'epilepsy', label: 'Epilepsy or seizure disorder' },
  { value: 'mental-health', label: 'Mental health condition' },
  { value: 'other', label: 'Other diagnosis' },
];

const limitationOptions = [
  { value: 'daily-living', label: 'Daily living activities (cooking, cleaning, managing money)' },
  { value: 'communication', label: 'Communication (speaking, understanding others)' },
  { value: 'mobility', label: 'Mobility (walking, using transportation)' },
  { value: 'self-care', label: 'Self-care (bathing, dressing, eating)' },
  { value: 'learning', label: 'Learning (reading, problem-solving)' },
  { value: 'social', label: 'Social skills (making friends, understanding social cues)' },
];

export default function Step4Page() {
  const router = useRouter();
  const { formData, setStepData } = useScreeningStore();

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
      title="Functional needs"
      description="These optional questions help us find additional programs. Skip any you prefer not to answer."
    >
      <div className="space-y-6">
        <AccessibleRadioGroup
          name="workStatus"
          legend="What is your family member's work situation?"
          options={workStatusOptions}
          value={workStatus}
          onChange={setWorkStatus}
          helpText="This helps us check for employment-related programs"
        />

        <AccessibleRadioGroup
          name="hasGuardian"
          legend="Does your family member have a legal guardian?"
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          value={hasGuardian}
          onChange={setHasGuardian}
        />

        <AccessibleCheckboxGroup
          name="coOccurringDiagnoses"
          legend="Does your family member have any of these conditions? (select all that apply)"
          options={diagnosisOptions}
          value={coOccurringDiagnoses}
          onChange={setCoOccurringDiagnoses}
          helpText="This helps us identify specialized programs"
        />

        <AccessibleCheckboxGroup
          name="functionalLimitations"
          legend="Does your family member need help with any of these areas? (select all that apply)"
          options={limitationOptions}
          value={functionalLimitations}
          onChange={setFunctionalLimitations}
          helpText="This helps match your family with the right level of support"
        />

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="secondary" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handleSkip}>
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </QuestionCard>
  );
}
