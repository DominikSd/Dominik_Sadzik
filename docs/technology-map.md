# Interaktywna mapa portfolio

Mapa jest głównym elementem pierwszego ekranu strony oraz osobnym widokiem `/#/mapa`.
Przycisk „Odkryj mapę” otwiera osobny widok mapy na całą szerokość, ze szczegółami w nakładce.
Klasyczne menu i wszystkie dotychczasowe sekcje pozostają dostępne.

## Treści i konfiguracja

`src/content/technologyMap.js` zawiera definicje kategorii, podwęzłów, opisów, adresów,
i tekstów mapy. Dane projektów oraz kontaktu są odczytywane z aktualnego
contentu strony: opublikowanego CMS lub domyślnego fallbacku. Mapa nie pobiera draftów
publicznie; istniejący lokalny podgląd draftu nadal działa.

Główne kategorie: Strony WWW i CMS, Projekty, QA / Automatyzacja, O mnie, Kontakt.
Centrum stanowi „Strony WWW i CMS” z wyróżnioną poświatą. Pozostałe cztery główne gałęzie wychodzą bezpośrednio z tego węzła. Brak CV i profili społecznościowych
w aktualnych treściach oznacza brak takich odnośników. Nie dodano fikcyjnych projektów QA.

### Director Assistant

Węzeł `director-assistant` czyta nazwę i opis z `pages.directorAssistant` w aktualnej treści
strony. Przycisk w panelu prowadzi do istniejącej podstrony `/director-assistant/` z uwzględnieniem
prefiksu hostingu. Podstrona opisuje cel aplikacji i jest bazą do późniejszego dodania screenów.
Treść domyślna: `src/content/directorAssistant.js`; edycja w CMS: Treści podstron → Director Assistant.

Nowe linki powinny prowadzić do istniejących tras `#/...`, sekcji `#...` lub jawnego kontaktu
`mailto:`. Domyślne linki mapy prowadzą do istniejących stron/sekcji; panel nie otwiera CMS.

## Moduły

- `MapLoader.jsx`: lazy loading, Suspense i fallback linków po błędzie ładowania mapy.
- `TechnologyMap.jsx`: wybór gałęzi i szczegółów.
- `TechnologyGraph.jsx`: React Flow, zoom, przesuwanie i wycentrowanie.
- `TechnologyNode.jsx`: semantyczne przyciski, stany hover/focus/wyboru.
- `TechnologyEdge.jsx` i `edgeGeometry.js`: punkty styku na obwodzie koła lub zaokrąglonej krawędzi kafelka oraz łagodne krzywe bez zawracania do stałych portów.
- `mapLayout.js`: radialne pozycje głównych gałęzi, wachlarze podwęzłów, odstępy zapobiegające kolizjom i aktywne połączenia.
- `MapDetailsPanel.jsx`: panel desktopowy i dolny panel mobile z zamykaniem/Escape.
- `MapNavigationList.jsx`: alternatywa tekstowa i mobilne rozwijanie gałęzi.
- `technologyMap.css`: kolory, siatka, rozmiary węzłów i animacje.

`@xyflow/react` i jego CSS ładują się dopiero, gdy potrzebny jest graf desktopowy.
Na mobile w osobnym widoku mapy renderowana jest uproszczona nawigacja bez montowania grafu. Przy powiększeniu
okna powyżej 767 px graf może zostać załadowany. Pozycje nie używają symulacji fizycznej.

## Zachowanie i dostępność

Początkowo oferta w centrum i cztery gałęzie dookoła. Rozwijana jest jedna ścieżka
hierarchii naraz; ponowne kliknięcie gałęzi zwija ją wraz z potomkami. Projekty pokazują
najpierw Director Assistant, projekty web, projekty graficzne i GameDev. Dopiero kolejne
kliknięcie grupy ujawnia konkretne realizacje z CMS. Puste grupy nie mają przycisku rozwijania.

Podwęzły rozchodzą się wachlarzowo na zewnątrz od wybranej gałęzi, z kontrolą kolizji,
bez pionowej kolumny po prawej. Kamera płynnie obejmuje otwartą gałąź i jej nowe dzieci.
Po zwinięciu wraca do poprzedniego poziomu; „Wycentruj mapę” obejmuje cały widoczny graf. Kliknięcie węzła wybiera szczegóły, a przejście następuje dopiero
przez link w panelu. Wybrana ścieżka jest podświetlana; mapa ma jeden wspólny sposób eksploracji.

Graf obsługuje drag tła, pinch zoom oraz przyciski +/−/wycentrowanie. Zwykła rolka
przewija stronę. Węzły nie zmieniają ręcznie położenia. Tab i Enter/Spacja działają
na przyciskach; lista jest alternatywą dla przestrzennego grafu. Panel mobilny jest
niemodalny, więc nie blokuje nawigacji po gałęziach; po zamknięciu oddaje fokus.

`prefers-reduced-motion` wyłącza animacje połączeń, oddychanie i animowane ruchy kamery.
Animacje CSS zatrzymują się poza viewportem. Energy Trail korzysta z istniejących
`data-cursor-zone="map"`, `data-cursor-target="node"`, `data-cursor-state="dragging"`.

Istniejące funkcje GA4 rejestrują przejścia dopiero po zgodzie. Kontakt wysyła typ `email`
i lokalizację `technology_map`, bez adresu ani treści wiadomości. Nie dodano eventów
każdej klatki, przesunięcia mapy ani ruchu kursora.

## Kontrola

Uruchom `npm run format:check`, `npm test`, `npm run build`.
Repo nie ma osobnego skryptu lint ani skonfigurowanego workflow e2e; kontrola interakcji
odbywa się dodatkowo przez Playwright na lokalnym Vite. Sprawdź desktop, 1024 px i mobile,
rozwijanie/zamykanie, przejście do podstrony Director Assistant, focus, zoom/drag/reset,
przejścia do oferty, briefu i kontaktu, reduced motion oraz niezmienione trasy CMS.
Przed publikacją oceń też płynność na własnym telefonie i laptopie.

## Nowy start — wariant 2

Strona główna używa wyśrodkowanego wstępu, szerokiej mapy i krótkiego menu:
Usługi, Projekty, O mnie, Kontakt. Logo odsyła do początku. CTA wyceny pozostało
w nagłówku, a link do briefu znajduje się pod mapą. Cennik, proces i FAQ nadal są
w istniejących sekcjach i pływającej nawigacji. Po mapie pokazujemy najpierw ofertę,
następnie dotychczasową sekcję odbiorców. Widok `/#/mapa` wyświetla szczegóły w nakładce ponad grafem.

Na stronie głównej szczegóły są nakładką pojawiającą się dopiero po wybraniu węzła;
na telefonie nadal korzystają z dolnego panelu. Widok listy i sterowanie mapą są
w prawym dolnym rogu. Lista mobilna nie ładuje biblioteki grafu.

`src/content/homePresentation.js` rozpoznaje dokładny oryginalny zestaw ośmiu
adresów menu oraz oryginalną parę nagłówków szablonu i prezentuje nowy wariant.
To zgodność z wcześniej opublikowaną treścią, bez zapisu do bazy. Własne teksty,
opisy, CTA i niestandardowe menu CMS pozostają respektowane. Nowe wartości
startowe są w `defaultSiteContent.js`; można je zapisać i opublikować w obecnych
formularzach CMS. Opis jest zastępowany tylko wtedy, gdy również jest oryginalny.

`public/images/map-hero-backdrop.webp` to wygenerowane dekoracyjne tło (~37 KB),
bez tekstów i elementów interfejsu. Ikony i logo pozostają z istniejącego projektu.

## Korekta nagłówka i start mobilny

Nagłówek strony głównej ma trzy frazy bez kropek, rozdzielone odstępami na desktopie,
a na telefonie ułożone w trzech wierszach. `homeHero` rozpoznaje także poprzednią
domyślną parę tekstów z kropkami; własne teksty z CMS nadal są respektowane.

Poniżej 768 px strona główna wraca do klasycznego wstępu: eyebrow, nagłówek, opis,
aktualne `primaryCta` i `secondaryCta` z CMS oraz dyskretny link „Odkryj mapę portfolio”.
Nie montuje mapy ani jej listy i nie pobiera modułu grafu. Widok `/#/mapa` zachowuje
mobilne rozwijanie gałęzi i szczegóły w dolnym panelu. Na desktopie mapa nadal jest
głównym elementem startu. Przejście między szerokościami przełącza odpowiedni wariant.

## Ikony węzłów

Definicje w `src/content/technologyMap.js` zawierają semantyczny klucz `icon`.
`TechnologyNode.jsx` mapuje go na istniejące ikony Lucide, ze wspólną grubością kreski.
Każda główna gałąź i jej podkategorie mają przypisane znaczące symbole: folder,
panele aplikacji, przeglądarka, paleta, kontroler, checklista, odznaka, koła zębate itd.
Ikony pozostają dekoracyjne (`aria-hidden`); etykieta tekstowa identyfikuje przycisk.

Realizacje dobierają symbol na podstawie kategorii, typu i tagów z CMS: monitor dla
strony, suwaki dla CMS, okno dla aplikacji, pióro dla brandingu i drukarka dla materiałów
do druku. Przy grafice tytuł pozwala odróżnić branding od konkretnego druku. Nieznany
typ ma neutralny dokument zamiast symbolu kodu. Ikony nie zmieniają grupowania,
adresów, opisów ani modelu edycji CMS. Nową ikonę kategorii dopisuje się w `nodeIcons`.

## Mapa bez widocznej ramki — desktop

Od 768 px graf strony głównej i widoku `/#/mapa` dochodzi do boków strony.
Wysokość używa `svh` z dolnym i górnym limitem, bez blokowania scrollowania.
Statyczne gradienty wygaszają graf przy bokach (64 px) oraz u góry i dołu (52 px).
Warstwa nie przechwytuje myszy; przyciski i szczegóły znajdują się nad wygaszeniem.
Nie używamy filtrów blur w panelu desktopowym ani wielowarstwowej maski grafu.

`mapPanExtent` wyznacza granice przesuwania z aktualnie widocznych węzłów i rozmiaru
obszaru, więc rozwinięcie gałęzi poszerza dostępne miejsce. Jeśli gest skończy się
w pustym narożniku pomiędzy radialnymi gałęziami, `emptyViewAnchor` kieruje kamerę
do najbliższego węzła. Reset nadal obejmuje wszystkie widoczne węzły. Fokus klawiatury
na kafelku poza czytelnym obszarem przenosi go do środka widoku. Reduced motion
wyłącza animowane przejścia. Zoom i zwykłe przewijanie strony zachowują poprzednie zasady.

Panel szczegółów jest nakładką również w osobnym widoku mapy; nie odbiera grafowi
30% szerokości. Ma ograniczoną wysokość i własne przewijanie, a przyciski zoomu
pozostają dostępne. Klasyczny start mobilny oraz mobilny widok mapy pozostają bez zmian.
