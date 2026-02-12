import React from 'react';
import { Document, Page, Text, View, Link } from '@react-pdf/renderer';
import { styles } from './PDFStyles';
import { EnrichedResult, BenefitInteraction } from '@/lib/results/types';

interface ActionPlanDocumentProps {
  results: EnrichedResult[];
  interactions: BenefitInteraction[];
  generatedAt: string;
}

/**
 * PDF document template for benefit action plan
 *
 * Generates a printable, plain-language action plan for families
 * showing eligible programs, next steps, and required documents.
 */
export function ActionPlanDocument({
  results,
  interactions,
  generatedAt,
}: ActionPlanDocumentProps) {
  // Filter for programs to include in PDF (likely and possible only)
  const includedPrograms = results.filter(
    (r) => r.eligible && (r.confidence === 'likely' || r.confidence === 'possible')
  );

  // Get unlikely programs for exclusion note
  const unlikelyPrograms = results.filter(
    (r) => r.confidence === 'unlikely'
  );

  const formattedDate = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Personalized Benefit Action Plan</Text>
          <Text style={styles.generatedDate}>Generated on {formattedDate}</Text>
          <Text style={styles.bodyText}>
            Based on your family's situation, you may be eligible for the following programs:
          </Text>
        </View>

        {/* Quick Summary List */}
        <View style={styles.quickList}>
          {includedPrograms.map((result, index) => (
            <Text key={result.programId} style={styles.listItem}>
              {index + 1}. {result.content.name} ({result.confidence === 'likely' ? 'Likely eligible' : 'May be eligible'})
            </Text>
          ))}
        </View>

        {/* Benefit Interactions (if any) */}
        {interactions.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>How These Programs Work Together</Text>
            {interactions.map((interaction, index) => (
              <View key={index} style={styles.interactionBox} wrap={false}>
                <Text style={styles.interactionTitle}>
                  {interaction.programs.map(id =>
                    results.find(r => r.programId === id)?.content.name || id
                  ).join(' + ')}
                </Text>
                <Text style={styles.bodyText}>{interaction.description}</Text>
                <Text style={styles.bodyText}>{interaction.recommendation}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Per-Program Details */}
        {includedPrograms.map((result, index) => (
          <View key={result.programId} style={styles.programSection} break={index > 0}>
            <Text style={styles.programName} minPresenceAhead={100}>
              {result.content.name}
            </Text>
            <View style={result.confidence === 'likely' ? styles.badgeLikely : styles.badgePossible} wrap={false}>
              <Text>{result.confidence === 'likely' ? 'Likely Eligible' : 'May Be Eligible'}</Text>
            </View>

            {/* Description */}
            <Text style={styles.bodyText}>{result.content.description}</Text>

            {/* What It Covers */}
            <Text style={styles.sectionTitle} minPresenceAhead={100}>What It Covers</Text>
            {result.content.whatItCovers.map((item, idx) => (
              <Text key={idx} style={styles.listItem}>• {item}</Text>
            ))}

            {/* Next Steps */}
            <Text style={styles.sectionTitle} minPresenceAhead={100}>Your Next Steps</Text>
            {result.content.nextSteps.map((step, idx) => (
              <Text key={idx} style={styles.listItem}>
                <Text style={styles.stepNumber}>{idx + 1}.</Text> {step}
              </Text>
            ))}

            {/* Required Documents */}
            <Text style={styles.sectionTitle} minPresenceAhead={100}>Documents You'll Need</Text>
            {result.content.requiredDocuments.map((doc, idx) => (
              <Text key={idx} style={styles.documentItem}>☐ {doc}</Text>
            ))}

            {/* Application Info */}
            <View style={{ marginTop: 8 }} wrap={false}>
              <Text style={styles.bodyText}>
                Apply online: <Link src={result.content.applicationUrl} style={styles.link}>
                  {result.content.applicationUrl}
                </Link>
              </Text>
              {result.content.applicationPhone && (
                <Text style={styles.bodyText}>
                  Phone: {result.content.applicationPhone}
                </Text>
              )}
            </View>

            {/* Waitlist Info (if applicable) */}
            {result.content.waitlistInfo && (
              <View style={{ marginTop: 6, backgroundColor: '#fef3c7', padding: 8, borderRadius: 4 }} wrap={false}>
                <Text style={{ fontSize: 10, color: '#92400e', fontWeight: 'bold' }}>
                  Important:
                </Text>
                <Text style={{ fontSize: 10, color: '#92400e' }}>
                  {result.content.waitlistInfo}
                </Text>
              </View>
            )}

            {/* Insurance Coordination (if applicable) */}
            {result.content.insuranceCoordination && (
              <View style={{ marginTop: 6, backgroundColor: '#eff6ff', padding: 8, borderRadius: 4 }} wrap={false}>
                <Text style={{ fontSize: 10, color: '#1a5d55', fontWeight: 'bold' }}>
                  If you have private insurance:
                </Text>
                <Text style={{ fontSize: 10, color: '#1a5d55' }}>
                  {result.content.insuranceCoordination}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Excluded Programs Note */}
        {unlikelyPrograms.length > 0 && (
          <Text style={styles.excludedNote}>
            Other programs reviewed but not included based on your answers: {unlikelyPrograms.map(p => p.content.name).join(', ')}
          </Text>
        )}

        {/* Footer Disclaimer */}
        <View style={styles.footer} fixed>
          <Text>
            This is guidance only, not a guarantee of eligibility. Rules change — verify with the listed agencies.
          </Text>
          <Text style={{ marginTop: 4 }}>
            Generated by IDD Benefits Navigator on {formattedDate}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
