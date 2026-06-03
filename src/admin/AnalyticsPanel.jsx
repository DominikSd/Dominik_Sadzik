import React, { useEffect, useState } from "react";
import { BarChart3, ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";
import { getAnalyticsConfig } from "../lib/analytics/ga4";
import { clearAnalyticsReportCache, fetchGa4Report } from "./analyticsApi";

function formatNumber(value) {
  return new Intl.NumberFormat("pl-PL").format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) return "Brak daty";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Brak daty";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function cleanPath(value) {
  const rawPath = String(value || "").trim();
  if (!rawPath || rawPath === "(not set)") return "";

  const withoutQuery = rawPath.split(/[?#]/)[0] || "/";
  const path = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return path.replace(/\/{2,}/g, "/");
}

function normalizePath(value) {
  const path = cleanPath(value);
  if (!path) return "";
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

function appRootPath() {
  return normalizePath(import.meta.env.BASE_URL || "/");
}

function toSentence(value) {
  const text = String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!text) return "";
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function formatPagePath(value) {
  const path = cleanPath(value);
  const normalizedPath = normalizePath(path);
  const normalizedRoot = appRootPath();

  if (!path) {
    return { label: "Nieznana strona", detail: "" };
  }

  if (normalizedPath === "/" || normalizedPath === normalizedRoot) {
    return { label: "Strona główna", detail: path };
  }

  const segment = normalizedPath.split("/").filter(Boolean).pop();
  return {
    label: toSentence(segment) || "Nieznana strona",
    detail: path,
  };
}

function formatEventName(value) {
  const eventName = String(value || "")
    .trim()
    .toLowerCase();
  const labels = {
    cta_click: "Kliknięcie przycisku",
    contact_click: "Kliknięcie kontaktu",
    form_submit: "Wysłanie formularza",
    page_view: "Wyświetlenie strony",
  };

  if (labels[eventName]) return labels[eventName];
  return eventName ? `Inna akcja: ${toSentence(eventName).toLowerCase()}` : "Inna akcja";
}

function formatTrafficSource(value) {
  const source = String(value || "")
    .trim()
    .toLowerCase();
  const labels = {
    "(direct) / (none)": "Wejście bezpośrednie",
    "(not set)": "Brak danych",
    "google / organic": "Google",
    "google / cpc": "Reklama Google",
    "facebook / referral": "Facebook",
    "l.facebook.com / referral": "Facebook",
    "instagram / referral": "Instagram",
    "l.instagram.com / referral": "Instagram",
    "github.com / referral": "GitHub",
  };

  if (labels[source]) return labels[source];
  return toSentence(source.replace(/\s+\/\s+/g, " z ")) || "Brak danych";
}

function deviceLabel(value) {
  const device = String(value || "")
    .trim()
    .toLowerCase();
  const labels = {
    desktop: "Komputer",
    mobile: "Telefon",
    tablet: "Tablet",
  };

  return labels[device] || "Inne urządzenie";
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="mt-2 text-3xl font-black text-white">{formatNumber(value)}</dd>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function renderColumnValue(column, row) {
  if (column.render) return column.render(row);
  const value = row[column.key];
  return column.format ? column.format(value, row) : value;
}

function DataTable({ title, description, emptyText, columns, rows }) {
  const safeRows = rows || [];
  const [primaryColumn, ...metricColumns] = columns;

  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-slate-950/45 p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
      {description && <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
      {safeRows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {safeRows.map((row, index) => (
            <div
              key={`${title}-${index}`}
              className="min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-200 sm:flex sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                {renderColumnValue(primaryColumn, row)}
              </div>
              <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:mt-0 sm:flex sm:flex-wrap sm:justify-end">
                {metricColumns.map((column) => (
                  <div
                    key={column.key}
                    className="min-w-0 rounded-md bg-slate-950/45 px-3 py-2 sm:min-w-[5.75rem]"
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {column.label}
                    </p>
                    <p className="mt-1 break-words font-black text-white [overflow-wrap:anywhere]">
                      {renderColumnValue(column, row)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Notice({ title, text, tone = "cyan" }) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300/30 bg-amber-500/10 text-amber-50"
      : "border-cyan-300/25 bg-cyan-500/10 text-cyan-50";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm leading-6">{text}</p>
    </div>
  );
}

function ErrorMessage({ error }) {
  const code = error?.code || "";
  const fallback = "Nie udało się pobrać statystyk. Spróbuj ponownie za chwilę.";
  const messages = {
    ga4_not_configured:
      "Statystyki GA4 nie są jeszcze skonfigurowane. Sprawdź sekrety Supabase Edge Function.",
    ga4_access_denied:
      "Konto serwisowe nie ma dostępu do tej usługi Google Analytics albo Google Analytics Data API nie jest włączone.",
    ga4_rate_limited: "Przekroczono limit Google Analytics Data API. Sprobuj pozniej.",
    google_auth_failed: "Nie udalo sie uwierzytelnic service account Google.",
    not_authenticated: "Zaloguj się ponownie, aby zobaczyć statystyki.",
    not_authorized: "Twoje konto nie ma dostepu do statystyk tej strony.",
    supabase_not_configured: "Publiczna konfiguracja Supabase dla frontendu jest niekompletna.",
    edge_function_unreachable:
      "Nie mozna polaczyc sie z Supabase Edge Function. Funkcja moze nie byc wdrozona, projekt Supabase moze byc nieosiagalny albo frontend moze wskazywac inny projekt.",
    edge_function_not_found:
      "Supabase nie znalazl funkcji ga4-report. Najczesciej oznacza to brak deployu funkcji w tym projekcie Supabase.",
    edge_function_forbidden:
      "Supabase odrzucil request do funkcji. Sprawdz sesje uzytkownika, JWT funkcji i uprawnienia site_members.",
    edge_function_runtime_error:
      "Funkcja ga4-report zwrocila blad serwera. Sprawdz logi funkcji w Supabase.",
    edge_supabase_not_configured:
      "Edge Function nie ma wymaganej konfiguracji Supabase. Sprawdz sekrety i zmienne funkcji w projekcie Supabase.",
  };

  return (
    <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-4 text-red-50">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 flex-none" />
        <div>
          <p className="font-bold">Nie mozna wyswietlic raportu</p>
          <p className="mt-1 text-sm leading-6">{messages[code] || fallback}</p>
          {(error?.endpoint || error?.status || error?.checks?.length > 0) && (
            <div className="mt-3 rounded-lg border border-red-200/20 bg-red-950/25 p-3 text-xs leading-5 text-red-50/90">
              {error?.endpoint && (
                <p className="break-all">
                  <span className="font-semibold">Endpoint:</span> {error.endpoint}
                </p>
              )}
              {error?.status && (
                <p>
                  <span className="font-semibold">HTTP status:</span> {error.status}
                </p>
              )}
              {error?.checks?.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {error.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const analytics = getAnalyticsConfig();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadReport({ forceRefresh = false } = {}) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGa4Report({ forceRefresh });
      setReport(data);
    } catch (reportError) {
      setError(reportError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  const refresh = () => {
    clearAnalyticsReportCache();
    loadReport({ forceRefresh: true });
  };

  const summary = report?.summary || {};

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-slate-950/55 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Google Analytics 4
            </p>
            <h3 className="mt-2 text-2xl font-black">
              {analytics.isConfigured ? "Raport GA4" : "GA4 nie jest skonfigurowane we frontendzie"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Dane ponizej sa pobierane przez Supabase Edge Function ga4-report. Sekrety Google
              zostaja po stronie backendu, a raport moze miec opoznienie wzgledem Google Analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              aria-label="Odśwież dane statystyk"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" /> {loading ? "Odświeżanie..." : "Odśwież dane"}
            </button>
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-black text-slate-950 hover:bg-cyan-300"
            >
              <ExternalLink className="h-4 w-4" /> Google Analytics
            </a>
          </div>
        </div>
        <dl className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Measurement ID</dt>
            <dd className="mt-1 font-mono text-sm text-white">
              {analytics.measurementId || "Brak VITE_GA_MEASUREMENT_ID"}
            </dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Zgoda w tej przegladarce</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {analytics.consent || "Nie wybrano"}
            </dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Cache raportu</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {report?.clientCache?.hit
                ? `UI cache, ${report.clientCache.ageSeconds}s`
                : report?.cache?.hit
                  ? `Edge cache, ${report.cache.ageSeconds}s`
                  : "Swieze dane"}
            </dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Wygenerowano</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {formatDateTime(report?.generatedAt)}
            </dd>
          </div>
        </dl>
      </div>

      {!analytics.isConfigured && (
        <Notice
          title="Tracking frontendu nie jest jeszcze skonfigurowany"
          text="Uzupelnij publiczne VITE_GA_MEASUREMENT_ID. Raport w panelu nadal wymaga sekretow Edge Function po stronie Supabase."
          tone="amber"
        />
      )}

      {error && <ErrorMessage error={error} />}

      {loading && !report && (
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-sm text-slate-300">
          Pobieranie statystyk z GA4...
        </div>
      )}

      {report?.noData && (
        <Notice
          title="Brak danych dla wybranego okresu"
          text="Brak danych dla wybranego okresu. GA4 moze potrzebowac czasu na zebranie statystyk."
          tone="amber"
        />
      )}

      {report && (
        <>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Ruch na stronie</h3>
                <p className="text-sm leading-6 text-slate-400">
                  Dane z ostatnich 7 i 30 dni. Sprawdź, ile osób odwiedza stronę i które elementy
                  przyciągają najwięcej uwagi.
                </p>
              </div>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Odwiedzający (7 dni)"
              value={summary.users7d}
              hint="Liczba osób odwiedzających stronę."
            />
            <MetricCard
              label="Odwiedzający (30 dni)"
              value={summary.users30d}
              hint="Liczba osób odwiedzających stronę."
            />
            <MetricCard
              label="Odsłony (7 dni)"
              value={summary.pageViews7d}
              hint="Ile razy wyświetlono strony."
            />
            <MetricCard
              label="Odsłony (30 dni)"
              value={summary.pageViews30d}
              hint="Ile razy wyświetlono strony."
            />
            <MetricCard
              label="Wizyty (7 dni)"
              value={summary.sessions7d}
              hint="Liczba sesji na stronie."
            />
            <MetricCard
              label="Wizyty (30 dni)"
              value={summary.sessions30d}
              hint="Liczba sesji na stronie."
            />
            <MetricCard
              label="Akcje (7 dni)"
              value={summary.eventCount7d}
              hint="Kliknięcia i inne mierzone działania."
            />
            <MetricCard
              label="Akcje (30 dni)"
              value={summary.eventCount30d}
              hint="Kliknięcia i inne mierzone działania."
            />
          </dl>

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <DataTable
              title="Najczęściej odwiedzane strony"
              description="Strony, które odwiedzano najczęściej w ostatnich 30 dniach."
              emptyText="Brak danych o odwiedzanych stronach dla tego okresu."
              rows={report.topPages || []}
              columns={[
                {
                  key: "path",
                  label: "Strona",
                  render: (row) => {
                    const page = formatPagePath(row.path);
                    return (
                      <div>
                        <p className="font-black text-white">{page.label}</p>
                        {page.detail && (
                          <p className="mt-1 text-xs text-slate-500">{page.detail}</p>
                        )}
                      </div>
                    );
                  },
                },
                { key: "pageViews", label: "Odsłony", format: formatNumber },
                { key: "users", label: "Odwiedzający", format: formatNumber },
              ]}
            />
            <DataTable
              title="Najczęstsze działania"
              description="Najczęściej klikane elementy i wysłane formularze."
              emptyText="Nie zarejestrowano jeszcze kliknięć ani wysłanych formularzy."
              rows={report.topEvents || report.trackedEvents || []}
              columns={[
                { key: "eventName", label: "Działanie", format: formatEventName },
                { key: "count", label: "Liczba", format: formatNumber },
              ]}
            />
            <DataTable
              title="Skąd trafiają odwiedzający"
              description="Najczęstsze źródła wejść na stronę."
              emptyText="Brak danych o źródłach ruchu."
              rows={report.trafficSources || []}
              columns={[
                { key: "sourceMedium", label: "Źródło", format: formatTrafficSource },
                { key: "sessions", label: "Wizyty", format: formatNumber },
                { key: "users", label: "Odwiedzający", format: formatNumber },
              ]}
            />
            <DataTable
              title="Z jakich urządzeń korzystają odwiedzający"
              description="Podział ruchu według typu urządzenia."
              emptyText="Brak danych o urządzeniach."
              rows={report.devices || []}
              columns={[
                { key: "deviceCategory", label: "Urządzenie", format: deviceLabel },
                { key: "users", label: "Odwiedzający", format: formatNumber },
                { key: "sessions", label: "Wizyty", format: formatNumber },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
