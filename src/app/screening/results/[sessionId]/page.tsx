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
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Tab } from '@/components/results/TabNav';

export default function ResultsPage() {
  const router = useRouter();
  const { results, formData, reset } = useScreeningStore();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Handle client-side mounting and check auth status
  useEffect(() => {
    setMounted(true);
    // Lightweight auth check — 401 means anonymous
    fetch('/api/screenings')
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // If no results, redirect to screening start
  useEffect(() => {
    if (mounted && !results) {
      router.push('/screening');
    }
  }, [mounted, results, router]);

  // Switch to Programs tab (used by summary card "View details" links)
  const goToPrograms = useCallback(() => setActiveTab('programs'), []);

  if (!mounted || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your results...</p>
      </div>
    );
  }

  // Group programs by confidence level
  const likelyPrograms = results.programs.filter((p) => p.confidence === 'likely');
  const possiblePrograms = results.programs.filter((p) => p.confidence === 'possible');
  const unlikelyPrograms = results.programs.filter((p) => p.confidence === 'unlikely');
  const eligiblePrograms = [...likelyPrograms, ...possiblePrograms];

  // Get eligible program IDs for resource filtering
  const eligibleProgramIds = results.programs
    .filter((p) => p.eligible && (p.confidence === 'likely' || p.confidence === 'possible'))
    .map((p) => p.programId);

  // Generate overall action plan
  const actionSteps = results.programs
    .filter((p) => p.confidence === 'likely' || p.confidence === 'possible')
    .flatMap((p) => p.content.nextSteps);

  // Build family context for AI personalization from form data
  const familyContext = {
    householdSize: formData.householdSize || 1,
    monthlyIncome: formData.monthlyIncome || 0,
    hasDisabilityDiagnosis: formData.hasDisabilityDiagnosis || false,
    age: formData.age || 0,
    hasInsurance: formData.hasInsurance || false,
    insuranceType: formData.insuranceType,
    receivesSSI: formData.receivesSSI,
    receivesSNAP: formData.receivesSNAP,
    state: formData.state || results.state || 'KY',
  };

  const handleStartOver = () => {
    reset();
    router.push('/screening');
  };

  // Helper to render full program details (used in Programs tab)
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
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Benefit Recommendations
        </h2>
        <p className="text-lg text-gray-600">
          Based on what you shared about your family, here are the programs
          that may help.
        </p>
      </header>

      {/* Overall Action Plan */}
      {actionSteps.length > 0 && (
        <div className="mb-8">
          <ActionPlan steps={actionSteps} title="Your Action Plan" />
        </div>
      )}

      {/* Benefit Interactions */}
      {results.benefitInteractions.length > 0 && (
        <div className="mb-8">
          <BenefitInteractions interactions={results.benefitInteractions} />
        </div>
      )}

      {/* Summary cards */}
      {eligiblePrograms.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
      {/* Likely Eligible Programs */}
      {likelyPrograms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Programs You Likely Qualify For
          </h2>
          <div className="space-y-6">{renderProgramDetails(likelyPrograms)}</div>
        </section>
      )}

      {/* Possibly Eligible Programs */}
      {possiblePrograms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Programs You May Qualify For
          </h2>
          <div className="space-y-6">{renderProgramDetails(possiblePrograms)}</div>
        </section>
      )}

      {/* Unlikely Programs (collapsed by default) */}
      {unlikelyPrograms.length > 0 && (
        <section className="mb-8">
          <details className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
              Other Programs (based on your answers, these may not apply)
            </summary>
            <p className="text-sm text-gray-600 mt-2 mb-4">
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
        </section>
      )}
    </div>
  );

  const documentsContent = (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Documents You&apos;ll Need
      </h2>
      <p className="text-gray-600 mb-6">
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
        <p className="text-gray-600">No document checklists available.</p>
      )}
    </div>
  );

  const resourcesContent = (
    <div>
      <ResourceDirectory
        eligibleProgramIds={eligibleProgramIds}
        familyContext={familyContext}
      />
      {!isAuthenticated && (
        <div className="mt-8">
          <AccountPrompt />
        </div>
      )}
    </div>
  );

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', content: overviewContent },
    { id: 'programs', label: 'Programs', content: programsContent },
    { id: 'documents', label: 'Documents', content: documentsContent },
    { id: 'resources', label: 'Resources', content: resourcesContent },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Your Personalized Results
        </h1>

        {/* Tabbed content */}
        <TabNav
          tabs={tabs}
          defaultTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Actions — always visible outside tabs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <button
            onClick={handleStartOver}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Start Over
          </button>
          <DownloadPDFButton
            results={results.programs}
            interactions={results.benefitInteractions}
          />
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            This screening is for informational purposes only. Final eligibility
            is determined by the program administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
