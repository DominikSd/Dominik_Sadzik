import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AnalyticsPanel from "./AnalyticsPanel";

const mocks = vi.hoisted(() => ({
  report: vi.fn(),
  clearCache: vi.fn(),
  analyticsConfig: {
    measurementId: "G-TEST123",
    isConfigured: true,
    consent: "granted",
  },
}));

vi.mock("./analyticsApi", () => ({
  clearAnalyticsReportCache: mocks.clearCache,
  fetchGa4Report: mocks.report,
}));

vi.mock("../lib/analytics/ga4", () => ({
  getAnalyticsConfig: () => mocks.analyticsConfig,
}));

const report = {
  summary: {
    totalUsers7d: 12,
    totalUsers30d: 44,
    activeUsers7d: 10,
    activeUsers30d: 40,
    users7d: 10,
    users30d: 40,
    newUsers7d: 7,
    newUsers30d: 28,
    returningUsers7d: 5,
    returningUsers30d: 16,
    pageViews7d: 25,
    pageViews30d: 90,
    sessions7d: 8,
    sessions30d: 34,
    eventCount7d: 12,
    eventCount30d: 48,
  },
  generatedAt: "2026-06-02T10:00:00.000Z",
  topPages: [{ path: "/", pageViews: 50, users: 20 }],
  topEvents: [{ eventName: "cta_click", count: 7 }],
  trackedEvents: [{ eventName: "cta_click", count: 7 }],
  trafficSources: [{ sourceMedium: "google / organic", sessions: 12, users: 10 }],
  devices: [{ deviceCategory: "mobile", users: 9, sessions: 11 }],
  noData: false,
  cache: { hit: false, ageSeconds: 0 },
};

describe("AnalyticsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.analyticsConfig = {
      measurementId: "G-TEST123",
      isConfigured: true,
      consent: "granted",
    };
  });

  it("shows loading state", () => {
    mocks.report.mockReturnValue(new Promise(() => {}));

    render(<AnalyticsPanel />);

    expect(screen.getByText("Pobieranie statystyk z GA4...")).toBeTruthy();
  });

  it("shows missing frontend GA4 configuration", async () => {
    mocks.analyticsConfig = {
      measurementId: "",
      isConfigured: false,
      consent: null,
    };
    mocks.report.mockResolvedValue(report);

    render(<AnalyticsPanel />);

    expect(await screen.findByText("GA4 nie jest skonfigurowane we frontendzie")).toBeTruthy();
  });

  it("shows mapped Edge Function errors", async () => {
    const error = new Error("Missing GA4");
    error.code = "ga4_not_configured";
    mocks.report.mockRejectedValue(error);

    render(<AnalyticsPanel />);

    expect(
      await screen.findByText(
        "Statystyki GA4 nie są jeszcze skonfigurowane. Sprawdź sekrety Supabase Edge Function.",
      ),
    ).toBeTruthy();
  });

  it("shows diagnostics for unreachable Edge Function", async () => {
    const error = new Error("Failed to send a request to the Edge Function");
    error.code = "edge_function_unreachable";
    error.endpoint = "https://example-ref.supabase.co/functions/v1/ga4-report";
    error.checks = [
      "Sprawdz, czy funkcja ga4-report zostala wdrozona w tym samym projekcie Supabase.",
    ];
    mocks.report.mockRejectedValue(error);

    render(<AnalyticsPanel />);

    expect(
      await screen.findByText(/Nie mozna polaczyc sie z Supabase Edge Function/i),
    ).toBeTruthy();
    expect(
      screen.getByText("https://example-ref.supabase.co/functions/v1/ga4-report"),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Sprawdz, czy funkcja ga4-report zostala wdrozona w tym samym projekcie Supabase.",
      ),
    ).toBeTruthy();
  });

  it("shows empty data notice", async () => {
    mocks.report.mockResolvedValue({
      ...report,
      summary: {
        totalUsers7d: 0,
        totalUsers30d: 0,
        activeUsers7d: 0,
        activeUsers30d: 0,
        users7d: 0,
        users30d: 0,
        newUsers7d: 0,
        newUsers30d: 0,
        returningUsers7d: 0,
        returningUsers30d: 0,
        pageViews7d: 0,
        pageViews30d: 0,
        sessions7d: 0,
        sessions30d: 0,
        eventCount7d: 0,
        eventCount30d: 0,
      },
      topPages: [],
      topEvents: [],
      trafficSources: [],
      devices: [],
      noData: true,
    });

    render(<AnalyticsPanel />);

    expect(await screen.findByText(/GA4 moze potrzebowac czasu/i)).toBeTruthy();
  });

  it("renders report data with customer-friendly labels", async () => {
    mocks.report.mockResolvedValue(report);

    const { container } = render(<AnalyticsPanel />);

    expect(await screen.findByText("Ruch na stronie")).toBeTruthy();
    expect(screen.getByText("Unikalni odwiedzający (7 dni)")).toBeTruthy();
    expect(screen.getByText("Unikalni odwiedzający (30 dni)")).toBeTruthy();
    expect(screen.getByText("Aktywni odwiedzający (7 dni)")).toBeTruthy();
    expect(screen.getByText("Nowi odwiedzający (30 dni)")).toBeTruthy();
    expect(screen.getByText("Powracający odwiedzający (30 dni)")).toBeTruthy();
    expect(screen.getAllByText("Osoby, które pierwszy raz odwiedziły stronę.")).toHaveLength(2);
    expect(screen.getAllByText(/Szacunkowo: unikalni odwiedzający minus nowi/i)).toHaveLength(2);
    expect(screen.getByText("Wizyty (30 dni)")).toBeTruthy();
    expect(screen.getByText("Akcje (30 dni)")).toBeTruthy();
    expect(screen.getByText("90")).toBeTruthy();
    expect(screen.getByText("44")).toBeTruthy();
    expect(screen.getByText("28")).toBeTruthy();
    expect(screen.getByText("16")).toBeTruthy();
    expect(screen.getByText("Strona główna")).toBeTruthy();
    expect(screen.getByText("Kliknięcie przycisku")).toBeTruthy();
    expect(screen.getByText("Google")).toBeTruthy();
    expect(screen.getByText("Telefon")).toBeTruthy();
    expect(screen.queryByText("cta_click")).toBeNull();
    expect(screen.queryByText("google / organic")).toBeNull();
    expect(screen.queryByText("Mobile")).toBeNull();
    expect(container.querySelector("table")).toBeNull();
  });

  it("maps common traffic sources, device names and empty states", async () => {
    mocks.report.mockResolvedValue({
      ...report,
      topPages: [],
      topEvents: [{ eventName: "custom_event_name", count: 3 }],
      trafficSources: [
        { sourceMedium: "(direct) / (none)", sessions: 5, users: 4 },
        { sourceMedium: "(not set)", sessions: 2, users: 1 },
      ],
      devices: [{ deviceCategory: "desktop", users: 6, sessions: 7 }],
    });

    render(<AnalyticsPanel />);

    expect(
      await screen.findByText("Brak danych o odwiedzanych stronach dla tego okresu."),
    ).toBeTruthy();
    expect(screen.getByText("Inna akcja: custom event name")).toBeTruthy();
    expect(screen.getByText("Wejście bezpośrednie")).toBeTruthy();
    expect(screen.getByText("Brak danych")).toBeTruthy();
    expect(screen.getByText("Komputer")).toBeTruthy();
  });
});
