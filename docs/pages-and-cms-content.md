# Podstrony ofertowe i edycja w CMS

Ten etap porządkuje trzy predefiniowane podstrony portfolio/oferty:

- `#/strony-cms` - pełne rozwinięcie głównej oferty: strony, wizytówki online i lekki CMS.
- `#/qa-automatyzacja` - QA, testowanie, automatyzacja oraz sekcja certyfikatu ISTQB.
- `#/gamedev` - GameDev, prototypy i projekty interaktywne.

Stare adresy `#/automatyzacja-testowanie` i `#/tester-istqb` nie sa martwe: prowadza do
podstrony QA. `#/tester-istqb` przewija do sekcji certyfikatu ISTQB.

Projekt uzywa hash routingu, zeby podstrony dzialaly stabilnie na GitHub Pages bez dodatkowej
konfiguracji serwera.

## Gdzie edytowac tresci

Tresci sa w tym samym modelu CMS co reszta strony:

- publiczna strona czyta tylko wpisy `published`,
- panel CMS edytuje `draft`,
- zapis i publikacja ida przez RPC `save_content_draft` oraz `publish_content_entry`.

W panelu CMS dodano zakladki:

- `Automatyzacja i QA` - krótka zajawka kompetencji QA na stronie głównej.
- `GameDev` - krótka zajawka kompetencji GameDev na stronie głównej.
- `Projekty` - edycja kart projektow/przykladow prac.
  Nowe dane są częścią `defaultSiteContent`:
  Nie dodano bloga, buildera, uploadu mediow ani Supabase Storage.

## Struktura contentu

Nowe dane sa częścią `defaultSiteContent`:

- `automationQa` - sekcja home dla automatyzacji i testowania.
- `gamedevTeaser` - sekcja home dla GameDev.
- `pages.webCms` - podstrona stron, wizytowek online i lekkiego CMS.
- `pages.qaAutomation` - podstrona QA, automatyzacji i ISTQB.
- `pages.gamedev` - podstrona GameDev.

Kazda podstrona ma:

- `slug`,
- `seo.title`,
- `seo.description`,
- opcjonalne `ogTitle` i `ogDescription`,
- `hero`,
- predefiniowane sekcje list,
- `finalCta`.

## Jak dodac podobna podstrone w przyszlosci

1. Dodaj nowy wpis w `defaultSiteContent.pages`.
2. Dodaj walidacje w `siteContentSchema.js`, jesli struktura odbiega od obecnego schematu.
3. Dodaj mapowanie hash route w `LandingPage.jsx`.
4. Dodaj pola w `PagesSectionForm.jsx`, jesli nowa podstrona wymaga innego zestawu sekcji.
5. Sprawdz `npm run format:check`, `npm test` i `npm run build`.

Na potrzeby template'u trzymaj tresci specyficzne dla klienta w content/config, a nie w logice CMS.

## Mapa portfolio

`#/mapa` to dodatkowy widok interaktywnej mapy. Ta sama mapa jest częścią hero strony
startowej. Jej projekty i kontakt korzystają z aktualnego contentu CMS. Definicje grafu
pozostają w konfiguracji frontendu, bez zmiany modelu CMS i jego uprawnień.
Szczegóły oraz przygotowanie Director Assistant: [Mapa technologiczna](technology-map.md).

## Director Assistant

Nowa podstrona projektu działa pod `/director-assistant/` (oraz kompatybilnym
`/#/director-assistant`). Link znajduje się w mapie, karcie portfolio i stopce. Prezentacja
zawiera opis możliwości, technologie oraz osiem wizualizacji dostarczonych przez autora.

Treść domyślna jest wydzielona do `src/content/directorAssistant.js` i dołączona jako
`pages.directorAssistant`. Starsze opublikowane dane CMS automatycznie dostają tę nową stronę
z fallbacku. Istniejące podstrony oraz zapis draft/published pozostają w tym samym modelu.

W panelu: `Treści podstron` → `Director Assistant`. Można edytować hero, SEO oraz teksty
i listy sekcji (kontekst projektu, technologie, kartoteki, edytor, archiwum, import, eksport,
kontrola braków i wspólny podpis galerii).
`mediaItems` zawierają dostarczone wizualizacje; wspólny podpis wyjaśnia ich poglądową adaptację.
Przy kolejnych materiałach dodaj pliki do publicznych zasobów repo i uzupełnij URL, tekst
alternatywny, tytuł oraz opis. Nie dodajemy uploadu ani Supabase Storage.

Teksty opisują możliwości i technologie potwierdzone przez autora, bez niepotwierdzonych wyników.
Statyczny dokument SEO generowany przy buildzie używa treści repo, nie pobiera danych z CMS.
Sposób synchronizacji opisuje `docs/seo-checklist.md`.

### Materiały prezentacji aplikacji

Podstrona zawiera otwarcie z edytorem, trzy prezentacje (kartoteki i historia, edytor,
archiwum i rewizje), opis importu / eksportu / kontroli braków oraz galerię pozostałych
czterech widoków. Wszystkie osiem wizualizacji jest w `public/portfolio/director-assistant/`.
Oryginalne PNG mają 1600 × 1040 px; podglądy WebP mają 1200 px, a miniatury galerii 600 px.
Nie zmieniono kolorów, jasności ani treści dostarczonych obrazów.

Konfiguracja obrazów i tekstów: `src/content/directorAssistant.js`. Wpisy mediów zawierają
`src`, `fullSrc`, `thumbnailSrc`, tytuł, opis i tekst alternatywny. Pełne PNG są wczytywane
dopiero po otwarciu podglądu. Galeria korzysta z natywnego dialogu: Escape zamyka,
strzałki zmieniają obraz, przyciski obsługują dotyk, a „Rozmiar oryginalny” udostępnia
widok 1:1 z przewijaniem. Linki do PNG działają również bez JavaScriptu.

Wspólny podpis pod wszystkimi obrazami wyjaśnia adaptację screenów i użycie danych
przykładowych. Nie należy go usuwać przy kolejnych aktualizacjach materiałów.
Technologie (C#, .NET, Avalonia, SQLite) oraz możliwości opisano na podstawie informacji autora.
Konwersja PDF jest opisana z wymaganym udziałem LibreOffice.

W `/#/portfolio` aplikacja ma osobną kartę `pages.portfolio.sections.desktopApps`.
Starsze dane CMS dostają tę sekcję z fallbacku, zachowując dotychczasowe sekcje portfolio.
Treści i listy są edytowane istniejącymi formularzami CMS; zmiany plików wizualnych
wprowadza się w repozytorium. Edytor CMS nie jest modułem uploadu obrazów.
