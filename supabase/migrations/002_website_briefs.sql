create table if not exists public.website_briefs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (length(trim(name)) between 2 and 160),
  email text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text,
  preferred_contact text,
  current_website text,
  project_type text[] not null default '{}',
  website_goals text[] not null default '{}',
  cms_needs text,
  materials jsonb not null default '{}'::jsonb,
  style_preferences text[] not null default '{}',
  inspiration_links text,
  addons text[] not null default '{}',
  deadline text,
  budget text,
  project_description text,
  consent_contact boolean not null default false,
  status text not null default 'new' check (
    status in ('new', 'to_contact', 'quote_sent', 'accepted', 'rejected', 'later')
  ),
  internal_notes text,
  source text not null default 'brief_form'
);

create index if not exists website_briefs_site_created_idx
on public.website_briefs (site_id, created_at desc);

drop trigger if exists set_website_briefs_updated_at on public.website_briefs;
create trigger set_website_briefs_updated_at
before update on public.website_briefs
for each row execute function public.set_updated_at();

alter table public.website_briefs enable row level security;

drop policy if exists "public can create website briefs for active sites" on public.website_briefs;
create policy "public can create website briefs for active sites"
on public.website_briefs for insert
to anon, authenticated
with check (
  consent_contact = true
  and status = 'new'
  and internal_notes is null
  and source = 'brief_form'
  and exists (
    select 1
    from public.sites s
    where s.id = website_briefs.site_id
      and s.active = true
  )
);

drop policy if exists "site editors can read website briefs" on public.website_briefs;
create policy "site editors can read website briefs"
on public.website_briefs for select
to authenticated
using (public.has_site_role(site_id, array['owner', 'editor']));

revoke all on table public.website_briefs from anon, authenticated;

grant insert (
  site_id,
  name,
  email,
  phone,
  preferred_contact,
  current_website,
  project_type,
  website_goals,
  cms_needs,
  materials,
  style_preferences,
  inspiration_links,
  addons,
  deadline,
  budget,
  project_description,
  consent_contact,
  source
) on table public.website_briefs to anon, authenticated;

grant select on table public.website_briefs to authenticated;
