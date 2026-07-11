import { describe, expect, it } from "vitest";
import { defaultSiteContent } from "./defaultSiteContent";
import {
  getCollectionForKey,
  normalizeSiteContent,
  validateSectionData,
} from "./siteContentSchema";

describe("site content schema", () => {
  it("accepts the bundled fallback content", () => {
    expect(() => normalizeSiteContent(defaultSiteContent)).not.toThrow();
  });

  it("maps editable keys to the expected CMS collections", () => {
    expect(getCollectionForKey("hero")).toBe("page_sections");
    expect(getCollectionForKey("services")).toBe("page_sections");
    expect(getCollectionForKey("automationQa")).toBe("page_sections");
    expect(getCollectionForKey("gamedevTeaser")).toBe("page_sections");
    expect(getCollectionForKey("pages")).toBe("page_sections");
    expect(getCollectionForKey("portfolio")).toBe("page_sections");
    expect(getCollectionForKey("faq")).toBe("page_sections");
    expect(getCollectionForKey("contact")).toBe("page_sections");
    expect(getCollectionForKey("seo")).toBe("seo");
    expect(getCollectionForKey("settings")).toBe("settings");
  });

  it("validates hero form data before saving a draft", () => {
    const hero = {
      ...defaultSiteContent.hero,
      title: "",
    };

    expect(() => validateSectionData("hero", hero)).toThrow();
  });

  it("validates FAQ items as normal fields, not raw JSON blobs", () => {
    const faq = {
      ...defaultSiteContent.faq,
      items: [{ question: "Czy mogę edytować stronę?", answer: "" }],
    };

    expect(() => validateSectionData("faq", faq)).toThrow();
  });

  it("validates editable predefined detail pages", () => {
    const pages = {
      ...defaultSiteContent.pages,
      qaAutomation: {
        ...defaultSiteContent.pages.qaAutomation,
        seo: {
          ...defaultSiteContent.pages.qaAutomation.seo,
          title: "",
        },
      },
    };

    expect(() => validateSectionData("pages", pages)).toThrow();
  });

  it("fills new SEO fields when normalizing older CMS content", () => {
    const content = normalizeSiteContent({
      ...defaultSiteContent,
      seo: {
        metaTitle: "Stary tytuł SEO",
        metaDescription: "Stary opis meta używany przed rozbudową SEO w panelu.",
      },
    });

    expect(content.seo.canonical).toBe(defaultSiteContent.seo.canonical);
    expect(content.seo.pages.start.title).toBe(defaultSiteContent.seo.pages.start.title);
  });

  it("keeps newly bundled portfolio items when normalizing older published CMS content", () => {
    const olderPortfolio = {
      ...defaultSiteContent.portfolio,
      items: defaultSiteContent.portfolio.items.filter((item) => item.title !== "Strony demo"),
    };

    const content = normalizeSiteContent({
      ...defaultSiteContent,
      portfolio: olderPortfolio,
    });

    expect(content.portfolio.items.some((item) => item.title === "Strony demo")).toBe(true);
  });

  it("updates bundled demo links when normalizing older published CMS content", () => {
    const olderPortfolio = {
      ...defaultSiteContent.portfolio,
      items: defaultSiteContent.portfolio.items.map((item) =>
        item.title === "Strony demo"
          ? {
              ...item,
              demoItems: item.demoItems.map((demoItem) =>
                demoItem.name === "Demo CMS"
                  ? { ...demoItem, href: "#", linkLabel: "Wkrótce", status: "wkrótce" }
                  : demoItem,
              ),
            }
          : item,
      ),
    };

    const content = normalizeSiteContent({
      ...defaultSiteContent,
      portfolio: olderPortfolio,
    });
    const demoHub = content.portfolio.items.find((item) => item.title === "Strony demo");
    const cmsDemo = demoHub.demoItems.find((demoItem) => demoItem.name === "Demo CMS");

    expect(cmsDemo.href).toBe("https://github.com/DominikSd/cms-demo-portfolio");
    expect(cmsDemo.linkLabel).toBe("Zobacz repo demo");
    expect(cmsDemo.status).toBe("dostępne");
  });

  it("removes retired portfolio cards from older published CMS content", () => {
    const content = normalizeSiteContent({
      ...defaultSiteContent,
      portfolio: {
        ...defaultSiteContent.portfolio,
        items: [
          ...defaultSiteContent.portfolio.items,
          {
            type: "Automatyzacja",
            title: "Kontrola strony po publikacji",
            text: "Stara karta portfolio.",
            status: "projekt demo",
          },
          {
            type: "Testowanie / QA",
            title: "Raport testów funkcjonalnych",
            text: "Stara karta portfolio.",
            status: "koncepcja",
          },
          {
            type: "GameDev",
            title: "Interaktywny prototyp 2.5D",
            text: "Stara karta portfolio.",
            status: "prototyp",
          },
        ],
      },
    });

    expect(
      content.portfolio.items.some((item) => item.title === "Kontrola strony po publikacji"),
    ).toBe(false);
    expect(
      content.portfolio.items.some((item) => item.title === "Raport testów funkcjonalnych"),
    ).toBe(false);
    expect(
      content.portfolio.items.some((item) => item.title === "Interaktywny prototyp 2.5D"),
    ).toBe(false);
  });

  it("validates SEO slugs before saving a draft", () => {
    const seo = {
      ...defaultSiteContent.seo,
      pages: {
        ...defaultSiteContent.seo.pages,
        projects: {
          ...defaultSiteContent.seo.pages.projects,
          slug: "projekty test",
        },
      },
    };

    expect(() => validateSectionData("seo", seo)).toThrow();
  });
});
