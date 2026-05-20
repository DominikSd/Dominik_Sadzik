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
  },
  topPages: [{ path: "/", pageViews: 50, users: 20 }],
  trackedEvents: [{ eventName: "cta_click", count: 7 }],
  trafficSources: [{ sourceMedium: "google / organic", sessions: 12, users: 10 }],
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
      await screen.findByText("Brakuje konfiguracji GA4 w sekretach Supabase Edge Function."),
    ).toBeTruthy();
  });

  it("shows empty data notice", async () => {
    mocks.report.mockResolvedValue({
      ...report,
      summary: { users7d: 0, users30d: 0, pageViews7d: 0, pageViews30d: 0 },
      topPages: [],
      trackedEvents: [],
      trafficSources: [],
      noData: true,
    });

    render(<AnalyticsPanel />);

    expect(await screen.findByText(/nie ma jeszcze danych/i)).toBeTruthy();
  });

  it("renders report data", async () => {
    mocks.report.mockResolvedValue(report);

    render(<AnalyticsPanel />);

    expect(await screen.findByText("Users 7 dni")).toBeTruthy();
    expect(screen.getByText("90")).toBeTruthy();
    expect(screen.getByText("/")).toBeTruthy();
    expect(screen.getByText("cta_click")).toBeTruthy();
    expect(screen.getByText("google / organic")).toBeTruthy();
  });
});
