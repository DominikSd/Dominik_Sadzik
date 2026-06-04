import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    window.scrollTo = vi.fn();
    window.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));
  });

  it("renders concise links to the new portfolio pages", () => {
    render(<LandingPage routeHash="#/" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });

    expect(within(mainNav).getByRole("link", { name: "Start" })).toBeTruthy();
    expect(within(mainNav).getByRole("link", { name: "Strony i CMS" }).getAttribute("href")).toBe(
      "#web-cms",
    );
    expect(within(mainNav).getByRole("link", { name: "Projekty" }).getAttribute("href")).toBe(
      "#projects",
    );
    expect(
      within(mainNav).getByRole("link", { name: "QA i automatyzacja" }).getAttribute("href"),
    ).toBe("#/automatyzacja-testowanie");
    expect(within(mainNav).getByRole("link", { name: "ISTQB" }).getAttribute("href")).toBe(
      "#/tester-istqb",
    );
    expect(within(mainNav).getByRole("link", { name: "GameDev" }).getAttribute("href")).toBe(
      "#/gamedev",
    );
    expect(within(mainNav).getByRole("link", { name: "Kontakt" }).getAttribute("href")).toBe(
      "#contact",
    );
  });

  it("marks the active detail page link", () => {
    render(<LandingPage routeHash="#/tester-istqb" />);

    const mainNav = screen.getByRole("navigation", { name: "Główna nawigacja" });

    expect(within(mainNav).getByRole("link", { name: "ISTQB" }).getAttribute("aria-current")).toBe(
      "page",
    );
    expect(
      within(mainNav)
        .getByRole("link", { name: "QA i automatyzacja" })
        .getAttribute("aria-current"),
    ).toBeNull();
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

  it("renders the main portfolio area sections with stable ids", () => {
    render(<LandingPage routeHash="#/" />);

    expect(document.getElementById("web-cms")).toBeTruthy();
    expect(document.getElementById("projects")).toBeTruthy();
    expect(document.getElementById("qa-automation")).toBeTruthy();
    expect(document.getElementById("gamedev-area")).toBeTruthy();
    expect(document.getElementById("contact")).toBeTruthy();
  });

  it("renders the floating section nav with the readable active section label", () => {
    render(<LandingPage routeHash="#/" />);

    const floatingNav = screen.getByRole("navigation", {
      name: "Pływająca nawigacja sekcji",
    });

    expect(screen.getByText("Aktualnie: Start")).toBeTruthy();
    expect(within(floatingNav).getByRole("link", { name: "Strony i CMS" })).toBeTruthy();
    expect(within(floatingNav).getByRole("link", { name: "Kontakt" }).getAttribute("href")).toBe(
      "#contact",
    );
  });

  it("renders the automation detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/automatyzacja-testowanie" />);

    expect(screen.getByRole("heading", { name: "Automatyzacja i testowanie stron" })).toBeTruthy();
  });

  it("renders the ISTQB detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/tester-istqb" />);

    expect(
      screen.getByRole("heading", { name: "Certyfikowane podejście do testowania" }),
    ).toBeTruthy();
    expect(screen.getByText("Aktualnie: ISTQB")).toBeTruthy();
  });

  it("renders the GameDev detail route without a blank screen", () => {
    render(<LandingPage routeHash="#/gamedev" />);

    expect(screen.getByRole("heading", { name: "GameDev i interaktywne prototypy" })).toBeTruthy();
  });
});
