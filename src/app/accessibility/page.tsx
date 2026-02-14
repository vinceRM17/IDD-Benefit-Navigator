import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility Statement | Benefits Navigator',
  description:
    'Our commitment to making the IDD Benefits Navigator accessible to all users, including those with disabilities.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <article
          className="bg-white shadow-sm rounded-lg px-8 py-10"
          aria-label="Accessibility statement content"
        >
          <header className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Accessibility Statement
            </h1>
          </header>

          <div className="space-y-10 text-lg text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Commitment
              </h2>
              <p>
                The IDD Benefits Navigator is committed to ensuring digital
                accessibility for people with disabilities. We continually
                improve the user experience for everyone and apply the relevant
                accessibility standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Standards
              </h2>
              <p>
                We aim to conform to the Web Content Accessibility Guidelines
                (WCAG) 2.1 at Level AA. These guidelines explain how to make web
                content more accessible to people with a wide range of
                disabilities, including visual, auditory, physical, speech,
                cognitive, language, learning, and neurological disabilities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Features
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Keyboard navigation support throughout the application</li>
                <li>Skip navigation links for screen reader users</li>
                <li>ARIA labels and roles on interactive elements</li>
                <li>Sufficient color contrast ratios for text readability</li>
                <li>Resizable text without loss of content or functionality</li>
                <li>Clear and simple language at an accessible reading level</li>
                <li>Form labels and error messages for assistive technology</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Feedback
              </h2>
              <p>
                We welcome your feedback on the accessibility of the IDD
                Benefits Navigator. If you encounter accessibility barriers or
                have suggestions for improvement, please contact us. We take
                accessibility feedback seriously and will do our best to respond
                within 2 business days.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
