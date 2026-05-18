create extension if not exists pgcrypto;

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_members (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, user_id)
);

comment on column public.site_members.email is 'Informational only. Authorization is always based on user_id.';

create index if not exists site_members_user_idx
on public.site_members (user_id, active);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  collection text not null check (collection in ('page_sections', 'seo', 'settings')),
  key text not null check (key ~ '^[a-z0-9_-]+$'),
  status text not null check (status in ('draft', 'published', 'archived')),
  content_schema_version integer not null default 1,
  data jsonb not null,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  published_by uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists content_entries_one_active_status
on public.content_entries (site_id, collection, key, status)
where status in ('draft', 'published');

create index if not exists content_entries_public_read_idx
on public.content_entries (site_id, status, collection, key);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_sites_updated_at on public.sites;
create trigger set_sites_updated_at
before update on public.sites
for each row execute function public.set_updated_at();

drop trigger if exists set_site_members_updated_at on public.site_members;
create trigger set_site_members_updated_at
before update on public.site_members
for each row execute function public.set_updated_at();

drop trigger if exists set_content_entries_updated_at on public.content_entries;
create trigger set_content_entries_updated_at
before update on public.content_entries
for each row execute function public.set_updated_at();

create or replace function public.is_site_member(target_site_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.site_members sm
    where sm.site_id = target_site_id
      and sm.user_id = auth.uid()
      and sm.active = true
  );
$$;

create or replace function public.has_site_role(target_site_id uuid, allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.site_members sm
    where sm.site_id = target_site_id
      and sm.user_id = auth.uid()
      and sm.active = true
      and sm.role = any(allowed_roles)
  );
$$;

revoke all on function public.is_site_member(uuid) from public, anon;
revoke all on function public.has_site_role(uuid, text[]) from public, anon;
grant execute on function public.is_site_member(uuid) to authenticated;
grant execute on function public.has_site_role(uuid, text[]) to authenticated;

alter table public.sites enable row level security;
alter table public.site_members enable row level security;
alter table public.content_entries enable row level security;

drop policy if exists "public can read active sites" on public.sites;
create policy "public can read active sites"
on public.sites for select
to anon, authenticated
using (active = true);

drop policy if exists "member can read own membership" on public.site_members;
create policy "member can read own membership"
on public.site_members for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "owner can read site memberships" on public.site_members;
create policy "owner can read site memberships"
on public.site_members for select
to authenticated
using (public.has_site_role(site_id, array['owner']));

drop policy if exists "public can read published content for active sites" on public.content_entries;
create policy "public can read published content for active sites"
on public.content_entries for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.sites s
    where s.id = content_entries.site_id
      and s.active = true
  )
);

drop policy if exists "members can read drafts for their site" on public.content_entries;
create policy "members can read drafts for their site"
on public.content_entries for select
to authenticated
using (
  status = 'draft'
  and public.is_site_member(site_id)
);

create or replace function public.save_content_draft(
  p_site_id uuid,
  p_collection text,
  p_key text,
  p_content_schema_version integer,
  p_data jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_draft_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if p_data is null then
    raise exception 'data_required';
  end if;

  if p_collection not in ('page_sections', 'seo', 'settings') then
    raise exception 'invalid_collection';
  end if;

  if p_key !~ '^[a-z0-9_-]+$' then
    raise exception 'invalid_key';
  end if;

  if p_content_schema_version < 1 then
    raise exception 'invalid_schema_version';
  end if;

  if not public.has_site_role(p_site_id, array['owner', 'editor']) then
    raise exception 'not_authorized';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_site_id::text || ':' || p_collection || ':' || p_key));

  select id
  into v_draft_id
  from public.content_entries
  where site_id = p_site_id
    and collection = p_collection
    and key = p_key
    and status = 'draft'
  for update;

  if found then
    update public.content_entries
    set data = p_data,
        content_schema_version = p_content_schema_version,
        updated_by = v_user_id,
        updated_at = now(),
        published_by = null,
        published_at = null
    where id = v_draft_id;

    return v_draft_id;
  end if;

  insert into public.content_entries (
    site_id,
    collection,
    key,
    status,
    content_schema_version,
    data,
    created_by,
    updated_by,
    published_by,
    published_at
  )
  values (
    p_site_id,
    p_collection,
    p_key,
    'draft',
    p_content_schema_version,
    p_data,
    v_user_id,
    v_user_id,
    null,
    null
  )
  returning id into v_draft_id;

  return v_draft_id;
end;
$$;

create or replace function public.publish_content_entry(
  p_site_id uuid,
  p_collection text,
  p_key text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_draft public.content_entries%rowtype;
  v_new_published_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if p_collection not in ('page_sections', 'seo', 'settings') then
    raise exception 'invalid_collection';
  end if;

  if p_key !~ '^[a-z0-9_-]+$' then
    raise exception 'invalid_key';
  end if;

  if not public.has_site_role(p_site_id, array['owner', 'editor']) then
    raise exception 'not_authorized';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_site_id::text || ':' || p_collection || ':' || p_key));

  select *
  into v_draft
  from public.content_entries
  where site_id = p_site_id
    and collection = p_collection
    and key = p_key
    and status = 'draft'
  for update;

  if not found then
    raise exception 'draft_not_found';
  end if;

  update public.content_entries
  set status = 'archived',
      updated_by = v_user_id,
      updated_at = now()
  where site_id = p_site_id
    and collection = p_collection
    and key = p_key
    and status = 'published';

  insert into public.content_entries (
    site_id,
    collection,
    key,
    status,
    content_schema_version,
    data,
    created_by,
    updated_by,
    published_by,
    published_at
  )
  values (
    v_draft.site_id,
    v_draft.collection,
    v_draft.key,
    'published',
    v_draft.content_schema_version,
    v_draft.data,
    v_draft.created_by,
    v_user_id,
    v_user_id,
    now()
  )
  returning id into v_new_published_id;

  update public.content_entries
  set data = v_draft.data,
      content_schema_version = v_draft.content_schema_version,
      updated_by = v_user_id,
      updated_at = now(),
      published_by = null,
      published_at = null
  where id = v_draft.id;

  return v_new_published_id;
end;
$$;

revoke all on function public.save_content_draft(uuid, text, text, integer, jsonb) from public, anon;
revoke all on function public.publish_content_entry(uuid, text, text) from public, anon;
grant execute on function public.save_content_draft(uuid, text, text, integer, jsonb) to authenticated;
grant execute on function public.publish_content_entry(uuid, text, text) to authenticated;
