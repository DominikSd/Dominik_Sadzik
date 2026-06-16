export const CONTENT_SCHEMA_VERSION = 1;

export const defaultSiteContent = {
  schemaVersion: CONTENT_SCHEMA_VERSION,
  settings: {
    siteName: "Dominik Sadzik",
    tagline: "Strony internetowe i wizytówki online",
    footerText: "© 2026 Dominik Sadzik - Projektowanie stron i wizytówek",
    navItems: [
      { label: "Start", href: "#start" },
      { label: "Strony i CMS", href: "#/strony-cms" },
      { label: "QA", href: "#/qa-automatyzacja" },
      { label: "GameDev", href: "#/gamedev" },
      { label: "Projekty", href: "#projects" },
      { label: "Kontakt", href: "#contact" },
    ],
  },
  seo: {
    metaTitle: "Dominik Sadzik | Strony internetowe, wizytówki online i lekki CMS",
    metaDescription:
      "Tworzę nowoczesne, responsywne strony internetowe, portfolio i wizytówki online z prostym panelem CMS do edycji treści.",
    canonical: "https://dominik-sadzik.pl/",
    robots: "index,follow",
    ogTitle: "Dominik Sadzik | Strony internetowe, wizytówki online i lekki CMS",
    ogDescription:
      "Tworzę nowoczesne, responsywne strony internetowe, portfolio i wizytówki online z prostym panelem CMS do edycji treści.",
    ogImage: "https://dominik-sadzik.pl/link-preview.png",
    siteName: "Dominik Sadzik",
    locale: "pl_PL",
    pages: {
      start: {
        title: "Dominik Sadzik | Strony internetowe, wizytówki online i lekki CMS",
        description:
          "Tworzę nowoczesne, responsywne strony internetowe, portfolio i wizytówki online z prostym panelem CMS do edycji treści.",
        slug: "",
        canonical: "https://dominik-sadzik.pl/",
        noindex: false,
        ogTitle: "Dominik Sadzik | Strony internetowe i lekki CMS",
        ogDescription:
          "Portfolio i oferta tworzenia stron, wizytówek online oraz prostego CMS-a do edycji treści.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      projects: {
        title: "Projekty i realizacje | Dominik Sadzik",
        description:
          "Zobacz przykłady stron internetowych, projektów graficznych, lekkiego CMS-a, QA i prototypów interaktywnych.",
        slug: "projects",
        canonical: "https://dominik-sadzik.pl/#projects",
        noindex: false,
        ogTitle: "Projekty i realizacje | Dominik Sadzik",
        ogDescription:
          "Wybrane realizacje, projekty graficzne i koncepcje pokazujące zakres mojej pracy.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      faq: {
        title: "FAQ | Strony internetowe i CMS",
        description:
          "Odpowiedzi na najczęstsze pytania o stronę internetową, CMS, domenę, hosting i dalszą rozbudowę.",
        slug: "faq",
        canonical: "https://dominik-sadzik.pl/#faq",
        noindex: false,
        ogTitle: "FAQ | Strony internetowe i CMS",
        ogDescription:
          "Najważniejsze informacje przed rozpoczęciem pracy nad stroną internetową lub wizytówką online.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      contact: {
        title: "Kontakt | Dominik Sadzik",
        description:
          "Napisz, jeśli potrzebujesz strony internetowej, wizytówki online, prostego CMS-a albo wsparcia QA.",
        slug: "contact",
        canonical: "https://dominik-sadzik.pl/#contact",
        noindex: false,
        ogTitle: "Kontakt | Dominik Sadzik",
        ogDescription:
          "Skontaktuj się w sprawie strony internetowej, wizytówki online, lekkiego CMS-a lub testów strony.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
    },
  },
  hero: {
    eyebrow: "Strony internetowe - lekki CMS - QA",
    title: "Nowoczesne strony internetowe i",
    highlightedTitle: "lekki CMS dla Twojej firmy",
    description:
      "Projektuję estetyczne, responsywne strony i wizytówki online z prostym panelem edycji treści. Dbam o czytelny układ, wygodę korzystania i sprawne działanie strony po publikacji.",
    primaryCta: { label: "Wycena projektu", href: "#contact" },
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
    text: "Pomagam małym firmom i specjalistom pokazać ofertę w internecie: przejrzyście, responsywnie i z możliwością wygodnej edycji najważniejszych treści.",
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
    text: "Sprawdzam stronę tak, jak korzystałaby z niej prawdziwa osoba: klikam, szukam niejasności i wyłapuję rzeczy, które mogą przeszkodzić przed publikacją.",
    certificateNote: "Certyfikowany tester ISTQB - praktyczne podejście do jakości.",
    ctaLabel: "Zobacz QA",
    ctaHref: "#/qa-automatyzacja",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    cards: [
      {
        icon: "check",
        title: "Testowanie stron i aplikacji",
        text: "Sprawdzanie formularzy, linków, wersji mobilnej i drobnych błędów, które użytkownik szybko zauważy.",
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
        text: "Automatyczne sprawdzanie najważniejszych miejsc na stronie, żeby szybciej wyłapać regresje po zmianach.",
      },
    ],
  },
  gamedevTeaser: {
    eyebrow: "Interaktywne projekty",
    title: "GameDev i projekty interaktywne",
    text: "Małe prototypy pokazują, że lubię pracować nie tylko nad wyglądem, ale też nad ruchem, zasadami i tym, co dzieje się po kliknięciu.",
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
        text: "Małe sceny i demo pomagają szybko sprawdzić pomysł, zanim zrobi się z niego większy projekt.",
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
      "Formularz, kalendarz rezerwacji lub szybki kontakt online",
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
    text: "Wybrane realizacje, projekty graficzne i koncepcje pokazują, jak mogę połączyć stronę, identyfikację wizualną, panel edycji treści oraz kontrolę jakości.",
    items: [
      {
        type: "Realizacja klienta",
        title: "Strona Centrum Terapii Neuronest",
        text: "Responsywna strona usługowa dla gabinetu terapeutycznego: czytelna oferta, karty usług, szczegóły współpracy i szybka ścieżka kontaktu.",
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
        screenshotUrl: "portfolio/naturopathy-card.png?v=2",
        mockupTone: "emerald",
        mockupScale: 1.42,
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
        title: "Lekki panel CMS dla strony firmowej",
        text: "Przykład zaplecza, w którym właściciel strony może samodzielnie zmieniać teksty, FAQ, ofertę, SEO i dane kontaktowe.",
        details:
          "Zmiany można spokojnie przygotować, sprawdzić i dopiero potem opublikować. Panel pokazuje też podstawowe statystyki odwiedzin.",
        status: "projekt koncepcyjny",
        category: "CMS",
        tags: ["CMS", "panel klienta", "statystyki", "edycja treści"],
        screenshotUrl: "portfolio/cms-panel-template.svg",
        mockupTone: "emerald",
        mockupScale: 1.28,
      },
      {
        type: "Automatyzacja",
        title: "Kontrola strony po publikacji",
        text: "Projekt demo pokazujący, jak można sprawdzać kluczowe elementy strony po publikacji: widoczność sekcji, CTA, formularz i podstawowe linki.",
        details: "Zakres obejmuje checklistę jakości i powtarzalne kontrole po zmianach.",
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
        tags: ["ISTQB", "scenariusze", "raport błędów", "jakość"],
        href: "#/qa-automatyzacja",
        linkLabel: "Zobacz QA",
        mockupTone: "cyan",
      },
      {
        type: "GameDev",
        title: "Interaktywny prototyp 2.5D",
        text: "Projekt własny związany z logiką rozgrywki: sterowanie, kolizje, punkty i proste zachowania obiektów.",
        details:
          "Prototyp pokazuje, jak myślę o ruchu, stanie aplikacji i jasnej reakcji po kliknięciu lub akcji gracza.",
        status: "prototyp",
        category: "GameDev",
        tags: ["GameDev", "prototyp", "2.5D", "interakcje"],
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
        canonical: "https://dominik-sadzik.pl/#/strony-cms",
        noindex: false,
        ogTitle: "Strony internetowe i lekki CMS",
        ogDescription:
          "Strony dla małych firm, specjalistów i usługodawców z prostym panelem edycji treści.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      hero: {
        eyebrow: "Strony i CMS",
        title: "Strony internetowe i lekki CMS",
        subtitle: "Nowoczesna strona z możliwością edycji treści",
        description:
          "Projektuję strony, które mają jasno pokazać ofertę i ułatwić kontakt. Jeśli chcesz później samodzielnie zmieniać teksty, mogę dodać prosty panel CMS.",
        ctaLabel: "Zapytaj o stronę",
        ctaHref: "#contact",
      },
      sections: {
        whatICanBuild: {
          title: "Co mogę przygotować",
          description:
            "Zakres dobieram do celu strony, branży i budżetu. Można zacząć od małej wizytówki i rozbudować ją etapami, także o integracje z narzędziami używanymi w firmie.",
          items: [
            "strona firmowa",
            "portfolio",
            "landing page",
            "wizytówka online",
            "lekki CMS",
            "panel statystyk GA4",
            "integracje z Google Calendar, formularzem lub systemem rezerwacji",
          ],
        },
        cmsPanel: {
          title: "Panel CMS",
          description:
            "Panel nie ma udawać WordPressa. Ma dawać szybki dostęp do najważniejszych treści i chronić stronę przed przypadkowym zepsuciem układu.",
          items: [
            "zmiana tekstów w ofercie",
            "edycja FAQ i kontaktu",
            "tytuły i opisy pod wyszukiwarkę",
            "zapis zmian przed publikacją",
            "prosty podgląd statystyk",
            "dostęp dla osoby, która ma pomagać przy stronie",
          ],
        },
        process: {
          title: "Proces współpracy",
          description:
            "Najpierw ustalamy, co strona ma załatwiać. Dopiero potem dobieram układ, treści i funkcje, żeby nie robić rzeczy tylko dla efektu.",
          items: [
            "krótka rozmowa o celu strony",
            "ustalenie sekcji i materiałów",
            "projekt i wdrożenie",
            "sprawdzenie telefonu i komputera",
            "publikacja strony",
            "poprawki po pierwszym odbiorze",
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
            "osoby, które szukają prostszej alternatywy dla rozbudowanego CMS-a",
          ],
        },
        finalCta: {
          title: "Chcesz stronę, którą da się później edytować?",
          description:
            "Napisz, co chcesz pokazać i co ma zrobić odwiedzający po wejściu na stronę. Na tej podstawie dobierzemy najprostszy sensowny zakres.",
          ctaLabel: "Skontaktuj się",
          ctaHref: "#contact",
        },
      },
    },
    qaAutomation: {
      slug: "qa-automatyzacja",
      seo: {
        title: "QA, testowanie i automatyzacja | Dominik Sadzik",
        description:
          "QA, testowanie stron i aplikacji, certyfikat ISTQB, checklisty przed publikacją i czytelne raportowanie błędów.",
        canonical: "https://dominik-sadzik.pl/#/qa-automatyzacja",
        noindex: false,
        ogTitle: "QA, testowanie i automatyzacja",
        ogDescription:
          "Praktyczne podejście do jakości stron: formularze, linki, wersja mobilna, raporty błędów i kontrole po zmianach.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      hero: {
        eyebrow: "QA i automatyzacja",
        title: "QA, testowanie i automatyzacja",
        subtitle: "Certyfikat ISTQB, checklisty i spokojniejsze wdrożenia",
        description:
          "Przed publikacją warto sprawdzić rzeczy, które użytkownik zauważy od razu: formularze, linki, wersję mobilną i drobne błędy w układzie. W tym pomaga mi podejście QA.",
        ctaLabel: "Porozmawiajmy o QA",
        ctaHref: "#contact",
      },
      sections: {
        istqbCertificate: {
          title: "Certyfikat ISTQB",
          description:
            "ISTQB traktuję jako uporządkowanie pracy, nie jako suchą teorię. Pomaga mi szybciej zauważać ryzyka i opisywać problemy tak, żeby dało się je łatwo poprawić.",
          items: [
            "sprawdzanie realnych ścieżek na stronie",
            "wyłapywanie miejsc, które mogą zmylić użytkownika",
            "oddzielanie błędów ważnych od kosmetyki",
            "kontrola, czy poprawka nie psuje innej części strony",
            "jasny opis problemu bez technicznego chaosu",
          ],
        },
        testing: {
          title: "Testowanie stron i aplikacji",
          description:
            "Patrzę na stronę praktycznie: czy da się wygodnie znaleźć ofertę, kliknąć kontakt, wysłać formularz i korzystać z niej na telefonie.",
          items: [
            "testy funkcjonalne",
            "testy formularzy",
            "testy responsywności",
            "kontrola linków i CTA",
            "kontrola najważniejszych elementów po publikacji",
          ],
        },
        automation: {
          title: "Automatyzacja powtarzalnych procesów",
          description:
            "Nie wszystko trzeba automatyzować. Ma to sens tam, gdzie po każdej zmianie wracają te same nudne kontrole.",
          items: [
            "powtarzalne scenariusze",
            "checklisty przed publikacją",
            "proste skrypty wspierające pracę",
            "sprawdzanie zmian po aktualizacjach",
            "raportowanie wyników",
          ],
        },
        bugReports: {
          title: "Raportowanie błędów",
          description:
            "Dobry raport nie jest listą narzekań. Ma szybko pokazać, co nie działa, gdzie to widać i co trzeba zrobić dalej.",
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
            "Najczęściej chodzi o proste rzeczy, które łatwo przeoczyć, a które mocno wpływają na odbiór strony.",
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
            "Możesz podesłać stronę albo opisać problem. Sprawdzę, co warto poprawić ręcznie, a co można później zautomatyzować.",
          ctaLabel: "Skontaktuj się",
          ctaHref: "#contact",
        },
      },
    },
    gamedev: {
      slug: "gamedev",
      seo: {
        title: "GameDev i projekty interaktywne | Dominik Sadzik",
        description:
          "Prototypy gier i małe interaktywne demo pokazujące pracę z ruchem, zasadami, sterowaniem i czytelnym UI.",
        canonical: "https://dominik-sadzik.pl/#/gamedev",
        noindex: false,
        ogTitle: "GameDev i projekty interaktywne",
        ogDescription:
          "Prototypy 2.5D, proste mechaniki i interaktywne demo pokazujące, jak myślę o ruchu, zasadach i reakcji na gracza.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      hero: {
        eyebrow: "GameDev",
        title: "GameDev i interaktywne prototypy",
        subtitle: "Małe demo, ruch, mechaniki i eksperymenty",
        description:
          "To nie jest oferta dużych gier komercyjnych. Pokazuję tu mniejsze prototypy, bo dobrze oddają sposób myślenia: pomysł, sterowanie, reakcja świata i szybkie sprawdzenie, czy mechanika ma sens.",
        ctaLabel: "Porozmawiajmy o projekcie",
        ctaHref: "#contact",
      },
      sections: {
        whatIBuild: {
          title: "Co pokazują prototypy",
          description:
            "Najbardziej lubię krótkie demo, w którym od razu widać pomysł. Postać ma się ruszać, obiekty mają reagować, a zasady powinny być jasne bez długiego tłumaczenia.",
          items: [
            "prototypy 2.5D",
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
            "Te prototypy pomagają mi też przy stronach. Łatwiej wtedy myśleć o stanie, ruchu, informacji zwrotnej i o tym, czy po kliknięciu dzieje się dokładnie to, czego ktoś oczekuje.",
          items: [
            "logika pod spodem",
            "czytelna reakcja po kliknięciu",
            "sprawdzanie nietypowych zachowań",
            "UI, które nie jest tylko statycznym obrazkiem",
            "szybkie testowanie pomysłu",
          ],
        },
        demos: {
          title: "Przykładowe projekty i demo",
          description:
            "Poniżej są krótkie fragmenty i screeny z prototypów. Nie udają gotowych produktów, tylko pokazują konkretne mechaniki i eksperymenty.",
          items: [
            "platformówka 2.5D",
            "interaktywne otoczenie",
            "interaktywny prototyp",
            "system punktów i zbierania obiektów",
          ],
          mediaItems: [
            {
              title: "Prototyp 3D z punktami",
              description:
                "Mały test zbierania obiektów, licznika punktów i prostego HUD-u w scenie 3D.",
              src: "portfolio/gamedev-stones-screen.webp",
              demoSrc: "portfolio/gamedev-stones-demo.gif",
              alt: "Screen prototypu 3D ze zbieraniem obiektów i licznikiem punktów.",
              tags: ["3D", "HUD", "punkty"],
            },
            {
              title: "Model i animacja postaci",
              description:
                "Eksperyment z prostą postacią, ruchem i prezentacją obiektu w trochę luźniejszej formie.",
              src: "portfolio/gamedev-pizza-character-screen.webp",
              demoSrc: "portfolio/gamedev-pizza-character.gif",
              alt: "Screen modelu postaci w kształcie kawałka pizzy.",
              tags: ["model", "animacja", "prototyp"],
            },
            {
              title: "Interakcja z otoczeniem",
              description:
                "Test tego, czy obiekty w świecie gry reagują jasno na działanie gracza.",
              src: "portfolio/gamedev-arena-screen.webp",
              demoSrc: "portfolio/gamedev-destruction-demo.gif",
              alt: "Screen interakcji z obiektami w środowisku 3D.",
              tags: ["fizyka", "interakcja", "3D"],
            },
            {
              title: "Poziom z platformami",
              description:
                "Fragment poziomu z platformami i przeszkodami, czyli szybkie sprawdzenie rytmu przejścia.",
              src: "portfolio/gamedev-conveyor-screen.webp",
              demoSrc: "portfolio/gamedev-conveyor-demo.gif",
              alt: "Screen poziomu 3D z platformami i przeszkodami.",
              tags: ["projekt poziomu", "platformy", "prototyp"],
            },
            {
              title: "Test przeszkód",
              description:
                "Układ z kolcami i platformami, gdzie ważne jest wyczucie odległości, czasu i ryzyka.",
              src: "portfolio/gamedev-spikes-screen.webp",
              demoSrc: "portfolio/gamedev-spikes-demo.gif",
              alt: "Screen poziomu 3D z kolcami i platformami.",
              tags: ["przeszkody", "platformy", "balans"],
            },
          ],
        },
        finalCta: {
          title: "Masz pomysł na interaktywny projekt?",
          description:
            "Jeśli chodzi Ci po głowie małe demo, interaktywny element na stronie albo prosty prototyp, możemy pogadać o tym bez robienia od razu wielkiej produkcji.",
          ctaLabel: "Napisz w sprawie GameDev",
          ctaHref: "#contact",
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
          "przycisk rezerwacji terminu lub integracja z kalendarzem",
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
    text: "Zebrałem odpowiedzi na pytania, które najczęściej pojawiają się przed rozpoczęciem strony internetowej.",
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
          "Tak. Stronę można rozwijać etapami: dodać nowe sekcje, podstrony, formularze, portfolio albo integracje z narzędziami, np. przyciskiem do rezerwacji terminu w kalendarzu.",
      },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Masz pomysł na stronę?",
    text: "Napisz, czego potrzebujesz. Odezwę się i podpowiem, jakie rozwiązanie będzie najlepsze na start.",
    email: "kontakt@dominiksadzik.pl",
    phone: "",
    www: "dominik-sadzik.pl",
    address: "Polska",
    emailButtonLabel: "Napisz wiadomość",
    phoneButtonLabel: "Zadzwoń",
  },
};
