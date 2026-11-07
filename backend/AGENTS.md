# Backend agent guide

This directory contains the FastAPI backend for the project management MVP. It serves the statically exported Next.js frontend and exposes the backend API.

## Current state

The backend is set up to do the following:
- serve the frontend export at `/` and its assets under `/_next/static/`
- expose a health check endpoint at `/api/health`
- expose a simple API response at `/api/hello`
- run locally in a containerized environment as part of the project stack

## Key files

- `app/main.py`: FastAPI application entry point
- `pyproject.toml`: Python dependency metadata for the backend
- `app/__init__.py`: package marker
- `tests/test_frontend_serving.py`: integration tests for static frontend and API routes

## Runtime expectations

- Python 3.12+
- FastAPI
- Uvicorn
- Static frontend assets must be built into `app/static` for the Docker image. Set `PM_STATIC_DIR` when running the backend outside Docker.
- SQLite is planned for later phases, but the current implementation is intentionally minimal to prove the service runs correctly.

## Local validation

Build the static frontend first with `npm run build` in `frontend/`. Then run the backend from `backend/` with `PM_STATIC_DIR` set to `../frontend/out`:

```bash
PM_STATIC_DIR=../frontend/out python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

In PowerShell, set the variable before starting Uvicorn:

```powershell
$env:PM_STATIC_DIR = "..\frontend\out"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Then verify:
- `http://localhost:8000/` renders the Kanban board
- `http://localhost:8000/api/health` returns JSON
- `http://localhost:8000/api/hello` returns a message from the API

Install the optional test dependencies with `uv pip install --system -e '.[test]'` and run `python -m pytest` from this directory to test backend serving and routes.