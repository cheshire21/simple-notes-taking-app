# Tech Stack

## Frontend

- **Next.js 16** — App Router, Server and Client Components
- **React 19** — UI library
- **TypeScript** — type safety throughout
- **Tailwind CSS v4** — utility-first styling
- **@tanstack/react-query** — server state management and data fetching
- **axios** — HTTP client with JWT interceptors and silent token refresh

## Backend

- **Django 4.2** — web framework
- **Django REST Framework** — REST API layer
- **djangorestframework-simplejwt** — JWT authentication (access + refresh tokens)
- **django-cors-headers** — CORS handling
- **django-filter** — queryset filtering
- **factory-boy** — test data factories

## Database

- **PostgreSQL** — primary database

## Architecture

- **Backend pattern**: Services / Selectors (HackSoft style) — business logic in services, queries in selectors, thin views
- **Frontend pattern**: Feature-based — pages are thin, logic lives in `features/`
- **Auth**: JWT tokens stored in `localStorage` (`access_token`, `refresh_token`), silent refresh on 401

## Design

- **Figma**: https://www.figma.com/design/nIqpRyEWKPYqYsW7RMfi3S/Notes-Taking-App-Challenge

## Project Management

- **Linear** — task tracking, phases as milestones, tasks as issues
- **Agents**: `django-engineer` (BE), `nextjs-engineer` (FE), `project-manager` (coordination)
