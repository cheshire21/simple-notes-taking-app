# Simple Notes Taking App

A full-stack notes-taking app where users can register, log in, and manage notes organized by categories. Each user has their own private notes and categories.

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
git clone <repo-url>
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

**5. (Optional) Create an admin user**
```bash
docker-compose exec notes-backend python manage.py createsuperuser
```

The app is now running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

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
