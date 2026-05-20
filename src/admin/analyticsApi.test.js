import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearAnalyticsReportCache, fetchGa4Report } from "./analyticsApi";

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
  },
  topPages: [],
  trackedEvents: [],
  trafficSources: [],
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
});
