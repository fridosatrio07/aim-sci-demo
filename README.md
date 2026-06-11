# AIM SCI Demo

Asset Integrity Management / Risk-Based Inspection demo platform built with Next.js App Router, TypeScript, Tailwind CSS, and a new FastAPI backend foundation.

## Frontend Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Prototype login:

- Username: `superadmin`
- Password: `superadmin`

## Backend Development

```bash
docker compose up -d mongodb
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Python 3.12 or newer is recommended. The dependency ranges are intentionally modern because some older Pydantic builds do not support Python 3.14.

Seed deterministic demo data:

```bash
curl -X POST http://localhost:8000/seed/demo-facility
```

The seed creates a small gathering-station-style demo facility with 60+ assets, components, inspection records, thickness readings, failure records, documents, and RBI assessment records.

## Environment

Copy `.env.example` to `.env.local` for the frontend:

```text
NEXT_PUBLIC_AIM_API_URL=http://localhost:8000
```

Copy `backend/.env.example` to `backend/.env` for backend overrides if needed.

## Dynamic/Fallback Data Flow

Migrated frontend pages call the FastAPI backend first. If the backend is unavailable, the UI falls back to bundled TypeScript demo data so static stakeholder review remains usable.

The backend currently exposes:

- Asset registry and asset detail data
- Inspection, thickness, and failure event records
- Document upload/extraction/field approval workflow
- RBI, reliability, Weibull, Monte Carlo, degradation, and anomaly calculation endpoints
- Dashboard, risk register, inspection plan, and asset summary report endpoints

The calculation engines are defensible demo models aligned with RBI/reliability workflow concepts. They are not certified API 581 calculations.

## Build

Normal production build:

```bash
npm run build
```

Static HTML export for stakeholder review:

```bash
npm run build:static:safe
npm run preview:static
```

`build:static:safe` preserves the previous `out/` folder if a new export fails.

## GitHub / Vercel

- Repository: https://github.com/fridosatrio07/aim-sci-demo
- Deployment: https://aim-sci-demo.vercel.app

Push future work to GitHub so Vercel can redeploy:

```bash
git status
git add .
git commit -m "Describe update"
git push
```
