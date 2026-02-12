# Architecture

**Analysis Date:** 2026-02-11

## Pattern Overview

**Overall:** Modular Flask application with blueprint-based routing, service layer abstraction, and SQLAlchemy ORM for data persistence.

**Key Characteristics:**
- Blueprint-based modular architecture for feature separation
- Application factory pattern using `create_app()` for flexible configuration
- Service layer for business logic encapsulation
- SQLAlchemy ORM with relationships for data modeling
- Jinja2 template rendering for server-side views
- Role-based access control (owner, general manager, warehouse manager)

## Layers

**Presentation Layer (Views & Templates):**
- Purpose: Render HTML templates and handle HTTP requests
- Location: `app/templates/` and blueprint `routes.py` files
- Contains: Jinja2 HTML templates, route handlers, form rendering
- Depends on: Models, services, forms, Flask request/response
- Used by: Web browsers, HTTP clients

**Application/Controller Layer (Blueprints & Routes):**
- Purpose: Define API endpoints, validate requests, coordinate business logic
- Location: `app/{auth,inventory,jobs,items,admin,dashboard,audit}/routes.py`
- Contains: Route handlers decorated with `@blueprint.route()`, form validation, request handling
- Depends on: Models, services, forms, Flask extensions
- Used by: Web browser requests, AJAX calls

**Business Logic Layer (Services):**
- Purpose: Encapsulate domain logic and external integrations
- Location: `app/services/`
- Contains: `inventory_service.py` (check-in/check-out), `jobber_service.py` (Jobber API), `alert_service.py` (threshold alerts)
- Depends on: Models, extensions (db)
- Used by: Routes, scheduled tasks

**Data Access Layer (Models):**
- Purpose: Define data structure and persistence
- Location: `app/models/`
- Contains: SQLAlchemy model classes with relationships and computed properties
- Depends on: SQLAlchemy extension, datetime utilities
- Used by: Services, routes, migrations

**Infrastructure Layer (Extensions & Configuration):**
- Purpose: Initialize and manage Flask extensions and application config
- Location: `app/extensions.py`, `config.py`, `app/__init__.py`
- Contains: SQLAlchemy, Flask-Login, CSRF, Mail, Migrate initialization
- Depends on: Flask and third-party libraries
- Used by: All application layers

## Data Flow

**Inventory Check-In/Check-Out Flow:**

1. User submits form from `inventory/check_in.html` or `check_out.html`
2. Route handler in `app/inventory/routes.py` receives request
3. Form validation via `CheckInForm`/`CheckOutForm` (WTForms)
4. Service method (`inventory_service.check_in()` or `check_out()`) processes business logic
5. Service creates Transaction record and updates Item quantity
6. Alert service checks if item falls below threshold
7. Database commit persists changes
8. Response redirected to form page with flash message

**Job Staging Flow:**

1. Jobs synced from Jobber API via `jobber_service` GraphQL queries
2. Jobs with tomorrow's scheduled date displayed in staging view
3. Crew members pick materials (JobMaterial records) from inventory
4. Material pick recorded as checked-out transaction
5. Job staging completion triggers status update
6. Job-to-inventory relationship via JobMaterial join table

**State Management:**

- **Session State:** Flask-Login maintains authenticated user via session cookie
- **Database State:** SQLAlchemy manages all persistent data (Users, Items, Jobs, Transactions, Alerts)
- **Application State:** AppSetting model stores configuration (Jobber tokens, email settings)
- **Request State:** Flask `g` object and thread-local request context for current_user

## Key Abstractions

**Models (Data Entities):**
- `User`: Represents users with roles (owner, gm, warehouse_manager)
- `Item`: Inventory item with quantity tracking and threshold alerts
- `Category`: Groups items for organization and filtering
- `Transaction`: Audit log of inventory movements (check-in/check-out)
- `Job`: Work order with scheduled date, crew, and materials
- `JobMaterial`: Join table linking jobs to items with quantity tracking
- `Alert`: Inventory threshold alerts that trigger when stock is low
- `AppSetting`: Key-value store for app configuration
- Examples: `app/models/item.py`, `app/models/job.py`, `app/models/user.py`
- Pattern: SQLAlchemy declarative models with relationships and computed properties

**Services (Business Logic):**
- `inventory_service`: Handles check-in/check-out with transaction recording
- `jobber_service`: Manages OAuth with Jobber API and GraphQL queries
- `alert_service`: Monitors thresholds and creates alerts
- Pattern: Module-level functions that operate on models and extensions

**Forms (Input Validation):**
- WTForms for server-side validation
- Location: `app/{inventory,auth,jobs,items,admin}/forms.py`
- Pattern: Class-based forms with field validators and CSRF protection

**Blueprints (Feature Modules):**
- Authentication: Login/logout, user management
- Inventory: Item listing, check-in, check-out
- Jobs: Job listing, staging, material picking
- Items: Item CRUD operations
- Admin: User management, settings, integrations
- Audit: Transaction history and logging
- Dashboard: Overview and statistics
- Pattern: Each blueprint has `__init__.py`, `routes.py`, `forms.py`

## Entry Points

**Application Startup:**
- Location: `run.py`
- Triggers: `python run.py` or production WSGI server
- Responsibilities: Load environment config, instantiate app via `create_app()`, start Flask development server on port 5001

**Factory Function:**
- Location: `app/__init__.py` - `create_app(config_class)`
- Triggers: Called by `run.py` and tests
- Responsibilities: Initialize extensions, register blueprints, configure login manager, register CLI commands

**Blueprint Registration:**
- Location: `app/__init__.py` registration block (lines 19-39)
- Blueprints registered: auth, dashboard, inventory, items, audit, admin, jobs
- URL prefixes: inventory (`/inventory`), items (`/items`), audit (`/audit`), admin (`/admin`), jobs (`/jobs`)

## Error Handling

**Strategy:** Flask exception handling with user-friendly flash messages and HTTP status codes.

**Patterns:**
- **Form Validation Errors:** Captured via `form.validate_on_submit()`, displayed as flash messages with 'danger' category
- **Resource Not Found:** SQLAlchemy's `query.get_or_404()` returns 404 responses
- **Business Logic Errors:** Services raise `ValueError` (e.g., insufficient inventory), caught in routes and converted to flash messages
- **Authentication Errors:** Flask-Login redirects unauthenticated requests to login with 'warning' flash message
- **API Errors:** Jobber integration catches request exceptions and handles token refresh (401 auto-retry in `jobber_service._graphql_request()`)

## Cross-Cutting Concerns

**Logging:** Flask built-in logging via `current_app.logger`; audit trail maintained via Transaction model. Mail logging available via Flask-Mail configuration.

**Validation:** WTForms validators on form classes, field-level validators on Item model (e.g., `is_below_threshold` property), inventory quantity validation in services.

**Authentication:** Flask-Login provides `@login_required` decorator and `current_user` proxy. User roles checked via `is_owner`, `is_admin` properties. Login view configured at `auth.login`.

**Authorization:** Role-based via route-level checks (routes can call `current_user.is_admin`); decorators in `app/utils/decorators.py` available for reuse.

**CSRF Protection:** Flask-WTF CSRF tokens automatically included in forms and validated; `csrf.init_app()` protects all POST requests.

**Database Transactions:** SQLAlchemy session handles implicit transaction commits; `db.session.add()` and `db.session.commit()` manage persistence. Alert checks occur after inventory commits to ensure data consistency.

---

*Architecture analysis: 2026-02-11*
