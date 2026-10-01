# PythonQuest Learning Platform

## Quick start on Windows

1. Install [Node.js 20 or later](https://nodejs.org/) and [Python 3.10 or later](https://www.python.org/downloads/).
2. Open PowerShell in this project folder.
3. Run:

   ```powershell
   .\start-dev.ps1
   ```

The script creates the frontend and backend `.env` files from their examples when needed, installs missing dependencies, applies database migrations, and opens the backend and frontend in separate PowerShell windows. Leave those windows open while using the app.

Open [http://localhost:5173](http://localhost:5173). The backend health endpoint is [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health).

On the first run, edit `backend/.env` and add your Supabase project URL and publishable key. User registration and sign-in use Supabase Auth unless `DEV_AUTH_BYPASS=1` is enabled for local development. Keep `SUPABASE_SECRET_KEY` in the backend environment only. The local database defaults to SQLite.

## Manual setup

### 1. Configure environment files

From the project folder, create the local environment files:

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
```

On macOS or Linux, use `cp .env.example .env` and `cp backend/.env.example backend/.env` instead. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `backend/.env`. Keep the secret key server-side.

### 2. Install frontend dependencies

```sh
npm install
```

### 3. Create a Python environment and install backend dependencies

Windows PowerShell:

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
```

macOS or Linux:

```sh
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
```

### 4. Apply migrations

Windows PowerShell:

```powershell
backend/.venv/Scripts/python.exe backend/manage.py migrate
```

macOS or Linux:

```sh
backend/.venv/bin/python backend/manage.py migrate
```

### 5. Start both servers

Open two terminals in the project folder.

Terminal 1, backend (Windows):

```powershell
backend/.venv/Scripts/python.exe backend/manage.py runserver 127.0.0.1:8000
```

Terminal 1, backend (macOS/Linux):

```sh
backend/.venv/bin/python backend/manage.py runserver 127.0.0.1:8000
```

Terminal 2, frontend (all platforms):

```sh
npm run dev -- --host localhost --strictPort
```

Open [http://localhost:5173](http://localhost:5173). Using `localhost` keeps the browser origin aligned with the backend's default CORS setting.

## Stop the app

Press `Ctrl+C` in each server terminal. The quick-start script opens separate terminals so they can be stopped independently.
