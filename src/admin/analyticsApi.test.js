import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAnalyticsReportCache,
  fetchGa4Report,
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

const report = {
  summary: {
    users7d: 1,
    users30d: 2,
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

    expect(normalized.summary.users7d).toBe(4);
    expect(normalized.summary.sessions30d).toBe(0);
    expect(normalized.topEvents).toEqual([{ eventName: "cta_click", count: 3 }]);
    expect(normalized.noData).toBe(false);
  });
});
