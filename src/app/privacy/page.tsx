import type { Metadata } from 'next';
import Link from 'next/link';
import { privacyPolicy, lastUpdated } from './privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy | Benefits Navigator',
  description:
    'Learn how we collect, use, and protect your personal information during the benefits screening process.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back to Home Link */}
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

        {/* Main Content */}
        <article
          className="bg-white shadow-sm rounded-lg px-8 py-10"
          aria-label="Privacy policy content"
        >
          {/* Page Title */}
          <header className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated}
            </p>
          </header>

          {/* Introduction */}
          <div className="mb-10 text-lg text-gray-700 leading-relaxed">
            <p>
              Your privacy matters to us. This policy explains what information
              we collect, how we use it, and how we protect it. We are
              committed to transparency and putting you in control of your
              data.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10">
            {privacyPolicy.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="text-lg text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              This privacy policy is designed to be clear and understandable.
              If you have questions about any section, please{' '}
              <a
                href="mailto:privacy@benefits-navigator.example.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                contact us
              </a>
              .
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
