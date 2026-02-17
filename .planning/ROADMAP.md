# Roadmap: IDD Benefits Navigator

## Milestones

- SHIPPED **v1.0 MVP** — Phases 1-4 (shipped 2026-02-12)
- **v1.1 UI/UX Redesign** — Phases 5-9 (in progress)

## Phases

<details>
<summary>SHIPPED v1.0 MVP (Phases 1-4) — SHIPPED 2026-02-12</summary>

- [x] Phase 1: Foundation & Compliance (4/4 plans) — completed 2026-02-12
- [x] Phase 2: Core Screening MVP (4/4 plans) — completed 2026-02-12
- [x] Phase 3: Enhanced Experience (6/6 plans) — completed 2026-02-12
- [x] Phase 4: Partnership Integration (4/4 plans) — completed 2026-02-12

</details>

---

### v1.1 UI/UX Redesign (In Progress)

**Milestone Goal:** Transform every page from functional to beautiful — friendly, empowering, and distinctive. Visual refresh only; no feature or backend changes.

- [ ] **Phase 5: Design System Foundation** - Install shadcn/ui, define custom theme, and establish the animation and token system all pages will build on
- [ ] **Phase 6: Layout and Home Page** - Redesign the persistent shell (header, footer, page structure) and the home page that every visitor sees first
- [ ] **Phase 7: Screening Flow** - Redesign every step of the intake and evaluation journey — from landing through the loading state
- [ ] **Phase 8: Results Pages** - Redesign the recommendations, program details, action plans, and resource directory
- [ ] **Phase 9: Auth, Dashboard, and Supporting Pages** - Redesign the account surfaces (login, signup, dashboard, settings, referral tracking) and the utility pages (privacy, accessibility, referral confirmation)

---

## Phase Details

### Phase 5: Design System Foundation

**Goal**: The visual and interaction foundation exists so that all subsequent pages can use shared components, tokens, and animations without reinventing them.
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04
**Success Criteria** (what must be TRUE):
  1. shadcn/ui components render correctly and Radix accessibility primitives are active across the app
  2. A custom font, color palette, and CSS variable theme are applied globally — no generic Inter/Arial/system defaults visible
  3. Page transitions and at least one micro-interaction (e.g., button hover, focus ring) animate using the Motion library
  4. The same component looks correct and proportional on mobile, tablet, and desktop without manual per-page fixes
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md — Install shadcn/ui with custom Nunito typography, warm teal/amber CSS variable theme, and 5 core UI components (FOUN-01, FOUN-02)
- [ ] 05-02-PLAN.md — Motion animation system with shared presets, PageTransition wrapper, responsive spacing tokens, and CSS keyframes (FOUN-03, FOUN-04)

---

### Phase 6: Layout and Home Page

**Goal**: Every page shares a polished, branded shell and the home page delivers the app's first impression with clarity and visual energy.
**Depends on**: Phase 5
**Requirements**: LAYO-01, LAYO-02, LAYO-03, HOME-01, HOME-02
**Success Criteria** (what must be TRUE):
  1. The header shows distinctive branding and polished navigation on every page, with auth controls (login/logout) visible and accessible
  2. The footer is visually consistent with the header and has a clear, scannable link hierarchy
  3. All pages share consistent max-widths, section spacing, and visual rhythm — no page feels structurally out of place
  4. The home page hero communicates the app's purpose immediately, with a CTA that feels encouraging rather than transactional
  5. The how-it-works and programs sections tell a visual story — a visitor can understand the product without reading every word
**Plans**: TBD

Plans:
- [ ] 06-01: Header and footer redesign (LAYO-01, LAYO-02)
- [ ] 06-02: Page structure tokens and home page (LAYO-03, HOME-01, HOME-02)

---

### Phase 7: Screening Flow

**Goal**: The intake and evaluation journey feels warm, supportive, and confidence-building at every step — from the screening landing page through the processing state.
**Depends on**: Phase 6
**Requirements**: SCRN-01, SCRN-02, SCRN-03, SCRN-04
**Success Criteria** (what must be TRUE):
  1. The screening landing page communicates what to expect and why it's safe to proceed — tone is encouraging, not clinical
  2. Each intake step (1-3) uses polished form components with a visible progress indicator so the user always knows where they are
  3. The review page presents submitted answers in a scannable layout the user feels confident checking before submitting
  4. The pending/loading page shows meaningful animation that reduces anxiety during the evaluation wait
**Plans**: TBD

Plans:
- [ ] 07-01: Screening landing and intake steps 1-3 (SCRN-01, SCRN-02)
- [ ] 07-02: Review page and pending state (SCRN-03, SCRN-04)

---

### Phase 8: Results Pages

**Goal**: The results experience is the product's most important moment — it must present benefit recommendations with unmistakable clarity and give families a sense of empowerment and next steps.
**Depends on**: Phase 7
**Requirements**: RSLT-01, RSLT-02, RSLT-03, RSLT-04
**Success Criteria** (what must be TRUE):
  1. The results overview lets a user immediately understand which benefits apply to their situation and at what confidence level
  2. Program detail cards present information with clear visual hierarchy — key facts are scannable, not buried in prose
  3. Action plan and document checklist steps show visual progression — a user can see what is done versus what remains
  4. The resource directory and partner section convey trust — organization names, contact info, and CTAs are clearly differentiated
**Plans**: TBD

Plans:
- [ ] 08-01: Results overview and program detail cards (RSLT-01, RSLT-02)
- [ ] 08-02: Action plans, checklists, and resource directory (RSLT-03, RSLT-04)

---

### Phase 9: Auth, Dashboard, and Supporting Pages

**Goal**: Account-related and utility pages are visually consistent with the rest of the app — login and signup feel welcoming, the dashboard is actionable at a glance, and supporting pages are readable and trustworthy.
**Depends on**: Phase 8
**Requirements**: ACCT-01, ACCT-02, ACCT-03, PAGE-01, PAGE-02
**Success Criteria** (what must be TRUE):
  1. The login and signup pages feel low-friction and welcoming — no intimidating forms or generic UI
  2. The dashboard shows a user's screening history and quick actions without visual clutter
  3. Referral tracking and settings pages use consistent card-based layout with clear status indicators
  4. The referral submission and confirmation pages feel encouraging — a user submitting a referral feels good about the action
  5. Privacy and accessibility pages use readable typography and clear section headings — information is easy to find and scan
**Plans**: TBD

Plans:
- [ ] 09-01: Login, signup, and dashboard redesign (ACCT-01, ACCT-02)
- [ ] 09-02: Referral tracking, settings, and supporting pages (ACCT-03, PAGE-01, PAGE-02)

---

## Progress

**Execution Order:** 5 → 6 → 7 → 8 → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Compliance | v1.0 | 4/4 | Complete | 2026-02-12 |
| 2. Core Screening MVP | v1.0 | 4/4 | Complete | 2026-02-12 |
| 3. Enhanced Experience | v1.0 | 6/6 | Complete | 2026-02-12 |
| 4. Partnership Integration | v1.0 | 4/4 | Complete | 2026-02-12 |
| 5. Design System Foundation | v1.1 | 0/2 | Not started | - |
| 6. Layout and Home Page | v1.1 | 0/2 | Not started | - |
| 7. Screening Flow | v1.1 | 0/2 | Not started | - |
| 8. Results Pages | v1.1 | 0/2 | Not started | - |
| 9. Auth, Dashboard, and Supporting Pages | v1.1 | 0/2 | Not started | - |

---
*Roadmap created: 2026-02-11*
*v1.0 shipped: 2026-02-12*
*v1.1 roadmap added: 2026-02-16*
*Full v1.0 details: .planning/milestones/v1.0-ROADMAP.md*
