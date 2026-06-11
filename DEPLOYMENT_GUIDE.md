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
