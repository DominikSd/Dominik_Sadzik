export const CONTENT_SCHEMA_VERSION = 1;

export const defaultSiteContent = {
  schemaVersion: CONTENT_SCHEMA_VERSION,
  settings: {
    siteName: "Dominik Sadzik",
    tagline: "Strony internetowe i wizytowki online",
    footerText: "© 2026 Dominik Sadzik - Projektowanie stron i wizytowek",
    navItems: [
      { label: "Oferta", href: "#oferta" },
      { label: "Realizacje", href: "#realizacje" },
      { label: "Proces", href: "#proces" },
      { label: "FAQ", href: "#faq" },
      { label: "Kontakt", href: "#kontakt" },
    ],
  },
  seo: {
    metaTitle: "Dominik Sadzik - Projektowanie stron internetowych i wizytowek",
    metaDescription:
      "Projektuje nowoczesne strony internetowe, wizytowki online i proste rozwiazania dla malych firm, specjalistow oraz lokalnych uslug.",
  },
  hero: {
    eyebrow: "Strony internetowe - Wizytowki online",
    title: "Nowoczesne strony internetowe i",
    highlightedTitle: "wizytowki dla Twojej firmy",
    description:
      "Projektuje estetyczne, czytelne i responsywne strony oraz wizytowki online dla malych firm, specjalistow i lokalnych uslug.",
    primaryCta: { label: "Wycena projektu", href: "#kontakt" },
    secondaryCta: { label: "Zobacz oferte", href: "#oferta" },
    stats: [
      { value: "100%", label: "responsywny projekt" },
      { value: "SEO", label: "podstawy widocznosci" },
      { value: "CMS", label: "gotowe do edycji" },
    ],
  },
  services: {
    eyebrow: "Oferta",
    title: "Proste uslugi, ktore latwo zrozumiec",
    text: "Bez technicznego zargonu. Najpierw ustalamy, czego potrzebujesz, a potem dobieramy rozwiazanie do celu i budzetu.",
    items: [
      {
        icon: "monitor",
        title: "Strony internetowe",
        text: "Nowoczesna strona, ktora prezentuje oferte i ulatwia kontakt z klientem.",
      },
      {
        icon: "palette",
        title: "Wizytowki online",
        text: "Prosta wizytowka online z najwazniejszymi informacjami o firmie.",
      },
      {
        icon: "sparkles",
        title: "Odswiezenie strony",
        text: "Poprawa wygladu, ukladu i czytelnosci istniejacej strony.",
      },
    ],
  },
  automationQa: {
    eyebrow: "Jakosc i automatyzacja",
    title: "Automatyzacja, QA i testowanie",
    text: "Jako certyfikowany tester ISTQB patrze na strony nie tylko od strony wygladu, ale tez jakosci dzialania. Pomagam wykrywac bledy, porzadkowac scenariusze testowe i automatyzowac powtarzalne czynnosci, ktore oszczedzaja czas przy rozwoju projektu.",
    certificateNote: "Certyfikowany tester ISTQB - praktyczne podejscie do jakosci.",
    ctaLabel: "Zobacz podejscie QA",
    ctaHref: "#/automatyzacja-testowanie",
    secondaryCtaLabel: "Certyfikat i testy",
    secondaryCtaHref: "#/tester-istqb",
    cards: [
      {
        icon: "check",
        title: "Testowanie stron i aplikacji",
        text: "Sprawdzanie formularzy, linkow, responsywnosci, podstawowych scenariuszy uzytkownika i bledow UI.",
      },
      {
        icon: "sparkles",
        title: "Automatyzacja procesow",
        text: "Tworzenie prostych narzedzi i skryptow, ktore oszczedzaja czas i ograniczaja powtarzalne czynnosci.",
      },
      {
        icon: "globe",
        title: "QA i raportowanie bledow",
        text: "Przygotowanie przypadkow testowych, checklist, raportow bledow i rekomendacji napraw.",
      },
      {
        icon: "monitor",
        title: "Podstawy testow automatycznych",
        text: "Automatyczne sprawdzanie wybranych sciezek uzytkownika i najwazniejszych elementow strony.",
      },
    ],
  },
  gamedevTeaser: {
    eyebrow: "Interaktywne projekty",
    title: "GameDev i projekty interaktywne",
    text: "Od czasu do czasu rozwijam rowniez projekty zwiazane z tworzeniem gier i interaktywnych prototypow. To obszar, ktory laczy programowanie, logike, kreatywnosc i testowanie zachowan uzytkownika.",
    ctaLabel: "Zobacz GameDev",
    ctaHref: "#/gamedev",
    cards: [
      {
        icon: "sparkles",
        title: "Prototypy gier",
        text: "Tworzenie prostych mechanik, poziomow i interaktywnych scen.",
      },
      {
        icon: "monitor",
        title: "Logika rozgrywki",
        text: "Ruch postaci, kolizje, zbieranie punktow, przeciwnicy i podstawowe systemy gry.",
      },
      {
        icon: "palette",
        title: "Edukacja i eksperymenty",
        text: "Wykorzystanie game devu w nauce programowania i kreatywnych projektach.",
      },
    ],
  },
  benefits: {
    eyebrow: "Co otrzymujesz",
    title: "Strone, ktora pomaga klientowi szybko podjac decyzje",
    text: "Najwazniejsze jest to, zeby odwiedzajacy od razu wiedzial, czym sie zajmujesz, co oferujesz i jak moze sie z Toba skontaktowac.",
    items: [
      "Responsywny wyglad na telefonie i komputerze",
      "Czytelna oferta bez technicznego chaosu",
      "Pomoc z domena, hostingiem i publikacja",
      "Formularz kontaktowy lub szybki kontakt online",
      "Nowoczesny wyglad dopasowany do branzy",
      "Mozliwosc dalszej rozbudowy",
    ],
  },
  process: {
    eyebrow: "Proces",
    title: "Jak wyglada wspolpraca?",
    text: "Prosto i etapami, zebys od poczatku wiedzial, co bedzie sie dzialo.",
    items: [
      {
        step: "01",
        title: "Rozmowa",
        text: "Mowisz, czego potrzebujesz. Ustalamy cel strony, grupe klientow i najwazniejsze informacje.",
      },
      {
        step: "02",
        title: "Plan strony",
        text: "Przygotowuje prosta strukture: co ma byc na stronie, w jakiej kolejnosci i jak to pokazac.",
      },
      {
        step: "03",
        title: "Projekt i wykonanie",
        text: "Tworze nowoczesny wyglad, dopasowuje wersje mobilna i dbam o czytelnosc tresci.",
      },
      {
        step: "04",
        title: "Publikacja",
        text: "Pomagam uruchomic strone, podpiac domene, formularz i najwazniejsze ustawienia.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Realizacje i projekty",
    title: "Przyklady pracy, ktore pokazuja zakres mozliwosci",
    text: "Sekcja laczy realizacje klientow za zgoda, projekty demo i bezosobowe koncepcje. Nie pokazuje prywatnych danych klientow bez zgody.",
    items: [
      {
        type: "Realizacja klienta",
        title: "Strona Centrum Terapii Neuronest",
        text: "Responsywna strona uslugowa dla prawdziwej osoby, z czytelna oferta, kartami terapii, sekcja szczegolow i szybkim kontaktem. Realizacja pokazana za zgoda - nie jest materialem do kopiowania.",
        status: "realizacja",
        tags: ["React", "Vite", "SEO", "strona uslugowa"],
        href: "https://iwona-sadzik.netlify.app/",
        linkLabel: "Otworz strone",
        screenshotUrl: "portfolio/neuronest-site.svg?v=2",
        mockupTone: "cyan",
      },
      {
        type: "Wizytowka/projekt graficzny",
        title: "Branding, wizytowki i materialy reklamowe",
        text: "Projekt pokazuje umiejetnosc przygotowania spojnej identyfikacji wizualnej: od motywu marki, przez wizytowke i okladke, po material gotowy do druku albo prezentacji online.",
        status: "projekt koncepcyjny",
        tags: ["branding", "wizytowki", "grafika", "druk"],
        screenshotUrl: "portfolio/naturopathy-card.svg?v=2",
        mockupTone: "emerald",
      },
      {
        type: "Projekt demo",
        title: "Karta promocyjna\nOkładka teczki",
        text: "Pionowa karta informacyjna pokazujaca, jak mozna polaczyc ikony, zdjecia i tekst w czytelny material dla lokalnej placowki.",
        status: "projekt koncepcyjny",
        tags: ["grafika", "ulotka", "layout", "informacje"],
        screenshotUrl: "portfolio/przedszkole-karta.svg?v=1",
        mockupTone: "violet",
      },
      {
        type: "Panel CMS/template",
        title: "Lekki panel edycji tresci",
        text: "Template strony z prywatnym panelem CMS, logowaniem, draftami, publikacja oraz podstawowymi statystykami GA4.",
        details:
          "Przygotowalem przeplyw draft/published, autoryzacje Supabase i widok statystyk bez ujawniania sekretow w froncie.",
        status: "projekt koncepcyjny",
        category: "CMS",
        tags: ["CMS", "Supabase", "Auth", "GA4"],
        screenshotUrl: "portfolio/cms-panel-template.svg",
        mockupTone: "emerald",
      },
      {
        type: "Automatyzacja",
        title: "Smoke test strony po deployu",
        text: "Projekt demo pokazujacy, jak mozna sprawdzac kluczowe elementy strony po publikacji: widocznosc sekcji, CTA, formularz i podstawowe linki.",
        details:
          "Zakres obejmuje checklisty QA, podstawowe scenariusze i pomysl na automatyczne kontrole regresji.",
        status: "projekt demo",
        category: "Automatyzacja",
        tags: ["QA", "testy", "checklista", "automatyzacja"],
        href: "#/automatyzacja-testowanie",
        linkLabel: "Zobacz QA",
        mockupTone: "blue",
      },
      {
        type: "Testowanie / QA",
        title: "Raport testow funkcjonalnych",
        text: "Koncepcja uporzadkowanego raportu z testow: kroki odtworzenia, oczekiwany i rzeczywisty rezultat, priorytet oraz rekomendacja poprawki.",
        details:
          "Akcent na czytelna komunikacje z klientem i szybkie odtworzenie problemu przez developera.",
        status: "koncepcja",
        category: "Testowanie / QA",
        tags: ["ISTQB", "test cases", "bug report", "regresja"],
        href: "#/tester-istqb",
        linkLabel: "Zobacz testowanie",
        mockupTone: "cyan",
      },
      {
        type: "GameDev",
        title: "Interaktywny prototyp 2D",
        text: "Projekt wlasny zwiazany z logika rozgrywki: sterowanie, kolizje, punkty i proste zachowania obiektow.",
        details:
          "GameDev traktuje jako przestrzen do cwiczenia logiki, interakcji i testowania zachowan uzytkownika.",
        status: "prototyp",
        category: "GameDev",
        tags: ["GameDev", "prototyp", "2D", "interakcje"],
        href: "#/gamedev",
        linkLabel: "Zobacz GameDev",
        mockupTone: "violet",
      },
    ],
  },
  pages: {
    automationTesting: {
      slug: "automatyzacja-testowanie",
      seo: {
        title: "Automatyzacja i testowanie stron | Dominik Sadzik",
        description:
          "Automatyzacja procesow, testowanie stron internetowych i wsparcie QA dla nowoczesnych projektow webowych.",
        ogTitle: "Automatyzacja i testowanie stron",
        ogDescription:
          "Praktyczne podejscie do QA, testow i automatyzacji powtarzalnych kontroli strony.",
      },
      hero: {
        eyebrow: "Automatyzacja i QA",
        title: "Automatyzacja i testowanie stron",
        subtitle: "Praktyczne wsparcie jakosci dla stron i aplikacji",
        description:
          "Lacze podejscie testerskie z praktyczna automatyzacja, aby szybciej wykrywac problemy, ograniczac powtarzalna prace i zwiekszac jakosc stron oraz aplikacji.",
        ctaLabel: "Porozmawiajmy o automatyzacji",
        ctaHref: "#kontakt",
      },
      sections: {
        whatCanBeAutomated: {
          title: "Co moge automatyzowac",
          description:
            "Najlepiej zaczac od powtarzalnych kontroli, ktore czesto wracaja po zmianach w projekcie.",
          items: [
            "checklisty przed publikacja",
            "testy powtarzalnych scenariuszy",
            "formularze kontaktowe",
            "linki i przyciski CTA",
            "podstawowe procesy administracyjne",
            "raportowanie wynikow",
          ],
        },
        benefits: {
          title: "Jak to pomaga stronie lub aplikacji",
          description:
            "Automatyzacja nie zastepuje myslenia, ale pomaga szybciej wychwycic typowe problemy.",
          items: [
            "mniej recznego sprawdzania",
            "szybsze wykrywanie bledow",
            "wieksza pewnosc po zmianach",
            "lepsza jakosc wdrozen",
          ],
        },
        examples: {
          title: "Przykladowe zastosowania",
          description:
            "To praktyczne scenariusze, ktore mozna dopasowac do skali strony lub aplikacji.",
          items: [
            "automatyczne sprawdzenie formularza kontaktowego",
            "sprawdzenie linkow i CTA",
            "podstawowy smoke test po deployu",
            "kontrola widocznosci najwazniejszych sekcji strony",
            "proste skrypty wspierajace prace",
          ],
        },
        finalCta: {
          title: "Chcesz ograniczyc reczne sprawdzanie?",
          description:
            "Napisz, co najczesciej sprawdzasz recznie. Pomoge ocenic, co warto uporzadkowac lub zautomatyzowac na start.",
          ctaLabel: "Skontaktuj sie",
          ctaHref: "#kontakt",
        },
      },
    },
    istqbTesting: {
      slug: "tester-istqb",
      seo: {
        title: "Certyfikowany tester ISTQB | Testowanie stron i aplikacji",
        description:
          "Testowanie funkcjonalne, raportowanie bledow i podejscie QA oparte o wiedze certyfikowanego testera ISTQB.",
        ogTitle: "Certyfikowany tester ISTQB",
        ogDescription:
          "Podejscie do jakosci oparte na scenariuszach uzytkownika, ryzykach i czytelnym raportowaniu.",
      },
      hero: {
        eyebrow: "Tester ISTQB",
        title: "Certyfikowane podejscie do testowania",
        subtitle: "Jakosc, scenariusze i raportowanie bledow",
        description:
          "Certyfikat ISTQB pomaga mi patrzec na projekt szerzej: przez scenariusze uzytkownika, ryzyka, przypadki testowe i jakosc wdrozenia.",
        ctaLabel: "Chce sprawdzic strone",
        ctaHref: "#kontakt",
      },
      sections: {
        qaMindset: {
          title: "Co oznacza podejscie testerskie",
          description:
            "Testowanie to nie tylko klikniecie strony. To uporzadkowane szukanie ryzyk i sprawdzanie, czy uzytkownik moze wykonac najwazniejsze zadania.",
          items: [
            "myslenie scenariuszami uzytkownika",
            "szukanie ryzyk",
            "dokladne raportowanie bledow",
            "sprawdzanie dzialania na roznych urzadzeniach",
            "weryfikacja po poprawkach",
          ],
        },
        testScope: {
          title: "Zakres testow",
          description:
            "Zakres dopasowuje do projektu: od podstawowej kontroli strony po bardziej szczegolowe testy po zmianach.",
          items: [
            "testy funkcjonalne",
            "testy UI",
            "testy responsywnosci",
            "testy formularzy",
            "testy podstawowego SEO i technicznego dzialania",
            "testy regresji po zmianach",
          ],
        },
        bugReport: {
          title: "Jak wyglada raport z testow",
          description:
            "Raport powinien pomagac szybko zrozumiec problem i odtworzyc go bez zgadywania.",
          items: [
            "opis bledu",
            "kroki odtworzenia",
            "oczekiwany rezultat",
            "rzeczywisty rezultat",
            "priorytet",
            "screenshot lub notatka, jesli dostepne",
          ],
        },
        clientBenefits: {
          title: "Dlaczego to wazne dla klienta",
          description:
            "Dobre testy zmniejszaja ryzyko, ze blad zobaczy dopiero uzytkownik koncowy.",
          items: [
            "mniej bledow po publikacji",
            "lepszy odbior strony",
            "wieksze zaufanie uzytkownikow",
            "szybsze poprawki",
          ],
        },
        finalCta: {
          title: "Chcesz sprawdzic swoja strone?",
          description:
            "Moge przejsc przez najwazniejsze scenariusze, opisac problemy i przygotowac czytelna liste poprawek.",
          ctaLabel: "Skontaktuj sie ze mna",
          ctaHref: "#kontakt",
        },
      },
    },
    gamedev: {
      slug: "gamedev",
      seo: {
        title: "GameDev i projekty interaktywne | Dominik Sadzik",
        description:
          "Prototypy gier, logika rozgrywki i interaktywne projekty rozwijane jako czesc techniczno-kreatywnego portfolio.",
        ogTitle: "GameDev i projekty interaktywne",
        ogDescription:
          "Prototypy 2D, mechaniki, logika gry i interaktywne demo jako dodatkowy obszar portfolio.",
      },
      hero: {
        eyebrow: "GameDev",
        title: "GameDev i interaktywne prototypy",
        subtitle: "Logika, interakcje i kreatywne eksperymenty",
        description:
          "GameDev rozwijam jako techniczno-kreatywny obszar portfolio - od prostych mechanik i logiki rozgrywki po eksperymenty edukacyjne i interaktywne demo.",
        ctaLabel: "Porozmawiajmy o projekcie",
        ctaHref: "#kontakt",
      },
      sections: {
        whatIBuild: {
          title: "Co tworze i testuje",
          description:
            "Najbardziej interesuja mnie male, konkretne prototypy, w ktorych widac logike i interakcje.",
          items: [
            "prototypy 2D",
            "proste mechaniki",
            "sterowanie postacia",
            "kolizje",
            "zbieranie punktow",
            "przeciwnicy",
            "poziomy",
            "elementy edukacyjne",
          ],
        },
        connectionToWeb: {
          title: "Jak GameDev laczy sie z moja oferta",
          description:
            "Tworzenie gier dobrze rozwija myslenie o interakcji, stanie aplikacji i testowaniu zachowan.",
          items: [
            "logika aplikacji",
            "praca z interakcja uzytkownika",
            "testowanie zachowan",
            "kreatywne UI",
            "prototypowanie",
          ],
        },
        demos: {
          title: "Przykladowe projekty i demo",
          description:
            "To obszary projektow wlasnych i koncepcyjnych, bez danych prywatnych klientow.",
          items: [
            "platformowka 2D",
            "prosta gra edukacyjna",
            "interaktywny prototyp",
            "system punktow i zbierania obiektow",
          ],
        },
        finalCta: {
          title: "Masz pomysl na interaktywny projekt?",
          description:
            "Napisz, czy chodzi o prototyp, demo, element edukacyjny czy kreatywna interakcje na stronie.",
          ctaLabel: "Napisz w sprawie GameDev",
          ctaHref: "#kontakt",
        },
      },
    },
  },
  packages: {
    eyebrow: "Pakiety",
    title: "Mozesz zaczac od malego projektu",
    text: "Kazdy projekt wyceniam indywidualnie po krotkiej rozmowie, ale pakiety pomagaja szybko wybrac dobry kierunek.",
    items: [
      {
        name: "Wizytowka online",
        desc: "Dla osob, ktore chca szybko i estetycznie pokazac sie w internecie.",
        points: ["strona one-page", "oferta i kontakt", "wersja mobilna", "pomoc z publikacja"],
      },
      {
        name: "Strona firmowa",
        desc: "Dla malych firm, specjalistow i uslug lokalnych.",
        points: [
          "kilka sekcji",
          "portfolio lub realizacje",
          "formularz kontaktowy",
          "podstawy SEO",
        ],
        highlighted: true,
      },
      {
        name: "Poprawki i rozwoj",
        desc: "Dla osob, ktore maja juz strone, ale chca ja poprawic lub rozbudowac.",
        points: ["lepszy uklad", "poprawa tresci", "nowy wyglad", "dalsze wsparcie"],
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Najczestsze pytania",
    text: "Sekcja FAQ pomaga klientowi poczuc, ze caly proces jest prosty i bezpieczny.",
    items: [
      {
        question: "Czy musze miec gotowe teksty na strone?",
        answer:
          "Nie musisz miec wszystkiego gotowego. Mozesz opisac mi swoja oferte zwyklymi slowami, a ja pomoge ulozyc to w czytelna strukture.",
      },
      {
        question: "Czy strona bedzie dzialac na telefonie?",
        answer:
          "Tak. Projekt od poczatku zaklada wersje mobilna, bo wielu klientow wchodzi na strone wlasnie z telefonu.",
      },
      {
        question: "Czy pomagasz z domena i hostingiem?",
        answer:
          "Tak. Moge pomoc wybrac domene, hosting i przejsc przez podstawowe ustawienia potrzebne do publikacji strony.",
      },
      {
        question: "Czy moge pozniej rozbudowac strone?",
        answer:
          "Tak. Strone mozna rozwijac etapami: dodac nowe sekcje, podstrony, formularze, portfolio albo prosta automatyzacje kontaktu.",
      },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Masz pomysl na strone?",
    text: "Napisz, czego potrzebujesz. Odezwe sie i podpowiem, jakie rozwiazanie bedzie najlepsze na start.",
    email: "kontakt@twojadomena.pl",
    phone: "+48 123 456 789",
    www: "dominik-sadzik.pl",
    address: "Polska",
    emailButtonLabel: "Napisz wiadomosc",
    phoneButtonLabel: "Zadzwon",
  },
};
