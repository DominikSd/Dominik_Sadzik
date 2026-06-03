import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type CacheEntry = {
  createdAt: number;
  data: Record<string, unknown>;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const FORCE_REFRESH_MIN_AGE_MS = 60 * 1000;
const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const REPORT_BASE_URL = "https://analyticsdata.googleapis.com/v1beta";
const cache = new Map<string, CacheEntry>();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function errorResponse(code: string, message: string, status = 400) {
  return jsonResponse({ error: { code, message } }, status);
}

function getPublishableKey() {
  const publishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (publishableKeys) {
    const parsed = JSON.parse(publishableKeys);
    if (parsed.default) return parsed.default;
  }

  return Deno.env.get("SUPABASE_ANON_KEY") || "";
}

function base64Url(input: string | ArrayBuffer) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);

  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Json(value: string) {
  const decoded = atob(value);
  return JSON.parse(decoded);
}

function getGoogleCredentials() {
  const propertyId = Deno.env.get("GA4_PROPERTY_ID");
  const serviceAccountBase64 = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64");

  let clientEmail = Deno.env.get("GOOGLE_CLIENT_EMAIL");
  let privateKey = Deno.env.get("GOOGLE_PRIVATE_KEY");

  if (serviceAccountBase64) {
    const parsed = decodeBase64Json(serviceAccountBase64);
    clientEmail = parsed.client_email;
    privateKey = parsed.private_key;
  }

  if (!propertyId || !clientEmail || !privateKey) {
    throw new Error("missing_ga4_configuration");
  }

  return {
    propertyId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

async function signJwt(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const payload = {
    iss: clientEmail,
    scope: GA4_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const pem = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(pem), (char) => char.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    der.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedToken),
  );

  return `${unsignedToken}.${base64Url(signature)}`;
}

async function getGoogleAccessToken(clientEmail: string, privateKey: string) {
  const assertion = await signJwt(clientEmail, privateKey);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`google_auth_failed:${response.status}:${details}`);
  }

  const token = await response.json();
  if (!token.access_token) throw new Error("google_auth_failed:no_access_token");
  return token.access_token as string;
}

async function runReport(accessToken: string, propertyId: string, body: Record<string, unknown>) {
  const response = await fetch(`${REPORT_BASE_URL}/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`ga4_report_failed:${response.status}:${details}`);
  }

  return await response.json();
}

function metric(row: Record<string, unknown>, index: number) {
  const metricValues = row.metricValues as Array<{ value?: string }> | undefined;
  return Number(metricValues?.[index]?.value || 0);
}

function dimension(row: Record<string, unknown>, index: number) {
  const dimensionValues = row.dimensionValues as Array<{ value?: string }> | undefined;
  return dimensionValues?.[index]?.value || "";
}

function summaryFromReport(report: Record<string, unknown>) {
  const row = (report.rows as Record<string, unknown>[] | undefined)?.[0];
  return {
    users: row ? metric(row, 0) : 0,
    pageViews: row ? metric(row, 1) : 0,
    sessions: row ? metric(row, 2) : 0,
    eventCount: row ? metric(row, 3) : 0,
  };
}

function rows(report: Record<string, unknown>) {
  return (report.rows as Record<string, unknown>[] | undefined) || [];
}

async function buildReport(propertyId: string, accessToken: string) {
  const [summary7d, summary30d, pages, events, traffic, devices] = await Promise.all([
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "eventCount" },
      ],
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "eventCount" },
      ],
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 8,
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: {
            values: ["cta_click", "contact_click", "form_submit"],
          },
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 10,
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 8,
    }),
  ]);

  const sevenDays = summaryFromReport(summary7d);
  const thirtyDays = summaryFromReport(summary30d);

  return {
    generatedAt: new Date().toISOString(),
    dateRanges: {
      sevenDays: { startDate: "7daysAgo", endDate: "today" },
      thirtyDays: { startDate: "30daysAgo", endDate: "today" },
    },
    summary: {
      users7d: sevenDays.users,
      users30d: thirtyDays.users,
      pageViews7d: sevenDays.pageViews,
      pageViews30d: thirtyDays.pageViews,
      sessions7d: sevenDays.sessions,
      sessions30d: thirtyDays.sessions,
      eventCount7d: sevenDays.eventCount,
      eventCount30d: thirtyDays.eventCount,
    },
    topPages: rows(pages).map((row) => ({
      path: dimension(row, 0),
      pageViews: metric(row, 0),
      users: metric(row, 1),
    })),
    topEvents: rows(events).map((row) => ({
      eventName: dimension(row, 0),
      count: metric(row, 0),
    })),
    trafficSources: rows(traffic).map((row) => ({
      sourceMedium: dimension(row, 0),
      sessions: metric(row, 0),
      users: metric(row, 1),
    })),
    devices: rows(devices).map((row) => ({
      deviceCategory: dimension(row, 0),
      users: metric(row, 0),
      sessions: metric(row, 1),
    })),
  };
}

async function authorizeRequest(req: Request, siteId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = getPublishableKey();

  if (!supabaseUrl || !publishableKey) {
    throw new Error("missing_supabase_configuration");
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return {
      error: errorResponse("not_authenticated", "Wymagana jest aktywna sesja Supabase.", 401),
    };
  }

  const client = createClient(supabaseUrl, publishableKey, {
    global: {
      headers: { Authorization: authHeader },
    },
  });

  const { data: userResult, error: userError } = await client.auth.getUser();
  if (userError || !userResult.user) {
    return {
      error: errorResponse(
        "not_authenticated",
        "Sesja Supabase jest nieprawidlowa albo wygasla.",
        401,
      ),
    };
  }

  const { data: membership, error: membershipError } = await client
    .from("site_members")
    .select("role")
    .eq("site_id", siteId)
    .eq("user_id", userResult.user.id)
    .eq("active", true)
    .maybeSingle();

  if (membershipError) {
    return {
      error: errorResponse(
        "membership_check_failed",
        "Nie udalo sie sprawdzic uprawnien uzytkownika.",
        403,
      ),
    };
  }

  const allowedRoles = ["owner", "editor", "viewer"];
  if (!membership || !allowedRoles.includes(membership.role)) {
    return {
      error: errorResponse("not_authorized", "Brak uprawnien do statystyk tej strony.", 403),
    };
  }

  return {
    user: userResult.user,
    role: membership.role,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Uzyj metody POST.", 405);
  }

  let payload: { site_id?: string; force_refresh?: boolean };
  try {
    payload = await req.json();
  } catch {
    return errorResponse("invalid_json", "Nieprawidlowy JSON requestu.", 400);
  }

  if (!payload.site_id) {
    return errorResponse("site_id_required", "Brakuje site_id.", 400);
  }

  let auth;
  try {
    auth = await authorizeRequest(req, payload.site_id);
  } catch {
    return errorResponse(
      "edge_supabase_not_configured",
      "Brakuje konfiguracji Supabase w Edge Function.",
      503,
    );
  }
  if ("error" in auth) return auth.error;

  let credentials;
  try {
    credentials = getGoogleCredentials();
  } catch {
    return errorResponse(
      "ga4_not_configured",
      "Brakuje konfiguracji GA4 w sekretach Edge Function.",
      503,
    );
  }

  const cacheKey = `${payload.site_id}:${credentials.propertyId}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached) {
    const age = now - cached.createdAt;
    const shouldUseCache =
      age < CACHE_TTL_MS || (payload.force_refresh && age < FORCE_REFRESH_MIN_AGE_MS);
    if (shouldUseCache) {
      return jsonResponse({
        ...cached.data,
        cache: {
          hit: true,
          ageSeconds: Math.round(age / 1000),
          ttlSeconds: Math.round(CACHE_TTL_MS / 1000),
          throttled: Boolean(payload.force_refresh && age < FORCE_REFRESH_MIN_AGE_MS),
        },
      });
    }
  }

  try {
    const accessToken = await getGoogleAccessToken(credentials.clientEmail, credentials.privateKey);
    const report = await buildReport(credentials.propertyId, accessToken);
    const data = {
      ...report,
      role: auth.role,
      noData:
        report.summary.users30d === 0 &&
        report.summary.pageViews30d === 0 &&
        report.topPages.length === 0 &&
        report.topEvents.length === 0,
      cache: {
        hit: false,
        ageSeconds: 0,
        ttlSeconds: Math.round(CACHE_TTL_MS / 1000),
      },
    };

    cache.set(cacheKey, { createdAt: now, data });
    return jsonResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("ga4_report_failed:403")) {
      return errorResponse(
        "ga4_access_denied",
        "Service account nie ma dostepu do GA4 property.",
        403,
      );
    }
    if (message.includes("ga4_report_failed:429")) {
      return errorResponse(
        "ga4_rate_limited",
        "Przekroczono limit Google Analytics Data API.",
        429,
      );
    }
    if (message.includes("google_auth_failed")) {
      return errorResponse(
        "google_auth_failed",
        "Nie udalo sie uwierzytelnic service account Google.",
        502,
      );
    }
    return errorResponse("ga4_report_failed", "Nie udalo sie pobrac statystyk GA4.", 502);
  }
});
