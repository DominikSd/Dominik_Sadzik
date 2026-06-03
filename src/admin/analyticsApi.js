import { requireSupabase, siteId } from "../lib/supabaseClient";
import { publicEnv } from "../lib/env";
import { z } from "zod";

const CACHE_TTL_MS = 10 * 60 * 1000;
const GA4_FUNCTION_NAME = "ga4-report";
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

export function getGa4FunctionEndpoint(env = publicEnv) {
  const supabaseUrl = String(env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
  if (!supabaseUrl) return "";
  return `${supabaseUrl}/functions/v1/${GA4_FUNCTION_NAME}`;
}

function analyticsError(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  return error;
}

function getInvokeStatus(error) {
  return error?.context?.status || error?.status || error?.response?.status || null;
}

function getInvokeName(error) {
  return error?.name || error?.constructor?.name || "";
}

function classifyFunctionInvokeError(error) {
  const message = error?.message || "Nie udalo sie pobrac statystyk GA4.";
  const status = getInvokeStatus(error);
  const name = getInvokeName(error);
  const endpoint = getGa4FunctionEndpoint();
  const baseDetails = {
    endpoint,
    status,
    originalMessage: message,
  };

  if (
    name === "FunctionsFetchError" ||
    /failed to send a request|fetch failed|networkerror|load failed/i.test(message)
  ) {
    return analyticsError(
      "edge_function_unreachable",
      "Nie mozna polaczyc sie z Supabase Edge Function ga4-report.",
      {
        ...baseDetails,
        checks: [
          "Sprawdz, czy funkcja ga4-report zostala wdrozona w tym samym projekcie Supabase.",
          "Sprawdz, czy VITE_SUPABASE_URL wskazuje na wlasciwy projekt.",
          "Sprawdz, czy projekt Supabase nie jest wstrzymany i czy request nie jest blokowany w przegladarce.",
        ],
      },
    );
  }

  if (status === 404) {
    return analyticsError(
      "edge_function_not_found",
      "Supabase nie znalazl Edge Function ga4-report w tym projekcie.",
      {
        ...baseDetails,
        checks: [
          "Wdroz funkcje poleceniem: supabase functions deploy ga4-report.",
          "Sprawdz, czy frontend uzywa tego samego projektu Supabase, w ktorym wdrozono funkcje.",
        ],
      },
    );
  }

  if (status === 401 || status === 403) {
    return analyticsError(
      "edge_function_forbidden",
      "Supabase odrzucil request do Edge Function.",
      {
        ...baseDetails,
        checks: [
          "Sprawdz aktywna sesje uzytkownika.",
          "Sprawdz konfiguracje JWT Edge Function i uprawnienia site_members.",
        ],
      },
    );
  }

  if (status && status >= 500) {
    return analyticsError(
      "edge_function_runtime_error",
      "Edge Function ga4-report zwrocila blad serwera.",
      {
        ...baseDetails,
        checks: [
          "Sprawdz logi funkcji w Supabase.",
          "Sprawdz sekrety Edge Function i dostep service account do GA4.",
        ],
      },
    );
  }

  return analyticsError(error?.code || "edge_function_error", message, baseDetails);
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

  let client;
  try {
    client = requireSupabase();
  } catch (error) {
    throw analyticsError("supabase_not_configured", error.message, {
      checks: [
        "Ustaw publiczne zmienne VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY i VITE_SITE_ID.",
        "Po zmianie zmiennych przebuduj i wdroz frontend.",
      ],
    });
  }

  const { data: sessionData, error: sessionError } = await client.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw analyticsError("not_authenticated", "Wymagana jest aktywna sesja Supabase.", {
      checks: ["Zaloguj sie ponownie do panelu CMS."],
    });
  }

  const { data, error } = await client.functions.invoke("ga4-report", {
    body: {
      site_id: siteId,
      force_refresh: forceRefresh,
    },
  });

  if (error) {
    throw classifyFunctionInvokeError(error);
  }

  if (data?.error) {
    throw analyticsError(
      data.error.code,
      data.error.message || "Nie udalo sie pobrac statystyk GA4.",
      {
        endpoint: getGa4FunctionEndpoint(),
      },
    );
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
