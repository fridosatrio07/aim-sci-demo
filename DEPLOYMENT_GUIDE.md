# AIM SCI Demo Deployment Guide

## Repository And Deployment

- GitHub repository: https://github.com/fridosatrio07/aim-sci-demo
- Production deployment: https://aim-sci-demo.vercel.app

The Vercel project is connected to the GitHub repository. Future feature updates, bug fixes, layout refinements, and static export updates should be committed and pushed to GitHub so Vercel can redeploy automatically.

## Local Development

Install dependencies when needed:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:3000
```

## Build

Run the production build:

```bash
npm run build
```

This is now the normal dynamic-capable Next.js production build. Static export is opt-in through the static scripts below.

## Static Export

Create or update the static HTML output safely:

```bash
npm run build:static:safe
```

The safe static build keeps the previous `out/` folder if the new build fails. When the build succeeds, `out/` is updated.

Preview the static export:

```bash
npm run preview:static
```

The static website output is located in:

```text
out/
```

This repository currently keeps `out/` tracked because the current static review/deployment flow depends on the exported website output.

Do not rely on double-clicking `out/index.html` for stakeholder review. Use `npm run preview:static` so route folders, client navigation, auth storage, and backend-fallback behavior run in a browser environment close to static hosting.

## Dynamic Backend MVP

The frontend can now connect to a FastAPI backend:

```bash
docker compose up -d mongodb
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Use Python 3.12 or newer for backend development. If your machine defaults to a very new Python release, keep dependencies updated with `pip install -r backend/requirements.txt` so Pydantic/FastAPI wheels match your interpreter.

Seed the demo facility:

```bash
curl -X POST http://localhost:8000/seed/demo-facility
```

Set the frontend API URL in `.env.local`:

```text
NEXT_PUBLIC_AIM_API_URL=http://localhost:8000
```

If the backend is offline, main UI pages that have been migrated use bundled static demo data as a fallback.

## Commit And Push Future Changes

Check changes:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Describe update"
```

Push to GitHub:

```bash
git push
```

After pushing, Vercel should automatically deploy the latest GitHub commit. If Vercel does not redeploy, check the Vercel project dashboard to confirm that the project is still connected to `fridosatrio07/aim-sci-demo` and that automatic deployments are enabled for the `main` branch.

## Safety Notes

- Do not commit `.env`, `.env.local`, or other local secret files.
- Do not commit `node_modules/` or `.next/`.
- Run `npm run build` before pushing meaningful UI or routing changes.
- Run `npm run build:static:safe` when static HTML output should be refreshed.
- Only delete a local laptop copy after confirming GitHub contains the latest source files and any required static export output.
