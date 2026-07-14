# MY PG Backend (Python)

This backend is built with FastAPI and connects directly to Supabase Postgres using SQLAlchemy for data access.

## Setup

1. Install Python dependencies:
   ```powershell
   cd "c:\Users\Kotes\Desktop\MY PG\backend"
   C:/Users/Kotes/AppData/Local/Python/pythoncore-3.14-64/python.exe -m pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and set your Supabase credentials and Postgres connection string.

3. Start the backend:
   ```powershell
   C:/Users/Kotes/AppData/Local/Python/pythoncore-3.14-64/python.exe main.py
   ```

Alternatively, run with uvicorn:

```powershell
C:/Users/Kotes/AppData/Local/Python/pythoncore-3.14-64/python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

## Available endpoints

- `GET /` — health check
- `POST /api/auth/login`
- `GET /api/me`
- `GET /api/dashboard`
- `GET /api/tenants`
- `POST /api/tenants`
- `GET /api/complaints`
- `POST /api/complaints`
- `GET /api/rooms`
- `GET /api/payments`
- `GET /api/branches`
- `GET /api/staff`
- `GET /api/roles`
- `GET /api/beds`
- `GET /api/room-allocations`
- `GET /api/visitors`
- `GET /api/expenses`
- `GET /api/maintenance-requests`
- `POST /api/logins`
