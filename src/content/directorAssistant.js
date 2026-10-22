// Project facts supplied by the author; visuals supplied as adapted DEMO screenshots.
const media = (file, title, description, alt) => ({
  title,
  description,
  alt,
  src: `portfolio/director-assistant/${file}.webp`,
  fullSrc: `portfolio/director-assistant/${file}.png`,
  thumbnailSrc: `portfolio/director-assistant/${file}-thumb.webp`,
});

export const directorScreens = {
  editor: media(
    "04-wbudowany-edytor",
    "Wbudowany edytor",
    "Formatowanie treści, listy, proste tabele i zapis szkicu.",
    "Wizualizacja edytora Director Assistant z treścią pisma, listami i tabelą; dane DEMO.",
  ),
  records: media(
    "07-kartoteka-kontaktow",
    "Kartoteka kontaktów",
    "Wyszukiwanie, filtrowanie i dostęp do uporządkowanych rekordów.",
    "Wizualizacja kartoteki kontaktów Director Assistant z wyszukiwaniem i filtrami; dane DEMO.",
  ),
  history: media(
    "08-karta-kontaktu",
    "Historia danych",
    "Zapisane okresy, wcześniejsze wartości i dokumenty powiązane z rekordem.",
    "Wizualizacja karty kontaktu Director Assistant z zapisanymi okresami i historią korekt; dane DEMO.",
  ),
  archive: media(
    "03-centrum-dokumentow",
    "Archiwum i rewizje",
    "Zapisane dokumenty, ich wcześniejsze wersje i powiązane pliki.",
    "Wizualizacja centrum dokumentów Director Assistant z archiwum i historią rewizji; dane DEMO.",
  ),
  dashboard: media(
    "01-pulpit",
    "Pulpit aplikacji",
    "Podsumowanie danych i spraw wymagających uwagi.",
    "Wizualizacja pulpitu Director Assistant z podsumowaniem danych i spraw; dane DEMO.",
  ),
  checks: media(
    "02-sprawy-do-uzupelnienia",
    "Sprawy do uzupełnienia",
    "Wspólna lista braków z możliwością przejścia do właściwego rekordu.",
    "Wizualizacja listy spraw do uzupełnienia Director Assistant z filtrami; dane DEMO.",
  ),
  imports: media(
    "05-import-danych",
    "Import danych",
    "CSV, XLS i XLSX: wybór pliku, mapowanie i sprawdzanie danych.",
    "Wizualizacja importu kontaktów Director Assistant z etapami wczytania arkusza; dane DEMO.",
  ),
  company: media(
    "06-profil-firmy",
    "Profil firmy",
    "Dane organizacji wykorzystywane podczas przygotowywania dokumentów.",
    "Wizualizacja profilu firmy Director Assistant z formularzem danych organizacji; dane DEMO.",
  ),
};

export const directorProjectCard = {
  title: "Director Assistant",
  description:
    "Desktopowy asystent pracy z dokumentami. Łączy uporządkowane dane, import arkuszy, edytor tekstu i archiwum wersji, pomagając ograniczyć ręczne przepisywanie informacji.",
  items: ["C#", ".NET", "Avalonia", "SQLite"],
  mediaItems: [directorScreens.editor],
};

export const directorAssistantPage = {
  slug: "director-assistant",
  seo: {
    title: "Director Assistant — aplikacja desktopowa | Dominik Sadzik",
    description:
      "Autorska aplikacja desktopowa: kartoteki z historią danych, import CSV i Excel, edytor tekstu, dokumenty DOCX i XLSX oraz archiwum rewizji.",
    canonical: "https://dominik-sadzik.pl/director-assistant/",
    noindex: false,
    ogTitle: "Director Assistant — od danych do gotowego dokumentu",
    ogDescription:
      "Autorski asystent pracy z dokumentami: uporządkowane dane, import arkuszy, wbudowany edytor i archiwum wersji. C#, .NET, Avalonia i SQLite.",
    ogImage: "https://dominik-sadzik.pl/portfolio/director-assistant/04-wbudowany-edytor.png",
  },
  hero: {
    eyebrow: "Autorska aplikacja desktopowa",
    title: "Director Assistant",
    subtitle: "Od danych do gotowego dokumentu",
    description:
      "Autorska aplikacja desktopowa wspomagająca przygotowywanie dokumentów i porządkowanie danych wykorzystywanych w codziennej pracy. Projekt powstał z potrzeby ograniczenia wielokrotnego przepisywania tych samych informacji oraz uporządkowania dokumentacji.",
    ctaLabel: "Porozmawiajmy o projekcie",
    ctaHref: "#contact",
  },
  sections: {
    projectContext: {
      title: "Dane, treść i historia w jednym miejscu",
      description:
        "Wczytaj dane, sprawdź ich kompletność, przygotuj pismo lub zestawienie, a następnie wróć do zachowanego dokumentu i jego wcześniejszych wersji.",
      items: ["Dane są przechowywane lokalnie na komputerze."],
    },
    technologyStack: {
      title: "Technologie",
      description: "Technologie wykorzystane w aplikacji desktopowej.",
      items: ["C#", ".NET", "Avalonia", "SQLite"],
    },
    companyData: {
      title: "Kartoteki i historia danych",
      description:
        "Uporządkowane informacje o firmie, pracownikach i kontaktach są punktem wyjścia do przygotowywania dokumentów. Historia pozwala zachować wcześniejsze wartości, gdy dane się zmieniają.",
      items: [
        "Wyszukiwanie i filtrowanie rekordów",
        "Dodatkowe pola i informacje potrzebne w codziennej pracy",
        "Historia danych z zachowaniem wcześniejszych wartości",
      ],
      mediaItems: [directorScreens.records, directorScreens.history],
    },
    customDocuments: {
      title: "Edytor do własnych dokumentów",
      description:
        "Wbudowany edytor pomaga przygotować treść pisma bez wychodzenia z aplikacji. Można dopracować wybrane fragmenty i zachować szkic do dalszej pracy.",
      items: [
        "Formatowanie fragmentów tekstu i nagłówki",
        "Listy oraz proste tabele",
        "Zapisywanie szkiców dokumentów",
      ],
      mediaItems: [directorScreens.editor],
    },
    archiveRevisions: {
      title: "Archiwum i rewizje",
      description:
        "Dokument nie znika po utworzeniu. Archiwum daje dostęp do zapisanych plików, historii wersji oraz powiązanych danych, aby można było wrócić do wcześniejszego pisma i kontynuować pracę.",
      items: [
        "Dostęp do zachowanych dokumentów i plików",
        "Historia wcześniejszych wersji",
        "Powiązania dokumentów z danymi w kartotece",
      ],
      mediaItems: [directorScreens.archive],
    },
    importData: {
      title: "Import arkuszy",
      description:
        "Wczytywanie danych z CSV, XLS i XLSX, mapowanie kolumn oraz sprawdzanie poprawności przed świadomym zatwierdzeniem zmian.",
      items: ["CSV, XLS i XLSX", "Mapowanie kolumn", "Kontrola i zatwierdzenie zmian"],
    },
    documentCreation: {
      title: "Tworzenie dokumentów",
      description:
        "Pisma DOCX i zestawienia XLSX na podstawie przygotowanych danych. Konwersja do PDF korzysta z LibreOffice.",
      items: ["Pisma DOCX", "Zestawienia XLSX", "PDF przez LibreOffice"],
    },
    dataChecks: {
      title: "Kontrola braków",
      description:
        "Wspólna lista spraw wymagających uzupełnienia przed dalszą pracą pomaga sprawdzić kompletność danych i wrócić do odpowiedniego rekordu.",
      items: [
        "Sprawy z różnych obszarów w jednej liście",
        "Wyszukiwanie brakujących informacji",
        "Powrót do danych wymagających uzupełnienia",
      ],
    },
    gallery: {
      title: "Pozostałe widoki aplikacji",
      description:
        "Wizualizacje opracowano na podstawie rzeczywistych zrzutów mojego autorskiego programu Director Assistant. Nazewnictwo i dane przykładowe dostosowano do prezentacji ogólnego zastosowania aplikacji.",
      items: ["Kliknij podgląd, aby obejrzeć obraz w pełnym rozmiarze."],
      mediaItems: [
        directorScreens.dashboard,
        directorScreens.checks,
        directorScreens.imports,
        directorScreens.company,
      ],
    },
  },
};
