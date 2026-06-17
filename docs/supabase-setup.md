# Supabase Setup

## 1. Create Project

1. Create a Supabase project.
2. Disable public signup in Auth settings.
3. Add the first user through the Supabase Dashboard.

## 2. Apply Migration

Run migrations from `supabase/migrations/` in order in the Supabase SQL editor or through the
Supabase CLI.

The core CMS migration creates:

- `sites`
- `site_members`
- `content_entries`
- RLS policies
- `save_content_draft(...)`
- `publish_content_entry(...)`

The website description form migration creates:

- `website_briefs`
- public insert-only RLS for the quote request form
- authenticated read access for `owner` and `editor` site members

The public website description form stores submissions in `website_briefs`. Public visitors cannot
read, update or delete submitted requests.

Example CLI command:

```bash
supabase db push
```

Or apply the SQL manually in this order:

```text
supabase/migrations/001_core_cms.sql
supabase/migrations/002_website_briefs.sql
```

## 3. Create Site And Owner

Use your actual `site_id` and Auth user ID:

```sql
insert into public.sites (id, slug, name)
values ('00000000-0000-0000-0000-000000000001', 'dominik-sadzik', 'Dominik Sadzik');

insert into public.site_members (site_id, user_id, email, role)
values (
  '00000000-0000-0000-0000-000000000001',
  '<auth-user-id>',
  '<email>',
  'owner'
);
```

`site_members.email` is informational only. Authorization always uses `user_id`.

## 4. Frontend Environment

Set these in `.env` locally and in deployment environment variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_ID=
VITE_ADMIN_HASH_PATH=panel-admin
VITE_GA_MEASUREMENT_ID=
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend code or any `VITE_*` variable.

## 5. Website description form

The public route `#/opisz-strone` saves quote requests to `public.website_briefs` through the
frontend Supabase anon key and RLS.

Required conditions:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_SITE_ID` point to the same Supabase project,
- `VITE_SITE_ID` exists in `public.sites`,
- the site row has `active = true`,
- `002_website_briefs.sql` has been applied.

The form does not send email notifications yet. If notifications are needed, add a separate Supabase
Edge Function later and store provider credentials only as Supabase secrets, for example for Resend
or another mail provider. Do not put SMTP/API keys in `.env`, GitHub Variables or frontend code.

## 6. Auth redirect URLs

In Supabase Authentication → URL Configuration add the callback and recovery URLs used by the
CMS. These URLs intentionally use query params (`?auth=callback` and `?auth=recovery`) instead of
hash routes, because Supabase Auth appends its own session data during magic-link and password-reset
flows.

Recommended local Site URL:

```text
http://localhost:5173
```

The Vite dev server is configured with `port: 5173` and `strictPort: true`, so a busy port should
fail fast instead of silently switching to a different origin. If you intentionally run Vite on
another host or port, add that exact origin to Supabase too. The redirect origin must match the URL
opened in the browser.

Allowed Redirect URLs:

Local:

```text
http://localhost:5173/?auth=callback
http://localhost:5173/?auth=recovery
http://127.0.0.1:5174/?auth=callback
http://127.0.0.1:5174/?auth=recovery
http://localhost:5173/Dominik_Sadzik/?auth=callback
http://localhost:5173/Dominik_Sadzik/?auth=recovery
http://127.0.0.1:5174/Dominik_Sadzik/?auth=callback
http://127.0.0.1:5174/Dominik_Sadzik/?auth=recovery
```

Production:

```text
https://dominik-sadzik.pl/?auth=callback
https://dominik-sadzik.pl/?auth=recovery
```
