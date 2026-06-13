# SEO checklist

Ten dokument opisuje techniczne SEO dla publicznej strony portfolio/CMS oraz sposób edycji SEO w
panelu. To przygotowanie strony pod lepszą prezentację w wyszukiwarce i social media, a nie
gwarancja wysokich pozycji w Google.

## Co zostało dodane

- Bazowe meta tagi w `index.html`:
  - `title`,
  - `description`,
  - `canonical`,
  - `robots`,
  - Open Graph,
  - Twitter/X card,
  - `theme-color`.
- JSON-LD:
  - `WebSite`,
  - `Person`,
  - `ProfessionalService`.
- `public/robots.txt`.
- `public/sitemap.xml`.
- Route-aware SEO w React:
  - strona główna,
  - sekcja projektów,
  - FAQ,
  - kontakt,
  - podstrony `#/strony-cms`, `#/qa-automatyzacja`, `#/gamedev`.
- `noindex,nofollow` dla prywatnych widoków panelu CMS, callbacku logowania i resetu hasła.
- Rozbudowana sekcja SEO w panelu CMS.

## Edycja SEO w CMS

W panelu CMS otwórz zakładkę `SEO`.

Możesz edytować:

- domyślny tytuł SEO,
- domyślny opis meta,
- canonical strony głównej,
- robots,
- nazwę strony,
- tytuł i opis do udostępniania,
- obrazek do udostępniania jako URL albo ścieżkę publiczną,
- SEO dla sekcji:
  - Start,
  - Projekty,
  - FAQ,
  - Kontakt.

Podstrony oferty (`Strony i CMS`, `QA`, `GameDev`) mają osobne pola SEO w zakładce
`Treści podstron`.

Zmiany działają tak samo jak reszta CMS:

1. Edytujesz pola.
2. Klikasz `Zapisz draft`.
3. Sprawdzasz podgląd.
4. Klikasz `Opublikuj`.

Publiczna strona używa tylko opublikowanych treści. Jeśli Supabase albo CMS jest niedostępny,
fallback bierze SEO z `src/content/defaultSiteContent.js`.

## Zalecenia długości

- `title`: około 30-60 znaków.
- `description`: około 70-160 znaków.
- `slug`: małe litery, cyfry i myślniki, bez spacji i polskich znaków.
- `canonical`: pełny adres URL albo puste pole.
- `ogImage`: pełny URL albo ścieżka publiczna, np. `portfolio/logo.svg`.

## Google Search Console

WYMAGA RĘCZNEGO DZIAŁANIA

1. Wejdź na <https://search.google.com/search-console>.
2. Dodaj usługę dla adresu:
   `https://dominiksd.github.io/Dominik_Sadzik/`
3. Zweryfikuj własność jedną z metod dostępnych w Google.
4. Po weryfikacji wejdź w `Sitemaps`.
5. Zgłoś sitemapę:
   `https://dominiksd.github.io/Dominik_Sadzik/sitemap.xml`
6. W `Kontrola adresu URL` sprawdź stronę główną i poproś o indeksowanie.

## Testowanie meta tagów i Open Graph

WYMAGA RĘCZNEGO DZIAŁANIA

Po deployu sprawdź:

- `view-source:https://dominiksd.github.io/Dominik_Sadzik/`,
- DevTools → Elements → `<head>`,
- Facebook Sharing Debugger,
- LinkedIn Post Inspector,
- narzędzia typu Open Graph Preview.

Pamiętaj, że część crawlerów social media nie wykonuje JavaScriptu albo ignoruje fragment po `#`.
Najpewniejsze meta tagi to te, które są już w `index.html`.

## Ograniczenia obecnego hash routingu

Projekt działa na GitHub Pages i używa adresów z `#`, np.:

```text
https://dominiksd.github.io/Dominik_Sadzik/#/strony-cms
```

To jest bezpieczne dla deployu na GitHub Pages, ale ma ograniczenia SEO:

- sitemap zawiera tylko główny publiczny adres strony,
- Google i social media mogą traktować hash-route jako część jednej strony,
- oddzielne podstrony z `#` nie są tak mocne SEO jak czyste URL-e.

Rekomendacja na później: jeśli SEO ma być ważnym kanałem pozyskiwania ruchu, warto rozważyć
przejście na czyste URL-e i hosting, który obsługuje fallback SPA albo statyczne generowanie
podstron. Tę migrację trzeba zrobić jako osobny etap, żeby nie zepsuć obecnego GitHub Pages.

## robots.txt i panel CMS

`robots.txt` pomaga crawlerom, ale nie zabezpiecza prywatnych danych.

Panel CMS nadal musi być chroniony przez:

- Supabase Auth,
- `site_members`,
- RLS/RPC,
- brak sekretów w froncie.

Panel oraz widoki logowania/resetu hasła dostają w aplikacji `robots: noindex,nofollow`.
