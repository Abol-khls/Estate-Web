# Estate CRM

A modern Real Estate CRM built with **Django REST Framework** and **React**.
The project is designed for real estate agencies to manage properties, customers, visits, contracts, and daily activities from a single dashboard.

---

## Features

* Authentication with JWT
* Agency-based data isolation (Multi-Tenant)
* Property management
* Multiple property images
* Property videos
* Favorite properties
* Customer management
* Visit management
* Contract management
* Activity management
* Dashboard
* Advanced filtering
* Search
* Ordering
* Responsive UI
* File upload validation
* Role-based architecture

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* SimpleJWT
* Django Filter
* SQLite (Development)
* PostgreSQL Ready

### Frontend

* React
* Vite
* Material UI
* Axios
* React Router

---

# Project Structure

```
EstateCRM
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

Example

```env
SECRET_KEY=your_secret_key

DEBUG=True

ALLOWED_HOSTS=127.0.0.1,localhost

CORS_ALLOWED_ORIGINS=http://localhost:5173

DB_NAME=db.sqlite3
```

---

# Database

Create migrations

```bash
python manage.py makemigrations
```

Apply migrations

```bash
python manage.py migrate
```

---

# Create Superuser

```bash
python manage.py createsuperuser
```

Follow the instructions and create your admin account.

---

# Run Backend

```bash
python manage.py runserver
```

Backend will be available at

```
http://127.0.0.1:8000
```

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

# Login

Create a superuser first.

Use the same credentials on the login page.

---

# Media Files

Uploaded files are stored inside

```
backend/media
```

During development Django serves media automatically.

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

Create admin

```bash
python manage.py createsuperuser
```

Run backend

```bash
python manage.py runserver
```

Run frontend

```bash
npm run dev
```

Freeze packages

```bash
pip freeze > requirements.txt
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

### Login fails

Make sure you created a superuser

```bash
python manage.py createsuperuser
```

and the backend server is running.

---

## License

MIT License
