# Client Maintenance Checklist

Ten dokument opisuje comiesięczną obsługę strony klienta opartej o ten template. Zakres jest
dopasowany do lekkiego CMS: strona publiczna, panel edycji treści, Supabase, GA4 i hosting statyczny.

Nie obejmuje:

- AI,
- uploadu mediów,
- Supabase Storage,
- postów/blogowego CMS,
- CMS-buildera,
- raw analytics events w Supabase.

## Comiesięczna Checklista

### 1. Sprawdź Deploy

- Otwórz stronę produkcyjną.
- Sprawdź, czy główne sekcje ładują się bez pustego ekranu.
- Sprawdź konsolę przeglądarki dla błędów runtime.
- Sprawdź ostatni deploy w hostingu.
- Sprawdź, czy build nie kończył się błędem.
- Sprawdź, czy certyfikat SSL jest aktywny.
- Sprawdź, czy domena i DNS działają poprawnie.

### 2. Sprawdź Supabase

- Sprawdź status projektu Supabase.
- Sprawdź, czy projekt nie przekracza limitów planu.
- Sprawdź, czy tabele `sites`, `site_members` i `content_entries` są dostępne.
- Sprawdź, czy RLS jest włączone.
- Sprawdź, czy RPC `save_content_draft(...)` i `publish_content_entry(...)` działają.
- Sprawdź, czy nie ma niepotrzebnych użytkowników w Auth.
- Sprawdź, czy role w `site_members` nadal są aktualne.

### 3. Sprawdź GA4

- Sprawdź, czy GA4 zbiera ruch.
- Sprawdź, czy `VITE_GA_MEASUREMENT_ID` jest ustawione w hostingu.
- Sprawdź, czy consent nadal blokuje tracking przed zgodą.
- Sprawdź, czy panel `Statystyki` zwraca raport albo czy pokazuje czytelny błąd.
- Sprawdź, czy Supabase Edge Function `ga4-report` działa.
- Sprawdź, czy sekrety `GA4_PROPERTY_ID` i `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` nadal są ustawione.

### 4. Sprawdź Formularze I Logowanie

- Zaloguj się hasłem do panelu.
- Sprawdź magic link, jeśli klient go używa.
- Sprawdź reset hasła na testowym lub uzgodnionym koncie.
- Sprawdź komunikat dla użytkownika bez dostępu w `site_members`.
- Zapisz testowy draft w bezpiecznej sekcji.
- Opublikuj małą zmianę tylko wtedy, gdy klient ją akceptuje.
- Sprawdź, czy publiczna strona widzi tylko wersję `published`.

### 5. Sprawdź Backup

Minimalnie ustal i wykonaj:

- eksport ważnych ustawień klienta,
- kontrolę dostępu do repo,
- kontrolę dostępu do Supabase,
- kontrolę dostępu do GA4,
- informację, gdzie są zapisane ustalenia domeny/hostingu.

Jeśli projekt jest płatny i produkcyjny, ustal osobną procedurę backupu bazy Supabase zgodną z
planem klienta i warunkami usługi.

### 6. Drobne Aktualizacje Zależności

Raz w miesiącu:

1. Sprawdź zależności:

   ```bash
   npm outdated
   ```

2. Aktualizuj ostrożnie tylko drobne wersje, jeśli nie zmieniają zachowania aplikacji.
3. Po aktualizacji uruchom:

   ```bash
   npm run format:check
   npm test
   npm run build
   ```

4. Nie rób dużych upgrade'ów frameworka bez osobnego zadania i zgody klienta.
5. Nie dodawaj nowych bibliotek bez uzasadnienia.

### 7. Spisz Zmiany

Po każdej miesięcznej obsłudze zapisz:

- datę,
- sprawdzony projekt,
- wykonane testy,
- wykonane aktualizacje,
- wykryte problemy,
- decyzje wymagające zgody klienta,
- następne kroki.

Przykład notatki:

```text
Data: 2026-05-31
Klient:
Projekt:

Sprawdzono:
- deploy:
- Supabase:
- GA4:
- logowanie:
- backup:

Zmiany:
- ...

Problemy:
- ...

Następne kroki:
- ...
```

## Checklista Po Incydencie

Jeśli klient zgłasza problem:

1. Sprawdź, czy strona działa publicznie.
2. Sprawdź konsolę przeglądarki.
3. Sprawdź ostatni deploy.
4. Sprawdź hosting i DNS.
5. Sprawdź Supabase status.
6. Sprawdź Auth i `site_members`.
7. Sprawdź Edge Function, jeśli problem dotyczy statystyk.
8. Nie wykonuj destrukcyjnych operacji na bazie bez backupu i zgody.

## Minimalny Raport Dla Klienta

Krótki raport miesięczny może wyglądać tak:

```text
Strona działa poprawnie.
Panel CMS działa poprawnie.
Logowanie i reset hasła sprawdzone.
GA4 zbiera dane.
Nie wykryto krytycznych błędów.
Wykonano drobne aktualizacje / nie było aktualizacji.
Następny przegląd: <date>.
```

Jeśli wykryto problem, opisz go prosto:

- co nie działa,
- jaki jest wpływ na klienta,
- co zostało zrobione,
- co wymaga decyzji klienta,
- czy są dodatkowe koszty.
