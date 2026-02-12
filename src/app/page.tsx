import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-50 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Benefits Your Family Deserves
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A free, private tool that helps Kentucky families of people with
            intellectual and developmental disabilities understand and access
            Medicaid, waiver programs, SSI/SSDI, SNAP, and more.
          </p>
          <Link
            href="/screening"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px]"
          >
            Start Free Screening
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            No account required. Takes about 5 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Answer a Few Questions
            </h2>
            <p className="text-gray-600">
              Tell us about your family, income, and insurance situation through a
              simple guided questionnaire.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              See What You Qualify For
            </h2>
            <p className="text-gray-600">
              Get personalized results showing which benefit programs match your
              family's situation, with plain-language explanations.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Know Exactly What to Do
            </h2>
            <p className="text-gray-600">
              Receive step-by-step action plans, document checklists, and
              connections to local organizations that can help.
            </p>
          </div>
        </div>

        {/* Programs covered */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Programs We Cover
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Medicaid', desc: 'Health coverage based on income and disability' },
              { name: 'HCB Waiver', desc: 'Home and community-based services' },
              { name: 'SCL Waiver', desc: 'Supports for community living' },
              { name: 'MPW Waiver', desc: 'Michelle P. Waiver services' },
              { name: 'SSI / SSDI', desc: 'Social Security disability benefits' },
              { name: 'SNAP', desc: 'Supplemental nutrition assistance' },
            ].map((program) => (
              <div key={program.name} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900">{program.name}</h3>
                <p className="text-sm text-gray-600">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Built for Families, Not Bureaucracy
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Private &amp; Secure</p>
              <p>Your data is encrypted and never sold. Screen anonymously without an account.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Expert-Verified Rules</p>
              <p>Eligibility rules are curated by benefits specialists, not guessed by AI.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Person-First Approach</p>
              <p>Built with dignity and respect for people with disabilities and their families.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-gray-200 pt-8 pb-12">
          <p className="text-gray-600 mb-4">
            Currently serving families in Kentucky. More states coming soon.
          </p>
          <Link
            href="/screening"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
