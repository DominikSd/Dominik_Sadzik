import { describe, expect, it } from "vitest";
import { defaultSiteContent } from "../content/defaultSiteContent";
import { applyNoindexSeo, applySeo, getPublicRouteSeo } from "./seo";

describe("seo helpers", () => {
  it("returns route-aware SEO for a detail hash route", () => {
    const seo = getPublicRouteSeo({
      content: defaultSiteContent,
      routeHash: "#/strony-cms",
      activePage: defaultSiteContent.pages.webCms,
    });

    expect(seo.title).toBe("Strony internetowe i lekki CMS | Dominik Sadzik");
    expect(seo.canonical).toBe("https://dominik-sadzik.pl/");
    expect(seo.robots).toBe("index,follow");
  });

  it("returns route-aware SEO for homepage sections", () => {
    const seo = getPublicRouteSeo({
      content: defaultSiteContent,
      routeHash: "#projects",
    });

    expect(seo.title).toBe("Projekty i realizacje | Dominik Sadzik");
    expect(seo.canonical).toBe("https://dominik-sadzik.pl/");
  });

  it("returns route-aware SEO for the website description route", () => {
    const seo = getPublicRouteSeo({
      content: defaultSiteContent,
      routeHash: "#/opisz-strone",
    });

    expect(seo.title).toBe("Opisz stronę do wyceny | Dominik Sadzik");
    expect(seo.canonical).toBe("https://dominik-sadzik.pl/");
    expect(seo.robots).toBe("index,follow");
  });

  it("returns route-aware SEO for the privacy policy route", () => {
    const seo = getPublicRouteSeo({
      content: defaultSiteContent,
      routeHash: "#/polityka-prywatnosci",
    });

    expect(seo.title).toBe("Polityka prywatności | Dominik Sadzik");
    expect(seo.canonical).toBe("https://dominik-sadzik.pl/");
    expect(seo.robots).toBe("index,follow");
  });

  it("returns route-aware SEO for the portfolio route", () => {
    const seo = getPublicRouteSeo({
      content: defaultSiteContent,
      routeHash: "#/portfolio",
      activePage: defaultSiteContent.pages.portfolio,
    });

    expect(seo.title).toBe("Portfolio | Dominik Sadzik - QA, GameDev i grafika");
    expect(seo.canonical).toBe("https://dominik-sadzik.pl/");
    expect(seo.description).toContain("QA");
  });

  it("applies noindex metadata for private panel routes", () => {
    applyNoindexSeo("Panel CMS - Test");

    expect(document.title).toBe("Panel CMS - Test");
    expect(document.querySelector('meta[name="robots"]').getAttribute("content")).toBe(
      "noindex,nofollow",
    );
  });

  it("creates missing Open Graph and Twitter metadata", () => {
    applySeo(
      getPublicRouteSeo({
        content: defaultSiteContent,
        routeHash: "#/",
      }),
    );

    expect(document.querySelector('meta[property="og:title"]').getAttribute("content")).toBe(
      "Strona internetowa dla małej firmy",
    );
    expect(document.querySelector('meta[name="twitter:card"]').getAttribute("content")).toBe(
      "summary_large_image",
    );
    expect(document.querySelector('link[rel="canonical"]').getAttribute("href")).toBe(
      "https://dominik-sadzik.pl/",
    );
  });

  it("reuses route-aware metadata instead of leaving duplicates", () => {
    const duplicateDescription = document.createElement("meta");
    duplicateDescription.setAttribute("name", "description");
    duplicateDescription.setAttribute("content", "Old description");
    document.head.appendChild(duplicateDescription);

    const duplicateCanonical = document.createElement("link");
    duplicateCanonical.setAttribute("rel", "canonical");
    duplicateCanonical.setAttribute("href", "https://example.com/");
    document.head.appendChild(duplicateCanonical);

    applySeo(
      getPublicRouteSeo({
        content: defaultSiteContent,
        routeHash: "#/",
      }),
    );

    applySeo(
      getPublicRouteSeo({
        content: defaultSiteContent,
        routeHash: "#/strony-cms",
        activePage: defaultSiteContent.pages.webCms,
      }),
    );

    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]').getAttribute("href")).toBe(
      "https://dominik-sadzik.pl/",
    );
  });

  it("removes URL fragments from canonicals loaded from CMS", () => {
    const seo = getPublicRouteSeo({
      content: {
        ...defaultSiteContent,
        pages: {
          ...defaultSiteContent.pages,
          webCms: {
            ...defaultSiteContent.pages.webCms,
            seo: {
              ...defaultSiteContent.pages.webCms.seo,
              canonical: "https://dominik-sadzik.pl/#/strony-cms",
            },
          },
        },
      },
      routeHash: "#/strony-cms",
      activePage: {
        ...defaultSiteContent.pages.webCms,
        seo: {
          ...defaultSiteContent.pages.webCms.seo,
          canonical: "https://dominik-sadzik.pl/#/strony-cms",
        },
      },
    });

    expect(seo.canonical).toBe("https://dominik-sadzik.pl/");
    expect(seo.ogUrl).toBe("https://dominik-sadzik.pl/");
  });

  it("keeps a clean canonical URL configured for a future route", () => {
    const seo = getPublicRouteSeo({
      content: defaultSiteContent,
      routeHash: "#/strony-cms",
      activePage: {
        ...defaultSiteContent.pages.webCms,
        seo: {
          ...defaultSiteContent.pages.webCms.seo,
          canonical: "https://dominik-sadzik.pl/strony-cms/",
        },
      },
    });

    expect(seo.canonical).toBe("https://dominik-sadzik.pl/strony-cms/");
  });
});
