# Project Guardrails

This project is a simple private owner panel for editing website text and reading GA4 reports.

## Security Rules

- Do not commit secrets to the repo.
- Do not modify `.env` with real values.
- `.env.example` must contain placeholders only.
- Never add `SUPABASE_SERVICE_ROLE_KEY` to frontend code or `VITE_*`.
- Never add `GOOGLE_PRIVATE_KEY` or `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` to frontend code or `VITE_*`.
- Do not commit service account JSON files.
- Keep Google credentials only in Supabase Edge Function secrets.

## CMS Rules

- Do not call `insert`, `update`, `upsert`, or `delete` on `content_entries` from the frontend.
- All `content_entries` mutations must go through RPC functions such as `save_content_draft` and `publish_content_entry`.
- Public content reads use `published`; admin editing uses `draft`.
- Viewer can read but cannot save or publish.

## Current Scope

- Keep the panel focused on editing basic text, SEO, contact data, FAQ, offer/services, and viewing GA4 stats.
- Do not add AI Assistant in the current scope.
- Do not add Supabase Storage, media upload, raw `analytics_events`, or a drag-and-drop CMS builder.

## Required Checks

After changes, run:

```bash
npm test
npm run format:check
npm run build
```
