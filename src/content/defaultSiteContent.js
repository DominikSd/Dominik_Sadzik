export const CONTENT_SCHEMA_VERSION = 1;

export const defaultSiteContent = {
  schemaVersion: CONTENT_SCHEMA_VERSION,
  settings: {
    siteName: "Dominik Sadzik",
    tagline: "Strony internetowe i wizytówki online",
    footerText: "© 2026 Dominik Sadzik - Strony internetowe, wizytówki online i lekki CMS",
    navItems: [
      { label: "Start", href: "#start" },
      { label: "Oferta", href: "#offer" },
      { label: "Cennik", href: "#pricing" },
      { label: "Realizacje", href: "#projects" },
      { label: "Proces", href: "#process" },
      { label: "FAQ", href: "#faq" },
      { label: "Kontakt", href: "#contact" },
      { label: "Portfolio", href: "#/portfolio" },
    ],
  },
  seo: {
    metaTitle: "Dominik Sadzik | Strony internetowe dla małych firm",
    metaDescription:
      "Tworzę nowoczesne, responsywne strony internetowe, wizytówki online i lekkie panele CMS dla małych firm, specjalistów i usługodawców.",
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
        title: "Dominik Sadzik | Strony internetowe dla małych firm",
        description:
          "Strony internetowe, wizytówki online i prosty CMS dla małych firm, specjalistów i usług lokalnych.",
        slug: "",
        canonical: "https://dominik-sadzik.pl/",
        noindex: false,
        ogTitle: "Strona internetowa dla małej firmy",
        ogDescription:
          "Nowoczesna, responsywna strona z jasną ofertą, szybkim kontaktem i opcjonalnym panelem CMS.",
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
      portfolio: {
        title: "Portfolio | Dominik Sadzik - strony, QA i projekty interaktywne",
        description:
          "Zobacz realizacje, strony demo, projekty QA, automatyzację, GameDev i projekty graficzne Dominika Sadzika.",
        slug: "portfolio",
        canonical: "https://dominik-sadzik.pl/#/portfolio",
        noindex: false,
        ogTitle: "Portfolio | Dominik Sadzik",
        ogDescription:
          "Realizacje, strony demo, projekty graficzne oraz dodatkowe kompetencje QA i GameDev.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      "opisz-strone": {
        title: "Opisz stronę do wyceny | Dominik Sadzik",
        description:
          "Opisz, jakiej strony internetowej, wizytówki online lub lekkiego CMS-a potrzebujesz, a przygotuję wstępną propozycję zakresu.",
        slug: "opisz-strone",
        canonical: "https://dominik-sadzik.pl/#/opisz-strone",
        noindex: false,
        ogTitle: "Opisz stronę do wyceny | Dominik Sadzik",
        ogDescription:
          "Krótki formularz, który pomaga zebrać potrzeby przed wyceną strony internetowej lub panelu CMS.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      "polityka-prywatnosci": {
        title: "Polityka prywatności | Dominik Sadzik",
        description:
          "Informacje o danych z formularza kontaktowego, analityce i kontakcie w sprawie danych na stronie Dominik Sadzik.",
        slug: "polityka-prywatnosci",
        canonical: "https://dominik-sadzik.pl/#/polityka-prywatnosci",
        noindex: false,
        ogTitle: "Polityka prywatności | Dominik Sadzik",
        ogDescription:
          "Krótka informacja o tym, jakie dane może przetwarzać strona i do czego są wykorzystywane.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
    },
  },
  hero: {
    eyebrow: "Strony internetowe dla małych firm",
    title: "Nowoczesne strony internetowe i wizytówki dla",
    highlightedTitle: "Twojej firmy",
    description:
      "Projektuję estetyczne, responsywne strony i wizytówki online z prostym panelem edycji treści. Dbam o czytelny układ, wygodę korzystania i sprawne działanie strony po publikacji.",
    primaryCta: { label: "Poproś o wycenę", href: "#contact" },
    secondaryCta: { label: "Zobacz realizacje", href: "#projects" },
    briefCta: { label: "Opisz stronę", href: "#/opisz-strone" },
    stats: [
      { value: "Mobile", label: "strona wygodna na telefonie i komputerze" },
      { value: "Start", label: "pomoc z publikacją, domeną i formularzem" },
      { value: "CMS", label: "panel administratora do treści i aktualności" },
    ],
  },
  services: {
    eyebrow: "Oferta",
    title: "Co mogę przygotować?",
    text: "Dobieram zakres do celu strony i budżetu. Możemy zacząć od prostej wizytówki online albo przygotować stronę firmową z panelem administratora.",
    items: [
      {
        icon: "monitor",
        title: "Wizytówka online",
        text: "Krótka strona z ofertą, danymi kontaktowymi i jasnym przyciskiem do rozmowy lub formularza.",
      },
      {
        icon: "palette",
        title: "Strona firmowa",
        text: "Rozbudowana prezentacja usług, realizacji, procesu współpracy, FAQ i najważniejszych informacji dla klienta.",
      },
      {
        icon: "sparkles",
        title: "Strona z lekkim CMS",
        text: "Lekki CMS, czyli panel administratora do zmiany tekstów, FAQ, danych kontaktowych, prostych wpisów i publikacji zmian bez ruszania kodu.",
      },
      {
        icon: "check",
        title: "Poprawki i rozwój strony",
        text: "Odświeżenie istniejącej strony, dodanie nowych sekcji, integracji, formularza albo lepszej ścieżki kontaktu.",
      },
    ],
  },
  audience: {
    eyebrow: "Dla kogo",
    title: "Dla kogo robię strony?",
    text: "Najlepiej sprawdzają się u osób, które chcą szybko i jasno pokazać ofertę, bez rozbudowanego zaplecza i technicznego chaosu.",
    items: [
      {
        icon: "globe",
        title: "Małe firmy i lokalne usługi",
        text: "Strona, która tłumaczy, co robisz, dla kogo i jak można się z Tobą skontaktować.",
      },
      {
        icon: "badge",
        title: "Specjaliści i gabinety",
        text: "Oferta podana prostym językiem, przejrzyste sekcje i kontakt bez szukania po całej stronie.",
      },
      {
        icon: "palette",
        title: "Portfolio i marka osobista",
        text: "Miejsce na projekty, doświadczenie, wizytówkę online i materiały, które budują wiarygodność.",
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
    eyebrow: "W ramach strony",
    title: "Co możesz dostać w ramach strony?",
    text: "Nie chodzi tylko o ładny ekran. Strona ma prowadzić odwiedzającego od pierwszego wrażenia do kontaktu i działać spokojnie po publikacji.",
    items: [
      "układ strony dopasowany do celu i branży",
      "responsywny wygląd na telefonie, tablecie i komputerze",
      "sekcje oferty, realizacji, procesu, FAQ i kontaktu",
      "formularz kontaktowy lub szybkie przekierowanie do wiadomości",
      "SEO, czyli tytuły, opisy, mapa strony i podgląd linku w social mediach",
      "pomoc z publikacją, domeną i podstawową konfiguracją hostingu",
      "opcjonalny panel administratora do edycji treści",
      "podstawowe statystyki i kliknięcia w ważne elementy strony",
    ],
  },
  process: {
    eyebrow: "Proces",
    title: "Jak wygląda współpraca?",
    text: "Pracujemy etapami, żeby od początku było jasne, co powstaje, za co płacisz i kiedy strona może trafić do publikacji.",
    items: [
      {
        step: "01",
        title: "Krótki opis potrzeb",
        text: "Opowiadasz, czym się zajmujesz, dla kogo ma być strona i co ma zrobić odwiedzający po wejściu.",
      },
      {
        step: "02",
        title: "Zakres i wycena",
        text: "Ustalamy typ strony, liczbę sekcji, materiały, termin oraz orientacyjny koszt przed rozpoczęciem pracy.",
      },
      {
        step: "03",
        title: "Struktura i treści",
        text: "Układam logiczną kolejność informacji: oferta, przewagi, proces, odpowiedzi na pytania i kontakt.",
      },
      {
        step: "04",
        title: "Projekt i wdrożenie",
        text: "Tworzę stronę, dopasowuję wersję mobilną i dbam o czytelny wygląd bez przeładowania.",
      },
      {
        step: "05",
        title: "Sprawdzenie i poprawki",
        text: "Testuję podstawowe ścieżki, formularz, linki, wersję mobilną i wprowadzam ustalone poprawki.",
      },
      {
        step: "06",
        title: "Publikacja",
        text: "Pomagam uruchomić stronę, podpiąć domenę, formularz i najważniejsze ustawienia potrzebne na start oraz pod Google.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Realizacje i demo",
    title: "Zobacz przykłady stron, paneli i materiałów",
    text: "Poniżej są wdrożone realizacje, projekty graficzne i spokojny hub ze stronami demo. Dodatkowe kompetencje QA i GameDev przeniosłem do osobnego portfolio.",
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
        text: "Przykład zaplecza, w którym właściciel strony może samodzielnie zmieniać teksty, FAQ, ofertę, dane kontaktowe oraz tytuły i opisy dla Google.",
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
        type: "Hub demo",
        title: "Strony demo",
        text: "Przykładowe strony usługowe przygotowane jako realistyczne demo do portfolio.",
        details:
          "Jedno spokojne miejsce na kolejne warianty stron demo, bez dokładania wielu podobnych kart do portfolio.",
        status: "projekt demo",
        category: "Demo stron usługowych",
        tags: ["strony demo", "usługi lokalne", "portfolio", "responsive"],
        mockupTone: "cyan",
        demoItems: [
          {
            name: "Demo: serwis domowy",
            description:
              "Strona usługowa dla fikcyjnej lokalnej marki, pokazująca pierwszą sekcję, ofertę, proces, FAQ, kontakt i podstawy widoczności w Google.",
            tags: ["strona usługowa", "local business", "SEO", "responsive"],
            href: "https://dominiksd.github.io/demo-serwis-domowy/",
            linkLabel: "Zobacz demo",
            status: "dostępne",
            screenshotUrl: "portfolio/demo-serwis-domowy.svg",
            mockupTone: "emerald",
          },
          {
            name: "Panel CMS demo",
            description:
              "Interaktywne demo panelu CMS: edycja treści, podgląd zmian i publikacja w fikcyjnym zapleczu strony.",
            tags: ["CMS", "panel administratora", "edycja treści", "demo"],
            href: "https://dominiksd.github.io/demo-cms-panel-admin/",
            linkLabel: "Zobacz panel CMS",
            status: "dostępne",
            screenshotUrl: "portfolio/cms-demo-portfolio-preview.svg",
            mockupTone: "emerald",
          },
          {
            name: "Blog CMS demo",
            description:
              "Lekkie publiczne demo CMS-a do prowadzenia bloga: posty, statusy szkic/opublikowany, media, SEO i podgląd publiczny.",
            tags: ["CMS", "blog", "media", "SEO"],
            href: "https://dominiksd.github.io/demo-cms-blog/",
            linkLabel: "Zobacz demo bloga",
            status: "dostępne",
            screenshotUrl: "portfolio/demo-cms-blog-preview.svg",
            mockupTone: "cyan",
          },
          {
            name: "Landing kursu demo",
            description:
              "Fikcyjny landing kursu online z ofertą, programem, FAQ i CTA, przygotowany jako demo strony sprzedażowej.",
            tags: ["landing page", "kurs online", "CTA", "kampania"],
            href: "https://dominiksd.github.io/demo-landing-kurs/",
            linkLabel: "Zobacz landing",
            status: "dostępne",
            screenshotUrl: "portfolio/demo-landing-kurs-preview.svg",
            mockupTone: "violet",
          },
          {
            name: "Wariant branżowy",
            description:
              "Miejsce na kolejne demo dopasowane do konkretnej branży: gabinetu, serwisu, specjalisty albo małej firmy.",
            tags: ["branża", "usługi", "responsive"],
            href: "#",
            linkLabel: "Wkrótce",
            status: "planowane",
          },
        ],
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
          "Projektuję strony, które jasno pokazują ofertę i ułatwiają kontakt. Jeśli chcesz później samodzielnie zmieniać treści, CMS działa tu jako prosty panel administratora, a nie ciężki system do wszystkiego.",
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
            "podstawowe statystyki wejść i kliknięć",
            "integracje z kalendarzem, formularzem lub systemem rezerwacji",
          ],
        },
        cmsPanel: {
          title: "Panel CMS",
          description:
            "CMS oznacza tutaj panel administratora: proste miejsce do zmiany wybranych treści, dodania aktualności, sprawdzenia statystyk i opublikowania zmian bez dotykania kodu.",
          items: [
            "edycja oferty i tekstów na stronie",
            "FAQ, kontakt i najważniejsze dane",
            "SEO: tytuły i opisy dla Google",
            "wersja robocza przed publikacją",
            "statystyki wejść, podstron i kliknięć",
            "dostęp dla osoby pomagającej przy stronie",
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
    portfolio: {
      slug: "portfolio",
      seo: {
        title: "Portfolio | Dominik Sadzik - QA, GameDev i grafika",
        description:
          "Dodatkowe kompetencje Dominika Sadzika: QA, automatyzacja, GameDev, prototypy interaktywne i projekty graficzne.",
        canonical: "https://dominik-sadzik.pl/#/portfolio",
        noindex: false,
        ogTitle: "Portfolio | Dominik Sadzik",
        ogDescription:
          "Zobacz dodatkowe kompetencje: QA, automatyzację, projekty graficzne i prototypy interaktywne.",
        ogImage: "https://dominik-sadzik.pl/link-preview.png",
      },
      hero: {
        eyebrow: "Portfolio",
        title: "Portfolio i dodatkowe kompetencje",
        subtitle: "QA, GameDev i materiały graficzne jako uzupełnienie oferty stron",
        description:
          "Tutaj zostawiam kompetencje poboczne, które wspierają główną ofertę stron internetowych: testowanie, automatyzację, projekty graficzne i małe prototypy interaktywne.",
        ctaLabel: "Wróć do oferty strony",
        ctaHref: "#offer",
      },
      sections: {
        qaSkills: {
          title: "QA i automatyzacja",
          description:
            "Testowanie traktuję jako przewagę przy budowie stron: szybciej wyłapuję błędy, sprawdzam formularze i patrzę na stronę oczami użytkownika.",
          items: [
            "certyfikat ISTQB",
            "testy formularzy i linków",
            "kontrola wersji mobilnej",
            "raportowanie błędów prostym językiem",
          ],
        },
        gamedevProjects: {
          title: "GameDev i projekty interaktywne",
          description:
            "Małe prototypy pokazują pracę z ruchem, logiką, stanem i reakcją na działanie użytkownika. To dodatkowa kompetencja, nie główna oferta strony.",
          items: [
            "prototypy 2.5D",
            "sterowanie postacią",
            "kolizje i punkty",
            "interaktywne otoczenie",
            "poziomy z platformami",
            "test przeszkód",
          ],
          mediaItems: [
            {
              title: "Prototyp z punktami",
              description: "Krótki test zbierania obiektów, HUD-u i reakcji świata gry.",
              src: "portfolio/gamedev-stones-screen.webp",
              demoSrc: "portfolio/gamedev-stones-demo.gif",
              alt: "Screen prototypu 3D ze zbieraniem obiektów i licznikiem punktów.",
              tags: ["GameDev", "3D", "HUD"],
            },
            {
              title: "Interakcja z otoczeniem",
              description: "Przykład obiektu i sceny, które reagują na działania gracza.",
              src: "portfolio/gamedev-arena-screen.webp",
              demoSrc: "portfolio/gamedev-destruction-demo.gif",
              alt: "Screen interakcji z obiektami w środowisku 3D.",
              tags: ["interakcje", "fizyka", "prototyp"],
            },
            {
              title: "Model i animacja postaci",
              description:
                "Eksperyment z prostą postacią, ruchem i prezentacją obiektu w luźniejszej formie.",
              src: "portfolio/gamedev-pizza-character-screen.webp",
              demoSrc: "portfolio/gamedev-pizza-character.gif",
              alt: "Screen modelu postaci w kształcie kawałka pizzy.",
              tags: ["model", "animacja", "prototyp"],
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
        graphicWork: {
          title: "Projekty graficzne i materiały",
          description:
            "Oprócz strony mogę przygotować proste materiały wspierające komunikację: wizytówki, okładki, karty promocyjne albo grafiki pasujące do identyfikacji.",
          items: ["wizytówki", "branding", "karty reklamowe", "okładki i materiały informacyjne"],
        },
        finalCta: {
          title: "Chcesz stronę sprzedażową, a portfolio tylko jako kontekst?",
          description:
            "Najlepiej zacząć od celu biznesowego strony, a dopiero potem dobrać elementy wizualne, CMS, testy i dodatkowe materiały.",
          ctaLabel: "Opisz swoją stronę",
          ctaHref: "#/opisz-strone",
        },
      },
    },
  },
  packages: {
    eyebrow: "Cennik",
    title: "Pakiety i orientacyjne ceny",
    text: "Dokładną wycenę podaję po poznaniu zakresu, materiałów i terminu. Poniższe widełki pomagają ocenić, od czego warto zacząć.",
    note: "Finalna cena zależy od liczby sekcji, treści, grafik, integracji, panelu administratora i zakresu pomocy przy publikacji.",
    items: [
      {
        name: "Wizytówka online",
        price: "od 1500-2000 zł",
        desc: "Najprostszy start: estetyczna strona, która pokazuje kim jesteś, co oferujesz i jak można się z Tobą skontaktować.",
        forWhom:
          "Dla specjalisty, małej usługi albo marki osobistej, która potrzebuje jasnej wizytówki w internecie.",
        points: [
          "jedna przewijana strona",
          "oferta i kontakt",
          "wersja mobilna",
          "pomoc z publikacją",
        ],
        ctaLabel: "Zapytaj o wizytówkę",
        ctaHref: "#contact",
      },
      {
        name: "Strona firmowa",
        price: "od 2500-3500 zł",
        desc: "Dla firm i usług, które potrzebują pełniejszej prezentacji: oferty, realizacji, procesu współpracy, FAQ i szybkiej ścieżki kontaktu.",
        forWhom:
          "Dla firmy, która chce wyglądać wiarygodnie i odpowiedzieć na najważniejsze pytania klienta przed pierwszą rozmową.",
        points: [
          "kilka sekcji lub podstron",
          "realizacje albo przykłady pracy",
          "formularz kontaktowy",
          "przycisk rezerwacji terminu lub integracja z kalendarzem",
          "SEO, czyli podstawy widoczności w Google",
        ],
        highlighted: true,
        ctaLabel: "Zapytaj o stronę firmową",
        ctaHref: "#contact",
      },
      {
        name: "Strona z lekkim CMS",
        price: "od 3500-5000 zł+",
        desc: "Dla osób, które chcą po publikacji samodzielnie zmieniać treści: ofertę, FAQ, aktualności, proste wpisy i dane kontaktowe.",
        forWhom:
          "CMS to tutaj panel administratora: proste miejsce do edycji treści, publikacji zmian i podglądu statystyk bez ruszania kodu.",
        points: [
          "strona firmowa z miejscem na rozwój",
          "panel administratora do treści",
          "aktualności, wpisy lub prosty blog",
          "wersja robocza przed publikacją",
          "statystyki wejść i popularnych podstron",
          "kliknięcia w ważne przyciski",
          "wdrożenie i krótka instrukcja",
        ],
        ctaLabel: "Zapytaj o CMS",
        ctaHref: "#contact",
      },
    ],
  },
  whyMe: {
    eyebrow: "Dlaczego warto",
    title: "Łączę projekt strony z myśleniem o jakości",
    text: "Główna oferta to strony i CMS, ale doświadczenie w QA, automatyzacji i projektach interaktywnych pomaga mi budować strony, które są czytelne i mniej przypadkowe.",
    items: [
      {
        icon: "check",
        title: "Praktyczne podejście",
        text: "Skupiam się na tym, co ma pomóc klientowi zrozumieć ofertę i wykonać następny krok.",
      },
      {
        icon: "shield-check",
        title: "Kontrola jakości",
        text: "Sprawdzam formularze, linki, wersję mobilną i miejsca, które łatwo przeoczyć przed publikacją.",
      },
      {
        icon: "sparkles",
        title: "Możliwość rozbudowy",
        text: "Stronę można zacząć prosto, a później dodać CMS, nowe sekcje, integracje lub statystyki.",
      },
      {
        icon: "globe",
        title: "Jasna komunikacja",
        text: "Tłumaczę zakres normalnym językiem i unikam technicznego żargonu tam, gdzie nie jest potrzebny.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Najczęstsze pytania przed startem",
    text: "Krótko i konkretnie: co musisz mieć, ile to trwa i co dzieje się po publikacji strony.",
    items: [
      {
        question: "Czy muszę mieć gotowe teksty na stronę?",
        answer:
          "Nie musisz mieć wszystkiego gotowego. Możesz opisać mi swoją ofertę zwykłymi słowami, a ja pomogę ułożyć to w czytelną strukturę.",
      },
      {
        question: "Ile trwa przygotowanie strony?",
        answer:
          "Prosta wizytówka może powstać szybciej, a większa strona wymaga więcej materiałów i decyzji. Po krótkim opisie potrzeb podam realny termin dla konkretnego zakresu.",
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
        question: "Czy mogę mieć panel administratora?",
        answer:
          "Tak, jeśli ma to sens dla Twojej strony. Lekki CMS to panel administratora, w którym można zmieniać wybrane teksty, FAQ, dane kontaktowe, tytuły i opisy dla Google oraz publikować zmiany bez dotykania kodu.",
      },
      {
        question: "Czy CMS oznacza blog albo aktualności?",
        answer:
          "Może, jeśli tego potrzebujesz. W lekkim CMS-ie można przygotować proste aktualności, wpisy lub sekcję z poradami, ale bez budowania dużego portalu i bez komplikowania obsługi strony.",
      },
      {
        question: "Czy mogę później rozbudować stronę?",
        answer:
          "Tak. Stronę można rozwijać etapami: dodać nowe sekcje, podstrony, formularze, portfolio albo integracje z narzędziami, np. przyciskiem do rezerwacji terminu w kalendarzu.",
      },
      {
        question: "Co jeśli mam już stronę, ale wygląda słabo?",
        answer:
          "Możemy zacząć od przeglądu obecnej strony i zdecydować, czy lepiej ją poprawić, odświeżyć wizualnie, czy przygotować nową wersję od podstaw.",
      },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Opisz, jakiej strony potrzebujesz",
    text: "Napisz kilka zdań o firmie, ofercie i celu strony. Odezwę się z propozycją zakresu albo dodatkowymi pytaniami.",
    email: "kontakt@dominiksadzik.pl",
    phone: "",
    www: "dominik-sadzik.pl",
    address: "Polska",
    emailButtonLabel: "Napisz wiadomość",
    phoneButtonLabel: "Zadzwoń",
  },
};
