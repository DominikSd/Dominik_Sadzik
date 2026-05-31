# Template Deployment Playbook

Ten dokument opisuje proces użycia repo jako bazy dla nowej strony klienta: publiczna strona
React/Vite, lekki panel CMS, Supabase Auth/RLS/RPC oraz podstawowe statystyki GA4.

Zakres template'u:

- lekka edycja treści przez formularze,
- przepływ `draft` -> `published`,
- role `owner`, `editor`, `viewer`,
- podstawowy panel statystyk GA4,
- brak AI, Storage, uploadu mediów, postów i CMS-buildera.

## 1. Skopiowanie Repo

1. Utwórz nowe repo dla klienta na GitHubie albo skopiuj katalog projektu lokalnie.
2. Zmień remote Git:

   ```bash
   git remote -v
   git remote set-url origin <new-repository-url>
   ```

3. Zmień nazwę projektu w `package.json`.
4. Zaktualizuj tytuł i opis projektu w `README.md`.
5. Sprawdź, czy w historii i plikach nie ma lokalnych sekretów ani plików `.env`.

## 2. Zmiana Nazwy Projektu I Brandingu

Elementy do dostosowania dla klienta:

- `package.json` -> `name`,
- `README.md` -> opis projektu i szybki start,
- `index.html` -> `title`, `description`, `theme-color`,
- `src/content/defaultSiteContent.js` -> domyślne teksty strony,
- `src/LandingPage.jsx` -> layout, sekcje i komunikaty publicznej strony,
- `src/index.css` i Tailwind classes -> kolory, typografia, spacing,
- publiczne assety w `public/`, jeśli projekt ich używa.

Nie hardcoduj nazwy klienta, domeny ani `site_id` w logice CMS. Dane specyficzne dla strony powinny
trafić do `.env`, konfiguracji hostingu, Supabase albo `defaultSiteContent`.

## 3. Konfiguracja `.env`

Skopiuj wzór:

```bash
cp .env.example .env
```

Uzupełnij publiczne wartości frontendu:

```env
VITE_SUPABASE_URL=<client_supabase_url>
VITE_SUPABASE_ANON_KEY=<client_supabase_anon_key>
VITE_SITE_ID=<client_site_uuid>
VITE_ADMIN_HASH_PATH=panel-admin
VITE_GA_MEASUREMENT_ID=<ga4_measurement_id>
```

Zasady:

- `.env` zostaje lokalnie i nie trafia do repo.
- `.env.example` ma tylko placeholdery.
- Do frontendu trafiają wyłącznie wartości `VITE_*`.
- Nie dodawaj `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_PRIVATE_KEY` ani
  `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` do repo, frontendu ani GitHub Variables.

## 4. Konfiguracja Hostingu Frontendu

Wybierz hosting:

- GitHub Pages dla portfolio, demo i prostych wdrożeń.
- Netlify, Vercel albo Cloudflare Pages dla płatnych stron klientów.
- Płatny hosting lub infrastruktura klienta, jeśli umowa wymaga pełnej kontroli.

W hostingu ustaw publiczne zmienne:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_ID
VITE_ADMIN_HASH_PATH
VITE_GA_MEASUREMENT_ID
```

Jeśli hosting używa innego `base` niż GitHub Pages, sprawdź `vite.config.js`. Dla domeny głównej
często wygodniejsze jest `base: "/"`; dla GitHub Pages z repo path zostaje
`base: "/Dominik_Sadzik/"` albo odpowiednia ścieżka nowego repo.

## 5. Supabase Project

1. Utwórz projekt Supabase dla klienta albo użyj projektu, którym zarządzasz w modelu abonamentowym.
2. Wyłącz public signup, jeśli konta mają być tworzone ręcznie.
3. Utwórz pierwszego użytkownika w Supabase Auth.
4. Skopiuj publiczne wartości:
   - Project URL -> `VITE_SUPABASE_URL`,
   - anon public key -> `VITE_SUPABASE_ANON_KEY`.

Nie używaj service role key w aplikacji frontendowej.

## 6. Migracje

Wgraj migracje z katalogu `supabase/migrations/`.

Opcje:

- SQL editor w Supabase Dashboard,
- Supabase CLI,
- proces CI, jeśli projekt klienta go posiada.

Po migracjach sprawdź, czy istnieją:

- `sites`,
- `site_members`,
- `content_entries`,
- funkcje RPC `save_content_draft(...)` i `publish_content_entry(...)`,
- polityki RLS.

## 7. `sites` I `site_members`

Utwórz rekord strony:

```sql
insert into public.sites (id, slug, name)
values (
  '<client-site-uuid>',
  '<client-site-slug>',
  '<client-display-name>'
);
```

`<client-site-uuid>` ustaw także jako `VITE_SITE_ID`.

Dodaj pierwszego ownera:

```sql
insert into public.site_members (site_id, user_id, email, role)
values (
  '<client-site-uuid>',
  '<auth-user-id>',
  '<owner-email>',
  'owner'
);
```

Zasady:

- `site_members.email` jest informacyjne.
- Autoryzacja idzie po `user_id`.
- Role `owner` i `editor` mogą zapisywać/publikować.
- Rola `viewer` może czytać panel i statystyki, ale nie zapisuje treści.

## 8. Pierwszy Owner

1. Utwórz konto właściciela w Supabase Auth.
2. Skopiuj jego `user_id`.
3. Dodaj rekord w `site_members`.
4. Przetestuj logowanie hasłem.
5. Przetestuj magic link.
6. Przetestuj reset hasła.

Jeśli klient ma sam zarządzać kontami, opisz mu bezpieczny proces resetu hasła i zasady dostępu.

## 9. GitHub, Netlify, Vercel I Cloudflare Variables

Ustaw te same publiczne zmienne build-time w wybranym hostingu:

```text
VITE_SUPABASE_URL=<client_supabase_url>
VITE_SUPABASE_ANON_KEY=<client_supabase_anon_key>
VITE_SITE_ID=<client_site_uuid>
VITE_ADMIN_HASH_PATH=panel-admin
VITE_GA_MEASUREMENT_ID=<ga4_measurement_id>
```

Uwagi:

- GitHub Pages używa GitHub Actions Variables.
- Netlify używa Site configuration -> Environment variables.
- Vercel używa Project Settings -> Environment Variables.
- Cloudflare Pages używa Settings -> Environment variables.

Po każdej zmianie zmiennych uruchom nowy deploy.

## 10. GA4 Measurement ID

1. Utwórz albo wybierz GA4 Web Data Stream.
2. Skopiuj Measurement ID w formacie `G-XXXXXXXXXX`.
3. Ustaw `VITE_GA_MEASUREMENT_ID`.
4. Sprawdź, czy tracking startuje dopiero po zgodzie użytkownika.
5. Nie wysyłaj danych osobowych w eventach.

## 11. GA4 Property ID

Panel statystyk używa Google Analytics Data API przez Supabase Edge Function.

1. Odczytaj GA4 Property ID z Google Analytics Admin.
2. Nadaj service account dostęp do GA4 Property.
3. Przygotuj service account JSON lokalnie poza repo.
4. Zakoduj JSON do base64.
5. Ustaw sekrety w Supabase, nie w repo.

## 12. Supabase Edge Function Secrets

W Supabase ustaw:

```text
GA4_PROPERTY_ID=<ga4_property_id>
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<paste_base64_here>
```

Następnie wdroż Edge Function `ga4-report`.

Minimalny test:

1. Zaloguj się do panelu.
2. Otwórz zakładkę `Statystyki`.
3. Sprawdź, czy raport zwraca dane albo czy pokazuje czytelny błąd konfiguracji.

## 13. Domena

Ustal z klientem:

- kto jest właścicielem domeny,
- kto zarządza DNS,
- czy używasz domeny głównej czy subdomeny,
- kto ma dostęp do hostingu,
- kto odpowiada za odnowienia.

Po podpięciu domeny dodaj właściwe redirect URLs w Supabase Authentication -> URL Configuration,
np.:

```text
https://example.com/?auth=callback
https://example.com/?auth=recovery
```

Jeśli strona działa pod ścieżką, dodaj pełną ścieżkę:

```text
https://example.com/client-site/?auth=callback
https://example.com/client-site/?auth=recovery
```

## 14. Test Panelu

Przed przekazaniem klientowi wykonaj:

1. `npm run format:check`.
2. `npm test`.
3. `npm run build`.
4. Logowanie hasłem.
5. Magic link.
6. Reset hasła.
7. Brak dostępu dla użytkownika spoza `site_members`.
8. Zapis draftu.
9. Publikacja jednej bezpiecznej zmiany.
10. Publiczna strona widzi tylko `published`.
11. GA4 tracking działa po zgodzie.
12. Zakładka `Statystyki` nie pokazuje pustego ekranu.

## 15. Przekazanie Klientowi

Przekaż klientowi:

- adres publicznej strony,
- adres panelu CMS,
- listę kont z rolami,
- krótką instrukcję edycji treści,
- zasady resetu hasła,
- informację, czego panel nie obsługuje,
- ustalenia dotyczące hostingu, domeny, Supabase i GA4,
- miesięczny zakres obsługi, jeśli jest abonament.

Nie przekazuj klientowi sekretów przez e-mail ani komunikator bez uzgodnionego bezpiecznego kanału.

## 16. Checklist Przed Startem Produkcyjnym

- Repo klienta ma poprawną nazwę.
- `README.md` opisuje projekt klienta.
- Branding jest dostosowany.
- `.env.example` nie zawiera sekretów.
- Hosting ma komplet `VITE_*`.
- Supabase ma migracje, `sites` i `site_members`.
- Pierwszy owner działa.
- Auth redirect URLs pasują do realnego originu.
- GA4 Measurement ID działa po zgodzie.
- GA4 Property ID i service account są ustawione jako Supabase Secrets.
- Edge Function `ga4-report` jest wdrożona.
- Panel przechodzi test ręczny.
- Klient wie, kto odpowiada za domenę, hosting, backup i aktualizacje.
