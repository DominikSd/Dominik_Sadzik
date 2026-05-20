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
