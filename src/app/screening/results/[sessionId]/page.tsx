/**
 * Results Page - Dynamic route
 * Displays personalized benefit recommendations organized in tabs
 * Reads results from Zustand store (stored after API call on review page)
 */

'use client';

import { useRouter } from 'next/navigation';
import { useScreeningStore } from '@/lib/screening/store';
import {
  ProgramCard,
  ActionPlan,
  BenefitInteractions,
  DocumentChecklist,
  AIExplanation,
  AccountPrompt,
  TabNav,
  ProgramSummaryCard,
} from '@/components/results';
import { DownloadPDFButton } from '@/components/results/DownloadPDFButton';
import { ResourceDirectory } from '@/components/results/ResourceDirectory';
import { StateCoverageBanner } from '@/components/results/StateCoverageBanner';
import { WhatIfPanel } from '@/components/results/WhatIfPanel';
import { getStateName } from '@/lib/data/states';
// Action plan is now pre-generated server-side and included in results
import { useEffect, useState, useCallback } from 'react';
import type { Tab } from '@/components/results/TabNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  RotateCcw,
  Loader2,
  ClipboardList,
  ChevronDown,
  Info,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const router = useRouter();
  const { results, formData, reset, areResultsExpired, clearResults } = useScreeningStore();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
    fetch('/api/screenings')
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Check for expired results on mount
  useEffect(() => {
    if (mounted && results && areResultsExpired()) {
      clearResults();
    }
  }, [mounted, results, areResultsExpired, clearResults]);

  const goToPrograms = useCallback(() => setActiveTab('programs'), []);

  const handleClearData = () => {
    reset();
    router.push('/');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading your results...</p>
        </div>
      </div>
    );
  }

  // Show expiration message instead of flash-redirect
  if (!results) {
    return (
      <div className="py-section">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Your results have expired
            </h1>
            <p className="text-muted-foreground mb-6">
              For your privacy, screening results are not kept for long. Let&apos;s
              start a new screening to find the benefits your family may qualify for.
            </p>
          </div>
          <Button asChild>
            <Link href="/screening">Start New Screening</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group programs by confidence level
  const likelyPrograms = results.programs.filter((p) => p.confidence === 'likely');
  const possiblePrograms = results.programs.filter((p) => p.confidence === 'possible');
  const unlikelyPrograms = results.programs.filter((p) => p.confidence === 'unlikely');
  const eligiblePrograms = [...likelyPrograms, ...possiblePrograms];

  const eligibleProgramIds = results.programs
    .filter((p) => p.eligible && (p.confidence === 'likely' || p.confidence === 'possible'))
    .map((p) => p.programId);

  const actionSteps = results.actionPlan || [];

  const familyContext = {
    householdSize: formData.householdSize || 1,
    monthlyIncome: formData.monthlyIncome || 0,
    hasDisabilityDiagnosis: formData.hasDisabilityDiagnosis || false,
    age: formData.age || 0,
    hasInsurance: formData.hasInsurance || false,
    insuranceType: formData.insuranceType,
    receivesSSI: formData.receivesSSI,
    receivesSNAP: formData.receivesSNAP,
    state: formData.state || results.state,
  };

  const handleStartOver = () => {
    reset();
    router.push('/screening');
  };

  const renderProgramDetails = (programList: typeof likelyPrograms) =>
    programList.map((result) => (
      <div key={result.programId}>
        <ProgramCard result={result} />

        <AIExplanation
          programName={result.content.name}
          expertDescription={result.content.description}
          expertNextSteps={result.content.nextSteps}
          whatItCovers={result.content.whatItCovers}
          familyContext={familyContext}
        />

        {result.content.nextSteps.length > 0 && (
          <div className="mt-4">
            <ActionPlan
              steps={result.content.nextSteps}
              title={`How to apply for ${result.content.name}`}
            />
          </div>
        )}

        {result.content.requiredDocuments.length > 0 && (
          <div className="mt-4">
            <DocumentChecklist
              documents={result.content.requiredDocuments}
              programName={result.content.name}
            />
          </div>
        )}
      </div>
    ));

  // --- Tab content ---

  const overviewContent = (
    <div>
      <header className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Your Benefit Recommendations
        </h2>
        <p className="text-lg text-muted-foreground">
          Based on what you shared about your family, here are the programs
          that may help.
        </p>
        <p className="text-base text-muted-foreground mt-3">
          Navigating these programs is hard — you are not the only family
          working through this. You do not have to figure everything out
          today, and you do not have to do it alone. Start with what feels
          most important to your family right now.
        </p>
      </header>

      {actionSteps.length > 0 && (
        <div className="mb-8">
          <ActionPlan steps={actionSteps} title="Your Action Plan" />
        </div>
      )}

      {results.benefitInteractions.length > 0 && (
        <div className="mb-8">
          <BenefitInteractions interactions={results.benefitInteractions} />
        </div>
      )}

      {eligiblePrograms.length > 0 && (
        <section>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Programs You May Qualify For
          </h3>
          <div className="space-y-3">
            {eligiblePrograms.map((result) => (
              <ProgramSummaryCard
                key={result.programId}
                result={result}
                onViewDetails={goToPrograms}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const programsContent = (
    <div>
      {likelyPrograms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
            Programs You Likely Qualify For
          </h2>
          <div className="space-y-6">{renderProgramDetails(likelyPrograms)}</div>
        </section>
      )}

      {possiblePrograms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
            Programs You May Qualify For
          </h2>
          <div className="space-y-6">{renderProgramDetails(possiblePrograms)}</div>
        </section>
      )}

      {unlikelyPrograms.length > 0 && (
        <section className="mb-8">
          <Card>
            <CardContent className="p-card-padding">
              <details>
                <summary className="text-lg font-heading font-semibold text-foreground cursor-pointer flex items-center gap-2">
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  Other Programs (based on your answers, these may not apply)
                </summary>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Your situation may change, or you might have additional needs
                  that qualify you for these programs. Click a program to learn
                  more.
                </p>
                <div className="space-y-4 mt-4">
                  {unlikelyPrograms.map((result) => (
                    <ProgramCard key={result.programId} result={result} />
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );

  const documentsContent = (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <ClipboardList className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Documents You&apos;ll Need
        </h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Gather these documents to speed up your applications.
      </p>

      {eligiblePrograms.length > 0 ? (
        <div className="space-y-6">
          {eligiblePrograms
            .filter((r) => r.content.requiredDocuments.length > 0)
            .map((result) => (
              <DocumentChecklist
                key={result.programId}
                documents={result.content.requiredDocuments}
                programName={result.content.name}
              />
            ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No document checklists available.</p>
      )}
    </div>
  );

  const resourcesContent = (
    <div>
      <ResourceDirectory
        eligibleProgramIds={eligibleProgramIds}
        familyContext={familyContext}
        stateCode={results.state}
      />
      {!isAuthenticated && (
        <div className="mt-8">
          <AccountPrompt />
        </div>
      )}
    </div>
  );

  const whatIfContent = (
    <WhatIfPanel
      programs={results.programs}
      currentIncome={formData.monthlyIncome || 0}
    />
  );

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', content: overviewContent },
    { id: 'programs', label: 'Programs', content: programsContent },
    { id: 'documents', label: 'Documents', content: documentsContent },
    { id: 'resources', label: 'Resources', content: resourcesContent },
    { id: 'what-if', label: 'What If?', content: whatIfContent },
  ];

  return (
    <div className="py-section">
      <div className="max-w-4xl mx-auto">
        {/* Page title */}
        <h1 className="text-3xl font-heading font-bold text-foreground mb-6">
          Your Personalized Results
        </h1>

        {/* Partial coverage banner for federal-only states */}
        {results.coverageLevel === 'federal-only' && (
          <StateCoverageBanner
            stateCode={results.state}
            stateName={getStateName(results.state)}
            coverageLevel="federal-only"
          />
        )}

        {/* Tabbed content */}
        <TabNav
          tabs={tabs}
          defaultTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Actions */}
        <Separator className="mt-8 mb-6" />
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button variant="secondary" onClick={handleStartOver}>
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Start Over
          </Button>
          <DownloadPDFButton
            results={results.programs}
            interactions={results.benefitInteractions}
          />
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 shrink-0" />
          <p>
            This screening is for informational purposes only. Final eligibility
            is determined by the program administrators.
          </p>
        </div>

        {/* Clear data */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleClearData}
          >
            Clear My Data
          </Button>
        </div>
      </div>
    </div>
  );
}
