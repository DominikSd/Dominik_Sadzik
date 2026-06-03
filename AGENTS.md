# AGENTS.md — instrukcje dla Codex / agentów VS Code

Ten projekt to publiczna strona portfolio/ofertowa oraz prywatny panel właściciela strony do lekkiej edycji treści i podglądu statystyk GA4. Panel ma być prosty, bezpieczny i możliwy do wykorzystania jako baza/template w przyszłych projektach.

## Zanim zaczniesz pracę

Przed każdą zmianą:

1. Przeczytaj:
   - `README.md`
   - `AGENTS.md`
   - odpowiedni dokument w `docs/`, jeśli dotyczy zadania.
2. Uruchom:
   ```bash
   git status
   ```
3. Ustal, czy pracujesz nad:
   - publiczną stroną,
   - panelem CMS,
   - Supabase,
   - GA4,
   - dokumentacją,
   - testami.
4. Nie zaczynaj dużego refaktoru bez krótkiego planu.

## Aktualny cel produktu

Budujemy:

- nowoczesną stronę portfolio/reklamę działalności IT,
- panel właściciela strony do lekkiej edycji tekstów,
- przepływ `draft` → `published`,
- podstawowe statystyki GA4 w panelu,
- bazę/template do przyszłych stron dla klientów.

Nie budujemy teraz:

- pełnego WordPressa,
- drag-and-drop CMS-buildera,
- dowolnego edytora layoutu,
- uploadu mediów,
- Supabase Storage,
- AI Assistant,
- raw analytics event table w Supabase,
- dużego systemu blogowego.

Jeśli zadanie wydaje się wymagać którejś z tych rzeczy, najpierw zatrzymaj się i zaproponuj osobny etap.

## Zasady bezpieczeństwa

Bezwzględnie:

- nie commituj sekretów,
- nie modyfikuj `.env` prawdziwymi wartościami,
- `.env.example` ma zawierać tylko placeholdery,
- nie dodawaj `SUPABASE_SERVICE_ROLE_KEY` do frontendu ani `VITE_*`,
- nie dodawaj `GOOGLE_PRIVATE_KEY` do frontendu ani `VITE_*`,
- nie dodawaj `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` do frontendu ani `VITE_*`,
- nie commituj plików `service-account*.json`,
- prywatne klucze Google trzymamy tylko w Supabase Edge Function Secrets,
- publiczne wartości frontendu mają prefiks `VITE_*`.

Jeśli musisz wspomnieć o sekretach w dokumentacji, używaj placeholderów, np.:

```text
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<paste_base64_here>
```

Nigdy nie wklejaj realnych wartości.

## Zasady Supabase CMS

Frontend nie może wykonywać bezpośrednich mutacji na `content_entries`.

Zabronione z klienta:

```text
.insert()
.update()
.upsert()
.delete()
```

dla tabeli:

```text
content_entries
```

Dozwolone mutacje treści:

```text
save_content_draft(...)
publish_content_entry(...)
```

Zasady:

- publiczna strona czyta tylko `published`,
- panel edytuje `draft`,
- `viewer` może czytać, ale nie może zapisywać ani publikować,
- `owner` i `editor` mogą zapisywać/publikować,
- `site_members.email` jest informacyjne,
- autoryzacja zawsze po `user_id`,
- RLS i RPC są źródłem prawdy, UI jest tylko warstwą wygody.

Jeśli zmieniasz migracje, dodawaj nową migrację zamiast bez potrzeby przepisywać starą. Stare migracje mogą być już uruchomione na prawdziwym Supabase.

## Zasady GA4

Tracking GA4:

- nie może startować przed zgodą użytkownika,
- po odrzuceniu zgody nie wysyła eventów,
- nie wysyła danych osobowych,
- `trackContactClick` nie może wysyłać adresu e-mail ani numeru telefonu,
- `trackFormSubmit` nie może wysyłać zawartości pól formularza,
- `trackPageView` nie może wysyłać query stringów, które mogą zawierać dane użytkownika.

Raporty GA4:

- raporty idą przez Supabase Edge Function `ga4-report`,
- frontend nie zna sekretów Google,
- `GA4_PROPERTY_ID` i `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` są tylko w Supabase Secrets,
- testy nie mogą wymagać prawdziwego Google API, chyba że użytkownik wyraźnie uruchamia test ręczny.

## UX panelu

Panel ma być dla nietechnicznego użytkownika.

Wymagania:

- formularze zamiast surowego JSON-a,
- czytelne etykiety pól,
- komunikaty: zapisano draft, opublikowano, brak dostępu, błąd pobierania,
- brak pustych ekranów przy błędzie,
- runtime error ma pokazywać fallback/error boundary,
- tryb JSON może istnieć tylko jako ukryty tryb deweloperski,
- panel nie może zakładać, że baza ma już drafty,
- jeśli brakuje draftu, startuj z `defaultSiteContent` i pozwól zapisać pierwszy draft.

## Styl pracy

Pracuj małymi etapami.

Dla każdego zadania:

1. Napisz krótki plan.
2. Zmień minimalną liczbę plików.
3. Nie dodawaj dużych funkcji przy okazji.
4. Nie zmieniaj zakresu produktu bez pytania.
5. Po zmianach wypisz:
   - zmienione pliki,
   - uruchomione komendy,
   - wyniki,
   - czego nie dało się sprawdzić,
   - co użytkownik musi zrobić ręcznie.

## Obowiązkowe komendy po zmianach

Po zmianach uruchom:

```bash
npm run format:check
npm test
npm run build
```

Jeżeli `npm run build` zatrzyma się na `EPERM`/`esbuild` w sandboxie, napisz to jasno i spróbuj ponownie normalnie. Nie ukrywaj błędów.

## Diagnostyka blank screen

Jeśli strona lub panel pokazuje tylko gradient/tło:

1. Sprawdź `F12 → Console`.
2. Najpierw napraw runtime error.
3. Szukaj szczególnie:
   - `React is not defined`,
   - błędów importu,
   - błędów env,
   - błędów w `AdminApp`,
   - błędów w formularzach sekcji,
   - błędów w `AnalyticsPanel`.
4. Dodaj fallback/error boundary, jeśli błąd może zabić całe UI.
5. Nie zgaduj — podaj przyczynę z konsoli.

## Routing

Panel domyślnie działa pod:

```text
/#/panel-admin
```

lub przy `base: "/Dominik_Sadzik/"`:

```text
/Dominik_Sadzik/#/panel-admin
```

`VITE_ADMIN_HASH_PATH` powinno mieć wartość bez `#` i bez ukośnika:

```env
VITE_ADMIN_HASH_PATH=panel-admin
```

Nie używaj:

```env
VITE_ADMIN_HASH_PATH=/panel-admin
VITE_ADMIN_HASH_PATH=#/panel-admin
```

## Dokumentacja

Jeżeli zmieniasz konfigurację lub sposób uruchamiania, zaktualizuj właściwy dokument:

- `README.md` — krótki opis i szybki start,
- `docs/configuration-map.md` — co wkleić gdzie,
- `docs/supabase-setup.md` — konfiguracja Supabase,
- `docs/ga4-setup.md` — konfiguracja GA4 i Google Cloud,
- `docs/local-cms-test.md` — test lokalny CMS,
- `docs/deployment-checklist.md` — checklista deployu,
- `docs/client-handover.md` — przekazanie klientowi,
- `docs/template-deployment-playbook.md` — proces użycia repo jako template’u dla klienta,
- `docs/hosting-options.md` — wybór hostingu dla stron klientów,
- `docs/client-ownership-model.md` — modele własności kont, domen i usług,
- `docs/client-maintenance-checklist.md` — comiesięczna obsługa klienta,
- `docs/pages-and-cms-content.md` — predefiniowane podstrony i edycja ich treści w CMS,
- `docs/roadmap.md` — przyszłe etapy.

Warto dodać, jeśli jeszcze ich nie ma:

- `docs/project-brief.md`,
- `docs/design-system.md`,
- `docs/template-reuse.md`,
- `docs/privacy-and-analytics.md`,
- `docs/manual-qa.md`.

## Zasady template/reuse

Kod panelu ma być możliwy do przeniesienia do innych projektów.

Traktuj ten projekt jako bazę/template pod płatne strony klientów z lekkim panelem CMS. Zmiany w
logice panelu, konfiguracji i dokumentacji nie mogą utrudniać skopiowania projektu do innej marki,
domeny albo instancji Supabase.

Dlatego:

- nie hardcoduj danych konkretnego klienta w logice,
- nie hardcoduj domeny, nazwy klienta, ścieżki hostingu ani `site_id` w logice aplikacji,
- używaj `VITE_SITE_ID`,
- używaj `sites.slug` i `site_members`,
- trzymaj konfigurację w `.env`/GitHub Variables/Supabase Secrets,
- trzymaj treści specyficzne dla strony w `src/content/defaultSiteContent.js` albo w CMS,
- trzymaj branding specyficzny dla klienta w warstwie treści/stylów, nie w logice CMS,
- konfigurację specyficzną dla hostingu opisuj w dokumentacji i zmiennych środowiskowych,
- oddzielaj logikę CMS od konkretnego designu strony,
- dokumentuj kroki bootstrapu nowego projektu,
- przed dodaniem nowego hardcodu zadaj pytanie, czy powinien być env/config/content,
- nie zmieniaj RPC, RLS ani modelu `content_entries` w sposób utrudniający reuse bez osobnego etapu,
- nie wprowadzaj zależności od jednej platformy hostingu, jeśli funkcja może zostać neutralna,
- nie rozbudowuj panelu w kierunku buildera, jeśli zadanie dotyczy tylko lekkiej edycji tekstu.

## Kryteria gotowości przed kolejnym etapem

Nie przechodź do AI, Storage, mediów lub postów, dopóki nie działa:

- lokalne logowanie do panelu,
- zapis draftu,
- publikacja,
- publiczna strona widzi tylko `published`,
- GitHub Pages ma ustawione `VITE_*`,
- GA4 tracking działa po zgodzie,
- panel nie ma runtime errorów,
- `npm run format:check`, `npm test`, `npm run build` przechodzą.
