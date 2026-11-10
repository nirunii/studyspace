# StudySpace

A student productivity app: subjects, assignments, study planner, exam tracker and progress charts.

Anyone can open the app and look around with sample data, no account needed. Creating an account unlocks the features that save your own data (adding and editing subjects, tasks, sessions and exams).

**Stack:** React + Vite · Node.js + Express · PostgreSQL · JWT + bcryptjs · Recharts

## Project structure

```
studyspace-fullstack/
├── server/                  Express API
│   ├── index.js             app setup, CORS, routes, error handling
│   ├── schema.sql           tables (created automatically on start-up)
│   ├── migrate.js           runs schema.sql so a fresh database just works
│   ├── db.js                PostgreSQL connection
│   ├── middleware/auth.js   checks the JWT
│   └── routes/              auth.js (register/login) and crud.js (shared CRUD)
└── client/                  React app
    └── src/                 pages/, Components.jsx, AuthDialog.jsx, demo.js (guest sample data), store.jsx, api.js
```

## How guest mode works

- Not logged in: every page shows read-only sample data (`client/src/demo.js`) under a "previewing" banner.
- Any action that would save something (Add, edit, change a status, tick a session) opens the sign-up / log-in dialog instead.
- Logged in: the app loads your own data from the API. Every query is filtered by your `user_id`.

## Run it on your laptop

You need **Node.js 18+** and **PostgreSQL**.

### 1. Database
Create an empty database called `studyspace` (`createdb studyspace`, or pgAdmin). You do **not** need to run any SQL: the server creates the tables itself the first time it starts.

### 2. Backend
```
cd server
cp .env.example .env        # Windows: copy .env.example .env
```
Open `.env`, put your Postgres password in `DATABASE_URL` and any long random text in `JWT_SECRET`. Then:
```
npm install
npm run dev
```
You should see `StudySpace API running on port 5000` and `Database ready`.
Check http://localhost:5000/api/health shows `{"ok":true,"db":true}`.

### 3. Frontend (new terminal)
```
cd client
npm install
npm run dev
```
Open http://localhost:5173.

## "I can't create an account": checklist

| What you see | Cause and fix |
|---|---|
| "Can't reach the server" | The API is not running or the client does not know where it is. Locally: start `npm run dev` in `server/`. Deployed: build the client with `VITE_API_URL` set (see below). |
| "The app can't find its server" | The client is calling its own website instead of the API. Set `VITE_API_URL` and rebuild. |
| "The server cannot reach its database" | Wrong `DATABASE_URL` (password, host, database name), or the database is not running. On hosted databases also set `DATABASE_SSL=true`. |
| Server exits with "JWT_SECRET is not set" | Add `JWT_SECRET` to `server/.env` (or your host's environment variables). |
| Browser console shows a CORS error | Set `CLIENT_URL` on the server to your website address, e.g. `https://yourname.github.io`. |
| `npm install` fails in `server/` | Older versions used `bcrypt`, which needs build tools. This version uses `bcryptjs`, so delete `node_modules` and `package-lock.json` in `server/` and install again. |

`GET /api/health` is the quickest test: `db: true` means the server and database are fine.

## API (test with Postman)

All routes except register and login need the header `Authorization: Bearer <token>`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | `{name, email, password}` → token + user |
| POST | `/api/auth/login` | `{email, password}` → token + user |
| GET | `/api/auth/me` | current user |
| GET / POST | `/api/subjects` | list / create |
| PUT / DELETE | `/api/subjects/:id` | update / delete |
| same pattern | `/api/assignments`, `/api/sessions`, `/api/exams` | |

## Deploying

- **Database:** Neon, Supabase or Render PostgreSQL. Set `DATABASE_SSL=true`. No SQL needed; tables are created on first start (the SQL is in `server/schema.sql` if you prefer to run it by hand).
- **Backend:** Render or Railway, root directory `server`. Set `DATABASE_URL`, `JWT_SECRET` and `CLIENT_URL` (your website address, e.g. `https://yourname.github.io`). Free hosts sleep when idle, so the first request after a pause can take about a minute.
- **Frontend:** in `client/`, set `VITE_API_URL=https://your-api.onrender.com/api`, run `npm run build`, then upload the contents of `client/dist` to GitHub Pages. The variable is baked in at build time, so rebuild after changing it.
