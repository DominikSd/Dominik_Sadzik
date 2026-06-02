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
    users7d: 10,
    users30d: 40,
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
        "Statystyki GA4 nie sa jeszcze skonfigurowane. Uzupelnij sekrety Edge Function i sprawdz Property ID GA4.",
      ),
    ).toBeTruthy();
  });

  it("shows empty data notice", async () => {
    mocks.report.mockResolvedValue({
      ...report,
      summary: {
        users7d: 0,
        users30d: 0,
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

  it("renders report data", async () => {
    mocks.report.mockResolvedValue(report);

    render(<AnalyticsPanel />);

    expect(await screen.findByText("Aktywni uzytkownicy 7 dni")).toBeTruthy();
    expect(screen.getByText("Sesje 30 dni")).toBeTruthy();
    expect(screen.getByText("Eventy 30 dni")).toBeTruthy();
    expect(screen.getByText("90")).toBeTruthy();
    expect(screen.getByText("/")).toBeTruthy();
    expect(screen.getByText("cta_click")).toBeTruthy();
    expect(screen.getByText("google / organic")).toBeTruthy();
    expect(screen.getByText("Mobile")).toBeTruthy();
  });
});
