# LeadDesk Mini

A small lead-capture product with a public landing page and a protected admin dashboard.

## Live URLs

- **Landing page:** `https://lead-desk-mini-delta.vercel.app/`
- **Admin:** `https://lead-desk-mini-delta.vercel.app/admin`
- **API:** `https://lead-desk-mini.onrender.com/`

**Test credentials (admin):**

```
email: admin@example.com
password: Ld_Adm1n_2026!Xy
```

> Note: hosted on free tiers (Render + Vercel). The backend may take ~30-50s to respond on the first request after being idle (Render free tier spins down).

---

## Loom walkthrough

Not included in this submission due to time constraints. Happy to walk through the flow live if useful.

## Stack

| Layer    | Choice                                   |
| -------- | ---------------------------------------- |
| Frontend | Next.js (App Router), Tailwind, Zod      |
| Backend  | FastAPI, SQLAlchemy (sync), Alembic      |
| Database | PostgreSQL                               |
| Auth     | JWT (HS256), bcrypt password hashing     |
| Deploy   | Frontend → Vercel, Backend + DB → Render |

---

## Data model

Two tables, managed via SQLAlchemy models and Alembic migrations.

### `leads`

| Column                      | Type                               | Notes                                                                                            |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `id`                        | UUID (PK)                          | generated server-side                                                                            |
| `name`                      | varchar(120)                       | required                                                                                         |
| `email`                     | varchar(255)                       | required, indexed                                                                                |
| `budget_range`              | varchar(50)                        | required, free string (not an enum — avoids coupling backend to the frontend's exact option set) |
| `message`                   | text                               | optional                                                                                         |
| `status`                    | enum(`new`, `contacted`, `closed`) | defaults to `new`                                                                                |
| `created_at` / `updated_at` | timestamptz                        | server-managed                                                                                   |

### `admin_users`

| Column            | Type                 | Notes                        |
| ----------------- | -------------------- | ---------------------------- |
| `id`              | UUID (PK)            |                              |
| `email`           | varchar(255), unique |                              |
| `hashed_password` | varchar(255)         | bcrypt hash, never plaintext |
| `created_at`      | timestamptz          |                              |

There's intentionally no public registration endpoint — admin accounts are provisioned once via a seed script, not created through the API. This keeps the attack surface small: nobody can self-register an admin account.

---

## Auth approach

**JWT, not a hardcoded string.**

1. `POST /auth/login` — validates email + bcrypt-verified password against `admin_users`, returns a short-lived signed JWT (`HS256`, 8h expiry).
2. The Next.js server (Route Handlers) receives that token and stores it in an **httpOnly, secure cookie** — never exposed to client-side JS. This avoids XSS-based token theft that plain `localStorage` is vulnerable to.
3. The browser only ever talks to Next.js (same-origin). Next.js Route Handlers act as a thin proxy: they attach `Authorization: Bearer <token>` and forward the request to the FastAPI backend server-to-server.
4. FastAPI validates the JWT on every `/admin/*` request via a dependency (`require_admin`) that decodes the token, checks expiry, and confirms the user still exists.
5. `GET /auth/me` lets the frontend verify an existing session is still valid (used to protect `/admin` on load).
6. A Next.js `middleware.ts` redirects to `/admin/login` if the session cookie is missing, as a UX-level guard — the real enforcement always happens server-side in FastAPI, not in the middleware.

Admin creation: a one-time seed script (`app/scripts/seed_admin.py`) reads `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from environment variables and creates the user if it doesn't already exist (idempotent — safe to run on every deploy). Those env vars are removed from Render once the account is confirmed created.

### Flow diagram

```
Browser (login form)
        │
        ▼
Next.js route handler ──► FastAPI /auth/login
  sets httpOnly cookie          │
        │                       ▼
        │              validates against admin_users
        ▼
Next.js route handler (proxy)
  reads cookie, attaches
  Authorization: Bearer <token>
        │
        ▼
FastAPI verifies JWT ──► admin_users table
  on every /admin/* request
```

The Bearer token is attached server-side on every proxied request and is never exposed to client-side JavaScript.

---

## API

| Method  | Route                                | Auth   |
| ------- | ------------------------------------ | ------ |
| `POST`  | `/auth/login`                        | public |
| `GET`   | `/auth/me`                           | JWT    |
| `POST`  | `/leads`                             | public |
| `GET`   | `/admin/leads?search=&status=&page=` | JWT    |
| `PATCH` | `/admin/leads/{id}/status`           | JWT    |
| `GET`   | `/health`                            | public |

Validation is enforced twice: client-side with Zod (fast feedback), and server-side with Pydantic (source of truth — the API never trusts the client).

---

## Architecture

Backend follows a **repository → service → controller** pattern:

```
app/
├── controllers/   # HTTP layer — routes, request/response
├── services/      # business logic
├── repositories/  # DB access only
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic validation
└── core/          # config, DB session, JWT/password utils
```

Frontend proxies all backend calls through Next.js Route Handlers, so the browser never talks to the FastAPI origin directly — no CORS to manage in production, and the JWT never touches client-side code.

---

## Running locally

**Backend**

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET_KEY
alembic upgrade head
python -m app.scripts.seed_admin admin@example.com "password123"
uvicorn app.main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
echo "API_URL=http://localhost:8000" > .env.local
npm run dev
```

---

## Scope notes

- Sync FastAPI (no async) — not justified at this scale.
- No caching, queues, or extra abstraction layers — kept to what the brief actually needs.
- Rate limiting on the public `/leads` endpoint is a known gap, noted as a next step rather than solved here.
