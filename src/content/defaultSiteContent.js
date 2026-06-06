export const CONTENT_SCHEMA_VERSION = 1;

export const defaultSiteContent = {
  schemaVersion: CONTENT_SCHEMA_VERSION,
  settings: {
    siteName: "Dominik Sadzik",
    tagline: "Strony internetowe i wizytówki online",
    footerText: "© 2026 Dominik Sadzik - Projektowanie stron i wizytówek",
    navItems: [
      { label: "Start", href: "#start" },
      { label: "Strony i CMS", href: "#web-cms" },
      { label: "QA", href: "#/qa-automatyzacja" },
      { label: "GameDev", href: "#/gamedev" },
      { label: "Projekty", href: "#projects" },
      { label: "Kontakt", href: "#contact" },
    ],
  },
  seo: {
    metaTitle: "Dominik Sadzik - Projektowanie stron internetowych i wizytówek",
    metaDescription:
      "Projektuję nowoczesne strony internetowe, wizytówki online i proste rozwiązania dla małych firm, specjalistów oraz lokalnych usług.",
  },
  hero: {
    eyebrow: "Strony internetowe - lekki CMS - QA",
    title: "Nowoczesne strony internetowe i",
    highlightedTitle: "lekki CMS dla Twojej firmy",
    description:
      "Projektuję estetyczne, responsywne strony i wizytówki online z prostym panelem edycji treści. Dodatkowo korzystam z doświadczenia QA/ISTQB i GameDev, żeby lepiej myśleć o jakości, interakcji i testowaniu.",
    primaryCta: { label: "Wycena projektu", href: "#kontakt" },
    secondaryCta: { label: "Zobacz projekty", href: "#projects" },
    stats: [
      { value: "100%", label: "responsywny projekt" },
      { value: "SEO", label: "podstawy widoczności" },
      { value: "CMS", label: "gotowe do edycji" },
    ],
  },
  services: {
    eyebrow: "Główna oferta",
    title: "Strony internetowe, wizytówki online i lekki CMS",
    text: "To główny obszar strony: przejrzysta oferta, responsywny projekt, podstawy SEO, panel edycji treści i statystyki GA4 w prywatnym panelu.",
    items: [
      {
        icon: "monitor",
        title: "Strony internetowe",
        text: "Nowoczesna strona firmowa, landing page albo portfolio, które jasno prowadzi użytkownika do kontaktu.",
      },
      {
        icon: "palette",
        title: "Wizytówki online",
        text: "Krótka, estetyczna strona z ofertą, danymi kontaktowymi, grafiką i dopasowaniem do branży.",
      },
      {
        icon: "sparkles",
        title: "Lekki CMS",
        text: "Prywatny panel do edycji treści, SEO, FAQ, danych kontaktowych i publikacji zmian bez ruszania kodu.",
      },
    ],
  },
  automationQa: {
    eyebrow: "Dodatkowa kompetencja",
    title: "QA i automatyzacja",
    text: "Testowanie, myślenie scenariuszami i automatyzacja pomagają mi tworzyć stabilniejsze strony oraz szybciej wychwytywać problemy przed publikacją.",
    certificateNote: "Certyfikowany tester ISTQB - praktyczne podejście do jakości.",
    ctaLabel: "Zobacz QA",
    ctaHref: "#/qa-automatyzacja",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
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
    text: "GameDev traktuję jako dodatkowy obszar rozwoju: prototypy, logika, interakcje i kreatywne testowanie zachowań użytkownika.",
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
        category: "Strony WWW",
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
        category: "Grafika / wizytówki",
        tags: ["branding", "wizytówki", "grafika", "druk"],
        screenshotUrl: "portfolio/naturopathy-card.svg?v=2",
        mockupTone: "emerald",
      },
      {
        type: "Projekt demo",
        title: "Karta promocyjna\nOkładka teczki",
        text: "Pionowa karta informacyjna pokazująca, jak można połączyć ikony, zdjęcia i tekst w czytelny materiał dla lokalnej placówki.",
        status: "projekt koncepcyjny",
        category: "Grafika / wizytówki",
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
        href: "#/qa-automatyzacja",
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
        href: "#/qa-automatyzacja",
        linkLabel: "Zobacz QA",
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
    webCms: {
      slug: "strony-cms",
      seo: {
        title: "Strony internetowe i lekki CMS | Dominik Sadzik",
        description:
          "Nowoczesne strony internetowe, wizytówki online i lekki panel CMS do edycji treści, SEO, FAQ, kontaktu i statystyk.",
        ogTitle: "Strony internetowe i lekki CMS",
        ogDescription:
          "Strony dla małych firm, specjalistów i usługodawców z prostym panelem edycji treści.",
      },
      hero: {
        eyebrow: "Strony i CMS",
        title: "Strony internetowe i lekki CMS",
        subtitle: "Nowoczesna strona z możliwością edycji treści",
        description:
          "Tworzę responsywne strony, wizytówki online i proste panele CMS, dzięki którym możesz edytować najważniejsze treści bez przebudowy strony.",
        ctaLabel: "Zapytaj o stronę",
        ctaHref: "#kontakt",
      },
      sections: {
        whatICanBuild: {
          title: "Co mogę przygotować",
          description:
            "Zakres dobieram do celu strony, branży i budżetu. Można zacząć od małej wizytówki i rozbudować ją etapami.",
          items: [
            "strona firmowa",
            "portfolio",
            "landing page",
            "wizytówka online",
            "lekki CMS",
            "panel statystyk GA4",
          ],
        },
        cmsPanel: {
          title: "Panel CMS",
          description:
            "Panel ma być prosty i bezpieczny: właściciel edytuje treści, ale nie rozbija layoutu strony.",
          items: [
            "edycja treści i sekcji oferty",
            "FAQ i dane kontaktowe",
            "podstawowe SEO",
            "tryb draft/published",
            "statystyki GA4 w panelu",
            "role owner/editor/viewer",
          ],
        },
        process: {
          title: "Proces współpracy",
          description:
            "Pracę prowadzę etapami, żeby od początku było jasne, co powstaje i co jest potrzebne do publikacji.",
          items: [
            "rozmowa i cel strony",
            "struktura treści",
            "projekt i wykonanie",
            "testy responsywności",
            "publikacja",
            "wsparcie po wdrożeniu",
          ],
        },
        audience: {
          title: "Dla kogo",
          description:
            "Najlepiej sprawdza się przy stronach, które mają jasno pokazać ofertę i ułatwić kontakt.",
          items: [
            "małe firmy",
            "specjaliści",
            "usługodawcy",
            "lokalne biznesy",
            "portfolio osobiste",
            "osoby, które nie chcą ciężkiego WordPressa",
          ],
        },
        finalCta: {
          title: "Chcesz stronę, którą da się później edytować?",
          description:
            "Napisz, czego potrzebujesz: prostej wizytówki, strony firmowej, portfolio albo panelu CMS do treści.",
          ctaLabel: "Skontaktuj się",
          ctaHref: "#kontakt",
        },
      },
    },
    qaAutomation: {
      slug: "qa-automatyzacja",
      seo: {
        title: "QA, testowanie i automatyzacja | Dominik Sadzik",
        description:
          "QA, testowanie stron i aplikacji, certyfikat ISTQB, automatyzacja powtarzalnych kontroli i raportowanie błędów.",
        ogTitle: "QA, testowanie i automatyzacja",
        ogDescription:
          "Praktyczne podejście do jakości stron, scenariuszy użytkownika i powtarzalnych kontroli.",
      },
      hero: {
        eyebrow: "QA i automatyzacja",
        title: "QA, testowanie i automatyzacja",
        subtitle: "Certyfikat ISTQB, scenariusze i stabilniejsze wdrożenia",
        description:
          "Łączę praktyczne testowanie z automatyzacją powtarzalnych kontroli. ISTQB pomaga mi patrzeć na projekt przez scenariusze użytkownika, ryzyka i jakość wdrożenia.",
        ctaLabel: "Porozmawiajmy o QA",
        ctaHref: "#kontakt",
      },
      sections: {
        istqbCertificate: {
          title: "Certyfikat ISTQB",
          description:
            "Certyfikat porządkuje podejście do jakości: pomaga myśleć scenariuszami, ryzykiem, przypadkami testowymi i czytelnym raportowaniem.",
          items: [
            "myślenie scenariuszami użytkownika",
            "szukanie ryzyk",
            "priorytetyzacja błędów",
            "testy regresji",
            "komunikacja z developerem i klientem",
          ],
        },
        testing: {
          title: "Testowanie stron i aplikacji",
          description:
            "Sprawdzam najważniejsze ścieżki użytkownika, formularze, linki, responsywność i podstawowe problemy UI.",
          items: [
            "testy funkcjonalne",
            "testy formularzy",
            "testy responsywności",
            "kontrola linków i CTA",
            "podstawowy smoke test po deployu",
          ],
        },
        automation: {
          title: "Automatyzacja powtarzalnych procesów",
          description:
            "Automatyzacja ma sens tam, gdzie te same kontrole wracają po każdej zmianie.",
          items: [
            "powtarzalne scenariusze",
            "checklisty przed publikacją",
            "proste skrypty wspierające pracę",
            "kontrole regresji",
            "raportowanie wyników",
          ],
        },
        bugReports: {
          title: "Raportowanie błędów",
          description:
            "Raport powinien pomagać szybko zrozumieć problem i odtworzyć go bez zgadywania.",
          items: [
            "opis błędu",
            "kroki odtworzenia",
            "oczekiwany rezultat",
            "rzeczywisty rezultat",
            "priorytet",
            "rekomendacja poprawki",
          ],
        },
        examples: {
          title: "Przykładowe zastosowania",
          description:
            "Zakres można dopasować do strony, aplikacji albo procesu, który często wymaga ręcznego sprawdzania.",
          items: [
            "formularz kontaktowy",
            "linki i przyciski CTA",
            "publikacja nowej wersji strony",
            "sprawdzenie widoczności sekcji",
            "raport błędów po zmianach",
          ],
        },
        finalCta: {
          title: "Chcesz sprawdzić stronę przed publikacją?",
          description:
            "Napisz, co najczęściej sprawdzasz ręcznie. Pomogę ocenić, co warto uporządkować lub zautomatyzować.",
          ctaLabel: "Skontaktuj się",
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
