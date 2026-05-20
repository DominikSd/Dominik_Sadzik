# Configuration Map

Ten projekt ma trzy miejsca konfiguracji. Nie mieszaj ich ze soba: frontend dostaje tylko publiczne `VITE_*`, a sekrety Google/Supabase zostaja poza repo.

## 1. Lokalny plik `.env`

Utworz lokalnie plik `.env` na podstawie `.env.example`. Tego pliku nie commitujemy.

Wklejamy:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_ID`
- `VITE_ADMIN_HASH_PATH`
- `VITE_GA_MEASUREMENT_ID`

Po zmianie `.env` uruchom ponownie `npm run dev`.

## 2. GitHub Actions Variables

W repozytorium GitHub wejdz w `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.

Wklejamy:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_ID`
- `VITE_ADMIN_HASH_PATH`
- `VITE_GA_MEASUREMENT_ID`

To sa publiczne wartosci uzywane podczas budowania strony na GitHub Pages.

## 3. Supabase Edge Function Secrets

Wklejamy przez Supabase CLI albo panel Supabase:

- `GA4_PROPERTY_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`

Te wartosci sa czytane tylko po stronie Edge Function `ga4-report`.

## 4. Nigdy Nie Wklejamy Do Repo Ani Frontendu

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
- `service-account.json`

`.env.example` jest tylko wzorem i musi zostac bez prawdziwych wartosci.
