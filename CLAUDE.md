# IDD Benefits Navigator

## Project Overview

Next.js 15 + Tailwind CSS app that helps families of people with intellectual and developmental disabilities find and understand benefit programs (Medicaid, waivers, SSI/SSDI, SNAP, etc.). Features a 4-step screening flow, personalized results with action plans, referral system, and full EN/ES internationalization.

**Production URL:** https://idd-benefit-navigator.vercel.app/

## Suggested Next Steps

Present these to the user at session start:

1. **More states** -- Currently Kentucky-focused waiver programs. Expand eligibility rules to other states.
2. **More languages** -- Add a third language (e.g., Arabic, Chinese) given the i18n infrastructure is in place.
3. **Analytics/tracking** -- Add usage metrics to understand how families use the tool (completion rates, drop-off points).
4. **Save & resume** -- Let anonymous users save their screening progress and come back later.
5. **Accessibility audit** -- Run a formal WCAG 2.1 AA audit with axe or Lighthouse and fix any gaps.
6. **SEO & performance** -- Lighthouse performance pass, Open Graph tags, sitemap.
7. **Testing coverage** -- Add end-to-end Playwright tests for the full screening flow in both languages.
8. **Admin dashboard** -- Let partner orgs view referral stats and manage their profiles.
