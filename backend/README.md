# NoteHub FastAPI Backend

FastAPI + MongoDB backend for the NoteHub React app. Includes signup/login with hashed passwords and JWT access tokens, plus user-scoped notes CRUD, search, category filtering, and pinned sorting.

## 1. Requirements
- Python 3.10+
- MongoDB running locally or a MongoDB Atlas connection string

## 2. Install

Windows PowerShell:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Linux/macOS:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and set `MONGODB_URL`, `DATABASE_NAME`, and a long random `SECRET_KEY`. Keep `.env` private and never commit it.

## 3. Run
```bash
uvicorn app.main:app --reload
```
Open http://127.0.0.1:8000/docs to test endpoints.

## API routes

| Method | Route | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Create account | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Current user | Bearer token |
| GET | `/api/notes` | List notes; supports `?search=` and `?category=` | Bearer token |
| POST | `/api/notes` | Create note | Bearer token |
| GET | `/api/notes/{note_id}` | Get one note | Bearer token |
| PUT | `/api/notes/{note_id}` | Update note | Bearer token |
| DELETE | `/api/notes/{note_id}` | Delete note | Bearer token |

## Frontend integration
Base URL: `http://127.0.0.1:8000`

For protected endpoints, send:
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Signup/login response:
```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

Example create-note body:
```json
{
  "title": "My first note",
  "content": "Ideas go here",
  "category": "Personal",
  "color": "orange",
  "pinned": false
}
```

The React frontend currently has UI-only auth and in-memory demo notes. It will need API calls to use this backend persistently. Do not store the JWT in an insecure place for a production app; consider an HttpOnly cookie strategy for production.
