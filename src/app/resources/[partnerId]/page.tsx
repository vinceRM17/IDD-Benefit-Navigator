import { partnerOrganizations } from '@/content/resources/partners';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ partnerId: string }>;
}

export async function generateStaticParams() {
  return partnerOrganizations.map((org) => ({
    partnerId: org.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { partnerId } = await params;
  const partner = partnerOrganizations.find((org) => org.id === partnerId);

  if (!partner) {
    return {
      title: 'Organization Not Found | IDD Benefits Navigator',
    };
  }

  return {
    title: `${partner.name} | IDD Benefits Navigator`,
    description: partner.description,
  };
}

export default async function PartnerDetailPage({ params }: PageProps) {
  const { partnerId } = await params;

  const partner = partnerOrganizations.find((org) => org.id === partnerId);

  if (!partner) {
    notFound();
  }

  // Map program IDs to readable names
  const programNames: Record<string, string> = {
    'ky-medicaid': 'Medicaid',
    'ky-michelle-p-waiver': 'Michelle P. Waiver',
    'ky-hcb-waiver': 'Home and Community Based Waiver',
    'ky-scl-waiver': 'Supports for Community Living Waiver',
    'ky-ssi': 'SSI',
    'ky-ssdi': 'SSDI',
    'ky-snap': 'SNAP',
  };

  return (
    <div className="max-w-4xl mx-auto py-section">
      {/* Back Link */}
      <Link
        href="/screening/results"
        className="text-primary hover:text-primary/80 mb-6 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Results
      </Link>

      {/* Organization Name */}
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">{partner.name}</h1>

      {/* Extended Description */}
      <div className="mb-8">
        <p className="text-foreground/80 whitespace-pre-line">
          {partner.extendedDescription || partner.description}
        </p>
      </div>

      {/* Services Offered */}
      <section className="mb-8">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-3">
          Services Offered
        </h2>
        <ul className="list-disc list-inside space-y-2">
          {partner.services.map((service, idx) => (
            <li key={idx} className="text-foreground/80">
              {service}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          <span className="font-medium">Programs they can help with:</span>{' '}
          {partner.relevantPrograms
            .map((programId) => programNames[programId] || programId)
            .join(', ')}
        </p>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-3">
          Contact Information
        </h2>
        <Card>
          <CardContent className="p-card-padding space-y-3">
            <p className="inline-flex items-center gap-2 text-foreground/80">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${partner.phone}`}
                className="text-primary hover:text-primary/80"
              >
                {partner.phone}
              </a>
            </p>
            {partner.email && (
              <p className="inline-flex items-center gap-2 text-foreground/80">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${partner.email}`}
                  className="text-primary hover:text-primary/80"
                >
                  {partner.email}
                </a>
              </p>
            )}
            <p className="inline-flex items-center gap-2 text-foreground/80">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                {partner.website.replace(/^https?:\/\//, '')}
                <span className="sr-only"> (opens in new window)</span>
              </a>
            </p>
            {partner.address && (
              <p className="inline-flex items-center gap-2 text-foreground/80">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {partner.address}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Service Area */}
      <section className="mb-8">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-3">
          Service Area
        </h2>
        <p className="text-foreground/80 inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {partner.servesArea}
        </p>
      </section>

      {/* Hours */}
      {partner.hours && (
        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-3">
            Hours of Operation
          </h2>
          <p className="text-foreground/80 inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {partner.hours}
          </p>
        </section>
      )}

      <Separator className="mb-8" />

      {/* Request a Referral CTA */}
      {partner.email ? (
        <Button asChild size="lg">
          <a href={`/referral?partner=${partnerId}`}>
            Request a Referral
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </a>
        </Button>
      ) : (
        <Card className="bg-muted">
          <CardContent className="p-card-padding">
            <p className="font-heading font-semibold text-foreground mb-2">Contact Them Directly</p>
            <p className="text-foreground/80 text-sm mb-3">
              This organization doesn&apos;t have an email address on file, so we can&apos;t send
              an electronic referral. Please contact them directly using the phone number
              above.
            </p>
            <Button asChild>
              <a href={`tel:${partner.phone}`}>
                <Phone className="h-4 w-4 mr-1.5" />
                Call {partner.phone}
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
