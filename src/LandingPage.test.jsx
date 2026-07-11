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
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
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

  it("renders sales-focused main navigation with portfolio as a separate route", () => {
    render(<LandingPage routeHash="#/" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });
    expect(
      within(mainNav)
        .getAllByRole("link")
        .map((link) => link.textContent.trim()),
    ).toEqual(["Start", "Oferta", "Cennik", "Realizacje", "Proces", "FAQ", "Kontakt", "Portfolio"]);

    expect(within(mainNav).getByRole("link", { name: "Start" }).getAttribute("href")).toBe(
      "#start",
    );
    expect(within(mainNav).getByRole("link", { name: "Oferta" }).getAttribute("href")).toBe(
      "#offer",
    );
    expect(within(mainNav).getByRole("link", { name: "Cennik" }).getAttribute("href")).toBe(
      "#pricing",
    );
    expect(within(mainNav).getByRole("link", { name: "Realizacje" }).getAttribute("href")).toBe(
      "#projects",
    );
    expect(within(mainNav).getByRole("link", { name: "Proces" }).getAttribute("href")).toBe(
      "#process",
    );
    expect(within(mainNav).getByRole("link", { name: "FAQ" }).getAttribute("href")).toBe("#faq");
    expect(within(mainNav).getByRole("link", { name: "Kontakt" }).getAttribute("href")).toBe(
      "#contact",
    );
    expect(within(mainNav).getByRole("link", { name: "Portfolio" }).getAttribute("href")).toBe(
      "#/portfolio",
    );
    expect(within(mainNav).queryByRole("link", { name: "ISTQB" })).toBeNull();
    expect(within(mainNav).queryByRole("link", { name: "QA" })).toBeNull();
    expect(within(mainNav).queryByRole("link", { name: "GameDev" })).toBeNull();
  });

  it("tracks clicks in the main navigation", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });
    await user.click(within(mainNav).getByRole("link", { name: "Oferta" }));

    expect(trackNavigationClick).toHaveBeenCalledWith("Oferta", "#offer", "desktop");
  });

  it("keeps the old ISTQB route alias readable outside the sales nav", () => {
    render(<LandingPage routeHash="#/tester-istqb" />);

    expect(screen.getByText("Aktualnie: QA")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "QA, testowanie i automatyzacja" })).toBeTruthy();
  });

  it("closes the mobile menu after selecting a route link", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    const menuButton = screen.getByRole("button", { name: "Otwórz menu" });
    await user.click(menuButton);

    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    const mobileMenu = screen.getByRole("navigation", { name: "Menu mobilne" });
    await user.click(within(mobileMenu).getByRole("link", { name: "Portfolio" }));

    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders the homepage scroll-spy sections with stable ids", () => {
    render(<LandingPage routeHash="#/" />);

    expect(document.getElementById("start")).toBeTruthy();
    expect(document.getElementById("offer")).toBeTruthy();
    expect(document.getElementById("projects")).toBeTruthy();
    expect(document.getElementById("pricing")).toBeTruthy();
    expect(document.getElementById("process")).toBeTruthy();
    expect(document.getElementById("faq")).toBeTruthy();
    expect(document.getElementById("contact")).toBeTruthy();
    expect(screen.queryByText(/Najpierw pokazuję główną ofertę webową/)).toBeNull();
  });

  it("renders the sales landing sections and package prices", () => {
    render(<LandingPage routeHash="#/" />);

    expect(screen.getByRole("heading", { name: "Dla kogo robię strony?" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Co mogę przygotować?" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Pakiety i orientacyjne ceny" })).toBeTruthy();
    expect(screen.getByText("od 1500-2000 zł")).toBeTruthy();
    expect(screen.getByText("od 2500-3500 zł")).toBeTruthy();
    expect(screen.getByText("od 3500-5000 zł+")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Opisz stronę/i })).toBeTruthy();
  });

  it("renders the floating section nav with the readable active section label", () => {
    render(<LandingPage routeHash="#/" />);

    const floatingNav = screen.getByRole("navigation", {
      name: "Pływająca nawigacja sekcji",
    });

    expect(screen.getByText(/Aktualnie:/)).toBeTruthy();
    expect(within(floatingNav).getByRole("link", { name: "Start" })).toBeTruthy();
    expect(within(floatingNav).getByRole("link", { name: "Oferta" }).getAttribute("href")).toBe(
      "#offer",
    );
    expect(within(floatingNav).getByRole("link", { name: "Cennik" }).getAttribute("href")).toBe(
      "#pricing",
    );
    expect(within(floatingNav).getByRole("link", { name: "Realizacje" }).getAttribute("href")).toBe(
      "#projects",
    );
    expect(within(floatingNav).getByRole("link", { name: "Proces" }).getAttribute("href")).toBe(
      "#process",
    );
    expect(within(floatingNav).getByRole("link", { name: "FAQ" }).getAttribute("href")).toBe(
      "#faq",
    );
    expect(within(floatingNav).getByRole("link", { name: "Kontakt" }).getAttribute("href")).toBe(
      "#contact",
    );
    expect(within(floatingNav).getByRole("link", { name: "Portfolio" }).getAttribute("href")).toBe(
      "#/portfolio",
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

    await user.click(within(floatingNav).getByRole("link", { name: "Realizacje" }));
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByText("Aktualnie: Realizacje")).toBeTruthy();
      expect(
        within(floatingNav).getByRole("link", { name: "Realizacje" }).getAttribute("aria-current"),
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

    await user.click(within(floatingNav).getByRole("link", { name: "Realizacje" }));
    fireEvent.scroll(window);
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByText("Aktualnie: Realizacje")).toBeTruthy();
      expect(
        within(floatingNav).getByRole("link", { name: "Realizacje" }).getAttribute("aria-current"),
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
      within(floatingNav).getByRole("link", { name: "Oferta" }).getAttribute("aria-current"),
    ).toBeNull();
  });

  it("renders the web CMS detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/strony-cms" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });

    expect(screen.getByRole("heading", { name: "Strony internetowe i lekki CMS" })).toBeTruthy();
    expect(screen.getByText("Aktualnie: Strony i CMS")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Co mogę przygotować" })).toBeNull();
    expect(screen.queryByText("Najedź, żeby zobaczyć podgląd")).toBeNull();
    expect(screen.getAllByText("Oferta").length).toBeGreaterThan(0);
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

  it("renders one interactive project hub with completed projects and demos", async () => {
    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    expect(
      screen.getByRole("heading", { name: "Realizacje, projekty i strony demo" }),
    ).toBeTruthy();
    expect(screen.getAllByText("Strony WWW").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Strony demo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CMS i funkcje").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Grafika i materiały").length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: /Strona Centrum Terapii Neuronest/i })).toBeTruthy();

    const activeDemoTab = screen.getByRole("tab", { name: /Demo: serwis domowy/i });
    await user.click(activeDemoTab);

    expect(activeDemoTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getAllByText("Demo: serwis domowy").length).toBeGreaterThan(1);
    expect(
      screen.getByText(/pierwszą sekcję, ofertę, proces, FAQ, kontakt i podstawy widoczności/i),
    ).toBeTruthy();

    const demoLink = screen.getByRole("link", { name: /Zobacz demo/i });
    expect(demoLink.getAttribute("href")).toBe("https://dominiksd.github.io/demo-serwis-domowy/");
    expect(demoLink.getAttribute("target")).toBe("_blank");

    const cmsDemoTab = screen.getByRole("tab", { name: /Demo CMS/i });
    await user.click(cmsDemoTab);

    expect(cmsDemoTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText(/Interaktywne demo lekkiego CMS-a/i)).toBeTruthy();

    const cmsDemoLink = screen.getByRole("link", { name: /Zobacz repo demo/i });
    expect(cmsDemoLink.getAttribute("href")).toBe(
      "https://github.com/DominikSd/cms-demo-portfolio",
    );
    expect(cmsDemoLink.getAttribute("target")).toBe("_blank");
  });

  it("expands the selected project directly below the tapped item on mobile", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });

    const user = userEvent.setup();
    render(<LandingPage routeHash="#/" />);

    const cmsDemoTab = screen.getByRole("tab", { name: /Demo CMS/i });
    await user.click(cmsDemoTab);

    expect(cmsDemoTab.getAttribute("aria-expanded")).toBe("true");

    const mobilePanel = screen.getByRole("tabpanel", { name: /Demo CMS/i });
    expect(within(mobilePanel).getByText(/Interaktywne demo lekkiego CMS-a/i)).toBeTruthy();
    expect(within(mobilePanel).getByRole("link", { name: /Zobacz repo demo/i })).toBeTruthy();

    await user.click(cmsDemoTab);

    expect(cmsDemoTab.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("tabpanel", { name: /Demo CMS/i })).toBeNull();
  });

  it("renders the portfolio route as a separate home for extra skills", () => {
    render(<LandingPage routeHash="#/portfolio" />);

    expect(screen.getByRole("heading", { name: "Portfolio i dodatkowe kompetencje" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Realizacje klientów" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Strony demo" })).toBeNull();
    expect(screen.getByRole("heading", { name: "QA i automatyzacja" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "GameDev i projekty interaktywne" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Projekty graficzne i materiały" })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /Zobacz animację/ })).toHaveLength(5);
    expect(screen.getByText("Aktualnie: Portfolio")).toBeTruthy();
  });

  it("renders the QA detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/qa-automatyzacja" />);

    expect(screen.getByRole("heading", { name: "QA, testowanie i automatyzacja" })).toBeTruthy();
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
