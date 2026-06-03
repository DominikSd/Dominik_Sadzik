export const CONTENT_SCHEMA_VERSION = 1;

export const defaultSiteContent = {
  schemaVersion: CONTENT_SCHEMA_VERSION,
  settings: {
    siteName: "Dominik Sadzik",
    tagline: "Strony internetowe i wizytówki online",
    footerText: "© 2026 Dominik Sadzik - Projektowanie stron i wizytówek",
    navItems: [
      { label: "Start", href: "#" },
      { label: "Oferta", href: "#oferta" },
      { label: "Projekty", href: "#realizacje" },
      { label: "QA i automatyzacja", href: "#/automatyzacja-testowanie" },
      { label: "ISTQB", href: "#/tester-istqb" },
      { label: "GameDev", href: "#/gamedev" },
      { label: "Kontakt", href: "#kontakt" },
    ],
  },
  seo: {
    metaTitle: "Dominik Sadzik - Projektowanie stron internetowych i wizytówek",
    metaDescription:
      "Projektuję nowoczesne strony internetowe, wizytówki online i proste rozwiązania dla małych firm, specjalistów oraz lokalnych usług.",
  },
  hero: {
    eyebrow: "Strony internetowe - Wizytówki online",
    title: "Nowoczesne strony internetowe i",
    highlightedTitle: "wizytówki dla Twojej firmy",
    description:
      "Projektuję estetyczne, czytelne i responsywne strony oraz wizytówki online dla małych firm, specjalistów i lokalnych usług.",
    primaryCta: { label: "Wycena projektu", href: "#kontakt" },
    secondaryCta: { label: "Zobacz ofertę", href: "#oferta" },
    stats: [
      { value: "100%", label: "responsywny projekt" },
      { value: "SEO", label: "podstawy widoczności" },
      { value: "CMS", label: "gotowe do edycji" },
    ],
  },
  services: {
    eyebrow: "Oferta",
    title: "Proste usługi, które łatwo zrozumieć",
    text: "Bez technicznego żargonu. Najpierw ustalamy, czego potrzebujesz, a potem dobieramy rozwiązanie do celu i budżetu.",
    items: [
      {
        icon: "monitor",
        title: "Strony internetowe",
        text: "Nowoczesna strona, która prezentuje ofertę i ułatwia kontakt z klientem.",
      },
      {
        icon: "palette",
        title: "Wizytówki online",
        text: "Prosta wizytówka online z najważniejszymi informacjami o firmie.",
      },
      {
        icon: "sparkles",
        title: "Odświeżenie strony",
        text: "Poprawa wyglądu, układu i czytelności istniejącej strony.",
      },
    ],
  },
  automationQa: {
    eyebrow: "Jakość i automatyzacja",
    title: "Automatyzacja, QA i testowanie",
    text: "Jako certyfikowany tester ISTQB patrzę na strony nie tylko od strony wyglądu, ale też jakości działania. Pomagam wykrywać błędy, porządkować scenariusze testowe i automatyzować powtarzalne czynności, które oszczędzają czas przy rozwoju projektu.",
    certificateNote: "Certyfikowany tester ISTQB - praktyczne podejście do jakości.",
    ctaLabel: "Zobacz podejście QA",
    ctaHref: "#/automatyzacja-testowanie",
    secondaryCtaLabel: "Certyfikat i testy",
    secondaryCtaHref: "#/tester-istqb",
    cards: [
      {
        icon: "check",
        title: "Testowanie stron i aplikacji",
        text: "Sprawdzanie formularzy, linków, responsywności, podstawowych scenariuszy użytkownika i błędów UI.",
      },
      {
        icon: "sparkles",
        title: "Automatyzacja procesów",
        text: "Tworzenie prostych narzędzi i skryptów, które oszczędzają czas i ograniczają powtarzalne czynności.",
      },
      {
        icon: "globe",
        title: "QA i raportowanie błędów",
        text: "Przygotowanie przypadków testowych, checklist, raportów błędów i rekomendacji napraw.",
      },
      {
        icon: "monitor",
        title: "Podstawy testów automatycznych",
        text: "Automatyczne sprawdzanie wybranych ścieżek użytkownika i najważniejszych elementów strony.",
      },
    ],
  },
  gamedevTeaser: {
    eyebrow: "Interaktywne projekty",
    title: "GameDev i projekty interaktywne",
    text: "Od czasu do czasu rozwijam również projekty związane z tworzeniem gier i interaktywnych prototypów. To obszar, który łączy programowanie, logikę, kreatywność i testowanie zachowań użytkownika.",
    ctaLabel: "Zobacz GameDev",
    ctaHref: "#/gamedev",
    cards: [
      {
        icon: "sparkles",
        title: "Prototypy gier",
        text: "Tworzenie prostych mechanik, poziomów i interaktywnych scen.",
      },
      {
        icon: "monitor",
        title: "Logika rozgrywki",
        text: "Ruch postaci, kolizje, zbieranie punktów, przeciwnicy i podstawowe systemy gry.",
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
    title: "Stronę, która pomaga klientowi szybko podjąć decyzję",
    text: "Najważniejsze jest to, żeby odwiedzający od razu wiedział, czym się zajmujesz, co oferujesz i jak może się z Tobą skontaktować.",
    items: [
      "Responsywny wygląd na telefonie i komputerze",
      "Czytelna oferta bez technicznego chaosu",
      "Pomoc z domeną, hostingiem i publikacją",
      "Formularz kontaktowy lub szybki kontakt online",
      "Nowoczesny wygląd dopasowany do branży",
      "Możliwość dalszej rozbudowy",
    ],
  },
  process: {
    eyebrow: "Proces",
    title: "Jak wygląda współpraca?",
    text: "Prosto i etapami, żebyś od początku wiedział, co będzie się działo.",
    items: [
      {
        step: "01",
        title: "Rozmowa",
        text: "Mówisz, czego potrzebujesz. Ustalamy cel strony, grupę klientów i najważniejsze informacje.",
      },
      {
        step: "02",
        title: "Plan strony",
        text: "Przygotowuję prostą strukturę: co ma być na stronie, w jakiej kolejności i jak to pokazać.",
      },
      {
        step: "03",
        title: "Projekt i wykonanie",
        text: "Tworzę nowoczesny wygląd, dopasowuję wersję mobilną i dbam o czytelność treści.",
      },
      {
        step: "04",
        title: "Publikacja",
        text: "Pomagam uruchomić stronę, podpiąć domenę, formularz i najważniejsze ustawienia.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Realizacje i projekty",
    title: "Przykłady pracy, które pokazują zakres możliwości",
    text: "Sekcja łączy realizacje klientów za zgodą, projekty demo i bezosobowe koncepcje. Nie pokazuję prywatnych danych klientów bez zgody.",
    items: [
      {
        type: "Realizacja klienta",
        title: "Strona Centrum Terapii Neuronest",
        text: "Responsywna strona usługowa dla prawdziwej osoby, z czytelną ofertą, kartami terapii, sekcją szczegółów i szybkim kontaktem. Realizacja pokazana za zgodą - nie jest materiałem do kopiowania.",
        status: "realizacja",
        tags: ["React", "Vite", "SEO", "strona usługowa"],
        href: "https://iwona-sadzik.netlify.app/",
        linkLabel: "Otwórz stronę",
        screenshotUrl: "portfolio/neuronest-site.svg?v=2",
        mockupTone: "cyan",
      },
      {
        type: "Wizytówka/projekt graficzny",
        title: "Branding, wizytówki i materiały reklamowe",
        text: "Projekt pokazuje umiejętność przygotowania spójnej identyfikacji wizualnej: od motywu marki, przez wizytówkę i okładkę, po materiał gotowy do druku albo prezentacji online.",
        status: "projekt koncepcyjny",
        tags: ["branding", "wizytówki", "grafika", "druk"],
        screenshotUrl: "portfolio/naturopathy-card.svg?v=2",
        mockupTone: "emerald",
      },
      {
        type: "Projekt demo",
        title: "Karta promocyjna\nOkładka teczki",
        text: "Pionowa karta informacyjna pokazująca, jak można połączyć ikony, zdjęcia i tekst w czytelny materiał dla lokalnej placówki.",
        status: "projekt koncepcyjny",
        tags: ["grafika", "ulotka", "layout", "informacje"],
        screenshotUrl: "portfolio/przedszkole-karta.svg?v=1",
        mockupTone: "violet",
      },
      {
        type: "Panel CMS/template",
        title: "Lekki panel edycji treści",
        text: "Template strony z prywatnym panelem CMS, logowaniem, draftami, publikacją oraz podstawowymi statystykami GA4.",
        details:
          "Przygotowałem przepływ draft/published, autoryzację Supabase i widok statystyk bez ujawniania sekretów w froncie.",
        status: "projekt koncepcyjny",
        category: "CMS",
        tags: ["CMS", "Supabase", "Auth", "GA4"],
        screenshotUrl: "portfolio/cms-panel-template.svg",
        mockupTone: "emerald",
      },
      {
        type: "Automatyzacja",
        title: "Smoke test strony po deployu",
        text: "Projekt demo pokazujący, jak można sprawdzać kluczowe elementy strony po publikacji: widoczność sekcji, CTA, formularz i podstawowe linki.",
        details:
          "Zakres obejmuje checklisty QA, podstawowe scenariusze i pomysł na automatyczne kontrole regresji.",
        status: "projekt demo",
        category: "Automatyzacja",
        tags: ["QA", "testy", "checklista", "automatyzacja"],
        href: "#/automatyzacja-testowanie",
        linkLabel: "Zobacz QA",
        mockupTone: "blue",
      },
      {
        type: "Testowanie / QA",
        title: "Raport testów funkcjonalnych",
        text: "Koncepcja uporządkowanego raportu z testów: kroki odtworzenia, oczekiwany i rzeczywisty rezultat, priorytet oraz rekomendacja poprawki.",
        details:
          "Akcent na czytelną komunikację z klientem i szybkie odtworzenie problemu przez developera.",
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
        text: "Projekt własny związany z logiką rozgrywki: sterowanie, kolizje, punkty i proste zachowania obiektów.",
        details:
          "GameDev traktuję jako przestrzeń do ćwiczenia logiki, interakcji i testowania zachowań użytkownika.",
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
          "Automatyzacja procesów, testowanie stron internetowych i wsparcie QA dla nowoczesnych projektów webowych.",
        ogTitle: "Automatyzacja i testowanie stron",
        ogDescription:
          "Praktyczne podejście do QA, testów i automatyzacji powtarzalnych kontroli strony.",
      },
      hero: {
        eyebrow: "Automatyzacja i QA",
        title: "Automatyzacja i testowanie stron",
        subtitle: "Praktyczne wsparcie jakości dla stron i aplikacji",
        description:
          "Łączę podejście testerskie z praktyczną automatyzacją, aby szybciej wykrywać problemy, ograniczać powtarzalną pracę i zwiększać jakość stron oraz aplikacji.",
        ctaLabel: "Porozmawiajmy o automatyzacji",
        ctaHref: "#kontakt",
      },
      sections: {
        whatCanBeAutomated: {
          title: "Co mogę automatyzować",
          description:
            "Najlepiej zacząć od powtarzalnych kontroli, które często wracają po zmianach w projekcie.",
          items: [
            "checklisty przed publikacją",
            "testy powtarzalnych scenariuszy",
            "formularze kontaktowe",
            "linki i przyciski CTA",
            "podstawowe procesy administracyjne",
            "raportowanie wyników",
          ],
        },
        benefits: {
          title: "Jak to pomaga stronie lub aplikacji",
          description:
            "Automatyzacja nie zastępuje myślenia, ale pomaga szybciej wychwycić typowe problemy.",
          items: [
            "mniej ręcznego sprawdzania",
            "szybsze wykrywanie błędów",
            "większa pewność po zmianach",
            "lepsza jakość wdrożeń",
          ],
        },
        examples: {
          title: "Przykładowe zastosowania",
          description:
            "To praktyczne scenariusze, które można dopasować do skali strony lub aplikacji.",
          items: [
            "automatyczne sprawdzenie formularza kontaktowego",
            "sprawdzenie linków i CTA",
            "podstawowy smoke test po deployu",
            "kontrola widoczności najważniejszych sekcji strony",
            "proste skrypty wspierające pracę",
          ],
        },
        finalCta: {
          title: "Chcesz ograniczyć ręczne sprawdzanie?",
          description:
            "Napisz, co najczęściej sprawdzasz ręcznie. Pomogę ocenić, co warto uporządkować lub zautomatyzować na start.",
          ctaLabel: "Skontaktuj się",
          ctaHref: "#kontakt",
        },
      },
    },
    istqbTesting: {
      slug: "tester-istqb",
      seo: {
        title: "Certyfikowany tester ISTQB | Testowanie stron i aplikacji",
        description:
          "Testowanie funkcjonalne, raportowanie błędów i podejście QA oparte o wiedzę certyfikowanego testera ISTQB.",
        ogTitle: "Certyfikowany tester ISTQB",
        ogDescription:
          "Podejście do jakości oparte na scenariuszach użytkownika, ryzykach i czytelnym raportowaniu.",
      },
      hero: {
        eyebrow: "Tester ISTQB",
        title: "Certyfikowane podejście do testowania",
        subtitle: "Jakość, scenariusze i raportowanie błędów",
        description:
          "Certyfikat ISTQB pomaga mi patrzeć na projekt szerzej: przez scenariusze użytkownika, ryzyka, przypadki testowe i jakość wdrożenia.",
        ctaLabel: "Chcę sprawdzić stronę",
        ctaHref: "#kontakt",
      },
      sections: {
        qaMindset: {
          title: "Co oznacza podejście testerskie",
          description:
            "Testowanie to nie tylko kliknięcie strony. To uporządkowane szukanie ryzyk i sprawdzanie, czy użytkownik może wykonać najważniejsze zadania.",
          items: [
            "myślenie scenariuszami użytkownika",
            "szukanie ryzyk",
            "dokładne raportowanie błędów",
            "sprawdzanie działania na różnych urządzeniach",
            "weryfikacja po poprawkach",
          ],
        },
        testScope: {
          title: "Zakres testów",
          description:
            "Zakres dopasowuję do projektu: od podstawowej kontroli strony po bardziej szczegółowe testy po zmianach.",
          items: [
            "testy funkcjonalne",
            "testy UI",
            "testy responsywności",
            "testy formularzy",
            "testy podstawowego SEO i technicznego działania",
            "testy regresji po zmianach",
          ],
        },
        bugReport: {
          title: "Jak wygląda raport z testów",
          description:
            "Raport powinien pomagać szybko zrozumieć problem i odtworzyć go bez zgadywania.",
          items: [
            "opis błędu",
            "kroki odtworzenia",
            "oczekiwany rezultat",
            "rzeczywisty rezultat",
            "priorytet",
            "screenshot lub notatka, jeśli dostępne",
          ],
        },
        clientBenefits: {
          title: "Dlaczego to ważne dla klienta",
          description:
            "Dobre testy zmniejszają ryzyko, że błąd zobaczy dopiero użytkownik końcowy.",
          items: [
            "mniej błędów po publikacji",
            "lepszy odbiór strony",
            "większe zaufanie użytkowników",
            "szybsze poprawki",
          ],
        },
        finalCta: {
          title: "Chcesz sprawdzić swoją stronę?",
          description:
            "Mogę przejść przez najważniejsze scenariusze, opisać problemy i przygotować czytelną listę poprawek.",
          ctaLabel: "Skontaktuj się ze mną",
          ctaHref: "#kontakt",
        },
      },
    },
    gamedev: {
      slug: "gamedev",
      seo: {
        title: "GameDev i projekty interaktywne | Dominik Sadzik",
        description:
          "Prototypy gier, logika rozgrywki i interaktywne projekty rozwijane jako część techniczno-kreatywnego portfolio.",
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
          title: "Co tworzę i testuję",
          description:
            "Najbardziej interesują mnie małe, konkretne prototypy, w których widać logikę i interakcje.",
          items: [
            "prototypy 2D",
            "proste mechaniki",
            "sterowanie postacią",
            "kolizje",
            "zbieranie punktów",
            "przeciwnicy",
            "poziomy",
            "elementy edukacyjne",
          ],
        },
        connectionToWeb: {
          title: "Jak GameDev łączy się z moją ofertą",
          description:
            "Tworzenie gier dobrze rozwija myślenie o interakcji, stanie aplikacji i testowaniu zachowań.",
          items: [
            "logika aplikacji",
            "praca z interakcją użytkownika",
            "testowanie zachowań",
            "kreatywne UI",
            "prototypowanie",
          ],
        },
        demos: {
          title: "Przykładowe projekty i demo",
          description:
            "To obszary projektów własnych i koncepcyjnych, bez danych prywatnych klientów.",
          items: [
            "platformówka 2D",
            "prosta gra edukacyjna",
            "interaktywny prototyp",
            "system punktów i zbierania obiektów",
          ],
        },
        finalCta: {
          title: "Masz pomysł na interaktywny projekt?",
          description:
            "Napisz, czy chodzi o prototyp, demo, element edukacyjny czy kreatywną interakcję na stronie.",
          ctaLabel: "Napisz w sprawie GameDev",
          ctaHref: "#kontakt",
        },
      },
    },
  },
  packages: {
    eyebrow: "Pakiety",
    title: "Możesz zacząć od małego projektu",
    text: "Każdy projekt wyceniam indywidualnie po krótkiej rozmowie, ale pakiety pomagają szybko wybrać dobry kierunek.",
    items: [
      {
        name: "Wizytówka online",
        desc: "Dla osób, które chcą szybko i estetycznie pokazać się w internecie.",
        points: ["strona one-page", "oferta i kontakt", "wersja mobilna", "pomoc z publikacją"],
      },
      {
        name: "Strona firmowa",
        desc: "Dla małych firm, specjalistów i usług lokalnych.",
        points: [
          "kilka sekcji",
          "portfolio lub realizacje",
          "formularz kontaktowy",
          "podstawy SEO",
        ],
        highlighted: true,
      },
      {
        name: "Poprawki i rozwój",
        desc: "Dla osób, które mają już stronę, ale chcą ją poprawić lub rozbudować.",
        points: ["lepszy układ", "poprawa treści", "nowy wygląd", "dalsze wsparcie"],
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Najczęstsze pytania",
    text: "Sekcja FAQ pomaga klientowi poczuć, że cały proces jest prosty i bezpieczny.",
    items: [
      {
        question: "Czy muszę mieć gotowe teksty na stronę?",
        answer:
          "Nie musisz mieć wszystkiego gotowego. Możesz opisać mi swoją ofertę zwykłymi słowami, a ja pomogę ułożyć to w czytelną strukturę.",
      },
      {
        question: "Czy strona będzie działać na telefonie?",
        answer:
          "Tak. Projekt od początku zakłada wersję mobilną, bo wielu klientów wchodzi na stronę właśnie z telefonu.",
      },
      {
        question: "Czy pomagasz z domeną i hostingiem?",
        answer:
          "Tak. Mogę pomóc wybrać domenę, hosting i przejść przez podstawowe ustawienia potrzebne do publikacji strony.",
      },
      {
        question: "Czy mogę później rozbudować stronę?",
        answer:
          "Tak. Stronę można rozwijać etapami: dodać nowe sekcje, podstrony, formularze, portfolio albo prostą automatyzację kontaktu.",
      },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Masz pomysł na stronę?",
    text: "Napisz, czego potrzebujesz. Odezwę się i podpowiem, jakie rozwiązanie będzie najlepsze na start.",
    email: "kontakt@twojadomena.pl",
    phone: "+48 123 456 789",
    www: "dominik-sadzik.pl",
    address: "Polska",
    emailButtonLabel: "Napisz wiadomość",
    phoneButtonLabel: "Zadzwoń",
  },
};
