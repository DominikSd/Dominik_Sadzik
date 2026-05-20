# Dominik Sadzik - Strona I Panel CMS

React/Vite website with a private owner panel for editing basic text content, publishing draft changes, and viewing GA4 reports through a Supabase Edge Function.

## Stack

- React + Vite
- Tailwind CSS
- Supabase Auth, RLS and RPC
- Zod validation
- Google Analytics 4 with consent
- Vitest + Prettier

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Fill `.env` with local values before opening the admin panel. `.env.example` is only a template and must not contain real project values.

Admin panel:

```text
http://localhost:5173/#/panel-admin
```

After changing `.env`, restart `npm run dev`.

## Checks

```bash
npm run format:check
npm test
npm run build
```

`npm run build` also runs `scripts/check-dist-secrets.mjs`.

## Current Scope

Included now:

- basic text editing,
- SEO editing,
- contact, FAQ and services editing,
- draft/published flow,
- GA4 tracking with consent,
- GA4 report preview in the admin panel.

Not included in this stage:

- AI Assistant,
- Supabase Storage,
- media upload,
- posts/news,
- raw analytics event table,
- CMS-builder or drag-and-drop editor.

## Docs

- [Configuration map](docs/configuration-map.md)
- [Supabase setup](docs/supabase-setup.md)
- [GA4 setup](docs/ga4-setup.md)
- [Local CMS test](docs/local-cms-test.md)
- [Supabase RLS manual test](docs/supabase-rls-manual-test.md)
- [Deployment checklist](docs/deployment-checklist.md)
- [Client handover](docs/client-handover.md)
- [Roadmap](docs/roadmap.md)
