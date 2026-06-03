import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAnalyticsReportCache,
  fetchGa4Report,
  getGa4FunctionEndpoint,
  normalizeAnalyticsReport,
} from "./analyticsApi";

const mocks = vi.hoisted(() => ({
  client: {
    auth: {
      getSession: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock("../lib/supabaseClient", () => ({
  requireSupabase: () => mocks.client,
  siteId: "site-1",
}));

vi.mock("../lib/env", () => ({
  publicEnv: {
    VITE_SUPABASE_URL: "https://example-ref.supabase.co",
  },
}));

const report = {
  summary: {
    totalUsers7d: 1,
    totalUsers30d: 2,
    activeUsers7d: 1,
    activeUsers30d: 2,
    users7d: 1,
    users30d: 2,
    newUsers7d: 1,
    newUsers30d: 1,
    returningUsers7d: 0,
    returningUsers30d: 1,
    pageViews7d: 3,
    pageViews30d: 4,
    sessions7d: 5,
    sessions30d: 6,
    eventCount7d: 7,
    eventCount30d: 8,
  },
  topPages: [],
  topEvents: [],
  trafficSources: [],
  devices: [],
};

describe("analyticsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAnalyticsReportCache();
    mocks.client.auth.getSession.mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    });
  });

  it("rejects requests without Supabase session", async () => {
    mocks.client.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(fetchGa4Report()).rejects.toMatchObject({
      code: "not_authenticated",
    });
    expect(mocks.client.functions.invoke).not.toHaveBeenCalled();
  });

  it("maps Edge Function response errors", async () => {
    mocks.client.functions.invoke.mockResolvedValue({
      data: {
        error: {
          code: "ga4_not_configured",
          message: "Missing GA4 configuration",
        },
      },
      error: null,
    });

    await expect(fetchGa4Report()).rejects.toMatchObject({
      code: "ga4_not_configured",
      message: "Missing GA4 configuration",
    });
  });

  it("maps Supabase function invocation errors", async () => {
    mocks.client.functions.invoke.mockResolvedValue({
      data: null,
      error: {
        code: "functions_error",
        message: "Edge function failed",
      },
    });

    await expect(fetchGa4Report()).rejects.toMatchObject({
      code: "functions_error",
      message: "Edge function failed",
    });
  });

  it("maps unreachable Edge Function fetch errors with diagnostics", async () => {
    const error = new Error("Failed to send a request to the Edge Function");
    error.name = "FunctionsFetchError";
    mocks.client.functions.invoke.mockResolvedValue({
      data: null,
      error,
    });

    await expect(fetchGa4Report()).rejects.toMatchObject({
      code: "edge_function_unreachable",
      endpoint: "https://example-ref.supabase.co/functions/v1/ga4-report",
      checks: expect.arrayContaining([
        "Sprawdz, czy funkcja ga4-report zostala wdrozona w tym samym projekcie Supabase.",
      ]),
    });
  });

  it("returns the expected Supabase Functions endpoint", () => {
    expect(getGa4FunctionEndpoint()).toBe(
      "https://example-ref.supabase.co/functions/v1/ga4-report",
    );
  });

  it("caches successful reports on the client", async () => {
    mocks.client.functions.invoke.mockResolvedValue({
      data: report,
      error: null,
    });

    const first = await fetchGa4Report();
    const second = await fetchGa4Report();

    expect(first.clientCache.hit).toBe(false);
    expect(second.clientCache.hit).toBe(true);
    expect(mocks.client.functions.invoke).toHaveBeenCalledTimes(1);
  });

  it("normalizes report shape and keeps compatibility with trackedEvents", () => {
    const normalized = normalizeAnalyticsReport({
      summary: {
        users7d: "4",
        users30d: "10",
        pageViews7d: "20",
        pageViews30d: "40",
      },
      trackedEvents: [{ eventName: "cta_click", count: "3" }],
    });

    expect(normalized.summary.totalUsers7d).toBe(4);
    expect(normalized.summary.activeUsers7d).toBe(4);
    expect(normalized.summary.users7d).toBe(4);
    expect(normalized.summary.sessions30d).toBe(0);
    expect(normalized.topEvents).toEqual([{ eventName: "cta_click", count: 3 }]);
    expect(normalized.noData).toBe(false);
  });

  it("normalizes expanded GA4 user metrics and estimates returning users", () => {
    const normalized = normalizeAnalyticsReport({
      summary: {
        totalUsers7d: "12",
        totalUsers30d: "40",
        activeUsers7d: "10",
        activeUsers30d: "34",
        newUsers7d: "8",
        newUsers30d: "22",
        pageViews30d: "50",
      },
    });

    expect(normalized.summary.totalUsers7d).toBe(12);
    expect(normalized.summary.activeUsers30d).toBe(34);
    expect(normalized.summary.users30d).toBe(34);
    expect(normalized.summary.newUsers30d).toBe(22);
    expect(normalized.summary.returningUsers7d).toBe(4);
    expect(normalized.summary.returningUsers30d).toBe(18);
    expect(normalized.noData).toBe(false);
  });
});
