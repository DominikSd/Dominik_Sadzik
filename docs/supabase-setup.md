# Supabase Setup

## 1. Create Project

1. Create a Supabase project.
2. Disable public signup in Auth settings.
3. Add the first user through the Supabase Dashboard.

## 2. Apply Migration

Run `supabase/migrations/001_core_cms.sql` in the Supabase SQL editor or through the Supabase CLI.

The migration creates:

- `sites`
- `site_members`
- `content_entries`
- RLS policies
- `save_content_draft(...)`
- `publish_content_entry(...)`

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

## 5. Auth redirect URLs

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
