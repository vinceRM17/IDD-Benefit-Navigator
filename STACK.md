# Technology Stack

**Analysis Date:** 2026-02-11

## Languages

**Primary:**
- Python 3 - Backend application code, server logic, database models, and utilities

## Runtime

**Environment:**
- Python 3.9+ (verified with 3.14.3)

**Package Manager:**
- pip - Dependency management
- Lockfile: `requirements.txt` present

## Frameworks

**Core:**
- Flask 3.1.0 - Web framework for HTTP routing, request handling, and application structure

**Database:**
- Flask-SQLAlchemy 3.1.1 - ORM for database abstraction and model definition
- Flask-Migrate 4.1.0 - Database migrations and schema management

**Authentication & Authorization:**
- Flask-Login 0.6.3 - User session management and login/logout functionality

**Forms & Validation:**
- Flask-WTF 1.2.2 - Form handling, CSRF protection, and data validation
- email-validator 2.1.1 - Email format validation

**Email:**
- Flask-Mail 0.10.0 - SMTP integration for sending transactional and alert emails

**Scheduling:**
- APScheduler 3.10.4 - Job scheduling and recurring task execution

**HTTP Client:**
- requests 2.32.5 - HTTP client library for external API calls

**GraphQL:**
- gql[requests] 4.0.0 - GraphQL client for communicating with Jobber GraphQL API

**Configuration:**
- python-dotenv 1.0.1 - Environment variable management

**Server:**
- waitress 3.0.0 - Production WSGI application server

## Key Dependencies

**Critical:**
- Flask 3.1.0 - Foundational web framework, all other extensions depend on Flask
- Flask-SQLAlchemy 3.1.1 - Persistence layer, enables all database operations
- requests 2.32.5 - Required for Jobber API integration via HTTP

**Infrastructure:**
- APScheduler 3.10.4 - Powers background job sync from Jobber
- Flask-Mail 0.10.0 - Enables low-stock alert emails to users
- gql[requests] 4.0.0 - Jobber GraphQL API client for job data synchronization

## Configuration

**Environment:**
- Configuration loaded from `config.py` with three environments: DevelopmentConfig, ProductionConfig, TestingConfig
- Environment variables loaded from `.env` file using `python-dotenv`
- Configuration classes inherit from `BaseConfig` and can override settings

**Build:**
- Flask development server: `python run.py` - runs on localhost:5001 with DEBUG=True
- Production server: Configured to use Waitress WSGI server (`waitress`)
- Flask-Migrate: `flask db` commands for schema management

**Required Environment Variables:**
- `SECRET_KEY` - Flask session signing key (defaults to 'change-me-in-production' if not set)
- `MAIL_SERVER` - SMTP server host (defaults to 'smtp.gmail.com')
- `MAIL_PORT` - SMTP port (defaults to 587)
- `MAIL_USE_TLS` - TLS encryption flag (defaults to true)
- `MAIL_USERNAME` - SMTP authentication username
- `MAIL_PASSWORD` - SMTP authentication password
- `MAIL_DEFAULT_SENDER` - Default email sender address

**Database:**
- Default: SQLite at `instance/lwc_inventory.db`
- Configurable via `SQLALCHEMY_DATABASE_URI` in config
- Migrations stored in `migrations/versions/` directory

## Platform Requirements

**Development:**
- Python 3.9+
- pip for dependency installation
- Virtual environment (venv in `venv/` directory)
- SQLite (included with Python)

**Production:**
- Python 3.9+
- SMTP server access (Gmail or custom)
- Persistent filesystem for SQLite database OR external PostgreSQL/MySQL
- Network access to Jobber API endpoints

---

*Stack analysis: 2026-02-11*
