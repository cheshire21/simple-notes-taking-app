# Simple Notes Taking App

A full-stack notes-taking app where users can register, log in, and manage notes organized by categories. Each user has their own private notes and categories.

---

## Process & Decisions

### How it was built

The project was structured as a monorepo from the start, with a fully decoupled Django backend and Next.js frontend communicating via REST API.

**Backend** was bootstrapped with a Python virtualenv and Django 4.2 + DRF. Key decisions:

- **Services / Selectors pattern** — all DB reads in `selectors.py`, all writes in `services.py`, views stay thin
- **Ruff** for linting and formatting
- **drf-spectacular** for auto-generated Swagger UI docs
- **JWT authentication** via `djangorestframework-simplejwt`
- **PostgreSQL** as the database, wired through Docker Compose

**Frontend** was bootstrapped with Next.js 16 + React 19 + TypeScript. Key decisions:

- **Feature-based structure** — each domain (`auth`, `notes`, `categories`) is self-contained with its own components, hooks, API calls, schemas, and types
- **shadcn/ui + Tailwind CSS v4** for UI primitives and design tokens
- **React Hook Form + Zod** for forms and validation
- **TanStack Query + Axios** for server state, caching, and API calls
- **Context Provider** (`AuthProvider`) to manage `access_token` / `refresh_token` in `localStorage` via `useSyncExternalStore` (SSR-safe, no flash)
- **SOLID principles** applied to component design — each component has a single responsibility; skeleton, error, and base variants are separated into sibling files within the same folder
- **ESLint + Prettier** for code style, **Vitest + React Testing Library** for unit tests

### AI-assisted development with Claude Code

**Claude Code** was used as the primary development environment throughout the project. Features were built through a structured, human-guided workflow:

1. **Planning with `/shape-spec`** — before any code was written, scope was defined using the shape-spec skill. This produced spec docs saved in `agent-os/specs/` covering the plan, shaping decisions, applicable standards, and code references.
2. **Ticket management** — a `project-manager` agent connected to **Linear** to move tickets through the pipeline (Todo → In Progress → Done) around engineer work.
3. **Implementation** — a `nextjs-engineer` agent and a `django-engineer` agent implemented features following architecture rules and best practices documented in `.claude/skills/`.
4. **Quality assurance** — a `qa-engineer` agent verified done criteria directly against the code after each implementation, checking off criteria in Linear before the PM closed the ticket.
5. **Standards and skills** — architecture rules, coding conventions, and component patterns were captured in skill files under `.claude/skills/` and `agent-os/standards/`. These were referenced by agents in every session to ensure consistency across the codebase.
6. **Human review loop** — each agent output was manually reviewed. Corrections and feedback were brought back to Claude Code, which updated the relevant skill files and agent behaviour. This iterative loop — implement → review → correct → improve skills — progressively raised the quality and autonomy of AI output across the project.

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Django 4.2, Django REST Framework
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.12+ (for local backend dev)

## Getting Started with Docker

**1. Clone the repository**

```bash
git clone https://github.com/cheshire21/simple-notes-taking-app
cd simple-notes-taking-app
```

**2. Set up the backend environment**

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your values:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

POSTGRES_DB=notes_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

**3. Start all containers**

```bash
docker-compose up --build
```

**4. Run migrations**

```bash
docker-compose exec notes-backend python manage.py migrate
```

**5. Run seed data (optional)**

```bash
docker-compose exec notes-backend python manage.py seed
```

This creates a default user and categories:

| Field    | Value           |
|----------|-----------------|
| Email    | coren@gmail.com |
| Password | Coren2197       |

**6. (Optional) Create an admin user**

```bash
docker-compose exec notes-backend python manage.py createsuperuser
```

The app is now running at:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8000>
- Django Admin: <http://localhost:8000/admin>

## Local Development (without Docker)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in values, set POSTGRES_HOST=localhost
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Useful Commands

### Backend

```bash
docker-compose exec notes-backend python manage.py makemigrations
docker-compose exec notes-backend python manage.py migrate
docker-compose exec notes-backend python manage.py seed
docker-compose exec notes-backend python manage.py createsuperuser
docker-compose exec notes-backend python manage.py test
```

### Frontend

```bash
npm run lint          # ESLint
npm run format        # Prettier
npm run format:check  # Check formatting without writing
npm run build         # Production build
```

## Testing

### Backend (requires Docker running)

```bash
docker exec notes-backend python manage.py test
```

With coverage:

```bash
docker exec notes-backend pip install coverage -q
docker exec notes-backend coverage run --source=categories,notes,users manage.py test
docker exec notes-backend coverage report
```

### Frontend (requires Docker running)

```bash
docker exec notes-frontend npm run test -- --run
```

With coverage:

```bash
docker exec notes-frontend npm run test -- --run --coverage
```
