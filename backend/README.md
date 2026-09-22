# PythonQuest Django API

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and fill in the Supabase values. Keep `SUPABASE_SECRET_KEY` server-side.
2. Install dependencies with `python -m pip install -r backend/requirements.txt`.
3. Run migrations with `python backend/manage.py migrate`.
4. Start the API with `python backend/manage.py runserver 127.0.0.1:8000`.
5. Copy `.env.example` to `.env` for the Vite app and run `pnpm dev`.

The default local database is SQLite at `backend/db.sqlite3`. For production, provide a Supabase Postgres `DATABASE_URL` and configure Django's database adapter accordingly. The API health check is available at `/api/health`.
