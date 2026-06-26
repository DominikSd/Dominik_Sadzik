import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultSiteContent } from "./content/defaultSiteContent";
import { trackNavigationClick } from "./lib/analytics/ga4";
import { DRAFT_PREVIEW_STORAGE_KEY } from "./lib/draftPreview";
import LandingPage from "./LandingPage";

vi.mock("./lib/contentApi", () => ({
  loadPublishedSiteContent: vi.fn(() => new Promise(() => {})),
}));

vi.mock("./lib/analytics/ga4", () => ({
  trackContactClick: vi.fn(),
  trackCtaClick: vi.fn(),
  trackNavigationClick: vi.fn(),
}));

describe("LandingPage navigation", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    window.localStorage.clear();
    window.scrollTo = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));
  });

  it("renders local draft preview content from ?preview=draft", () => {
    window.history.replaceState(null, "", "/?preview=draft#/");
    window.localStorage.setItem(
      DRAFT_PREVIEW_STORAGE_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        content: {
          ...defaultSiteContent,
          hero: {
            ...defaultSiteContent.hero,
            title: "Draft preview title",
          },
        },
      }),
    );

    render(<LandingPage routeHash="#/" />);

    expect(screen.getByText("Draft preview title")).toBeTruthy();
    expect(screen.getByText(/Podgląd draftu CMS/)).toBeTruthy();
    expect(document.querySelector('meta[name="robots"]').getAttribute("content")).toBe(
      "noindex,nofollow",
    );
  });

  it("renders consistent main navigation categories without a separate ISTQB link", () => {
    render(<LandingPage routeHash="#/" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });

    expect(within(mainNav).getByRole("link", { name: "Start" }).getAttribute("href")).toBe(
      "#start",
    );
    expect(within(mainNav).getByRole("link", { name: "Strony i CMS" }).getAttribute("href")).toBe(
      "#/strony-cms",
    );
    expect(within(mainNav).getByRole("link", { name: "QA" }).getAttribute("href")).toBe(
      "#/qa-automatyzacja",
    );
    expect(within(mainNav).getByRole("link", { name: "GameDev" }).getAttribute("href")).toBe(
      "#/gamedev",
    );
    expect(within(mainNav).getByRole("link", { name: "Projekty" }).getAttribute("href")).toBe(
      "#projects",
    );
    expect(within(mainNav).getByRole("link", { name: "Kontakt" }).getAttribute("href")).toBe(
      "#contact",
    );
    expect(within(mainNav).queryByRole("link", { name: "ISTQB" })).toBeNull();
  });

  it("tracks clicks in the main navigation", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });
    await user.click(within(mainNav).getByRole("link", { name: "Strony i CMS" }));

    expect(trackNavigationClick).toHaveBeenCalledWith("Strony i CMS", "#/strony-cms", "desktop");
  });

  it("marks QA active for the old ISTQB route alias", () => {
    render(<LandingPage routeHash="#/tester-istqb" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });

    expect(within(mainNav).getByRole("link", { name: "QA" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("closes the mobile menu after selecting a route link", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    const menuButton = screen.getByRole("button", { name: "Otwórz menu" });
    await user.click(menuButton);

    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    const mobileMenu = screen.getByRole("navigation", { name: "Menu mobilne" });
    await user.click(within(mobileMenu).getByRole("link", { name: "GameDev" }));

    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders the homepage scroll-spy sections with stable ids", () => {
    render(<LandingPage routeHash="#/" />);

    expect(document.getElementById("start")).toBeTruthy();
    expect(document.getElementById("projects")).toBeTruthy();
    expect(document.getElementById("faq")).toBeTruthy();
    expect(document.getElementById("contact")).toBeTruthy();
    expect(screen.queryByText(/Najpierw pokazuję główną ofertę webową/)).toBeNull();
  });

  it("uses full area cards as links to the detail pages", () => {
    render(<LandingPage routeHash="#/" />);

    const areasSection = document.getElementById("areas");

    expect(
      within(areasSection).getByRole("link", {
        name: "Zobacz ofertę CMS: Strony i CMS",
      }).href,
    ).toContain("#/strony-cms");
    expect(
      within(areasSection).getByRole("link", {
        name: "Zobacz QA: QA i automatyzacja",
      }).href,
    ).toContain("#/qa-automatyzacja");
    expect(
      within(areasSection).getByRole("link", {
        name: "Zobacz GameDev: GameDev",
      }).href,
    ).toContain("#/gamedev");
  });

  it("renders the floating section nav with the readable active section label", () => {
    render(<LandingPage routeHash="#/" />);

    const floatingNav = screen.getByRole("navigation", {
      name: "Pływająca nawigacja sekcji",
    });

    expect(screen.getByText(/Aktualnie:/)).toBeTruthy();
    expect(within(floatingNav).getByRole("link", { name: "Start" })).toBeTruthy();
    expect(
      within(floatingNav).getByRole("link", { name: "Strony i CMS" }).getAttribute("href"),
    ).toBe("#/strony-cms");
    expect(
      within(floatingNav).getByRole("link", { name: "QA i automatyzacja" }).getAttribute("href"),
    ).toBe("#/qa-automatyzacja");
    expect(within(floatingNav).getByRole("link", { name: "GameDev" }).getAttribute("href")).toBe(
      "#/gamedev",
    );
    expect(within(floatingNav).getByRole("link", { name: "Projekty" }).getAttribute("href")).toBe(
      "#projects",
    );
    expect(within(floatingNav).getByRole("link", { name: "FAQ" }).getAttribute("href")).toBe(
      "#faq",
    );
    expect(within(floatingNav).getByRole("link", { name: "Kontakt" }).getAttribute("href")).toBe(
      "#contact",
    );
  });

  it("keeps the clicked floating nav section active while smooth scrolling", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    const floatingNav = screen.getByRole("navigation", {
      name: "Pływająca nawigacja sekcji",
    });
    const projectsSection = document.getElementById("projects");

    Object.defineProperty(projectsSection, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        top: 900,
        bottom: 1100,
        height: 200,
        left: 0,
        right: 100,
        width: 100,
      }),
    });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 320 });

    await user.click(within(floatingNav).getByRole("link", { name: "Projekty" }));
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByText("Aktualnie: Projekty")).toBeTruthy();
      expect(
        within(floatingNav).getByRole("link", { name: "Projekty" }).getAttribute("aria-current"),
      ).toBe("page");
    });
  });

  it("keeps projects active when navigating back from the bottom contact area", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    const floatingNav = screen.getByRole("navigation", {
      name: "Pływająca nawigacja sekcji",
    });

    const sectionRects = {
      start: { top: -1200, bottom: -700 },
      projects: { top: 900, bottom: 1300 },
      faq: { top: 140, bottom: 420 },
      contact: { top: 90, bottom: 360 },
    };

    for (const [sectionId, rect] of Object.entries(sectionRects)) {
      Object.defineProperty(document.getElementById(sectionId), "getBoundingClientRect", {
        configurable: true,
        value: () => ({
          height: rect.bottom - rect.top,
          left: 0,
          right: 100,
          width: 100,
          ...rect,
        }),
      });
    }

    Object.defineProperty(window, "scrollY", { configurable: true, value: 1200 });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 1200 + window.innerHeight,
    });

    await user.click(within(floatingNav).getByRole("link", { name: "Projekty" }));
    fireEvent.scroll(window);
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByText("Aktualnie: Projekty")).toBeTruthy();
      expect(
        within(floatingNav).getByRole("link", { name: "Projekty" }).getAttribute("aria-current"),
      ).toBe("page");
    });
  });

  it("does not mark CMS active from a homepage web CMS section hash", () => {
    render(<LandingPage routeHash="#web-cms" />);

    const floatingNav = screen.getByRole("navigation", {
      name: "Pływająca nawigacja sekcji",
    });

    expect(screen.getByText("Aktualnie: Start")).toBeTruthy();
    expect(
      within(floatingNav).getByRole("link", { name: "Strony i CMS" }).getAttribute("aria-current"),
    ).toBeNull();
  });

  it("renders the web CMS detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/strony-cms" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });

    expect(screen.getByRole("heading", { name: "Strony internetowe i lekki CMS" })).toBeTruthy();
    expect(
      within(mainNav).getByRole("link", { name: "Strony i CMS" }).getAttribute("aria-current"),
    ).toBe("page");
    expect(
      within(
        screen.getByRole("navigation", {
          name: "Pływająca nawigacja sekcji",
        }),
      )
        .getByRole("link", { name: "Strony i CMS" })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(screen.getByText("Aktualnie: Strony i CMS")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Co mogę przygotować" })).toBeNull();
    expect(screen.queryByText("Najedź, żeby zobaczyć podgląd")).toBeNull();
    expect(screen.getByText("Oferta")).toBeTruthy();
    expect(screen.getByText("Statystyki")).toBeTruthy();
    expect(
      screen
        .getByRole("img", { name: "Podgląd edycji SEO podstrony w panelu CMS." })
        .getAttribute("src"),
    ).toBe("portfolio/cms-seo-preview.png");
    expect(
      screen
        .getByRole("img", { name: "Podgląd współpracy i dostępu do panelu CMS." })
        .getAttribute("src"),
    ).toBe("portfolio/cms-team-preview.png");
  });

  it("renders the website description route without a blank screen", () => {
    render(<LandingPage routeHash="#/opisz-strone" />);

    expect(
      screen.getByRole("heading", {
        name: "Opisz swoją stronę, a przygotuję wstępną propozycję",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /Wyślij opis strony/i })).toBeTruthy();
    expect(screen.getByText("Aktualnie: Opisz stronę")).toBeTruthy();
  });

  it("renders the privacy policy route and links it from the footer", () => {
    const { rerender } = render(<LandingPage routeHash="#/" />);

    expect(screen.getByRole("link", { name: "Prywatność" }).getAttribute("href")).toBe(
      "#/polityka-prywatnosci",
    );

    rerender(<LandingPage routeHash="#/polityka-prywatnosci" />);

    expect(screen.getByRole("heading", { name: "Polityka prywatności" })).toBeTruthy();
    expect(screen.getByText("Aktualnie: Polityka prywatności")).toBeTruthy();
  });

  it("links the contact section to the website description form", () => {
    render(<LandingPage routeHash="#/" />);

    expect(screen.getByRole("link", { name: /Opisz swoją stronę/i }).getAttribute("href")).toBe(
      "#/opisz-strone",
    );
    expect(screen.getByText(/przygotuję wstępną propozycję zakresu i wyceny/i)).toBeTruthy();
  });

  it("renders an accessible expandable demo websites hub in portfolio", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    expect(screen.getByRole("heading", { name: "Strony demo" })).toBeTruthy();

    const expandButton = screen.getByRole("button", { name: /Rozwiń przykłady/i });
    const panel = document.getElementById(expandButton.getAttribute("aria-controls"));

    expect(expandButton.getAttribute("aria-expanded")).toBe("false");
    expect(panel?.hidden).toBe(true);

    await user.click(expandButton);

    expect(expandButton.getAttribute("aria-expanded")).toBe("true");
    expect(panel?.hidden).toBe(false);
    expect(screen.getByText("Demo: serwis domowy")).toBeTruthy();
    expect(screen.getByText(/hero, ofertę, proces, FAQ, kontakt i podstawowe SEO/i)).toBeTruthy();
    const demoLink = screen.getByRole("link", { name: /Zobacz demo/i });
    expect(demoLink.getAttribute("href")).toBe("https://dominiksd.github.io/demo-serwis-domowy/");
    expect(demoLink.getAttribute("target")).toBe("_blank");
  });

  it("renders the QA detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/qa-automatyzacja" />);

    expect(screen.getByRole("heading", { name: "QA, testowanie i automatyzacja" })).toBeTruthy();
    expect(
      within(
        screen.getByRole("navigation", {
          name: "Pływająca nawigacja sekcji",
        }),
      )
        .getByRole("link", { name: "QA i automatyzacja" })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(screen.getByText("Aktualnie: QA")).toBeTruthy();
  });

  it("keeps the old ISTQB route as a QA alias", () => {
    render(<LandingPage routeHash="#/tester-istqb" />);

    expect(screen.getByRole("heading", { name: "QA, testowanie i automatyzacja" })).toBeTruthy();
    expect(screen.getByText("Aktualnie: QA")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Certyfikat ISTQB" })).toBeTruthy();
  });

  it("renders the GameDev detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/gamedev" />);

    expect(screen.getByRole("heading", { name: "GameDev i interaktywne prototypy" })).toBeTruthy();
    expect(
      within(
        screen.getByRole("navigation", {
          name: "Pływająca nawigacja sekcji",
        }),
      )
        .getByRole("link", { name: "GameDev" })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(screen.getByText("Aktualnie: GameDev")).toBeTruthy();
  });

  it("renders local GameDev screenshots with optional GIF previews and no YouTube embeds", () => {
    render(<LandingPage routeHash="#/gamedev" />);

    expect(
      screen
        .getByRole("img", {
          name: "Screen prototypu 3D ze zbieraniem obiektów i licznikiem punktów.",
        })
        .getAttribute("src"),
    ).toBe("portfolio/gamedev-stones-screen.webp");
    expect(
      screen
        .getByRole("img", {
          name: "Screen modelu postaci w kształcie kawałka pizzy.",
        })
        .getAttribute("src"),
    ).toBe("portfolio/gamedev-pizza-character-screen.webp");
    expect(
      screen
        .getByRole("img", {
          name: "Screen poziomu 3D z platformami i przeszkodami.",
        })
        .getAttribute("src"),
    ).toBe("portfolio/gamedev-conveyor-screen.webp");
    expect(
      screen
        .getByRole("img", {
          name: "Screen poziomu 3D z kolcami i platformami.",
        })
        .getAttribute("src"),
    ).toBe("portfolio/gamedev-spikes-screen.webp");
    const animationLinks = screen.getAllByRole("link", { name: /Zobacz animację/ });

    expect(animationLinks).toHaveLength(5);
    expect(animationLinks[0].getAttribute("href")).toBe("portfolio/gamedev-stones-demo.gif");
    expect(
      screen.queryByTitle(/youtube/i) || document.querySelector("iframe[src*='youtube']"),
    ).toBeNull();
  });
});
