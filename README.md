# Estate CRM

A Real Estate CRM built with **Django REST Framework** and **React**.
The project has two panels: a public panel where visitors browse listed properties and send inquiries, and an admin panel where agency staff manage properties, customers, visits, contracts, and daily activities.

---

## Research Paper

This project is presented and discussed in the following research paper:

[**Read the Research Paper**](https://medium.com/@amirhoseinparsa1234/building-estate-crm-a-full-stack-real-estate-management-platform-with-django-and-react-861dc37e3ba9?sharedUserId=abolfazldehghanpoorr)

---

## Features

* JWT authentication with httpOnly refresh-token cookie
* Agency-based data isolation (single-agency-per-installation model)
* Role-based access (manager / agent / customer)
* Property management with images, videos, and favorites
* Property type, transaction type (sale / rent / mortgage), and status (available / reserved / sold) tracked independently
* Rent-specific pricing (deposit + monthly rent) shown wherever relevant
* Customer, visit, contract, and activity management
* Visit calendar and activity timeline
* Public panel: property listing, property details, contact/inquiry form
* Real dashboard with agency statistics
* Reports with modern charts and Excel/PDF export (RTL, Persian)
* Team management (single manager per agency, agents added from Settings → Team)
* Advanced filtering, debounced search, ordering, URL-synced filters
* Image validation and compression on upload
* Rate limiting on login and public inquiries
* Audit log for create/update/delete actions
* Dark and light theme, fully responsive (desktop, tablet, mobile)

---

## Tech Stack

**Backend:** Python 3.12, Django 6, Django REST Framework, SimpleJWT (httpOnly cookie), Django Filter, drf-spectacular, SQLite (default) or PostgreSQL, Redis (optional cache), Gunicorn, WhiteNoise, Pillow, openpyxl, reportlab.

**Frontend:** React 19, Vite, Material UI (RTL), TanStack React Query, React Router, Recharts, Axios.

**Infrastructure:** Docker Compose (PostgreSQL 17, Redis 7, backend, Nginx serving the built frontend).

---

## Project Structure

```
Estate-Web
├── backend
│   ├── config          settings, urls, wsgi
│   ├── users  agencies  properties  customers
│   ├── visits  contracts  activities
│   ├── dashboard  reports  public  audit  core
│   ├── loadtest        Locust load-test scripts
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── manage.py
├── frontend
│   ├── src
│   ├── public          fonts and static assets
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .env.docker.example
```

---

# Option A: Run with Docker (recommended)

## Requirements

* Docker Desktop (Windows / macOS) or Docker Engine + Compose plugin (Linux)

Nothing else needs to be installed. Python, Node, PostgreSQL and Redis all run in containers.

## 1. Create the environment file

Linux / macOS

```bash
cp .env.docker.example .env
```

Windows (PowerShell)

```powershell
Copy-Item .env.docker.example .env
```

Open `.env` and change at least:

* `SECRET_KEY` — a random string of **50+ characters**. Generate one with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

* `DB_PASSWORD` — any strong password.

Other values:

| Variable | Meaning |
| --- | --- |
| `DEBUG` | Keep `False` for Docker. |
| `ENABLE_SSL` | `False` for local use over http. Set `True` only behind HTTPS. |
| `ALLOWED_HOSTS` | Comma-separated hostnames the backend accepts. |
| `CORS_ALLOWED_ORIGINS` | The URL users open in the browser, e.g. `http://localhost:8080`. |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Used both to create PostgreSQL and to connect to it. |

The real `.env` file is git-ignored. Never commit it.

## 2. Build and start

```bash
docker compose up -d --build
```

On first start the backend waits for the database, applies migrations and collects static files automatically.

Check that everything is running:

```bash
docker compose ps
docker compose logs -f backend
```

## 3. Create the first account

```bash
docker compose exec backend python manage.py create_agency_owner --agency-name "My Agency" --username owner --password "A-Strong-Password-1"
```

This creates the agency and its first manager. That account is also a Django superuser.

## 4. Open the app

| What | URL |
| --- | --- |
| Public site | http://localhost:8080/ |
| Admin panel login | http://localhost:8080/admin/login |
| Django admin | http://localhost:8080/django-admin/ |
| API docs (staff only) | http://localhost:8080/api/docs/ |
| Backend directly | http://localhost:8000 |

Note: `/admin/*` belongs to the React admin panel. The Django admin lives at `/django-admin/`.

## Everyday Docker commands

```bash
docker compose up -d                 # start
docker compose down                  # stop (data is kept)
docker compose logs -f backend       # follow backend logs
docker compose up -d --build         # rebuild after code changes
docker compose build frontend        # rebuild only the frontend
docker compose exec backend python manage.py test    # run backend tests
docker compose down -v               # stop AND delete all data (database, uploads)
```

Data lives in named volumes: `postgres_data` (database), `media_data` (uploaded files), `static_data`.

## Backup and restore the database

```bash
docker compose exec db pg_dump -U estate_user estate_db > backup.sql
```

Restore into a fresh database:

```bash
docker compose exec -T db psql -U estate_user estate_db < backup.sql
```

Use the `DB_USER` and `DB_NAME` from your `.env`. Back up the `media_data` volume as well, since it holds uploaded images and videos.

---

# Option B: Run without Docker

## Requirements

* Python 3.12+
* Node.js 20+ and npm
* Git
* PostgreSQL is optional. SQLite is used by default.

You need two terminals: one for the backend, one for the frontend.

## Backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

Windows (PowerShell)

```powershell
.venv\Scripts\Activate.ps1
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install packages

```bash
pip install -r requirements.txt
```

Create `backend/.env` from the example

```bash
cp .env.example .env
```

Windows (PowerShell)

```powershell
Copy-Item .env.example .env
```

Default values (SQLite):

```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
DB_ENGINE=sqlite3
DB_NAME=db.sqlite3
```

To use PostgreSQL instead:

```env
DB_ENGINE=postgresql
DB_NAME=estate_db
DB_USER=estate_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```

The PostgreSQL database and user must already exist.

`SECRET_KEY` must be a long random string. When `DEBUG=False`, the app refuses to start if it is shorter than 50 characters.

Apply migrations

```bash
python manage.py migrate
```

Create the first account

```bash
python manage.py create_agency_owner --agency-name "My Agency" --username owner --password "A-Strong-Password-1"
```

Do not use `createsuperuser`. It creates a user with no agency, and that user cannot see or manage anything in the app.

Optional flags: `--phone "021xxxxxxx"`, `--address "Agency address"`, `--force` (only to intentionally create a second agency).

Start the server

```bash
python manage.py runserver
```

Backend: http://127.0.0.1:8000

* API docs (staff only): http://127.0.0.1:8000/api/docs/
* Django admin: http://127.0.0.1:8000/django-admin/

## Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` from the example

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the dev server

```bash
npm run dev
```

## Open the app

| What | URL |
| --- | --- |
| Public site | http://localhost:5173/ |
| Admin panel login | http://localhost:5173/admin/login |

Log in with the account created by `create_agency_owner`.

## Build the frontend for production

```bash
npm run build
```

The output is in `frontend/dist`. For production serving, use the Docker setup or serve `dist` with Nginx using `frontend/nginx.conf` as a reference.

---

# Useful Commands

```bash
python manage.py makemigrations      # after changing a model
python manage.py migrate
python manage.py test                # backend tests
npm run lint                         # frontend lint
npm run build                        # frontend production build
```

---

# Environment Files

| File | Used for |
| --- | --- |
| `.env` (project root) | Docker Compose. Copy from `.env.docker.example`. |
| `backend/.env` | Backend without Docker. Copy from `backend/.env.example`. |
| `frontend/.env` | Frontend dev server. Copy from `frontend/.env.example`. |

All real `.env` files are git-ignored.

---

# Media Files

Uploaded files are stored in `backend/media` (a Docker volume when using Docker). During development Django serves media automatically. In production, Nginx serves `/media/` directly.

---

# Production Notes

* Set `DEBUG=False`, a long random `SECRET_KEY`, and real `ALLOWED_HOSTS` / `CORS_ALLOWED_ORIGINS`.
* Put the app behind HTTPS and set `ENABLE_SSL=True`. Also add your https origin to `CSRF_TRUSTED_ORIGINS` if you use the Django admin on a domain.
* Rate limits are per client IP. `NUM_PROXIES` (set to `1` in `docker-compose.yml`) must equal the number of reverse proxies in front of Django. If you add Cloudflare or a load balancer, raise it, otherwise every user appears to have the same IP and gets throttled together.
* In `docker-compose.yml`, the database port `5433` and backend port `8000` are published for convenience. Remove those `ports` entries on a public server.
* Back up the database and the media volume regularly.

---

# Load Testing

Locust scripts are in `backend/loadtest`.

```bash
pip install locust
cd backend/loadtest
locust -f locustfile.py --host http://localhost:8000
```

Then open http://localhost:8089. Keep rate limiting enabled while testing. A realistic test sends a different `X-Forwarded-For` per simulated user, because limits are per IP.

---

# Troubleshooting

**Login returns 403 after an update.** An old Django session cookie is still in the browser. Clear the site's cookies (or open a private window) and sign in again.

**Refreshing the admin panel opens the Django login page.** The Django admin moved to `/django-admin/`. Rebuild with `docker compose up -d --build` so the new Nginx config is used.

**Frontend changes do not appear (Docker).** Rebuild the image: `docker compose build frontend`, then `docker compose up -d`, and hard-refresh the browser (`Ctrl+Shift+R`).

**Login works but the dashboard is empty.** The account has no agency assigned. Only accounts created with `create_agency_owner` (manager) or added later from Settings → Team (agent) are properly scoped. A user created with the plain `createsuperuser` command will not work correctly in the app.

**Backend packages are missing.** Run `pip install -r requirements.txt` inside the virtual environment.

**Frontend packages are missing.** Run `npm install`.

**Database changes are not applied.** Run `python manage.py makemigrations` and `python manage.py migrate`.

**`could not connect to server` / `password authentication failed`.** The `.env` does not match a real database and user. Check that `DB_ENGINE=postgresql`, the service is running, and `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` are correct. With Docker, `DB_HOST` is set automatically. If you changed `DB_PASSWORD` after the first start, the old password is still stored in the volume; run `docker compose down -v` to reset (this deletes data).

**Images are not displayed.** Make sure the backend is running and `VITE_API_URL` points to it (non-Docker).

**CORS errors.** `CORS_ALLOWED_ORIGINS` must exactly match the URL in the browser's address bar, including the port, e.g. `http://localhost:5173` (dev) or `http://localhost:8080` (Docker).

**Port already in use.** Change the left side of the mapping in `docker-compose.yml`, e.g. `"8081:80"`.

---

## License

PolyForm Noncommercial License 1.0.0 — free for personal, educational, and research use; commercial use (including resale or paid deployment for a client) is not permitted. See the `LICENSE` file for the full text.