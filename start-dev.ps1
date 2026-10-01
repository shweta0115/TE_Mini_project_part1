$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

foreach ($command in @('node', 'npm', 'python')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Required command '$command' was not found. Install Node.js (including npm) and Python 3.10+, then run this script again."
    }
}

if (-not (Test-Path '.env')) {
    Copy-Item '.env.example' '.env'
    Write-Host 'Created frontend .env from .env.example.'
}
if (-not (Test-Path 'backend/.env')) {
    Copy-Item 'backend/.env.example' 'backend/.env'
    Write-Host 'Created backend/.env from backend/.env.example. Edit it and add your Supabase settings before signing up.'
}

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Installing frontend dependencies...'
    npm install
    if ($LASTEXITCODE -ne 0) { throw 'npm install failed.' }
}

$venvPython = Join-Path $root 'backend/.venv/Scripts/python.exe'
if (-not (Test-Path $venvPython)) {
    Write-Host 'Creating the backend Python environment...'
    python -m venv backend/.venv
    if ($LASTEXITCODE -ne 0) { throw 'Could not create the Python virtual environment.' }
}
if (-not (Test-Path (Join-Path $root 'backend/.venv/requirements-installed'))) {
    Write-Host 'Installing backend dependencies...'
    & $venvPython -m pip install -r backend/requirements.txt
    if ($LASTEXITCODE -ne 0) { throw 'Installing backend dependencies failed.' }
    New-Item -ItemType File -Path (Join-Path $root 'backend/.venv/requirements-installed') | Out-Null
}

Write-Host 'Applying database migrations...'
& $venvPython backend/manage.py migrate
if ($LASTEXITCODE -ne 0) { throw 'Database migrations failed. Check backend/.env and your database connection.' }

$backendCommand = "Set-Location '$root'; & '$venvPython' backend/manage.py runserver 127.0.0.1:8000"
$frontendCommand = "Set-Location '$root'; npm run dev -- --host localhost --strictPort"
Start-Process powershell.exe -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $backendCommand)
Start-Process powershell.exe -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $frontendCommand)

Write-Host ''
Write-Host 'PythonQuest is starting:'
Write-Host '  Frontend: http://localhost:5173'
Write-Host '  Backend:  http://127.0.0.1:8000/api/health'
Write-Host 'Keep both terminal windows open while using the app.'
