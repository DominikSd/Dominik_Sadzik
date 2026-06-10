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
