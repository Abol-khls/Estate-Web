# Estate CRM

A Real Estate CRM built with **Django REST Framework** and **React**.
The project has two panels: a public panel where visitors browse listed properties and send inquiries, and an admin panel where agency staff manage properties, customers, visits, contracts, and daily activities.

---

## Features

* JWT authentication with httpOnly refresh-token cookie
* Agency-based data isolation (Multi-Tenant, single-agency-per-installation model)
* Role-based access (manager / agent / customer)
* Property management with images, videos, and favorites
* Property type, transaction type (sale / rent / mortgage), and status (available / reserved / sold) tracked independently
* Rent-specific pricing (deposit + monthly rent) shown wherever relevant
* Customer, visit, contract, and activity management
* Visit calendar and activity timeline
* Public panel: property listing, property details, contact/inquiry form
* Real dashboard with agency statistics
* Reports with charts and Excel/PDF export (RTL, Persian)
* Team management (single manager per agency, agents added via management command)
* Advanced filtering, debounced search, ordering, URL-synced filters
* Image validation and compression on upload
* Rate limiting on login and public inquiries
* Audit log for create/update/delete actions

---

## Tech Stack

### Backend

* Python 3.12+
* Django 6.0.8
* Django REST Framework
* SimpleJWT (httpOnly cookie based)
* Django Filter
* drf-spectacular (OpenAPI schema, admin-only)
* SQLite (default) or PostgreSQL, switchable via `DB_ENGINE`
* Pillow (image processing)
* openpyxl / reportlab (Excel / PDF export)

### Frontend

* React
* Vite
* Material UI
* Axios
* React Router
* TanStack React Query

---

# Project Structure

```
Estate-Web
│
├── backend
│   ├── config
│   ├── users
│   ├── agencies
│   ├── properties
│   ├── customers
│   ├── visits
│   ├── contracts
│   ├── activities
│   ├── dashboard
│   ├── reports
│   ├── public
│   ├── audit
│   ├── core
│   └── manage.py
│
└── frontend
    ├── src
    ├── public
    └── package.json
```

---

# Requirements

Before running the project install:

* Python 3.12+
* Node.js 20+
* npm
* Git

---

# Backend Installation

Clone the project

```bash
git clone <repository-url>
```

Go to backend

```bash
cd backend
```

Create virtual environment

```bash
python -m venv .venv
```

Activate it

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install packages

```bash
pip install -r requirements.txt
```

---

# Backend Environment

Create a file named

```
.env
```

Copy the values from

```
.env.example
```

Example (SQLite, default)

```env
SECRET_KEY=your_secret_key

DEBUG=True

ALLOWED_HOSTS=127.0.0.1,localhost

CORS_ALLOWED_ORIGINS=http://localhost:5173

DB_ENGINE=sqlite3
DB_NAME=db.sqlite3
```

Example (PostgreSQL)

```env
SECRET_KEY=your_secret_key

DEBUG=True

ALLOWED_HOSTS=127.0.0.1,localhost

CORS_ALLOWED_ORIGINS=http://localhost:5173

DB_ENGINE=postgresql
DB_NAME=estate_db
DB_USER=estate_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```

`DB_ENGINE` accepts `sqlite3` (default) or `postgresql`. When it is `postgresql`, `DB_USER` and `DB_PASSWORD` are required.

`SECRET_KEY` must be a long random string. When `DEBUG=False`, the app refuses to start if it is under 50 characters.

---

# Database

Apply migrations

```bash
python manage.py migrate
```

If you changed any model, generate the migration first

```bash
python manage.py makemigrations
python manage.py migrate
```

---

# Create the First Account

This project is **not** a normal multi-tenant Django admin app — every regular user must belong to an `Agency`, and each installation is meant to serve a single agency. Because of that, the standard `python manage.py createsuperuser` command is **not** the right way to create your first account: it creates a user with no agency attached, and that user will not be able to see or manage anything in the app.

Use the dedicated command instead:

```bash
python manage.py create_agency_owner --agency-name "My Agency" --username owner --password "A-Strong-Password-1"
```

Optional flags:

```bash
--phone "021xxxxxxx"
--address "Agency address"
--force   # only needed if you intentionally want a second agency on this installation
```

This creates the `Agency` record and its first manager account in one step. That account is also a Django superuser, so it works for both the app and `/admin/`.

Agents are added later from inside the app (Settings → Team), not from the command line.

---

# Run Backend

```bash
python manage.py runserver
```

Backend will be available at

```
http://127.0.0.1:8000
```

API schema (manager/staff only): `http://127.0.0.1:8000/api/schema/`
Swagger UI (manager/staff only): `http://127.0.0.1:8000/api/docs/`

---

# Frontend Installation

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

---

# Frontend Environment

Create

```
.env
```

Copy values from

```
.env.example
```

Example

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

# Run Frontend

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# Using the App

Public panel (property listing, property details, contact form):

```
http://localhost:5173/
```

Admin panel login:

```
http://localhost:5173/admin/login
```

Log in with the account created by `create_agency_owner`.

---

# Media Files

Uploaded files are stored inside

```
backend/media
```

During development Django serves media automatically. In production, media must be served by the web server (nginx or similar), not by Django.

---

# Useful Commands

Create migrations

```bash
python manage.py makemigrations
```

Apply migrations

```bash
python manage.py migrate
```

Create the first agency + manager account

```bash
python manage.py create_agency_owner --agency-name "My Agency" --username owner --password "A-Strong-Password-1"
```

Run backend

```bash
python manage.py runserver
```

Run backend tests

```bash
python manage.py test
```

Run frontend

```bash
npm run dev
```

Build frontend for production

```bash
npm run build
```

Lint frontend

```bash
npm run lint
```

---

# Environment Files

Backend

```
backend/.env
backend/.env.example
```

Frontend

```
frontend/.env
frontend/.env.example
```

---

# Troubleshooting

### Backend packages are missing

```bash
pip install -r requirements.txt
```

---

### Frontend packages are missing

```bash
npm install
```

---

### Database changes are not applied

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### `could not connect to server` / `password authentication failed` (PostgreSQL)

This means the backend `.env` does not match a database and user that actually exist. Check:

* `DB_ENGINE=postgresql` is set.
* PostgreSQL service is running.
* `DB_NAME`, `DB_USER`, `DB_PASSWORD` match a database and user you created (via `psql` or pgAdmin), not just values you made up in `.env`.
* `DB_HOST=localhost` and `DB_PORT=5432` match your local PostgreSQL install.

---

### Images are not displayed

Make sure:

* Backend server is running.
* `MEDIA_URL` and `MEDIA_ROOT` are configured correctly.
* `VITE_API_URL` points to the correct backend.

---

### CORS errors

Check the value of

```
CORS_ALLOWED_ORIGINS
```

inside the backend `.env`.

---

### Login fails / dashboard shows nothing after login

This almost always means the account has no `agency` assigned. Only accounts created through `create_agency_owner` (as manager) or added afterward through Settings → Team (as agent) are properly scoped. A user created with the plain `createsuperuser` command will not work correctly in the app.

---

## License

PolyForm Noncommercial License 1.0.0 — free for personal, educational, and research use; commercial use (including resale or paid deployment for a client) is not permitted. See the `LICENSE` file for the full text.