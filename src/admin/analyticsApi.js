import { requireSupabase, siteId } from "../lib/supabaseClient";

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedReport = null;

export function clearAnalyticsReportCache() {
  cachedReport = null;
}

export async function fetchGa4Report({ forceRefresh = false } = {}) {
  const now = Date.now();

  if (!forceRefresh && cachedReport && now - cachedReport.createdAt < CACHE_TTL_MS) {
    return {
      ...cachedReport.data,
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

  cachedReport = {
    createdAt: now,
    data,
  };

  return {
    ...data,
    clientCache: {
      hit: false,
      ageSeconds: 0,
      ttlSeconds: Math.round(CACHE_TTL_MS / 1000),
    },
  };
}
