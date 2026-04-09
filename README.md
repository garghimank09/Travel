# AI Travel Planner (MVP)

Full-stack MVP: **Next.js** (Tailwind) + **FastAPI** + **PostgreSQL** (PgAdmin). The original brief mentioned MongoDB; this project uses **PostgreSQL** with database name **`Travel`**, matching your PgAdmin setup.

## Folder structure

```
Travel Website/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database/       # SQLAlchemy engine + `places` table
│   │   ├── models/         # Pydantic schemas
│   │   ├── routes/         # FastAPI routers
│   │   └── services/       # Places, cache, AI
│   ├── examples/
│   │   └── api_responses.json
│   ├── requirements.txt
│   ├── seed_places.py
│   └── .env.example
├── frontend/
│   ├── app/                  # App Router pages
│   ├── components/
│   ├── lib/api.ts            # Axios client + types
│   └── .env.local.example
└── README.md
```

## Prerequisites

- **Python 3.11+** (3.14 works with the flexible `requirements.txt` wheels)
- **Node.js 18+**
- **PostgreSQL** with a database named **`Travel`**
- **Ollama** running locally: `ollama serve` and `ollama pull <OLLAMA_MODEL>` (e.g. `llama3.2`). Set `AI_PROVIDER=ollama` in `backend/.env` (see `.env.example`) to always use Ollama. With `AI_PROVIDER=auto` (default when unset), OpenAI is used only if `OPENAI_API_KEY` is set.

## 1. PostgreSQL (PgAdmin)

1. Create database: **`Travel`**
2. Note host, port (default `5432`), user, and password.

## 2. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit **`.env`** and set `DATABASE_URL`, for example:

`postgresql://postgres:YOUR_PASSWORD@localhost:5432/Travel`

Seed sample places (Manali, Goa, Jaipur, Udaipur, Kerala):

```powershell
python seed_places.py
```

Start API:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health: `GET /health`

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/places` | List places (cached briefly in-process) |
| GET | `/places/{id}` | Place detail (cached) |
| POST | `/generate-trip` | AI itinerary JSON |

**`POST /generate-trip` body:**

```json
{
  "destination": "Goa",
  "budget": 30000,
  "days": 4
}
```

Example payloads and shapes: `backend/examples/api_responses.json`.

### Environment variables (backend)

See `backend/.env.example`: `DATABASE_URL`, `CORS_ORIGINS`, `AI_PROVIDER`, `OLLAMA_*`, `OPENAI_*`, `CACHE_TTL_SECONDS`.

## 3. Frontend

```powershell
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_API_URL` in `.env.local` if the API is not on `http://localhost:8000`.

**Production build:**

```powershell
npm run build
npm start
```

## Features (MVP)

- **Caching:** In-memory TTL cache for `GET /places` and `GET /places/{id}` (`CACHE_TTL_SECONDS`, `0` disables).
- **AI:** **Ollama** when `AI_PROVIDER=ollama`, or when `AI_PROVIDER=auto` and `OPENAI_API_KEY` is empty — uses `/api/chat` with JSON `format`. **OpenAI** when `AI_PROVIDER=openai`, or `auto` with a key set. Output is validated as structured JSON (`ItineraryResponse`).

## Troubleshooting

- **`pip` fails building `pydantic-core`:** Use Python 3.11–3.14 with updated pip, or rely on the current flexible `requirements.txt` so wheels resolve.
- **DB connection errors:** Confirm PostgreSQL is running, database `Travel` exists, and `DATABASE_URL` credentials match PgAdmin.
- **Planner 503:** Start Ollama (`ollama serve`), run `ollama pull <OLLAMA_MODEL>`, and check `OLLAMA_BASE_URL`. If using OpenAI, set `AI_PROVIDER=openai` and `OPENAI_API_KEY`.
