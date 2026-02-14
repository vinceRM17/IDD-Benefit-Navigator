# IDD Benefits Navigator

A web application that helps families and caregivers in Kentucky navigate benefit programs for individuals with intellectual and developmental disabilities (IDD). Uses an AI-powered rules engine to screen eligibility across multiple waiver programs.

**Live:** https://codebase-pi-lemon.vercel.app

## Features

- **Multi-Step Screening** — Guided intake form collecting diagnosis, age, income, and living situation
- **Rules Engine** — JSON-based eligibility rules evaluate against HCB Waiver, Michelle P. Waiver, and other Kentucky programs
- **AI Explanations** — Claude-powered plain-language summaries of screening results
- **PDF Reports** — Downloadable screening result reports
- **Referral System** — Submit referrals to partner organizations directly from results
- **User Accounts** — Sign up to save screening history and manage referrals
- **Dashboard** — View past screenings, track referral status, and manage account settings
- **Accessibility** — WCAG 2.1 AA targeted with skip links, ARIA labels, and keyboard navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM |
| AI | Anthropic Claude SDK |
| Auth | Custom (bcrypt + JWT via jose) |
| Email | Postmark + React Email |
| Rules | json-rules-engine |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS |
| Testing | Jest + Testing Library |
| Hosting | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in all values (see Environment Variables below)

# Push schema to database
npm run db:push

# Start dev server
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
  app/
    api/               # API routes (auth, screenings, referrals, AI, PDF)
    auth/              # Login and signup pages
    dashboard/         # User dashboard (history, referrals, settings)
    screening/         # Multi-step intake and results
    referral/          # Referral submission and confirmation
    resources/         # Partner organization pages
    privacy/           # Privacy policy
    accessibility/     # Accessibility statement
  components/
    auth/              # Auth forms and controls
    dashboard/         # Dashboard UI components
    layout/            # Header, Footer, MainLayout
    pdf/               # PDF report templates
    results/           # Screening results display
    screening/         # Intake form components
    ui/                # Reusable UI primitives
  content/
    programs/          # Program definitions (HCB, Michelle P.)
    resources/         # Partner organization data
  lib/
    ai/                # Claude AI integration
    auth/              # Session management, encryption
    audit/             # Logging middleware
    db/                # Schema, connection
    email/             # Postmark email templates
    rules/             # Eligibility rules engine
    screening/         # Screening state management
    security/          # Helmet config, CSRF
    validation/        # Zod schemas
drizzle/               # SQL migration files
```

## Environment Variables

See `.env.example` for required variables:

- `SESSION_SECRET` — Random 64-char string for session signing
- `ENCRYPTION_KEY` — Random 32-char string for data encryption
- `CSRF_SECRET` — Random 32-char string for CSRF protection
- `DATABASE_URL` — Neon PostgreSQL connection string
- `ANTHROPIC_API_KEY` — Claude API key for AI explanations
- `POSTMARK_SERVER_TOKEN` — Postmark API token for emails
- `POSTMARK_FROM_EMAIL` — Sender email address
