import { describe, it, expect } from "vitest";
import { homeHero, headerLinks } from "./homePresentation.js";
import { defaultSiteContent } from "./defaultSiteContent.js";

describe("homepage presentation compatibility", () => {
  it("upgrades original template copy without overriding custom CMS content", () => {
    const custom = { ...defaultSiteContent.hero, title: "Treść z CMS", description: "Własny opis" };
    expect(homeHero(custom)).toBe(custom);
    const legacy = {
      ...custom,
      title: "Nowoczesne strony internetowe i wizytówki dla",
      highlightedTitle: "Twojej firmy",
    };
    expect(homeHero(legacy).title).toBe(defaultSiteContent.hero.title);
    expect(homeHero(legacy).description).toBe("Własny opis");
    expect(homeHero(legacy).primaryCta).toBe(custom.primaryCta);
  });
  it("upgrades the previous punctuated headline without changing custom copy", () => {
    const previous = {
      ...defaultSiteContent.hero,
      title: "Twoja strona. Mój kod.",
      highlightedTitle: "Wspólny efekt.",
    };
    expect(homeHero(previous).title).toBe("Twoja strona Mój kod");
    expect(homeHero(previous).highlightedTitle).toBe("Wspólny efekt");
  });
  it("preserves custom CMS navigation and upgrades the exact old template menu", () => {
    const navItems = [{ label: "Moja oferta", href: "#/strony-cms" }];
    expect(headerLinks({ navItems })).toBe(navItems);
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
    const legacy = [
      "#start",
      "#offer",
      "#pricing",
      "#projects",
      "#process",
      "#faq",
      "#contact",
      "#/portfolio",
    ].map((href, index) => ({ label: labels[index], href }));
    expect(headerLinks({ navItems: legacy })).toEqual(defaultSiteContent.settings.navItems);
  });
});
