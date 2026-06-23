# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack notes app: **Next.js 16** frontend + **Django 4.2** + **Django REST Framework** backend.

## Architecture

```
simple-notes-taking-app/
├── frontend/   # Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
└── backend/    # Django 4.2 + DRF, SQLite (dev)
```

The frontend and backend are fully decoupled. The frontend calls the backend via REST API. CORS is handled by `django-cors-headers`.

## Backend

**Setup:**
```bash
cd backend
source venv/bin/activate
```

**Run dev server:**
```bash
python manage.py runserver
```

**Common commands:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py test                    # run all tests
python manage.py test <app>.tests.<TestClass>  # run a single test
```

**Environment:** Uses `python-decouple` — copy `.env.example` to `.env` and fill in values. Required keys: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`.

**Adding a new Django app:**
```bash
python manage.py startapp <appname>
```
Then register it in `core/settings.py` `INSTALLED_APPS` and wire its URLs in `core/urls.py`.

## Frontend

> **Important:** This project uses Next.js 16 with React 19 — APIs and conventions differ from older versions. Read `node_modules/next/dist/docs/` before writing any Next.js code.

**Run dev server:**
```bash
cd frontend
npm run dev
```

**Other commands:**
```bash
npm run build   # production build
npm run lint    # ESLint
```
