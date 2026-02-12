# External Integrations

**Analysis Date:** 2026-02-11

## APIs & External Services

**Jobber Job Management Platform:**
- Service: Jobber (https://www.getjobber.com/)
- What it's used for: Sync job scheduling data, customer information, material line items, crew assignments, and job status updates
  - SDK/Client: gql[requests] 4.0.0 (GraphQL client)
  - Auth: OAuth 2.0 with access token and refresh token
  - Configuration keys: `jobber_client_id`, `jobber_client_secret`, `jobber_access_token`, `jobber_refresh_token`
  - Stored in: `app.models.setting.AppSetting` (database)

## Data Storage

**Databases:**
- SQLite (default development/simple production)
  - Connection: `sqlite:///instance/lwc_inventory.db`
  - Client: SQLAlchemy ORM via `Flask-SQLAlchemy 3.1.1`
  - Supports migration to PostgreSQL/MySQL by changing `SQLALCHEMY_DATABASE_URI` in `config.py`

**File Storage:**
- Local filesystem only - static assets in `app/static/` directory

**Caching:**
- None - all data queries execute against live database

## Authentication & Identity

**Auth Provider:**
- Custom implementation (no third-party SSO)
  - Implementation: Username/password with PBKDF2:SHA256 hashing via Werkzeug
  - User model: `app.models.user.User` with role-based access control
  - Session management: Flask-Login with user loader callback
  - Roles: owner, gm (general manager), warehouse_manager
  - Login endpoint: `/login` (redirects to `/dashboard` on success)

**OAuth 2.0 for External Integration:**
- Jobber OAuth integration configured at `app.jobs.routes.jobber_callback`
- Authorization URL: `https://api.getjobber.com/api/oauth/authorize`
- Token endpoint: `https://api.getjobber.com/api/oauth/token`
- Token refresh: Automatic refresh on 401 response from Jobber GraphQL

## Monitoring & Observability

**Error Tracking:**
- None detected - errors logged to Flask app logger

**Logs:**
- Standard Python logging via Flask's `current_app.logger`
- Logged areas: Jobber sync failures, webhook handling errors, email send failures, GraphQL errors
- Example: `app/services/jobber_service.py` lines 105, 202, 274

## CI/CD & Deployment

**Hosting:**
- Flask development server: `python run.py` on port 5001
- Production: Waitress WSGI server (`waitress`)
- No CI/CD pipeline detected

**Infrastructure Code:**
- Database migrations: `migrations/` directory with Flask-Migrate
- Static files: `app/static/` directory
- Templates: `app/templates/` directory

## Environment Configuration

**Required env vars:**
- `SECRET_KEY` - Flask session signing key
- `MAIL_SERVER` - SMTP server (e.g., smtp.gmail.com)
- `MAIL_PORT` - SMTP port (e.g., 587)
- `MAIL_USE_TLS` - Enable TLS (true/false)
- `MAIL_USERNAME` - SMTP username
- `MAIL_PASSWORD` - SMTP password
- `MAIL_DEFAULT_SENDER` - Sender email address (e.g., "LWC Inventory <user@gmail.com>")
- `FLASK_APP` - Set to `run.py` (in `.flaskenv`)
- `FLASK_DEBUG` - Set to `1` for development (in `.flaskenv`)

**Secrets location:**
- `.env` file (local development) - contains environment variables
- `.env.example` - template showing required variables
- Production: Environment variables set in hosting environment (Heroku, Docker, etc.)

## Webhooks & Callbacks

**Incoming:**
- Jobber Webhook: `POST /jobs/jobber/webhook` (CSRF exempt endpoint)
  - Webhook signature verification: HMAC-SHA256 using `client_secret`
  - Handles topics: `JOB_CREATE`, `JOB_UPDATE`, `JOB_COMPLETE`
  - Webhook URL provided to Jobber admin at `app.admin.routes.settings` line 109
  - Implementation: `app.services.jobber_service.verify_webhook_signature()` and `handle_webhook_event()`

**Outgoing:**
- Email alerts: Sends low-stock alerts via SMTP when inventory falls below threshold
  - Triggered by: `app.services.alert_service.send_alert_email()`
  - Recipients: Users with `receive_alerts=True`
  - No external webhook calls detected

## Data Flow: Jobber Synchronization

1. Admin configures Jobber credentials at `app.admin.routes.jobber_save_credentials()` (stores in AppSetting)
2. Admin clicks "Connect to Jobber" → redirects to OAuth authorization URL
3. Jobber redirects back to `app.jobs.routes.jobber_callback()` with authorization code
4. Exchange code for access + refresh tokens via `app.services.jobber_service.exchange_code_for_tokens()`
5. Tokens stored in AppSetting database table
6. Manual sync: POST to `app.jobs.routes.sync()` calls `jobber_service.sync_jobs_from_jobber()`
7. Fetches jobs via GraphQL: `JOBBER_GRAPHQL_URL = https://api.getjobber.com/api/graphql`
8. Parses job data (title, customer, address, materials, crew) and upserts into `app.models.job.Job` table
9. Webhook updates: Jobber sends POST to `/jobs/jobber/webhook` with job changes
10. `handle_webhook_event()` syncs affected jobs back to database

## API Endpoints

**Jobber Endpoints:**
- `https://api.getjobber.com/api/oauth/authorize` - OAuth authorization
- `https://api.getjobber.com/api/oauth/token` - OAuth token exchange/refresh
- `https://api.getjobber.com/api/graphql` - GraphQL API for job data queries

**SMTP Endpoints:**
- Configurable SMTP server (default: `smtp.gmail.com:587`) - Email sending

## Current Integration Status

**Connected:**
- Jobber: Requires OAuth credentials stored in AppSetting (check `/admin/settings/` page for connection status)
- Email: Configured if `MAIL_USERNAME` and `MAIL_PASSWORD` set

**Not Connected:**
- Other third-party APIs
- External data warehousing
- Analytics platforms
- Notification services (Slack, Teams, etc.)

---

*Integration audit: 2026-02-11*
