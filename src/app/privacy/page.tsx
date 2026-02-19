import type { Metadata } from 'next';
import Link from 'next/link';
import { privacyPolicy, lastUpdated } from './privacy-content';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Benefits Navigator',
  description:
    'Learn how we collect, use, and protect your personal information during the benefits screening process.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-section">
      <div className="max-w-3xl mx-auto">
        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="px-8 py-10">
            <article aria-label="Privacy policy content">
              <header className="mb-8 pb-6">
                <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
                  Privacy Policy
                </h1>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated}
                </p>
                <Separator className="mt-6" />
              </header>

              <div className="mb-10 text-lg text-foreground/80 leading-relaxed">
                <p>
                  Your privacy matters to us. This policy explains what information
                  we collect, how we use it, and how we protect it. We are
                  committed to transparency and putting you in control of your
                  data.
                </p>
              </div>

              <div className="space-y-10">
                {privacyPolicy.map((section) => (
                  <section key={section.id} id={section.id}>
                    <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <div className="text-lg text-foreground/80 leading-relaxed space-y-4 whitespace-pre-line">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              <Separator className="mt-12 mb-8" />
              <footer>
                <p className="text-sm text-muted-foreground">
                  This privacy policy is designed to be clear and understandable.
                  If you have questions about any section, please{' '}
                  <a
                    href="mailto:privacy@benefits-navigator.example.com"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    contact us
                  </a>
                  .
                </p>
              </footer>
            </article>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
