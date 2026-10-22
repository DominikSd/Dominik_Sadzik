import { defaultSiteContent } from "./defaultSiteContent.js";

// Upgrade only the original template copy. Custom CMS content remains authoritative.
export function homeHero(hero) {
  const legacy =
    hero.title === "Nowoczesne strony internetowe i wizytówki dla" &&
    hero.highlightedTitle === "Twojej firmy";
  const previous =
    hero.title === "Twoja strona. Mój kod." && hero.highlightedTitle === "Wspólny efekt.";
  return legacy || previous
    ? {
        ...hero,
        title: defaultSiteContent.hero.title,
        highlightedTitle: defaultSiteContent.hero.highlightedTitle,
        description:
          hero.description ===
          "Projektuję estetyczne, responsywne strony i wizytówki online z prostym panelem edycji treści. Dbam o czytelny układ, wygodę korzystania i sprawne działanie strony po publikacji."
            ? defaultSiteContent.hero.description
            : hero.description,
      }
    : hero;
}

export function headerLinks(settings) {
  const legacy = [
    "#start",
    "#offer",
    "#pricing",
    "#projects",
    "#process",
    "#faq",
    "#contact",
    "#/portfolio",
  ];
  const labels = [
    "Start",
    "Oferta",
    "Cennik",
    "Realizacje",
    "Proces",
    "FAQ",
    "Kontakt",
    "Portfolio",
  ];
  return settings.navItems.length === legacy.length &&
    settings.navItems.every(
      (item, index) => item.href === legacy[index] && item.label === labels[index],
    )
    ? defaultSiteContent.settings.navItems
    : settings.navItems;
}

// Brand-specific phrases live alongside content, not in the reusable map UI.
export function heroTitleParts(title) {
  return title === "Twoja strona Mój kod" ? ["Twoja strona", "Mój kod"] : [title];
}
