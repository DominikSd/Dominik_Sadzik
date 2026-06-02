import { requireSupabase, siteId } from "../lib/supabaseClient";
import { z } from "zod";

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedReport = null;

const numberLikeSchema = z.coerce.number().catch(0);

const cacheInfoSchema = z
  .object({
    hit: z.boolean().optional().default(false),
    ageSeconds: numberLikeSchema.optional().default(0),
    ttlSeconds: numberLikeSchema.optional().default(Math.round(CACHE_TTL_MS / 1000)),
    throttled: z.boolean().optional().default(false),
  })
  .optional()
  .default({});

const analyticsReportSchema = z
  .object({
    generatedAt: z.string().optional().default(""),
    dateRanges: z
      .object({
        sevenDays: z
          .object({
            startDate: z.string().optional().default("7daysAgo"),
            endDate: z.string().optional().default("today"),
          })
          .optional()
          .default({}),
        thirtyDays: z
          .object({
            startDate: z.string().optional().default("30daysAgo"),
            endDate: z.string().optional().default("today"),
          })
          .optional()
          .default({}),
      })
      .optional()
      .default({}),
    summary: z
      .object({
        users7d: numberLikeSchema.optional().default(0),
        users30d: numberLikeSchema.optional().default(0),
        pageViews7d: numberLikeSchema.optional().default(0),
        pageViews30d: numberLikeSchema.optional().default(0),
        sessions7d: numberLikeSchema.optional().default(0),
        sessions30d: numberLikeSchema.optional().default(0),
        eventCount7d: numberLikeSchema.optional().default(0),
        eventCount30d: numberLikeSchema.optional().default(0),
      })
      .optional()
      .default({}),
    topPages: z
      .array(
        z.object({
          path: z.string().optional().default("/"),
          pageViews: numberLikeSchema.optional().default(0),
          users: numberLikeSchema.optional().default(0),
        }),
      )
      .optional()
      .default([]),
    topEvents: z
      .array(
        z.object({
          eventName: z.string().optional().default("unknown_event"),
          count: numberLikeSchema.optional().default(0),
        }),
      )
      .optional()
      .default([]),
    trackedEvents: z
      .array(
        z.object({
          eventName: z.string().optional().default("unknown_event"),
          count: numberLikeSchema.optional().default(0),
        }),
      )
      .optional()
      .default([]),
    trafficSources: z
      .array(
        z.object({
          sourceMedium: z.string().optional().default("(direct) / (none)"),
          sessions: numberLikeSchema.optional().default(0),
          users: numberLikeSchema.optional().default(0),
        }),
      )
      .optional()
      .default([]),
    devices: z
      .array(
        z.object({
          deviceCategory: z.string().optional().default("unknown"),
          users: numberLikeSchema.optional().default(0),
          sessions: numberLikeSchema.optional().default(0),
        }),
      )
      .optional()
      .default([]),
    noData: z.boolean().optional().default(false),
    cache: cacheInfoSchema,
  })
  .passthrough();

export function normalizeAnalyticsReport(candidate) {
  const parsed = analyticsReportSchema.parse(candidate || {});
  const topEvents = parsed.topEvents.length > 0 ? parsed.topEvents : parsed.trackedEvents;

  return {
    ...parsed,
    topEvents,
    trackedEvents: topEvents,
    noData:
      parsed.noData ||
      (parsed.summary.users30d === 0 &&
        parsed.summary.pageViews30d === 0 &&
        parsed.summary.sessions30d === 0 &&
        parsed.summary.eventCount30d === 0 &&
        parsed.topPages.length === 0 &&
        topEvents.length === 0 &&
        parsed.trafficSources.length === 0 &&
        parsed.devices.length === 0),
  };
}

export function clearAnalyticsReportCache() {
  cachedReport = null;
}

export async function fetchGa4Report({ forceRefresh = false } = {}) {
  const now = Date.now();

  if (!forceRefresh && cachedReport && now - cachedReport.createdAt < CACHE_TTL_MS) {
    return {
      ...normalizeAnalyticsReport(cachedReport.data),
      clientCache: {
        hit: true,
        ageSeconds: Math.round((now - cachedReport.createdAt) / 1000),
        ttlSeconds: Math.round(CACHE_TTL_MS / 1000),
      },
    };
  }

  const client = requireSupabase();
  const { data: sessionData, error: sessionError } = await client.auth.getSession();

  if (sessionError || !sessionData.session) {
    const authError = new Error("Wymagana jest aktywna sesja Supabase.");
    authError.code = "not_authenticated";
    throw authError;
  }

  const { data, error } = await client.functions.invoke("ga4-report", {
    body: {
      site_id: siteId,
      force_refresh: forceRefresh,
    },
  });

  if (error) {
    const functionError = new Error(error.message || "Nie udalo sie pobrac statystyk GA4.");
    functionError.code = error.code || "edge_function_error";
    throw functionError;
  }

  if (data?.error) {
    const reportError = new Error(data.error.message || "Nie udalo sie pobrac statystyk GA4.");
    reportError.code = data.error.code;
    throw reportError;
  }

  const normalizedData = normalizeAnalyticsReport(data);

  cachedReport = {
    createdAt: now,
    data: normalizedData,
  };

  return {
    ...normalizedData,
    clientCache: {
      hit: false,
      ageSeconds: 0,
      ttlSeconds: Math.round(CACHE_TTL_MS / 1000),
    },
  };
}
