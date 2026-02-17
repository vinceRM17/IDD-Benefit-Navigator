# Requirements: IDD Benefits Navigator

**Defined:** 2026-02-16
**Core Value:** Parents and caregivers can understand exactly what benefits apply to their situation and know precisely what steps to take, in what order, to access them.

## v1.1 Requirements

Requirements for UI/UX redesign. Visual refresh only — same features, elevated experience.

### Foundation

- [ ] **FOUN-01**: Design system uses shadcn/ui components with Radix UI accessibility primitives
- [ ] **FOUN-02**: Custom theme with distinctive typography (not Inter/Arial/generic), cohesive color palette, and CSS variables
- [ ] **FOUN-03**: Animation system with meaningful page transitions and micro-interactions (CSS + Motion library)
- [ ] **FOUN-04**: Responsive design tokens enforcing mobile-first consistency across all breakpoints

### Layout

- [ ] **LAYO-01**: Header redesigned with distinctive branding, polished navigation, and auth controls
- [ ] **LAYO-02**: Footer redesigned with consistent visual identity and clear link hierarchy
- [ ] **LAYO-03**: Page structure uses consistent spacing, max-widths, and visual rhythm across all routes

### Home Page

- [ ] **HOME-01**: Hero section with empowering messaging, distinctive visual treatment, and clear CTA
- [ ] **HOME-02**: How-it-works and programs sections with engaging layout and visual storytelling

### Screening Flow

- [ ] **SCRN-01**: Screening landing page redesigned with encouraging tone and clear expectations
- [ ] **SCRN-02**: Intake steps (1-3) use polished form components with progress indicator and warm visual design
- [ ] **SCRN-03**: Review page presents answers in a clear, scannable, confidence-building layout
- [ ] **SCRN-04**: Pending/loading page uses engaging animation while evaluation processes

### Results

- [ ] **RSLT-01**: Results overview with visually clear benefit recommendations and confidence indicators
- [ ] **RSLT-02**: Program detail cards redesigned with hierarchy, readability, and empowering presentation
- [ ] **RSLT-03**: Action plan and document checklists use clear visual progression and interactive feedback
- [ ] **RSLT-04**: Resource directory and partner information presented with trust signals and clear CTAs

### Auth & Dashboard

- [ ] **ACCT-01**: Login and signup pages redesigned with welcoming, low-friction visual treatment
- [ ] **ACCT-02**: Dashboard redesigned with clear screening summary, history, and quick actions
- [ ] **ACCT-03**: Referral tracking and settings pages use consistent card-based design with status indicators

### Supporting Pages

- [ ] **PAGE-01**: Referral submission and confirmation pages use encouraging, trust-building design
- [ ] **PAGE-02**: Privacy and accessibility pages use readable typography and clear section hierarchy

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### State Expansion

- **STATE-01**: User can select additional states beyond Kentucky for screening
- **STATE-02**: Rules engine loads state-specific configuration dynamically

### Partner Experience

- **PARTNER-01**: Partner organizations can view and manage incoming referrals via web portal
- **PARTNER-02**: Automated follow-up nudges sent for unopened referrals

### Ongoing Guidance

- **GUIDE-01**: User receives alerts when eligibility rules change
- **GUIDE-02**: System tracks recertification dates and proactively reminds users

## Out of Scope

| Feature | Reason |
|---------|--------|
| Feature changes or new functionality | v1.1 is visual-only — same features, better presentation |
| Native mobile app | Web app responsive design serves all devices |
| Backend/API changes | No data model or API changes needed for visual refresh |
| Content rewrites | Same copy and messaging, just better visual treatment |
| New benefit programs | Program content unchanged in v1.1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 5 | Pending |
| FOUN-02 | Phase 5 | Pending |
| FOUN-03 | Phase 5 | Pending |
| FOUN-04 | Phase 5 | Pending |
| LAYO-01 | Phase 6 | Pending |
| LAYO-02 | Phase 6 | Pending |
| LAYO-03 | Phase 6 | Pending |
| HOME-01 | Phase 6 | Pending |
| HOME-02 | Phase 6 | Pending |
| SCRN-01 | Phase 7 | Pending |
| SCRN-02 | Phase 7 | Pending |
| SCRN-03 | Phase 7 | Pending |
| SCRN-04 | Phase 7 | Pending |
| RSLT-01 | Phase 8 | Pending |
| RSLT-02 | Phase 8 | Pending |
| RSLT-03 | Phase 8 | Pending |
| RSLT-04 | Phase 8 | Pending |
| ACCT-01 | Phase 9 | Pending |
| ACCT-02 | Phase 9 | Pending |
| ACCT-03 | Phase 9 | Pending |
| PAGE-01 | Phase 9 | Pending |
| PAGE-02 | Phase 9 | Pending |

**Coverage:**
- v1.1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-02-16*
*Last updated: 2026-02-16 — traceability mapped to Phases 5-9*
