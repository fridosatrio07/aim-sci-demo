# Static Export Guide

This project remains a normal Next.js source project for development, and it can also produce a static HTML build for UI/UX trials and stakeholder review.

## Development

Run the development server while editing source code:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Create Static HTML Output

Use the safe static build command after feature work is complete:

```bash
npm run build:static:safe
```

The static website output is written to:

```text
out/
```

The safe build workflow protects the last successful export:

- If the new build succeeds, `out/` is updated.
- If the new build fails, the previous `out/` is restored.
- If no previous `out/` exists, the command fails without producing a partial static site.

You can also run the direct static build:

```bash
npm run build:static
```

`build:static:safe` is recommended for stakeholder preview builds.

## Preview Static HTML

After a successful static build, preview the exported site through the local static server:

```bash
npm run preview:static
```

Open:

```text
http://localhost:4173
```

The safe static build runs `scripts/fix-static-file-paths.mjs` after export. That script rewrites exported HTML asset references from absolute `/_next/...` paths to relative paths so direct `file://` preview can load the generated JavaScript and CSS.

Opening `out/index.html` directly through `file://` is best-effort only. Modern Next.js client routing, browser storage rules, and dynamic API calls are more reliable through a local static server, so `npm run preview:static` is the official preview command.

You can use a different port:

```bash
PORT=5000 npm run preview:static
```

On Windows PowerShell:

```powershell
$env:PORT=5000; npm run preview:static
```

## Routes

The static export generates HTML for the application routes, including:

- `/`
- `/login`
- `/dashboard`
- `/asset-registry`
- `/risk-based-inspection/rbi-information`
- `/risk-based-inspection/risk-analytics`
- `/risk-based-inspection/risk-register`
- `/risk-based-inspection/risk-assessment-workspace`
- `/inspection-management/inspection-information`
- `/inspection-management/inspection-plan`
- `/inspection-management/inspection-schedule`
- `/inspection-management/inspection-detail`
- `/inspection-management/inspection-history`
- `/anomaly-recommendation/anomaly-register`
- `/anomaly-recommendation/recommendation-detail`
- `/compliance-certification/certification-information`
- `/compliance-certification/certification-register`
- `/compliance-certification/regulatory-matrix`
- `/compliance-certification/renewal-tracker`
- `/document-center`
- `/reports`
- `/helpdesk/helpdesk-information`
- `/helpdesk/create-ticket`
- `/helpdesk/ticket-detail`
- `/about-sucofindo`
- `/administration`

Static export uses `trailingSlash: true`, so routes are emitted as folders with `index.html`. Static hosts should serve folder indexes correctly.

## Authentication And Theme

Authentication remains frontend-only for this prototype:

- Username: `superadmin`
- Password: `superadmin`
- Session data is stored in `localStorage`.

Theme behavior also remains frontend-only:

- First visit follows the browser/system theme.
- Manual theme changes are stored in `localStorage`.
- The no-flash theme script is included in the exported HTML.

Dynamic backend calls use `NEXT_PUBLIC_AIM_API_URL` when a backend is running. If the backend is unavailable in static review, the UI falls back to bundled demo data instead of hanging on the secure workspace screen.

## Deployment

The `out/` folder can be deployed to static hosting such as Netlify, GitHub Pages, Vercel static output, S3, or an internal web server.

For direct refresh on nested routes, use a host that serves `index.html` from route folders, or configure fallback routing if your host requires it.

For local review, `npm run preview:static` already serves the exported route folders and supports direct navigation to pages such as `/login/`, `/dashboard/`, and `/risk-based-inspection/risk-assessment-workspace/?step=6`.
