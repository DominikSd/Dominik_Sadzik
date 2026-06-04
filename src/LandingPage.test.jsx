import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LandingPage from "./LandingPage";
import { defaultSiteContent } from "./content/defaultSiteContent";

vi.mock("./lib/contentApi", () => ({
  loadPublishedSiteContent: vi.fn(() =>
    Promise.resolve({ content: defaultSiteContent, usedFallback: false }),
  ),
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

    expect(screen.getByRole("link", { name: "Start" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Strony i CMS" }).getAttribute("href")).toBe(
      "#web-cms",
    );
    expect(screen.getByRole("link", { name: "Projekty" }).getAttribute("href")).toBe("#projects");
    expect(screen.getByRole("link", { name: "QA i automatyzacja" }).getAttribute("href")).toBe(
      "#/automatyzacja-testowanie",
    );
    expect(screen.getByRole("link", { name: "ISTQB" }).getAttribute("href")).toBe("#/tester-istqb");
    expect(screen.getAllByRole("link", { name: "GameDev" })[0].getAttribute("href")).toBe(
      "#/gamedev",
    );
  });

  it("marks the active detail page link", () => {
    render(<LandingPage routeHash="#/tester-istqb" />);

    expect(screen.getByRole("link", { name: "ISTQB" }).getAttribute("aria-current")).toBe("page");
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
});
