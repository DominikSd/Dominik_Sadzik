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
    text:
      "Bez technicznego zargonu. Najpierw ustalamy, czego potrzebujesz, a potem dobieramy rozwiazanie do celu i budzetu.",
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
  benefits: {
    eyebrow: "Co otrzymujesz",
    title: "Strone, ktora pomaga klientowi szybko podjac decyzje",
    text:
      "Najwazniejsze jest to, zeby odwiedzajacy od razu wiedzial, czym sie zajmujesz, co oferujesz i jak moze sie z Toba skontaktowac.",
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
        text:
          "Mowisz, czego potrzebujesz. Ustalamy cel strony, grupe klientow i najwazniejsze informacje.",
      },
      {
        step: "02",
        title: "Plan strony",
        text:
          "Przygotowuje prosta strukture: co ma byc na stronie, w jakiej kolejnosci i jak to pokazac.",
      },
      {
        step: "03",
        title: "Projekt i wykonanie",
        text:
          "Tworze nowoczesny wyglad, dopasowuje wersje mobilna i dbam o czytelnosc tresci.",
      },
      {
        step: "04",
        title: "Publikacja",
        text:
          "Pomagam uruchomic strone, podpiac domene, formularz i najwazniejsze ustawienia.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Realizacje",
    title: "Portfolio jest rozwijane",
    text:
      "Aktualnie przyjmuje pierwsze realizacje w atrakcyjnych warunkach. Ponizej zostawiam przykladowe typy projektow, ktore moge przygotowac.",
    items: [
      { title: "Strona firmowa", text: "Miejsce na opis realizacji, cel strony i zakres wykonanych prac." },
      { title: "Wizytowka online", text: "Miejsce na opis realizacji, cel strony i zakres wykonanych prac." },
      { title: "Projekt wizytowki", text: "Miejsce na opis realizacji, cel strony i zakres wykonanych prac." },
    ],
  },
  packages: {
    eyebrow: "Pakiety",
    title: "Mozesz zaczac od malego projektu",
    text:
      "Kazdy projekt wyceniam indywidualnie po krotkiej rozmowie, ale pakiety pomagaja szybko wybrac dobry kierunek.",
    items: [
      {
        name: "Wizytowka online",
        desc: "Dla osob, ktore chca szybko i estetycznie pokazac sie w internecie.",
        points: ["strona one-page", "oferta i kontakt", "wersja mobilna", "pomoc z publikacja"],
      },
      {
        name: "Strona firmowa",
        desc: "Dla malych firm, specjalistow i uslug lokalnych.",
        points: ["kilka sekcji", "portfolio lub realizacje", "formularz kontaktowy", "podstawy SEO"],
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
        answer: "Tak. Projekt od poczatku zaklada wersje mobilna, bo wielu klientow wchodzi na strone wlasnie z telefonu.",
      },
      {
        question: "Czy pomagasz z domena i hostingiem?",
        answer: "Tak. Moge pomoc wybrac domene, hosting i przejsc przez podstawowe ustawienia potrzebne do publikacji strony.",
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
