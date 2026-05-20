# Dominik Sadzik - Strona I Panel

React/Vite website with a private owner panel for editing basic text content and viewing GA4 reports.

## Quick Start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env` and fill local values:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_ID=
VITE_ADMIN_HASH_PATH=panel-admin
VITE_GA_MEASUREMENT_ID=
```

Do not put service role keys or Google private keys in frontend environment variables.

## Current Scope

The panel supports:

- basic text edits,
- SEO edits,
- contact details,
- FAQ and offer/services,
- draft/published publishing,
- GA4 tracking with consent,
- GA4 report preview through Supabase Edge Function.

Current scope does not include AI, Storage, media upload, raw analytics events, or a CMS-builder.

## Docs

- [Supabase setup](docs/supabase-setup.md)
- [GA4 setup](docs/ga4-setup.md)
- [Deployment checklist](docs/deployment-checklist.md)
- [Client handover](docs/client-handover.md)
- [Roadmap](docs/roadmap.md)

## Checks

```bash
npm test
npm run format:check
npm run build
```

`npm run build` runs `scripts/check-dist-secrets.mjs` after build.
