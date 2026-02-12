import { partnerOrganizations } from '@/content/resources/partners';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/screening/results"
        className="text-blue-700 hover:underline mb-6 inline-block"
      >
        &larr; Back to Results
      </Link>

      {/* Organization Name */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{partner.name}</h1>

      {/* Extended Description */}
      <div className="mb-8">
        <p className="text-gray-700 whitespace-pre-line">
          {partner.extendedDescription || partner.description}
        </p>
      </div>

      {/* Services Offered Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Services Offered
        </h2>
        <ul className="list-disc list-inside space-y-2">
          {partner.services.map((service, idx) => (
            <li key={idx} className="text-gray-700">
              {service}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600 mt-3">
          <span className="font-medium">Programs they can help with:</span>{' '}
          {partner.relevantPrograms
            .map((programId) => {
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
              return programNames[programId] || programId;
            })
            .join(', ')}
        </p>
      </section>

      {/* Contact Information Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Contact Information
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Phone:</strong>{' '}
            <a
              href={`tel:${partner.phone}`}
              className="text-blue-600 hover:underline"
            >
              {partner.phone}
            </a>
          </p>
          {partner.email && (
            <p>
              <strong>Email:</strong>{' '}
              <a
                href={`mailto:${partner.email}`}
                className="text-blue-600 hover:underline"
              >
                {partner.email}
              </a>
            </p>
          )}
          <p>
            <strong>Website:</strong>{' '}
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {partner.website.replace(/^https?:\/\//, '')}
              <span className="sr-only"> (opens in new window)</span>
            </a>
          </p>
          {partner.address && (
            <p>
              <strong>Address:</strong> {partner.address}
            </p>
          )}
        </div>
      </section>

      {/* Service Area Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Service Area
        </h2>
        <p className="text-gray-700">{partner.servesArea}</p>
      </section>

      {/* Hours of Operation (if available) */}
      {partner.hours && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Hours of Operation
          </h2>
          <p className="text-gray-700">{partner.hours}</p>
        </section>
      )}

      {/* Request a Referral CTA */}
      {partner.email ? (
        <a
          href={`/referral?partner=${partnerId}`}
          className="inline-block bg-blue-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Request a Referral
        </a>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-900 font-medium mb-2">Contact Them Directly</p>
          <p className="text-gray-700 text-sm mb-3">
            This organization doesn't have an email address on file, so we can't send
            an electronic referral. Please contact them directly using the phone number
            above.
          </p>
          <a
            href={`tel:${partner.phone}`}
            className="inline-block bg-blue-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Call {partner.phone}
          </a>
        </div>
      )}
    </div>
  );
}
