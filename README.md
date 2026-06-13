# Dominik Sadzik — Strona portfolio + prywatny panel CMS

Nowoczesna strona portfolio/ofertowa dla działalności IT: tworzenie stron internetowych, wizytówek online, projektowanie graficzne, testowanie oprogramowania i usługi techniczne. Projekt ma jednocześnie pełnić rolę **wzorcowego szkieletu** pod przyszłe strony dla klientów: strona publiczna + prosty prywatny panel właściciela do lekkiej edycji treści i podglądu statystyk.

## Cel projektu

Projekt ma realizować trzy cele:

1. **Strona własna / portfolio**
   - prezentacja usług web developmentu, projektowania stron i wizytówek,
   - pokazanie umiejętności technicznych i graficznych,
   - nowoczesny, dopracowany wygląd, który sam jest reklamą jakości usług.

2. **Lekki panel zarządzania dla właściciela strony**
   - zmiana podstawowych tekstów,
   - edycja SEO, FAQ, oferty/usług i danych kontaktowych,
   - zapis wersji roboczej i publikacja,
   - brak możliwości przypadkowego „rozbicia” layoutu strony przez klienta.

3. **Baza/template dla przyszłych projektów**
   - panel CMS powinien być możliwy do przeniesienia do kolejnych stron,
   - konfiguracja Supabase/GA4 powinna być dobrze opisana,
   - kod powinien być uporządkowany i bezpieczny pod dalszą pracę z agentem/Codexem.

## Aktualny zakres

W projekcie są obecnie rozwijane:

- publiczna strona React/Vite,
- prywatny panel właściciela strony,
- Supabase Auth/RLS/RPC jako backend CMS,
- formularzowa edycja podstawowych treści,
- przepływ `draft` → `published`,
- walidacja treści przez Zod,
- Google Analytics 4 z consentem,
- zakładka statystyk GA4 przez Supabase Edge Function,
- testy, formatowanie i skan sekretów po buildzie.

W tym etapie **nie budujemy**:

- pełnego CMS-buildera,
- drag-and-drop layoutu,
- dowolnego dodawania sekcji przez klienta,
- uploadu mediów,
- Supabase Storage,
- własnej tabeli raw analytics events,
- AI Assistant,
- rozbudowanego systemu blogowego.

Te rzeczy mogą wrócić w roadmapie, ale dopiero po stabilizacji obecnego panelu.

## Stack

- React + Vite
- Tailwind CSS
- Supabase Auth, RLS i RPC
- Supabase Edge Functions
- Zod
- Google Analytics 4 + consent
- Google Analytics Data API przez backend
- Vitest
- Prettier
- GitHub Pages / GitHub Actions

## Szybki start lokalny

```bash
npm install
cp .env.example .env
npm run dev
```

Po skopiowaniu `.env.example` do `.env` uzupełnij lokalne wartości. Plik `.env.example` jest tylko wzorem i nie może zawierać prawdziwych danych projektu.

Panel lokalnie:

```text
http://localhost:5173/#/panel-admin
```

Jeśli zalogowany użytkownik nie pamięta hasła, panel oferuje wbudowany tryb resetu hasła, który wyśle link resetujący na e-mail.

W zależności od konfiguracji `base` w Vite lokalny adres może też wyglądać tak:

```text
http://localhost:5173/Dominik_Sadzik/#/panel-admin
```

Po każdej zmianie `.env` zatrzymaj i uruchom ponownie dev server:

```bash
Ctrl + C
npm run dev
```

## Zmienne środowiskowe

### Lokalny `.env`

W lokalnym pliku `.env` ustawiane są publiczne wartości dla frontendu:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_ID=
VITE_ADMIN_HASH_PATH=panel-admin
VITE_GA_MEASUREMENT_ID=
```

### GitHub Actions Variables

Na produkcji GitHub Pages te same publiczne wartości muszą być ustawione w:

```text
GitHub → repo → Settings → Secrets and variables → Actions → Variables
```

Wymagane:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_ID
VITE_ADMIN_HASH_PATH
VITE_GA_MEASUREMENT_ID
```

### Supabase Edge Function Secrets

Prywatne dane do raportów GA4 ustawiamy tylko w Supabase:

```text
Supabase → Project → Edge Functions → Secrets
```

Wymagane dla `ga4-report`:

```text
GA4_PROPERTY_ID
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
```

Nigdy nie zapisuj tych wartości w `.env`, `.env.example`, GitHub Variables ani kodzie frontendu.

## Bezpieczeństwo

Najważniejsze zasady:

- nie commitować `.env`,
- nie commitować service account JSON,
- nie dodawać `SUPABASE_SERVICE_ROLE_KEY` do frontendu,
- nie dodawać `GOOGLE_PRIVATE_KEY` ani `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` do frontendu,
- `.env.example` ma zawierać tylko placeholdery,
- publiczny frontend używa tylko `VITE_*`,
- mutacje `content_entries` mogą iść tylko przez RPC,
- panel nie może bezpośrednio wykonywać `.insert()`, `.update()`, `.upsert()` ani `.delete()` na `content_entries`,
- publiczna strona czyta tylko `published`,
- panel edytuje `draft`,
- użytkownik `viewer` nie może zapisywać ani publikować.

## Model CMS

Podstawowe tabele:

- `sites`
- `site_members`
- `content_entries`

Podstawowe role:

- `owner` — pełny dostęp do panelu,
- `editor` — edycja i publikacja treści,
- `viewer` — odczyt panelu/statystyk bez zapisu.

Podstawowe RPC:

- `save_content_draft(...)`
- `publish_content_entry(...)`

Zasada przepływu:

```text
formularz panelu → draft → publish → publiczna strona
```

Publiczna strona nie powinna widzieć wersji roboczych.

## GA4 i statystyki

Projekt używa GA4 w dwóch warstwach:

1. **Tracking frontendu**
   - działa po zgodzie użytkownika,
   - nie powinien wysyłać danych osobowych,
   - nie wysyła query stringów w `page_view`,
   - mierzy m.in. CTA, kontakt, formularze.

2. **Raporty w panelu**
   - pobierane przez Supabase Edge Function `ga4-report`,
   - sekrety Google są wyłącznie po stronie Supabase,
   - frontend nie posiada kluczy Google,
   - testy prawdziwego API wymagają ręcznej konfiguracji GA4/Google Cloud/Supabase.

## Komendy jakości

Po zmianach uruchom:

```bash
npm run format:check
npm test
npm run build
```

`npm run build` uruchamia także:

```bash
scripts/check-dist-secrets.mjs
```

Build nie może zawierać nazw lub wartości prywatnych sekretów.

## Dokumentacja projektu

- [Configuration map](docs/configuration-map.md)
- [Supabase setup](docs/supabase-setup.md)
- [GA4 setup](docs/ga4-setup.md)
- [SEO checklist](docs/seo-checklist.md)
- [Local CMS test](docs/local-cms-test.md)
- [Supabase RLS manual test](docs/supabase-rls-manual-test.md)
- [Deployment checklist](docs/deployment-checklist.md)
- [Client handover](docs/client-handover.md)
- [CMS template setup](docs/cms-template-setup.md)
- [Pages and CMS content](docs/pages-and-cms-content.md)
- [Template deployment playbook](docs/template-deployment-playbook.md)
- [Hosting options](docs/hosting-options.md)
- [Client ownership model](docs/client-ownership-model.md)
- [Client maintenance checklist](docs/client-maintenance-checklist.md)
- [Roadmap](docs/roadmap.md)

## Zalecane dodatkowe dokumenty

Przed dalszym dużym rozwojem warto dodać lub dopracować:

- `docs/project-brief.md` — opis wizji strony, grupy docelowej, usług i stylu marki,
- `docs/design-system.md` — kolory, typografia, komponenty, zasady layoutu,
- `docs/manual-qa.md` — testy ręczne po każdej większej zmiany,
- `docs/privacy-and-analytics.md` — zasady GA4, zgody, brak danych osobowych,
- `docs/client-editing-guide.md` — krótka instrukcja dla klienta: jak zmieniać teksty i publikować.

## Kierunek dalszych prac

Najbliższy kierunek:

1. Naprawić wszystkie runtime errory w panelu.
2. Dokończyć test lokalny CMS: login, draft, publish.
3. Sprawdzić deploy GitHub Pages ze zmiennymi `VITE_*`.
4. Dokończyć ręczne testy RLS.
5. Skonfigurować GA4 raporty przez Supabase Edge Function.
6. Dopiero potem rozważać kolejne funkcje.

Roadmapa późniejsza:

- historia zmian i audit log,
- prostsze zarządzanie użytkownikami panelu,
- lekkie posty/aktualności, jeśli faktycznie będą potrzebne,
- AI Assistant do poprawy tekstów i interpretacji statystyk,
- opcjonalna wersja panelu jako template do innych stron.
