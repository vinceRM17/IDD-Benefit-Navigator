'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
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
  Building2,
  Briefcase,
  PiggyBank,
  GraduationCap,
  Baby,
  UserCheck,
} from 'lucide-react';

const programKeys = [
  { nameKey: 'medicaid', descKey: 'medicaidDesc', icon: Stethoscope },
  { nameKey: 'hcbWaiver', descKey: 'hcbWaiverDesc', icon: HomeIcon },
  { nameKey: 'sclWaiver', descKey: 'sclWaiverDesc', icon: Users },
  { nameKey: 'mpwWaiver', descKey: 'mpwWaiverDesc', icon: FileHeart },
  { nameKey: 'ssiSsdi', descKey: 'ssiSsdiDesc', icon: HandCoins },
  { nameKey: 'snap', descKey: 'snapDesc', icon: UtensilsCrossed },
  { nameKey: 'section8', descKey: 'section8Desc', icon: Building2 },
  { nameKey: 'vocRehab', descKey: 'vocRehabDesc', icon: Briefcase },
  { nameKey: 'ableAccount', descKey: 'ableAccountDesc', icon: PiggyBank },
  { nameKey: 'supportedEmployment', descKey: 'supportedEmploymentDesc', icon: UserCheck },
  { nameKey: 'childcareAssistance', descKey: 'childcareAssistanceDesc', icon: Baby },
  { nameKey: 'specialEducation', descKey: 'specialEducationDesc', icon: GraduationCap },
] as const;

const stepIcons = [ClipboardList, Search, CheckCircle2];
const trustIcons = [Shield, BadgeCheck, Heart];

export default function Home() {
  const t = useTranslations('common');

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-accent/5 to-transparent py-section">
        <div className="max-w-3xl mx-auto px-page-x text-center">
          <Badge variant="warm" className="mb-4 text-sm">
            {t('footer.freeForAllFamilies')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4 text-balance leading-tight">
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            {t('home.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/screening">
                {t('buttons.startScreening')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {t('home.noAccountNote')}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-section">
        <div className="max-w-4xl mx-auto px-page-x">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
            {t('home.howItWorks')}
          </h2>
          <p className="text-muted-foreground text-center mb-section max-w-xl mx-auto">
            {t('home.howItWorksSubtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => {
              const Icon = stepIcons[num - 1];
              return (
                <div key={num} className="text-center">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold mb-3">
                    {num}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    {t(`home.step${num}Title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(`home.step${num}Desc`)}
                  </p>
                </div>
              );
            })}
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
            {t('home.programsTitle')}
          </h2>
          <p className="text-muted-foreground text-center mb-section max-w-xl mx-auto">
            {t('home.programsSubtitle')}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {programKeys.map((program) => (
              <Card key={program.nameKey} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <program.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{t(`home.${program.nameKey}`)}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{t(`home.${program.descKey}`)}</p>
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
            {t('home.trustTitle')}
          </h2>
          <p className="text-muted-foreground text-center mb-section max-w-xl mx-auto">
            {t('home.trustSubtitle')}
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {(['Private', 'Expert', 'Person'] as const).map((key, i) => {
              const Icon = trustIcons[i];
              return (
                <div key={key} className="text-center">
                  <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {t(`home.trust${key}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`home.trust${key}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-secondary py-section">
        <div className="max-w-2xl mx-auto px-page-x text-center">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('home.ctaSubtitle')}
          </p>
          <Button size="lg" className="text-base px-8" asChild>
            <Link href="/screening">
              {t('buttons.beginScreening')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
