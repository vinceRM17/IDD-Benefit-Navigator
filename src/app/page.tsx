import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Shield,
  BadgeCheck,
  Heart,
  ArrowRight,
  Stethoscope,
  Home as HomeIcon,
  Users,
  HandCoins,
  UtensilsCrossed,
  FileHeart,
} from 'lucide-react';

const programs = [
  { name: 'Medicaid', desc: 'Health coverage based on income and disability', icon: Stethoscope },
  { name: 'HCB Waiver', desc: 'Home and community-based services', icon: HomeIcon },
  { name: 'SCL Waiver', desc: 'Supports for community living', icon: Users },
  { name: 'MPW Waiver', desc: 'Michelle P. Waiver services', icon: FileHeart },
  { name: 'SSI / SSDI', desc: 'Social Security disability benefits', icon: HandCoins },
  { name: 'SNAP', desc: 'Supplemental nutrition assistance', icon: UtensilsCrossed },
];

const steps = [
  {
    number: 1,
    title: 'Answer a Few Questions',
    description: 'Tell us about your family, income, and insurance situation through a simple guided questionnaire.',
    icon: ClipboardList,
  },
  {
    number: 2,
    title: 'See What You Qualify For',
    description: 'Get personalized results showing which benefit programs match your family\'s situation, with plain-language explanations.',
    icon: Search,
  },
  {
    number: 3,
    title: 'Know Exactly What to Do',
    description: 'Receive step-by-step action plans, document checklists, and connections to local organizations that can help.',
    icon: CheckCircle2,
  },
];

const trustSignals = [
  {
    title: 'Private & Secure',
    description: 'Your data is encrypted and never sold. Screen anonymously without an account.',
    icon: Shield,
  },
  {
    title: 'Expert-Verified Rules',
    description: 'Eligibility rules are curated by benefits specialists, not guessed by AI.',
    icon: BadgeCheck,
  },
  {
    title: 'Person-First Approach',
    description: 'Built with dignity and respect for people with disabilities and their families.',
    icon: Heart,
  },
];

export default function Home() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-accent/5 to-transparent py-section">
        <div className="max-w-3xl mx-auto px-page-x text-center">
          <Badge variant="warm" className="mb-4 text-sm">
            Free for Kentucky Families
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4 text-balance leading-tight">
            Find the Benefits Your Family Deserves
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            A free, private tool that helps families of people with
            intellectual and developmental disabilities understand and access
            Medicaid, waiver programs, SSI/SSDI, SNAP, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/screening">
                Start Free Screening
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No account required &middot; Takes about 5 minutes
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-section">
        <div className="max-w-4xl mx-auto px-page-x">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
            How It Works
          </h2>
          <p className="text-muted-foreground text-center mb-section max-w-xl mx-auto">
            Three simple steps to understand your options and take action.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold mb-3">
                  {step.number}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-page-x">
        <Separator />
      </div>

      {/* Programs covered */}
      <section className="py-section">
        <div className="max-w-4xl mx-auto px-page-x">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
            Programs We Cover
          </h2>
          <p className="text-muted-foreground text-center mb-section max-w-xl mx-auto">
            We screen for the major benefit programs available to Kentucky families.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {programs.map((program) => (
              <Card key={program.name} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <program.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{program.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{program.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-page-x">
        <Separator />
      </div>

      {/* Trust signals */}
      <section className="py-section">
        <div className="max-w-4xl mx-auto px-page-x">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
            Built for Families, Not Bureaucracy
          </h2>
          <p className="text-muted-foreground text-center mb-section max-w-xl mx-auto">
            We built this tool with the same care we'd want for our own families.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {trustSignals.map((signal) => (
              <div key={signal.title} className="text-center">
                <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <signal.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{signal.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-secondary py-section">
        <div className="max-w-2xl mx-auto px-page-x text-center">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Currently serving families in Kentucky. More states coming soon.
          </p>
          <Button size="lg" className="text-base px-8" asChild>
            <Link href="/screening">
              Begin Your Free Screening
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
