# Club 1600 Secretary

A modern records hub for the First Bahamas Branch of Toastmasters Club 1600.

This first build indexes the 2026–2027 meeting minutes from July 2 through September 24, 2026 and turns the recurring details into a usable dashboard:

- meeting archive and searchable records
- attendance and guest trends
- education roles and prepared speeches
- motions, corrections and matters arising
- action items / follow-up register
- awards leaderboards
- meeting collections
- financial-member trend captured from the minutes
- member participation profiles

The source minute filenames are preserved in the data model. The original PDF/DOCX files remain the authoritative records.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output: `dist/`

## Deploy

Designed for Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`

The SPA rewrite is included in `public/_redirects`.

## Current data scope

Program year: **2026 / 2027**

Indexed meetings: **13**

- July 2, 2026
- July 9, 2026
- July 16, 2026
- July 23, 2026
- July 30, 2026
- August 6, 2026
- August 13, 2026
- August 20, 2026
- August 27, 2026
- September 3, 2026
- September 10, 2026
- September 17, 2026
- September 24, 2026

## Next phase

Add the New Minutes workflow so the Secretary can enter a meeting once, generate the formatted minutes, and automatically update the archive and dashboards.
