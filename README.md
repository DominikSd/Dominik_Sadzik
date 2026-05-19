# Dominik Sadzik - strona osobista

Projekt strony osobistej/ofertowej dla uslug projektowania stron internetowych i wizytowek online.

## Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Supabase Auth/RLS jako prywatny CMS Etapu 1A
- Zod do walidacji tresci
- Google Analytics 4 przez consent i Edge Function raportowa

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
VITE_GA_MEASUREMENT_ID=
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
- `GA4_PROPERTY_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`

## Publikacja na GitHub Pages

Deployment jest skonfigurowany w `.github/workflows/deploy.yml`.

## Google Analytics 4 - tracking

Strona wysyla zdarzenia do GA4 tylko wtedy, gdy istnieje `VITE_GA_MEASUREMENT_ID` i uzytkownik zaakceptuje analityke w banerze zgody.

### Konfiguracja tracking ID

1. Utworz web data stream w Google Analytics 4.
2. Skopiuj Measurement ID, np. `G-XXXXXXXXXX`.
3. Ustaw w `.env`:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Uruchom ponownie `npm run dev` albo zbuduj strone ponownie.

### Consent

- Decyzja uzytkownika zapisuje sie w `localStorage` jako `analytics_consent`.
- Przed zgoda GA4 nie jest ladowane i eventy nie sa wysylane.
- Kod jest przygotowany pod Google Consent Mode przez `gtag('consent', 'default'/'update', ...)`.

### Zdarzenia

Aktualnie wysylane sa:

- `page_view` przy starcie i zmianie hash route.
- `cta_click` dla glownego CTA.
- `contact_click` dla emaila, telefonu i przyciskow kontaktowych.
- `form_submit` jest przygotowane w module GA4 do uzycia, gdy pojawi sie formularz.

Do testowania uzyj:

- Google Analytics DebugView.
- Tag Assistant.
- DevTools Network i filtr `collect`.
- Wyczysc `localStorage.analytics_consent`, odswiez strone i sprawdz, ze przed zgoda nie ma eventow.

## Raporty GA4 w panelu admina

Zakladka `Statystyki` pobiera podstawowe raporty przez Supabase Edge Function `ga4-report`. Frontend wywoluje tylko Edge Function. Po stronie klienta nie ma sekretow Google ani `SUPABASE_SERVICE_ROLE_KEY`.

Raport pokazuje:

- users z ostatnich 7 i 30 dni,
- page views z ostatnich 7 i 30 dni,
- najpopularniejsze sciezki,
- eventy `cta_click`, `contact_click`, `form_submit`,
- zrodla ruchu, jesli GA4 zwraca dane.

### 1. Utworzenie service account w Google Cloud

1. Wejdz do Google Cloud Console.
2. Wybierz albo utworz projekt.
3. Przejdz do `IAM & Admin` -> `Service Accounts`.
4. Utworz konto serwisowe, np. `ga4-report-reader`.
5. Utworz klucz JSON dla tego konta.
6. Pobierz plik JSON lokalnie i nie dodawaj go do repo.

### 2. Wlaczenie Google Analytics Data API

1. W Google Cloud Console wejdz do `APIs & Services` -> `Library`.
2. Wyszukaj `Google Analytics Data API`.
3. Kliknij `Enable`.

### 3. Nadanie dostepu do GA4 property

1. W Google Analytics wejdz w `Admin`.
2. Wybierz odpowiednia property.
3. Wejdz w `Property access management`.
4. Dodaj email service account z pliku JSON, np. `name@project.iam.gserviceaccount.com`.
5. Nadaj role `Viewer` albo `Analyst`.

### 4. Sekrety Supabase Edge Function

Wymagane sa:

- `GA4_PROPERTY_ID` - numeryczne ID property GA4, nie Measurement ID `G-...`.
- oraz jedna z opcji:
  - `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
  - albo `GOOGLE_CLIENT_EMAIL` i `GOOGLE_PRIVATE_KEY`

Rekomendowana opcja to base64 calego JSON-a. PowerShell:

```powershell
$json = Get-Content .\service-account.json -Raw
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json))
supabase secrets set GA4_PROPERTY_ID="123456789" GOOGLE_SERVICE_ACCOUNT_JSON_BASE64="$base64"
```

Alternatywnie:

```powershell
supabase secrets set GA4_PROPERTY_ID="123456789" GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com" GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Nie ustawiaj tych wartosci jako `VITE_*`.

### 5. Wdrozenie Edge Function

```bash
supabase functions deploy ga4-report
```

Lokalnie:

```bash
supabase functions serve ga4-report --env-file ./supabase/functions/.env.local
```

### 6. Test endpointu

Najprosciej: zaloguj sie do panelu, wejdz w `Statystyki` i kliknij `Odswiez`.

Test przez curl wymaga tokena zalogowanego uzytkownika Supabase:

```bash
curl -X POST "https://<project-ref>.supabase.co/functions/v1/ga4-report" \
  -H "Authorization: Bearer <SUPABASE_USER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"site_id":"<VITE_SITE_ID>"}'
```

Uzytkownik musi byc aktywnym rekordem `site_members` dla tego `site_id`. Role `owner`, `editor` i `viewer` moga czytac statystyki.

### Cache i limity

- Frontend cache'uje raport przez okolo 10 minut.
- Edge Function cache'uje odpowiedz przez okolo 10 minut w ramach aktywnej instancji.
- Wymuszone odswiezenie jest przycinane, jesli poprzednie pobranie bylo mniej niz minute temu.
