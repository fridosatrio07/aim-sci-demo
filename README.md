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

The seed creates exactly 64 assets for the canonical facility:

```text
SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility
```

It also creates components, inspection records, thickness readings, failure records, documents, and RBI assessment records. Dashboard totals, Asset Registry, Risk Register, Inspection Plan, Reports, Asset Detail, and RBI Workspace should all reconcile to this same backend dataset in dynamic mode.

## Environment

Copy `.env.example` to `.env.local` for the frontend:

```text
NEXT_PUBLIC_AIM_API_URL=http://localhost:8000
```

Copy `backend/.env.example` to `backend/.env` for backend overrides if needed.

## Dynamic App Mode: Backend Is Source of Truth

Run the backend and frontend together for authoritative review:

```bash
cd backend
uvicorn app.main:app --reload

# separate terminal
npm run dev
```

In this mode, FastAPI + MongoDB/in-memory repository is the single source of truth. The frontend API client reads backend data for live pages and calculation flows. Static TypeScript fixtures are fallback-only legacy mock data and must not be treated as authoritative runtime data.

The backend currently exposes:

- Asset registry and asset detail data
- Inspection, thickness, and failure event records
- Document upload/extraction/field approval workflow
- RBI, reliability, Weibull, Monte Carlo, degradation, and anomaly calculation endpoints
- Dashboard, risk register, inspection plan, and asset summary report endpoints
- Report history and portfolio summary endpoints

Calculation traceability:

- Running RBI writes to `calculation_runs`, updates/upserts `rbi_assessments`, updates `assets.current_risk_level`, and refreshes Risk Register/Inspection Plan responses.
- Running degradation updates remaining life and next inspection recommendation.
- Adding inspection, thickness, failure, or approved document mapping data marks related calculation results stale.
- Frontend pages show `Recalculation Required` instead of silently masking stale results.

The calculation engines are defensible demo models aligned with RBI/reliability workflow concepts. They are not certified API 581 calculations.

## Offline Prototype Mode / Static Export

If the backend is unavailable, migrated pages show an explicit `Offline Prototype Mode` label and may use fallback-only legacy fixtures. This mode exists for static stakeholder review and should not be used for data consistency validation.

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
