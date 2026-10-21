# Energy Trail 1.0

Dekoracyjny kursor publicznych podstron, montowany raz w `AppRouter`. Panel CMS i ekrany
logowania zachowują wskaźnik systemowy. Nie wymaga zmiennych środowiskowych ani bibliotek.

## Architektura i parametry

`src/components/energy-cursor/`:

- `EnergyCursor.jsx` — cykl życia, jeden RAF, wskaźnik i pierścień HTML, Canvas przez portal do body.
- `ParticleEngine.js` — ograniczony ślad Canvas 2D i jeden zastępowany impuls kliknięcia.
- `cursorZone.js` — semantyczne cele hover oraz niezależny kontrakt mapy.
- `cursorConfig.js` — wszystkie podstawowe parametry do dostrojenia.
- `energyCursor.css` — wygląd pierścienia i bezpieczne ukrywanie wskaźnika systemowego.

Domyślnie: punkt 5 px, pierścień 24 px, hover 34 px, opóźnienie pierścienia 55 ms,
cząsteczki 1–3 px / 400 ms, emisja najczęściej co 32 ms podczas ruchu (około 8–13 widocznych),
limit 24, impuls 300 ms. Rozdzielczość Canvas ograniczają `maxDpr: 2` i
`maxCanvasPixels: 4000000`.

Mniej intensywny ślad: zmniejsz `particleOpacity`, `particleLifetime` lub `maxParticles`,
zwiększ `particleInterval` albo `particleDistance`. Mocniejszy: odwrotnie.
Kolory zmienisz przez `cyan`, `blue`, `violet`; komponent przekazuje je do CSS variables.
`followMs` steruje opóźnieniem pierścienia, `dotSize`, `ringSize`, `hoverSize` — jego rozmiarem.

## Kontrakt mapy

Mapa portfolio korzysta z poniższego kontraktu. Przykład niezależnej integracji:

```jsx
<div data-cursor-zone="map" data-cursor-state={isDragging ? "dragging" : undefined}>
  <button data-cursor-target="node" onClick={openTechnology}>
    React
  </button>
</div>
```

Na mapie, również podczas przeciągania, kursor zachowuje standardowy pierścień Energy Trail.
Atrybuty mapy nadal opisują kontekst, ale nie zmieniają wyglądu kursora w celownik.
Hover na węzłach powiększa pierścień tak samo jak na innych przyciskach.
Zmiany atrybutów są wykrywane również bez ruchu myszy. Komponent nie przechwytuje
wskaźnika ani nie wywołuje `preventDefault`; mapa zarządza swoim drag/zoom.
Dowolny obszar może wymusić wskaźnik systemowy przez `data-cursor="native"`.

## Dostępność i fallback

Wymagany jest precyzyjny wskaźnik z hover, brak reduced motion oraz zdarzenia myszy.
Na hybrydzie dotyk chowa efekt, a ponowny ruch myszy go przywraca. Klawiatura, blur,
opuszczenie okna, zmiana trasy i ukrycie karty czyszczą efekt. Po resize i powrocie
wystarczy poruszyć myszą. Pola formularzy, edytowalne obszary, otwarte natywne dialogi,
iframe i wyłączone kontrolki zachowują natywny wskaźnik.

Wszystkie warstwy mają `pointer-events: none` i `aria-hidden`. Kursor systemowy jest
ukrywany dopiero po poprawnej klatce; błąd inicjalizacji/rysowania przywraca go.
Po wygaśnięciu śladu i ustabilizowaniu pierścienia RAF przestaje pracować.

## Kontrola ręczna

Po `npm run dev` sprawdź ruch, hover na nawigacji, kliknięcie, zaznaczanie tekstu,
formularz briefu, nawigację publiczną i panel CMS. Sprawdź reduced motion w systemie,
wyjście poza okno, zmianę karty, resize oraz mysz/dotyk na urządzeniu hybrydowym.
Dłuższa sesja na przeciętnym laptopie i prawdziwe urządzenie hybrydowe są zalecane
przed publikacją; testy automatyczne nie zastępują oceny płynności i profilu pamięci.
