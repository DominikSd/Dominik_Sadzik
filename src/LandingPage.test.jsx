import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultSiteContent } from "./content/defaultSiteContent";
import { DRAFT_PREVIEW_STORAGE_KEY } from "./lib/draftPreview";
import LandingPage from "./LandingPage";

vi.mock("./lib/contentApi", () => ({
  loadPublishedSiteContent: vi.fn(() => new Promise(() => {})),
}));

vi.mock("./lib/analytics/ga4", () => ({
  trackContactClick: vi.fn(),
  trackCtaClick: vi.fn(),
}));

describe("LandingPage navigation", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/Dominik_Sadzik/");
    window.localStorage.clear();
    window.scrollTo = vi.fn();
    window.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));
  });

  it("renders local draft preview content from ?preview=draft", () => {
    window.history.replaceState(null, "", "/Dominik_Sadzik/?preview=draft#/");
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
    expect(screen.getByText("Certyfikat ISTQB")).toBeTruthy();
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
    const animationLinks = screen.getAllByRole("link", { name: /Zobacz animację/ });

    expect(animationLinks).toHaveLength(3);
    expect(animationLinks[0].getAttribute("href")).toBe("portfolio/gamedev-stones-demo.gif");
    expect(
      screen.queryByTitle(/youtube/i) || document.querySelector("iframe[src*='youtube']"),
    ).toBeNull();
  });
});
