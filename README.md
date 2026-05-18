# Dominik Sadzik - strona osobista

Projekt strony osobistej/ofertowej dla uslug projektowania stron internetowych i wizytowek online.

## Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Supabase Auth/RLS jako prywatny CMS Etapu 1A
- Zod do walidacji tresci

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Build produkcyjny:

```bash
npm run build
```

Wlasciwym punktem startowym aplikacji jest `index.html`, ktory laduje `src/main.jsx`.

## Prywatny CMS Etap 1A

Panel admina dziala pod ukrytym hashem:

```text
/#/panel-admin
```

Docelowa wartosc jest ustawiana przez `VITE_ADMIN_HASH_PATH`.

### Konfiguracja

1. Skopiuj `.env.example` do `.env`.
2. Uzupelnij:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_ID=
VITE_ADMIN_HASH_PATH=panel-admin
```

3. W Supabase uruchom migracje `supabase/migrations/001_core_cms.sql`.
4. Wylacz public signup w Supabase Auth.
5. Dodaj pierwszego uzytkownika w Supabase Dashboard.
6. Dodaj pierwszy rekord `site_members` recznie lub seedem.

`site_members.email` jest tylko informacyjne. Autoryzacja zawsze odbywa sie po `user_id`.

### Model tresci

- Publiczna strona czyta tylko `content_entries.status = 'published'` dla aktywnego `sites.active = true`.
- Panel czyta drafty tylko dla czlonkow danego `site_id`.
- Czlonkowie site A nie maja dostepu do draftow site B.
- Frontend nie robi `insert`, `update`, `upsert` ani `delete` na `content_entries`.
- Zapis draftu idzie tylko przez RPC `save_content_draft(...)`.
- Publikacja idzie tylko przez RPC `publish_content_entry(...)`.
- Po publikacji draft zostaje jako robocza kopia ostatnio opublikowanej wersji.

### Bootstrap przykladowy

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

### Sekrety w buildzie

`npm run build` uruchamia `scripts/check-dist-secrets.mjs`, ktory blokuje build, jesli `dist/` zawiera nazwy sekretow:

- `AI_API_KEY`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Publikacja na GitHub Pages

Deployment jest skonfigurowany w `.github/workflows/deploy.yml`.
