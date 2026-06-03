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
      items: [{ question: "Czy moge edytowac strone?", answer: "" }],
    };

    expect(() => validateSectionData("faq", faq)).toThrow();
  });

  it("validates editable predefined detail pages", () => {
    const pages = {
      ...defaultSiteContent.pages,
      automationTesting: {
        ...defaultSiteContent.pages.automationTesting,
        seo: {
          ...defaultSiteContent.pages.automationTesting.seo,
          title: "",
        },
      },
    };

    expect(() => validateSectionData("pages", pages)).toThrow();
  });
});
