# IDD Benefits Navigator

## What This Is

A web application that helps parents and caregivers of people with intellectual and developmental disabilities (IDD) understand and access the benefits they're entitled to. Guides families through a conversational screening, evaluates eligibility for Medicaid, waiver programs, SSI/SSDI, and SNAP using expert-curated Kentucky rules, provides AI-personalized explanations, and connects families to partner organizations through closed-loop referrals.

## Core Value

Parents and caregivers can understand exactly what benefits apply to their situation and know precisely what steps to take, in what order, to access them.

## Current State

**Version:** v1.0 MVP (shipped 2026-02-12)
**Codebase:** 10,692 LOC TypeScript across 121 files
**Tech Stack:** Next.js 15, Drizzle ORM, Neon PostgreSQL, Postmark, Claude API, Zustand, Zod, Tailwind CSS
**Launch State:** Kentucky (7 benefit programs)

## Requirements

### Validated

- ✓ Guided conversational intake with empathy — v1.0
- ✓ Personalized benefit recommendations based on family circumstances — v1.0
- ✓ Medicaid eligibility guidance — v1.0
- ✓ Waiver program identification (HCB, SCL, MPW) — v1.0
- ✓ Private insurance coordination guidance — v1.0
- ✓ Step-by-step action plans for applying to recommended benefits — v1.0
- ✓ State-agnostic framework with Kentucky as launch state — v1.0
- ✓ Hybrid knowledge system (expert-curated rules + AI explanations) — v1.0
- ✓ Secure handling of sensitive personal, health, and financial data — v1.0
- ✓ Optional user accounts with anonymous-first design — v1.0
- ✓ Web-based access on any device — v1.0
- ✓ Closed-loop partner referrals with consent framework — v1.0

### Active

**v1.1 UI/UX Redesign:**
- [ ] Design system foundation (shadcn/ui + custom theme)
- [ ] Distinctive typography, color palette, and visual identity
- [ ] Full page redesign across all routes — friendly, empowering tone
- [ ] Meaningful animations and micro-interactions
- [ ] Mobile-first responsive polish

### Out of Scope

- Ongoing tracking, renewals, and eligibility change monitoring — v2 feature
- Native mobile app — web app serves all devices
- Org/staff-facing tools — built for families, not case workers
- Direct benefits application submission — guides the process but doesn't file on behalf
- Legal advice — guidance only, not legal counsel
- Partner portal for managing incoming referrals — v2+
- Automated follow-up nudges for unopened referrals — v2+

## Context

- Problem observed across multiple Kentucky nonprofits serving IDD populations: KAIA, Southwest Center, Mattingly Edge, Best Buddies KY
- Parents face information overload, no clear starting point, and risk of bad/outdated advice leading to costly mistakes
- The benefits landscape is complex: Medicaid eligibility, waiver programs, private insurance coordination, and coverage optimization all interrelate
- v1.0 built and verified across 4 phases (18 plans) in a single day
- 6 partner organizations included: KAIA, Southwest CIL, Mattingly Edge, Best Buddies KY, KY DCBS, SSA Kentucky
- Person-first IDD terminology audited across all user-facing content

## Constraints

- **Data Privacy**: Handles sensitive health and financial information — HIPAA-adjacent security, encryption at rest/transit
- **Accuracy**: Benefit eligibility rules are expert-curated and verified — wrong guidance has real consequences
- **Tone**: Empathetic and accessible — not clinical, not bureaucratic
- **Architecture**: State-agnostic framework — adding a state requires only rule configuration
- **Launch State**: Kentucky first — leveraging existing org relationships

## Current Milestone: v1.1 UI/UX Redesign

**Goal:** Transform every page from functional to beautiful — friendly, empowering, and distinctive. Same features, elevated experience.

**Target features:**
- shadcn/ui component library as accessible foundation
- Custom design system with distinctive typography, color palette, and animations
- Full visual redesign of all pages (home, screening flow, results, auth, dashboard)
- Frontend-design plugin guiding bold, intentional aesthetics
- No feature changes — visual refresh only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| shadcn/ui + custom theme for v1.1 | Accessible Radix primitives + Tailwind styling = polished base to customize | — Pending |
| Friendly & empowering design tone | Families in crisis need encouragement, not clinical interfaces | — Pending |
| Visual-only refresh (no feature changes) | Keep scope tight, ship fast, validate design before adding features | — Pending |
| Hybrid knowledge system (expert-curated + AI) | Critical eligibility rules can't be hallucinated; AI adds adaptability | ✓ Good — expert rules ensure accuracy, Claude Sonnet provides personalization |
| Web app (not native mobile) | Lower barrier to access, works on any device | ✓ Good — responsive design works well |
| Optional accounts | Removes barrier for families in crisis while rewarding return users | ✓ Good — anonymous screening works fully, accounts add history/reminders |
| State-agnostic architecture, KY first | Enables future expansion without rebuilding | ✓ Good — JSON rules engine extensible |
| Drizzle ORM + Neon PostgreSQL | Type-safe, serverless-friendly database | ✓ Good — lazy Proxy pattern solved build issues |
| JWT sessions with jose | Lightweight auth without external dependencies | ✓ Good — 30-day expiry, OWASP-compliant |
| Postmark for transactional email | Reliable delivery, built-in open tracking | ✓ Good — reminders and referrals both working |
| Fire-and-forget for non-critical ops | Don't block user experience for background tasks | ✓ Good — auto-save and email sending non-blocking |
| Email-based partner referrals | Partners are small orgs that work via email/phone | ✓ Good — simple, no portal needed for v1 |
| Person-first IDD terminology | Respect and dignity for families | ✓ Good — terminology reference created, content audited |

---
*Last updated: 2026-02-16 after v1.1 milestone start*
